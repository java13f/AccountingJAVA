package org.kaznalnrprograms.Accounting.Orders.Dao;

import org.kaznalnrprograms.Accounting.Orders.Interfaces.IOrdersDao;
import org.kaznalnrprograms.Accounting.Orders.Models.*;
import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.*;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@Repository
public class OrdersDaoImpl implements IOrdersDao {
    private String appName = "Orders - Заявки";
    private DBUtils db;

    public OrdersDaoImpl(DBUtils db) {
        this.db = db;
    }

    @Override
    public List<OrdersViewModel> list(OrdersFilterModel filterModel) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            String sql = "SELECT ord.id, ot.id as ordertypeid, ot.code ordertypecode, ot.name as ordertype, ot.codejs, ord.no, to_char(ord.date, 'dd.mm.yyyy') date, obj.name, obj.invno, u.name as initusername, uw.name as workusername, " +
                    "CASE WHEN ord.stts = 0 THEN 'новая' ELSE " +
                    "   CASE WHEN ord.stts = 1 THEN 'приостановлена' ELSE " +
                    "       CASE WHEN ord.stts = 2 THEN 'в работе' ELSE " +
                    "           CASE WHEN ord.stts = 3 THEN 'исполнена' ELSE 'отклонена' " +
                    "           END " +
                    "       END " +
                    "   END " +
                    "END as stts, " +
                    "CASE WHEN l.lparamid is NULL THEN -1 ELSE l.lparamid END lparamid, l.lparamcode, l.lparamname, l.lvalueval, l.lvaluename, " +
                    "CASE WHEN p.pparamid is NULL THEN -1 ELSE p.pparamid END pparamid, p.pparamcode, p.pparamname, p.pvalueval, p.pvaluename " +
                    "FROM orders ord " +
                    "JOIN ordertypes ot ON ot.id = ord.ordertypeid " +
                    " " +
                    "LEFT JOIN (SELECT lp.id lparamid, lp.paramcode lparamcode, lp.name lparamname, " +
                    "lv.ownerid, lv.val lvalueval, olp.ordertypeid, " +
                    "CASE WHEN lp.reffertable IS NOT NULL AND lv.val IS NOT NULL THEN " +
                    "(select get_name_from_var_table(lp.reffertable, lv.val)) " +
                    "ELSE '' " +
                    "END lvaluename " +
                    "FROM listparams lp " +
                    "JOIN orderlisttypepermits olp ON olp.paramid = lp.id " +
                    "LEFT JOIN listvalues lv ON lv.paramid=lp.id  " +
                    "WHERE lower(lp.taskcode)='orders' " +
                    "AND lp.del=0) l on l.ownerid = ord.id and l.ordertypeid = ord.ordertypeid" +
                    " " +
                    "LEFT JOIN (SELECT pp.id pparamid, pp.paramcode pparamcode, pp.name pparamname, " +
                    "pv.ownerid, pv.val pvalueval, opp.ordertypeid, " +
                    "CASE WHEN pp.reffertable IS NOT NULL AND pv.val IS NOT NULL THEN " +
                    "(select get_name_from_var_table(pp.reffertable, pv.val)) " +
                    "ELSE '' " +
                    "END pvaluename " +
                    "FROM periodparams pp " +
                    "JOIN orderperiodtypepermits opp ON opp.periodid = pp.id " +
                    "LEFT JOIN periodvalues pv ON pv.paramid = pp.id " +
                    "WHERE lower(pp.taskcode)='orders' " +
                    "AND pp.del=0) p on p.ownerid = ord.id and p.ordertypeid = ord.ordertypeid " +
                    " " +
                    "JOIN users u ON u.id = ord.inituserid " +
                    "LEFT JOIN users uw ON uw.id = ord.workuserid " +
                    "LEFT JOIN problems pb ON pb.id = ord.problemid " +
                    "JOIN objs obj ON obj.id = ord.objid " +
                    "JOIN deps d ON d.id = u.depid " +
                    "JOIN kter kt ON kt.id = d.kterid " +
                    "WHERE ord.parentid IS NULL " +
                    "AND kt.id IN (SELECT kterid FROM get_user_deps('Orders.dll','ViewAllOrders')) ";
            // Параметры фильтра
            if (filterModel.getIsDtStart() == 1) {
                if (filterModel.getDtStart() != null) {
                    if (!filterModel.getDtStart().isEmpty()) {
                        params.put("dtStart", filterModel.getDtStart());
                        sql += "AND ord.date >= CAST(:dtStart as timestamp without time zone) ";
                    }
                }
            }
            if (filterModel.getIsDtEnd() == 1) {
                if (filterModel.getDtEnd() != null) {
                    if (!filterModel.getDtEnd().isEmpty()) {
                        params.put("dtEnd", filterModel.getDtEnd());
                        sql += "AND ord.date <= CAST(:dtEnd as timestamp without time zone) ";
                    }
                }
            }
            if (filterModel.getInvNo() != null) {
                if (!filterModel.getInvNo().isEmpty()) {
                    params.put("invNo", filterModel.getInvNo());
                    sql += "AND obj.invno ILIKE '%' || :invNo || '%' ";
                }
            }
            if (filterModel.getNo() != null) {
                if (!filterModel.getNo().isEmpty()) {
                    params.put("no", filterModel.getNo());
                    sql += "AND ord.no ILIKE  '%' || :no || '%' ";
                }
            }
            if (filterModel.getInitUser() != null) {
                if (!filterModel.getInitUser().isEmpty()) {
                    params.put("initUser", filterModel.getInitUser());
                    sql += "AND u.name ILIKE '%' || :initUser || '%' ";
                }
            }
            if (filterModel.getWorkUser() != null) {
                if (!filterModel.getWorkUser().isEmpty()) {
                    params.put("workUser", filterModel.getWorkUser());
                    sql += "AND uw.name ILIKE '%' || :workUser || '%' ";
                }
            }
            if (filterModel.getName() != null) {
                if (!filterModel.getName().isEmpty()) {
                    params.put("name", filterModel.getName());
                    sql += "AND obj.name ILIKE '%' || :name || '%' ";
                }
            }
            if (filterModel.getType() != -1) {
                params.put("type", filterModel.getType());
                sql += "AND ot.id = :type ";
            }
            String stts = "";
            if (filterModel.getSttsNew() == 1) {
                stts += "0,";
            }
            if (filterModel.getSttsPaused() == 1) {
                stts += "1,";
            }
            if (filterModel.getSttsWork() == 1) {
                stts += "2,";
            }
            if (filterModel.getSttsCompleted() == 1) {
                stts += "3,";
            }
            if (filterModel.getSttsRejects() == 1) {
                stts += "-1,";
            }
            if (stts.length() > 0) {
                stts = stts.substring(0, stts.length() - 1);
                sql += "AND ord.stts IN (" + stts + ") ";
            }
            sql += "ORDER BY ord.id";

            // получение списка заявок с базы
            List<OrdersViewModel> queryList = db.Query(con, sql, OrdersViewModel.class, params);
            // группировка по Id
            Map<Integer, List<OrdersViewModel>> map = queryList.stream().collect(Collectors.groupingBy(OrdersViewModel::getId, toList()));
            // преобразование значений Map в список
            List<OrdersViewModel> orders = map.entrySet().stream().map(e -> e.getValue().iterator().next()).collect(toList());
            // Заполнение списков реквизитов в заяках.
            for (int i = 0; i < queryList.size(); i++) {
                OrdersViewModel currentFromAll = queryList.get(i);
                OrdersViewModel current = orders.stream().filter(n -> n.getId() == currentFromAll.getId()).findFirst().orElse(null);

                if (current != null) {
                    if (currentFromAll.getLparamid() != -1) {
                        OrdersParamsValuesModel l = new OrdersParamsValuesModel();
                        l.setParamid(currentFromAll.getLparamid());
                        l.setParamname(currentFromAll.getLparamname());
                        l.setParamcode(currentFromAll.getLparamcode());
                        l.setValueval(currentFromAll.getLvalueval());
                        l.setValuename(currentFromAll.getLvaluename());
                        current.addToListValues(l);
                    }
                    if (currentFromAll.getPparamid() != -1) {
                        OrdersParamsValuesModel p = new OrdersParamsValuesModel();
                        p.setParamid(currentFromAll.getPparamid());
                        p.setParamname(currentFromAll.getPparamname());
                        p.setParamcode(currentFromAll.getPparamcode());
                        p.setValueval(currentFromAll.getPvalueval());
                        p.setValuename(currentFromAll.getPvaluename());
                        current.addToPeriodValues(p);
                    }
                }
            }

            // Фильтр по реквизитам
            List<OrdersViewModel> notNullList;
            List<OrdersViewModel> filteredList;
            if (
                    (filterModel.getListParamId() != -1 && !filterModel.getListParamValDisplay().isEmpty())
                            &&
                            (filterModel.getPeriodParamId() != -1 && !filterModel.getPeriodParamValDisplay().isEmpty())
            ) { // Если выбраны оба реквизита
                notNullList = orders.stream()
                        .filter(o -> o.getListValues() != null && o.getPeriodValues() != null)
                        .collect(Collectors.toList());

                filteredList = notNullList
                        .stream()
                        .filter(o ->
                                (
                                        (o.getPeriodValues().iterator().next().getParamid() == filterModel.getPeriodParamId()
                                                && o.getPeriodValues().iterator().next().getValueDisplay().contains(filterModel.getPeriodParamValDisplay()))
                                                &&
                                                (o.getListValues().iterator().next().getParamid() == filterModel.getListParamId()
                                                        && o.getListValues().iterator().next().getValueDisplay().contains(filterModel.getListParamValDisplay()))
                                )
                        ).collect(toList());
            } else if (filterModel.getListParamId() != -1 && !filterModel.getListParamValDisplay().isEmpty()) { // Если выбран только дополнительный реквизит
                notNullList = orders.stream()
                        .filter(o -> o.getListValues() != null)
                        .collect(Collectors.toList());

                filteredList = notNullList
                        .stream()
                        .filter(o ->
                                (
                                        o.getListValues().iterator().next().getParamid() == filterModel.getListParamId()
                                                && o.getListValues().iterator().next().getValueDisplay().contains(filterModel.getListParamValDisplay())
                                )
                        ).collect(toList());
            } else if (filterModel.getPeriodParamId() != -1 && !filterModel.getPeriodParamValDisplay().isEmpty()) { // Если выбран только периодический реквизит
                notNullList = orders.stream()
                        .filter(o -> o.getPeriodValues() != null)
                        .collect(Collectors.toList());

                filteredList = notNullList
                        .stream()
                        .filter(o ->
                                (
                                        o.getPeriodValues().iterator().next().getParamid() == filterModel.getPeriodParamId()
                                                && o.getPeriodValues().iterator().next().getValueDisplay().contains(filterModel.getPeriodParamValDisplay())
                                )
                        ).collect(toList());
            } else {
                filteredList = orders;
            }

            filteredList = filteredList.stream()
                    .sorted(Comparator.comparing(OrdersViewModel::getId))
                    .collect(toList());

            return filteredList;
        } catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public List<OrdersTypesModel> listOrderTypes() throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT id, name, code, codejs FROM ordertypes WHERE del = 0 ORDER BY id";
            return db.Query(con, sql, OrdersTypesModel.class, null);
        } catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public List<OrdersParamsModel> listPeriodAndListParams() throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT lp.id, lp.paramcode, lp.name as paramname, 'listparams' tablename, " +
                    "lp.reffermodul, lp.refferfunc, lp.reffertable, lp.taskcode  " +
                    "FROM listparams lp  " +
                    "WHERE lp.del = 0 AND lp.taskcode = 'orders' " +
                    "AND lp.paramcode NOT IN (SELECT paramcode FROM periodparams WHERE taskcode = 'objs') " +
                    "UNION ALL " +
                    "SELECT lp.id, lp.paramcode, lp.name as paramname, 'periodparams' tablename, " +
                    "lp.reffermodul, lp.refferfunc, lp.reffertable, lp.taskcode " +
                    "FROM listparams lp " +
                    "WHERE lp.del = 0 AND lp.taskcode = 'orders'" +
                    "AND lp.paramcode IN (SELECT paramcode FROM periodparams WHERE taskcode = 'objs')";
            return db.Query(con, sql, OrdersParamsModel.class, null);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Запрос для получения строки в формате id = name (универсальный)
     *
     * @param table - Имя таблицы
     * @param id    - Идентификатор записи в таблице
     * @return
     * @throws Exception
     */
    @Override
    public String getDataFromTableById(String table, int id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("table", table);
            String sql = "SELECT CASE WHEN r.getobject_id IS NULL THEN -1 ELSE 1 END TableId FROM " +
                    " (SELECT getobject_id(:table)) r";
            List<String> result = db.Query(con, sql, String.class, params);
            if (Integer.parseInt(result.get(0)) != 1) {
                throw new Exception("Таблица с именем '" + table + "' не найдена");
            } else {
                String sql1 = "SELECT (id || ' = ' || name) as name FROM " + table + " WHERE id =  " + id;
                List<String> result1 = db.Query(con, sql1, String.class, null);
                if (result1.size() == 0) {
                    throw new Exception("Не найден тип объекта с ID = " + id);
                }
                return result1.get(0);
            }
        } catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public void deleteOrder(int id) throws Exception {
        try (Connection con = db.getConnectionWithTran(appName)) {
            Map<String, Object> params = new HashMap<>();
            String sql = "";
            List<Integer> listIds = new ArrayList<>();
            List<Integer> periodIds = new ArrayList<>();
            String orderDate;
            String orderTypeCode;

            sql = "SELECT id FROM listvalues WHERE ownerid IN (SELECT id FROM orders WHERE (parentid = " + id + " OR id = " + id + ") " +
                    "AND stts = 0 " +
                    "AND paramid IN (SELECT id FROM listparams WHERE taskcode = 'orders')" +
                    ")";
            listIds = db.Query(con, sql, Integer.class, null);

            sql = "SELECT id FROM periodvalues WHERE ownerid IN (SELECT id FROM orders WHERE (parentid = " + id + " OR id = " + id + ") " +
                    "AND stts = 0 " +
                    "AND paramid IN (SELECT id FROM periodparams WHERE taskcode = 'orders')" +
                    ")";
            periodIds = db.Query(con, sql, Integer.class, null);

            if (listIds.size() > 0) {
                for (int i = 0; i < listIds.size(); i++) {
                    sql = "DELETE FROM imgvalues WHERE objectid = getobject_id('listvalues') AND recid = " + id;
                    db.Execute(con, sql, null);
                }
            }

            if (periodIds.size() > 0) {
                for (int i = 0; i < periodIds.size(); i++) {
                    sql = "DELETE FROM imgvalues WHERE objectid = getobject_id('periodvalues') AND recid = " + id;
                    db.Execute(con, sql, null);
                }
            }

            sql = "DELETE FROM listvalues WHERE ownerid IN (SELECT id FROM orders WHERE (parentid = " + id + " OR id = " + id + ") " +
                    "AND stts = 0 " +
                    "AND paramid IN (SELECT id FROM listparams WHERE taskcode = 'orders')" +
                    ")";
            db.Execute(con, sql, null);

            sql = "DELETE FROM periodvalues WHERE ownerid IN (SELECT id FROM orders WHERE (parentid = " + id + " OR id = " + id + ") " +
                    "AND stts = 0" +
                    "AND paramid IN (SELECT id FROM periodparams WHERE taskcode = 'orders')" +
                    ")";
            db.Execute(con, sql, null);

            sql = "SELECT ot.code FROM orders ord JOIN ordertypes ot ON ot.id = ord.ordertypeid WHERE ord.id = " + id;
            orderTypeCode = db.Query(con, sql, String.class, null).get(0);

            if (orderTypeCode.equals("09")) {
                sql = "SELECT date::varchar FROM orders WHERE id = " + id;
                orderDate = db.Query(con, sql, String.class, null).get(0);

                params.put("date", orderDate);
                sql = "DELETE FROM wear_calc WHERE date = :date::timestamp without time zone";
                db.Execute(con, sql, params);
                params.remove("date");
            }

            sql = "DELETE FROM Orders WHERE parentid = " + id;
            db.Execute(con, sql, null);
            sql = "DELETE FROM orders WHERE id = " + id;
            db.Execute(con, sql, null);
            con.commit();
        } catch (Exception ex) {
            throw ex;
        }
    }
}
