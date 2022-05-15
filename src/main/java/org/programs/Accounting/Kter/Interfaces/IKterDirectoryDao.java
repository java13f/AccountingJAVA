package org.kaznalnrprograms.Accounting.Kter.Interfaces;

import org.kaznalnrprograms.Accounting.Kter.Models.KokModel;
import org.kaznalnrprograms.Accounting.Kter.Models.KterModel;
import org.kaznalnrprograms.Accounting.Kter.Models.KterViewModel;
import org.kaznalnrprograms.Accounting.Kter.Models.UserModel;

import java.util.List;

public interface IKterDirectoryDao {
    /**
     * Получить список территорий
     * @param filter - фильтр по коду терртиорий
     * @param showDel - флаг отображения удалёных записей
     * @return
     * @throws Exception
     */
    List<KterViewModel> list(String filter, boolean showDel) throws Exception;

    /**
     * Функция получения территории для просмотра/изменения территории
     * @param id - идентификатор территории
     * @return
     * @throws Exception
     */
    KterModel get(int id) throws Exception;

    /**
     * Проверить существование территории
     * @param id - идентификатьор территории (для новых -1)
     * @param code - код территории
     * @return
     * @throws Exception
     */
    boolean exists(int id, String code) throws Exception;

    /**
     * Добавить/ Изменить территорию
     * @param kter - модель территории
     * @return
     * @throws Exception
     */
    int save(KterModel kter) throws Exception;

    /**
     * Функция проверки существования неудалённых подразделений территории
     * @param kterId - идентификатор территории
     * @return
     * @throws Exception
     */
    boolean existsDeps(int kterId) throws Exception;

    /**
     * Удаление территории
     * @param id - идентификатор территории
     * @throws Exception
     */
    void delete(int id) throws Exception;

    /**
     * Пполучить список казначейств для формы редактирования записи
     * @return
     * @throws Exception
     */
    List<KokModel> GetKOKList() throws Exception;

    /**
     * Получить список пользователей казначейства
     * @param kokId идентификатор казначейства
     * @return
     * @throws Exception
     */
    List<UserModel> GetUsers(int kokId) throws Exception;
}
