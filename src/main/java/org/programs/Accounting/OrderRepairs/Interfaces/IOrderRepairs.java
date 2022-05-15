package org.kaznalnrprograms.Accounting.OrderRepairs.Interfaces;

import org.kaznalnrprograms.Accounting.OrderRepairs.Models.*;
import org.sql2o.Connection;

import java.util.List;

public interface IOrderRepairs
{
    OrderRepairs getRec (int OrderId) throws Exception;

    List<ProblemsModel> getListProblems() throws Exception;

    UserModel getUser() throws Exception;

    List<SttsOrderModel> getListSttsOrder(int OrderTypeId, int Stts) throws Exception;

    UserModel getUserDepName(int Id) throws Exception;

    ObjsModel getObject(int Id) throws Exception;

    List<DateOpenModel> checkDate(String Date) throws Exception;

    ListparamsModel checkPropsAdditional(String ParamCode, String TaskCode) throws Exception;

    String getIdListparams(String ParamCode, String TaskCode) throws Exception;

    String getMaxOrderNumber(String date) throws  Exception;

    int save(OrderRepairs model) throws Exception;

    void savePhone(Connection con, int id, int paramid, int ownerid, String val) throws Exception;

    String getProblem (int id) throws Exception;
}
