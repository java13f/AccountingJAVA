package org.kaznalnrprograms.Accounting.jrOSX.Dao;


import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.kaznalnrprograms.Accounting.jrOSX.Intefaces.IjrOS10DirectoryDao;
import org.kaznalnrprograms.Accounting.jrOSX.Models.jrOS10Models;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class jrOS10DirectoryDaoImpl implements IjrOS10DirectoryDao {

    private String appName = "jrOSX - Опись инвентарных карточек по учету необоротных активов";
    private DBUtils db;

    public jrOS10DirectoryDaoImpl(DBUtils db) {
        this.db = db;
    }

    @Override
    public List<jrOS10Models> ListAccs() throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT" +
            " id," +
                    " code || ' - ' || name as name" +
                    " , code "+
                    " FROM accs "+
                    " where del = 0 "+
                    " order by code";
            return db.Query(con, sql, jrOS10Models.class, null);
        } catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public String GetKter(int Id) throws Exception {
        try (Connection con = db.getConnection(appName)) {

            String sql = "select name from kter where id =" + Id;
            List<String> result = db.Query(con, sql, String.class, null);
            if (result.size() == 0) {
                throw new Exception("Не удалось получить реквизит с Id = " + Id);
            }
            return result.get(0);

        } catch (Exception ex) {
            throw ex;
        }
    }




}
