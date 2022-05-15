package org.kaznalnrprograms.Accounting.OrderMov.Interfaces;

import org.kaznalnrprograms.Accounting.OrderMov.Models.ObjectsModel;
import org.kaznalnrprograms.Accounting.OrderMov.Models.OrderMovDetailsModel;
import org.kaznalnrprograms.Accounting.OrderMov.Models.OrderMovGridModel;
import org.kaznalnrprograms.Accounting.OrderMov.Models.SaveModel;
import org.sql2o.Connection;

import java.util.List;

public interface IOrderMovDao {

    /**
     * Получить список территорий
     * @param orderid - id записи для редактирования
     * @return
     * @throws Exception
     */
    List<ObjectsModel> gridload(int orderid,String date) throws Exception;
    OrderMovDetailsModel getdetails(int orderid,String ordertypecode) throws Exception;
    String getusername() throws Exception;
    String getno(String date) throws Exception;
    ObjectsModel getobj(String objid,String date) throws Exception;
    int saveupdate(SaveModel model) throws Exception;
    String checkdate(String date,String dateonstart) throws Exception;
    String checkobjdate(SaveModel smodel) throws Exception;
    boolean checkobjowner(List<ObjectsModel> objects) throws Exception;
    int DBInsert(SaveModel model, Connection con, int parentid, int index) throws Exception;
    int DBUpdateDelete(SaveModel model,Connection con,int parentid,int index,int ParentDel,int fromroomparid,int locationparid,int ownerparid) throws Exception;
    void DBListValues(SaveModel model,Connection con,int index,int fromroomparid,int locationparid,int ownerparid) throws Exception;
    String checklocat(SaveModel model) throws Exception;
    String checkno(String orderno,String date) throws Exception;
    Integer checkdateDbWork(String date) throws Exception;
    String checkinit(int uid) throws Exception;
    /**
     * Запрос для получения строки в формате id = name (универсальный)
     * @param table - Имя таблицы
     * @param id - Идентификатор записи в таблице
     * @return
     * @throws Exception
     */
    String universalDataAcquisition(String table, int id) throws Exception;

}
