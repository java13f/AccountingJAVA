import {GroupFormSel} from "./Directories/GroupFormSel.js";
import {AppFormSel} from "./Directories/AppFormSel.js";
import {ActFormSel} from "./Directories/ActFormSel.js";

export class ActGroupsEditForm{
    constructor() {
        this.GroupId = -1;
        this.AppId = -1;
        this.ActId = -1;
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
            this.ActId = this.options.ActId;
        }
        LoadForm("#ModalWindows", this.GetUrl("/AdminGroups/ActGroupsEditForm"), this.InitFunc.bind(this));
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
        this.wActGroupsEdit = $("#wActGroupsEdit_Module_Admin");
        this.wActGroupsEdit.window({onClose:()=>{
                if(this.CloseWindowFunc!=null){
                    this.CloseWindowFunc(this.options);
                }
                this.wActGroupsEdit.window("destroy");
            }});
        this.wActGroupsEdit.window('window').attr('tabindex',1).focus().bind('keyup', function(e){
            if (e.keyCode == Keys.VK_ESCAPE){
                this.wActGroupsEdit.window('close');
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
        this.pbEditMode = $("#pbEditMode_Module_Admin_ActGroupsEdit");
        this.lAction = $("#lAction_Module_Admin_ActGroupsEdit");
        this.txId = $("#txId_Module_Admin_ActGroupsEdit");
        this.txGroup = $("#txGroup_Module_Admin_ActGroupsEdit");
        this.txApp = $("#txApp_Module_Admin_ActGroupsEdit");
        this.txAct = $("#txAct_Module_Admin_ActGroupsEdit");
        this.cbMode = $("#cbMode_Module_Admin_ActGroupsEdit");
        this.txCreator = $("#txCreator_Module_Admin_ActGroupsEdit");
        this.txCreated = $("#txCreated_Module_Admin_ActGroupsEdit");
        this.txChanger = $("#txChanger_Module_Admin_ActGroupsEdit");
        this.txChanged = $("#txChanged_Module_Admin_ActGroupsEdit");
        this.btnOk = $("#btnOk_Module_Admin_ActGroupsEdit");
        this.btnCancel = $("#btnCancel_Module_Admin_ActGroupsEdit");
        this.btnOk.attr("href", "javascript:void(0)");
        this.btnCancel.attr("href", "javascript:void(0)");
        this.btnOk.linkbutton({
            onClick:this.btnOk_onClick.bind(this)
        });
        this.btnCancel.linkbutton({onClick:()=>{
                this.wActGroupsEdit.window("close");
            }});
        this.txGroup.textbox({
            onClickButton:this.txGroup_onClickButton.bind(this)
        });
        this.txApp.textbox({
            onClickButton: this.txApp_onClickButton.bind(this)
        });
        this.txAct.textbox({
            onClickButton: this.txAct_onClickButton.bind(this)
        });
        this.cbMode.combobox({
            data: [{value:"1", text:"Действующий"}, {value:"0", text:"Удалён"}]
        });
        if(this.options.AddMode){
            this.pbEditMode.attr("class", "icon-addmode");
            this.wActGroupsEdit.window({title:"Добавление новой записи"});
            this.lAction.html("Введите данные для новой записи");
            this.cbMode.combobox("setValue", "1");
            this.LoadGroup();
            this.LoadApp();
            this.LoadAct();
        }
        else{
            this.pbEditMode.attr("class", "icon-editmode");
            this.wActGroupsEdit.window({title:"Редатирование записи"});
            this.lAction.html("Введите данные для редактирования текущей записи");
            if(this.options.editMode){
                this.btnOk.linkbutton({disabled: false});
            }
            else{
                this.btnOk.linkbutton({disabled: true});
            }
            this.LoadActGroups();
        }
    }

    /**
     * Загрузка привязки действия к группе
     */
    LoadActGroups(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/AdminGroups/GetActGroup?id='+this.options.id),
            success: function(data){
                this.GroupId = data.groupId;
                this.AppId = data.appId;
                this.ActId = data.actId;
                this.txId.textbox("setText", data.id);
                this.cbMode.combobox("setValue", data.mode.toString());
                this.txCreator.textbox("setText", data.creator);
                this.txCreated.textbox("setText", data.created);
                this.txChanger.textbox("setText", data.changer);
                this.txChanged.textbox("setText", data.changed);
                this.LoadGroup();
                this.LoadApp();
                this.LoadAct();
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
     * Загрузка действия
     */
    LoadAct(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/AdminActs/GetActSel?id='+this.ActId),
            success: function(data){
                this.txAct.textbox("setText", data);
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
        let json = {id: Id, groupId: this.GroupId, appId: this.AppId, actId:this.ActId, mode:mode};
        this.ExistActGroups(json);
        return false;
    }

    /**
     * Проверка существование действия в группе
     * @param json - модель привязки действия к группе
     */
    ExistActGroups(json){
        $.ajax({
            method:"get",
            url: this.GetUrl('/AdminGroups/ExistsActInGroup?id=' + json.id.toString()
                +"&groupId=" + json.groupId.toString() + "&appId=" + json.appId.toString()
                +"&actId=" + json.actId.toString()),
            success: function(data){
                if(data){
                    this.ShowErrorAlert("Данное действие уже существует в данной группе")
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
     * Продолжение сохранения действия в группе
     * @param object - модель привязки действия к группе
     */
    Save(object){
        $.ajax({
            method:"POST",
            data: JSON.stringify(object),
            url: this.GetUrl('/AdminGroups/SaveActGroups'),
            contentType: "application/json; charset=utf-8",
            success: function(data){
                if(this.OkFunc!=null)
                {
                    this.OkFunc(data);
                    this.wActGroupsEdit.window("close");
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
    /**
     * Открыть форму выбора действия
     */
    txAct_onClickButton(){
        let form = new ActFormSel()
        form.SetOkFunction(((AppId, ActId)=>{
            this.AppId = AppId;
            this.ActId = ActId;
            this.LoadApp();
            this.LoadAct();
        }).bind(this));
        form.Show();
    }
}