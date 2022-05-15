package org.kaznalnrprograms.Accounting.Admin.Controllers;

import org.kaznalnrprograms.Accounting.Admin.Interfaces.IGroupsDao;
import org.kaznalnrprograms.Accounting.Admin.Models.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.sql2o.Connection;

import java.util.List;

@Controller
public class AdminGroupsController {
    private IGroupsDao dGroups = null;

    public AdminGroupsController(IGroupsDao dGroups) {
        this.dGroups = dGroups;
    }
    @GetMapping("/AdminGroups/GroupEditForm")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public String GroupEditForm(){
        return "Admin/GroupEditForm :: GroupEditForm";
    }

    @GetMapping("/AdminGroups/UserGroupsEditForm")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public String UserGroupsEditFrom(){
        return "Admin/UserGroupsEditForm :: UserGroupsEditForm";
    }
    @GetMapping("/AdminGroups/GroupFormSel")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public String GroupFormSel(){
        return "Admin/Directories/GroupFormSel :: GroupFormSel";
    }
    @GetMapping("/AdminGroups/UserFormSel")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public String UserFormSel(){
        return "Admin/Directories/UserFormSel :: UserFormSel";
    }
    @GetMapping("AdminGroups/AppRightsEditForm")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public String AppRightsEditForm(){
        return "Admin/AppRightsEditForm :: AppRightsEditForm";
    }
    @GetMapping("/AdminGroups/ActGroupsEditForm")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public String ActGroupsEditForm(){
        return "Admin/ActGroupsEditForm :: ActGroupsEditForm";
    }
    @GetMapping("/AdminGroups/KterGroupsEditForm")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public String KterGroupsEditForm(){
        return "Admin/KterGroupsEditForm :: KterGroupsEditForm";
    }

    /**
     * Получить список групп
     * @param filter - фильтр по коду и наименованию группы
     * @param UserId - Фильтр по ползователю
     * @param AppId - Фильтр по приложению
     * @param ActId - Фильтр по действию
     * @param KterId - Фильтр по территории
     */
    @GetMapping("/AdminGroups/GroupsList")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody List<GroupViewModel> getGroupsList(@RequestParam(required = false, defaultValue = "") String filter,
                                                            @RequestParam(required = false, defaultValue = "-1") int UserId,
                                                            @RequestParam(required = false, defaultValue = "-1") int AppId,
                                                            @RequestParam(required = false, defaultValue = "-1") int ActId,
                                                            @RequestParam(required = false, defaultValue = "-1") int KterId) throws Exception {
        return dGroups.getGroupsList(filter, UserId, AppId, ActId, KterId);
    }
    /**
     * Функция возвращает пользователей группы
     * @param GroupId - идентификатор группы пользователей
     * @param kterId идентификатор территории
     */
    @GetMapping("/AdminGroups/UserList")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody List<UserGroupsViewModel> UserList (@RequestParam(required = false, defaultValue = "-1") int GroupId,
                                                             @RequestParam(required = false, defaultValue = "-1") int kterId) throws Exception {
        return dGroups.UserList(GroupId, kterId);
    }
    /**
     * Получить группу
     * @param GroupId - идентификатор группы
     */
    @GetMapping("/AdminGroups/GetGroup")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody GroupModel GetGroup(int GroupId) throws Exception {
        return dGroups.GetGroup(GroupId);
    }
    /**
     * Проверить существование группы
     * @param id - идентификатор группы (для новых -1)
     * @param code - код группы
     */
    @GetMapping("/AdminGroups/ExistsGroup")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody boolean ExistsGroup(int id, String code) throws Exception {
        return dGroups.ExistsGroup(id, code);
    }
    /**
     * Сохранение группы в базе данных
     * @param group - группа
     */
    @PostMapping("/AdminGroups/Save")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody int Save(@RequestBody GroupModel group) throws Exception {
        return dGroups.Save(group);
    }
    /**
     * Удаление группы
     * @param id - идентификатор группы
     */
    @PostMapping("/AdminGroups/Delete")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody String Delete(Integer id) throws Exception {
        return dGroups.Delete(id);
    }
    @GetMapping("/AdminGroups/GetGroupSel")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody String GetGroupSel(int id) throws Exception {
        return dGroups.getGroupSel(id);
    }
    /**
     * Получить привязку пользователя к группе
     * @param id - идентификатор привязки
     */
    @GetMapping("/AdminGroups/GetUserBinding")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody UserGroupsModel getUserBinding(int id) throws Exception {
        return dGroups.getUserBinding(id);
    }
    /**
     * Проверка существования пользователя в группе
     * @param id - идентификатор привязки (для новых -1)
     * @param groupId - идентификатор группы контроля
     * @param userId - идентификатор пользователя
     */
    @GetMapping("/AdminGroups/ExistsUserInGroup")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody boolean ExistsUserInGroup(int id,  int groupId, int userId) throws Exception {
        return dGroups.ExistsUserInGroup(id, groupId, userId);
    }
    /**
     * Добавить/Изменить привзяку пользователя к группе
     * @param model - модуль привязки пользователя к группе
     */
    @PostMapping("/AdminGroups/SaveUserInGroup")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody int SaveUserInGroup(@RequestBody UserGroupsModel model) throws Exception {
        return dGroups.SaveUserInGroup(model);
    }
    /**
     * Удаление пользователя из группы
     * @param id - идентификатор привязки пользователя к группе
     */
    @PostMapping("/AdminGroups/DeleteUserFromGroup")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody String DeleteUserFromGroup(Integer id) throws Exception {
        dGroups.DeleteUserFromGroup(id);
        return "";
    }
    /**
     * Получить список приложений, входящих в группу
     * @param GroupId - идентификатор группы
     */
    @GetMapping("/AdminGroups/GetAppRightsList")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody List<AppRightViewModel> GetAppRightsList(int GroupId) throws Exception {
        return dGroups.GetAppRightsList(GroupId);
    }

    /**
     * Получить привязку приложения к группе
     * @param id - идентификатор привязки
     */
    @GetMapping("/AdminGroups/GetAppRights")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody AppRightsModel GetAppRights(int id) throws Exception{
        return dGroups.GetAppRights(id);
    }

    /**
     * Проверить существование приложения в группе
     * @param id - идентификатор привязки приложения к группе (для новых -1)
     * @param groupId - идентификатор группы
     * @param appId - тдентификатор приложения
     */
    @GetMapping("/AdminGroups/ExistsAppInGroup")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody boolean ExistsAppInGroup(int id, int groupId, int appId) throws Exception {
        return dGroups.ExistsAppInGroup(id, groupId, appId);
    }

    /**
     * Добавить/Изменить привязку приложения к группе
     * @param model - модель привязки приложения к группе
     */
    @PostMapping("/AdminGroups/SaveAppRights")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody int SaveAppRights(@RequestBody AppRightsModel model) throws Exception {
        return dGroups.SaveAppRights(model);
    }

    /**
     * Удаление приложения из группы
     * @param id - идентификатор привязки приложения к группе
     */
    @PostMapping("/AdminGroups/DeleteAppFromGroup")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody String DeleteAppFromGroup(Integer id) throws Exception {
        dGroups.DeleteAppFromGroup(id);
        return "";
    }

    /**
     * Получить список действий группы
     * @param GroupId - идентификатор группы
     */
    @GetMapping("/AdminGroups/GetActGroupsList")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody List<ActGroupsViewModel> GetActGroupsList(int GroupId) throws Exception {
        return dGroups.GetActGroupsList(GroupId);
    }

    /**
     * Получиьт привязку действия к группе
     * @param id - идентификатор привязки действия к группе
     */
    @GetMapping("/AdminGroups/GetActGroup")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody ActGroupsModel GetActGroup(int id) throws Exception {
        return dGroups.GetActGroup(id);
    }

    /**
     * Проверить существования привязки действия к группе
     * @param id - идентификатор действия (для новых -1)
     * @param groupId - идентификатор группы
     * @param appId - идентификатор приложения
     * @param actId - идентификатор действия
     */
    @GetMapping("/AdminGroups/ExistsActInGroup")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody boolean ExistsActInGroup(int id, int groupId, int appId, int actId) throws Exception {
        return dGroups.ExistsActInGroup(id, groupId, appId, actId);
    }

    /**
     * Добавить/Изменить привязку действия к группе
     * @param model - модель привязки действия к группе
     */
    @PostMapping("/AdminGroups/SaveActGroups")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody int SaveActGroups(@RequestBody ActGroupsModel model) throws Exception {
        return dGroups.SaveActGroups(model);
    }

    /**
     * Удалить действие из группы
     * @param id - идентификатор привязки действия к группе
     */
    @PostMapping("/AdminGroups/DeleteActFromGroup")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody String DeleteActFromGroup(Integer id) throws Exception {
        dGroups.DeleteActFromGroup(id);
        return "";
    }
    /**
     * Получить список территорий группы
     * @param GroupId - идентификатор группы
     */
    @GetMapping("/AdminGroups/GetKterGroupsList")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody List<KterGroupsViewModel> GetKterGroupsList(int GroupId) throws Exception {
        return dGroups.GetKterGroupsList(GroupId);
    }

    /**
     * Получить привязку территории к группе
     * @param id - идентификатор привязки территории к группе
     */
    @GetMapping("/AdminGroups/GetKterGroups")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody KterGroupsModel GetKterGroups(int id) throws Exception {
        return dGroups.GetKterGroups(id);
    }

    /**
     * Проверить существование территории в группе
     * @param id - идентификатор привязки территории к группе (для новых -1)
     * @param groupId - идентификатор группы
     * @param kterId - идентификатор территории
     */
    @GetMapping("/AdminGroups/ExistsKterInGroup")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody boolean ExistsKterInGroup(int id, int groupId, int kterId) throws Exception {
        return dGroups.ExistsKterInGroup(id, groupId, kterId);
    }

    /**
     * Добавить/Изменить привязку территории к группе
     * @param model - модель привязки территории к группе
     */
    @PostMapping("/AdminGroups/SaveKterGroups")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody int SaveKterGroups(@RequestBody KterGroupsModel model) throws Exception {
        return dGroups.SaveKterGroups(model);
    }

    /**
     * Удалить территорию из группы
     * @param id - идентификатор привязки территории к группе
     */
    @PostMapping("/AdminGroups/DeleteKterFromGroup")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody String DeleteKterFromGroup(Integer id) throws Exception {
        dGroups.DeleteKterFromGroup(id);
        return "";
    }
}
