package org.kaznalnrprograms.Accounting.PeriodEdit.Dao;

import org.kaznalnrprograms.Accounting.PeriodEdit.Interfaces.IPeriodEditDao;
import org.kaznalnrprograms.Accounting.PeriodEdit.Models.PeriodLockModel;
import org.kaznalnrprograms.Accounting.PeriodParams.Models.PeriodParamsModel;
import org.kaznalnrprograms.Accounting.PeriodEdit.Models.ImgLockFlagDelAll;
import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.stereotype.Repository;

import org.sql2o.Connection;

import java.sql.Date;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class PeriodEditDirectoryDaoImpl implements IPeriodEditDao {
    private String appName = "PeriodEdit - модуль для работы с периодическими реквизитами";
    private DBUtils db;

    public PeriodEditDirectoryDaoImpl(DBUtils db){
        this.db = db;
    }

    /***
     * Получение периодических реквизитов
     * @param SesId
     * @param PeriodParamId
     * @return
     */
    @Override
    public List<PeriodLockModel> getList(String SesId, int PeriodParamId, int RecId, int ObjectId, String PeriodParamData) throws Exception {

        try(Connection con = db.getConnection(appName)) {

            if(SesId==null || SesId.trim().isEmpty()) throw new Exception ("Параметр SesId не заполнен");
            if(PeriodParamId==0) throw new Exception ("Параметр PeriodParamId не заполнен");
            if(ObjectId==0) throw new Exception ("Параметр ObjectId не заполнен");
            if(PeriodParamData==null || PeriodParamData.trim().isEmpty()) PeriodParamData="-1";

            //Промежуточная модель
            List<PeriodLockModel> prLckMdls;

            if(this.CheckPrdLck(SesId, PeriodParamId)==0) {
                Map<String, Object> params = new HashMap<>();

                params.put("PeriodParamId", PeriodParamId);
                params.put("RecId", RecId);

                String sql = "SELECT prp.reffertable" +
                        " FROM periodvalues pdv" +
                        " JOIN periodparams prp ON pdv.paramid = prp.id" +
                        " WHERE pdv.ownerid=:RecId AND pdv.paramid=:PeriodParamId";

                List<String> RefferTable = db.Query(con, sql, String.class, params);

                if (RefferTable.size() == 0) {
                    RefferTable.add("");
                }

                Map<String, Object> params2 = new HashMap<>();
                params2.put("ReffTbl", RefferTable.get(0));

                params.put("PeriodParamId", PeriodParamId);
                sql = "SELECT CASE WHEN GetObject_Id(:ReffTbl) IS NOT NULL THEN 1 ELSE 0 END AS flag";
                List<String> flag = db.Query(con, sql, String.class, params2);

                sql = "select id from users where code=(select getusername())";
                List<String> UserId = db.Query(con, sql, String.class, null);

                params.put("SesId", SesId);
                params.put("ObjectId", ObjectId);
                params.put("PeriodParamData", PeriodParamData);


                if (flag.get(0).equals("0")) {
                    sql = "SELECT" +
                            "-1 Id, "+
                            " pv.id \"RecId\"," +
                            " to_char( pv.date, 'DD-MM-YYYY HH24:MI:SS') \"fdate\"," +
                            " pv.val, " +
                            " '' \"Name\", " +
                            " :SesId \"SesId\", " +
                            " :ObjectId \"ObjectId\", " +
                            " 0 \"FlagChange\", " +
                            " 0 \"FlagDel\", " +
                            UserId.get(0) + "\"UserId\", " +
                            " null \"ImgLockId\", " +
                            " :PeriodParamId \"PeriodParamId\", " +
                            " pv.creator," +
                            " pv.created," +
                            " pv.changer," +
                            " pv.changed," +
                            " chk_img(pv.id, :ObjectId, :PeriodParamId) flagPreImg "+
                            " FROM periodvalues pv" +
                            " JOIN periodparams pp ON pv.paramid = pp.id" +
                            " WHERE ((CAST( :PeriodParamData AS DATE) >= CAST( pv.date AS DATE ) AND :PeriodParamData <>'-1') OR ( :PeriodParamData ='-1' AND CURRENT_DATE >= CAST( pv.date AS DATE ))) AND pv.ownerid = :RecId AND pv.paramid = :PeriodParamId" +
                            " ORDER by date desc";
                } else {
                    sql = "SELECT" +
                            "-1 Id, "+
                            " pv.id \"RecId\", " +
                            " to_char(pv.date, 'DD-MM-YYYY HH24:MI:SS') \"fdate\", " +
                            " pv.val, " +
                            " t.name, " +
                            " :SesId \"SesId\", " +
                            " :ObjectId \"ObjectId\", " +
                            " 0 \"FlagChange\", " +
                            " 0 \"FlagDel\", " +
                            UserId.get(0) + " \"UserId\", " +
                            " null \"ImgLockId\", " +
                            " :PeriodParamId \"PeriodParamId\", " +
                            " pv.creator, " +
                            " pv.created, " +
                            " pv.changer, " +
                            " pv.changed,  " +
                            " chk_img( pv.id, :ObjectId, :PeriodParamId) flagPreImg "+
                            " FROM " + RefferTable.get(0) + "\"t\"" +
                            " JOIN (" +
                            "SELECT" +
                            " id, " +
                            " CAST(val AS integer) val," +
                            " date, " +
                            " paramid, " +
                            " ownerid, " +
                            " creator, " +
                            " created, " +
                            " changer, " +
                            " changed  " +
                            " FROM periodvalues" +
                            " WHERE ( (CAST( :PeriodParamData AS DATE) >= CAST( date AS DATE ) AND :PeriodParamData<>'-1') OR ( :PeriodParamData = '-1' AND CURRENT_DATE >= CAST( date AS DATE ) ) ) AND ParamId = :PeriodParamId AND ownerid = :RecId" +
                            ") pv ON t.id = pv.val" +
                            " order by date desc";
                }
                prLckMdls  = db.Query(con, sql, PeriodLockModel.class, params);
            }
            else{
                Map<String, Object> params = new HashMap<>();
                params.put("SesId", SesId);
                params.put("PeriodParamId", PeriodParamId);
                params.put("PeriodParamData", PeriodParamData);
                String sql = "SELECT id, sesid, objectid, recid,"+" to_char(date, 'DD-MM-YYYY HH24:MI:SS')"+" fdate, val, name, flagdel, flagchange, userid, imglockid, creator, created, changer, changed, periodparamid, CASE WHEN imglockid>0 THEN true ELSE (CASE WHEN recid=-1 THEN false ELSE chk_img(recid, objectid, :PeriodParamId) END) END as flagPreImg FROM periodlock WHERE ((CAST( :PeriodParamData AS DATE) >= CAST( date AS DATE ) AND :PeriodParamData<>'-1' ) OR ( :PeriodParamData='-1' AND CURRENT_DATE >= CAST( date AS DATE ) ) ) AND SesId = CAST(:SesId as uuid) and periodparamid = :PeriodParamId ORDER BY date DESC";
                prLckMdls =  db.Query(con, sql, PeriodLockModel.class, params);
            }
            //Учитываем то что для пер. рек. которые непривязанны к справочнику (текстовые) val <=> name меняються местами
            for (PeriodLockModel p : prLckMdls){
                if (p.getName().equals("")){
                    p.setName(p.getVal());
                    p.setVal("");
                }
            }

            return prLckMdls;

        }catch (Exception ex){
            throw ex;
        }
    }

    @Override
    public void deleteImgLock (String SesId, int ObjectId, int PeriodParamId) throws Exception{
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("sesid", SesId);
            params.put("ObjectId", ObjectId);
            params.put("PeriodParamId", PeriodParamId);

            String sql = "SELECT COUNT(*) as cnt FROM imglock WHERE sesid = CAST( :sesid AS uuid ) AND ObjectId = :ObjectId AND PeriodParamId = :PeriodParamId";
            int count = db.Query(con, sql, Integer.class, params).get(0);
            if(count>0){
                sql = "DELETE FROM imglock WHERE sesid = CAST( :sesid AS uuid ) AND ObjectId = :ObjectId AND PeriodParamId = :PeriodParamId";
                db.Execute(con, sql, params);
                //return false;
            }
            //return true;
        }catch (Exception ex){
            throw ex;
        }
    }

    /**
     * Проверка наличия записей во временной таблице PeriodLock
     * @param SesId идентификатор сессии
     * @param PeriodParamId идентификатор пер. реквизита
     * @return
     * @throws Exception
     */
    @Override
    public int CheckPrdLck(String SesId, int PeriodParamId) throws Exception{
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("SesId", SesId);
            params.put("PeriodParamId", PeriodParamId);
            String sql = "select count(*) as cnt from periodlock where sesid = cast(:SesId as uuid) and periodparamid = :PeriodParamId";
            return db.Query(con, sql, Integer.class, params).get(0);
         }catch (Exception ex){
             throw ex;
         }
    }

    @Override
    public List<String> save(List <PeriodLockModel> model) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            List<String>  id = new ArrayList<>();
            Map<String, Object> params = new HashMap<>();
            String sql;

            //если нет SesId выходим
            if(model.get(0).getSesId()==null || model.get(0).getSesId().isEmpty()) return id;
            String sid = model.get(0).getSesId();

            for(PeriodLockModel mdl : model){
                if(mdl.getId() == -1 && mdl.getRecId()==-1 &&  mdl.getFlagDel()==1) continue;
                params.put("SesId", mdl.getSesId());
                params.put("ObjectId", mdl.getObjectId());
                params.put("RecId", mdl.getRecId());
                params.put("Date", mdl.getFdate());

                params.put("UserId", mdl.getUserId());
                params.put("PeriodParamId", mdl.getPeriodParamId());
                params.put("ImgLockId", mdl.getImgLockId());
                params.put("FlagDel", mdl.getFlagDel());


                //Учитываем то что для пер. рек. которые непривязанны к справочнику (текстовые) val <=> name меняються местами
                  if(mdl.getVal().equals("")){
                      mdl.setVal(mdl.getName());
                      mdl.setName("");
                  }

                if( mdl.getId() == -1){
                    if( mdl.getVal().equals("-1")) { params.put("Val", mdl.getName()); params.put("Name", ""); }
                    else { params.put( "Val" , mdl.getVal());  params.put( "Name" , mdl.getName()); }

                    if(mdl.getRecId()==-1) params.put("FlagChange", mdl.getFlagChange());
                    else params.put("FlagChange", 1);

                    sql = "INSERT into periodlock (sesid, objectid, recid, date, val, name, userid, periodparamid, imglockid, flagdel, flagchange) "+
                    " values (CAST(:SesId as uuid), :ObjectId, :RecId, CAST(:Date as timestamp without time zone), :Val ,:Name, :UserId, :PeriodParamId, CASE WHEN :ImgLockId = 0 THEN NULL ELSE :ImgLockId END, :FlagDel, :FlagChange) RETURNING id";
                   id.add(db.Execute(con,sql,String.class,params));
                   //db.Execute(con,sql,String.class,params);
                }
                else{
                    if( mdl.getVal().equals("")) { params.put("Val", mdl.getName()); params.put("Name", ""); }
                    else { params.put( "Val" , mdl.getVal());  params.put( "Name" , mdl.getName()); }

                    if(mdl.getRecId()==-1) params.put("FlagChange", 0);
                    else params.put("FlagChange", mdl.getFlagChange());

                    params.put("id", mdl.getId());
                    sql = "UPDATE periodlock set sesid = CAST(:SesId as uuid), ObjectId = :ObjectId, recid =  :RecId, date = CAST(:Date as timestamp without time zone), val = :Val, flagchange = :FlagChange, flagdel = :FlagDel, userid = :UserId, name = :Name, periodparamid = :PeriodParamId, imglockid = CASE WHEN :ImgLockId = 0 THEN NULL ELSE :ImgLockId END WHERE id = :id";
                   id.add(db.Execute(con,sql,String.class,params));
                   //db.Execute(con,sql,String.class,params);
                }
                params.clear();
            }
            params.put("sid", sid);
            params.put("PeriodParamId", model.get(0).getPeriodParamId());
            String thId = String.join(", ", id);

            sql = "SELECT t.id FROM  periodlock t WHERE  t.PeriodParamId = :PeriodParamId AND sesid = CAST(:sid as uuid) and t.date = (SELECT MAX(date) FROM periodlock WHERE flagdel =0 AND id IN ("+thId+"))";
            //sql = "SELECT t.id FROM (SELECT id, MAX(date) FROM periodlock WHERE sesid = CAST(:sid as uuid) GROUP BY periodlock.id ORDER BY date DESC LIMIT 1) t";
            return db.Query(con, sql, String.class, params);
        }catch (Exception ex){
            throw ex;
        }

    }

    /**
     * Получить данные о периодическом реквизите
     * @param PrdPrmId  равен ид. из таблицы periodparams
     * @return
     * @throws Exception
     */
    @Override
    public PeriodParamsModel getPeriodParam(String PrdPrmId) throws Exception{
        try(Connection con = db.getConnection(appName)){

            String sql = "select TaskCode, ParamCode, Strict, Name, RefferModul from periodparams where id = CAST ( :PrdPrmId AS integer )";
            Map<String, Object> params = new HashMap<>();
            params.put("PrdPrmId", PrdPrmId);

            List<PeriodParamsModel> pr = db.Query(con, sql, PeriodParamsModel.class, params);

            if(pr.size()==0){
                PeriodParamsModel prPrMd = new PeriodParamsModel();
                prPrMd.setId(-1);
                return prPrMd;
            }else {
                return pr.get(0);
            }

        }catch (Exception ex){
            throw ex;
        }
    }

    @Override
    public String getData(String Tbl, String Id) throws Exception{
        try(Connection con = db.getConnection(appName)) {
            //PeriodParamId==Tbl
            int prdPrmId = Integer.parseInt(Tbl);

            if(prdPrmId<1) return "";

            Map<String, Object> params = new HashMap<>();
            params.put("Tbl", prdPrmId);

            String sql = "SELECT reffertable FROM periodparams WHERE Id = :Tbl";
            List<String> reffertable= db.Query(con, sql, String.class, params);

            if(reffertable.size()==0) return "";
            else{
                params.remove("Tbl");
                params.put("Tbl", reffertable.get(0));
            }

            //Проверим есть ли таблица Tbl, так как нельзя параметризировать имя таблицы
            sql = "SELECT CASE WHEN GetObject_Id(:Tbl) IS NOT NULL THEN 1 ELSE 0 END AS flag";
            List<Integer> flg = db.Query(con, sql, Integer.class, params);
            if (flg.get(0) == 1)
            {
                sql = "SELECT name FROM " + reffertable.get(0) + " WHERE Id = CAST( :Id as integer)";
                params.remove("Tbl");
                params.put("Id", Id);

            List<String> s = db.Query(con, sql, String.class, params);
            return s.get(0);
            }
            return "";

        }
        catch (Exception ex){
            throw ex;
        }
    }

    /**
     * Получить Id пользователя
     * @return
     * @throws Exception
     */
    @Override
    public String getUserId() throws Exception{
        try(Connection con = db.getConnection(appName)){

            String sql = "select id from users where code=(select getusername())";

            List<String> UserId = db.Query(con, sql, String.class, null);

            return UserId.get(0);

        }catch (Exception ex){
            throw ex;
        }
    }


    /**
     * Получить значение flagDel из таблицы imgLock
     * @param imgLockId
     * @return
     * @throws Exception
     */
    @Override
    public String getImgLockFlagDel(int imgLockId) throws Exception {
        try (Connection con = db.getConnection(appName)){
            List<String> rows = db.Query(con, "SELECT flagDel FROM imgLock WHERE id="+imgLockId, String.class, null);
            return rows.get(0);
        }catch (Exception ex){
            throw ex;
        }
    }

    /**
     * Получить значение flagdel из табл. ImgLock
     * @return
     * @throws Exception
     */
    @Override
    public List<ImgLockFlagDelAll> getImgLockFlDlAll(String sesid) throws Exception {
        try (Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            params.put("sesid",sesid);
            String sql = "SELECT id, flagdel FROM imglock WHERE sesid=CAST(:sesid as uuid)";
            return db.Query(con, sql, ImgLockFlagDelAll.class, params);
        }
        catch (Exception ex){
            throw ex;
        }
    }

    /**
     * Проверка окрыт ли выбранный день
     * @return
     * @throws Exception
     */
    @Override
    public boolean OpenDayCheck(String chckDay) throws Exception {
        try (Connection con = db.getConnection(appName)) {

            String sql = " select count(*) as cnt from todayusers tu \n" +
                            " join users u on u.id = tu.userid \n" +
                            " join today t on t.id = tu.todayid \n" +
                            " where u.code = (select getusername()) and tu.del = 0 and t.Date = CAST( :chckDay as timestamp without time zone) and t.OpenMode = 1 ";

            Map<String, Object> params = new HashMap<>();
            params.put("chckDay", chckDay);

            if (db.Query(con, sql, Integer.class, params).get(0)>0) return true;

            String[] data = chckDay.split(" ");
            params.put("chckDay", data[0]);
            sql = "select count(*) as cnt from today where Date = CAST( :chckDay as timestamp without time zone) and OpenMode = 1";

            if(db.Query(con, sql, Integer.class, params).get(0)>0) return true;

            return false;
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Удаление периодического реквизита
     * @param id - табл. PeriodLock
     * @return
     * @throws Exception
     */
    @Override
    public String delete(String id) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            params.put("Id", id);
            String sql = "SELECT COUNT(*) as cnt FROM periodlock WHERE Id = :id";
            if(db.Query(con, sql, Integer.class, params).get(0)>0){
                sql = "DELETE FROM periodlock WHERE Id = :id";
                db.Execute(con, sql, params);
                return "";
            }
            return "1";
        }
        catch (Exception ex){
            throw ex;
        }
    }
}
