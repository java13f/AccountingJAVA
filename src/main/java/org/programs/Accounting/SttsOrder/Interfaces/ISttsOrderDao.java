package org.kaznalnrprograms.Accounting.SttsOrder.Interfaces;

import org.kaznalnrprograms.Accounting.SttsOrder.Models.*;

import java.util.List;

public interface ISttsOrderDao {
    /**
     * Получение списка статусов
     * @param groupId
     * @param orderTypeId
     * @return
     * @throws Exception
     */
    List<SttsOrderViewModel> list(int groupId, int orderTypeId) throws Exception;

    /**
     * Получение списка групп
     * @return
     * @throws Exception
     */
    List<GroupsModel> groupsList() throws Exception;

    /**
     * Получение полей
     * @return
     * @throws Exception
     */
    List<OrderFieldModel> fieldsList() throws Exception;

    /**
     * Получение списка типов заявки
     * @return
     * @throws Exception
     */
    List<OrderTypesModel> orderTypesList() throws Exception;

    /**
     * Сохранение статусов
     * @param model
     * @return
     * @throws Exception
     */
    int save(SttsOrderViewModel model) throws Exception;

    /*
    * Есть ли статусы в указанной группе и типе заявки (нужен для проверки перед переносом)
    * */
    boolean checkForEmpty(int grId, int orderTypeId) throws Exception;

    /*
    * Перенос статусов из одногой группы и типа заявки в др.
    * */
    int saveTransfer(SttsOrderTransferModel obj) throws Exception;
}
