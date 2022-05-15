import {GroupFormSel} from "./Directories/GroupFormSel.js";
import {AppFormSel} from "./Directories/AppFormSel.js";

export class AppRightsEditForm{
    constructor() {
        this.GroupId = -1;
        this.AppId = -1;
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
            this.AppId = this.options.AppId;
        }
        LoadForm("#ModalWindows", this.GetUrl("/AdminGroups/AppRightsEditForm"), this.InitFunc.bind(this));
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
        this.wAppRightsEdit = $("#wAppRightsEdit_Module_Admin");
        this.wAppRightsEdit.window({onClose:()=>{
                if(this.CloseWindowFunc!=null){
                    this.CloseWindowFunc(this.options);
                }
                this.wAppRightsEdit.window("destroy");
            }});
        this.wAppRightsEdit.window('window').attr('tabindex',1).focus().bind('keyup', function(e){
            if (e.keyCode == Keys.VK_ESCAPE){
                this.wAppRightsEdit.window('close');
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
        this.pbEditMode = $("#pbEditMode_Module_Admin_AppRightsEdit");
        this.lAction = $("#lAction_Module_Admin_AppRightsEdit");
        this.txId = $("#txId_Module_Admin_AppRightsEdit");
        this.txGroup = $("#txGroup_Module_Admin_AppRightsEdit");
        this.txApp = $("#txApp_Module_Admin_AppRightsEdit");
        this.cbMode = $("#cbMode_Module_Admin_AppRightsEdit");
        this.txCreator = $("#txCreator_Module_Admin_AppRightsEdit");
        this.txCreated = $("#txCreated_Module_Admin_AppRightsEdit");
        this.txChanger = $("#txChanger_Module_Admin_AppRightsEdit");
        this.txChanged = $("#txChanged_Module_Admin_AppRightsEdit");
        this.btnOk = $("#btnOk_Module_Admin_AppRightsEdit");
        this.btnCancel = $("#btnCancel_Module_Admin_AppRightsEdit");
        this.btnOk.attr("href", "javascript:void(0)");
        this.btnCancel.attr("href", "javascript:void(0)");
        this.btnOk.linkbutton({
            onClick:this.btnOk_onClick.bind(this)
        });
        this.btnCancel.linkbutton({onClick:()=>{
                this.wAppRightsEdit.window("close");
            }});
        this.txGroup.textbox({
            onClickButton:this.txGroup_onClickButton.bind(this)
        });
        this.txApp.textbox({
            onClickButton: this.txApp_onClickButton.bind(this)
        });
        this.cbMode.combobox({
            data: [{value:"1", text:"Действующий"}, {value:"0", text:"Удалён"}]
        });
        if(this.options.AddMode){
            this.pbEditMode.attr("class", "icon-addmode");
            this.wAppRightsEdit.window({title:"Добавление новой записи"});
            this.lAction.html("Введите данные для новой записи");
            this.cbMode.combobox("setValue", "1");
            this.LoadGroup();
            this.LoadApp();
        }
        else{
            this.pbEditMode.attr("class", "icon-editmode");
            this.wAppRightsEdit.window({title:"Редатирование записи"});
            this.lAction.html("Введите данные для редактирования текущей записи");
            if(this.options.editMode){
                this.btnOk.linkbutton({disabled: false});
            }
            else{
                this.btnOk.linkbutton({disabled: true});
            }
            this.LoadAppRights();
        }
    }

    /**
     * Загрузка привязки приложения к группе
     */
    LoadAppRights(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/AdminGroups/GetAppRights?id='+this.options.id),
            success: function(data){
                this.GroupId = data.groupId;
                this.AppId = data.appId;
                this.txId.textbox("setText", data.id);
                this.cbMode.combobox("setValue", data.mode.toString());
                this.txCreator.textbox("setText", data.creator);
                this.txCreated.textbox("setText", data.created);
                this.txChanger.textbox("setText", data.changer);
                this.txChanged.textbox("setText", data.changed);
                this.LoadGroup();
                this.LoadApp();
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
    LoadApp(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/AdminApps/GetAppSel?id='+this.AppId),
            success: function(data){
                this.txApp.textbox("setText", data);
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
        let mode = this.cbMode.combobox("getValue");

        if(Id.length == 0){
            Id = "-1";
        }
        let json = {id: Id, groupId: this.GroupId, appId: this.AppId, mode:mode};
        this.ExistAppRights(json);
        return false;
    }

    /**
     * Проверка существование приложения в группе
     * @param json - модель привязки приложения к группе
     */
    ExistAppRights(json){
        $.ajax({
            method:"get",
            url: this.GetUrl('/AdminGroups/ExistsAppInGroup?id=' + json.id.toString()
                +"&groupId=" + json.groupId.toString() + "&appId=" + json.appId.toString()),
            success: function(data){
                if(data){
                    this.ShowErrorAlert("Данное приложение уже существует в данной группе")
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
     * Продолжение сохранения приложения в группе
     * @param object - модель привязки приложения к группе
     */
    Save(object){
        $.ajax({
            method:"POST",
            data: JSON.stringify(object),
            url: this.GetUrl('/AdminGroups/SaveAppRights'),
            contentType: "application/json; charset=utf-8",
            success: function(data){
                if(this.OkFunc!=null)
                {
                    this.OkFunc(data);
                    this.wAppRightsEdit.window("close");
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
    txApp_onClickButton(){
        let form = new AppFormSel()
        form.SetOkFunction(((RecId)=>{ this.AppId = RecId; this.LoadApp(); }).bind(this));
        form.Show();
    }
}