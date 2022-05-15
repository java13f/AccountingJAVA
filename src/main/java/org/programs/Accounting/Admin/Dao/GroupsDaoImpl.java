package org.kaznalnrprograms.Accounting.Admin.Dao;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import org.kaznalnrprograms.Accounting.Admin.Interfaces.IGroupsDao;
import org.kaznalnrprograms.Accounting.Admin.Models.*;
import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;
import org.sql2o.Query;
import org.sql2o.Sql2o;

import javax.servlet.http.HttpServletRequest;
import javax.sql.DataSource;
import java.security.Principal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class GroupsDaoImpl implements IGroupsDao {
    private String appName = "Admin - модуль администрирования";
    private DBUtils db;

    public GroupsDaoImpl(DBUtils db){
        this.db = db;
    }

    /**
     * Получить список групп
     * @param filter - Фильтр по коду и наименовании группы
     * @param UserId - Фильтр по пользователю
     * @param AppId - Фильтр по приложению
     * @param ActId - Фильтр по действию
     * @param KterId - Фильтр по территории
     */
    @Override
    public List<GroupViewModel> getGroupsList(String filter, int UserId, int AppId, int ActId, int KterId) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<String, Object>();
            String fFilter = "";
            String fUserId = "";
            String fAppId = "";
            String fActId = "";
            String fKterId = "";
            if(!filter.isEmpty()) {
                fFilter= " AND g.Code ILIKE '%' || :filter || '%' OR g.Name ILIKE '%' || :filter || '%' ";
                params.put("filter", filter);
            }
            if(UserId!=-1) {
                fUserId = " AND (SELECT COUNT(*) FROM UserGroups ug WHERE ug.GroupId = g.Id AND ug.UserId = "+UserId+") > 0 ";
            }
            if(AppId!=-1){
                fAppId = " AND (SELECT COUNT(*) FROM AppRights ar WHERE ar.GroupId = g.Id AND ar.AppId = "+AppId+") > 0 ";
            }
            if(ActId!=-1){
                fActId = " AND (SELECT COUNT(*) FROM ActGroups ag WHERE ag.GroupId = g.Id AND ag.ActId = "+ActId+") > 0 ";
            }
            if(KterId != - 1){
                fKterId = " AND (SELECT COUNT(*) FROM KterGroups kg WHERE kg.GroupId = g.Id AND kg.KterId = "+KterId+") > 0 ";
            }
            String sql = "SELECT g.Id, g.Code, g.Name, CASE WHEN g.Deleted = 0 THEN 'Нет' ELSE 'Да' END Deleted FROM Groups g" +
                    " WHERE 1=1" + fFilter + fUserId + fAppId + fActId + fKterId +
                    " ORDER BY Code";

            List<GroupViewModel> groups = db.Query(con, sql, GroupViewModel.class, params);
            return groups;
        }
        catch (Exception ex) {
            throw ex;
        }
    }
    /**
     * Получить группу
     * @param GroupId - идентификатор группы
     */
    @Override
    public GroupModel GetGroup(int GroupId) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT * FROM Groups WHERE Id = " + GroupId;
            List<GroupModel> groups = db.Query(con, sql, GroupModel.class, null);
            if(groups.size()==0){
                throw new Exception("Не удалось загрузить группу с Id = " + GroupId);
            }
            return groups.get(0);
        }
        catch (Exception ex){
            throw ex;
        }
    }
    /**
     * Проверить существование группы
     * @param id - идентификатор группы (для новых -1)
     * @param code - код группы
     */
    @Override
    public boolean ExistsGroup(int id, String code) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT COUNT(*) FROM Groups WHERE Code ILIKE :code AND Id <> "+id;
            Map<String, Object> params = new HashMap<>();
            params.put("code", code);
            return db.Query(con, sql, Integer.class, params).get(0) > 0;
        }
        catch(Exception ex){
            throw ex;
        }
    }
    /**
     * Сохранение группы в базе данных
     * @param group - группа
     */
    @Override
    public int Save(GroupModel group) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "";
            Map<String, Object> params = new HashMap<>();
            params.put("Code", group.getCode());
            params.put("Name", group.getName());
            if(group.getId()==-1){
                sql = "INSERT INTO Groups (Code, Name, Deleted) VALUES(:Code, :Name, "+group.getDeleted()+")";
                group.setId(db.Execute(con, sql, Integer.class, params));
            }
            else{
                db.CheckLock(con, group.getId(), "Groups");
                sql = "UPDATE Groups SET Code = :Code, Name = :Name, Deleted = " + group.getDeleted() + " WHERE Id = "+group.getId();
                db.Execute(con, sql, params);
            }
            return group.getId();
        }
        catch(Exception ex){
            throw ex;
        }
    }
    /**
     * Удаление группы
     * @param id - идентификатор группы
     */
    @Override
    public String Delete(int id) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT COUNT(*) as cnt FROM UserGroups WHERE GroupId = " + id;
            int count = db.Query(con, sql, Integer.class, null).get(0);
            if(count>0){
                return "Данную группу невозможно удалить так как к ней привязаны пользователи";
            }
            sql = "SELECT COUNT(*) as cnt FROM AppRights WHERE GroupId = " + id;
            count = db.Query(con, sql, Integer.class, null).get(0);
            if(count>0){
                return "Данную группу невозможно удалить так как к ней привязаны приложения";
            }
            sql = "SELECT COUNT(*) as cnt FROM ActGroups WHERE GroupId = " + id;
            count = db.Query(con, sql, Integer.class, null).get(0);
            if(count>0){
                return "Данную группу невозможно удалить так как к ней привязаны действия";
            }
            sql = "SELECT COUNT(*) as cnt FROM KterGroups WHERE GroupId = " + id;
            count = db.Query(con, sql, Integer.class, null).get(0);
            if(count>0){
                return "Данную группу невозможно удалить так как к ней привязаны территории";
            }
            sql = "SELECT COUNT(*) as cnt FROM ReportGroups WHERE GroupId = " + id;
            count = db.Query(con, sql, Integer.class, null).get(0);
            if(count>0){
                return "Данную группу невозможно удалить так как к ней привязаны отчёты";
            }
            sql = "DELETE FROM Groups WHERE Id = " + id;
            db.Execute(con, sql, null);
            return "";
        }
        catch (Exception ex){
            throw ex;
        }
    }
    /**
     * Функция возвращает пользователей группы
     * @param GroupId - идентификатор группы пользователей
     * @param kterId идентификатор территории
     */
    @Override
    public List<UserGroupsViewModel> UserList(int GroupId, int kterId) throws Exception {
        if(GroupId==-1) {
            return new ArrayList<>();
        }
        try(Connection con = db.getConnection(appName)) {
            String sql = "SELECT ug.Id, u.Name as UserName, k.Name as KterName FROM UserGroups ug"
                    +" JOIN Users u ON u.Id = ug.UserId"
                    +" JOIN Deps d ON d.Id = u.DepId"
                    +" JOIN Kter k ON k.Id = d.KterId"
                    +" WHERE ug.GroupId = :GroupId";
            if(kterId!=-1){
                sql+=" AND k.Id = " + kterId;
            }
            Map<String, Object> params = new HashMap<String, Object>();
            params.put("GroupId", GroupId);
            List<UserGroupsViewModel> UserGroups = db.Query(con, sql, UserGroupsViewModel.class, params);
            return  UserGroups;
        } catch (Exception ex) {
            throw ex;
        }
    }
    /**
     * Получение строки представления группы для форме редактирования
     * @param id - идентификатор группы
     */
    @Override
    public String getGroupSel(int id) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT LTRIM(RTRIM(CAST(Id AS VARCHAR(128)))) || ' = ' || Name FROM Groups WHERE id = "+id;
            List<String> result = db.Query(con, sql, String.class, null);
            if(result.size()==0){
                throw new Exception("Не удалось получить группу с Id = " + id);
            }
            return result.get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }
    /**
     * Получить привязку пользователя к группе
     * @param id - идентификатор привязки
     */
    @Override
    public UserGroupsModel getUserBinding(int id) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT * FROM UserGroups WHERE Id = " + id;
            List<UserGroupsModel> UserGroups = db.Query(con, sql, UserGroupsModel.class, null);
            if(UserGroups.size() == 0){
                throw new Exception("Не удалось получить привязку пользователя к группе с Id = " + id);
            }
            return UserGroups.get(0);
        }
        catch (Exception ex){
            throw ex;
        }
    }
    /**
     * Проверка существования пользователя в группе
     * @param Id - идентификатор привязки (для новых -1)
     * @param GroupId - идентификатор группы контроля
     * @param UserId - идентификатор пользователя
     */
    @Override
    public boolean ExistsUserInGroup(int Id,  int GroupId, int UserId) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT COUNT(*) FROM UserGroups WHERE GroupId = " + GroupId + " AND UserId = " + UserId + " AND Id <> " + Id;
            return db.Query(con, sql, Integer.class, null).get(0) > 0;
        }
        catch(Exception ex){
            throw ex;
        }
    }
    /**
     * Добавить/Изменить привзяку пользователя к группе
     * @param model - модуль привязки пользователя к группе
     */
    @Override
    public int SaveUserInGroup(UserGroupsModel model) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "";
            if(model.getId() == -1){
                sql = "INSERT INTO UserGroups (GroupId, UserId) VALUES(" + model.getGroupId() + ", " + model.getUserId() + ")";
                model.setId(db.Execute(con, sql, Integer.class, null));
            }
            else {
                db.CheckLock(con, model.getId(), "UserGroups");
                sql = "UPDATE UserGroups SET GroupId = " + model.getGroupId() + ", UserId = " + model.getUserId() + " WHERE Id = " + model.getId();
                db.Execute(con, sql, null);
            }
            return model.getId();
        }
        catch(Exception ex){
            throw ex;
        }
    }
    /**
     * Удаление пользователя из группы
     * @param id - идентификатор привязки пользователя к группе
     */
    @Override
    public void DeleteUserFromGroup(int id) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "DELETE FROM UserGroups WHERE Id = " + id;
            db.Execute(con, sql, null);
        }
        catch(Exception ex){
            throw ex;
        }
    }
    /**
     * Получить список приложений, входящих в группу
     * @param GroupId - идентификатор группы
     */
    @Override
    public List<AppRightViewModel> GetAppRightsList(int GroupId) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT ar.Id, a.Code, a.Name, CASE WHEN ar.Mode=1 THEN 'Действующий' ELSE 'Удалён' END as Mode "+
            "FROM AppRights ar, Apps a WHERE ar.AppId = a.Id AND ar.GroupId = " + GroupId + " ORDER BY a.Name";
            return db.Query(con, sql, AppRightViewModel.class, null);
        }
        catch (Exception ex){
            throw ex;
        }
    }


    /**
     * Получить привязку приложения к группе
     * @param id - идентификатор привязки
     */
    @Override
    public AppRightsModel GetAppRights(int id) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT * FROM AppRights WHERE Id = " + id;
            List<AppRightsModel> result = db.Query(con, sql, AppRightsModel.class, null);
            if(result.size() == 0){
                throw new Exception("Не удалось получить привязку приложения к группе с Id = " + id);
            }
            return result.get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Проверить существование приложения в группе
     * @param id - идентификатор привязки приложения к группе (для новых -1)
     * @param groupId - идентификатор группы
     * @param appId - тдентификатор приложения
     */
    @Override
    public boolean ExistsAppInGroup(int id, int groupId, int appId) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT COUNT(*) as cnt FROM AppRights WHERE GroupId = " + groupId + " AND AppId = " + appId + " AND Id <> " + id;
            return db.Query(con, sql, Integer.class, null).get(0) > 0;
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Добавить/Изменить привязку приложения к группе
     * @param model - модель привязки приложения к группе
     */
    @Override
    public int SaveAppRights(AppRightsModel model) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "";
            if(model.getId() == -1){
                sql = "INSERT INTO AppRights (GroupId, AppId, Mode) VALUES (" + model.getGroupId() + ", " + model.getAppId() + ", " + model.getMode() + ")";
                model.setId(db.Execute(con, sql, Integer.class, null));
            }
            else{
                db.CheckLock(con, model.getId(), "AppRights");
                sql = "UPDATE AppRights SET GroupId = " + model.getGroupId() + ", AppId = " + model.getAppId() + ", Mode = " + model.getMode() + " WHERE Id = " + model.getId();
                db.Execute(con, sql, null);
            }
            return model.getId();
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Удаление приложения из группы
     * @param id - идентификатор привязки приложения к группе
     */
    @Override
    public void DeleteAppFromGroup(int id) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "DELETE FROM AppRights WHERE Id = " + id;
            db.Execute(con, sql, null);
        }
        catch(Exception ex){
            throw ex;
        }
    }
    /**
     * Получить список действий группы
     * @param GroupId - идентификатор группы
     */
    @Override
    public List<ActGroupsViewModel> GetActGroupsList(int GroupId) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT ag.Id, ap.Code as AppCode, ap.Name as AppName, ac.Code as ActCode, ac.Name as ActName, CASE WHEN ag.Mode=1 THEN 'Действующий' ELSE 'Удалён' END as Mode " +
                    " FROM ActGroups ag, Apps ap, Acts ac WHERE ag.AppId = ap.Id AND ag.ActId = ac.Id AND ag.GroupId = " + GroupId;
            return db.Query(con, sql, ActGroupsViewModel.class, null);
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Получиьт привязку действия к группе
     * @param id - идентификатор привязки действия к группе
     */
    @Override
    public ActGroupsModel GetActGroup(int id) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT * FROM ActGroups WHERE Id = " + id;
            List<ActGroupsModel> result = db.Query(con, sql, ActGroupsModel.class, null);
            if(result.size() == 0){
                throw new Exception("Не удалось загрузить привязку действия к группе с Id = " + id);
            }
            return result.get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Проверить существования привязки действия к группе
     * @param id - идентификатор действия (для новых -1)
     * @param groupId - идентификатор группы
     * @param appId - идентификатор приложения
     * @param actId - идентификатор действия
     */
    @Override
    public boolean ExistsActInGroup(int id, int groupId, int appId, int actId) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT COUNT(*) as cnt FROM ActGroups WHERE GroupId = " + groupId + " AND AppId = " + appId + " AND ActId = " + actId + " AND id <> " + id;
            return db.Query(con, sql, Integer.class, null).get(0) > 0;
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Добавить/Изменить привязку действия к группе
     * @param model - модель привязки действия к группе
     */
    @Override
    public int SaveActGroups(ActGroupsModel model) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "";
            if(model.getId() == -1){
                sql = "INSERT INTO ActGroups (GroupId, AppId, ActId, Mode) VALUES (" + model.getGroupId() + ", " + model.getAppId() + ", " + model.getActId() + ", " + model.getMode() + ")";
                model.setId(db.Execute(con, sql, Integer.class,null));
            }
            else {
                db.CheckLock(con, model.getId(), "ActGroups");
                sql = "UPDATE ActGroups SET GroupId = " + model.getGroupId() + ", AppId = " + model.getAppId() + ", ActId = " + model.getActId() + ", Mode = " + model.getMode() + " WHERE Id = " + model.getId();
                db.Execute(con, sql, null);
            }
            return model.getId();
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Удалить действие из группы
     * @param id - идентификатор привязки действия к группе
     */
    @Override
    public void DeleteActFromGroup(int id) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "DELETE FROM ActGroups WHERE Id = " + id;
            db.Execute(con, sql, null);
        }
        catch(Exception ex){
            throw ex;
        }
    }
    /**
     * Получить список территорий группы
     * @param GroupId - идентификатор группы
     */
    @Override
    public List<KterGroupsViewModel> GetKterGroupsList(int GroupId) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT kg.Id, kt.Name as KterName FROM KterGroups kg, Kter kt WHERE kg.KterId = kt.Id AND kg.GroupId = " + GroupId;
            return db.Query(con, sql, KterGroupsViewModel.class, null);
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Получить привязку территории к группе
     * @param id - идентификатор привязки территории к группе
     */
    @Override
    public KterGroupsModel GetKterGroups(int id) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT * FROM KterGroups WHERE Id = " + id;
            List<KterGroupsModel> result = db.Query(con, sql, KterGroupsModel.class, null);
            if(result.size() == 0){
                throw new Exception("Не удалось загрузить привязку территории к группе с Id = " + id);
            }
            return result.get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Проверить существование территории в группе
     * @param id - идентификатор привязки территории к группе (для новых -1)
     * @param groupId - идентификатор группы
     * @param kterId - идентификатор территории
     */
    @Override
    public boolean ExistsKterInGroup(int id, int groupId, int kterId) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT COUNT(*) as cnt FROM KterGroups WHERE GroupId = " + groupId + " AND KterId = " + kterId + " AND id <> "+id;
            return db.Query(con, sql, Integer.class, null).get(0) > 0;
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Добавить/Изменить привязку территории к группе
     * @param model - модель привязки территории к группе
     */
    @Override
    public int SaveKterGroups(KterGroupsModel model) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "";
            if(model.getId() == -1){
                sql = "INSERT INTO KterGroups (GroupId, KterId) VALUES (" + model.getGroupId() + ", " + model.getKterId() + ")";
                model.setId(db.Execute(con, sql, Integer.class, null));
            }
            else {
                db.CheckLock(con, model.getId(), "KterGroups");
                sql = "UPDATE KterGroups SET GroupId = " + model.getGroupId() + ", KterId = " + model.getKterId() + " WHERE Id = " + model.getId();
                db.Execute(con, sql, null);
            }
            return model.getId();
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Удалить территорию из группы
     * @param id - идентификатор привязки территории к группе
     */
    @Override
    public void DeleteKterFromGroup(int id) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "DELETE FROM KterGroups WHERE Id = " + id;
            db.Execute(con, sql, null);
        }
        catch(Exception ex){
            throw ex;
        }
    }
}
