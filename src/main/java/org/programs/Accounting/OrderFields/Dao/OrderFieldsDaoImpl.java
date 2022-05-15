package org.kaznalnrprograms.Accounting.OrderFields.Dao;
import org.kaznalnrprograms.Accounting.OrderFields.Interfaces.IOrderFieldsDao;
import org.kaznalnrprograms.Accounting.OrderFields.Models.OrderFieldsModel;
import org.kaznalnrprograms.Accounting.OrderFields.Models.OrderFieldsViewModel;
import org.springframework.stereotype.Repository;
import org.kaznalnrprograms.Accounting.Utils.*;
import org.sql2o.Connection;
import org.sql2o.Query;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Repository
public class OrderFieldsDaoImpl implements IOrderFieldsDao {
    private String appName = "OrderFields - справочник полей заявки";
    private DBUtils db;

    public OrderFieldsDaoImpl (DBUtils db){
        this.db = db;
    }
    /**
     * получить списк полей заявки
     * @param filter
     * @param showDel
     * @return
     * @throws Exception
     */
    @Override
    public List<OrderFieldsViewModel> list(String filter, boolean showDel) throws Exception {
        try (Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            String sql = "SELECT id,code,name,del  FROM OrderFields WHERE 1=1";
            if(!showDel){ sql+=" AND del = 0 "; }
            if (!filter.isEmpty()){
                sql+=" AND (code ILIKE '%'||:filter||'%'  OR name ILIKE '%'||:filter||'%') ";
                params.put("filter", filter);
            }
            sql+=" ORDER BY code ";
            return db.Query(con, sql, OrderFieldsViewModel.class, params);
        } catch (Exception ex) {  throw ex; }
    }

    /**
     * Получить запись заявки для просмотра/изменения
     * @param id
     * @return
     * @throws Exception
     */
    @Override
    public OrderFieldsModel get(int id) throws Exception {
        try (Connection con = db.getConnection(appName)){
          String sql = "SELECT * FROM OrderFields WHERE id="+id;
          List<OrderFieldsModel> result= db.Query(con,sql,OrderFieldsModel.class,null);
          if (result.size()==0){ throw new Exception("Не удалось получить поле заявки с id =  "+id); }
          return result.get(0);
        } catch (Exception ex) {  throw ex; }
    }

    /**
     * Проверить  существование записи
     * @param id
     * @param code
     * @return
     * @throws Exception
     */
    @Override
    public boolean exists(int id, String code) throws Exception {
        try (Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            params.put("code", code);
            String sql="SELECT COUNT(*) FROM OrderFields WHERE code = :code AND id <> " + id;
            return db.Query(con,sql,Integer.class, params).get(0) > 0;
        } catch (Exception ex) {  throw ex; }
    }

    /**
     * Сохранение измененного / создание нового поля заявки
     * @param ofields
     * @return
     * @throws Exception
     */
    @Override
    public int save(OrderFieldsModel ofields) throws Exception {
        try (Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            params.put("code", ofields.getCode());
            params.put("name", ofields.getName());
            String sql="";
            if (ofields.getId()==-1){
                sql = "INSERT INTO OrderFields (code,name,del) VALUES (:code, :name, 0)";
                ofields.setId(db.Execute(con,sql,Integer.class, params));
            }
             else {
                 db.CheckLock(con, ofields.getId(),"OrderFields");
                 sql ="UPDATE OrderFields SET code = :code, name = :name, del = 0 WHERE id = "+ ofields.getId();
                 db.Execute(con,sql,params);
            }
            return ofields.getId();
        } catch (Exception ex) {  throw ex; }
    }

    /**
     * Удаление поля заявки
     * @param id
     * @throws Exception
     */
    @Override
    public void delete(int id) throws Exception {
        try (Connection con = db.getConnection(appName)){
            String sql="UPDATE OrderFields SET del = 1-del WHERE id = " + id;
            db.Execute(con,sql,null);
        } catch (Exception ex) {  throw ex; }
    }
}
