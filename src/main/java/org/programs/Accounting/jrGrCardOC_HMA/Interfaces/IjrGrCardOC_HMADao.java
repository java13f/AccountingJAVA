package org.kaznalnrprograms.Accounting.jrGrCardOC_HMA.Interfaces;

public interface IjrGrCardOC_HMADao {
    /**
     * Имя авторизированного пользователя AccountingJAVA
     * @return
     * @throws Exception
     */
    String LoadUser() throws Exception;


    /**
     * Id, инвентарный номер и название объекта
     * @param id - объекта
     * @return
     * @throws Exception
     */
    String getObject(int id) throws Exception;
}
