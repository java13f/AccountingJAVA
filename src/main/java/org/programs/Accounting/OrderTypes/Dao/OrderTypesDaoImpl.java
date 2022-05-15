package org.kaznalnrprograms.Accounting.OrderTypes.Dao;

import org.kaznalnrprograms.Accounting.OrderTypes.Interfaces.IOrderTypesDao;
import org.kaznalnrprograms.Accounting.OrderTypes.Models.OrderTypesModel;
import org.kaznalnrprograms.Accounting.OrderTypes.Models.OrderTypesViewModel;
import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class OrderTypesDaoImpl implements IOrderTypesDao
{
    private String appName = "OrderTypes - типы заявок";
    private DBUtils db;

    public OrderTypesDaoImpl(DBUtils db)
    {
        this.db = db;
    }


    /**
     * Получить список типов заявок
     * @param showDel - флаг отображения удаленных записей
     * @return
     * @throws Exception
     */
    @Override
    public List<OrderTypesViewModel> viewList(boolean showDel) throws Exception
    {
        try(Connection con = db.getConnection(appName))
        {
            Map<String, Object> params = new HashMap<>();
            String sql = "SELECT id, name, code, mode, modul, func, codejs, del" +
                         " FROM OrderTypes" +
                         " WHERE 1=1";
            if(!showDel)
            {
                sql += " AND del = 0";
            }

            sql += " ORDER BY id";
            return db.Query(con, sql, OrderTypesViewModel.class, params);
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    /**
     * Проверить существование территории
     * @param id - идентификатор типа заявки (для новых -1)
     * @param code - код типа заявки
     * @return
     * @throws Exception
     */
    @Override
    public boolean exists(int id, String code) throws Exception{
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            params.put("code", code);
            String sql = "SELECT COUNT(*) FROM OrderTypes WHERE code = :code AND id <> " + id;
            return db.Query(con, sql, Integer.class, params).get(0) > 0;
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Добавить/ Изменить территорию
     * @param ordertypes - модель типа заявки
     * @return
     * @throws Exception
     */
    @Override
    public int save(OrderTypesModel ordertypes) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "";
            Map<String, Object> params = new HashMap<>();
            params.put("code", ordertypes.getCode());
            params.put("name", ordertypes.getName());
            params.put("func", ordertypes.getFunc());
            params.put("modul", ordertypes.getModul());
            params.put("codejs", ordertypes.getCodejs());

            if(ordertypes.getId() == -1){
                sql = "INSERT INTO OrderTypes (code, name, func, modul, codejs, mode, del)"
                        +" VALUES(:code, :name, :func, :modul, :codejs, " + ordertypes.getMode() + ", 0)";
                ordertypes.setId(db.Execute(con, sql, Integer.class, params));
            }
            else {
                db.CheckLock(con, ordertypes.getId(), "ordertypes");
                sql = "UPDATE OrderTypes SET code = :code, name = :name, func = :func, modul = :modul, codejs = :codejs, mode = " + ordertypes.getMode() + " WHERE id = " + ordertypes.getId();
                db.Execute(con, sql, params);
            }
            return ordertypes.getId();
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Функция получения типа заявки для просмотра/изменения
     * @param id - идентификатор типа заявки
     * @return
     * @throws Exception
     */
    @Override
    public OrderTypesModel get(int id) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT id, code, name, func, modul, codejs, mode, " +
                    "creator, created, changer, changed FROM ordertypes WHERE id = " + id;
            List<OrderTypesModel> result = db.Query(con, sql, OrderTypesModel.class, null);
            if(result.size() == 0){
                throw new Exception("Не удалось получить тип заявки с Id = " + id);
            }
            return result.get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Удаление типа заявки
     * @param id - идентификатор типа заявки
     * @throws Exception
     */
    @Override
    public void delete(int id) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "UPDATE OrderTypes SET Del = 1 - Del WHERE Id = " + id;
            db.Execute(con, sql, null);
        }
        catch(Exception ex){
            throw ex;
        }
    }

}
