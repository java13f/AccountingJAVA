package org.kaznalnrprograms.Accounting.InvGrps.Dao;

import org.kaznalnrprograms.Accounting.InvGrps.Interfaces.IInvGrpsDao;
import org.kaznalnrprograms.Accounting.InvGrps.Models.*;
import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class InvGrpsDaoImpl implements IInvGrpsDao {
    private String appName = "InvGrps - Счета по группам инвентарного учета";
    private DBUtils db;

    public InvGrpsDaoImpl(DBUtils db) {
        this.db = db;
    }

    /**
     * Получить список групп инв-го учета
     */
    @Override
    public List<InvGrpsAccViewModel> getGroupAccsList(boolean showDel, int invGrpsId) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            params.put("invGrpsId", invGrpsId);

            String sql = "select iga.id, a.name, a.code, a.tag, iga.del, iga.perc::decimal as perc " +
                         "from inv_grp_accs iga " +
                        "join accs a on a.id = iga.acc_id " +
                        "where 1=1 and iga.inv_grp_id = :invGrpsId";
            if(!showDel){
                sql+=" AND iga.del = 0 order by cast(iga.id as int)";
            }
            return db.Query(con, sql, InvGrpsAccViewModel.class, params);
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Получить список счетов по группам
     */
    @Override
    public List<InvGrpsViewModel> getGroupsList(boolean showDel) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            String sql = "select cast(id as varchar(18)) as id, 'id = '||id||case when del=1 then ' '||name||' (УДАЛЕН)' else ' '||name||'' end as name, code, del " +
                    "from inv_grps " +
                    "where 1=1";
            if(!showDel){
                sql+=" AND del = 0";
            }
            sql += " order by cast(id as int)";
            return db.Query(con, sql, InvGrpsViewModel.class, params);
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Получить группу по id
     */
    @Override
    public InvGrpsModel getGroupById(int id) throws Exception {
        try(Connection con = db.getConnection(appName)){
            //'id = '||id||case when del=1 then ' '||name||' (УДАЛЕН)' else ' '||name||'' end as name
            String sql = "select id, name, code, del, changed, changer, created, creator from inv_grps WHERE id = " + id;
            List<InvGrpsModel> result = db.Query(con, sql, InvGrpsModel.class, null);
            if(result.size() == 0){
                throw new Exception("Не удалось получить группу с Id = " + id);
            }
            return result.get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Получить счет по id
     */
    @Override
    public InvGrpsAccModel getGroupAccById(int id) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "select iga.id, iga.acc_id as accId, iga.inv_grp_id as invGrpId, a.name, a.code, iga.perc::decimal as perc, a.tag, iga.del, iga.changed, iga.changer, iga.created, iga.creator " +
                    "from inv_grp_accs iga " +
                    "join accs a on a.id = iga.acc_id " +
                    "where 1=1 and iga.id="+id;
            List<InvGrpsAccModel> result = db.Query(con, sql, InvGrpsAccModel.class, null);
            if(result.size() == 0){
                throw new Exception("Не удалось получить группу с Id = " + id);
            }
            return result.get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Получить счет по коду и тэгу
     */
    @Override
    public InvGrpsAccModel getGroupAccByCodeAndTag(String code, String tag) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("code", code);
            params.put("tag", tag);

            String sql = "select id, code, name, tag, del from accs where code=:code and tag=:tag";
            List<InvGrpsAccModel> result = db.Query(con, sql, InvGrpsAccModel.class, params);
            if(result.size() == 0){
                throw new Exception("Не удалось получить группу");
            }
            return result.get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Удалить группу
     */
    @Override
    public void delGroup(int id) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "UPDATE inv_grps SET del = 1 - Del WHERE id = " + id;
            db.Execute(con, sql, null);
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Удалить счет
     */
    @Override
    public void delAcc(int id) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "UPDATE inv_grp_accs SET del = 1 - Del WHERE id = " + id;
            db.Execute(con, sql, null);
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Сохранить счет
     */
    @Override
    public int saveGroupAcc(InvGrpsAccModel model) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "";
            Map<String, Object> params = new HashMap<>();
            params.put("accId", model.getAccId());
            params.put("invGrpId", model.getInvGrpId());
            params.put("perc", new BigDecimal(model.getPerc()));

            if(model.getId() == -1){
                sql = "INSERT INTO inv_grp_accs (acc_id, inv_grp_id, perc, del)"
                        +" VALUES(:accId, :invGrpId, :perc, 0)";
                model.setId(db.Execute(con, sql, Integer.class, params));
            }
            else {
                db.CheckLock(con, model.getId(), "inv_grp_accs");
                sql = "UPDATE inv_grp_accs SET acc_id = :accId, inv_grp_id = :invGrpId, perc = :perc WHERE id = " + model.getId();
                db.Execute(con, sql, params);
            }
            return model.getId();
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Сохранить группу
     */
    @Override
    public int saveGroup(InvGrpsModel ofields) throws Exception {
        try (Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            params.put("code", Integer.parseInt(ofields.getCode()));
            params.put("name", ofields.getName());
            String sql="";
            if (ofields.getId()==-1){
                sql = "INSERT INTO inv_grps (code,name,del) VALUES (:code, :name, 0)";
                ofields.setId(db.Execute(con,sql,Integer.class, params));
            }
            else {
                db.CheckLock(con, ofields.getId(),"inv_grps");
                sql ="UPDATE inv_grps SET code = :code, name = :name WHERE id = "+ ofields.getId();
                db.Execute(con,sql,params);
            }
            return ofields.getId();
        } catch (Exception ex) {  throw ex; }
    }

    /**
     * Проверка на добавление существующей группы
     */
    @Override
    public boolean existsGroup(int id, String code) throws Exception{
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            params.put("code", Integer.parseInt(code));

            String sql = "SELECT COUNT(*) FROM inv_grps WHERE (code = :code) AND id <> " + id;
            return db.Query(con, sql, Integer.class, params).get(0) > 0;
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Проверка на добавление существующего счета в группе
     */
    @Override
    public boolean existsGroupAcc(int id, int accId, int invGrpId) throws Exception{
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            params.put("accId", accId);
            params.put("invGrpId", invGrpId);
            String sql = "SELECT COUNT(*) FROM inv_grp_accs WHERE (acc_id = :accId and inv_grp_id=:invGrpId) AND id <> " + id;
            return db.Query(con, sql, Integer.class, params).get(0) > 0;
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Получить счет по id
     */
    @Override
    public AccModelView getAccById(int id) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "select id, code, tag, name from accs WHERE del=0 and id = " + id;
            List<AccModelView> result = db.Query(con, sql, AccModelView.class, null);
            if(result.size() == 0){
                throw new Exception("Не удалось получить acc с Id = " + id);
            }
            return result.get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }
}
