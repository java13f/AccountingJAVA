package org.kaznalnrprograms.Accounting.OrderWear.Interfaces;

import org.kaznalnrprograms.Accounting.OrderWear.Models.OrderViewModel;
import org.kaznalnrprograms.Accounting.OrderWear.Models.OrderWearObjModel;
import org.kaznalnrprograms.Accounting.OrderWear.Models.OrderWearSaveModel;
import org.kaznalnrprograms.Accounting.OrderWear.Models.UserModel;

import java.util.List;

public interface IOrderWearDao {
    OrderWearObjModel getObj(int id) throws Exception;
    String getNextNo(String date) throws Exception;
    UserModel getUserFromId(int id) throws Exception;
    String chkNo(String no, String date) throws Exception;
    int save(List<OrderWearSaveModel> model) throws Exception;
    OrderViewModel getOrderFromId(int id) throws Exception;
    boolean checkDay(String date) throws Exception;
    String checkInitUser(int userid) throws Exception;
    String checkExpObjs(int objid, String date) throws Exception;
    String checkExpObjsArray(int[] objid, String date) throws Exception;
}
