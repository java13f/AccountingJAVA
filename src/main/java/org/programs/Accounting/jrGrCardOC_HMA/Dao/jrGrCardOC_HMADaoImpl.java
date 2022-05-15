package org.kaznalnrprograms.Accounting.jrGrCardOC_HMA.Dao;

import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.kaznalnrprograms.Accounting.jrGrCardOC_HMA.Interfaces.IjrGrCardOC_HMADao;

import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.Map;

@Repository
public class jrGrCardOC_HMADaoImpl implements IjrGrCardOC_HMADao {

    private String appName = "jrGrCardJC_HMA - форма ОС-9 гр. карточка ОС и НМА";
    private DBUtils db;
    public jrGrCardOC_HMADaoImpl(DBUtils db){ this.db = db;}

    @Override
    public String LoadUser() throws Exception {
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            String userCode = db.getUserCode();
            params.put("userCode", userCode);
            String sql = "SELECT get_fio(u.name, 1) FROM Users u where u.code = :userCode";
            return  db.Query(con, sql, String.class, params).get(0);
        }catch (Exception ex){
            throw ex;
        }
    }

   @Override
    public String getObject(int id) throws Exception{
        try (Connection con = db.getConnection(appName)){

            Map<String, Object> prms = new HashMap<>();
            prms.put("id", id);

            String sql = "select o.id || ' = ' || o.invno || ' : ' || o.name as name \n" +
                    "from objs o\n" +
                    "where o.id = :id";

            return db.Query(con, sql, String.class, prms).get(0);
        }catch (Exception ex){
            throw ex;
        }
    }
}
