import {AppFormSel} from "./Directories/AppFormSel.js";

export class ActEditForm{
    constructor() {
        this.AppId = -1;
    }

    /**
     * Получить url-адрес с учетом контекста
     * @param url - url-адрес без учета контекста
     */
    GetUrl(url) {
        return contextPath + url;
    }

    /**
     * Загрузить и показать UI формы
     * @param options - настройки
     */
    Show(options) {
        this.options = options;
        LoadForm("#ModalWindows", this.GetUrl("/AdminActs/GetActEditForm"), this.InitFunc.bind(this));
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
        this.wActEdit = $("#wActEdit_Module_Admin");
        this.lAction = $("#lAction_Module_Admin_ActEdit");
        this.btnCancel = $("#btnCancel_Module_Admin_ActEdit");
        this.btnOk = $("#btnOk_Module_Admin_ActEdit");
        this.pbEditMode = $("#pbEditMode_Module_Admin_ActEdit");
        this.txId = $("#txId_Module_Admin_ActEdit");
        this.txCode = $("#txCode_Module_Admin_ActEdit");
        this.txApp = $("#txApp_Module_Admin_ActEdit");
        this.txName = $("#txName_Module_Admin_ActEdit");
        this.txCreator = $("#txCreator_Module_Admin_ActEdit");
        this.txCreated = $("#txCreated_Module_Admin_ActEdit");
        this.txChanger = $("#txChanger_Module_Admin_ActEdit");
        this.txChanged = $("#txChanged_Module_Admin_ActEdit");
        this.cbDeleted = $("#cbDeleted_Module_Admin_ActEdit");

        this.wActEdit.window({onClose:()=>{
                if(this.CloseWindowFunc!=null){
                    this.CloseWindowFunc(this.options);
                }
                this.wActEdit.window("destroy");
            }});
        this.wActEdit.window('window').attr('tabindex',1).focus().bind('keyup', function(e){
            if (e.keyCode == Keys.VK_ESCAPE){
                this.wActEdit.window('close');
            }
            if(e.keyCode == Keys.VK_RETURN){
                if(this.options!=null) {
                    if (this.options.editMode) {
                        this.btnOk_onClick();
                    }
                }
                else{
                    this.btnOk_onClick();
                }
            }
        }.bind(this))
        this.btnOk.attr("href", "javascript:void(0)");
        this.btnCancel.attr("href", "javascript:void(0)");
        this.txApp.textbox({
            onClickButton: this.txApp_onClickButton.bind(this)
        });
        this.btnOk.linkbutton({onClick:this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({onClick:()=>{
                this.wActEdit.window("close");
            }});
        if(this.options==null){
            this.pbEditMode.attr("class", "icon-addmode");
            this.wActEdit.window({title:"Добавление новой записи"});
            this.lAction.html("Введите данные для новой записи");
        }
        else {
            this.pbEditMode.attr("class", "icon-editmode");
            this.wActEdit.window({title:"Редатирование записи"});
            this.lAction.html("Введите данные для редактирования текущей записи");
            if(this.options.editMode){
                this.btnOk.linkbutton({disabled: false});
            }
            else{
                this.btnOk.linkbutton({disabled: true});
            }
            this.LoadAct(this.options.id);
        }
    }

    /**
     * Загрузка данных действия
     * @param ActId - идентификатор действия
     */
    LoadAct(ActId){
        $.ajax({
            method:"get",
            url: this.GetUrl('/AdminActs/Get?id='+ActId),
            success: function(data){
                this.user = data;
                this.txId.textbox("setText", data.id);
                this.txCode.textbox("setText", data.code);
                this.AppId = data.appId;
                this.txName.textbox("setText", data.name);
                this.txCreator.textbox("setText", data.creator);
                this.txCreated.textbox("setText", data.created);
                this.txChanger.textbox("setText", data.changer);
                this.txChanged.textbox("setText", data.changed);
                this.LoadApp();
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }
    /**
     * Загрузка приложения
     */
    LoadApp(){
        if(this.AppId==-1){return;}
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
     * Выбор приложения из справочника
     */
    txApp_onClickButton(){
        let form = new AppFormSel()
        form.SetOkFunction(((RecId)=>{ this.AppId = RecId; this.LoadApp(); }).bind(this));
        form.Show();
    }
    /**
     * Обработка сохранения записи
     */
    btnOk_onClick(){
        let Id = this.txId.textbox("getText");
        let Code = this.txCode.textbox("getText");
        let Name = this.txName.textbox("getText");

        if(Id.length == 0){
            Id = "-1";
        }
        if(this.AppId == -1){
            this.ShowErrorAlert("Выберите приложение");
            return false;
        }
        if(Code.length==0){
            this.ShowErrorAlert("Введите пожалуйста код действия");
            return false;
        }
        if(Name.length==0){
            this.ShowErrorAlert("Введите пожалуйста наименование действия");
            return false;
        }
        let json = {id: Id, code: Code, appId:this.AppId, name:Name};
        this.ExistsAct(json);
        return false;
    }
    ExistsAct(json){
       $.ajax({
            method:"get",
            url: this.GetUrl('/AdminActs/Exists?id=' + json.id.toString() + "&code="+encodeURIComponent(json.code)),
            success: function(data){
                if(data){
                    this.ShowErrorAlert("Действие с кодом " + json.code + " уже существует.")
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
     * Продолжение сохранения действия
     * @param object - действие
     */
    Save(object){
        $.ajax({
            method:"POST",
            data: JSON.stringify(object),
            url: this.GetUrl('/AdminActs/Save'),
            contentType: "application/json; charset=utf-8",
            success: function(data){
                if(this.OkFunc!=null)
                {
                    this.OkFunc(data);
                    this.wActEdit.window("close");
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }
}