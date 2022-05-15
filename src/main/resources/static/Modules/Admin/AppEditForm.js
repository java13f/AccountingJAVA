import {AppFormSel} from "./Directories/AppFormSel.js";

export class AppEditForm{
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
    Show(options){
        this.options = options;
        this.AppId = this.options.AppId;
        LoadForm("#ModalWindows", this.GetUrl("/AdminApps/AppEditForm"), this.InitFunc.bind(this));
    }
    /**
     * Функция инициализации пользовательского интерфейса
     */
    InitFunc(){
        this.wAppEdit = $("#wAppEdit_Module_Admin");
        this.pbEditMode = $("#pbEditMode_Module_Admin_AppEdit");
        this.lAction = $("#lAction_Module_Admin_AppEdit");
        this.txId = $("#txId_Module_Admin_AppEdit");
        this.txAppParent = $("#txAppParent_Module_Admin_AppEdit");
        this.btnClearAppParent = $("#btnClearAppParent_Module_Admin_AppEdit");
        this.txCode = $("#txCode_Module_Admin_AppEdit");
        this.txCodeJs = $("#txCodeJs_Module_Admin_AppEdit");
        this.txFunc = $("#txFunc_Module_Admin_AppEdit");
        this.cbManagedModul = $("#cbManagedModul_Module_Admin_AppEdit");
        this.cbModulType = $("#cbModulType_Module_Admin_AppEdit");
        this.txName = $("#txName_Module_Admin_AppEdit");
        this.cbAppName = $("#cbAppName_Module_Admin_AppEdit");
        this.txSortCode = $("#txSortCode_Module_Admin_AppEdit");
        this.txCreator = $("#txCreator_Module_Admin_AppEdit");
        this.txCreated = $("#txCreated_Module_Admin_AppEdit");
        this.txChanger = $("#txChanger_Module_Admin_AppEdit");
        this.txChanged = $("#txChanged_Module_Admin_AppEdit");
        this.btnOk = $("#btnOk_Module_Admin_AppEdit");
        this.btnCancel = $("#btnCancel_Module_Admin_AppEdit");
        this.wAppEdit.window({onClose:()=>{
                if(this.CloseWindowFunc!=null){
                    this.CloseWindowFunc(this.options);
                }
                this.wAppEdit.window("destroy");
            }});
        this.wAppEdit.window('window').attr('tabindex',1).focus().bind('keyup', function(e){
            if (e.keyCode == Keys.VK_ESCAPE){
                this.wAppEdit.window('close');
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
        this.cbModulType.combobox({
            data: [{value: "0", text: "Модуль/HRT отчёт"},
                {value: "1", text: "Альтернативный отчёт"},
                {value: "2", text: "WEB HRT отчёт"},
                {value: "3", text: "Папка"}]
        });
        this.cbAppName.combobox({
            data:[{value:"Treasury", text: "Treasury"},
                {value:"ARMRep", text: "ARMRep"}]
        });
        this.txAppParent.textbox({
            onClickButton: this.txParent_onClickButton.bind(this)
        });
        this.btnClearAppParent.attr("href", "javascript:void(0)")
        this.btnOk.attr("href", "javascript:void(0)");
        this.btnCancel.attr("href", "javascript:void(0)");
        this.btnClearAppParent.linkbutton({onClick:()=>{
            this.AppId=-1;
            this.txAppParent.textbox("setValue", "");
            }});
        this.btnOk.linkbutton({onClick:this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({onClick:()=>{
                this.wAppEdit.window("close");
            }});
        if(this.options.AddMode){
            this.pbEditMode.attr("class", "icon-addmode");
            this.wAppEdit.window({title:"Добавление новой записи"});
            this.lAction.html("Введите данные для новой записи");
            this.LoadParentApp();
        }
        else{
            this.pbEditMode.attr("class", "icon-editmode");
            this.wAppEdit.window({title:"Редатирование записи"});
            this.lAction.html("Введите данные для редактирования текущей записи");
            if(this.options.editMode){
                this.btnOk.linkbutton({disabled: false});
            }
            else{
                this.btnOk.linkbutton({disabled: true});
            }
            this.LoadApp();
        }
    }

    /**
     * Загрузка данных приложения
     */
    LoadApp(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/AdminApps/Get?id='+this.options.id),
            success: function(data){
                this.AppId = data.parentId;
                this.txId.textbox("setText", data.id);
                this.txCode.textbox("setText", data.code);
                this.txCodeJs.textbox("setText", data.codeJs);
                this.txFunc.textbox("setText", data.func);
                if(data.managedModule==1)
                {
                    this.cbManagedModul.checkbox("check");
                }
                this.cbModulType.combobox("setValue", data.report);
                this.txName.textbox("setText", data.name);
                this.cbAppName.textbox("setValue", data.appName);
                this.txSortCode.textbox("setText", data.sortCode);
                this.txCreator.textbox("setText", data.creator);
                this.txCreated.textbox("setText", data.created);
                this.txChanger.textbox("setText", data.changer);
                this.txChanged.textbox("setText", data.changed);
                this.LoadParentApp();
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }
    /**
     * Загрузка родительского приложения
     */
    LoadParentApp(){
        if(this.AppId==-1){return;}
        $.ajax({
            method:"get",
            url: this.GetUrl('/AdminApps/GetAppSel?id='+this.AppId),
            success: function(data){
                this.txAppParent.textbox("setText", data);
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Обработка выбора родительского приложения
     */
    txParent_onClickButton(){
        let form = new AppFormSel()
        form.SetOkFunction(((RecId)=>{ this.AppId = RecId; this.LoadParentApp(); }).bind(this));
        form.Show();
    }

    /**
     * Обработка сохранения приложения
     */
    btnOk_onClick(){
        let id = this.txId.textbox("getText");
        let code = this.txCode.textbox("getText");
        let codeJs = this.txCodeJs.textbox("getText");
        let func = this.txFunc.textbox("getText");
        let name = this.txName.textbox("getText");
        let appName = this.cbAppName.combobox("getValue");
        let managedModule = this.cbManagedModul.checkbox("options").checked ? 1 : 0;
        let report = this.cbModulType.combobox("getValue");
        let sortCode = this.txSortCode.textbox("getText");

        if(id.length == 0){
            id = "-1";
        }
        if(code.length == 0){
            this.ShowErrorAlert("Ведите пожалуйста \"Имя приложение dll\"");
            return false;
        }
        if(codeJs.length == 0){
            this.ShowErrorAlert("Ведите пожалуйста \"Имя приложение js\"");
            return false;
        }
        if(name.length==0){
            this.ShowErrorAlert("Введите пожалуйста наименование приложения");
            return false;
        }
        if(report.length==0){
            this.ShowErrorAlert("Выберите тип приложения");
            return false;
        }
        if(appName.length==0){
            this.ShowErrorAlert("Выберите название приложения запуска");
            return false;
        }
        let json = {id:id, parentId:this.AppId, code:code, codeJs:codeJs, func:func, name: name, appName: appName, managedModule: managedModule, report:report, sortCode:sortCode};
        this.ExistApp(json);
        return false;
    }

    /**
     * Проверка существания приложения в базе данных
     */
    ExistApp(json){
        $.ajax({
            method:"get",
            url: this.GetUrl('/AdminApps/Exists?id=' + json.id.toString()
                +"&code=" + encodeURIComponent(json.code) + "&func=" + encodeURIComponent(json.func)),
            success: function(data){
                if(data){
                    this.ShowErrorAlert("Такое приложение уже есть в таблице приложений")
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
     * Продолжение сохранения приложения
     * @param object - модель привязки ползователя к группе
     */
    Save(object){
        $.ajax({
            method:"POST",
            data: JSON.stringify(object),
            url: this.GetUrl('/AdminApps/Save'),
            contentType: "application/json; charset=utf-8",
            success: function(data){
                if(this.OkFunc!=null)
                {
                    this.OkFunc(data);
                    this.wAppEdit.window("close");
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }
}