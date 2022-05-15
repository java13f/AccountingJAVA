package org.kaznalnrprograms.Accounting.Admin.Dao;

import ch.qos.logback.core.db.dialect.DBUtil;
import org.kaznalnrprograms.Accounting.Admin.Interfaces.IUsersDao;
import org.kaznalnrprograms.Accounting.Admin.Models.DepsModel;
import org.kaznalnrprograms.Accounting.Admin.Models.KterViewModel;
import org.kaznalnrprograms.Accounting.Admin.Models.UserModel;
import org.kaznalnrprograms.Accounting.Admin.Models.UserViewModel;
import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;
import org.sql2o.Sql2o;

import javax.servlet.http.HttpServletRequest;
import javax.sql.DataSource;
import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class UserDaoImpl implements IUsersDao {
    private String appName = "Admin - модуль администрирования";
    private DBUtils db;
    public UserDaoImpl(DBUtils db) {
        this.db = db;
    }
    /**
     * Фнкция возвращает список пользователей
     * @param code фильтер по части логина пользователя
     * @param name фильтер по части наименования
     * @param kterId фильтер по территории
     */
    @Override
    public List<UserViewModel> List(String code, String name, int kterId) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            String sql = "SELECT u.id, u.Code, kt.Name as KterName, d.Name as DepName, u.Name as UserName, " +
                    " CASE WHEN u.Deleted = 1 THEN 'Да' ELSE 'Нет' END as Deleted FROM Users u"
                    +" JOIN Deps d ON d.Id = u.DepId"
                    +" JOIN Kter kt ON kt.Id = d.KterId WHERE 1=1";
            if(!code.isEmpty()){
                sql+=" AND u.Code ILIKE '%'||:code||'%'";
                params.put("code", code);
            }
            if(!name.isEmpty()){
                sql+=" AND u.Name ILIKE '%'||:name||'%'";
                params.put("name", name);
            }
            if(kterId!=-1){
                sql+=" AND kt.Id = " + kterId;
            }
            sql +=" ORDER BY u.Code";
            List<UserViewModel> users = db.Query(con, sql, UserViewModel.class, params);
            return users;
        }
        catch(Exception ex)
        {
            throw ex;
        }
    }
    /**
     * Функция получения пользователя
     * @param id - идентификатор пользователя
     * @return
     * @throws Exception
     */
    @Override
    public UserModel GetUser(int id) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT u.*, d.KterId FROM Users u"
                    + " JOIN Deps d ON d.Id = u.DepId"
                    + " WHERE u.Id = " + id;
            List<UserModel> users = db.Query(con, sql, UserModel.class, null);
            if(users.size()==0){
                throw new Exception("Пользователь с Id = " + id);
            }
            return users.get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }
    /**
     * Проверка существования пользователя
     * @param id - идентификатор пользователя
     * @param code - логин ползователя
     * @return
     * @throws Exception
     */
    @Override
    public boolean ExistsUser(int id, String code) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT COUNT(*) FROM Users WHERE Code = :Code AND Id <> " + id;
            Map<String, Object> params = new HashMap<>();
            params.put("Code", code);
            return db.Query(con, sql, Integer.class, params).get(0) > 0;
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Получить список территорий
     * @return
     * @throws Exception
     */
    @Override
    public List<KterViewModel> GetKtersUserEdit() throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT Id, CAST(Id as VARCHAR(255))||' = '||Name AS Name FROM Kter WHERE Del = 0 ORDER BY Name";
            return db.Query(con, sql, KterViewModel.class, null);
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Получить список подразделений
     * @param KterId - идентификатор территории
     * @return
     */
    @Override
    public List<DepsModel> GetDeps(int KterId) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT Id, CAST(Id as VARCHAR(255))||' = '||Name AS Name FROM Deps WHERE KterId = " + KterId + " AND Del = 0";
            return db.Query(con, sql, DepsModel.class, null);
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Добавить/изменить пользователя
     * @param model - модуль пользователя
     * @return
     * @throws Exception
     */
    @Override
    public  int Save(UserModel model) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "";
            String password = model.getPassword();
            Map<String, Object> params = new HashMap<>();
            params.put("Code", model.getCode());
            params.put("Name", model.getName());
            if(!password.isEmpty()){
                params.put("Password", password);
            }
            if(model.getId()==-1){
                sql = "INSERT INTO Users (DepId, Code, Name, Password, Deleted) VALUES(" + model.getDepId() + ", :Code, :Name, :Password, " + model.getDeleted() + ")";
                model.setId(db.Execute(con, sql, Integer.class, params));
            }
            else {
                db.CheckLock(con, model.getId(), "Users");
                sql = "UPDATE Users SET DepId = " + model.getDepId() + ", Code = :Code, Name = :Name, Deleted = " + model.getDeleted();
                if(!password.isEmpty()){
                    sql+=", Password = :Password";
                }
                sql+= " WHERE Id = "+model.getId();
                db.Execute(con, sql, params);
            }
            return model.getId();
        }
        catch (Exception ex){
            throw ex;
        }
    }

    /**
     * Удаление пользователя
     * @param id - идентификатор пользователя
     * @return
     */
    @Override
    public String Delete(int id) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT COUNT(*) as cnt FROM UserGroups WHERE UserId = "+id;
            int count = db.Query(con, sql, Integer.class, null).get(0);
            if(count > 0){
                return "Невозможно удалить пользователя так как он привязан к группам";
            }
            sql = "DELETE FROM Users WHERE Id = " + id;
            db.Execute(con, sql, null);
            return "";
        }
        catch (Exception ex){
            throw ex;
        }
    }
    /**
     * Получение строки представления пользователя для формы редактирования
     * @param id - идентификатор польбзователя
     */
    @Override
    public String getUserSel(int id) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT LTRIM(RTRIM(CAST(Id AS VARCHAR(128)))) || ' = ' || Name FROM Users WHERE id = " + id;
            List<String> result = db.Query(con, sql, String.class, null);
            if(result.size()==0){
                throw new Exception("Не удалось получить пользователя с Id = " + id);
            }
            return result.get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }
}
