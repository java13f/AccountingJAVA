package org.kaznalnrprograms.Accounting.OrderUniversal.Interfaces;

import org.kaznalnrprograms.Accounting.OrderUniversal.Models.*;

import java.util.List;

public interface IOrderUniversalDao {
    OrderUniversalModel getOrder(int id) throws Exception;

    OrderUniversalUserModel getUser(int id) throws Exception;

    OrderUniversalObjModel getObj(int id) throws Exception;

    OrderUniversalProblemModel getProblem(int id) throws Exception;

    OrderUniversalOrderTypeModel getOrderType(int id) throws Exception;

    OrderUniversalImgLockModel getImgLockById(int id) throws Exception;

    OrderUniversalImgLockModel getImgLockByModel(OrderUniversalImgLockModel model) throws Exception;

    List<OrderUniversalValueModel> getListValues(int orderid, int ordertype) throws Exception;

    List<OrderUniversalValueModel> getPeriodValues(int orderid, int ordertype, int objid, String date) throws Exception;

    List<OrderUniversalSttsPermitsModel> getOrderPermits(int ordertype) throws Exception;

    boolean checkDay(String date) throws Exception;

    String getDataFromTable(String table, int id) throws Exception;

    String ClearLocks(String sesid) throws Exception;

    String getOrderNo(String date) throws Exception;

    String checkOrderNo(String no, String date) throws Exception;

    String checkObjectDates (int objid, String date) throws Exception;

    int save(OrderUniversalModel model) throws Exception;
}
