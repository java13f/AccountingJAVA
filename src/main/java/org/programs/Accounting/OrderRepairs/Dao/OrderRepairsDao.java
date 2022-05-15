package org.kaznalnrprograms.Accounting.OrderRepairs.Dao;

import org.kaznalnrprograms.Accounting.OrderRepairs.Interfaces.IOrderRepairs;
import org.kaznalnrprograms.Accounting.OrderRepairs.Models.*;
import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class OrderRepairsDao implements IOrderRepairs
{
    String appName = "OrderRepairs - заявка на ремонт";
    private DBUtils db;

    public OrderRepairsDao (DBUtils db) { this.db = db; }

    /**
     * Получить данные заявки на ремонт
     * @param OrderId
     * @return
     * @throws Exception
     */
    @Override
    public OrderRepairs getRec (int OrderId) throws Exception
    {
        try(Connection con = db.getConnection(appName))
        {
            String paramId = getIdListparams("user_phone", "orders");
            int paramIdint = -1;
            if(paramId.length() > 0) {
                paramIdint = Integer.parseInt(paramId);
            }

            String sql = "SELECT to_char(DATE_TRUNC('second', date), 'DD.MM.YYYY') date, o.no, ob.name objsname, ob.id objsid, u1.name username, " +
            "(d.code || ' = ' || d.name) depcode, ob.invno, u2.name executive, CAST(o.amount AS character varying) amount, " +
            "o.problemid, o.probleminfo, o.workinfo, to_char(DATE_TRUNC('second', dateclose), 'DD.MM.YYYY') closedate, o.stts, o.inituserid inituserid, o.workuserid workuserid, " +
                    "CASE WHEN lvl.id IS NULL THEN -1 ELSE lvl.id END idval, " +
                    "CASE WHEN lvl.val IS NULL THEN '' ELSE lvl.val END val, " +
                    "to_char(DATE_TRUNC('second', o.created), 'DD.MM.YYYY HH:MM:SS') created, to_char(DATE_TRUNC('second', o.changed), 'DD.MM.YYYY HH:MM:SS') changed, " +
                    "o.changer, o.creator " +
            "FROM orders o JOIN objs ob ON o.objid = ob.id " +
            "JOIN users u1 ON o.inituserid = u1.id " +
            "JOIN deps d ON u1.depid = d.id " +
            "LEFT JOIN users u2 ON o.workuserid = u2.id " +
            "LEFT JOIN listvalues lvl ON lvl.OwnerId = o.id " + " AND lvl.paramid = " + paramIdint +
            " WHERE o.id = " + OrderId + " AND EXISTS (SELECT 1 FROM get_user_deps('Orders.dll', 'ViewAllOrders') AS dep WHERE d.kterid = dep.kterid)";

            List<OrderRepairs> result = db.Query(con, sql, OrderRepairs.class, null);
            if(result.size() == 0){
                throw new Exception("Не удалось получить заявку на ремонт с Id = " + OrderId);
            }

            return result.get(0);
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    /**
     * Список проблем
     * @return
     * @throws Exception
     */
    @Override
    public List<ProblemsModel> getListProblems() throws Exception
    {
        try(Connection con = db.getConnection(appName))
        {
            String sql = "SELECT id, name FROM problems";

            return db.Query(con, sql, ProblemsModel.class, null);
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    /**
     * Получить пользователя
     * @return
     * @throws Exception
     */
    @Override
    public UserModel getUser() throws Exception
    {
        try(Connection con = db.getConnection(appName))
        {
            String sql = "SELECT u.id userid, u.code usercode, u.name username, u.deleted del, u.depid, ug.groupid, g.code groupcode, d.code depcode, d.name depname " +
                    "FROM users u JOIN usergroups ug ON u.id = ug.userid JOIN groups g ON ug.groupid = g.id JOIN deps d ON u.depid = d.id WHERE u.code = getusername()" +
                    " AND EXISTS (SELECT 1 FROM get_user_deps('Orders.dll', 'ViewAllOrders') AS dep WHERE d.kterid = dep.kterid)";

            List<UserModel> result = db.Query(con, sql, UserModel.class, null);

            if(result.size() == 0){
                throw new Exception("Не удалось получить пользователя с Code = ");
            }

            return result.get(0);
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    /**
     * Получить список доступности полей заявок
     * @param OrderTypeId
     * @return
     * @throws Exception
     */
    @Override
    public List<SttsOrderModel> getListSttsOrder(int OrderTypeId, int Stts) throws Exception
    {
        try(Connection con = db.getConnection(appName))
        {
            Map<String, Object> params = new HashMap<>();

            String sql = "SELECT so.id, so.groupid, so.orderfieldid, od.name orderfieldname, od.code orderfieldcode, so.orderstts, so.isenable, so.isvisible, so.ordertypeid " +
                    "FROM sttsorder so " +
                    "JOIN orderfields od ON so.orderfieldid = od.id " +
                    "JOIN usergroups ug ON so.groupid = ug.groupid " +
                    "JOIN users u ON u.id = ug.userid " +
                    "WHERE u.code = getusername() AND od.del = 0 " + " AND so.ordertypeid = " + OrderTypeId + " AND so.orderstts = " + Stts +
                    " ORDER BY od.code";

            return db.Query(con, sql, SttsOrderModel.class, params);
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    /**
     * Проверка даты на открытость
     * @param Date
     * @return
     * @throws Exception
     */
    @Override
    public List<DateOpenModel> checkDate(String Date) throws Exception {
        try(Connection con = db.getConnection(appName))
        {
            Map<String, Object> params = new HashMap<>();
            params.put("date", Date);

            String sql = "SELECT tdy.date, tdy.openmode, tdu.todayid, tdu.userid " +
                        "FROM today tdy " +
                            "LEFT JOIN todayusers tdu ON tdy.id = tdu.todayid " +
                        "WHERE tdy.date = CAST(:date AS timestamp without time zone)";

            return db.Query(con, sql, DateOpenModel.class, params);
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    /**
     * Получить флаг обязательности доп. реквезита
     * @param ParamCode
     * @param TaskCode
     * @return
     * @throws Exception
     */
    @Override
    public ListparamsModel checkPropsAdditional(String ParamCode, String TaskCode) throws Exception {
        try(Connection con = db.getConnection(appName))
        {
            Map<String, Object> params = new HashMap<>();
            params.put("paramcode", ParamCode);
            params.put("taskcode", TaskCode);

            String sql = "SELECT id, name, nom, strict " +
                        "FROM listparams lst " +
                        "WHERE lst.paramcode = :paramcode AND lst.taskcode = :taskcode";

            List<ListparamsModel> result = db.Query(con, sql, ListparamsModel.class, params);

            if (result.size() == 0)
            {
                throw new Exception("Не удалось получить доп. реквизит с ParamCode = " + ParamCode + "  и TaskCode = " + TaskCode);
            }

            return result.get(0);
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    /**
     * Получить следующий номер заявки
     * @param Date
     * @return
     * @throws Exception
     */
    @Override
    public String getMaxOrderNumber(String Date) throws Exception
    {
        try(Connection con = db.getConnection(appName))
        {
            Map<String, Object> params = new HashMap<>();
            params.put("Date", Date);
            String sql = "Select getorder_next_no(CAST(:Date as timestamp)) as no";

            return db.Query(con, sql, String.class, params).get(0);
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    /**
     * Сохранение значения доп.реквизита
     * @param Id
     * @param ParamId
     * @param OwnerId
     * @param Val
     * @throws Exception
     */
    @Override
    public void savePhone(Connection con, int Id, int ParamId, int OwnerId, String Val)
    {
        Map<String, Object> params = new HashMap<>();
        params.put("val", Val);
        params.put("paramid", ParamId);
        params.put("ownerid", OwnerId);

        String sql = "";

        if (Id == -1)
        {
            sql = "INSERT INTO listvalues(paramid, ownerid, val)" + " VALUES(:paramid, :ownerid, :val)";
            db.Execute(con, sql, Integer.class, params);
        }
        else {
            sql = "UPDATE listvalues " + "SET val = :val " + "WHERE paramid = :paramid AND ownerid = :ownerid";
            db.Execute(con, sql, params);
        }
    }

    /**
     * Сохранение заявки
     * @param model
     * @return
     * @throws Exception
     */
    @Override
    public int save(OrderRepairs model) throws Exception {
        try(Connection con = db.getConnectionWithTran(appName)) {
            String sql = "";
            String WorkUserId = model.getId() != -1 ? ", workuserid = NULL" : "";
            String ProblemId = model.getId() != -1 ? ", problemid = NULL" : "";
            String ProblemInfo = model.getId() != -1 ? ", probleminfo = NULL" : "";
            String WorkInfo = model.getId() != -1 ? ", workinfo = NULL" : "";
            String DateClose = model.getId() != -1 ? ", dateclose = NULL" : "";

            String WorkUserIdParam = "";
            String ProblemIdParam = "";
            String ProblemInfoParam = "";
            String WorkInfoParam = "";
            String DateCloseParam = "";

            Map<String, Object> params = new HashMap<>();

            if(model.getWorkuserid() != -1) {
                params.put("workuserid", model.getWorkuserid());
                WorkUserIdParam = ", workuserid";
                WorkUserId = model.getId() != -1 ? ", workuserid = CAST(:workuserid AS integer)" : ", CAST(:workuserid AS integer)";
            }

            if(model.getProblemid() != -1) {
                params.put("problemid", model.getProblemid());
                ProblemIdParam = ", problemid";
                ProblemId = model.getId() != -1 ? ", problemid = CAST(:problemid AS integer)" : ", CAST(:problemid AS integer)";
            }

            if(model.getProbleminfo().length() > 0) {
                params.put("probleminfo", model.getProbleminfo());
                ProblemInfoParam = ", probleminfo";
                ProblemInfo = model.getId() != -1 ? ", probleminfo = :probleminfo" : ", :probleminfo";
            }

            if(model.getWorkinfo().length() > 0) {
                params.put("workinfo", model.getWorkinfo());
                WorkInfoParam = ", workinfo";
                WorkInfo = model.getId() != -1 ? ", workinfo = :workinfo" : ", :workinfo";
            }

            if(model.getClosedate().length() > 0 || model.getClosedate().equals("01.01.0001 0:00:00") || model.getClosedate().equals("0")) {
                params.put("dateclose", model.getClosedate());
                DateCloseParam = ", dateclose";
                DateClose = model.getId() != -1 ? ", dateclose = CAST(:dateclose as timestamp without time zone)"
                        : ", CAST(:dateclose as timestamp without time zone)";
            }

            params.put("ordertypeid", model.getOrdertypeid());
            params.put("no", model.getNo());
            params.put("date", model.getDate());
            params.put("objsid", model.getObjsid());
            params.put("inituserid", model.getInituserid());
            params.put("amount", model.getAmount());
            params.put("stts", model.getStts());

            if(model.getId() == -1) {
                sql = "INSERT INTO orders (ordertypeid, no, date, objid, inituserid, amount, stts" + DateCloseParam + WorkUserIdParam + ProblemIdParam + ProblemInfoParam + WorkInfoParam + ")"
                        + " VALUES(:ordertypeid, :no, CAST(:date as timestamp without time zone), :objsid, :inituserid, CAST(:amount as money), :stts"
                        + DateClose + WorkUserId + ProblemId + ProblemInfo + WorkInfo + ")";
                model.setId(db.Execute(con, sql, Integer.class, params));
            }
            else {
                db.CheckLock(con, model.getId(), "orders");
                sql = "UPDATE orders SET ordertypeid = :ordertypeid, no = :no, date = CAST(:date as timestamp without time zone), objid = :objsid, inituserid = :inituserid, " +
                        "amount = CAST(:amount AS money), stts = :stts" + DateClose + ProblemId + WorkUserId + ProblemInfo + WorkInfo +
                        " WHERE id = " + model.getId();
                db.Execute(con, sql, params);
            }

            if(model.getVal().length() > 0) {
                savePhone(con, model.getIdval(), model.getParamid(), model.getId(), model.getVal());
            }

            con.commit();
            return model.getId();
        }
        catch(Exception ex) {
            throw ex;
        }
    }

    /**
     * Получить Id доп. реквизита
     * @param ParamCode
     * @param TaskCode
     * @return
     * @throws Exception
     */
    @Override
    public String getIdListparams(String ParamCode, String TaskCode) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("paramcode", ParamCode);
            params.put("taskcode", TaskCode);

            String sql = "SELECT id " +
                    "FROM listparams lst " +
                    "WHERE lst.paramcode = :paramcode AND lst.taskcode = :taskcode";

            List<String> result = db.Query(con, sql, String.class, params);

            if (result.size() == 0) {
                throw new Exception("Не удалось получить доп. реквизит с ParamCode = " + ParamCode + "  и TaskCode = " + TaskCode);
            }

            return result.get(0);
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    /**
     * Получить пользователя и его подразделение
     * @param Id
     * @return
     * @throws Exception
     */
    @Override
    public UserModel getUserDepName(int Id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT u.id, u.name username, d.code depcode, d.name depname " +
                    "FROM Users u JOIN Deps d ON u.depid = d.id " +
                    "WHERE u.id = " + Id + " AND EXISTS (SELECT 1 FROM get_user_deps('Orders.dll', 'ViewAllOrders') AS dep WHERE d.kterid = dep.kterid)";

            List<UserModel> result = db.Query(con, sql, UserModel.class, null);

            if (result.size() == 0) {
                throw new Exception("Не удалось получить пользователя с Id = " + Id);
            }

            return result.get(0);
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    /**
     * Получить объект
     * @param Id
     * @return
     * @throws Exception
     */
    @Override
    public ObjsModel getObject(int Id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT invno, name, objtypeid FROM Objs WHERE id = " + Id;

            List<ObjsModel> result = db.Query(con, sql, ObjsModel.class, null);

            if (result.size() == 0) {
                throw new Exception("Не удалось получить объект с Id = " + Id);
            }

            return result.get(0);
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    @Override
    public String getProblem (int id) throws Exception {
        try (Connection con = db.getConnection(appName))
        {
           String sql = "SELECT id || ' = ' || name FROM problems WHERE id = " + id;

           List<String> result = db.Query(con, sql, String.class, null);

            if (result.size() == 0) {
                throw new Exception("Не удалось получить \"Код проблемы\" с Id = " + id);
            }

            return result.get(0);
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }
}
