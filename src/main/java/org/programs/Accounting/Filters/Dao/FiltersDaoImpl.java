package org.kaznalnrprograms.Accounting.Filters.Dao;

import org.kaznalnrprograms.Accounting.Filters.Interfaces.IFiltersDao;
import org.kaznalnrprograms.Accounting.Filters.Models.FilterParamModel;
import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;

@Repository
public class FiltersDaoImpl implements IFiltersDao {
    private String appName = "Filters - настройки фильтров";
    private DBUtils db;

    public FiltersDaoImpl(DBUtils db){
        this.db = db;
    }

    /**
     * Получить идентификатор пользователя
     * @param con соединение с базой данных
     * @return
     */
    private int getUserId(Connection con){
        Map<String, Object> params = new HashMap<>();
        String userCode = db.getUserCode();
        params.put("userCode", userCode);
        String sql = "SELECT id FROM Users WHERE Code = :userCode";
        int userId = db.Query(con, sql, Integer.class, params).get(0);
        return userId;
    }
    /**
     * Получить значения фильтра
     * @param code код фильтра
     * @return
     * @throws Exception
     */
    @Override
    public List<FilterParamModel> GetValues(String code) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            int userId = getUserId(con);
            params.put("code", code);
            String sql = "SELECT code, paramcode, val FROM Filters WHERE UserId = " + userId + " AND Code = :code";
            return db.Query(con, sql, FilterParamModel.class, params);
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Сохранение настроек фильтра
     * @param code код фильтра
     * @param values значения параметров фильтра, которые необходимо создать или изменить
     * @throws Exception
     */
    @Override
    public void SetValues(String code, List<FilterParamModel> values) throws Exception {
        try(Connection con = db.getConnectionWithTran(appName)){
            Map<String, Object> params = new HashMap<>();
            String sql = "";
            int userId = getUserId(con);
            for(FilterParamModel param: values){
                params.clear();
                params.put("code", param.getCode());
                params.put("paramCode", param.getParamCode());
                sql = "SELECT id FROM Filters WHERE UserId = " + userId + " AND Code = :code AND ParamCode = :paramCode";
                List<Integer> result = db.Query(con, sql, Integer.class, params);
                params.put("val", param.getVal());
                if(result.size() == 0){
                    sql = "INSERT INTO Filters (UserId, Code, ParamCode, Val) VALUES(" + userId + ", :code, :paramCode, :val)";
                }
                else {
                    params.clear();
                    params.put("val", param.getVal());
                    int id = result.get(0);
                    sql = "UPDATE Filters SET Val = :val WHERE id = " + id;
                }
                db.Execute(con, sql, params);
            }
            con.commit();
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Уудалить фильтр
     * @param code код фильтра
     * @throws Exception
     */
    @Override
    public void DeleteFilter(String code) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            int userId = getUserId(con);
            params.put("code", code);
            String sql = "DELETE FROM Filters WHERE UserId = " + userId + " AND Code = :code";
            db.Execute(con, sql, params);
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Удаление параметров фильтра
     * @param code код фильтра
     * @param keys параметры фильтра
     * @throws Exception
     */
    @Override
    public void DeleteParamsInFilter(String code, List<String> keys) throws Exception {
        try(Connection con = db.getConnectionWithTran(appName)){
            Map<String, Object> params = new Hashtable<>();
            int userId = getUserId(con);
            params.put("code", code);
            params.put("paramCode", "");
            for(String key : keys){
                params.replace("paramCode", key);
                String sql = "DELETE FROM Filters WHERE UserId = " + userId + " AND Code = :code AND ParamCode = :paramCode";
                db.Execute(con, sql, params);
            }
            con.commit();
        }
        catch(Exception ex){
            throw ex;
        }
    }
}
