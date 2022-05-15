import {GroupEditForm} from "./GroupEditForm.js"
import {UserEditForm} from "./UserEditForm.js";
import {UserGroupsEditForm} from "./UserGroupsEditForm.js";
import {AppEditForm} from "./AppEditForm.js";
import {AppRightsEditForm} from "./AppRightsEditForm.js";
import {ActEditForm} from "./ActEditForm.js";
import {ActGroupsEditForm} from "./ActGroupsEditForm.js";
import {KterGroupsEditForm} from "./KterGroupsEditForm.js";
import {UserFilterForm} from "./UserFilterForm.js";
import {ActFilterForm} from "./ActFilterForm.js";

class Admin
{
    constructor() {
        this.GroupIndex = 0;
        this.GroupId = -1;
        this.UserIndex = 0;
        this.UserId = -1;
        this.UserGroupsIndex = 0;
        this.UserGroupsId = -1;
        this.AppsId = -1;
        this.AppRightsIndex = 0;
        this.AppRightsId = -1;
        this.ActId = -1;
        this.ActIndex = 0;
        this.ActGroupsId = -1;
        this.ActGroupsIndex = 0;
        this.KterIndex = 0;
        this.KterGroupsId = -1;
        this.KterGroupsIndex = 0;

        this.FilterKterUserGroupsId = -1;
        this.FilterLogin = "";
        this.FilterUserName = "";

        this.FilterKterUsersId = -1;

        this.FilterActsAppId = -1;
        this.FilterActsCode = "";
        this.FilterActsName = "";

        this.ModuleId = ""
        this.sLoc = new LibLockService(300000);
    }

    /**
     * Получить url с учётом контекста
     * @param url - базовый url-адрес без учёта контекста
     */
    GetUrl(url) {
        return contextPath + url;
    }

    /**
     * Стартовая функция модуля
     * @param Id - идентификатор элемента UI, куда необходимо загрузить интерфейс модуля
     */
    Start(Id) {
        this.ModuleId = "#"+Id;
        LoadForm(this.ModuleId, this.GetUrl("/Admin/"), this.InitFunc.bind(this));
    }

    /**
     * Инициализация интерфейса пользователя для пользователей
     */
    InitUsersUI(){
        //Инициализация работы логики с пользователями
        this.btnAddUser = $("#btnAddUser_Module_Admin");
        this.btnChangeUser = $("#btnChangeUser_Module_Admin");
        this.btnDeleteUser = $("#btnDeleteUser_Module_Admin");
        this.btnUpdateUsers = $("#btnUpdateUser_Module_Admin");
        this.btnShowFilterUsers = $("#btnShowFilterUsers_Module_Admin");
        this.cbFixGroupsByUser = $("#cbFixGroupsByUser_Module_Admin");

        this.btnAddUser.attr("href", "javascript:void(0)");
        this.btnChangeUser.attr("href", "javascript:void(0)");
        this.btnDeleteUser.attr("href", "javascript:void(0)");
        this.btnUpdateUsers.attr("href", "javascript:void(0)");
        this.btnShowFilterUsers.attr("href", "javascript:void(0)");

        this.btnUpdateUsers.linkbutton({
            onClick: this.btnUpdateUsers_onClick.bind(this)
        })
        this.btnAddUser.linkbutton({
            onClick: this.btnAddUser_onClick.bind(this)
        });
        this.btnChangeUser.linkbutton({
            onClick: this.btnChangeUser_onClick.bind(this)
        });
        this.btnDeleteUser.linkbutton({
            onClick: this.btnDeleteUser_onClick.bind(this)
        })
        this.btnShowFilterUsers.linkbutton({
            onClick: this.btnShowFilterUsers_onClick.bind(this)
        });
        this.cbFixGroupsByUser.checkbox({onChange:this.btnUpdateGroups_onClick.bind(this)});
        //Инициализация логики работы с пользователями группы
        this.btnAddUserGroups = $("#btnAddUserGroups_Module_Admin");
        this.btnChangeUserGroups = $("#btnChangeUserGroups_Module_Admin");
        this.btnDeleteUserGroups = $("#btnDeleteUserGroups_Module_Admin");
        this.btnUpdateUserGroups = $("#btnUpdateUserGroups_Module_Admin");
        this.btnChooseKterForUserGroupsFilter = $("#btnChooseKterForUserGroupsFilter_Module_Admin");
        this.txFilterUserGroups = $("#txFilterUserGroups_Module_Admin");
        this.btnClearFilterUserGroupsKter = $("#btnClearFilterUserGroupsKter_Module_Admin");

        this.btnAddUserGroups.attr("href", "javascript:void(0)");
        this.btnChangeUserGroups.attr("href", "javascript:void(0)");
        this.btnDeleteUserGroups.attr("href", "javascript:void(0)");
        this.btnUpdateUserGroups.attr("href", "javascript:void(0)");
        this.btnChooseKterForUserGroupsFilter.attr("href", "javascript:void(0)");
        this.btnClearFilterUserGroupsKter.attr("href", "javascript:void(0)");
        this.btnUpdateUserGroups.linkbutton({
            onClick: this.btnUpdateUserGroups_onClick.bind(this)
        });
        this.btnAddUserGroups.linkbutton({
            onClick: this.btnAddUserGroups_onClick.bind(this)
        });
        this.btnChangeUserGroups.linkbutton({
            onClick: this.btnChangeUserGroups_onClick.bind(this)
        });
        this.btnDeleteUserGroups.linkbutton({
            onClick: this.btnDeleteUserGroups_onClick.bind(this)
        });
        this.btnChooseKterForUserGroupsFilter.linkbutton({
            onClick: this.btnChooseKterForUserGroupsFilter_onClick.bind(this)
        });
        this.btnClearFilterUserGroupsKter.linkbutton({
            onClick: this.btnClearFilterUserGroupsKter_onClick.bind(this)
        });
    }

    /**
     * Инициализация интерфейса ползователя для приложений
     */
    InitAppsUI(){
        this.dgApps = $("#dgApps_Module_Admin");
        this.cbFixGroupsByApp = $("#cbFixGroupsByApp_Module_Admin");
        this.btnAddApp = $("#btnAddApp_Module_Admin");
        this.btnChangeApp = $("#btnChangeApp_Module_Admin");
        this.btnDeleteApp = $("#btnDelApp_Module_Admin");
        this.btnUpdateApps = $("#btnUpdateApps_Module_Admin");
        this.dgApps.treegrid({
            loadFilter:this.LoadFilter.bind(this),
            onLoadError:(data)=>{ this.ShowErrorResponse(data.responseJSON); },
            onLoadSuccess: this.dgApps_onLoadSuccess.bind(this),
            onSelect: this.dgApps_onSelect.bind(this)
        });
        this.cbFixGroupsByApp.checkbox({onChange:this.btnUpdateGroups_onClick.bind(this)});
        this.btnAddApp.attr("href", "javascript:void(0)");
        this.btnChangeApp.attr("href", "javascript:void(0)");
        this.btnDeleteApp.attr("href", "javascript:void(0)");
        this.btnUpdateApps.attr("href", "javascript:void(0)");
        this.btnAddApp.linkbutton({
            onClick: this.btnAddApp_onClick.bind(this)
        });
        this.btnUpdateApps.linkbutton({
           onClick: this.btnUpdateApps_onClick.bind(this)
        });
        this.btnChangeApp.linkbutton({
            onClick: this.btnChangeApp_onClik.bind(this)
        });
        this.btnDeleteApp.linkbutton({
            onClick: this.btnDeleteApp_onClick.bind(this)
        });
        //Инициализация логики работы с привязками приложений к группам
        this.dgAppRights = $("#dgAppRights_Module_Admin");
        this.btnAddAppRights = $("#btnAddAppRights_Module_Admin");
        this.btnChangeAppRights = $("#btnChangeAppRights_Module_Admin");
        this.btnDeleteAppRights = $("#btnDelAppRights_Module_Admin");
        this.btnUpdateAppRights = $("#btnUpdateAppRights_Module_Admin");
        this.dgAppRights.datagrid({
            loadFilter:this.LoadFilter.bind(this),
            onLoadError:(data)=>{ this.ShowErrorResponse(data.responseJSON); },
            onLoadSuccess: this.dgAppRights_onLoadSuccess.bind(this),
        });
        this.btnAddAppRights.attr("href", "javascript:void(0)");
        this.btnChangeAppRights.attr("href", "javascript:void(0)");
        this.btnDeleteAppRights.attr("href", "javascript:void(0)");
        this.btnUpdateAppRights.attr("href", "javascript:void(0)");
        this.btnUpdateAppRights.linkbutton({
            onClick: this.btnUpdateAppRights_onClick.bind(this)
        });
        this.btnAddAppRights.linkbutton({
            onClick: this.btnAddAppRights_onClick.bind(this)
        });
        this.btnChangeAppRights.linkbutton({
            onClick: this.btnChangeAppRights_onClick.bind(this)
        });
        this.btnDeleteAppRights.linkbutton({
            onClick: this.btnDeleteAppRights_onClick.bind(this)
        });
    }

    /**
     *Инициализация интерфейса ползователя для действий
     */
    InitActsUI(){
        this.dgActs = $("#dgActs_Module_Admin");
        this.btnAddAct = $("#btnAddAct_Module_Admin");
        this.btnChangeAct = $("#btnChangeAct_Module_Admin");
        this.btnDeleteAct = $("#btnDelAct_Module_Admin");
        this.btnUpdateActs = $("#btnUpdateActs_Module_Admin");
        this.cbFixGroupsByAct = $("#cbFixGroupsByAct_Module_Admin");
        this.btnShowFilterActs = $("#btnShowFilterActs_Module_Admin");
        this.dgActs.datagrid({
            loadFilter:this.LoadFilter.bind(this),
            onLoadError:(data)=>{ this.ShowErrorResponse(data.responseJSON); },
            onLoadSuccess: this.dgActs_onLoadSuccess.bind(this),
            onSelect: this.dActs_onSelect.bind(this)
        });
        AddKeyboardNavigationForGrid(this.dgActs);
        this.btnAddAct.attr("href", "javascript:void(0)");
        this.btnChangeAct.attr("href", "javascript:void(0)");
        this.btnDeleteAct.attr("href", "javascript:void(0)");
        this.btnUpdateActs.attr("href", "javascript:void(0)");
        this.btnShowFilterActs.attr("href", "javascript:void(0)");
        this.btnAddAct.linkbutton({
            onClick: this.btnAddAct_onClick.bind(this)
        });
        this.btnChangeAct.linkbutton({
            onClick: this.btnChangeAct_onClick.bind(this)
        });
        this.btnDeleteAct.linkbutton({
            onClick: this.btnDeleteAct_onClick.bind(this)
        });
        this.btnUpdateActs.linkbutton({
            onClick: this.btnUpdateActs_onClick.bind(this)
        });
        this.btnShowFilterActs.linkbutton({
            onClick: this.btnShowFilterActs_onClick.bind(this)
        });
        this.cbFixGroupsByAct.checkbox({onChange:this.btnUpdateGroups_onClick.bind(this)});

        this.dgActGroups = $("#dgActGroups_Module_Admin");
        this.btnUpdateActGroups = $("#btnUpdateActGroups_Module_Admin");
        this.btnAddActGroups = $("#btnAddActGroup_Module_Admin");
        this.btnChangeActGroups = $("#btnChangeActGroup_Module_Admin");
        this.btnDeleteActGroups = $("#btnDeleteActGroups_Module_Admin");
        this.dgActGroups.datagrid({
            loadFilter:this.LoadFilter.bind(this),
            onLoadError:(data)=>{ this.ShowErrorResponse(data.responseJSON); },
            onLoadSuccess: this.dgActGroups_onLoadSuccess.bind(this),
        });
        AddKeyboardNavigationForGrid(this.dgActGroups);
        this.btnUpdateActGroups.attr("href", "javascript:void(0)");
        this.btnAddActGroups.attr("href", "javascript:void(0)");
        this.btnChangeActGroups.attr("href", "javascript:void(0)");
        this.btnDeleteActGroups.attr("href", "javascript:void(0)");
        this.btnUpdateActGroups.linkbutton({
            onClick: this.btnUpdateActGroups_onClick.bind(this)
        });
        this.btnAddActGroups.linkbutton({
            onClick: this.btnAddActGroups_onClick.bind(this)
        });
        this.btnChangeActGroups.linkbutton({
            onClick: this.btnChangeActGroups_onClick.bind(this)
        });
        this.btnDeleteActGroups.linkbutton({
            onClick: this.btnDeleteActGroups_onClick.bind(this)
        });
    }

    /**
     *Инициализация интерфейса ползователя для территорий
     */
    InitKterUI(){
        this.dgKters = $("#dgKters_Module_Admin");
        this.btnUpdateKters = $("#btnUpdateKters_Module_Admin");
        this.cbFixGroupsByKter = $("#cbFixGroupsByKter_Module_Admin");
        this.dgKters.datagrid({
            loadFilter:this.LoadFilter.bind(this),
            onLoadError:(data)=>{ this.ShowErrorResponse(data.responseJSON); },
            onLoadSuccess: this.dgKters_onLoadSuccess.bind(this),
            onSelect: this.dgKters_onSelect.bind(this)
        });
        AddKeyboardNavigationForGrid(this.dgKters);
        this.btnUpdateKters.attr("href", "javascript:void(0)");
        this.btnUpdateKters.linkbutton({
            onClick: this.btnUpdateKters_onClick.bind(this)
        });
        this.cbFixGroupsByKter.checkbox({onChange:this.btnUpdateGroups_onClick.bind(this)});

        this.dgKterGroups = $("#dgKterGroups_Module_Admin");
        this.btnAddKterGroups = $("#btnAddKterGroups_Module_Admin");
        this.btnChangeKterGroups = $("#btnChangeKterGroups_Module_Admin");
        this.btnDeleteKterGroups = $("#btnDeleteKterGroups_Module_Admin");
        this.btnUpdateKterGroups = $("#btnUpdateKterGroups_Module_Admin");
        this.dgKterGroups.datagrid({
            loadFilter:this.LoadFilter.bind(this),
            onLoadError:(data)=>{ this.ShowErrorResponse(data.responseJSON); },
            onLoadSuccess: this.dgKterGroups_onLoadSuccess.bind(this),
        });
        AddKeyboardNavigationForGrid(this.dgKterGroups);
        this.btnAddKterGroups.attr("href", "javascript:void(0)");
        this.btnChangeKterGroups.attr("href", "javascript:void(0)");
        this.btnDeleteKterGroups.attr("href", "javascript:void(0)");
        this.btnUpdateKterGroups.attr("href", "javascript:void(0)");
        this.btnUpdateKterGroups.linkbutton({
            onClick:this.btnUpdateKterGroups_onClick.bind(this)
        });
        this.btnAddKterGroups.linkbutton({
            onClick: this.btnAddKterGroups_onClick.bind(this)
        });
        this.btnChangeKterGroups.linkbutton({
            onClick: this.btnChangeKterGroups_onClick.bind(this)
        });
        this.btnDeleteKterGroups.linkbutton({
            onClick: this.btnDeleteKterGroups_onClick.bind(this)
        });
    }
    /**
     *Функция инициализации пользовательского интерфейса
     */
    InitFunc(){
        //InitEasyUIForBlock(this.ModuleId);
        this.tbBindings = $("#tbBindings_Module_Admin");
        this.tbBindings.tabs({
            onSelect: ((title, index) =>{this.dgGroups_onSelect();}).bind(this)
        });
        //Инициализация гридов
        this.dgGroups = $("#dgGroups_Module_Admin");
        this.dgUsers = $("#dgUsers_Module_Admin");
        this.dgUserGroups = $("#dgUserGroups_Module_Admin");
        this.dgGroups.datagrid({
            loadFilter:this.LoadFilter.bind(this),
            onLoadError:(data)=>{ this.ShowErrorResponse(data.responseJSON); },
            onLoadSuccess: this.dgGroups_onLoadSuccess.bind(this),
            onSelect: this.dgGroups_onSelect.bind(this)
        });
        AddKeyboardNavigationForGrid(this.dgGroups);
        this.dgUsers.datagrid({
            loadFilter:this.LoadFilter.bind(this),
            onLoadError:(data)=>{ this.ShowErrorResponse(data.responseJSON); },
            onLoadSuccess: this.dgUsers_onLoadSuccess.bind(this),
            onSelect: this.dgUsers_onSelect.bind(this)
        });
        AddKeyboardNavigationForGrid(this.dgUsers);
        this.dgUserGroups.datagrid({
            loadFilter:this.LoadFilter.bind(this),
            onLoadError:(data)=>{this.ShowErrorResponse(data.responseJSON); },
            onLoadSuccess: this.dgUserGroups_onLoadSuccess.bind(this),
        });
        AddKeyboardNavigationForGrid(this.dgUserGroups);
        //Инициализация логики работы с группами
        this.btnAddGroup = $("#btnAddGroup_Module_Admin");
        this.btnChangeGroup = $("#btnChangeGroup_Module_Admin");
        this.btnDeleteGroup = $("#btnDeleteGroup_Module_Admin");
        this.btnUpdateGroups = $("#btnUpdateGroups_Module_Admin");
        this.txGroupFilter = $("#txGroupFilter_Module_Admin");

        this.btnAddGroup.attr("href", "javascript:void(0)");
        this.btnAddGroup.linkbutton({
            onClick: this.btnAddGroup_onClick.bind(this)
        });
        this.btnChangeGroup.attr("href", "javascript:void(0)");
        this.btnChangeGroup.linkbutton({
            onClick: this.btnChangeGroup_onClick.bind(this)
        })
        this.btnDeleteGroup.attr("href", "javascript:void(0)");
        this.btnDeleteGroup.linkbutton({
            onClick: this.btnDeleteGroup_onClick.bind(this)
        })
        this.btnUpdateGroups.attr("href", "javascript:void(0)");
        this.btnUpdateGroups.linkbutton({
            onClick: this.btnUpdateGroups_onClick.bind(this)
        })
        this.txGroupFilter.textbox({
            onChange: this.txGroupFilter_onChange.bind(this)
        });
        this.InitUsersUI();
        this.InitAppsUI();
        this.InitActsUI();
        this.InitKterUI();
        this.dgGroups.datagrid({url:this.GetUrl("/AdminGroups/GroupsList")});
        this.dgUsers.datagrid({url:this.GetUrl("/AdminUsers/List")});
        this.dgApps.treegrid({url:this.GetUrl("/AdminApps/List")});
        this.dgActs.datagrid({url:this.GetUrl("/AdminActs/List")});
        this.dgKters.datagrid({url:this.GetUrl("/AdminKter/List")})
    }

    /**
     * Показать ошибку, которую возвращает сервер
     * @param responseJSON - объект ошибки
     */
    ShowErrorResponse(responseJSON) {
        let error = "message: " + responseJSON.message + "<br/>"
            +"error: " + responseJSON.error + "<br/>"
            +"status: " + responseJSON.status + "<br/>"
            +"path: " + responseJSON.path;
        this.ShowError(error);
    }

    /**
     * Показать предупреждение
     * @param text - текст предупреждения
     */
    ShowWarning(text) {
        $.messager.alert("Предупреждение", text, "warning");
    }

    /**
     * Показать ошибку
     * @param text - тескт ошибки
     */
    ShowError(text) {
        $.messager.alert("Ошибка", text, "error");
    }

    /**
     * Фильтрация получаемых данных с сервера приложений
     * @param data - данные, которые необходимо профильтровать
     */
    LoadFilter(data) {
        return EscapeSpecialHTMLCharacters(data);
    }

    /**
     * Обработка успешного окончания загрузки групп
     * @param data - информаци о загруженных данных
     */
    dgGroups_onLoadSuccess(data) {
        if(data.total>0)
        {
            if(this.GroupId!=-1)
            {
                this.dgGroups.datagrid("selectRecord", this.GroupId);
            }
            else
            {
                if(this.GroupIndex>=0&& this.GroupIndex < data.total)
                {
                    this.dgGroups.datagrid("selectRow", this.GroupIndex);
                }
                else if (data.total>0)
                {
                    this.dgGroups.datagrid("selectRow", data.total-1);
                }
            }
            this.GroupId = -1;
            this.GroupIndex = 0;
        }
    }

    /**
     * Обработка выбора группы
     */
    dgGroups_onSelect() {
        let tab = this.tbBindings.tabs("getSelected");
        let tabId = tab[0].id;
        if(tabId == "tpUsers_Module_Admin"){
            this.btnUpdateUserGroups_onClick();
        }
        if(tabId == "tpApps_Module_Admin"){
            this.btnUpdateAppRights_onClick();
        }
        if(tabId == "tpActs_Module_Admin"){
            this.btnUpdateActGroups_onClick();
        }
        if(tabId == "tpKters_Module_Admin"){
            this.btnUpdateKterGroups_onClick();
        }
    }
    //-----------------------------------------------------------------------------------------------------------------
    //Операции с группами начало блока
    //-----------------------------------------------------------------------------------------------------------------
    /**
     * Обработка добавления группы
     */
    btnAddGroup_onClick(){
        let form = new GroupEditForm();
        form.SetOkFunction((RecId)=>{  this.GroupId = RecId; this.btnUpdateGroups_onClick();});
        form.Show(null);
    }

    /**
     * Обработка изменения группы
     */
    btnChangeGroup_onClick(){
        if(this.dgGroups.datagrid("getRows").length == 0)
        {
            this.ShowWarning("Нет записей для редактирования");
            return false;
        }
        let selData = this.dgGroups.datagrid("getSelected");
        if(selData==null)
        {
            this.ShowWarning("Выберите запись для редактирования");
            return false;
        }
        let editMode = Keys.isKeyDown(Keys.VK_Z) || Keys.isKeyDown(Keys.VK_OEM_PERIOD);
        if(editMode){
            this.sLoc.LockRecord("Groups", selData.id, this.btnContinueChangeGroup_onClik.bind(this));
        }
        else{
            this.btnContinueChangeGroup_onClik({id: selData.id, editMode: editMode, lockMessage:'', lockState: false});
        }
    }

    /**
     * Продолжение открытия группы для изменения
     * @param options - настройки открытия группы
     */
    btnContinueChangeGroup_onClik(options){
        if(options.lockMessage.length!=0){
            this.ShowWarning(options.lockMessage);
            return;
        }
        else{
            if(options.editMode){
                options.lockState = true
            }
        }
        let form = new GroupEditForm();
        form.SetOkFunction((RecId)=>{  this.GroupId = RecId; this.btnUpdateGroups_onClick();});
        form.SetCloseWindowFunction((options)=>{
            if(options!=null){
                if(options.lockState){
                    this.sLoc.FreeLockRecord("Groups", options.id);
                }
            }
        })
        form.Show(options);
    }

    /**
     * Удаление группы
     */
    btnDeleteGroup_onClick(){
        if(this.dgGroups.datagrid("getRows").length == 0)
        {
            this.ShowWarning("Нет записей для удаления");
            return false;
        }
        let selData = this.dgGroups.datagrid("getSelected");
        if(selData==null)
        {
            this.ShowWarning("Выберите запись для удаления");
            return false;
        }
        $.messager.confirm("Удаление", "Вы действительно хотите удалить выделенную группу?", ((r)=>{
            if(r) {
                this.sLoc.StateLockRecord("Groups", selData.id, ((options) => {
                    if (options.data.length) {
                        this.ShowWarning(options.data);
                    } else {
                        this.btnContinueDeleteGroup_onClick(options)
                    }
                }).bind(this));
            }
        }).bind(this));
    }

    /**
     * Продолжение удаления
     * @param options - настройки удаления группы
     */
    btnContinueDeleteGroup_onClick(options){
        $.ajax({
            method: "POST",
            url: this.GetUrl('/AdminGroups/Delete'),
            data: {id: options.id},
            success:function(data){
                if(data.length) {
                    this.ShowWarning(data);
                }
                else{
                    this.btnUpdateGroups_onClick();
                }
            }.bind(this),
            error:function(data){ this.ShowErrorResponse(data.responseJSON); }.bind(this)
        });
    }
    /**
     * Обработка обновления списка групп
     */
    btnUpdateGroups_onClick() {
        let row = this.dgGroups.datagrid("getSelected");
        if(row!=null)
        {
            this.GroupIndex = this.dgGroups.datagrid("getRowIndex", row);
        }
        let filter = this.txGroupFilter.textbox("getText");
        filter = encodeURIComponent(filter)

        let FixGroupsByUser = this.cbFixGroupsByUser.checkbox("options").checked;
        let FixGroupsByApp = this.cbFixGroupsByApp.checkbox("options").checked;
        let FixGroupsByAct = this.cbFixGroupsByAct.checkbox("options").checked;
        let FixGroupsByKter = this.cbFixGroupsByKter.checkbox("options").checked;
        let UserId = "-1";
        let AppId = "-1";
        let ActId = "-1";
        let KterId = "-1";
        if(FixGroupsByUser) {
            if(this.dgUsers.datagrid("getRows").length != 0) {
                let selData = this.dgUsers.datagrid("getSelected");
                if (selData != null) {
                    UserId = selData.id;
                }
            }
        }
        if(FixGroupsByApp){
            let selData = this.dgApps.treegrid("getSelected");
            if(selData!=null){
                AppId = selData.id;
            }
        }
        if(FixGroupsByAct){
            if(this.dgActs.datagrid("getRows").length != 0) {
                let selData = this.dgActs.datagrid("getSelected");
                if (selData != null) {
                    ActId = selData.id;
                }
            }
        }
        if(FixGroupsByKter){
            if(this.dgKters.datagrid("getRows").length != 0) {
                let selData = this.dgKters.datagrid("getSelected");
                if (selData != null) {
                    KterId = selData.id;
                }
            }
        }
        this.dgGroups.datagrid({url:this.GetUrl("/AdminGroups/GroupsList?filter="+filter
            +"&UserId="+UserId
            +"&AppId=" + AppId
            +"&ActId=" + ActId
            +"&KterId=" + KterId)});
    }

    /**
     * Обработка фильтра по имени и коду группы
     */
    txGroupFilter_onChange() {
        this.btnUpdateGroups_onClick();
    }
    //-----------------------------------------------------------------------------------------------------------------
    //Операции с группами конец блока
    //-----------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------
    //Операции с пользователями начало блока
    //-----------------------------------------------------------------------------------------------------------------
    /**
     * Обработка выбора пользователя
     */
    dgUsers_onSelect() {
        let FixGroupsByUser = this.cbFixGroupsByUser.checkbox("options").checked;
        if(FixGroupsByUser)
        {
            this.btnUpdateGroups_onClick();
        }
    }

    /**
     * Обработка окончания загрузки списка пользователей
     * @param data - информация о загруженных данных
     */
    dgUsers_onLoadSuccess(data){
        if(data.total>0)
        {
            if(this.UserId!=-1)
            {
                this.dgUsers.datagrid("selectRecord", this.UserId);
            }
            else
            {
                if(this.UserIndex>=0&& this.UserIndex < data.total)
                {
                    this.dgUsers.datagrid("selectRow", this.UserIndex);
                }
                else if (data.total>0)
                {
                    this.dgUsers.datagrid("selectRow", data.total-1);
                }
            }
            this.UserId = -1;
            this.UserIndex = 0;
        }
    }
    /**
     * Обработка обновления списка пользователей
     */
    btnUpdateUsers_onClick() {
        let row = this.dgUsers.datagrid("getSelected");
        if(row!=null)
        {
            this.UserIndex = this.dgUsers.datagrid("getRowIndex", row);
        }
        let code = encodeURIComponent(this.FilterLogin);
        let name = encodeURIComponent(this.FilterUserName);
        let kterId = this.FilterKterUsersId
        this.dgUsers.datagrid({url:this.GetUrl("/AdminUsers/List?"
            +"code=" + code
            +"&name=" + name
            +"&kterId="+kterId.toString())});
    }
    /**
     * Обработка добавления группы
     */
    btnAddUser_onClick(){
        let form = new UserEditForm();
        form.SetOkFunction((RecId)=>{  this.UserId = RecId; this.btnUpdateUsers_onClick();});
        form.Show(null);
    }
    /**
     * Обработка изменения пользователя
     */
    btnChangeUser_onClick(){
        if(this.dgUsers.datagrid("getRows").length == 0)
        {
            this.ShowWarning("Нет записей для редактирования");
            return false;
        }
        let selData = this.dgUsers.datagrid("getSelected");
        if(selData==null)
        {
            this.ShowWarning("Выберите запись для редактирования");
            return false;
        }
        let editMode = Keys.isKeyDown(Keys.VK_Z) || Keys.isKeyDown(Keys.VK_OEM_PERIOD);
        if(editMode){
            this.sLoc.LockRecord("Users", selData.id, this.btnContinueChangeUser_onClik.bind(this));
        }
        else{
            this.btnContinueChangeUser_onClik({id: selData.id, editMode: editMode, lockMessage:'', lockState: false});
        }
    }

    /**
     * Продолжение открытия пользователя для изменения
     * @param options - настройки открытия пользователя
     */
    btnContinueChangeUser_onClik(options){
        if(options.lockMessage.length!=0){
            this.ShowWarning(options.lockMessage);
            return;
        }
        else{
            if(options.editMode){
                options.lockState = true
            }
        }
        let form = new UserEditForm();
        form.SetOkFunction((RecId)=>{  this.UserId = RecId; this.btnUpdateUsers_onClick();});
        form.SetCloseWindowFunction((options)=>{
            if(options!=null){
                if(options.lockState){
                    this.sLoc.FreeLockRecord("Users", options.id);
                }
            }
        })
        form.Show(options);
    }
    /**
     * Удаление пользователя
     */
    btnDeleteUser_onClick(){
        if(this.dgUsers.datagrid("getRows").length == 0)
        {
            this.ShowWarning("Нет записей для удаления");
            return false;
        }
        let selData = this.dgUsers.datagrid("getSelected");
        if(selData==null)
        {
            this.ShowWarning("Выберите запись для удаления");
            return false;
        }
        $.messager.confirm("Удаление", "Вы действительно хотите удалить выделенного пользователя?", ((r)=>{
            if(r) {
                this.sLoc.StateLockRecord("Users", selData.id, ((options) => {
                    if (options.data.length) {
                        this.ShowWarning(options.data);
                    } else {
                        this.btnContinueDeleteUser_onClick(options)
                    }
                }).bind(this));
            }
        }).bind(this));
    }

    /**
     * Продолжение удаления пользователя
     * @param options - настройки удаления пользователя
     */
    btnContinueDeleteUser_onClick(options){
        $.ajax({
            method: "POST",
            url: this.GetUrl('/AdminUsers/Delete'),
            data: {id: options.id},
            success:function(data){
                if(data.length) {
                    this.ShowWarning(data);
                }
                else{
                    this.btnUpdateUsers_onClick();
                }
            }.bind(this),
            error:function(data){ this.ShowErrorResponse(data.responseJSON); }.bind(this)
        });
    }

    /**
     * Показать фильтр по пользователям
     */
    btnShowFilterUsers_onClick(){
        let form = new UserFilterForm();
        form.SetResultFunc(function(data){
            this.FilterLogin = data.Code;
            this.FilterUserName = data.Name;
            this.FilterKterUsersId = data.KterId;
            this.btnUpdateUsers_onClick();
        }.bind(this));
        form.Show({AddMode: true, Code: this.FilterLogin, Name: this.FilterUserName, KterId: this.FilterKterUsersId});
    }
    //-----------------------------------------------------------------------------------------------------------------
    //Операции с пользователями конец блока
    //-----------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------
    //Операции с пользователями группы начало блока
    //-----------------------------------------------------------------------------------------------------------------
    /**
     * Обработка окончания загрузки списка пользователей группы
     * @param data - информация о загруженных данных
     */
    dgUserGroups_onLoadSuccess(data){
        if(data.total>0)
        {
            if(this.UserGroupsId!=-1)
            {
                this.dgUserGroups.datagrid("selectRecord", this.UserGroupsId);
            }
            else
            {
                if(this.UserGroupsIndex>=0&& this.UserGroupsIndex < data.total)
                {
                    this.dgUserGroups.datagrid("selectRow", this.UserGroupsIndex);
                }
                else if (data.total>0)
                {
                    this.dgUserGroups.datagrid("selectRow", data.total-1);
                }
            }
            this.UserGroupsId = -1;
            this.UserGroupsIndex = 0;
        }
    }
    /**
     * Обработка обновления списка пользователей
     */
    btnUpdateUserGroups_onClick() {
        let GroupId = -1;
        if(this.dgGroups.datagrid("getRows").length != 0) {
            let selData = this.dgGroups.datagrid("getSelected");
            if (selData != null) {
                GroupId = selData.id;
            }
        }
        if(GroupId!=-1) {
            let row = this.dgUserGroups.datagrid("getSelected");
            if(row!=null)
            {
                this.UserGroupsIndex = this.dgUserGroups.datagrid("getRowIndex", row);
                if(this.UserGroupsIndex<0){this.UserGroupsIndex = 0;}
            }
            this.dgUserGroups.datagrid({url: this.GetUrl("/AdminGroups/UserList?GroupId=" + GroupId + "&kterId=" + this.FilterKterUserGroupsId)});
        }
        else {
            this.dgUserGroups.datagrid("setData", {});
        }
    }
    /**
     * Обработка добавления добавление пользователя в группу
     */
    btnAddUserGroups_onClick(){
        if(this.dgGroups.datagrid("getRows").length == 0)
        {
            this.ShowWarning("Выберите пожалуйста группу");
            return false;
        }
        let selDataGroups = this.dgGroups.datagrid("getSelected");
        if(selDataGroups==null)
        {
            this.ShowWarning("Выберите пожалуйста группу");
            return false;
        }
        if(this.dgUsers.datagrid("getRows").length == 0)
        {
            this.ShowWarning("Выберите пожалуйста пользователя");
            return false;
        }
        let selDataUsers = this.dgUsers.datagrid("getSelected");
        if(selDataUsers==null)
        {
            this.ShowWarning("Выберите пожалуйста пользователя");
            return false;
        }
        let GroupId = selDataGroups.id;
        let UserId = selDataUsers.id;
        let form = new UserGroupsEditForm();
        form.SetOkFunction((RecId)=>{  this.UserGroupsId = RecId; this.btnUpdateUserGroups_onClick();});
        form.Show({AddMode:true, editMode:false, id:-1, GroupId: GroupId, UserId: UserId});
    }
    /**
     * Обработка изменения привязки пользователя к группе
     */
    btnChangeUserGroups_onClick(){
        if(this.dgUserGroups.datagrid("getRows").length == 0)
        {
            this.ShowWarning("Нет записей для редактирования");
            return false;
        }
        let selData = this.dgUserGroups.datagrid("getSelected");
        if(selData==null)
        {
            this.ShowWarning("Выберите запись для редактирования");
            return false;
        }
        let editMode = Keys.isKeyDown(Keys.VK_Z) || Keys.isKeyDown(Keys.VK_OEM_PERIOD);
        if(editMode){
            this.sLoc.LockRecord("UserGroups", selData.id, this.btnContinueChangeUserGroups_onClik.bind(this));
        }
        else{
            this.btnContinueChangeUserGroups_onClik({AddMode:false,id: selData.id, editMode: editMode, lockMessage:'', lockState: false});
        }
    }

    /**
     * Продолжение открытия группы для изменения
     * @param options - настройки открытия группы
     */
    btnContinueChangeUserGroups_onClik(options){
        if(options.lockMessage.length!=0){
            this.ShowWarning(options.lockMessage);
            return;
        }
        else{
            if(options.editMode){
                options.lockState = true
            }
        }
        let form = new UserGroupsEditForm();
        form.SetOkFunction((RecId)=>{  this.UserGroupsId = RecId; this.btnUpdateUserGroups_onClick();});
        form.SetCloseWindowFunction((options)=>{
            if(options!=null){
                if(options.lockState){
                    this.sLoc.FreeLockRecord("UserGroups", options.id);
                }
            }
        })
        form.Show(options);
    }
    /**
     * Удаление пользователя
     */
    btnDeleteUserGroups_onClick(){
        if(this.dgUserGroups.datagrid("getRows").length == 0)
        {
            this.ShowWarning("Нет записей для удаления");
            return false;
        }
        let selData = this.dgUserGroups.datagrid("getSelected");
        if(selData==null)
        {
            this.ShowWarning("Выберите запись для удаления");
            return false;
        }
        $.messager.confirm("Удаление", "Вы действительно хотите удалить выделенного пользователя из группы?", ((r)=>{
            if(r) {
                this.sLoc.StateLockRecord("UserGroups", selData.id, ((options) => {
                    if (options.data.length) {
                        this.ShowWarning(options.data);
                    } else {
                        this.btnContinueDeleteUserGroups_onClick(options)
                    }
                }).bind(this));
            }
        }).bind(this));
    }

    /**
     * Продолжение удаления пользователя
     * @param options - настройки удаления пользователя
     */
    btnContinueDeleteUserGroups_onClick(options){
        $.ajax({
            method: "POST",
            url: this.GetUrl('/AdminGroups/DeleteUserFromGroup'),
            data: {id: options.id},
            success:function(data){
                if(data.length) {
                    this.ShowWarning(data);
                }
                else{
                    this.btnUpdateUserGroups_onClick();
                }
            }.bind(this),
            error:function(data){ this.ShowErrorResponse(data.responseJSON); }.bind(this)
        });
    }

    /**
     * Получить и установить значение фильтра пользователей группы по территории
     * @constructor
     */
    GetValueFilterKterUserGroups(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/AdminKter/GetKterSel?KterId='+this.FilterKterUserGroupsId),
            success: function(data){
                this.txFilterUserGroups.textbox("setText", data);
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }
    /**
     * Выбор территории для фильтра по территориия для пользователей группы
     */
    btnChooseKterForUserGroupsFilter_onClick(){
        StartModalModulGlobal("Kter", {}, ((data)=>{
            this.FilterKterUserGroupsId = data.id;
            this.GetValueFilterKterUserGroups();
            this.btnUpdateUserGroups_onClick();
        }).bind(this));
    }

    /**
     * Очистить фильтр по трритории для пользователей группы
     */
    btnClearFilterUserGroupsKter_onClick(){
        this.FilterKterUserGroupsId = -1;
        this.txFilterUserGroups.textbox("setText", "");
        this.btnUpdateUserGroups_onClick();
    }
    //-----------------------------------------------------------------------------------------------------------------
    //Операции с пользователями группы конец блока
    //-----------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------
    //Операции с приложениями начало блока
    //-----------------------------------------------------------------------------------------------------------------
    /**
     * Обработка окончания загрузки списка приложений
     * @param data - информация о загруженных данных
     */
    dgApps_onLoadSuccess(row, data){
        if(data.length>0) {
            if(this.AppsId!=-1) {
                this.dgApps.treegrid("select", this.AppsId);
            }
            else
            {
                this.dgApps.treegrid("select", data[0].id);
            }
            this.AppsId = -1;
        }
    }
    /**
     * Обработка выбора приложения
     */
    dgApps_onSelect() {
        let FixGroupsByApp = this.cbFixGroupsByApp.checkbox("options").checked;
        if(FixGroupsByApp)
        {
            this.btnUpdateGroups_onClick();
        }
    }
    /**
     * Обработка добавления добавление пользователя в группу
     */
    btnAddApp_onClick(){
        let AppId = -1;
        let selData = this.dgApps.treegrid("getSelected");
        if(selData!=null)
        {
            AppId = selData.id;
        }
        let form = new AppEditForm();
        form.SetOkFunction((RecId)=>{  this.AppsId = RecId; this.btnUpdateApps_onClick();});
        form.Show({AddMode:true, editMode:false, id:-1, AppId: AppId});
    }

    /**
     * Обработка редактирования приложения
     */
    btnChangeApp_onClik(){
        let selData = this.dgApps.treegrid("getSelected");
        if(selData==null)
        {
            this.ShowWarning("Выберите запись для редактирования");
            return false;
        }
        let editMode = Keys.isKeyDown(Keys.VK_Z) || Keys.isKeyDown(Keys.VK_OEM_PERIOD);
        if(editMode){
            this.sLoc.LockRecord("Apps", selData.id, this.btnContinueChangeApp_onClik.bind(this));
        }
        else{
            this.btnContinueChangeApp_onClik({AddMode:false,id: selData.id, editMode: editMode, lockMessage:'', lockState: false});
        }
    }
    /**
     * Продолжение обработки редактирования приложения
     */
    btnContinueChangeApp_onClik(options){
        if(options.lockMessage.length!=0){
            this.ShowWarning(options.lockMessage);
            return;
        }
        else{
            if(options.editMode){
                options.lockState = true
            }
        }
        let form = new AppEditForm();
        form.SetOkFunction((RecId)=>{  this.AppsId = RecId; this.btnUpdateApps_onClick();});
        form.SetCloseWindowFunction((options)=>{
            if(options!=null){
                if(options.lockState){
                    this.sLoc.FreeLockRecord("Apps", options.id);
                }
            }
        })
        form.Show(options);
    }

    /**
     * Обработка обновления списка приложений
     */
    btnUpdateApps_onClick(){
        if(this.AppsId == -1){
            let selData = this.dgApps.datagrid("getSelected");
            if(selData!=null) {
                this.AppsId = selData.id;
            }
        }
        this.dgApps.treegrid({url:this.GetUrl("/AdminApps/List")});
    }
    /**
     * Удаление приложения
     */
    btnDeleteApp_onClick(){
        let selData = this.dgApps.treegrid("getSelected");
        if(selData==null)
        {
            this.ShowWarning("Выберите запись для удаления");
            return false;
        }
        $.messager.confirm("Удаление", "Вы действительно хотите удалить выделенное приложение?", ((r)=>{
            if(r) {
                this.sLoc.StateLockRecord("Apps", selData.id, ((options) => {
                    if (options.data.length) {
                        this.ShowWarning(options.data);
                    } else {
                        this.btnContinueDeleteApp_onClick(options)
                    }
                }).bind(this));
            }
        }).bind(this));
    }

    /**
     * Продолжение удаления приложения
     * @param options - настройки удаления приложения
     */
    btnContinueDeleteApp_onClick(options){
        $.ajax({
            method: "POST",
            url: this.GetUrl('/AdminApps/Delete'),
            data: {id: options.id},
            success:function(data){
                if(data.length) {
                    this.ShowWarning(data);
                }
                else{
                    this.btnUpdateApps_onClick();
                }
            }.bind(this),
            error:function(data){ this.ShowErrorResponse(data.responseJSON); }.bind(this)
        });
    }
    //-----------------------------------------------------------------------------------------------------------------
    //Операции с приложениями конец блока
    //-----------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------
    //Операции с приложениями группы начало блока
    //-----------------------------------------------------------------------------------------------------------------
    /**
     * Обработка окончания загрузки списка приложений группы
     * @param data - информация о загруженных данных
     */
    dgAppRights_onLoadSuccess(data){
        if(data.total>0)
        {
            if(this.AppRightsId!=-1)
            {
                this.dgAppRights.datagrid("selectRecord", this.AppRightsId);
            }
            else
            {
                if(this.AppRightsIndex>=0&& this.AppRightsIndex < data.total)
                {
                    this.dgAppRights.datagrid("selectRow", this.AppRightsIndex);
                }
                else if (data.total>0)
                {
                    this.dgAppRights.datagrid("selectRow", data.total-1);
                }
            }
            this.AppRightsId = -1;
            this.AppRightsIndex = 0;
        }
    }
    /**
     * Обработка обновления списка приложений группы
     */
    btnUpdateAppRights_onClick() {
        let GroupId = -1;
        if(this.dgGroups.datagrid("getRows").length != 0) {
            let selData = this.dgGroups.datagrid("getSelected");
            if (selData != null) {
                GroupId = selData.id;
            }
        }
        if(GroupId!=-1) {
            let row = this.dgAppRights.datagrid("getSelected");
            if(row!=null)
            {
                this.AppRightsIndex = this.dgAppRights.datagrid("getRowIndex", row);
                if(this.AppRightsIndex<0){this.AppRightsIndex = 0;}
            }
            this.dgAppRights.datagrid({url: this.GetUrl("/AdminGroups/GetAppRightsList?GroupId="+GroupId)});
        }
        else {
            this.dgAppRights.datagrid("setData", {});
        }
    }
    /**
     * Обработка добавления добавление приложения в группу
     */
    btnAddAppRights_onClick(){
        if(this.dgGroups.datagrid("getRows").length == 0)
        {
            this.ShowWarning("Выберите пожалуйста группу");
            return false;
        }
        let selDataGroups = this.dgGroups.datagrid("getSelected");
        if(selDataGroups==null)
        {
            this.ShowWarning("Выберите пожалуйста группу");
            return false;
        }
        let selDataApps = this.dgApps.treegrid("getSelected");
        if(selDataApps==null)
        {
            this.ShowWarning("Выберите пожалуйста приложение");
            return false;
        }
        let GroupId = selDataGroups.id;
        let AppId = selDataApps.id;
        let form = new AppRightsEditForm();
        form.SetOkFunction((RecId)=>{  this.AppRightsId = RecId; this.btnUpdateAppRights_onClick();});
        form.Show({AddMode:true, editMode:false, id:-1, GroupId: GroupId, AppId: AppId});
    }
    /**
     * Обработка изменения привязки приложения к группе
     */
    btnChangeAppRights_onClick(){
        if(this.dgAppRights.datagrid("getRows").length == 0)
        {
            this.ShowWarning("Нет записей для редактирования");
            return false;
        }
        let selData = this.dgAppRights.datagrid("getSelected");
        if(selData==null)
        {
            this.ShowWarning("Выберите запись для редактирования");
            return false;
        }
        let editMode = Keys.isKeyDown(Keys.VK_Z) || Keys.isKeyDown(Keys.VK_OEM_PERIOD);
        if(editMode){
            this.sLoc.LockRecord("AppRights", selData.id, this.btnContinueChangeAppRights_onClik(options).bind(this));
        }
        else{
            this.btnContinueChangeAppRights_onClik({AddMode:false,id: selData.id, editMode: editMode, lockMessage:'', lockState: false});
        }
    }

    /**
     * Продолжение открытия группы для изменения
     * @param options - настройки открытия группы
     */
    btnContinueChangeAppRights_onClik(options){
        if(options.lockMessage.length!=0){
            this.ShowWarning(options.lockMessage);
            return;
        }
        else{
            if(options.editMode){
                options.lockState = true
            }
        }
        let form = new AppRightsEditForm();
        form.SetOkFunction((RecId)=>{  this.AppRightsId = RecId; this.btnUpdateAppRights_onClick();});
        form.SetCloseWindowFunction((options)=>{
            if(options!=null){
                if(options.lockState){
                    this.sLoc.FreeLockRecord("AppRights", options.id);
                }
            }
        })
        form.Show(options);
    }
    /**
     * Удаление приложения из группы
     */
    btnDeleteAppRights_onClick(){
        if(this.dgAppRights.datagrid("getRows").length == 0)
        {
            this.ShowWarning("Нет записей для удаления");
            return false;
        }
        let selData = this.dgAppRights.datagrid("getSelected");
        if(selData==null)
        {
            this.ShowWarning("Выберите запись для удаления");
            return false;
        }
        $.messager.confirm("Удаление", "Вы действительно хотите удалить выделенное приложение из группы?", ((r)=>{
            if(r) {
                this.sLoc.StateLockRecord("AppRights", selData.id, ((options) => {
                    if (options.data.length) {
                        this.ShowWarning(options.data);
                    } else {
                        this.btnContinueDeleteAppRights_onClick(options)
                    }
                }).bind(this));
            }
        }).bind(this));
    }

    /**
     * Продолжение удаления пользователя
     * @param options - настройки удаления пользователя
     */
    btnContinueDeleteAppRights_onClick(options){
        $.ajax({
            method: "POST",
            url: this.GetUrl('/AdminGroups/DeleteAppFromGroup'),
            data: {id: options.id},
            success:function(data){
                if(data.length) {
                    this.ShowWarning(data);
                }
                else{
                    this.btnUpdateAppRights_onClick();
                }
            }.bind(this),
            error:function(data){ this.ShowErrorResponse(data.responseJSON); }.bind(this)
        });
    }
    //-----------------------------------------------------------------------------------------------------------------
    //Операции с приложениями группы конец блока
    //-----------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------
    //Операции с действиями начало блока
    //-----------------------------------------------------------------------------------------------------------------
    dgActs_onLoadSuccess(data){
        if(data.total>0)
        {
            if(this.ActId!=-1)
            {
                this.dgActs.datagrid("selectRecord", this.ActId);
            }
            else
            {
                if(this.ActIndex>=0&& this.ActIndex < data.total)
                {
                    this.dgActs.datagrid("selectRow", this.ActIndex);
                }
                else if (data.total>0)
                {
                    this.dgActs.datagrid("selectRow", data.total-1);
                }
            }
            this.ActId = -1;
            this.ActIndex = 0;
        }
    }

    /**
     * Обработка выбора действия
     */
    dActs_onSelect(){
        let FixGroupsByAct = this.cbFixGroupsByAct.checkbox("options").checked;
        if(FixGroupsByAct)
        {
            this.btnUpdateGroups_onClick();
        }
    }
    /**
     * Обработка обновления списка пользователей
     */
    btnUpdateActs_onClick() {
        let row = this.dgActs.datagrid("getSelected");
        if(row!=null)
        {
            this.ActIndex = this.dgActs.datagrid("getRowIndex", row);
        }
        let code = encodeURIComponent(this.FilterActsCode);
        let name = encodeURIComponent(this.FilterActsName);
        let appId = this.FilterActsAppId
        this.dgActs.datagrid({url:this.GetUrl("/AdminActs/List?code=" + code
            + "&appId=" + appId
            + "&name=" + name)});
    }

    /**
     * Добавить действие
     */
    btnAddAct_onClick(){
        let form = new ActEditForm();
        form.SetOkFunction((RecId)=>{  this.ActId = RecId; this.btnUpdateActs_onClick();});
        form.Show(null);
    }
    /**
     * Обработка изменения действия
     */
    btnChangeAct_onClick(){
        if(this.dgActs.datagrid("getRows").length == 0)
        {
            this.ShowWarning("Нет записей для редактирования");
            return false;
        }
        let selData = this.dgActs.datagrid("getSelected");
        if(selData==null)
        {
            this.ShowWarning("Выберите запись для редактирования");
            return false;
        }
        let editMode = Keys.isKeyDown(Keys.VK_Z) || Keys.isKeyDown(Keys.VK_OEM_PERIOD);
        if(editMode){
            this.sLoc.LockRecord("Acts", selData.id, this.btnContinueChangeAct_onClik.bind(this));
        }
        else{
            this.btnContinueChangeAct_onClik({id: selData.id, editMode: editMode, lockMessage:'', lockState: false});
        }
    }

    /**
     * Продолжение открытия действия для изменения
     * @param options - настройки открытия действия
     */
    btnContinueChangeAct_onClik(options){
        if(options.lockMessage.length!=0){
            this.ShowWarning(options.lockMessage);
            return;
        }
        else{
            if(options.editMode){
                options.lockState = true
            }
        }
        let form = new ActEditForm();
        form.SetOkFunction((RecId)=>{  this.ActId = RecId; this.btnUpdateActs_onClick();});
        form.SetCloseWindowFunction((options)=>{
            if(options!=null){
                if(options.lockState){
                    this.sLoc.FreeLockRecord("Acts", options.id);
                }
            }
        })
        form.Show(options);
    }
    /**
     * Удаление действия
     */
    btnDeleteAct_onClick(){
        if(this.dgActs.datagrid("getRows").length == 0)
        {
            this.ShowWarning("Нет записей для удаления");
            return false;
        }
        let selData = this.dgActs.datagrid("getSelected");
        if(selData==null)
        {
            this.ShowWarning("Выберите запись для удаления");
            return false;
        }
        $.messager.confirm("Удаление", "Вы действительно хотите удалить выделенноое действие?", ((r)=>{
            if(r) {
                this.sLoc.StateLockRecord("Acts", selData.id, ((options) => {
                    if (options.data.length) {
                        this.ShowWarning(data);
                    } else {
                        this.btnContinueDeleteAct_onClick(options)
                    }
                }).bind(this));
            }
        }).bind(this));
    }

    /**
     * Продолжение удаления действия
     * @param options - настройки удаления действия
     */
    btnContinueDeleteAct_onClick(options){
        $.ajax({
            method: "POST",
            url: this.GetUrl('/AdminActs/Delete'),
            data: {id: options.id},
            success:function(data){
                if(data.length) {
                    this.ShowWarning(data);
                }
                else{
                    this.btnUpdateActs_onClick();
                }
            }.bind(this),
            error:function(data){ this.ShowErrorResponse(data.responseJSON); }.bind(this)
        });
    }

    /**
     * Показать настройки фильтра по действиям
     */
    btnShowFilterActs_onClick(){
        let form = new ActFilterForm();
        form.SetResultFunc(function(data){
            this.FilterActsCode = data.Code;
            this.FilterActsAppId = data.AppId;
            this.FilterActsName = data.Name;
            this.btnUpdateActs_onClick();
        }.bind(this));
        form.Show({AddMode: true, Code: this.FilterActsCode, Name: this.FilterActsName, AppId: this.FilterActsAppId});
    }
    //-----------------------------------------------------------------------------------------------------------------
    //Операции с действиями конец блока
    //-----------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------
    //Операции с действиями группы начало блока
    //-----------------------------------------------------------------------------------------------------------------
    /**
     * Обработка окончания загрузки списка действий группы
     * @param data - информация о загруженных данных
     */
    dgActGroups_onLoadSuccess(data){
        if(data.total>0)
        {
            if(this.ActGroupsId!=-1)
            {
                this.dgActGroups.datagrid("selectRecord", this.ActGroupsId);
            }
            else
            {
                if(this.ActGroupsIndex>=0&& this.ActGroupsIndex < data.total)
                {
                    this.dgActGroups.datagrid("selectRow", this.ActGroupsIndex);
                }
                else if (data.total>0)
                {
                    this.dgActGroups.datagrid("selectRow", data.total-1);
                }
            }
            this.ActGroupsId = -1;
            this.ActGroupsIndex = 0;
        }
    }

    /**
     * Обновить список действий группы
     */
    btnUpdateActGroups_onClick(){
        let GroupId = -1;
        if(this.dgGroups.datagrid("getRows").length != 0) {
            let selData = this.dgGroups.datagrid("getSelected");
            if (selData != null) {
                GroupId = selData.id;
            }
        }
        if(GroupId!=-1) {
            let row = this.dgActGroups.datagrid("getSelected");
            if(row!=null)
            {
                this.ActGroupsIndex = this.dgActGroups.datagrid("getRowIndex", row);
                if(this.ActGroupsIndex<0){this.ActGroupsIndex = 0;}
            }
            this.dgActGroups.datagrid({url: this.GetUrl("/AdminGroups/GetActGroupsList?GroupId="+GroupId)});
        }
        else {
            this.dgActGroups.datagrid("setData", {});
        }
    }
    /**
     * Обработка добавления действия в группу
     */
    btnAddActGroups_onClick(){
        if(this.dgGroups.datagrid("getRows").length == 0)
        {
            this.ShowWarning("Выберите пожалуйста группу");
            return false;
        }
        let selDataGroups = this.dgGroups.datagrid("getSelected");
        if(selDataGroups==null)
        {
            this.ShowWarning("Выберите пожалуйста группу");
            return false;
        }
        if(this.dgActs.datagrid("getRows").length == 0)
        {
            this.ShowWarning("Выберите пожалуйста действие");
            return false;
        }
        let selDataActs = this.dgActs.datagrid("getSelected");
        if(selDataActs==null)
        {
            this.ShowWarning("Выберите пожалуйста группу");
            return false;
        }
        let GroupId = selDataGroups.id;
        let ActId = selDataActs.id;
        let AppId = selDataActs.appId;
        let form = new ActGroupsEditForm();
        form.SetOkFunction((RecId)=>{  this.ActGroupsId = RecId; this.btnUpdateActGroups_onClick();});
        form.Show({AddMode:true, editMode:false, id:-1, GroupId: GroupId, AppId: AppId, ActId: ActId});
    }
    /**
     * Обработка изменения привязки действия к группе
     */
    btnChangeActGroups_onClick(){
        if(this.dgActGroups.datagrid("getRows").length == 0)
        {
            this.ShowWarning("Нет записей для редактирования");
            return false;
        }
        let selData = this.dgActGroups.datagrid("getSelected");
        if(selData==null)
        {
            this.ShowWarning("Выберите запись для редактирования");
            return false;
        }
        let editMode = Keys.isKeyDown(Keys.VK_Z) || Keys.isKeyDown(Keys.VK_OEM_PERIOD);
        if(editMode){
            this.sLoc.LockRecord("ActGroups", selData.id, this.btnContinueChangeActGroups_onClick.bind(this));
        }
        else{
            this.btnContinueChangeActGroups_onClick({AddMode:false,id: selData.id, editMode: editMode, lockMessage:'', lockState: false});
        }
    }

    /**
     * Продолжение открытия привязки действия для изменения
     * @param options - настройки открытия привязки действия к группе
     */
    btnContinueChangeActGroups_onClick(options){
        if(options.lockMessage.length!=0){
            this.ShowWarning(options.lockMessage);
            return;
        }
        else{
            if(options.editMode){
                options.lockState = true
            }
        }
        let form = new ActGroupsEditForm();
        form.SetOkFunction((RecId)=>{  this.ActGroupsId = RecId; this.btnUpdateActGroups_onClick();});
        form.SetCloseWindowFunction((options)=>{
            if(options!=null){
                if(options.lockState){
                    this.sLoc.FreeLockRecord("ActGroups", options.id);
                }
            }
        })
        form.Show(options);
    }
    /**
     * Удаление действия из группы
     */
    btnDeleteActGroups_onClick(){
        if(this.dgActGroups.datagrid("getRows").length == 0)
        {
            this.ShowWarning("Нет записей для удаления");
            return false;
        }
        let selData = this.dgActGroups.datagrid("getSelected");
        if(selData==null)
        {
            this.ShowWarning("Выберите запись для удаления");
            return false;
        }
        $.messager.confirm("Удаление", "Вы действительно хотите удалить выделенное действие из группы?", ((r)=>{
            if(r) {
                this.sLoc.StateLockRecord("ActGroups", selData.id, ((options) => {
                    if (options.data.length) {
                        this.ShowWarning(options.data);
                    } else {
                        this.btnContinueDeleteActGroups_onClick(options)
                    }
                }).bind(this));
            }
        }).bind(this));
    }

    /**
     * Продолжение удаления действия из группы
     * @param options - настройки удаления действия из группы
     */
    btnContinueDeleteActGroups_onClick(options){
        $.ajax({
            method: "POST",
            url: this.GetUrl('/AdminGroups/DeleteActFromGroup'),
            data: {id: options.id},
            success:function(data){
                if(data.length) {
                    this.ShowWarning(data);
                }
                else{
                    this.btnUpdateActGroups_onClick();
                }
            }.bind(this),
            error:function(data){ this.ShowErrorResponse(data.responseJSON); }.bind(this)
        });
    }
    //-----------------------------------------------------------------------------------------------------------------
    //Операции с действиями группы конец блока
    //-----------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------
    //Операции с территориями начало блока
    //-----------------------------------------------------------------------------------------------------------------
    /**
     * Обработка окончания загрузки списка территорий
     * @param data - информация о загруженных данных
     */
    dgKters_onLoadSuccess(data){
        if(data.total>0)
        {
            if(this.KterIndex>=0&& this.KterIndex < data.total) {
                this.dgKters.datagrid("selectRow", this.KterIndex);
            }
            else if (data.total>0) {
                this.dgKters.datagrid("selectRow", data.total-1);
            }
            this.KterIndex = 0;
        }
    }
    /**
     * Обработка выбора территории
     */
    dgKters_onSelect() {
        let FixGroupsByKter = this.cbFixGroupsByKter.checkbox("options").checked;
        if(FixGroupsByKter)
        {
            this.btnUpdateGroups_onClick();
        }
    }
    /**
     * Обработка обновления списка территорий
     */
    btnUpdateKters_onClick() {
        let row = this.dgKters.datagrid("getSelected");
        if(row!=null) {
            this.KterIndex = this.dgKters.datagrid("getRowIndex", row);
        }
        this.dgKters.datagrid({url:this.GetUrl("/AdminKter/List")});
    }
    //-----------------------------------------------------------------------------------------------------------------
    //Операции с территориями конец блока
    //-----------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------
    //Операции с территориями группы начало блока
    //-----------------------------------------------------------------------------------------------------------------
    /**
     * Обработка окончания загрузки списка территорий группы
     * @param data - информация о загруженных данных
     */
    dgKterGroups_onLoadSuccess(data){
        if(data.total>0)
        {
            if(this.KterGroupsId!=-1)
            {
                this.dgKterGroups.datagrid("selectRecord", this.KterGroupsId);
            }
            else
            {
                if(this.KterGroupsIndex>=0&& this.KterGroupsIndex < data.total)
                {
                    this.dgKterGroups.datagrid("selectRow", this.KterGroupsIndex);
                }
                else if (data.total>0)
                {
                    this.dgKterGroups.datagrid("selectRow", data.total-1);
                }
            }
            this.KterGroupsId = -1;
            this.KterGroupsIndex = 0;
        }
    }
    /**
     * Обновить список территорий группы
     */
    btnUpdateKterGroups_onClick(){
        let GroupId = -1;
        if(this.dgGroups.datagrid("getRows").length != 0) {
            let selData = this.dgGroups.datagrid("getSelected");
            if (selData != null) {
                GroupId = selData.id;
            }
        }
        if(GroupId!=-1) {
            let row = this.dgKterGroups.datagrid("getSelected");
            if(row!=null)
            {
                this.KterGroupsIndex = this.dgKterGroups.datagrid("getRowIndex", row);
                if(this.KterGroupsIndex<0){this.KterGroupsIndex = 0;}
            }
            this.dgKterGroups.datagrid({url: this.GetUrl("/AdminGroups/GetKterGroupsList?GroupId="+GroupId)});
        }
        else {
            this.dgKterGroups.datagrid("setData", {});
        }
    }
    /**
     * Обработка добавления добавление территории в группу
     */
    btnAddKterGroups_onClick(){
        if(this.dgGroups.datagrid("getRows").length == 0) {
            this.ShowWarning("Выберите пожалуйста группу");
            return false;
        }
        let selDataGroups = this.dgGroups.datagrid("getSelected");
        if(selDataGroups==null) {
            this.ShowWarning("Выберите пожалуйста группу");
            return false;
        }
        if(this.dgKters.datagrid("getRows").length == 0) {
            this.ShowWarning("Выберите пожалуйста территорию");
            return false;
        }
        let selDataKters = this.dgKters.datagrid("getSelected");
        if(selDataKters==null)
        {
            this.ShowWarning("Выберите пожалуйста пользователя");
            return false;
        }
        let GroupId = selDataGroups.id;
        let KterId = selDataKters.id;
        let form = new KterGroupsEditForm();
        form.SetOkFunction((RecId)=>{  this.KterGroupsId = RecId; this.btnUpdateKterGroups_onClick();});
        form.Show({AddMode:true, editMode:false, id:-1, GroupId: GroupId, KterId: KterId});
    }
    /**
     * Обработка изменения привязки территории к группе
     */
    btnChangeKterGroups_onClick(){
        if(this.dgKterGroups.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для редактирования");
            return false;
        }
        let selData = this.dgKterGroups.datagrid("getSelected");
        if(selData==null)
        {
            this.ShowWarning("Выберите запись для редактирования");
            return false;
        }
        let editMode = Keys.isKeyDown(Keys.VK_Z) || Keys.isKeyDown(Keys.VK_OEM_PERIOD);
        if(editMode){
            this.sLoc.LockRecord("KterGroups", selData.id, this.btnContinueChangeKterGroups_onClik.bind(this));
        }
        else{
            this.btnContinueChangeKterGroups_onClik({AddMode:false,id: selData.id, editMode: editMode, lockMessage:'', lockState: false});
        }
    }

    /**
     * Продолжение открытия привзки территории к группе для изменения
     * @param options - настройки открытия привязки территории к группе
     */
    btnContinueChangeKterGroups_onClik(options){
        if(options.lockMessage.length!=0){
            this.ShowWarning(options.lockMessage);
            return;
        }
        else{
            if(options.editMode){
                options.lockState = true
            }
        }
        let form = new KterGroupsEditForm();
        form.SetOkFunction((RecId)=>{  this.UserGroupsId = RecId; this.btnUpdateKterGroups_onClick();});
        form.SetCloseWindowFunction((options)=>{
            if(options!=null){
                if(options.lockState){
                    this.sLoc.FreeLockRecord("KterGroups", options.id);
                }
            }
        })
        form.Show(options);
    }
    /**
     * Удаление привязки территории к группе
     */
    btnDeleteKterGroups_onClick(){
        if(this.dgKterGroups.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для удаления");
            return false;
        }
        let selData = this.dgKterGroups.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для удаления");
            return false;
        }
        $.messager.confirm("Удаление", "Вы действительно хотите удалить выделенную территорию из группы?", ((r)=>{
            if(r) {
                this.sLoc.StateLockRecord("KterGroups", selData.id, ((options) => {
                    if (options.data.length) {
                        this.ShowWarning(options.data);
                    } else {
                        this.btnContinueDeleteKterGroups_onClick(options)
                    }
                }).bind(this));
            }
        }).bind(this));
    }

    /**
     * Продолжение удаления территории из группы
     * @param options - настройки удаления территории из группы
     */
    btnContinueDeleteKterGroups_onClick(options){
        $.ajax({
            method: "POST",
            url: this.GetUrl('/AdminGroups/DeleteKterFromGroup'),
            data: {id: options.id},
            success:function(data){
                if(data.length) {
                    this.ShowWarning(data);
                }
                else{
                    this.btnUpdateKterGroups_onClick();
                }
            }.bind(this),
            error:function(data){ this.ShowErrorResponse(data.responseJSON); }.bind(this)
        });
    }
    //-----------------------------------------------------------------------------------------------------------------
    //Операции с территориями группы конец блока
    //-----------------------------------------------------------------------------------------------------------------
}

export function StartNestedModul(Id) {
    let admin = new Admin();
    admin.Start(Id);
}