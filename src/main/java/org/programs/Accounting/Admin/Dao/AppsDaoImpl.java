package org.kaznalnrprograms.Accounting.Admin.Dao;

import org.kaznalnrprograms.Accounting.Admin.Interfaces.IAppsDao;
import org.kaznalnrprograms.Accounting.Admin.Models.AppModel;
import org.kaznalnrprograms.Accounting.Admin.Models.AppViewModel;
import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Repository
public class AppsDaoImpl implements IAppsDao {
    private String appName = "Admin - модуль администрирования";
    private DBUtils db;
    public AppsDaoImpl(DBUtils db){
        this.db = db;
    }
    private List<AppViewModel> getChildApps(Connection con, List<AppViewModel> allApps,  Integer id) {
        List<AppViewModel> apps = allApps.stream().filter((a)->a.getParentId()==id).collect(Collectors.toList());
        for (AppViewModel app: apps) {
            app.setChildren(getChildApps(con, allApps, app.getId()));
        }
        return apps;
    }
    /**
     * Получить список приложений
     */
    @Override
    public List<AppViewModel> List() throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT Name, Id, Code, " +
                    " CASE WHEN Report = 0 THEN 'Модуль/HRT отчёт'"+
                    " WHEN Report = 1 THEN 'Альтернативный отчёт'"+
                    " WHEN Report = 2 THEN 'WEB HRT отчёт'"+
                    " WHEN Report = 3 THEN 'Папка' END typeApp,"+
                    " ParentId"+
                    " FROM Apps ORDER BY CASE WHEN Report = 3 THEN 3 ELSE 0 END DESC, SortCode, Id";
            List<AppViewModel> allApps = db.Query(con, sql, AppViewModel.class, null);
            List<AppViewModel> rootApps = allApps.stream().filter((a)->a.getParentId()==null).collect(Collectors.toList());
            for(AppViewModel app:rootApps){
                app.setChildren(getChildApps(con, allApps, app.getId()));
            }
            return rootApps;
        }
        catch(Exception ex){
            throw ex;
        }
    }
    /**
     * Получить наименование приложения
     * @param id идентификатор приложения
     */
    @Override
    public String GetAppSel(int id) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT LTRIM(RTRIM(CAST(Id AS VARCHAR(128)))) || ' = ' || Name FROM Apps WHERE Id = " + id;
            List<String> result = db.Query(con, sql, String.class, null);
            if(result.size() == 0){
                throw new Exception("Не удалось получить имя приложения с Id = " + id);
            }
            return result.get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }
    /**
     * Получить приложение
     * @param id - идентификатор приложения
     */
    @Override
    public AppModel Get(int id) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT Id, COALESCE(ParentId, -1) as ParentId, Code, CodeJs, Func,  "
            +" ManagedModule, Report, Name, AppName, SortCode, Creator, Created, Changer, Changed FROM Apps WHERE Id = " + id;
            List<AppModel> apps = db.Query(con, sql, AppModel.class, null);
            if(apps.size() == 0){
                throw new Exception("Не удалось получить приложение с Id = " + id);
            }
            return apps.get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }
    /**
     * Проверить существование приложения
     * @param id - идентификатор приложения (для новых -1)
     * @param code - код приложения
     * @param func - функция приложения
     */
    @Override
    public boolean Exists(int id, String code, String func) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT COUNT(*) as cnt FROM Apps WHERE Code = :Code AND Func = :Func AND Id <> "+id;
            Map<String, Object> params = new HashMap<>();
            params.put("Code", code);
            params.put("Func", func);
            return db.Query(con, sql, Integer.class, params).get(0) > 0;
        }
        catch(Exception ex){
            throw ex;
        }
    }
    /**
     * Добавить/Изменить приложение
     * @param app - модель приложения
     */
    @Override
    public int Save(AppModel app) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "";
            String pId = "NULL";
            Map<String, Object> params = new HashMap<>();
            if(app.getParentId() != -1){
                pId = Integer.toString(app.getParentId());
            }
            params.put("Code", app.getCode());
            params.put("CodeJs", app.getCodeJs());
            params.put("Func", app.getFunc());
            params.put("Name", app.getName());
            params.put("AppName", app.getAppName());
            params.put("SortCode", app.getSortCode());
            if(app.getId() == -1){
                sql = "INSERT INTO Apps(ParentId, Code, CodeJs, Func, Name, ManagedModule, Report, AppName, SortCode) " +
                        " VALUES( " + pId + ", :Code, :CodeJs, :Func, :Name, " +
                        " "+ app.getManagedModule() + ", " +app.getReport() + ",  :AppName, :SortCode)";
                app.setId(db.Execute(con, sql, Integer.class, params));
            }
            else {
                db.CheckLock(con, app.getId(), "Apps");
                sql = "UPDATE Apps SET ParentId = " + pId + ","
                        +" Code = :Code, CodeJs = :CodeJs, Func = :Func, Name = :Name, "
                        +" ManagedModule = " + app.getManagedModule() + ", Report = " + app.getReport() + ", AppName = :AppName, SortCode = :SortCode WHERE Id = " + app.getId();
                db.Execute(con, sql, params);
            }
            return app.getId();
        }
        catch(Exception ex){
            throw ex;
        }
    }
    /**
     * Удалить приложение
     * @param id - идентификатор приложения
     */
    @Override
    public String Delete(int id) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT COUNT(*) as cnt FROM AppRights WHERE AppId = " + id;
            int count = db.Query(con, sql, Integer.class, null).get(0);
            if(count > 0) {
                return "Невозможно удалить данное приложение так как оно привязано к группам";
            }
            sql = "DELETE FROM Apps WHERE Id = "+id;
            db.Execute(con, sql, null);
            return "";
        }
        catch(Exception ex){
            throw ex;
        }
    }
}
