package org.kaznalnrprograms.Accounting.SttsOrder.Dao;

import org.kaznalnrprograms.Accounting.SttsOrder.Interfaces.ISttsOrderDao;
import org.kaznalnrprograms.Accounting.SttsOrder.Models.*;
import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.lang.reflect.Method;
import java.util.*;

@Repository
public class SttsOrderDaoImpl implements ISttsOrderDao {
    private String appName = "SttsOrder - Доступность полей заявки";
    private DBUtils db;

    public SttsOrderDaoImpl(DBUtils db) {
        this.db = db;
    }

    /**
     * Получение списка статусов
     * @param groupId
     * @param orderTypeId
     * @return
     * @throws Exception
     */
    @Override
    public List<SttsOrderViewModel> list(int groupId, int orderTypeId) throws Exception {
        /*
(0-новая, 1-приостановлена, 2-в работе, 3-исполнена, -1-отклонена)
        * */
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();

            params.put("groupId", groupId);
            params.put("orderTypeId", orderTypeId);

            String sql = "SELECT distinct f.id, f.code, f.name,\n" +

                    "CASE WHEN newStts.isenable=0 and newStts.isvisible=1 THEN 'В-НД'\n" +
                    "     WHEN newStts.isenable=1 and newStts.isvisible=1 THEN 'В-Д'\n" +
                    "\t else 'ПУСТО' END AS newStts,\n" +
                    "\t \n" +
                    "CASE WHEN inProgressStts.isenable=0 and inProgressStts.isvisible=1 THEN 'В-НД'\n" +
                    "     WHEN inProgressStts.isenable=1 and inProgressStts.isvisible=1 THEN 'В-Д'\n" +
                    "\t else 'ПУСТО' END AS inProgressStts,\n" +
                    "\n" +

                    "CASE WHEN pauseStts.isenable=0 and pauseStts.isvisible=1 THEN 'В-НД'\n" +
                    "     WHEN pauseStts.isenable=1 and pauseStts.isvisible=1 THEN 'В-Д'\n" +
                    "\t else 'ПУСТО' END AS pauseStts,\n" +
                    "\n" +

                    "CASE WHEN doneStts.isenable=0 and doneStts.isvisible=1 THEN 'В-НД'\n" +
                    "     WHEN doneStts.isenable=1 and doneStts.isvisible=1 THEN 'В-Д'\n" +
                    "\t else 'ПУСТО' END AS doneStts,\n" +
                    "\n" +
                    "CASE WHEN rejectedStts.isenable=0 and rejectedStts.isvisible=1 THEN 'В-НД'\n" +
                    "     WHEN rejectedStts.isenable=1 and rejectedStts.isvisible=1 THEN 'В-Д'\n" +
                    "\t else 'ПУСТО' END AS rejectedStts,\n" +
                    "\n" +
                    "COALESCE(newStts.id, -1) as newSttsId,\n" +
                    "COALESCE(inProgressStts.id, -1) as inProgressSttsId,\n" +
                    "COALESCE(pauseStts.id, -1) as pauseSttsId,\n" +
                    "COALESCE(doneStts.id, -1) as doneSttsId,\n" +
                    "COALESCE(rejectedStts.id, -1) as rejectedSttsId\n" +

                    "FROM OrderFields F\n" +
                    "LEFT JOIN SttsOrder sttsOrderId ON sttsOrderId.orderfieldid = f.id \n" +
                    "\t\t\t\t\t\t\t  AND sttsOrderId.groupid = :groupId AND sttsOrderId.ordertypeid = :orderTypeId LEFT JOIN SttsOrder newStts ON newStts.orderfieldid = f.id \n" +
                    "                              AND newStts.groupid = :groupId AND newStts.ordertypeid = :orderTypeId \n" +
                    "\t\t\t\t\t\t\t  AND newStts.orderstts = 0\n" +
                    "\t\t\t\t\t\t\t  \n" +
                    "LEFT JOIN SttsOrder inProgressStts ON inProgressStts.orderfieldid = f.id \n" +
                    "                                     AND inProgressStts.groupid = :groupId AND inProgressStts.ordertypeid = :orderTypeId \n" +
                    "\t\t\t\t\t\t\t\t\t AND inProgressStts.orderstts = 2\n" +
                    "\t\t\t\t\t\t\t\t\t \n" +
                    "LEFT JOIN SttsOrder pauseStts ON pauseStts.orderfieldid = f.id \n" +
                    "                                AND pauseStts.groupid = :groupId AND pauseStts.ordertypeid = :orderTypeId \n" +
                    "\t\t\t\t\t\t\t\tAND pauseStts.orderstts = 1\n" +
                    "\t\t\t\t\t\t\t\t\n" +
                    "LEFT JOIN SttsOrder doneStts ON doneStts.orderfieldid = f.id \n" +
                    "                               AND doneStts.groupid = :groupId AND doneStts.ordertypeid = :orderTypeId \n" +
                    "\t\t\t\t\t\t\t   AND doneStts.orderstts = 3\n" +
                    "\t\t\t\t\t\t\t   \n" +
                    "LEFT JOIN SttsOrder rejectedStts ON rejectedStts.orderfieldid = f.id \n" +
                    "                                   AND rejectedStts.groupid = :groupId AND rejectedStts.ordertypeid = :orderTypeId \n" +
                    "\t\t\t\t\t\t\t\t   AND rejectedStts.orderstts = -1 order by f.code";
            return db.Query(con, sql, SttsOrderViewModel.class, params);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получение списка групп
     * @return
     * @throws Exception
     */
    @Override
    public List<GroupsModel> groupsList() throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "select id,id||' = '||name as name from groups where deleted=0";
            return db.Query(con, sql, GroupsModel.class, null);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получение полей
     * @return
     * @throws Exception
     */
    @Override
    public List<OrderFieldModel> fieldsList() throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "select id,id||' = '||name as name from orderfields where del=0 order by nullif(code, '')::int";
            return db.Query(con, sql, OrderFieldModel.class, null);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получение списка типов заявки
     * @return
     * @throws Exception
     */
    @Override
    public List<OrderTypesModel> orderTypesList() throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "select id,id||' = '||name as name from ordertypes where del=0";
            return db.Query(con, sql, OrderTypesModel.class, null);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Сохранение/обновление
     *
     * @param model
     * @param getStts
     * @param getIdStts
     */
    private void reflectSave(SttsOrderViewModel model, String getStts, String getIdStts) {
        try (Connection con = db.getConnection(appName)) {
            int sttsConvert = -1;

            Method method = model.getClass().getMethod(getStts);
            if (method.invoke(model).equals("ПУСТО")) sttsConvert = 0;
            if (method.invoke(model).equals("В-НД")) sttsConvert = 1;
            if (method.invoke(model).equals("В-Д")) sttsConvert = 2;

            method = model.getClass().getMethod(getIdStts);
            boolean isNew = method.invoke(model).equals("-1");

            if (isNew) {
                Map<String, Object> newSttsParams = new HashMap<>();

                newSttsParams.put("groupid", model.getGroupId());
                newSttsParams.put("ordertypeid", model.getOrderTypeId());
                newSttsParams.put("orderfieldid", model.getId());

                int orderstts = -2;
                switch (getStts) {
                    case "getNewStts":
                        orderstts = 0;
                        break;
                    case "getRejectedStts":
                        orderstts = -1;
                        break;
                    case "getDoneStts":
                        orderstts = 3;
                        break;
                    case "getInProgressStts":
                        orderstts = 2;
                        break;
                    case "getPauseStts":
                        orderstts = 1;
                        break;
                }

                if (isNew && sttsConvert == 0) {
                } else saveStts(con, sttsConvert, newSttsParams, orderstts);
            } else {
                Map<String, Object> params = new HashMap<>();

                method = model.getClass().getMethod(getIdStts);
                String getssstid = method.invoke(model).toString();
                params.put(getStts, Integer.parseInt(getssstid));

                if (sttsConvert == 0) {
                    String s = "delete from sttsorder where id= :" + getStts;
                    db.Execute(con, s, params);
                }
                if (sttsConvert == 1) {
                    String s = "update sttsorder set isenable=0, isvisible=1 where id=:" + getStts;
                    db.Execute(con, s, params);
                }
                if (sttsConvert == 2) {
                    String s = "update sttsorder set isenable=1, isvisible=1 where id=:" + getStts;
                    db.Execute(con, s, params);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Сохранение статусов
     *
     * @param model
     * @throws Exception
     */
    @Override
    public int save(SttsOrderViewModel model) throws Exception {
        try (Connection con = db.getConnection(appName)) {

            if (model.getNewSttsId().equals("-1") && model.getNewStts().equals("ПУСТО")) {
            } else
                reflectSave(model, "getNewStts", "getNewSttsId");

            if (model.getRejectedSttsId().equals("-1") && model.getRejectedStts().equals("ПУСТО")) {
            } else
                reflectSave(model, "getRejectedStts", "getRejectedSttsId");

            if (model.getDoneSttsId().equals("-1") && model.getDoneStts().equals("ПУСТО")) {
            } else
                reflectSave(model, "getDoneStts", "getDoneSttsId");

            if (model.getInProgressSttsId().equals("-1") && model.getInProgressStts().equals("ПУСТО")) {
            } else
                reflectSave(model, "getInProgressStts", "getInProgressSttsId");

            if (model.getPauseSttsId().equals("-1") && model.getPauseStts().equals("ПУСТО")) {
            } else
                reflectSave(model, "getPauseStts", "getPauseSttsId");

            return 0;
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Сохранение новой записи
     *
     * @param con
     * @param sttsConvert
     * @param saveNewParams
     * @param orderstts
     */
    private void saveStts(Connection con, int sttsConvert, Map<String, Object> saveNewParams, int orderstts) {
        String sql;

        saveNewParams.put("orderstts", orderstts);
        saveNewParams.put("isenable", sttsConvert == 1 ? 0 : 1);
        saveNewParams.put("isvisible", sttsConvert == 0 ? 0 : 1);

        sql = "insert into sttsorder(groupid,orderfieldid,orderstts,isenable,isvisible,ordertypeid) " +
                "values (:groupid,:orderfieldid,:orderstts,:isenable,:isvisible,:ordertypeid)";

        db.Execute(con, sql, saveNewParams);
    }

    /*
     * Есть ли статусы в указанной группе и типе заявки (нужен для проверки перед переносом)
     * */
    @Override
    public boolean checkForEmpty(int groupId, int orderTypeId) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();

            params.put("groupId", groupId);
            params.put("orderTypeId", orderTypeId);

            String sql = "SELECT count(*) as cnt\n" +
                    "FROM OrderFields F\n" +
                    "LEFT JOIN SttsOrder sttsOrderId ON sttsOrderId.orderfieldid = f.id \n" +
                    "  AND sttsOrderId.groupid = :groupId AND sttsOrderId.ordertypeid = :orderTypeId \n" +
                    "\n" +
                    "LEFT JOIN SttsOrder newStts ON newStts.orderfieldid = f.id\n" +
                    "\t\t\t\t\t\t\t  AND newStts.groupid = :groupId AND newStts.ordertypeid = :orderTypeId\n" +
                    " AND newStts.orderstts = 0\n" +
                    "\n" +
                    "LEFT JOIN SttsOrder inProgressStts ON inProgressStts.orderfieldid = f.id\n" +
                    "\t\t\t\t\t\t\t\t\t AND inProgressStts.groupid = :groupId AND inProgressStts.ordertypeid = :orderTypeId \n" +
                    " AND inProgressStts.orderstts = 2\n" +
                    "\n" +
                    "LEFT JOIN SttsOrder pauseStts ON pauseStts.orderfieldid = f.id \n" +
                    "\t\t\t\t\t\t\t\tAND pauseStts.groupid = :groupId AND pauseStts.ordertypeid = :orderTypeId \n" +
                    "AND pauseStts.orderstts = 1\n" +
                    "\n" +
                    "LEFT JOIN SttsOrder doneStts ON doneStts.orderfieldid = f.id \n" +
                    "\t\t\t\t\t\t\t   AND doneStts.groupid = :groupId AND doneStts.ordertypeid = :orderTypeId \n" +
                    "  AND doneStts.orderstts = 3\n" +
                    "\n" +
                    "LEFT JOIN SttsOrder rejectedStts ON rejectedStts.orderfieldid = f.id \n" +
                    "\t\t\t\t\t\t\t\t   AND rejectedStts.groupid = :groupId AND rejectedStts.ordertypeid = :orderTypeId \n" +
                    "  AND rejectedStts.orderstts = -1 \n" +
                    "\n" +
                    "where newStts.id<>-1 or inProgressStts.id<>-1 or pauseStts.id<>-1 or doneStts.id<>-1 or rejectedStts.id<>-1";
            Integer count = db.Query(con, sql, Integer.class, params).get(0);

            if (count > 0)
                return false;
            else
                return true;
        } catch (Exception ex) {
            throw ex;
        }
    }

    /*
     * Перенос статусов из одногой группы и типа заявки в др.
     * */
    @Override
    public int saveTransfer(SttsOrderTransferModel obj) throws Exception {
        try (Connection con = db.getConnectionWithTran(appName)) {
            String sql = "";

            if (!obj.isEmpty()) {
                sql += "delete from sttsorder where groupid=" + obj.getGroupToId() + " and ordertypeid=" + obj.getOrderTypeToId();
                db.Execute(con, sql, null);
            }

            sql = "insert into sttsorder(groupid, orderfieldid, orderstts, isenable, isvisible, ordertypeid) " +
                    "select " + obj.getGroupToId() + ", orderfieldid, orderstts, isenable, isvisible, " + obj.getOrderTypeToId() + " " +
                    "from sttsorder where groupid=" + obj.getGroupFromId() + " and ordertypeid=" + obj.getOrderTypeFromId();

            db.Execute(con, sql, null);

            con.commit();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 0;
    }
}