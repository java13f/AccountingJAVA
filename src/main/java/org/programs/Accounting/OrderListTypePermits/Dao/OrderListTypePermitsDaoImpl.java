package org.kaznalnrprograms.Accounting.OrderListTypePermits.Dao;

import org.kaznalnrprograms.Accounting.OrderListTypePermits.Interfaces.IOrderListTypePermitsDao;
import org.kaznalnrprograms.Accounting.OrderListTypePermits.Models.ModuleListParamsModel;
import org.kaznalnrprograms.Accounting.OrderListTypePermits.Models.OrderListTypePermitsViewModel;
import org.kaznalnrprograms.Accounting.OrderListTypePermits.Models.OrderTypeModel;
import org.kaznalnrprograms.Accounting.OrderListTypePermits.Models.OrderListTypePermitsModel;
import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;

@Repository
public class OrderListTypePermitsDaoImpl implements IOrderListTypePermitsDao {
    private String appName = "OrderListTypePermits - отображение доп. реквизитов";
    private DBUtils db;

    public OrderListTypePermitsDaoImpl(DBUtils db){
        this.db = db;
    }

    /**
     * Получение типов заявок
     * @return
     * @throws Exception
     */
    @Override
    public List<OrderTypeModel> getOrderTypeList() throws Exception{
        try(Connection con = db.getConnection(appName)) {
            String sql = "select id, name from ordertypes where del = 0 order by name";
            return db.Query(con, sql, OrderTypeModel.class, null);
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    /**
     * Получение списка дополнительных реквизитов в заявках
     * @param orderTypeId
     * @param filter
     * @return
     * @throws Exception
     */
    @Override
    public List<OrderListTypePermitsViewModel> getOrderListTypePerList(int orderTypeId, String filter) throws Exception{
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new Hashtable<>();
            params.put("id", orderTypeId);
            String sql ="select oltp.id, lp.name as listParamId, ot.name as orderTypeId, case when oltp.isvisible = '1' then 'да' else 'нет'end as visible " +
                        "from orderlisttypepermits oltp " +
                        "join listparams lp on lp.id = oltp.paramid " +
                        "join ordertypes ot on ot.id = oltp.ordertypeid " +
                        "WHERE lp.taskcode='orders' and oltp.ordertypeid=:id";

            if(!filter.isEmpty()){
                params.put("filter", filter);
                sql +=" AND (lp.name ILIKE '%'||:filter||'%'  OR ot.name ILIKE '%'||:filter||'%')";
            }
            return db.Query(con, sql, OrderListTypePermitsViewModel.class, params);
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    /**
     * Получени дополнительных реквизитов
     * @return
     * @throws Exception
     */
    @Override
    public List<ModuleListParamsModel> getListParamsList() throws Exception{
        try(Connection con = db.getConnection(appName)) {
              String sql ="select id, paramcode as code, name " +
                            "from listparams " +
                            "where taskcode='orders' and del=0";
            return db.Query(con, sql, ModuleListParamsModel.class, null);
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    /**
     * Получение реквизита
     * @param id
     * @return
     * @throws Exception
     */
    @Override
    public String getListParamById(int id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "select (id || ' = ' || name) as name from listparams where id =" + id;
            List<String> result = db.Query(con, sql, String.class, null);

            if (result.size() == 0) {
                throw new Exception("Не удалось получить реквизит с Id = " + id);
            }

            return result.get(0);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получение записи
     * @param id
     * @return
     * @throws Exception
     */
    @Override
    public OrderListTypePermitsViewModel getOrderListTypePerById(int id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "select oltp.id, (lp.id || ' = ' || lp.name) as listParamId,  (ot.id || ' = ' || ot.name) as orderTypeId, oltp.isvisible as visible, " +
                        "       oltp.creator, oltp.created, oltp.changer, oltp.changed " +
                        "from orderlisttypepermits oltp " +
                        "join listparams lp on lp.id = oltp.paramid " +
                        "join ordertypes ot on ot.id = oltp.ordertypeid " +
                        "WHERE lp.taskcode='orders' and oltp.id=" + id;

            List<OrderListTypePermitsViewModel> result = db.Query(con, sql, OrderListTypePermitsViewModel.class, null);

            if (result.size() == 0) {
                throw new Exception("Не удалось получить реквизит с Id = " + id);
            }

            return result.get(0);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Проверка на уникальность
     * @param id
     * @param orderTypeId
     * @param orderTypeId
     * @return
     * @throws Exception
     */
    @Override
    public boolean exists(int id, int orderTypeId, int listParamId) throws Exception{
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();

            params.put("orderTypeId", orderTypeId);
            params.put("listParamId", listParamId);

            String sql = "SELECT COUNT(*) FROM OrderListTypePermits WHERE ordertypeid = :orderTypeId and paramid = :listParamId AND id <> " + id;

            boolean res = db.Query(con, sql, Integer.class, params).get(0) > 0;
            return res;
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Сохранение
     * @param model
     * @return
     * @throws Exception
     */
    @Override
    public int save(OrderListTypePermitsModel model) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "";
            Map<String, Object> params = new HashMap<>();
            params.put("orderTypeId", model.getOrderTypeId());
            params.put("listParamId", model.getListParamId());
            params.put("visible", model.getVisible());

            if(model.getId() == -1){
                sql = "INSERT INTO OrderListTypePermits ( ordertypeid, paramid, isvisible)"
                        +" VALUES(:orderTypeId, :listParamId, :visible)";
                model.setId(db.Execute(con, sql, Integer.class, params));
            }
            else {
                db.CheckLock(con, model.getId(), "OrderListTypePermits");
                sql = "UPDATE OrderListTypePermits SET ordertypeid = :orderTypeId, paramid = :listParamId, isvisible = :visible  WHERE id = " + model.getId();
                db.Execute(con, sql, params);
            }

            return model.getOrderTypeId();
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Удаление
     * @param id
     * @throws Exception
     */
    @Override
    public void delete(int id) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "delete from OrderListTypePermits WHERE Id = " + id;
            db.Execute(con, sql, null);
        }
        catch(Exception ex){
            throw ex;
        }
    }
}
