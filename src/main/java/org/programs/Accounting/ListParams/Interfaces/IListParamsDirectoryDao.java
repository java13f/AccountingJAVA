package org.kaznalnrprograms.Accounting.ListParams.Interfaces;

import org.kaznalnrprograms.Accounting.Kter.Models.KokModel;
import org.kaznalnrprograms.Accounting.ListParams.Models.ListParamsModel;
import org.kaznalnrprograms.Accounting.ListParams.Models.ListParamsViewModel;
import org.kaznalnrprograms.Accounting.ListParams.Models.TaskCodeModel;

import java.util.List;

public interface IListParamsDirectoryDao {

    /**
     * Получаем список дополнительных реквизитов
     * @return
     * @throws Exception
     */
    List<ListParamsViewModel> list(String taskcode, boolean showDel) throws Exception;

    /**
     * Функция получения реквизита для просмотра/изменения
     * @param id - индентификатор дополнительного реквизита
     * @return
     * @throws Exception
     */
    ListParamsModel get(int id) throws Exception;

    /**
     * Добавление/изменение реквизита
     * @param model - модель дополнительного реквизита
     * @return
     * @throws Exception
     */
    int save(ListParamsModel model) throws Exception;

    /**
     * Удаление реквизита
     * @param id - идентификатор дополнительного реквизита
     * @throws Exception
     */
    void delete(int id) throws Exception;

    /**
     * Получить список таблиц (TaskCode)
     * @return
     * @throws Exception
     */
    List<TaskCodeModel> GetTaskCodeList() throws Exception;

    /**
     * Проверям существуют ли дубликаты по уникальным полям
     * @param taskcode - код задачи (таблицы)
     * @param nom - номер параметра
     * @param id - идентификатор записи
     * @return
     * @throws Exception
     */
    boolean duplicateTaskCodeAndNom(String taskcode, int nom, int id) throws Exception;

    /**
     * Проверям существуют ли дубликаты по уникальным полям
     * @param taskcode - код задачи (таблицы)
     * @param paramcode - код параметра
     * @param id - идентификатор записи
     * @return
     * @throws Exception
     */
    boolean duplicateTaskCodeAndParamCode(String taskcode, String paramcode, int id) throws Exception;

     /**
     * Проверяем существует ли такой код в справочнике RefferParams
     * @param reffercode - Код справочника в таблице RefferParams (ParamCode)
     * @return
     * @throws Exception
     */
    boolean exsistRefferParams(String reffercode) throws Exception;

}
