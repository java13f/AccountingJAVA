package org.kaznalnrprograms.Accounting.reffers.Dao;

import org.kaznalnrprograms.Accounting.Core.UserSysDaoImpl;
import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.kaznalnrprograms.Accounting.reffers.Interfaces.IReffersDao;
import org.kaznalnrprograms.Accounting.reffers.Models.*;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class reffersDao implements IReffersDao {
    private String appName = "Reffers - работа со справочниками";
    private DBUtils db;

    public reffersDao(DBUtils db) {
        this.db = db;
    }

    /**
     * Данныые для комбобокса "Справочники"
     */
    public List<ReffersAll> getReffersAll() throws Exception {
        try (Connection con = db.getConnection(appName)) {
            //Map<String, Object> params = new HashMap<>();
            String sql = "select id, paramcode||' = '||name as name, codeLen, isCodeDigit from refferparams where del=0 order by paramCode";
            List<ReffersAll> r = db.Query(con, sql, ReffersAll.class, null);
            return r;
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Данные для грида Справочник
     *
     * @param paramId - id в refferParams
     * @param showDel - показ удаленных записей
     */
    @Override
    public dataTable getReffers(int paramId, boolean showDel, int page, int rows) throws Exception {
        try (Connection con = db.getConnection(appName)) {

            GetActRightByRefferParamId("View", paramId, con, db);   // Права на просмотр

            String sql = "select count(*) cnt from reffers  where paramid=" + paramId + " and del=" + (showDel ? "del" : "0") ;
            int total = db.Query(con, sql, Integer.class, null).get(0);

            int offset= (page-1)*rows;   //  R-dj строк, которое нужно пропустить
            //Map<String, Object> params = new HashMap<>();
            sql = "select id, code, name, del from reffers where paramid=" + paramId + " and del=" + (showDel ? "del" : "0") + " order by Code offset "+offset+" limit "+rows;
            List<Reffers> r = db.Query(con, sql, Reffers.class, null);
            dataTable dt = new dataTable();
            dt.setTotal(total);
            List<Object> array_rows = new ArrayList<>();
            for(Reffers rr : r){
                array_rows.add(rr);
            }
            dt.setRows(array_rows);
            return dt;
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получает список доп. реквизитов пустой (id=-1) или со значениями (id != -1)
     *
     * @param refferCode - код справочника
     * @param id         - Id записи, которой принадлежат реквизиты
     * @rekvId id конкретного реквизита, -1 - все доп реквизиты
     */
    public List<ReffersParams> getReffersParams(String refferCode, int id, int paramId, String sesId) throws Exception {
        Connection con = db.getConnectionWithTran(appName);
        try {

            GetActRightByRefferParamId("View", paramId, con, db);   // Права на просмотр

//            List<String> rows =db.Query(con, "select uuid_generate_v4()::text id", String.class, null);
//            String guid= rows.get(0);


            Map<String, Object> params = new HashMap<>();
            params.put("refferCode", refferCode);
            params.put("guid", sesId);             // "3e6ef1bf-10c2-4fcc-9240-9a0c23c296a2"
//            Вставка изображений в ImgLock
//            String sql = "insert into imglock (objectId, recId, flagDel, flagChange,  img, userId, SesId, listParamId)\n" +
//                    "select getobject_id('listvalues') objectId, COALESCE(iv.id,-1) recId, 0 flagDel, 0 flagChange,  iv.img, u.id userId, cast(:guid as uuid) SesId, lp.Id listParamId  \n" +
//                    "from listparams lp\n" +
//                    " join refferParams rp on lower(lp.refferCode)=lower(rp.paramcode) \n" +
//                    " join listValues lv on lv.paramid=lp.id and lv.ownerId="+id+" \n" +
//                    " join imgvalues iv on iv.objectId=getobject_id('listvalues') and iv.RecId=lv.id\n" +
//                    " join users u on lower(u.code)=lower(getusername())\n" +
//                    " where taskcode='reffers' \n" +
//                    "  and lower(refferCode)=lower(:refferCode);\n";
//            db.Execute(con, sql, params);

//           Получает список доп. реквизитов пустой (id=-1) или со значениями (id != -1)
            String sql = "select COALESCE(lv.id,-1) as id, lp.name, lv.val, COALESCE(lp.reffertable,'') as refferTable, lp.codeJs, lp.refferEditCode, lp.strict, lp.paramCode, COALESCE(il.id,-1) RecId, COALESCE(iv.id,-1) imgFlag\n" +
                    "from listparams lp\n" +
                    " join refferParams rp on lower(lp.refferCode)=lower(rp.paramcode) \n" +
                    " left join listValues lv on lv.paramid=lp.id and lv.ownerId=" + id + "\n" +
                    " left join imglock il on il.sesId::text=:guid and il.listParamId=lp.id" + "\n" +
                    " left join imgValues iv on COALESCE(lv.id,null)=iv.recId and getObject_Id('listvalues')=iv.objectId\n" +
                    " where taskcode='reffers' \n" +
                    "  and lower(refferCode)=lower(:refferCode)\n" +
                    "\n" +
                    " order by nom\n";
            List<ReffersParams> r = db.Query(con, sql, ReffersParams.class, params);
            con.commit();
            return r;
        } catch (Exception ex) {
            con.rollback();
            throw ex;
        }
    }

    /**
     * Возвращает расшифровку id по справочнику refferTable в виде строки  id = значение
     */
    public String getOneParam(String refferTable, int id, int ownerId, int paramId) throws Exception {
        if (id == -1) return "";

        try (Connection con = db.getConnection(appName)) {

            GetActRightByRefferParamId("View", paramId, con, db);   // Права на просмотр

//            Map<String, Object> params = new HashMap<>();
//            params.put("refferRefferCode", refferCode);

            String sql = "select Name from " + refferTable + " where id=" + id;
            List<String> r = db.Query(con, sql, String.class, null);
            String s = r.size() == 0 ? "" : r.get(0);
            s = id + " = " + s;
            return s;
        } catch (Exception ex) {
            throw ex;
        }

    }

    /**
     * Сохраняет model, возвращает id сохраненной записи
     */
    public int save(reffersSave model) throws Exception {
        // Проверим
        Map<String, Object> params = new HashMap<>();
        if (model.getCode().length() > 0) {
            try (Connection con = db.getConnection(appName)) {   // Проверки в БД

                GetActRightByRefferParamId("Change", model.getParamId(), con, db);   // Права на изменение

                params.clear();
                params.put("code", model.getCode());

                String sql = "select code from reffers where paramId=" + model.getParamId() + " and code=:code and id<>" + model.getId();
                List<String> r = db.Query(con, sql, String.class, params);
                if (r.size() > 0) {
                    throw new Exception("<br><br><br><b>Уже существует запись с кодом " + model.getCode() + "</b><br><br>");
                }
            } catch (Exception ex) {
                throw ex;
            }
        }

        // Проверки пройдены, сохраняем
        try (Connection con = db.getConnectionWithTran(appName)) {
            // Вставка новой записи
            if (model.getId() == -1) {
                params.clear();
                params.put("code", model.getCode());
                params.put("name", model.getName());
                params.put("paramId", model.getParamId());
                // Если поле код не является обязательны в него вставляется id записи, переведенное в двоичную систему с заменой 0 на пробел и 1 на chr(155)
                // это нужно для уникальности
                String sql = "INSERT INTO reffers (paramId, code, name, del) select :paramId, " +
                        "case when length(coalesce(:code,''))=0 " +
                        "then replace(replace(  cast((max(id)+1::int)::bit(32) as character VARYING(32))  ,'0',' '), '1', chr(155)) " +
                        "else :code end as code, :name, 0  from reffers";
                int id = db.Execute(con, sql, Integer.class, params);
                model.setId(id);
                for (int i = 0; i < model.getRows().size(); i++) {
                    row curRow = model.getRows().get(i);
                    if (curRow.getVal() == null || curRow.getVal().length() == 0) continue;
                    params.clear();
                    params.put("code", curRow.getParamCode());
                    params.put("ownerId", id);
                    params.put("val", curRow.getVal());
                    sql = "INSERT INTO listValues (paramId, ownerId, val) select id, :ownerId, :val from listParams where paramCode=:code";
                    db.Execute(con, sql, Integer.class, params);
                }
            }

            // Сорхранение существующей записи
            else {
                db.CheckLock(con, model.getId(), "reffers");

                params.clear();
                params.put("id", model.getId());
                params.put("code", model.getCode());
                params.put("name", model.getName());

                String sql = "update reffers set code=:code, name=:name where id=:id";
                db.Execute(con, sql, Integer.class, params);
                int id = model.getId();
                for (int i = 0; i < model.getRows().size(); i++) {  // вставка новых записей (ownerId=-1)
                    row curRow = model.getRows().get(i);
                    if (curRow.getId() != -1) continue;
                    if (curRow.getVal() == null || curRow.getVal().length() == 0) continue;
                    params.clear();
                    params.put("code", curRow.getParamCode());
                    params.put("ownerId", id);
                    params.put("val", curRow.getVal());
                    sql = "INSERT INTO listValues (paramId, ownerId, val) select id, :ownerId, :val from listParams where paramCode=:code";
                    db.Execute(con, sql, Integer.class, params);
                }
                for (int i = 0; i < model.getRows().size(); i++) {  // Удаляем записи с пустым val
                    row curRow = model.getRows().get(i);
                    if (curRow.getId() == -1) continue;    // пропускаем новые записи
                    if (curRow.getVal() != null)
                        if (curRow.getVal().length() != 0) continue;    // Пропускаем записи с заполненным значением

                    sql = "delete from listValues where id=" + curRow.getId();
                    db.Execute(con, sql, Integer.class, null);
                }

                for (int i = 0; i < model.getRows().size(); i++) {  // Обновляем существующие записи
                    row curRow = model.getRows().get(i);
                    if (curRow.getId() == -1) continue;                                     // пропускаем новые записи
                    if (curRow.getVal() == null || curRow.getVal().length() == 0)
                        continue;    // Пропускаем записи с пустым значением
                    params.clear();
                    params.put("code", curRow.getParamCode());
                    params.put("ownerId", curRow.getOwnerId());
                    params.put("val", curRow.getVal());
                    sql = "update listValues set paramId=(select id from listparams where paramCode=:code), ownerId=:ownerId, val=:val where id=" + curRow.getId();
                    db.Execute(con, sql, Integer.class, params);
                }

            }

            // Сохранение изображений
            params.clear();
            params.put("sesId", model.getSesId());
            //'3be08323-a6b5-421b-9e1f-32ace085d15b'
            String sql = "insert into imgValues (ObjectId, RecId, Img) " +                             // Вставка новых изображений
                    "select GetObject_Id('listValues') ObjectId,    lv.id RecId,    il.Img\n" +
                    " from imglock il \n" +
                    " join listValues lv on il.ListParamId=lv.ParamId \n" +
                    " join listParams lp on lp.Id=lv.ParamId and lp.id=il.ListParamId and taskcode='reffers' and lp.del=0\n" +
                    " join refferParams rp on lp.reffercode=rp.ParamCode and rp.del=0 and rp.id=" + model.getParamId() + " \n" +
                    " where 1=1 \n" +
                    "   and lv.ownerId=" + model.getId() + " \n" +
                    "   and il.SesId::text=:sesId \n" +
                    "   and il.flagchange=0 and il.flagdel=0    --  новые\n";
            db.Execute(con, sql, Integer.class, params);

            sql = "update imgValues iv  \n" +                                                         //  Обновление существующих
                    "  set objectid=d.ObjectId, RecId=d.ListValueId, Img=d.Img\n" +
                    "  from (\n" +
                    "        select il.Recid, GetObject_Id('listValues') ObjectId, lv.id ListValueId, il.Img\n" +
                    "        from imglock il \n" +
                    "        join listValues lv on il.ListParamId=lv.ParamId\n" +
                    "        join listParams lp on lp.Id=lv.ParamId and lp.id=il.ListParamId and taskcode='reffers' and lp.del=0 \n" +
                    "        join refferParams rp on lp.reffercode=rp.ParamCode and rp.del=0 and rp.id=" + model.getParamId() + " \n" +
                    "        where 1=1\n" +
                    "        and lv.ownerId=" + model.getId() + "\n" +
                    "        and il.SesId::text=:sesId\n" +
                    "        and il.flagchange=1 and il.flagdel=0   -- измененные\n" +
                    "       ) d \n " +
                    "  where iv.objectid = d.objectId and iv.recId=d.RecId   \n ";
            db.Execute(con, sql, Integer.class, params);

            sql = "DELETE FROM imgValues \n" +                                                               //  Удаление удаленных
                    "USING (" +
                    "       select il.ObjectId, il.RecId \n" +
                    "       from imglock il \n" +
                    "       join listValues lv on il.ListParamId=lv.ParamId\n" +
                    "       join listParams lp on lp.Id=lv.ParamId and lp.id=il.ListParamId and taskcode='reffers' and lp.del=0 \n" +
                    "       join refferParams rp on lp.reffercode=rp.ParamCode and rp.del=0 and rp.id=" + model.getParamId() + " \n" +
                    "       where 1=1\n" +
                    "       and lv.ownerId=" + model.getId() + " \n" +
                    "       and il.SesId::text=:sesId\n" +
                    "       and il.RecId<>-1 and il.flagdel=1   --  удаленные \n" +
                    "      ) d \n" +
                    " WHERE imgValues.objectid = d.objectId and imgValues.recId=d.RecId";
            db.Execute(con, sql, Integer.class, params);
    /*
--insert into imgValues
select il.RecId imgValueId, GetObject_Id('listValues') ObjectId, lv.id RecId, il.Img, il.FlagDel, il.flagchange
from imglock il
join listValues lv on il.ListParamId=lv.ParamId
join listParams lp on lp.Id=lv.ParamId and lp.id=il.ListParamId and taskcode='reffers'
join refferParams rp on lp.reffercode=rp.ParamCode and rp.id=24
where 1=1
and lv.ownerId=66
--and il.SesId='3be08323-a6b5-421b-9e1f-32ace085d15b'
    */
            con.commit();
            return model.getId();
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Возвращает одну запись reffers без доп реков
     *
     * @param id
     * @return
     * @throws Exception
     */
    public oneReffer getOneReffer(int id) throws Exception {
        try (Connection con = db.getConnection(appName)) {

            GetActRightByRefferId("View", id, con, db);   // Права на просмотр

            String sql = "select id, code, name, creator, created, changer, changed  from reffers where id=" + id;
            oneReffer r = db.Query(con, sql, oneReffer.class, null).get(0);
            return r;
        } catch (Exception ex) {
            throw ex;
        }

    }

    /**
     * Удаление записи
     */
    public void delete(int id) throws Exception {
        try (Connection con = db.getConnection(appName)) {   // Проверки в БД

            GetActRightByRefferId("Change", id, con, db);   // Права на изменение

            String sql = "update reffers set del= 1 - del  where id=" + id;
            db.Execute(con, sql, null);

        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Возвращает данный для работы с изображением SesId, ObjectId, ListParamId
     * id-id в таблице ListValues, recId-id и таблице ImgLock
     */
    public imgParams getImgParams(String paramCode, int refferParamId, String sesId, int id, int recId) throws Exception {
        // Проверить права
        // select uuid_generate_v4() as SesId, GetObject_Id('listvalues') ObjectId, id ListParamId from ListParams where paramCode='addr'
        try (Connection con = db.getConnection(appName)) {   // Проверки в БД

            Map<String, Object> params = new HashMap<>();
            params.put("code", paramCode);
            params.put("sesId", sesId);

            String sql = "select :sesId sesId, GetObject_Id('listvalues') ObjectId, lp.id ListParamId, " + (id == 0 ? -1 : id) + " RecId \n" +
                    "from ListParams lp \n" +
                    "where paramCode=:code\n";

            List<imgParams> r = db.Query(con, sql, imgParams.class, params);
            if (r.size() == 0) {
                throw new Exception("Не найдедо ни одной записи в таблице ListParams для paramCode='" + paramCode + "'");
            }
            GetActRightByRefferParamId("View", refferParamId, con, db);   // Права на изменение
            return r.get(0);

        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Проверяет права rightType=Change/View. Право имеет вид Reffers.refferCode.Change/Reffers.refferCode.Change
     * по id записи из справочника reffers в текущем соединении Connection con и DBUtuls db
     */
    public void GetActRightByRefferId(String rightType, int id, Connection con, DBUtils db) throws Exception {
        List<String> rows = db.Query(con, "select paramCode from refferParams p join reffers r on r.paramId = p.id where r.id=" + id, String.class, null);
        if (rows.size() == 0) {
            throw new Exception("<br><br><br>Не найден refferParams.paramCode для записи с reffers.id=" + id + "<br>");
        }
        String refferCode = rows.get(0);
        String r = new UserSysDaoImpl(db).GetActRights("Reffers.dll", "Reffers." + refferCode + "." + rightType);
        if (r.length() > 0)
            throw new Exception(r);
        return;
    }

    /**
     * Проверяет права rightType=Change/View на справочник refferParams.id=paramId
     * по id записи из справочника в текущем соединении Connection con и DBUtuls db
     */
    public void GetActRightByRefferParamId(String rightType, int paramId, Connection con, DBUtils db) throws Exception {
        List<String> rows = db.Query(con, "select paramCode from refferParams  where id=" + paramId, String.class, null);
        if (rows.size() == 0) {
            throw new Exception("<br><br><br>Не найден refferParams.paramCode для записи с refferParams.id=" + paramId + "<br>");
        }
        String refferCode = rows.get(0);
        String r = new UserSysDaoImpl(db).GetActRights("Reffers.dll", "Reffers." + refferCode + "." + rightType);
        if (r.length() > 0)
            throw new Exception("<br><br><br>" + r + "<br>");
        return;
    }

    /**
     * Удаление сессии из ImgLock
     */
    public void delImgLock(String sesId) throws Exception {
        try (Connection con = db.getConnection(appName)) {   // Проверки в БД
            Map<String, Object> params = new HashMap<>();
            params.put("sesId", sesId);

            String sql = "delete from ImgLock where sesId::text=:sesId";
            db.Execute(con, sql, params);

        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получить уникальный номер сессии sesId
     */
    public String getSesId() throws Exception {
        try (Connection con = db.getConnection(appName)) {   // Проверки в БД
            List<String> rows = db.Query(con, "select uuid_generate_v4()::text id", String.class, null);
            String guid = rows.get(0);
            return guid;
        } catch (Exception ex) {
            throw ex;
        }
    }


    /**
     * получение флаг imgLock.delFlag
     */
    public String getImgLockDel(int imgLockId) throws Exception {
        try (Connection con = db.getConnection(appName)) {   // Проверки в БД
            List<String> rows = db.Query(con, "select flagDel from imgLock where id="+imgLockId , String.class, null);
            String r = rows.get(0);
            return r;
        } catch (Exception ex) {
            throw ex;
        }
    }
}