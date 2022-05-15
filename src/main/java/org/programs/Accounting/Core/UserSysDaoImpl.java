package org.kaznalnrprograms.Accounting.Core;

import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class UserSysDaoImpl implements IUserSysDao {
    private String appName = "Accounting";
    private DBUtils db;
    public UserSysDaoImpl(DBUtils db){
        this.db = db;
    }
    @Override
    public UserModel getByCode(String code) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT id, Code, Name, password FROM Users WHERE code = :code";
            Map<String, Object> params = new HashMap<>();
            params.put("code", code);
            List<UserModel> users = db.Query(con, sql, UserModel.class,params);
            if(users.size() == 0){
                throw new Exception("Неверный логин или пароль");
            }
            return users.get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }
    /**
     * Проверить право на действие
     * @param TaskCode - код приложения
     * @param ActCode - код действия
     */
    @Override
    public String GetActRights(String TaskCode, String ActCode) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT getactrights(:TaskCode, :ActCode)";
            Map<String, Object> params = new HashMap<>();
            params.put("TaskCode", TaskCode);
            params.put("ActCode", ActCode);
            return db.Query(con, sql, String.class, params).get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }
}
