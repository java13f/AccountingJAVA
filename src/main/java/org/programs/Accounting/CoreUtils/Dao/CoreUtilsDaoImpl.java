package org.kaznalnrprograms.Accounting.CoreUtils.Dao;

import org.kaznalnrprograms.Accounting.CoreUtils.Interfaces.ICoreUtilsDao;
import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.Map;

@Repository
public class CoreUtilsDaoImpl implements ICoreUtilsDao {
    private String appName = "Accounting";
    private DBUtils db;
    public CoreUtilsDaoImpl(DBUtils db){
        this.db = db;
    }
    /**
     * Проверить право на действие
     * @param TaskCode - код приложения
     * @param ActCode - код действия
     */
    @Override
    public String GetActRights(String TaskCode, String ActCode) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT COALESCE((SELECT GetActRights(:TaskCode, :ActCode)), 'Не удалось получить право на действие')";
            Map<String, Object> params = new HashMap<>();
            params.put("TaskCode", TaskCode);
            params.put("ActCode", ActCode);
            return db.Query(con, sql, String.class,params).get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }
}
