package org.kaznalnrprograms.Accounting.Problems.Interfaces;

import org.kaznalnrprograms.Accounting.Problems.Models.ProblemsModel;
import org.kaznalnrprograms.Accounting.Problems.Models.ProblemsViewModel;

import java.util.List;

public interface IProblemsDirectoryDao {
    /**
     * Получить список проблем
     * @param showDel - флаг отображения удаленных записей
     * @return
     */
    List<ProblemsViewModel> list (boolean showDel, int obj_type_id) throws Exception;

    /**
     * Функция получения проблемы для ее просмотра/изменения
     * @param id - идентификатор территории (для новых -1)
     * @return
     * @throws Exception
     */
    ProblemsModel get(int id) throws Exception;

    /**
     * Добавить / Изменить территорию
     * @param problem - модель проблемы
     * @return
     * @throws Exception
     */
    int save(ProblemsModel problem) throws Exception;


    /**
     * Удаление проблемы
     * @param id
     * @throws Exception
     */
    void delete(int id) throws Exception;

    /**
     * Получить название типа объекта
     * @param id
     * @return
     * @throws Exception
     */
    String getObjectType(int id) throws Exception;


}
