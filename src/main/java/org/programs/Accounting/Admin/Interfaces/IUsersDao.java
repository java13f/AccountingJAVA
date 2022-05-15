package org.kaznalnrprograms.Accounting.Admin.Interfaces;

import org.kaznalnrprograms.Accounting.Admin.Models.DepsModel;
import org.kaznalnrprograms.Accounting.Admin.Models.KterViewModel;
import org.kaznalnrprograms.Accounting.Admin.Models.UserModel;
import org.kaznalnrprograms.Accounting.Admin.Models.UserViewModel;

import java.util.List;

public interface IUsersDao {
    /**
     * Фнкция возвращает список пользователей
     * @param code фильтер по части логина пользователя
     * @param name фильтер по части наименования
     * @param kterId фильтер по территории
     */
    List<UserViewModel> List(String code, String name, int kterId) throws Exception;

    /**
     * Функция получения пользователя
     * @param id - идентификатор пользователя
     * @return
     * @throws Exception
     */
    UserModel GetUser(int id) throws Exception;

    /**
     * Проверка существования пользователя
     * @param id - идентификатор пользователя
     * @param Code - логин ползователя
     * @return
     * @throws Exception
     */
    boolean ExistsUser(int id, String Code) throws Exception;
    /**
     * Получить список территорий
     * @return
     * @throws Exception
     */
    List<KterViewModel> GetKtersUserEdit() throws Exception;
    /**
     * Получить список подразделений
     * @param KterId - идентификатор территории
     * @return
     */
    List<DepsModel> GetDeps(int KterId) throws Exception;
    /**
     * Добавить/изменить пользователя
     * @param model - модуль пользователя
     * @return
     * @throws Exception
     */
    int Save(UserModel model) throws Exception;
    /**
     * Удаление пользователя
     * @param id - идентификатор пользователя
     * @return
     */
    String Delete(int id) throws Exception;

    /**
     * Получение строки представления пользователя для формы редактирования
     * @param id - идентификатор польбзователя
     */
    String getUserSel(int id) throws Exception;
}
