import {GroupFormSel} from "./Directories/GroupFormSel.js";
import {UserFormSel} from "./Directories/UserFormSel.js";

export class UserGroupsEditForm{
    constructor() {
        this.GroupId = -1;
        this.UserId = -1;
    }
    /**
     * Получить url-адрес с учетом контекста
     * @param url - url-адрес без учета контекста
     */
    GetUrl(url) {
        return contextPath + url;
    }
    Show(options){
        this.options = options;
        if(this.options.AddMode){
            this.GroupId = this.options.GroupId;
            this.UserId = this.options.UserId;
        }
        LoadForm("#ModalWindows", this.GetUrl("/AdminGroups/UserGroupsEditForm"), this.InitFunc.bind(this));
    }
    /**
     * Задать функцию, которая вызовется при на жатию на кнопку ОК
     * @param OkFunc - функция родительского модуля
     */
    SetOkFunction(OkFunc) {
        this.OkFunc = OkFunc;
    }

    /**
     * Задать функцию, которая вызовется при на жатию на кнопку Отмена
     * @param CancelFunc - функция родительского модуля
     */
    SetCloseWindowFunction(CloseWindowFunc){
        this.CloseWindowFunc = CloseWindowFunc
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
        this.ShowErrorAlert(error);
    }
    /**
     * Показать ошибку в диалоговом окне
     * @param text - текст ошибки
     */
    ShowErrorAlert(text) {
        $.messager.alert('Ошибка',text,'error');
    }
    /**
     * Функция инициализации пользовательского интерфейса
     */
    InitFunc(){
        this.wUserGroupsEdit = $("#wUserGroupsEdit_Module_Admin");
        this.wUserGroupsEdit.window({onClose:()=>{
                if(this.CloseWindowFunc!=null){
                    this.CloseWindowFunc(this.options);
                }
                this.wUserGroupsEdit.window("destroy");
            }});
        this.wUserGroupsEdit.window('window').attr('tabindex',1).focus().bind('keyup', function(e){
            if (e.keyCode == Keys.VK_ESCAPE){
                this.wUserGroupsEdit.window('close');
            }
            if(e.keyCode == Keys.VK_RETURN){
                if(!this.options.AddMode) {
                    if (this.options.editMode) {
                        this.btnOk_onClick();
                    }
                }
                else{
                    this.btnOk_onClick();
                }
            }
        }.bind(this))
        this.pbEditMode = $("#pbEditMode_Module_Admin_UserGroupsEdit");
        this.lAction = $("#lAction_Module_Admin_UserGroupsEdit");
        this.txId = $("#txId_Module_Admin_UserGroupsEdit");
        this.txGroup = $("#txGroup_Module_Admin_UserGroupsEdit");
        this.txUser = $("#txUser_Module_Admin_UserGroupsEdit");
        this.txCreator = $("#txCreator_Module_Admin_UserGroupsEdit");
        this.txCreated = $("#txCreated_Module_Admin_UserGroupsEdit");
        this.txChanger = $("#txChanger_Module_Admin_UserGroupsEdit");
        this.txChanged = $("#txChanged_Module_Admin_UserGroupsEdit");
        this.btnOk = $("#btnOk_Module_Admin_UserGroupsEdit");
        this.btnCancel = $("#btnCancel_Module_Admin_UserGroupsEdit");
        this.btnOk.attr("href", "javascript:void(0)");
        this.btnCancel.attr("href", "javascript:void(0)");
        this.btnOk.linkbutton({
            onClick:this.btnOk_onClick.bind(this)
        });
        this.btnCancel.linkbutton({onClick:()=>{
                this.wUserGroupsEdit.window("close");
            }});
        this.txGroup.textbox({
            onClickButton:this.txGroup_onClickButton.bind(this)
        });
        this.txUser.textbox({
           onClickButton: this.txUser_onClickButton.bind(this)
        });
        if(this.options.AddMode){
            this.pbEditMode.attr("class", "icon-addmode");
            this.wUserGroupsEdit.window({title:"Добавление новой записи"});
            this.lAction.html("Введите данные для новой записи");
            this.LoadGroup();
            this.LoadUser();
        }
        else{
            this.pbEditMode.attr("class", "icon-editmode");
            this.wUserGroupsEdit.window({title:"Редатирование записи"});
            this.lAction.html("Введите данные для редактирования текущей записи");
            if(this.options.editMode){
                this.btnOk.linkbutton({disabled: false});
            }
            else{
                this.btnOk.linkbutton({disabled: true});
            }
            this.LoadUserGroups();
        }
    }

    /**
     * Загрузка привязки пользователя к группе
     */
    LoadUserGroups(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/AdminGroups/GetUserBinding?id='+this.options.id),
            success: function(data){
                this.GroupId = data.groupId;
                this.UserId = data.userId;
                this.txId.textbox("setText", data.id);
                this.txCreator.textbox("setText", data.creator);
                this.txCreated.textbox("setText", data.created);
                this.txChanger.textbox("setText", data.changer);
                this.txChanged.textbox("setText", data.changed);
                this.LoadGroup();
                this.LoadUser();
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Загрузка группы
     */
    LoadGroup(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/AdminGroups/GetGroupSel?id='+this.GroupId),
            success: function(data){
                this.txGroup.textbox("setText", data);
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Загрузка пользователя
     */
    LoadUser(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/AdminUsers/GetUserSel?id='+this.UserId),
            success: function(data){
                this.txUser.textbox("setText", data);
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }
    /**
     * Обработка сохранения записи
     */
    btnOk_onClick(){
        let Id = this.txId.textbox("getText");

        if(Id.length == 0){
            Id = "-1";
        }
        let json = {id: Id, groupId: this.GroupId, userId: this.UserId};
        this.ExistUserGroups(json);
        return false;
    }

    /**
     * Проверка существование пользователя в группе
     * @param json - модель привязки ползователя к группе
     */
    ExistUserGroups(json){
        $.ajax({
            method:"get",
            url: this.GetUrl('/AdminGroups/ExistsUserInGroup?id=' + json.id.toString()
                +"&groupId=" + json.groupId.toString() + "&userId=" + json.userId.toString()),
            success: function(data){
                if(data){
                    this.ShowErrorAlert("Данный пользователь уже существует в данной группе")
                }
                else {
                    this.Save(json);
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }
    /**
     * Продолжение сохранения пользователя в группе
     * @param object - модель привязки ползователя к группе
     */
    Save(object){
        $.ajax({
            method:"POST",
            data: JSON.stringify(object),
            url: this.GetUrl('/AdminGroups/SaveUserInGroup'),
            contentType: "application/json; charset=utf-8",
            success: function(data){
                if(this.OkFunc!=null)
                {
                    this.OkFunc(data);
                    this.wUserGroupsEdit.window("close");
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Открыть форму выбора группы
     */
    txGroup_onClickButton(){
        let form = new GroupFormSel()
        form.SetOkFunction(((RecId)=>{ this.GroupId = RecId; this.LoadGroup(); }).bind(this));
        form.Show();
    }
    /**
     * Открыть форму выбора группы
     */
    txUser_onClickButton(){
        let form = new UserFormSel()
        form.SetOkFunction(((RecId)=>{ this.UserId = RecId; this.LoadUser(); }).bind(this));
        form.Show();
    }
}