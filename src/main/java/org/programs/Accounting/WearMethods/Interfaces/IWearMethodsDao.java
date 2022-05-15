package org.kaznalnrprograms.Accounting.WearMethods.Interfaces;

import org.kaznalnrprograms.Accounting.WearMethods.Models.AccViewModel;
import org.kaznalnrprograms.Accounting.WearMethods.Models.WearMethodsModel;
import org.kaznalnrprograms.Accounting.WearMethods.Models.InvGroupViewModel;
import org.kaznalnrprograms.Accounting.WearMethods.Models.WearMethodsViewModel;

import java.util.List;

public interface IWearMethodsDao {
    /**
     * Получение списка методов начисления износа
     * @param showDel
     * @return
     * @throws Exception
     */
    List<WearMethodsViewModel> getWearMethodsList(boolean showDel) throws Exception;

    /**
     * Функция получения метода начисления износа для просмотра/изменения
     *
     * @param id - идентификатор подразделения
     * @return
     * @throws Exception
     */
    WearMethodsModel getWearMethodById(int id) throws Exception;

    /**
     * Функция
     *
     * @param id - идентификатор подразделения
     * @return
     * @throws Exception
     */
    InvGroupViewModel getInvGrById(int id) throws Exception;

    /**
     * Функция
     *
     * @return
     * @throws Exception
     */
    List<InvGroupViewModel> getInvGrList() throws Exception;

    /**
     * Функция
     *
     * @param id - идентификатор подразделения
     * @return
     * @throws Exception
     */
    AccViewModel getAccById(int id) throws Exception;

    /**
     * Функция
     *
     * @param id - идентификатор подразделения
     * @return
     * @throws Exception
     */
    boolean checkForDublicate(int id, int grId, int accId) throws Exception;

    /**
     * Сохранение записи в базу данных
     * @return
     * @throws Exception
     */
    int save(WearMethodsModel model) throws Exception;

    /**
     * Удаление записи по ИД
     * @param id
     * @throws Exception
     */
    void delete(int id) throws Exception;
}
