package org.kaznalnrprograms.Accounting.RefferParams.Interfaces;

import org.kaznalnrprograms.Accounting.RefferParams.Models.RefferParamsModel;
import org.kaznalnrprograms.Accounting.RefferParams.Models.RefferParamsViewModel;

import java.util.List;

public interface IRefferParamsDao
{
    /**
     * Получить список реквизитов
     * @param ShowDel
     * @return
     * @throws Exception
     */
    List<RefferParamsViewModel> list(boolean ShowDel) throws Exception;

    /**
     * Удаление реквизита
     * @param id - идентификатор реквизита
     * @throws Exception
     */
    void delete(int id) throws Exception;

    /**
     * Проверка существования справочника
     * @param id
     * @param paramcode
     * @return
     * @throws Exception
     */
    boolean exists(int id, String paramcode) throws Exception;

    /**
     * Сохранение записи
     * @param refferparams
     * @return
     * @throws Exception
     */
    int save(RefferParamsModel refferparams) throws Exception;

    /**
     * Получить запись
     * @param id
     * @return
     * @throws Exception
     */
    RefferParamsModel get(int id) throws Exception;
}
