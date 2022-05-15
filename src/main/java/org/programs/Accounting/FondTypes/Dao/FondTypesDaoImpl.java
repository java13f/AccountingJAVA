package org.kaznalnrprograms.Accounting.FondTypes.Dao;

import org.kaznalnrprograms.Accounting.FondTypes.Interfaces.IFondTypesDao;
import org.kaznalnrprograms.Accounting.FondTypes.Models.FondTypesModel;

import org.kaznalnrprograms.Accounting.FondTypes.Models.GetFondTypesModel;

import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
@Repository
public class FondTypesDaoImpl implements IFondTypesDao {

    private String appName = "Справочник типов фондов";
    private DBUtils db;
    public FondTypesDaoImpl(DBUtils db){
        this.db = db;
    }

    @Override
    public List<FondTypesModel> list(boolean showDel) throws Exception{
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            String sql = "Select id , name, del , code from Fond_Types where 1=1";
            if (!showDel){
                sql += "and del=0";
            }
            sql+=" ORDER BY code";
            return db.Query(con, sql, FondTypesModel.class, params);
        }
        catch (Exception ex){
            throw ex;
        }
    }
    @Override
    public GetFondTypesModel get(int id) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = " select id as Id , " +
                    "name, " +
                    " code, " +
                    " creator, " +
                    " created, " +
                    " changer, " +
                    " changed " +
                    " from fond_types " +
                    " where  id = " + id;
            List<GetFondTypesModel> result = db.Query(con, sql, GetFondTypesModel.class, null);
            if(result.size() == 0){
                throw new Exception("Не удалось получить запись с Id = " + id);
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
            String sql = "UPDATE fond_types SET Del = 1 - Del WHERE Id = " + id;
            db.Execute(con, sql, null);
        }
        catch(Exception ex){
            throw ex;
        }
    }
    @Override
    public int save(FondTypesModel obj) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "";
            Map<String, Object> params = new HashMap<>();
            params.put("name", obj.getName());
            params.put("code", obj.getCode());

            if(obj.getId() == -1){
                sql = " INSERT INTO fond_types (name , code , del) values (:name , :code , 0) ";
                obj.setId(db.Execute(con, sql, Integer.class, params));
            }
            else {
                db.CheckLock(con, obj.getId(), "fond_types");
                sql = "update fond_types set  name = :name,  code = :code where id =  " + obj.getId();
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
            String sql = " SELECT COUNT(*) FROM fond_types WHERE code = :code  AND id <> :id ";
            return db.Query(con, sql, Integer.class, param).get(0) > 0;
        }
        catch(Exception ex){
            throw ex;
        }
    }
}
