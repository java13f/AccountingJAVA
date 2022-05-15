package org.kaznalnrprograms.Accounting.jrInvList;


import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.kaznalnrprograms.Accounting.jrInvList.Models.jrInvListModel;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class jrInvListImpl implements IjrInvListDao {
    private String appName = "отчет - Инвентарный список необоротных активов";
    private DBUtils db;

    public jrInvListImpl(DBUtils db){
        this.db = db;
    }

    /**
     * Получить территорию по id
     * @param id - id территория
     * @return - строка с данными территории
     * @throws Exception
     */
    public String getKter(int id) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("id",id);

            String sql = "select id || ' = ' || code || ' : ' || name as name from kter where id=:id and del=0";

            return db.Query(con, sql, String.class, params).get(0);
        }
        catch(Exception ex) {
            throw ex;
        }
    }

    /**
     * Получить список подразделений по выбранной территории
     * @param kterId - id территория
     * @return - список подразделений по выбранной территории
     * @throws Exception
     */
    public List<jrInvListModel> getDepsList(int kterId) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("kterId",kterId);

            String sql = "select id, case when coalesce(trim(code), '')='' is false then" +
                    " id || ' = ' || code || ' : ' || name" +
                    " else" +
                    " id || ' = ' ||  name" +
                    " end as name" +
                    " From Deps d where kterId=:kterId order by d.name";

            return db.Query(con, sql, jrInvListModel.class, params);
        }
        catch(Exception ex) {
            throw ex;
        }
    }

    /**
     * Поулчить список счетов
     * @return - список счетов
     * @throws Exception
     */
    public List<jrInvListModel> getAccCode() throws Exception {
        try(Connection con = db.getConnection(appName)) {
            String sql = "select id, id || ' = ' || code || ' : ' || name as name from accs where del=0 ORDER BY id";

            return db.Query(con, sql, jrInvListModel.class, null);
        }
        catch(Exception ex) {
            throw ex;
        }
    }



}
