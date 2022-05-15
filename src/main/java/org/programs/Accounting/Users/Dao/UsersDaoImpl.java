package org.kaznalnrprograms.Accounting.Users.Dao;

import org.kaznalnrprograms.Accounting.Users.Interfaces.IUsersDao;
import org.kaznalnrprograms.Accounting.Users.Models.UsersViewModel;
import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class UsersDaoImpl implements IUsersDao {
    private String appName = "Users - справочник пользователей";
    private DBUtils db;
    public UsersDaoImpl(DBUtils db){
        this.db = db;
    }
    /**
     * Получить список пользователей
     * @param showDel - флаг отображения удалённых записей
     */
    @Override
    public List<UsersViewModel> List(boolean showDel, String filter) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            String sql = "SELECT u.id, u.code, kt.name AS KterName, u.name, u.deleted as del" +
                    " FROM users u" +
                    " left join deps ON deps.id = u.depid" +
                    " LEFT JOIN Kter kt ON kt.id = deps.kterid" +
                    " WHERE 1=1";

            if(!showDel){
                sql += " AND u.deleted = 0";
            }

            if (!filter.isEmpty()) {
                sql += " AND ( u.code ILIKE '%'||:filter||'%' OR u.name ILIKE '%'||:filter||'%' OR kt.name ILIKE '%'||:filter||'%')";
                params.put("filter", filter);
            }

            sql += " AND deps.kterId in (SELECT id from public.getterright())";

            return db.Query(con, sql, UsersViewModel.class, params);
        }
        catch(Exception ex){
            throw ex;
        }
    }
}
