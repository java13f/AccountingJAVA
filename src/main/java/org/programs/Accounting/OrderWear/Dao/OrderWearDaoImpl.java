package org.kaznalnrprograms.Accounting.OrderWear.Dao;

import org.kaznalnrprograms.Accounting.OrderWear.Interfaces.IOrderWearDao;
import org.kaznalnrprograms.Accounting.OrderWear.Models.*;
import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.*;
import java.util.stream.Collectors;

@Repository
public class OrderWearDaoImpl implements IOrderWearDao {
    private String appName = "OrderWear - Заявка на износ";
    private DBUtils db;

    public OrderWearDaoImpl(DBUtils db) {
        this.db = db;
    }

    @Override
    public OrderWearObjModel getObj(int id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT id, name, invno||(case when invser is null or invser='' then '' else '-'||invser end) invno, "+
                    "uuid_generate_v4() uniqid FROM objs WHERE id = " + id;
            List<OrderWearObjModel> result = db.Query(con, sql, OrderWearObjModel.class, null);
            if (result.size() == 0) {
                throw new Exception("Не удалось получить запись с Id = " + id);
            }
            return result.get(0);
        } catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public String getNextNo(String date) throws Exception {
        try (Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            params.put("date", date);
            String sql = "select getorder_next_no(cast(:date as timestamp))";
            return db.Query(con, sql, String.class, params).get(0);
        }catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public UserModel getUserFromId(int id) throws Exception {
        try (Connection con = db.getConnection(appName)){
            Map<String,Object> params = new HashMap<>();
            if(id != -1 ){
                params.put("id", id);
            }
            String sql = "select id, name from users where " + (id == -1 ? " code=getusername()" : " id=:id");
            return db.Query(con, sql, UserModel.class, params).get(0);
        }catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public String chkNo(String no, String date) throws Exception {
        try (Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            params.put("no", no);
            params.put("date", date);
            String sql = "select chkorder_no(:no, cast(:date as timestamp)) as chk";
            return db.Query(con, sql, String.class, params).get(0);
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public int save(List<OrderWearSaveModel> model) throws Exception {
        try (Connection con = db.getConnectionWithTran(appName)){
            // ищем родительскую запись
            OrderWearSaveModel parent = null;
            List<OrderWearSaveModel> parents = model.stream().filter(item ->
                    item.getOrderId() != -1 &&
                    item.getOrderParentId() == -1 &&
                    item.getDel() == 0)
                    .collect(Collectors.toList());
            if(parents != null && parents.size() > 0) {
                parent = parents.get(0);
            }
            else{
                parents = model.stream().filter(item ->
                        item.getOrderId() != -1 &&
                                item.getOrderParentId() != -1 &&
                                item.getDel() == 0)
                        .collect(Collectors.toList());
                if(parents != null && parents.size() > 0) {
                    parent = parents.get(0);
                }
            }
            int parentId = -1;
            if(parent != null) {
                parentId = parent.getOrderParentId();
            }
            List<Integer> ids = new ArrayList<>();
            Map<String, Object> params = new HashMap<>();
            // Вставляем или обновляем записи
            for (OrderWearSaveModel item : model) {
                if(item.getDel() == 1) {
                    continue;
                }
                params.clear();
                if(item.getOrderId() != -1){
                    params.put("id", item.getOrderId());
                }
                params.put("ordertypeid", item.getOrderTypeId());
                params.put("no", item.getNo());
                params.put("date", item.getDate());
                params.put("objid", item.getObjId());
                params.put("inituserid", item.getInitUserId());
                params.put("amount", item.getAmount().replace('.', ','));
                params.put("stts", item.getStts());
                String sql = "";
                if(item.getOrderId() == -1) {
                    sql = "INSERT INTO orders (ordertypeid, no, date, objid, inituserid, amount, stts, parentid) VALUES " +
                            "(:ordertypeid, :no, cast(:date as timestamp), :objid, :inituserid, cast(:amount as money), :stts, NULL)";
                }
                else {
                    sql = "UPDATE orders SET ordertypeid=:ordertypeid, " +
                            "no=:no, " +
                            "date=cast(:date as timestamp), " +
                            "objid=:objid, " +
                            "inituserid=:inituserid, " +
                            "amount=cast(:amount as money), " +
                            "stts=:stts, " +
                            "parentid=NULL " +
                            "WHERE id=:id";
                }
                ids.add(db.Execute(con, sql, Integer.class, params));
            }

            // Обновляем parentId
            if(parentId == -1 || !ids.contains(parentId)) {
                Collections.sort(ids);
                parentId = ids.get(0);
            }
            String idsStr = String.join(",",  ids.stream().map(Object::toString).collect(Collectors.toList()));
            params.clear();
            params.put("parentId", parentId);
            db.Execute(con, "UPDATE orders SET parentid=:parentId WHERE id in(" + idsStr + ") AND id<>:parentId", params);

            // Удаляем записи
            for (OrderWearSaveModel item : model) {
                if(item.getDel() == 0 || (item.getDel() == 1 && item.getOrderId() == -1)) {
                    continue;
                }
                params.clear();
                params.put("id", item.getOrderId());
                db.Execute(con, "DELETE FROM orders WHERE id=:id", params);
            }
            con.commit();
            return parentId;
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public OrderViewModel getOrderFromId(int id) throws Exception {
        try (Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            params.put("id", id);
            String sql = "SELECT ord.id orderId, obj.id objId, uuid_generate_v4() uniqid, " +
                    "obj.invno||(case when obj.invser is null or obj.invser='' then '' else '-'||obj.invser end) invno, " +
                    "obj.name \"name\", ord.amount::decimal \"amount\", ord.no \"no\", to_char(ord.date, 'dd.MM.yyyy') \"date\", " +
                    "ord.initUserId initUserId, ord.stts stts, 0 del, case when ord.parentid is NULL then -1 else ord.parentid end orderParentId, " +
                    "ord.creator||' '||to_char(ord.created, 'dd.MM.yyyy HH24:MI:ss') \"create\", " +
                    "case when ord.changer is null then '' else ord.changer||' '||to_char(ord.changed, 'dd.MM.yyyy HH24:MI:ss') end \"change\" " +
                    "FROM orders ord " +
                    "JOIN objs obj ON obj.id=ord.objid " +
                    "WHERE ord.id=:id OR ord.parentid=:id ORDER BY ord.id";
            OrderViewModel order = new OrderViewModel();
            order.setObjsList(db.Query(con, sql, ObjsViewModel.class, params));
            ObjsViewModel parent =  order.getObjsList().stream().filter(item ->
                    item.getOrderParentId() == -1)
                    .collect(Collectors.toList()).get(0);
            order.setId(parent.getOrderId());
            order.setNo(parent.getNo());
            order.setDate(parent.getDate());
            order.setInitUserId(parent.getInitUserId());
            order.setStts(parent.getStts());
            order.setCreate(parent.getCreate());
            order.setChange(parent.getChange());
            return order;
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public boolean checkDay(String date) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("date", date);
            String sql = "SELECT count(*) cnt FROM today WHERE date = CAST(:date as timestamp without time zone) AND openmode = 1";
            List<Integer> result = db.Query(con, sql, Integer.class, params);
            if (result != null) {
                if (result.get(0) > 0) {
                    return true;
                }
            } else {
                throw new Exception("Не удалось получить значение дня.");
            }
            result = null;
            sql = "SELECT count(*) cnt FROM todayusers tu " +
                    "JOIN users u ON u.id=tu.userid " +
                    "JOIN today t ON t.id=tu.todayid " +
                    "WHERE u.code = (SELECT getusername()) AND tu.del = 0";
            result = db.Query(con, sql, Integer.class, null);
            if (result != null) {
                return result.get(0) > 0;
            } else {
                throw new Exception("Не удалось получить значение дня.");
            }
        } catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public String checkInitUser(int userid) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("userid", userid);
            String sql =
                    "select U.Name from Users U " +
                            "join Deps D on D.id=U.depid " +
                            "join Kter kt on kt.id=D.kterid " +
                            "where U.id=:userid " +
                            "and kt.id IN (SELECT kterid FROM get_user_deps('Orders.dll','ViewAllOrders')) ";
            List<String> res = db.Query(con, sql, String.class, params);
            if (res.size() == 0) {
                sql = "select Name from Users where id=:userid";
                res = db.Query(con, sql, String.class, params);
                return "Невозможно выбрать пользователя " + res.get(0) + ", так как у вас нет на это прав.";
            }
            return "";
        } catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public String checkExpObjs(int objid, String date) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String,Object> params = new HashMap<>();
            params.put("objid", objid);
            params.put("date", date);
            String sql = "select " +
                    "case when count(*)=0 then 'Объект '||(select '('||:objid||') - '||\"name\" from objs where id=:objid)||' на дату '||:date||' не введен в эксплуатацию' else '' end res " +
                    "from expl_trms " +
                    "join (select expl_trms.obj_id::text || to_char(max(expl_trms.date_beg),'dd.mm.yyyy') date_beg " +
                    "   from expl_trms where expl_trms.obj_id=:objid AND expl_trms.date_beg <= cast(:date as timestamp) " +
                    "   AND (expl_trms.date_end > cast(:date as timestamp) OR expl_trms.date_end is NULL) " +
                    "group by expl_trms.obj_id " +
                    ") e0 on e0.date_beg=expl_trms.obj_id::text || to_char(expl_trms.date_beg,'dd.mm.yyyy')";
            return db.Query(con, sql, String.class, params).get(0);
        } catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public String checkExpObjsArray(int[] objid, String date) throws Exception {
        try {
            StringBuilder sb = new StringBuilder();
            for (int i : objid) {
                String res = checkExpObjs(i, date);
                if(res.length() > 0){
                    sb.append(res);
                    sb.append("<br><br>");
                }
            }
            return sb.toString();
        }
        catch (Exception ex){
            throw ex;
        }
    }
}
