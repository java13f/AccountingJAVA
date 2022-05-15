package org.kaznalnrprograms.Accounting.Admin.Dao;

import org.kaznalnrprograms.Accounting.Admin.Interfaces.IActsDao;
import org.kaznalnrprograms.Accounting.Admin.Models.ActModel;
import org.kaznalnrprograms.Accounting.Admin.Models.ActViewModel;
import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class ActsDaoImpl implements IActsDao {
    private String appName = "Admin - модуль администрирования";
    private DBUtils db;
    public ActsDaoImpl(DBUtils db){
        this.db = db;
    }
    /**
     * Получить список действий
     * @param appId - идентификатор приложения
     * @param code - код действия
     * @param name - наименование действия
     */
    @Override
    public List<ActViewModel> List(int appId, String code, String name) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "";
            String fAppId = "";
            String fCode = "";
            String fName = "";
            Map<String, Object> params = new HashMap<>();
            if(appId!=-1){
                fAppId = " AND ac.AppId = " + appId;
            }
            if(code != null && !code.isEmpty()){
                fCode = " AND ac.Code ILIKE '%' || :filterCode || '%' ";
                params.put("filterCode", code);
            }
            if(name != null && !name.isEmpty()){
                fName = " AND ac.Name ILIKE '%' || :filterName || '%' ";
                params.put("filterName", name);
            }
            sql = "SELECT ac.Id, ac.Code, ap.Name as AppName, ac.Name as actName, ac.AppId FROM Acts ac, Apps ap WHERE ac.AppId = ap.Id "
            +fAppId +fCode +fName;
            return db.Query(con, sql, ActViewModel.class, params);
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Получить действие
     * @param id - идентификатор действия
     */
    @Override
    public ActModel Get(int id) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT * FROM Acts WHERE Id = " + id;
            List<ActModel> result = db.Query(con, sql, ActModel.class, null);
            if(result.size() == 0){
                throw new Exception("Не удалось получить действие с Id = " + id);
            }
            return result.get(0);
        }
        catch (Exception ex){
            throw ex;
        }
    }

    /**
     * Проверить существование действия в базе данных
     * @param id - идентификатор действия (для новых -1)
     * @param code - код действия
     */
    @Override
    public boolean Exists(int id, String code) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT COUNT(*) as cnt FROM Acts WHERE Code = :code AND id <> " + id;
            Map<String, Object> params = new HashMap<>();
            params.put("code", code);
            return db.Query(con, sql, Integer.class, params).get(0) > 0;
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Добавить/Изменить действие
     * @param act - модель действия
     */
    @Override
    public int Save(ActModel act) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "";
            Map<String, Object> params = new HashMap<>();
            params.put("code", act.getCode());
            params.put("name", act.getName());
            if(act.getId() == -1){
                sql = "INSERT INTO Acts (AppId, Code, Name) VALUES (" + act.getAppId() + ", :code, :name)";
                act.setId(db.Execute(con, sql, Integer.class, params));
            }
            else {
                db.CheckLock(con, act.getId(), "Acts");
                sql = "UPDATE Acts SET AppId = " + act.getAppId() + ", Code = :code, Name = :name WHERE Id = " + act.getId();
                db.Execute(con, sql, params);
            }
            return act.getId();
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Удалить действие
     * @param id - идентификатор действия
     */
    @Override
    public String Delete(int id) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT COUNT(*) as cnt FROM ActGroups WHERE ActId = " + id;
            int count = db.Query(con, sql, Integer.class, null).get(0);
            if(count > 0){
                return "Невозможно удалить действие так как оно привязано к группам";
            }
            sql = "DELETE FROM Acts WHERE Id = " + id;
            db.Execute(con, sql, null);
            return "";
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Получить данные выбранного действия
     * @param id - Идентифиатор действия
     */
    @Override
    public String GetActSel(int id) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT LTRIM(RTRIM(CAST(Id AS VARCHAR(128)))) || ' = ' || Name FROM Acts WHERE Id = " + id;
            List<String> result = db.Query(con, sql, String.class, null);
            if(result.size() == 0){
                throw new Exception("Не удалось получить действие с Id = " + id);
            }
            return result.get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }
}
