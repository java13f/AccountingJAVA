package org.kaznalnrprograms.Accounting.jrOSBudgetary.Interfaces;

public interface IjrOSBudgetaryDao {

    /**
     * Запрос для получения строки в формате id = name (универсальный)
     * @param id - Индентификатор объекта
     * @return
     * @throws Exception
     */
    String ObjName(int id) throws Exception;

    /**
     * Проврека выбранного объекта на соответсвие счета
     * @param objId - Индентификатор объекта
     * @return
     * @throws Exception
     */
    int checkAccs(int objId) throws Exception;
}
