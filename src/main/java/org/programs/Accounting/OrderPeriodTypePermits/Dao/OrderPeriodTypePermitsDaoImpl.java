package org.kaznalnrprograms.Accounting.OrderPeriodTypePermits.Dao;


import org.kaznalnrprograms.Accounting.OrderPeriodTypePermits.Interfaces.IOrderPeriodTypePermitsDao;
import org.kaznalnrprograms.Accounting.OrderPeriodTypePermits.Models.ModulePeriodParamsModel;
import org.kaznalnrprograms.Accounting.OrderPeriodTypePermits.Models.OrderPeriodTypePermitsModel;
import org.kaznalnrprograms.Accounting.OrderPeriodTypePermits.Models.OrderPeriodTypePermitsViewModel;
import org.kaznalnrprograms.Accounting.OrderPeriodTypePermits.Models.OrderListModel;
import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;


@Repository
public class OrderPeriodTypePermitsDaoImpl implements IOrderPeriodTypePermitsDao {
    private String appName = "OrderPeriodTypePermits - отображение пер. реквизитов  ";
    private DBUtils db;

    public OrderPeriodTypePermitsDaoImpl(DBUtils db){
        this.db = db;
    }

    /**
     * получение типов заявок
     * @return
     * @throws Exception
     */
    @Override
    public List<OrderListModel> ListOrder() throws Exception{
        try(Connection con = db.getConnection(appName)) {
            String sql = "select id as OrderId, name as OrderName from ordertypes where del = 0 order by name";
            return db.Query(con, sql, OrderListModel.class, null);
            }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    /**
     * получение списка переодических реквизитов в заявках
     * @param id
     * @param filter
     * @return
     * @throws Exception
     */
    @Override
    public List<OrderPeriodTypePermitsViewModel> ListPeriod(int id,String filter) throws Exception{
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new Hashtable<>();
            params.put("id", id);
            String sql =" select opt.id as id,  pp.name as name, ot.name as type,case " +
                        " when opt.isvisible = '1' then 'да' else 'нет'end as visible from OrderPeriodTypePermits  opt " +
                        " join periodparams as pp ON pp.id = opt.periodid join ordertypes as ot on ot.id=opt.ordertypeid " +
                        " WHERE pp.taskcode='orders' and opt.ordertypeid= :id";

            if(!filter.isEmpty()){
                params.put("filter", filter);
                sql +=" AND (pp.name ILIKE '%'||:filter||'%'  OR ot.name ILIKE '%'||:filter||'%')";
            }
            return db.Query(con, sql, OrderPeriodTypePermitsViewModel.class, params);
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    /**
     * получнеи переодических реквизитов
     * @return
     * @throws Exception
     */
    @Override
    public List<ModulePeriodParamsModel> GetListPeriodParams() throws Exception{
        try(Connection con = db.getConnection(appName)) {
              String sql =" select id as periodid, paramcode as periodcode, name as periodname" +
                        " from periodparams " +
                        " where taskcode='orders' and del=0";
            return db.Query(con, sql, ModulePeriodParamsModel.class, null);
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    /**
     * получение реквизита
     * @param id
     * @return
     * @throws Exception
     */
    @Override
    public String GetProperty(int id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "select (id || ' = ' || name) as name from periodparams where id =" + id;
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
     * получение записи
     * @param id
     * @return
     * @throws Exception
     */
    @Override
    public OrderPeriodTypePermitsViewModel get(int id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
                       String sql = " select opt.id, (pp.id || ' = ' || pp.name) as type,  (ot.id || ' = ' || ot.name) as name, opt.isvisible as visible,  opt.creator as creator, opt.created as created, opt.changer as changer , opt.changed as changed " +
                                    " from OrderPeriodTypePermits opt " +
                                    " join periodparams as pp ON pp.id = opt.periodid " +
                                    " join ordertypes as ot on ot.id=opt.ordertypeid " +
                                    " WHERE pp.taskcode='orders' and opt.id=" + id;
            List<OrderPeriodTypePermitsViewModel> result = db.Query(con, sql, OrderPeriodTypePermitsViewModel.class, null);
            if (result.size() == 0) {
                throw new Exception("Не удалось получить реквизит с Id = " + id);
            }
            return result.get(0);

        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * проверка на уникальность
     * @param id
     * @param type
     * @param name
     * @return
     * @throws Exception
     */
    @Override
    public boolean exists(int id, int type,int name) throws Exception{
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            params.put("type", type);
            params.put("name", name);
            String sql = "SELECT COUNT(*) FROM OrderPeriodTypePermits WHERE ordertypeid = :type and periodid = :name AND id <> " + id;
            return db.Query(con, sql, Integer.class, params).get(0) > 0;
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * сохранение
     * @param model
     * @return
     * @throws Exception
     */
    @Override
    public int save(OrderPeriodTypePermitsModel model) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "";
            Map<String, Object> params = new HashMap<>();
            params.put("type", model.getType());
            params.put("name", model.getName());
            params.put("visible", model.getVisible());

            if(model.getId() == -1){
                sql = "INSERT INTO OrderPeriodTypePermits ( ordertypeid, periodid, isvisible)"
                        +" VALUES(:type, :name, :visible)";
                model.setId(db.Execute(con, sql, Integer.class, params));
            }
            else {
                db.CheckLock(con, model.getId(), "orderperiodtypepermits");
                sql = "UPDATE OrderPeriodTypePermits SET ordertypeid = :type, periodid = :name, isvisible = :visible  WHERE id = " + model.getId();
                db.Execute(con, sql, params);
            }

            return model.getType();
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * удаление
     * @param id
     * @throws Exception
     */
    @Override
    public void delete(int id) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "Delete from orderperiodtypepermits WHERE Id = " + id;
            db.Execute(con, sql, null);
        }
        catch(Exception ex){
            throw ex;
        }
    }
}
