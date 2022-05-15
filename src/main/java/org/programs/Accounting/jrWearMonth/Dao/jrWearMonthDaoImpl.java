package org.kaznalnrprograms.Accounting.jrWearMonth.Dao;

import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.kaznalnrprograms.Accounting.jrWearMonth.Interfaces.IjrWearMonthDao;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.List;

@Repository
public class jrWearMonthDaoImpl implements IjrWearMonthDao {

    private String appName = "jrWearMonth - помесячный износ";
    private DBUtils db;

    public jrWearMonthDaoImpl(DBUtils db) {
        this.db = db;
    }

    @Override
    public String KterName(int id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql =  "SELECT CASE WHEN  r.getobject_id IS NULL THEN -1 ELSE 1 END TableId FROM \n"+
                    "(SELECT getobject_id('kter')) r";
            List<String> result = db.Query(con, sql, String.class, null);
            if (Integer.parseInt(result.get(0)) != 1) {
                throw new Exception("Таблица с именем 'kter' не найдена");
            } else {
                String sql1 = "SELECT id ||' = ' || code || ':'|| name \"name\" FROM kter WHERE id = " + id;
                List<String> result1 = db.Query(con, sql1, String.class, null);
                if (result1.size() == 0) {
                    throw new Exception("Не найден тип объекта с ID = " + id);
                }
                return result1.get(0);
            }
        } catch (Exception ex) {
            throw ex;
        }
    }

}
