package org.kaznalnrprograms.Accounting.OrderUniversal.Dao;

import org.kaznalnrprograms.Accounting.OrderUniversal.Interfaces.IOrderUniversalDao;
import org.kaznalnrprograms.Accounting.OrderUniversal.Models.*;
import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Repository
public class OrderUniversalDaoImpl implements IOrderUniversalDao {
    private String appName = "OrderUniversal - Универсальная заявка";
    private DBUtils db;

    public OrderUniversalDaoImpl(DBUtils db) {
        this.db = db;
    }

    /**
     * Получение данных заявки по ID
     *
     * @param id
     * @return
     * @throws Exception
     */
    @Override
    public OrderUniversalModel getOrder(int id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT od.id, od.ordertypeid, ot.name ordertypename, od.no, to_char(od.date, 'DD.MM.YYYY') date, od.objid, oj.name objname, " +
                    "ui.id inituserid, uw.id workuserid, ui.name initusername, uw.name workusername, CAST(od.amount::decimal as character varying) amount, od.problemid, " +
                    "od.probleminfo, to_char(od.dateclose, 'DD.MM.YYYY') dateclose, od.stts, od.info, od.creator, (to_char(od.created, 'DD.MM.YYYY HH:MI:SS')) as created, od.changer, (to_char(od.changed, 'DD.MM.YYYY HH:MI:SS')) as changed, " +
                    "(CASE WHEN od.problemid IS NULL THEN '' ELSE pb.id || ' = ' || pb.name END) problemname, CASE WHEN od.dateclose IS NULL THEN 0 ELSE 1 END isdtclose " +
                    "FROM orders od " +
                    "JOIN ordertypes ot ON ot.id=od.ordertypeid " +
                    "JOIN objs oj ON oj.id=od.objid " +
                    "JOIN users ui ON ui.id=od.inituserid " +
                    "LEFT JOIN users uw ON uw.id=od.workuserid " +
                    "LEFT JOIN problems pb ON pb.id=od.problemid " +
                    "JOIN deps d ON d.id = ui.depid " +
                    "JOIN kter kt ON kt.id = d.kterid " +
                    "WHERE od.id = " + id + " AND kt.id IN (SELECT kterid FROM get_user_deps('Orders.dll','ViewAllOrders')) ";
            OrderUniversalModel model = new OrderUniversalModel();
            List<OrderUniversalModel> result = db.Query(con, sql, OrderUniversalModel.class, null);
            if (result.size() == 0) {
                throw new Exception("Не удалось получить заявку с Id = " + id);
            }
            model = result.get(0);
            return model;
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получение значения реквизита из таблицы
     *
     * @param tablename
     * @param tablevalueval
     * @return
     * @throws Exception
     */
    private String getValueName(String tablename, String tablevalueval) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT CASE WHEN GetObject_Id('" + tablename + "') IS NOT NULL THEN 1 ELSE 0 END AS flag";
            List<Integer> existsTable = db.Query(con, sql, Integer.class, null);
            if (tablevalueval == null) tablevalueval = "-1";
            if (existsTable.size() == 1) {
                sql = "SELECT name FROM " + tablename + " WHERE id = " + Integer.parseInt(tablevalueval);
                List<String> name = db.Query(con, sql, String.class, null);
                if (name != null) {
                    if (name.size() > 0) {
                        return name.get(0);
                    }
                }
            }
            return "";
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получение разноимённых дополнительных реквизитов заявки
     *
     * @param orderid
     * @param ordertype
     * @return
     * @throws Exception
     */
    @Override
    public List<OrderUniversalValueModel> getListValues(int orderid, int ordertype) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT lp.id ParamId, lp.paramcode, lp.taskcode, lp.name paramname, lp.codejs," +
                    "lp.nom paramnom, lp.strict paramstrict, lp.reffermodul paramreffermodul, " +
                    "lp.refferfunc paramrefferfunc, lp.reffertable paramreffertable, lp.reffercode paramreffercode, " +
                    "lv.id valueid, lv.ownerid valueownerid, lv.val valueval, (select getobject_id('listvalues')) objectid, " +
                    "'' valuename, now() dateval, iv.id imgvalueid " +
                    "FROM listparams lp " +
                    "JOIN orderlisttypepermits olp ON olp.paramid = lp.id " +
                    "LEFT JOIN listvalues lv ON lv.paramid=lp.id AND (lv.ownerid IS NULL OR lv.ownerid=" + orderid + ") " +
                    "LEFT JOIN imgvalues iv ON iv.objectid=getobject_id('listvalues') AND iv.recid=lv.id " +
                    "WHERE lower(lp.taskcode) = 'orders' " +
                    "AND lp.paramcode NOT IN (SELECT paramcode FROM periodparams WHERE lower(taskcode) = 'objs' AND del = 0) " +
                    "AND olp.isvisible = 1 AND olp.ordertypeid = " + ordertype + " " +
                    "AND lp.del = 0";
            List<OrderUniversalValueModel> result = db.Query(con, sql, OrderUniversalValueModel.class, null);
            if (result.size() != 0) {
                for (OrderUniversalValueModel current : result) {
                    String tablename = "";
                    if (current.getParamreffertable() != null) {
                        tablename = current.getParamreffertable();
                    }
                    String tablevalueval = "";
                    if (current.getValueval() != null) {
                        tablevalueval = current.getValueval();
                    }
                    if (!tablevalueval.isEmpty()
                            && !tablename.isEmpty()
                            && !current.getParamreffertable().isEmpty()
                            && !current.getParamrefferfunc().isEmpty()
                            && !current.getParamreffermodul().isEmpty()) {
                        String str = getValueName(tablename, tablevalueval);
                        if (!str.isEmpty()) {
                            current.setValuename(str);
                        }
                    }
                }
            }
            return result;
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получение одноимённых дополнительных заявки с периодическими объекта реквизитов
     *
     * @param orderid
     * @param ordertype
     * @param objid
     * @param date
     * @return
     * @throws Exception
     */
    @Override
    public List<OrderUniversalValueModel> getPeriodValues(int orderid, int ordertype, int objid, String date) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            String sql;
            if (orderid == -1) {
                params.put("dt", date);
                sql = "SELECT lp.id paramid, lp.paramcode, lp.taskcode, lp.name paramname, lp.codejs, " +
                        "lp.nom paramnom, lp.strict paramstrict, lp.reffermodul paramreffermodul, " +
                        "lp.refferfunc paramrefferfunc, lp.reffertable paramreffertable, lp.reffercode paramreffercode, " +
                        "lv.id valueid, " +
                        "CASE WHEN lv.id IS NULL " +
                        "   THEN (SELECT get_period_value(pp.taskcode, pp.paramcode, " + objid + ", CAST(:dt as timestamp without time zone))) " +
                        "   ELSE lv.val " +
                        "END valueval, " +
                        "(SELECT getobject_id('listvalues')) objectid, " +
                        "'' valuename, img.id imgvalueid " +
                        "" +
                        "FROM periodparams pp " +
                        "JOIN listparams lp ON pp.paramcode = lp.paramcode " +
                        "JOIN orderlisttypepermits olp ON olp.paramid = lp.id " +
                        "LEFT JOIN listvalues lv ON lv.paramid = lp.id AND lv.ownerid = " + objid + " " +
                        "LEFT JOIN imgvalues img ON img.objectid = getobject_id('listvalues') AND img.recid = lv.id " +
                        "" +
                        "WHERE lower(lp.taskcode) = 'orders' AND lower(pp.taskcode) = 'objs' " +
                        "AND lp.del = 0 AND pp.del = 0 AND olp.isvisible = 1 AND olp.ordertypeid = " + ordertype;
            } else {
                sql = "SELECT lp.id paramid, lp.paramcode, lp.taskcode, lp.name paramname, lp.codejs, " +
                        "lp.nom paramnom, lp.strict paramstrict, lp.reffermodul paramreffermodul, " +
                        "lp.refferfunc paramrefferfunc, lp.reffertable paramreffertable, lp.reffercode paramreffercode, " +
                        "lv.id valueid, " +
                        "CASE WHEN lv.id IS NULL THEN (SELECT get_period_value(pp.taskcode, pp.paramcode, ord.objid, ord.date)) " +
                        "ELSE lv.val END valueval, " +
                        "(SELECT getobject_id('listvalues')) objectid, " +
                        "'' valuename, img.id imgvalueid " +
                        "" +
                        "FROM periodparams pp " +
                        "JOIN listparams lp ON pp.paramcode = lp.paramcode " +
                        "JOIN orders ord ON ord.id = " + orderid + " " +
                        "JOIN orderlisttypepermits olp ON olp.paramid = lp.id " +
                        "LEFT JOIN listvalues lv ON lv.paramid = lp.id AND lv.ownerid = " + orderid + " " +
                        "LEFT JOIN imgvalues img ON img.objectid = getobject_id('listvalues') AND img.recid = lv.id " +
                        "" +
                        "WHERE lower(lp.taskcode) = 'orders' AND lower(pp.taskcode) = 'objs' " +
                        "AND lp.del = 0 AND pp.del = 0 AND olp.isvisible = 1 AND olp.ordertypeid = " + ordertype;
            }

            List<OrderUniversalValueModel> result = db.Query(con, sql, OrderUniversalValueModel.class, params);
            if (result.size() != 0) {
                for (OrderUniversalValueModel current : result) {
                    String tablename = "";
                    if (current.getParamreffertable() != null) {
                        tablename = current.getParamreffertable();
                    }
                    String tablevalueval = "";
                    if (current.getValueval() != null) {
                        tablevalueval = current.getValueval();
                    }
                    if (!tablevalueval.isEmpty()
                            && !tablename.isEmpty()
                            && !current.getParamreffertable().isEmpty()
                            && !current.getParamrefferfunc().isEmpty()
                            && !current.getParamreffermodul().isEmpty()) {
                        String str = getValueName(tablename, tablevalueval);
                        if (!str.isEmpty()) {
                            current.setValuename(str);
                        }
                    }
                }
            }
            return result;
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получение пользоватебя по ID
     *
     * @param id
     * @return
     * @throws Exception
     */
    @Override
    public OrderUniversalUserModel getUser(int id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT id, name FROM users WHERE id = " + id;
            List<OrderUniversalUserModel> result = db.Query(con, sql, OrderUniversalUserModel.class, null);
            if (result.size() == 0) {
                throw new Exception("Не удалось получить пользователя с Id = " + id);
            }
            return result.get(0);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получение объекта по ID
     *
     * @param id
     * @return
     * @throws Exception
     */
    @Override
    public OrderUniversalObjModel getObj(int id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT id, name FROM objs WHERE id = " + id;
            List<OrderUniversalObjModel> result = db.Query(con, sql, OrderUniversalObjModel.class, null);
            if (result.size() == 0) {
                throw new Exception("Не удалось получить запись с Id = " + id);
            }
            return result.get(0);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получение проблемы по ID
     *
     * @param id
     * @return
     * @throws Exception
     */
    @Override
    public OrderUniversalProblemModel getProblem(int id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT id, name FROM problems WHERE id = " + id;
            List<OrderUniversalProblemModel> result = db.Query(con, sql, OrderUniversalProblemModel.class, null);
            if (result.size() == 0) {
                throw new Exception("Не удалось получить запись с Id = " + id);
            }
            return result.get(0);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получение типа заявки по ID
     *
     * @param id
     * @return
     * @throws Exception
     */
    @Override
    public OrderUniversalOrderTypeModel getOrderType(int id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT id, name, codejs FROM ordertypes WHERE id = " + id;
            List<OrderUniversalOrderTypeModel> result = db.Query(con, sql, OrderUniversalOrderTypeModel.class, null);
            if (result.size() == 0) {
                throw new Exception("Не удалось получить запись с Id = " + id);
            }
            return result.get(0);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получение модели изображения из ImgLock по ID
     *
     * @param id
     * @return
     * @throws Exception
     */
    @Override
    public OrderUniversalImgLockModel getImgLockById(int id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT id, objectid, recid, flagdel, flagchange, userid, sesid, listparamid, periodparamid FROM imgLock WHERE id = " + id;

            List<OrderUniversalImgLockModel> result = db.Query(con, sql, OrderUniversalImgLockModel.class, null);
            if (result.size() == 0) {
                throw new Exception("Не удалось получить запись с Id = " + id);
            }
            return result.get(0);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получение модели изображения
     *
     * @param model
     * @return
     * @throws Exception
     */
    @Override
    public OrderUniversalImgLockModel getImgLockByModel(OrderUniversalImgLockModel model) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("objectid", model.getObjectid());
            params.put("recid", model.getRecid());
            params.put("sesid", model.getSesid());

            String prm = "";

            if (model.getListparamid() != -1) {
                params.put("listparamid", model.getListparamid());
                prm = prm + " AND listparamid = :listparamid ";
            }
            if (model.getPeriodparamid() != -1) {
                params.put("periodparamid", model.getPeriodparamid());
                prm = prm + " AND periodparamid = :periodparamid ";
            }
            String sql = "SELECT id, objectid, recid, flagdel, flagchange, userid, sesid, listparamid, periodparamid " +
                    "FROM imglock " +
                    "WHERE objectid = :objectid " +
                    "AND recid = :recid " +
                    "AND sesid = CAST ( :sesid AS uuid ) " + prm;

            List<OrderUniversalImgLockModel> result = db.Query(con, sql, OrderUniversalImgLockModel.class, params);

            if (result.size() == 0) {
                OrderUniversalImgLockModel lockModel = new OrderUniversalImgLockModel();
                lockModel.setId(-1);
                return lockModel;
            } else {
                return result.get(0);
            }
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получение достпуных полей заявки
     *
     * @param ordertype
     * @return
     * @throws Exception
     */
    @Override
    public List<OrderUniversalSttsPermitsModel> getOrderPermits(int ordertype) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String userCode = db.getUserCode();
            Map<String, Object> params = new HashMap<>();
            params.put("usercode", userCode);
            String sql = "SELECT so.id, orf.code orderfieldcode, so.isenable, so.isvisible, so.ordertypeid, so.groupid, so.orderstts " +
                    "FROM sttsorder so " +
                    "JOIN orderfields orf ON so.orderfieldid = orf.id " +
                    "JOIN usergroups ug ON so.groupid = ug.groupid " +
                    "JOIN users u ON u.id = ug.userid " +
                    "WHERE ordertypeid = " + ordertype + " AND u.code = :usercode " +
                    "ORDER BY orderfieldcode, orderstts";
            List<OrderUniversalSttsPermitsModel> permits = db.Query(con, sql, OrderUniversalSttsPermitsModel.class, params);
            return permits;
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Проверка открыт ли день
     *
     * @param date
     * @return
     * @throws Exception
     */
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

    /**
     * Получение данных из таблицы
     *
     * @param tablename
     * @param id
     * @return
     * @throws Exception
     */
    @Override
    public String getDataFromTable(String tablename, int id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT CASE WHEN GetObject_Id(:tablename) IS NOT NULL THEN 1 ELSE 0 END AS flag";
            Map<String, Object> params = new HashMap<>();
            params.put("tablename", tablename);
            List<Integer> result = db.Query(con, sql, Integer.class, params);
            if (result.get(0) == 1) {
                sql = "SELECT id || ' = ' || name FROM " + tablename + " WHERE id = " + id;
                List<String> result2 = db.Query(con, sql, String.class, null);
                if (result2 != null) {
                    if (result2.size() > 0) {
                        return result2.get(0);
                    } else {
                        throw new Exception("Не удалось получить значение реквизита");
                    }
                }
            } else {
                throw new Exception("Не удалось получить значение реквизита");
            }
            return "";
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Очистка временных таблиц по SesID
     *
     * @param sesid
     * @return
     * @throws Exception
     */
    @Override
    public String ClearLocks(String sesid) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("sesid", sesid);
            String sql = "DELETE FROM imglock WHERE sesid=CAST(:sesid as uuid)";
            db.Execute(con, sql, params);
            return "";
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получение номера заявки
     *
     * @param date
     * @return
     * @throws Exception
     */
    @Override
    public String getOrderNo(String date) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("orderdate", date);
            String sql = "SELECT getorder_next_no(CAST(:orderdate as timestamp)) as no";
            List<String> result = db.Query(con, sql, String.class, params);
            if (result.size() > 0) {
                return result.get(0);
            }
            return "";
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Проверка номера заявки
     *
     * @param no
     * @param date
     * @return
     * @throws Exception
     */
    @Override
    public String checkOrderNo(String no, String date) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("orderdate", date);
            params.put("no", no);
            String sql = "SELECT chkorder_no(:no, CAST(:orderdate as timestamp without time zone)) as res";
            List<String> result = db.Query(con, sql, String.class, params);
            if (result.size() > 0) {
                return result.get(0) == null ? "" : result.get(0);
            }
            return "";
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Проверка объекта на даты
     *
     * @param objid
     * @param date
     * @return
     * @throws Exception
     */
    @Override
    public String checkObjectDates(int objid, String date) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("date", date);
            String sql = "SELECT chk_obj_dates(" + objid + ", CAST(:date as date)) as res";
            List<String> result = db.Query(con, sql, String.class, params);
            if (result.size() > 0) {
                return result.get(0);
            }
            return "";
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Сохранение заявки и проводка
     *
     * @param model
     * @return
     * @throws Exception
     */
    @Override
    public int save(OrderUniversalModel model) throws Exception {
        try (Connection con = db.getConnectionWithTran(appName)) {

            Map<String, Object> params = new HashMap<>();

            String dtclose = "NULL";
            String parentid = "NULL";
            String workuserid = "NULL";
            String problemid = "NULL";
            String probleminfo = "NULL";
            String workinfo = "NULL";
            String info = "NULL";

            if (model.getIsdtclose() == 1) {
                if (model.getDateclose() != null) {
                    params.put("dtclose", model.getDateclose());
                    dtclose = "CAST (:dtclose as timestamp without time zone) ";
                }
            }
            if (model.getParentid() != null) {
                parentid = String.valueOf(model.getParentid());
            }
            if (model.getWorkuserid() != null) {
                workuserid = String.valueOf(model.getWorkuserid());
            }
            if (model.getProblemid() != null) {
                problemid = String.valueOf(model.getProblemid());
            }
            if (model.getProbleminfo() != null) {
                params.put("probleminfo", model.getProbleminfo());
                probleminfo = " :probleminfo ";
            }
            if (model.getWorkinfo() != null) {
                params.put("workinfo", model.getWorkinfo());
                workinfo = " :workinfo ";
            }
            if (model.getInfo() != null) {
                params.put("info", model.getInfo());
                info = " :info ";
            }

            if (model.getNo() == null) {
                throw new Exception("Не заполнено поле \"Номер\".");
            }

            if (model.getProbleminfo() != null && model.getProblemid() != null) {
                throw new Exception("Должно быть заполнено только одно из полей: \"Проблема\" или \"Код проблемы\"");
            }

            params.put("no", model.getNo());
            params.put("amount", model.getAmount());
            params.put("date", model.getDate());

            String sql = "";

            if (model.getId() == -1) {
                sql = "INSERT INTO orders (ordertypeid, no, date, objid, inituserid, workuserid, amount, " +
                        "problemid, probleminfo, workinfo, dateclose, stts, parentid, info) " +
                        "VALUES (" + model.getOrdertypeid() + ", :no, CAST(:date as timestamp without time zone), " + model.getObjid() + ", " +
                        model.getInituserid() + ", " + workuserid + ", CAST(:amount as money), " + problemid + ", " + probleminfo +
                        ", " + workinfo + ", " + dtclose + ", " + model.getStts() + ", " + parentid + ", " + info + ")";
                model.setId(db.Execute(con, sql, Integer.class, params));
            } else {
                db.CheckLock(con, model.getId(), "orders");
                // Получение старого типа заявки для проверки
                sql = "SELECT ordertypeid typeid FROM orders WHERE id = " + model.getId();
                int typeid = db.Query(con, sql, Integer.class, null).get(0);
                if (typeid != model.getOrdertypeid()) { // Если тип заявки изменился
                    List<Integer> lValIds = db.Query(con, "SELECT id FROM listvalues WHERE ownerid = " + model.getId(), Integer.class, null);
                    for (int currId : lValIds) {
                        // Удаление изображений доп реквизита и значений доп реквизитов
                        sql = "DELETE FROM imgvalues WHERE objectid = getobject_id('listvalues') AND recid = " + currId;
                        db.Execute(con, sql, null);
                        sql = "DELETE FROM listvalues WHERE id = " + currId;
                        db.Execute(con, sql, null);
                    }
                }
                // Обновление данных заявки
                sql = "UPDATE orders SET ordertypeid= " + model.getOrdertypeid() + ", no = :no, date = CAST(:date as timestamp without time zone), objid = " + model.getObjid() +
                        ", inituserid = " + model.getInituserid() + ", workuserid = " + workuserid + ", amount = CAST(:amount as money), problemid = " + problemid + "" +
                        ", probleminfo = " + probleminfo + ", workinfo = " + workinfo + ", dateclose =" + dtclose + ", stts = " + model.getStts() +
                        ", info = " + info + " WHERE id = " + model.getId();
                db.Execute(con, sql, params);
            }

            if (model.getListvalues() != null) {
                for (OrderUniversalValueModel val : model.getListvalues()) {
                    SaveValue(con, val, model.getId(), 1);
                }
            }

            if (model.getPeriodvalues() != null) {
                for (OrderUniversalValueModel val : model.getPeriodvalues()) {
                    SaveValue(con, val, model.getId(), 1);
                }
            }
            sql = "SELECT order_trans(" + model.getId() + ")";
            db.Query(con, sql, null);

            ClearLocks(model.getSesid());

            con.commit();

            return model.getId();
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Сохранение реквизита заявки
     *
     * @param con
     * @param val
     * @param ownerid
     * @param flag
     * @throws Exception
     */
    private void SaveValue(Connection con, OrderUniversalValueModel val, int ownerid, int flag) throws Exception {
        Map<String, Object> params = new HashMap<>();
        String sql = "";
        String valueval = "";
        String tbname = "";
        String erroritem = "";
        String paramnull = "";
        String paramnotnull = "";
        String dateparam = "";
        String dateval = "";
        String dateupdate = "";

        if (flag == 1) {
            erroritem = "дополнительных";
            tbname = "listvalues";
            paramnull = "periodparamid";
            paramnotnull = "listparamid";
        } else {
            erroritem = "периодических";
            tbname = "periodvalues";
            paramnotnull = "periodparamid";
            paramnull = "listparamid";
            dateparam = "date, ";
            dateval = "CAST(:dateval as timestamp), ";
            dateupdate = ", date=CAST(:dateval as timestamp)";
            params.put("dateval", val.getDateval());
        }

        if (val.getValueval() == null || val.getValueval().trim().equals("")) {
            valueval = "NULL";
            if (val.getParamstrict() == 1) {
                throw new Exception("Параметр \"" + val.getParamname() + "\" в " + erroritem + " реквизитах обязательный к заполнению!");
            }
        } else {
            valueval = ":valueval";
            if (val.getCodejs() != null) {
                String[] s = val.getValueval().split(" = ");
                if (s.length > 0) {
                    val.setValueval(s[0]);
                }
            }
            params.put("valueval", val.getValueval());
        }

        if ((val.getValueid() == null) && !valueval.equals("NULL")) { // ДОБАВЛЕНИЕ РЕКВИЗИТА
            sql = "INSERT INTO " + tbname + " (paramid, ownerid, " + dateparam + " val) " +
                    "VALUES (" + val.getParamid() + "," + ownerid + ", " + dateval + valueval + ")";
            int res = db.Execute(con, sql, Integer.class, params);
            val.setValueid(res);
            if (val.getImglock() != null) { // ДОБАВЛЕНИЕ КАРТИНКИ
                if (val.getImglock().getRecid() == -1 && val.getImglock().getFlagdel() == 0) {
                    params.remove("valueval");
                    params.remove("dateval");
                    params.put("sesid", val.getImglock().getSesid());
                    sql = "INSERT INTO imgvalues (objectid, recid, img) " +
                            "VALUES (getobject_id('" + tbname + "'), " + val.getValueid() + ", (SELECT img FROM imglock WHERE sesid=CAST(:sesid as uuid) " +
                            "AND recid = -1 " +
                            "AND objectid=getobject_id('" + tbname + "') " +
                            "AND (" + paramnull + " = -1 OR " + paramnull + " IS NULL) " +
                            "AND " + paramnotnull + " = " + val.getParamid() + " LIMIT 1))";
                    int id = db.Execute(con, sql, Integer.class, params);
                }
            }
        } else { // ОБНОВЛЕНИЕ РЕКВИЗИТА
            if (val.getValueid() != null && !valueval.equals("NULL")) {
                sql = "UPDATE " + tbname + " SET paramid = " + val.getParamid()
                        + ", ownerid = " + ownerid
                        + ", val = " + valueval
                        + dateupdate
                        + " WHERE id = " + val.getValueid();
                db.Execute(con, sql, params);
                // Cохранение (обновление) изображения доп реквизита
                // Ищем запись в imgvalues
                sql = "SELECT id FROM imgvalues WHERE objectid=getobject_id('" + tbname + "') AND recid = " + val.getValueid();
                List<Integer> imgIds = db.Query(con, sql, Integer.class, null);
                if (imgIds != null) {
                    // ВСТАВИТЬ
                    if (imgIds.size() == 0 && val.getImglock() != null) {
                        if (val.getImglock().getRecid() != -1 && val.getImglock().getFlagdel() == 0 && val.getImglock().getFlagchange() == 1) {
                            params.put("sesid", val.getImglock().getSesid());
                            params.remove("valueval");
                            params.remove("dateval");
                            sql = "INSERT INTO imgvalues (objectid, recid, img) VALUES (getobject_id('" + tbname + "'), " + val.getValueid() + ", " +
                                    "(SELECT img FROM imglock WHERE sesid = CAST(:sesid as uuid) " +
                                    " AND recid=" + val.getImglock().getRecid() +
                                    " AND objectid = getobject_id('" + tbname + "') " +
                                    " AND (" + paramnull + "=-1 OR " + paramnull + " IS NULL) " +
                                    " AND " + paramnotnull + "= " + val.getParamid() + " LIMIT 1))";
                            int id = db.Execute(con, sql, Integer.class, params);
                        }
                    } else { // ОБНОВИТЬ
                        if (val.getImglock() != null) {
                            if (imgIds.size() == 1 && val.getImglock().getRecid() != -1 && val.getImglock().getFlagdel() == 0 && val.getImglock().getFlagchange() == 1) {
                                params.put("sesid", val.getImglock().getSesid());
                                sql = "UPDATE imgvalues SET objectid = getobject_id('" + tbname + "'), recid=" + val.getValueid() + ", " +
                                        "img=(SELECT img FROM imglock WHERE sesid = CAST(:sesid as uuid) " +
                                        " AND recid=" + val.getImglock().getRecid() + " " +
                                        " AND objectid = getobject_id('" + tbname + "') " +
                                        " AND (" + paramnull + " = -1 OR " + paramnull + " IS NULL) " +
                                        " AND " + paramnotnull + " = " + val.getParamid() + " LIMIT 1) " +
                                        "WHERE id = " + imgIds.get(0);
                                db.Execute(con, sql, params);
                            } else { // УДАЛИТЬ ИЗОБРАЖЕНИЕ
                                if (imgIds.size() == 1 && val.getImglock().getFlagdel() == 1) {
                                    sql = "DELETE FROM imgvalues WHERE objectid=getobject_id('" + tbname + "') AND recid = " + val.getValueid();
                                    db.Execute(con, sql, null);
                                }
                            }
                        }
                    }
                }
            } else { // УДАЛИТЬ ИЗОБРАЖЕНИЯ И ЗНАЧЕНИЯ РЕКВИЗИТА
                if (val.getValueid() != null && valueval.equals("NULL")) {
                    sql = "DELETE FROM imgvalues WHERE objectid=getobject_id('" + tbname + "') AND recid = " + val.getValueid();
                    db.Execute(con, sql, null);
                    sql = "DELETE FROM " + tbname + " WHERE id = " + val.getValueid();
                    db.Execute(con, sql, null);
                }
            }
        }
    }

//    private static <T> Predicate<T> distinctByKey(Function<? super T, ?> keyExtractor) {
//        Set<Object> seen = ConcurrentHashMap.newKeySet();
//        return t -> seen.add(keyExtractor.apply(t));
//    }

//    private static <T> Predicate<T> distinctByKeys(Function<? super T, ?>... keyExtractors) {
//        final Map<List<?>, Boolean> seen = new ConcurrentHashMap<>();
//
//        return t -> {
//            final List<?> keys = Arrays.stream(keyExtractors).map(ke -> ke.apply(t)).collect(Collectors.toList());
//            return seen.putIfAbsent(keys, Boolean.TRUE) == null;
//        };
//    }
}
