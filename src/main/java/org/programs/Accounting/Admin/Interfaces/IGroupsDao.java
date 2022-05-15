package org.kaznalnrprograms.Accounting.Admin.Interfaces;

import org.kaznalnrprograms.Accounting.Admin.Models.*;

import java.util.List;

public interface IGroupsDao {
    /**
     * Получить список групп
     * @param filter - Фильтр по коду и наименовании группы
     * @param UserId - Фильтр по пользователю
     * @param AppId - Фильтр по приложению
     * @param ActId - Фильтр по действию
     * @param KterId - Фильтр по территории
     */
    List<GroupViewModel> getGroupsList(String filter, int UserId, int AppId, int ActId, int KterId) throws Exception;
    /**
     * Получить группу
     * @param GroupId - идентификатор группы
     */
    GroupModel GetGroup(int GroupId) throws Exception;

    /**
     * Проверить существование группы
     * @param id - идентификатор группы (для новых -1)
     * @param code - код группы
     */
    boolean ExistsGroup(int id, String code) throws Exception;

    /**
     * Сохранение группы в базе данных
     * @param group - группа
     */
    int Save(GroupModel group) throws Exception;

    /**
     * Удаление группы
     * @param id - идентификатор группы
     */
    String Delete(int id) throws Exception;
    /**
     * Функция возвращает пользователей группы
     * @param GroupId - идентификатор группы пользователей
     * @param kterId идентификатор территории
     */
    List<UserGroupsViewModel> UserList(int GroupId, int kterId) throws Exception;

    /**
     * Получение строки представления группы для форме редактирования
     * @param id - идентификатор группы
     */
    String getGroupSel(int id) throws Exception;

    /**
     * Получить привязку пользователя к группе
     * @param id - идентификатор привязки
     */
    UserGroupsModel getUserBinding(int id) throws Exception;

    /**
     * Проверка существования пользователя в группе
     * @param Id - идентификатор привязки (для новых -1)
     * @param GroupId - идентификатор группы контроля
     * @param UserId - идентификатор пользователя
     */
    boolean ExistsUserInGroup(int Id,  int GroupId, int UserId) throws Exception;

    /**
     * Добавить/Изменить привзяку пользователя к группе
     * @param model - модуль привязки пользователя к группе
     */
    int SaveUserInGroup(UserGroupsModel model) throws Exception;

    /**
     * Удаление пользователя из группы
     * @param id - идентификатор привязки пользователя к группе
     */
    void DeleteUserFromGroup(int id) throws Exception;

    /**
     * Получить список приложений, входящих в группу
     * @param GroupId - идентификатор группы
     */
    List<AppRightViewModel> GetAppRightsList(int GroupId) throws Exception;

    /**
     * Получить привязку приложения к группе
     * @param id - идентификатор привязки
     */
    AppRightsModel GetAppRights(int id) throws Exception;

    /**
     * Проверить существование приложения в группе
     * @param id - идентификатор привязки приложения к группе (для новых -1)
     * @param groupId - идентификатор группы
     * @param appId - тдентификатор приложения
     */
    boolean ExistsAppInGroup(int id, int groupId, int appId) throws Exception;

    /**
     * Добавить/Изменить привязку приложения к группе
     * @param model - модель привязки приложения к группе
     */
    int SaveAppRights(AppRightsModel model) throws Exception;

    /**
     * Удаление приложения из группы
     * @param id - идентификатор привязки приложения к группе
     */
    void DeleteAppFromGroup(int id) throws Exception;

    /**
     * Получить список действий группы
     * @param GroupId - идентификатор группы
     */
    List<ActGroupsViewModel> GetActGroupsList(int GroupId) throws Exception;

    /**
     * Получиьт привязку действия к группе
     * @param id - идентификатор привязки действия к группе
     */
    ActGroupsModel GetActGroup(int id) throws Exception;

    /**
     * Проверить существования привязки действия к группе
     * @param id - идентификатор действия (для новых -1)
     * @param groupId - идентификатор группы
     * @param appId - идентификатор приложения
     * @param actId - идентификатор действия
     */
    boolean ExistsActInGroup(int id, int groupId, int appId, int actId) throws Exception;

    /**
     * Добавить/Изменить привязку действия к группе
     * @param model - модель привязки действия к группе
     */
    int SaveActGroups(ActGroupsModel model) throws Exception;

    /**
     * Удалить действие из группы
     * @param id - идентификатор привязки действия к группе
     */
    void DeleteActFromGroup(int id) throws Exception;

    /**
     * Получить список территорий группы
     * @param GroupId - идентификатор группы
     */
    List<KterGroupsViewModel> GetKterGroupsList(int GroupId) throws Exception;

    /**
     * Получить привязку территории к группе
     * @param id - идентификатор привязки территории к группе
     */
    KterGroupsModel GetKterGroups(int id) throws Exception;

    /**
     * Проверить существование территории в группе
     * @param id - идентификатор привязки территории к группе (для новых -1)
     * @param groupId - идентификатор группы
     * @param kterId - идентификатор территории
     */
    boolean ExistsKterInGroup(int id, int groupId, int kterId) throws Exception;

    /**
     * Добавить/Изменить привязку территории к группе
     * @param model - модель привязки территории к группе
     */
    int SaveKterGroups(KterGroupsModel model) throws Exception;

    /**
     * Удалить территорию из группы
     * @param id - идентификатор привязки территории к группе
     */
    void DeleteKterFromGroup(int id) throws Exception;
}
