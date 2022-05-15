package org.kaznalnrprograms.Accounting.OrderMov.Dao;

import org.kaznalnrprograms.Accounting.OrderMov.Interfaces.IOrderMovDao;
import org.kaznalnrprograms.Accounting.OrderMov.Models.ObjectsModel;
import org.kaznalnrprograms.Accounting.OrderMov.Models.OrderMovDetailsModel;
import org.kaznalnrprograms.Accounting.OrderMov.Models.OrderMovGridModel;
import org.kaznalnrprograms.Accounting.OrderMov.Models.SaveModel;
import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.net.BindException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class OrderMovDaoImpl implements IOrderMovDao {
    private String appName = "OrderMov";
    private DBUtils db;
    private Map<String, Object> params = new HashMap<>();

    public OrderMovDaoImpl(DBUtils db) {
        this.db = db;
    }


    @Override
    public List<ObjectsModel> gridload(int orderid, String date) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String user = db.getUserCode();
            Map<String, Object> params = new HashMap<>();
            String sql =
                    "select " +
                            "        ob.id \"objid\", ob.invno , ob.name ," +
                            "        ord.id \"orderid\"," +
                            "        case when ord.parentid is null then 1 else 0 end \"parent\"," +
                            "        (case when lvfrom.id IS NULL then -1 else lvfrom.id end) lvidfrom, " +
                            "        (case when lvto.id IS NULL then -1 else lvto.id end) lvidto,us.name as owner, " +
                            "        (case when lvowner.id IS NULL then -1 else lvowner.id end) as lvowner" +
                            "        from orders ord " +
                            "        join objs ob on ob.id = ord.objid" +
                            "        join Users U on U.code=:user" +
                            "        join Deps D on D.id=U.depid" +
                            "        join Kter kt on kt.id=D.kterid" +
                            "        join Users us on us.id = CAST((select get_objs_owner_id(objid, CAST(:date as timestamp without time zone))) AS INTEGER)" +
                            "        left join listvalues lvfrom on ord.id = lvfrom.ownerid and lvfrom.paramid = (select id from ListParams where paramcode='fromroom') " +
                            "        left join listvalues lvto on ord.id = lvto.ownerid and lvto.paramid = (select id from ListParams where paramcode='location') " +
                            "        left join listvalues lvowner on ord.id = lvowner.ownerid and lvowner.paramid = (select id from ListParams where paramcode='owner')" +
                            "        where ord.id = :orderid or ord.parentid = :orderid" +
                            "        AND kt.id IN (SELECT kterid FROM get_user_deps('Orders.dll','ViewAllOrders')) " +
                            "        order by ord.parentid desc";
            params.put("orderid", orderid);
            params.put("user", user);
            params.put("date", date);
            List<ObjectsModel> s = db.Query(con, sql, ObjectsModel.class, params);
            return s;
        } catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public ObjectsModel getobj(String objid, String date) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            //Map<String, Object> params = new HashMap<>();
            String sql =
                    //"select id objid,invno,name,-1 orderid from Objs where id=:objid" +
                    "select obj.id objid,obj.invno,obj.name,-1 orderid,us.name as owner " +
                            "from Objs obj " +
                            "join Users us on us.id = CAST((select get_objs_owner_id(obj.id, CAST(:date as timestamp without time zone))) AS INTEGER) " +
                            "where obj.id=:objid"; //+ Integer.parseInt(objid);
            params.put("objid", Integer.parseInt(objid));
            params.put("date", date);
            List<ObjectsModel> s = db.Query(con, sql, ObjectsModel.class, params);
            if (s.size() == 0) {
                throw new Exception("Не удалось получить объект");
            }
            return s.get(0);
        } catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public String checkobjdate(SaveModel smodel) throws Exception {
        String err = "";
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            for (ObjectsModel m : smodel.getObjlist()
            ) {
                params = new HashMap<>();
                String sql =
                        "select chk_obj_dates(cast(:ObjId as integer), CAST(:Date as date))";
                params.put("ObjId", m.getObjid());
                params.put("Date", smodel.getDate());
                List<String> s = db.Query(con, sql, String.class, params);
                if (s.size() == 0) {
                    throw new Exception("Не удалось получить объект");
                }
                String tmp = (String) s.get(0);
                if (tmp instanceof String) {
                    if (!s.get(0).isEmpty()) {
                        err = s.get(0);
                        break;
                    }
                }
            }
        return err;
        } catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public boolean checkobjowner(List<ObjectsModel> objects) throws Exception {
        String ids = "-1";
        try (Connection con = db.getConnection(appName)) {
            //Map<String, Object> params = new HashMap<>();
            for (ObjectsModel m : objects
            ) {
                ids = ids + ", " + m.getObjid();
            }
            Map<String, Object> params = new HashMap<>();
            params = new HashMap<>();
            String sql =
                    "SELECT (CASE WHEN " +
                            "(select count(distinct(u.name)) from periodvalues pv " +
                            "join users u on u.id = cast(pv.val as integer) " +
                            "where ownerid in (:ids) and paramid = 5) = 1  " +/*" + ids + "*/
                            "THEN " +
                            "'TRUE' " +
                            "ELSE " +
                            "'FALSE' " +
                            "END) res ";
            params.put("ids", ids);
            List<String> s = db.Query(con, sql, String.class, params);
            if (s.size() == 0) {
                throw new Exception("Не удалось получить объект");
            }
            String tmp = s.get(0);
            if (tmp.equals("TRUE")) {
                return true;
            }
            if (tmp.equals("FALSE")) {
                return false;
            }
        } catch (Exception ex) {
            throw ex;
        }
        return false;
    }

    @Override
    public String checklocat(SaveModel model) {
        String errorlist = "Невозможно переместить следующие объекты:</br>";
        String sql = "";
        int fir = 0;
        try (Connection con = db.getConnection(appName)) {
            for (ObjectsModel m : model.getObjlist()
            ) {
                if (m.getChanged() != 0 || m.getOrderid() == -1) {
                    sql = "select (case when CAST(:fromroom as INTEGER) <>(select CAST(get_objs_location_id(:objid, CAST(:date as timestamp without time zone)) as INTEGER)) then (select ('id = '||id||' , объект = '||name) as name from Objs where id=:objid ) else '' end)";
                    Map<String, Object> params = new HashMap<>();
                    params.put("objid", m.getObjid());
                    params.put("date", model.getDate());
                    params.put("fromroom", model.getFromroom());
                    String sd = db.Query(con, sql, String.class, params).get(0);
                    if (!sd.isEmpty()) {
                        errorlist = errorlist + (fir == 1 ? ",</br>" : "") + sd;
                        fir = 1;
                    }
                }
            }
            sql = "select 'id = '||id||' ,'||'кабинет = '||name from Locations where id=CAST (:id as INTEGER)";
            Map<String, Object> params = new HashMap<>();
            params.put("id", model.getFromroom());
            String sd = db.Query(con, sql, String.class, params).get(0);
            errorlist = errorlist + "</br>так как они не находятся в указаной комнате: </br>" + sd + ".";
        } catch (Exception ex) {
            return ex.getMessage();
        }
        if (fir != 0) {
            return errorlist;
        }
        return "";
    }

    //добавление данных
    @Override
    public int DBInsert(SaveModel model, Connection con, int parentid, int index) {

        ObjectsModel m = model.getObjlist().get(index);
        String sql = "insert into orders " +
                "(ordertypeid, no, date, objid, inituserid, amount, stts, parentid,  info, workuserid) " +
                "values " +
                "(:OrderTypeId, :No, CAST(:Date as timestamp without time zone), :ObjId, :InitUserId, 0, :Stts,";
        //если родительский не найден-назначаем текущий родительским
        if (parentid == -1) {
            sql = sql + " NULL, ";
        }
        //если родительский уже есть проставляем parentid
        else {
            sql = sql + " :parentid ,";   //sql = sql + " " + parentid + ", ";
        }
        sql = sql + ":Info, " +
                "CASE WHEN :WorkUserId = -1 THEN NULL ELSE :WorkUserId END) ";

        Map<String, Object> params = new HashMap<>();
        params.put("OrderTypeId", model.getOrdertypeid());
        params.put("No", model.getNo());
        params.put("Date", model.getDate());
        params.put("ObjId", m.getObjid());
        params.put("InitUserId", model.getInituserid());
        params.put("Stts", model.getStts());
        params.put("Info", model.getInfo());
        params.put("WorkUserId", model.getWorkuserid());
        if (parentid != -1) {
            params.put("parentid", parentid);
        }
        int res = db.Execute(con, sql, Integer.class, params);
        model.getObjlist().get(index).setOrderid(res);
        if (parentid == -1) {
            return res;
        }
        return parentid;
    }

    //обновление,удаление данных
    @Override
    public int DBUpdateDelete(SaveModel model, Connection con, int parentid, int index, int ParentDel, int fromroomparid, int locationparid, int ownerparid) {
        Map<String, Object> params = new HashMap<>();
        ObjectsModel m = model.getObjlist().get(index);
        String sql = "";
        //если документ помечен на удаление
        if (m.getDel() == 1) {
            if (model.getOrdertypecode().equals("06")) {
                sql = "delete from listvalues where ownerid = :OrderId and paramid = :fromroomparid ";
                params = new HashMap<>();
                params.put("OrderId", m.getOrderid());
                params.put("fromroomparid", fromroomparid);
                db.Execute(con, sql, params);

                sql = "delete from listvalues where ownerid = :OrderId and paramid = :locationparid; ";
                params = new HashMap<>();
                params.put("OrderId", m.getOrderid());
                params.put("locationparid", locationparid);
                db.Execute(con, sql, params);
            } else {
                sql = "delete from listvalues where ownerid = :OrderId and paramid = :ownerparid";
                params = new HashMap<>();
                params.put("OrderId", m.getOrderid());
                params.put("ownerparid", ownerparid);
                db.Execute(con, sql, params);
            }

            sql = "delete from orders where id = :OrderId; ";
            params = new HashMap<>();
            params.put("OrderId", m.getOrderid());
            db.Execute(con, sql, params);

            return -1;
        }
        //если документ без пометки del=1
        else {
            //если документ изменялся или поменялся родительский
            if (model.getObjlist().get(index).getChanged() == 1 || ParentDel != -1 || model.getSttschange() == 1) {
                sql = "update orders set " +
                        "no = :No, " +
                        "date = CAST(:Date as timestamp without time zone), " +
                        "objid = :ObjId, " +
                        "inituserid = :InitUserId, " +
                        "stts = :Stts, " +
                        "info = :Info, ";
                //если родительский еще не был сохранен или тукущий документ-родительский
                if (parentid == -1 || m.getParent() == 1) {
                    sql = sql + "parentid=NULL, ";
                } else {
                    sql = sql + "parentid=:parentid, ";
                }
                sql = sql + "workuserid = CASE WHEN :WorkUserId = -1 THEN NULL ELSE :WorkUserId END " +
                        "where id = :OrderId ";
                params = new HashMap<>();
                params.put("No", model.getNo());
                params.put("Date", model.getDate());
                params.put("ObjId", m.getObjid());
                params.put("InitUserId", model.getInituserid());
                params.put("Stts", model.getStts());
                params.put("Info", model.getInfo());
                params.put("WorkUserId", model.getWorkuserid());
                params.put("OrderId", m.getOrderid());
                if (parentid != -1 && m.getParent() != 1) {
                    params.put("parentid", parentid);
                }
                int res = db.Execute(con, sql, int.class, params);
                model.getObjlist().get(index).setOrderid(res);
                if (parentid == -1) {
                    return res;
                }
            }
        }
        return parentid;
    }

    //добавление, обновление доп реквизитов
    @Override
    public void DBListValues(SaveModel model, Connection con, int index, int fromroomparid, int locationparid, int ownerparid) {
        Map<String, Object> params = new HashMap<>();
        ObjectsModel m = model.getObjlist().get(index);
        String sql = "";
        //если реквизит новый
            if (model.getOrdertypecode().equals("06")) {
                if (model.getObjlist().get(index).getLvidto() == -1) {
                    sql = "insert into listvalues (paramid, ownerid, val) " +
                            "values (:parid, :OrderId, :Val)";
                    //добавляем параметр location
                    params = new HashMap<>();
                    params.put("Val", model.getToroom());
                    params.put("OrderId", m.getOrderid());
                    params.put("parid", locationparid);
                    db.Execute(con, sql, int.class, params);
                    //добавляем параметр fromroom
                    params = new HashMap<>();
                    params.put("Val", model.getFromroom());
                    params.put("OrderId", m.getOrderid());
                    params.put("parid", fromroomparid);
                    db.Execute(con, sql, int.class, params);
                }
            } else {
                if (model.getObjlist().get(index).getLvowner() == -1) {
                    //добавляем параметр owner
                    sql = "insert into listvalues (paramid, ownerid, val) " +
                            "values (:ownerparid, :OrderId, :Val)";
                    params = new HashMap<>();
                    params.put("Val", model.getGiveto());
                    params.put("OrderId", m.getOrderid());
                    params.put("ownerparid", ownerparid);
                    db.Execute(con, sql, int.class, params);
                }
            }
         if ((m.getChanged() == 1 || model.getSttschange() == 1)&&(model.getObjlist().get(index).getLvidto() != -1||model.getObjlist().get(index).getLvowner() != -1)) {
                sql = "update listvalues set val = :Val " +
                        "where id = :Id";
            if (model.getOrdertypecode().equals("06") ) {
                params = new HashMap<>();
                params.put("Val", model.getFromroom());
                params.put("Id", m.getLvidfrom());
                db.Execute(con, sql, int.class, params);

                params = new HashMap<>();
                params.put("Val", model.getToroom());
                params.put("Id", m.getLvidto());
                db.Execute(con, sql, int.class, params);
            }
            else{
                params = new HashMap<>();
                params.put("Val", model.getGiveto());
                params.put("Id", m.getLvowner());
                db.Execute(con, sql, int.class, params);
            }
        }
    }


    /**
     * корневая функция сохранения документа
     *
     * @param model
     * @return
     * @throws Exception
     */
    @Override
    public int saveupdate(SaveModel model) throws Exception {
        int ParentId = -1;
        int ParentDel = -1;
        try (Connection con = db.getConnectionWithTran(appName)) {
            String sqltmp = "select id from ListParams where paramcode = \'fromroom\'";
            int fromroomparid = db.Query(con, sqltmp, Integer.class, null).get(0);
            sqltmp = "select id from ListParams where paramcode = \'location\'";
            int locationparid = db.Query(con, sqltmp, Integer.class, null).get(0);
            sqltmp = "select id from ListParams where paramcode = \'owner\'";
            int ownerparid = db.Query(con, sqltmp, Integer.class, null).get(0);
            //-----------------------------------------
            //ищем есть ли родительский документ
            for (ObjectsModel m : model.getObjlist()
            ) {
                //если нашли родительский не удаленный документ
                if (m.getParent() == 1 && m.getDel() == 0) {
                    ParentId = m.getOrderid();
                    break;
                }
                // если нашли родительский но он был удален
                if (m.getParent() == 1 && m.getDel() == 1) {
                    ParentDel = m.getOrderid();
                }
            }

            //обрабатываем каждую модель в цикле(сохранение, удаление, обновление)
            for (int i = 0; i < (model.getObjlist()).size(); i++) {
                //если текущий документ новый
                if (model.getObjlist().get(i).getOrderid() == -1) {
                    //передаеи ParentId. если он -1 значит не удаленного парента ранее сохраненного в базе нет
                    int retid = DBInsert(model, con, ParentId, i);
                    //если вернулся id отличный от -1 значит появился родительский документ - присваеваем этот id переменной отвечающей за родительский id
                    if (retid != -1) {
                        ParentId = retid;
                    }
                }
                //если текущий документ не новый
                else {
                    int retid = DBUpdateDelete(model, con, ParentId, i, ParentDel, fromroomparid, locationparid, ownerparid);
                    //если вернулся id отличный от -1 значит появился родительский документ - присваеваем этот id переменной отвечающей за родительский id
                    if (retid != -1) {
                        ParentId = retid;
                    }
                }
                DBListValues(model, con, i, fromroomparid, locationparid, ownerparid);
                // проводка/ распроводка текущей заявки
                String sql = "SELECT order_trans(CAST(:OrderId as integer))";
                Map<String, Object> params = new HashMap<>();
                params = new HashMap<>();
                params.put("OrderId", (model.getObjlist().get(i).getOrderid()));
                db.Query(con, sql, params);
            }
            con.commit();
        } catch (Exception ex) {
            throw ex;
        }
        return ParentId;
    }

    @Override
    public String getno(String date) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            String sql =
                    "select getorder_next_no(CAST(:date as timestamp)) as no";
            params.put("date", date);
            List<String> s = db.Query(con, sql, String.class, params);
            if (s.size() == 0) {
                throw new Exception("Не удалось получить объект");
            }
            return s.get(0);
        } catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public String checkno(String orderno, String date) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            String sql =
                    "select chkorder_no(:OrderNo, CAST(:OrderDate as timestamp)) as res";
            params.put("OrderDate", date);
            params.put("OrderNo", orderno);
            List<String> s = db.Query(con, sql, String.class, params);
            if (s.size() == 0) {
                throw new Exception("Не удалось получить объект");
            }
            return s.get(0);
        } catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public String checkinit(int uid) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            String user = db.getUserCode();
            String sql =
                    "select U.Name from Users U " +
                            "join Deps D on D.id=U.depid " +
                            "join Kter kt on kt.id=D.kterid " +
                            "where U.id= :uid " +
                            "and kt.id IN (SELECT kterid FROM get_user_deps('Orders.dll','ViewAllOrders')) ";

            //test
//                            "select U.Name from Users U " +
//                            "join Deps D on D.id=U.depid " +
//                            "join Kter kt on kt.id=D.kterid " +
//                            "where U.id= -100" +
//                            "and kt.id IN (SELECT kterid FROM get_user_deps('Orders.dll','ViewAllOrders')) ";
            params.put("uid", uid);
            List<String> s = db.Query(con, sql, String.class, params);
            if (s.size() == 0) {
                sql = "select Name from Users where id=:uid";
                params = new HashMap<>();
                params.put("uid", uid);
                s = db.Query(con, sql, String.class, params);
                return s.get(0);
            }
            return "";
        } catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public Integer checkdateDbWork(String date) throws Exception {
        if (date.equals("")) {
            return 1;
        }
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            String UserCode = db.getUserCode();
            String sql =
                    "select count(*) as cnt from todayusers tu " +
                            "        join users u on u.id = tu.userid " +
                            "        join today t on t.id = tu.todayid " +
                            "        where u.code = :UserCode and tu.del = 0 and t.Date = CAST(:Date as timestamp without time zone)";//'" + db.getUserCode() + "'
            params.put("Date", date);
            params.put("UserCode", UserCode);
            List<Integer> s = db.Query(con, sql, Integer.class, params);
            if (s.size() == 0) {
                throw new Exception("Не удалось получить объект");
            }
            int res = s.get(0);
            if (res > 0) {
                return res;
            }
            params.clear();
            sql = "select count(*) as cnt from today where Date = CAST(:Date as timestamp without time zone) and OpenMode = 1";
            params.put("Date", date);
            s = db.Query(con, sql, Integer.class, params);
            return s.get(0);
        } catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public String checkdate(String date, String dateonstart) throws Exception {

        if (checkdateDbWork(date) == 0) {
            return "Нельзя выбрать дату заявки " + date + ", так как день с такой датой либо закрыт либо не был открыт!";
        } else if (checkdateDbWork(dateonstart) == 0) {
            return "Нельзя изменить дату заявки " + dateonstart + " на " + date + " , так как день с такой датой либо закрыт либо не был открыт!";
        } else {
            return "";
        }
    }

    @Override
    public String getusername() throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            String UserCode = db.getUserCode();
            String sql =
                    "SELECT (id || ' = ' || name) as name from users where code= :UserCode";//'" + db.getUserCode() + "'"
            params.put("UserCode", UserCode);
            List<String> s = db.Query(con, sql, String.class, params);
            if (s.size() == 0) {
                throw new Exception("Не удалось получить объект");
            }
            return s.get(0);
        } catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public OrderMovDetailsModel getdetails(int orderid, String ordertypecode) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            String user = db.getUserCode();
            String sql = "";
            if (ordertypecode.equals("06")) {
                sql = "select (select l.id || ' = ' || l.name " +
                        "from Listvalues lv " +
                        "join locations l on l.id = CAST(lv.val as integer) " +
                        "where lv.paramid = (select id from ListParams where paramcode='fromroom') and lv.ownerid = :Id LIMIT 1) fromroom, " +
                        "(select l.id || ' = ' || l.name " +
                        "from listvalues lv " +
                        "join locations l on l.id = CAST(lv.val as integer) " +
                        "where lv.paramid =  (select id from ListParams where paramcode='location') and lv.ownerid = :Id LIMIT 1) toroom, ob.id objid,ord.id orderid, ord.no, ord.date,  ord.inituserid, ord.stts, ord.info, ord.workuserid, " +
                        "ord.Changer, to_char(ord.Changed,'DD.MM.YYYY') Changed, ord.Creator,to_char(ord.Created,'DD.MM.YYYY') Created, " +
                        "(ord.inituserid|| ' = ' ||u.name) as initusername, (ord.workuserid|| ' = ' ||uW.name) WorkUserName, " +
                        "case when ord.parentid is null then 1 else 0 end Parent " +
                        "from orders ord " +
                        "join objs ob on ob.id = ord.objid " +
                        "join users u on ord.inituserid = u.id " +
                        "left join users uW on ord.workuserid = uW.id " +
                        "left join Users uCheck on uCheck.code = :User " +
                        "join Deps D on D.id=uCheck.depid  " +
                        "join Kter kt on kt.id=D.kterid " +
                        "where ord.id = :Id " +
                        "AND kt.id IN (SELECT kterid FROM get_user_deps('Orders.dll','ViewAllOrders')) ";
            } else {
                sql = "select (select u.id || ' = ' || u.name " +
                        "from Listvalues lv " +
                        "join Users u on u.id = CAST(lv.val as integer) " +
                        "where lv.paramid = (select id from ListParams where paramcode='owner') and lv.ownerid = :Id LIMIT 1) as owner," +
                        " ob.id objid,ord.id orderid, ord.no, ord.date,  ord.inituserid, ord.stts, ord.info, " +
                        "ord.Changer, to_char(ord.Changed,'DD.MM.YYYY') Changed, ord.Creator,to_char(ord.Created,'DD.MM.YYYY') Created, " +
                        "(ord.inituserid|| ' = ' ||u.name) as initusername,  " +
                        "case when ord.parentid is null then 1 else 0 end Parent " +
                        "from orders ord " +
                        "join objs ob on ob.id = ord.objid " +
                        "join users u on ord.inituserid = u.id " +
                        "left join Users uCheck on uCheck.code = :User " +
                        "join Deps D on D.id=uCheck.depid  " +
                        "join Kter kt on kt.id=D.kterid " +
                        "where ord.id = :Id " +
                        "AND kt.id IN (SELECT kterid FROM get_user_deps('Orders.dll','ViewAllOrders')) ";
            }
            params.put("Id", orderid);
            params.put("User", user);
            List<OrderMovDetailsModel> s = db.Query(con, sql, OrderMovDetailsModel.class, params);
            if (s.size() == 0) {
                throw new Exception("");
            }
            return s.get(0);
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
    public String universalDataAcquisition(String table, int id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            if (table.equals("Users") || table.equals("Locations")) {
                params.put("table", table);
                String sql = "SELECT CASE WHEN  r.getobject_id IS NULL THEN -1 ELSE 1 END TableId FROM " +
                        " (SELECT getobject_id(:table)) r";
                List<String> result = db.Query(con, sql, String.class, params);
                if (Integer.parseInt(result.get(0)) != 1) {
                    throw new Exception("Таблица с именем '" + table + "' не найдена");
                } else {
                    params = new HashMap<>();
                    String sql1 = "SELECT (id || ' = ' || name) as name FROM " + table + " WHERE id = :id";
                    //params.put("table", table);
                    params.put("id", id);
                    List<String> result1 = db.Query(con, sql1, String.class, params);
                    if (result1.size() == 0) {
                        throw new Exception("Не найден тип объекта с ID = " + id);
                    }
                    return result1.get(0);
                }
            } else {
                throw new Exception("Невозможно получить данные. Была указана неправильная таблица.");
            }
        } catch (Exception ex) {
            throw ex;
        }
    }
}
