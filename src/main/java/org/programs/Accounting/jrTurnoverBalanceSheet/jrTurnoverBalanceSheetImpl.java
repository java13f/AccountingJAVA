package org.kaznalnrprograms.Accounting.jrTurnoverBalanceSheet;

import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class jrTurnoverBalanceSheetImpl implements IjrTurnoverBalanceSheetDao {
    private String appName = "отчет - Оборотно-сальдовая ведомость";
    private DBUtils db;

    public jrTurnoverBalanceSheetImpl(DBUtils db){
        this.db = db;
    }

    public List<jrTurnoverBalanceSheetAccModel> getAccs()  throws Exception{
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            String sql = "SELECT id, Code || ' : ' || Name as name From Accs ORDER BY name ";
            return db.Query(con, sql, jrTurnoverBalanceSheetAccModel.class, params);
        }
        catch(Exception ex){
            throw ex;
        }
    }


}
