package org.kaznalnrprograms.Accounting.jrInvList;

import org.kaznalnrprograms.Accounting.jrInvList.Models.jrInvListModel;

import java.util.List;


public interface IjrInvListDao {
    /**
     * Получить территорию по id
     * @param id - id территория
     * @return - строка с данными территории
     * @throws Exception
     */
    String getKter(int id) throws Exception;

    /**
     * Получить список подразделений по выбранной территории
     * @param kterId - id территория
     * @return - список подразделений по выбранной территории
     * @throws Exception
     */
    List<jrInvListModel> getDepsList(int kterId) throws Exception;

    /**
     * Поулчить список счетов
     * @return - список счетов
     * @throws Exception
     */
    List<jrInvListModel> getAccCode() throws Exception;
}
