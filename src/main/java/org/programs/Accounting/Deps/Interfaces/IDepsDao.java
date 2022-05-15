package org.kaznalnrprograms.Accounting.Deps.Interfaces;

import org.kaznalnrprograms.Accounting.Deps.Models.DepsKterModel;
import org.kaznalnrprograms.Accounting.Deps.Models.DepsModel;
import org.kaznalnrprograms.Accounting.Deps.Models.DepsUserModel;
import org.kaznalnrprograms.Accounting.Deps.Models.DepsViewModel;

import java.util.List;

public interface IDepsDao {
    /**
     * Получение списка записей
     * @param showDel
     * @return
     * @throws Exception
     */
    List<DepsViewModel> list(boolean showDel) throws Exception;

    /**
     * Функция получения подразделения для просмотра/изменения
     *
     * @param id - идентификатор подразделения
     * @return
     * @throws Exception
     */
    DepsModel get(int id) throws Exception;

    /**
     * Сохранение записи в базу данных
     * @param deps
     * @return
     * @throws Exception
     */
    int save(DepsModel deps) throws Exception;

    /**
     * Удаление записи по ИД
     * @param id
     * @throws Exception
     */
    void delete(int id) throws Exception;

    /**
     * Проверка уникальности сохраняемой записи по территории и коду подразделения
     * @param id
     * @param kterId
     * @param code
     * @return
     * @throws Exception
     */
    boolean checkSameCode(int id, int kterId, String code) throws Exception;

    /**
     * Получение территории по ИД
     * @param id
     * @return
     * @throws Exception
     */
    DepsKterModel getKter(int id) throws Exception;

    /**
     * Получение пользователя по ИД
     * @param id
     * @return
     * @throws Exception
     */
    DepsUserModel getBossUser(int id) throws Exception;

    /**
     * Проверяем Есть ли уже главное подразделение
     * @param id
     * @return
     * @throws Exception
     */
    List<DepsModel> CheckMainDep(int id) throws Exception;

    /**
     * Получение всех доступных для территории пользователей
     * @return
     * @throws Exception
     */
    List<DepsUserModel> getUsers() throws Exception;
}
