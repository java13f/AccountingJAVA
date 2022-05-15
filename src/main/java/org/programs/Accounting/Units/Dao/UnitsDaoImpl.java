package org.kaznalnrprograms.Accounting.Units.Dao;



import org.kaznalnrprograms.Accounting.Units.Interfaces.IUnitsDao;
import org.kaznalnrprograms.Accounting.Units.Models.GetUnitsModels;
import org.kaznalnrprograms.Accounting.Units.Models.UnitsModels;
import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;

import java.util.List;
import java.util.Map;
@Repository
public class UnitsDaoImpl implements IUnitsDao {

    private String appName = "Справочник единиц измерений";
    private DBUtils db;
    public UnitsDaoImpl(DBUtils db){
        this.db = db;
    }

    @Override
    public List<UnitsModels> list(boolean showDel) throws Exception{
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            String sql = "Select id , name, del , code from Units where 1=1";
            if (!showDel){
                sql += "and del=0";
            }
            sql+=" ORDER BY code";
            return db.Query(con, sql, UnitsModels.class, params);
        }
        catch (Exception ex){
            throw ex;
        }
    }
    /**
     * добавление-редактирование
     * @param obj
     * @return
     * @throws Exception
     */
    @Override
    public int save(UnitsModels obj) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "";
            Map<String, Object> params = new HashMap<>();
            params.put("name", obj.getName());
            params.put("code", obj.getCode());

            if(obj.getId() == -1){
                sql = " INSERT INTO Units (name , code , del) values (:name , :code , 0) ";
                obj.setId(db.Execute(con, sql, Integer.class, params));
            }
            else {
                db.CheckLock(con, obj.getId(), "units");
                sql = "update units set  name = :name,  code = :code where id =  " + obj.getId();
                db.Execute(con, sql, params);
            }
            return obj.getId();
        }
        catch(Exception ex){
            throw ex;
        }
    }

    @Override
    public boolean exists(int id, String name,String code) throws Exception{
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> param = new HashMap<>();
            param.put("code", code);
            param.put("id", id);
            String sql = " SELECT COUNT(*) FROM units WHERE code = :code  AND id <> :id ";
            return db.Query(con, sql, Integer.class, param).get(0) > 0;
        }
        catch(Exception ex){
            throw ex;
        }
    }
    @Override
    public GetUnitsModels get(int id) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = " select id as Id , " +
                         " name, " +
                         " code, " +
                         " creator, " +
                         " created, " +
                         " changer, " +
                         " changed " +
                         " from units " +
                         " where  id = " + id;
            List<GetUnitsModels> result = db.Query(con, sql, GetUnitsModels.class, null);
            if(result.size() == 0){
                throw new Exception("Не удалось получить территорию с Id = " + id);
            }
            return result.get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }
    @Override
    public void delete(int id) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "UPDATE units SET Del = 1 - Del WHERE Id = " + id;
            db.Execute(con, sql, null);
        }
        catch(Exception ex){
            throw ex;
        }
    }
}
