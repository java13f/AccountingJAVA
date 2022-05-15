package org.kaznalnrprograms.Accounting.jrOSV;

import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.kaznalnrprograms.Accounting.jrOSV.Models.jrOSVAccModel;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class jrOSVDaoImpl implements IjrOSVDao {
    private String appName = "отчет - Оборотно-сальдовая ведомость";
    private DBUtils db;

    public jrOSVDaoImpl(DBUtils db){
        this.db = db;
    }

    /**
     * Получить список счетов
     * @return
     * @throws Exception
     */
    public List<jrOSVAccModel> getAccs()  throws Exception{
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            String sql = "SELECT id, Code || ' : ' || Name as name From Accs ORDER BY name ";
            return db.Query(con, sql, jrOSVAccModel.class, params);
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Получить пользователя в виде 1 = Иванов
     * @param id
     * @return
     * @throws Exception
     */
    public String getUser(int id) throws Exception{
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            params.put("id",id);
            String sql = "SELECT id || ' = ' || Name as name From users where id=:id";
            String r=db.Query(con, sql, String.class, params).get(0);
            return r;
        }
        catch(Exception ex){
            throw ex;
        }
    }

}
