package org.kaznalnrprograms.Accounting.jrObjectList.Dao;

import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import  org.kaznalnrprograms.Accounting.jrObjectList.Interfaces.IjObjectDirectoryDao;
import org.kaznalnrprograms.Accounting.jrObjectList.Models.jrObjectListKterCmb;
import org.kaznalnrprograms.Accounting.jrObjectList.Models.jrObjectListLocationCmb;
import org.springframework.stereotype.Repository;

import org.sql2o.Connection;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class jrObjectDirectoryDaoImpl implements IjObjectDirectoryDao{

    private String appName = "jrObjectList - список объектов";

    private DBUtils db;

    public jrObjectDirectoryDaoImpl(DBUtils db){ this.db = db;}

    @Override
    public List<jrObjectListLocationCmb> LoadLocations(int id) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            params.put("id", id);
            String sql = "SELECT l.id, l.id ||' =  '||l.name as name--, d.name\n" +
                    "FROM locations l\n" +
                    "JOIN Deps d ON d.id = l.DepId AND d.kterid = :id AND main_Dep=1\n" +
                    "JOIN GetTerRight() t ON d.KterId = t.Id\n"+
                    "ORDER BY l.name";
            return db.Query(con, sql, jrObjectListLocationCmb.class, params);

        }catch (Exception ex){
            throw ex;
        }
    }

    @Override
    public List<jrObjectListKterCmb> LoadKter() throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "select id,  id || ' = ' || code ||  ' : ' || name as name from kter order by kter.name, kter.code";
            return db.Query(con, sql, jrObjectListKterCmb.class, null);
        }catch (Exception ex){throw ex;}
    }

    @Override
    public String LoadUser() throws Exception {
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            String userCode = db.getUserCode();
            params.put("userCode", userCode);
            String sql = "SELECT get_fio(u.name, 0) FROM Users u where u.code = :userCode";
            return  db.Query(con, sql, String.class, params).get(0);
        }catch (Exception ex){
            throw ex;
        }
    }


}
