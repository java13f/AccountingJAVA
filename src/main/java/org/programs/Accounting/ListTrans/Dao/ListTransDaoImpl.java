package org.kaznalnrprograms.Accounting.ListTrans.Dao;



import org.kaznalnrprograms.Accounting.ListTrans.Interfaces.IListTransDao;
import org.kaznalnrprograms.Accounting.ListTrans.Models.GetListTransModel;
import org.kaznalnrprograms.Accounting.ListTrans.Models.ListParamsModels;
import org.kaznalnrprograms.Accounting.ListTrans.Models.ListTransModel;
import org.kaznalnrprograms.Accounting.ListTrans.Models.ListTransViewModel;

import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;


import java.util.*;


@Repository
public class ListTransDaoImpl implements IListTransDao {
    private String appName = "Список сохраненных доп. реквизитов карточек объектов";
    private DBUtils db;
    public ListTransDaoImpl(DBUtils db){
        this.db = db;
    }

    /**
     * получение списка записей
     * @return
     * @throws Exception
     */
    @Override
    public List<ListTransViewModel> list() throws Exception{
        Map<String, Object> params = new Hashtable<>();
        try(Connection con = db.getConnection(appName)){

            String sql = " select li.id as Id,  li.orderid as Number,  to_char( DATE_TRUNC('second', Date), 'DD.MM.YYYY') as  Data,  ot.name as Type,  oj.invno as Inv ,  oj.name as Objname,  lipar.name as Liname,  li.val as Values " +
                         " from listtrans li  join orders ord on ord.id = li.orderid  join listparams lipar on lipar.paramcode = li.paramcode  join ordertypes ot on ot.id = ord.ordertypeid  join objs oj on ord.objid = oj.id " +
                         " where ot.del=0 and lipar.taskcode = 'orders' order by li.id";
              return db.Query(con, sql, ListTransViewModel.class, params);
        }
        catch(Exception ex){
            throw ex;
        }
    }
    /**
     * загрузка ComboBox
     * @return
     * @throws Exception
     */
    @Override
    public List<ListParamsModels> GetListParams() throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "select id as id, " +
                         " CAST(id as VARCHAR(128)) || ' = ' || paramcode || ' = ' || name as Name, " +
                         " reffermodul as Reffers " +
                         " From ListParams " +
                         " where taskcode = 'orders' and del= 0 " +
                         " order by name ";
            return db.Query(con, sql, ListParamsModels.class, null);
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * обработка значений в Combobox
     * @param id
     * @return
     * @throws Exception
     */
    @Override
    public String GetReffers(int id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "select refferfunc as reffers from listparams where taskcode = 'orders' and id =" + id;
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
     * добавление-редактирование
     * @param obj
     * @return
     * @throws Exception
     */
    @Override
    public int save(ListTransModel obj) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "";
            Map<String, Object> params = new HashMap<>();
            params.put("orders", obj.getOrder());
            params.put("params", obj.getParams());
            params.put("values", obj.getValues());

            if(obj.getId() == -1){
                sql = " INSERT INTO listtrans (paramcode , orderid , val) values (:params , :orders , :values) ";
                obj.setId(db.Execute(con, sql, Integer.class, params));
            }
            else {
                db.CheckLock(con, obj.getId(), "listtrans");
                sql = "update listtrans set  orderid = :orders,  paramcode = :params, val = :values where id =  " + obj.getId();
                db.Execute(con, sql, params);
            }

            return obj.getId();
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * получение значения заявки
     * @param id
     * @return
     * @throws Exception
     */
    @Override
    public String getOrders(String id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
                String sql = "select ord.id || ' = ' || to_char( DATE_TRUNC('second', Date), 'DD.MM.YYYY')|| '  ' || ot.name  || '  ' || oj.name as name " +
                        "  from orders as ord " +
                        " join ordertypes ot on ot.id = ord.ordertypeid " +
                        " join objs oj on ord.objid = oj.id" +
                        " where ord.id = " + id;
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
     * получение списка значекний при открытии на редактирование
     * @param id
     * @return
     * @throws Exception
     */
    @Override
    public GetListTransModel get(int id) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = " select li.id as id, " +
                    " li.orderid as order, " +
                    " li.val as values, " +
                    " lipar.id as params, " +
                    " li.creator, " +
                    " li.created, " +
                    " li.changer, " +
                    " li.changed, " +
                    "lipar.reffertable as tables"+
                    " from listtrans li " +
                    " join listparams lipar on lipar.paramcode = li.paramcode " +
                    " where  lipar.taskcode = 'orders' and li.id = " + id;
            List<GetListTransModel> result = db.Query(con, sql, GetListTransModel.class, null);
            if(result.size() == 0){
                throw new Exception("Не удалось получить территорию с Id = " + id);
            }
            return result.get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }
    /**
     * проверка на уникальность
     * @param id
     * @param order
     * @param params
     * @return
     * @throws Exception
     */
    @Override
    public boolean exists(int id, int order,String params) throws Exception{
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> param = new HashMap<>();
            param.put("order", order);
            param.put("params", params);
            String sql = "SELECT COUNT(*) FROM listtrans WHERE orderid = :order AND paramcode = :params  AND id <> " + id;
            return db.Query(con, sql, Integer.class, param).get(0) > 0;
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
            String sql = "Delete from ListTrans WHERE Id = " + id;
            db.Execute(con, sql, null);
        }
        catch(Exception ex){
            throw ex;
        }
    }
    /**
     * получение значения
     * @param id
     * @param name
     * @return
     * @throws Exception
     */
    @Override
    public String getValuesText(int id ,String name) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> param = new HashMap<>();
            param.put("name", name);

            String table = "select  getobject_id(:name)";
            List<String> existtable = db.Query(con, table, String.class, param);
            if (existtable.get(0) == null){
                throw new Exception("Не удалось найти таблицу с таким названием! ");
            }
            String sql = "select (id || ' = ' || name) as names from "+name+" where id =  " + id;
            List<String> result = db.Query(con, sql, String.class, null);
            if (result.size() == 0) {
                throw new Exception("Не удалось получить запись с Id = " + id);
            }
            return result.get(0);     

        } catch (Exception ex) {
            throw ex;
        }
    }


}

