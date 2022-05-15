export class UserEditForm{
    constructor() {
        this.user = null;
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
        LoadForm("#ModalWindows", this.GetUrl("/AdminUsers/UserEditForm"), this.InitFunc.bind(this));
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
        this.wUserEdit = $("#wUserEdit_Module_Admin");
        this.lAction = $("#lAction_Module_Admin_UserEdit");
        this.btnCancel = $("#btnCancel_Module_Admin_UserEdit");
        this.btnOk = $("#btnOk_Module_Admin_UserEdit");
        this.pbEditMode = $("#pbEditMode_Module_Admin_UserEdit");
        this.cbKters = $("#cbKters_Module_Admin_UserEdit");
        this.cbDeps = $("#cbDeps_Module_Admin_UserEdit");
        this.txId = $("#txId_Module_Admin_UserEdit");
        this.txCode = $("#txCode_Module_Admin_UserEdit");
        this.txName = $("#txName_Module_Admin_UserEdit");
        this.txPassword = $("#txPassword_Module_Admin_UserEdit");
        this.txPassword2 = $("#txPassword2_Module_Admin_UserEdit");
        this.txCreator = $("#txCreator_Module_Admin_UserEdit");
        this.txCreated = $("#txCreated_Module_Admin_UserEdit");
        this.txChanger = $("#txChanger_Module_Admin_UserEdit");
        this.txChanged = $("#txChanged_Module_Admin_UserEdit");
        this.cbDeleted = $("#cbDeleted_Module_Admin_UserEdit");

        this.wUserEdit.window({onClose:()=>{
                if(this.CloseWindowFunc!=null){
                    this.CloseWindowFunc(this.options);
                }
                this.wUserEdit.window("destroy");
            }});
        this.wUserEdit.window('window').attr('tabindex',1).focus().bind('keyup', function(e){
            if (e.keyCode == Keys.VK_ESCAPE){
                this.wUserEdit.window('close');
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
        this.cbDeleted.combobox({
            data: [{value: "0", text: 'Не удалён'}, {value: "1", text: 'Удалён'}]
        });
        this.btnOk.attr("href", "javascript:void(0)");
        this.btnOk.linkbutton({onClick:this.btnOk_onClick.bind(this)});
        this.btnCancel.attr("href", "javascript:void(0)");
        this.btnCancel.linkbutton({onClick:()=>{
                this.wUserEdit.window("close");
            }});
        this.cbKters.combobox({
           onSelect: this.cbKters_onSelect.bind(this)
        });
        if(this.options==null){
            this.pbEditMode.attr("class", "icon-addmode");
            this.wUserEdit.window({title:"Добавление новой записи"});
            this.lAction.html("Введите данные для новой записи");
            this.LoadKters()
        }
        else {
            this.pbEditMode.attr("class", "icon-editmode");
            this.wUserEdit.window({title:"Редатирование записи"});
            this.lAction.html("Введите данные для редактирования текущей записи");
            if(this.options.editMode){
                this.btnOk.linkbutton({disabled: false});
            }
            else{
                this.btnOk.linkbutton({disabled: true});
            }
            $.when(this.LoadUser(this.options.id)).then((()=>{this.LoadKters()}).bind(this), ((data)=>{this.ShowErrorResponse(data.responseJSON);}).bind(this));
        }
    }

    /**
     * Загрузка данных пользователя
     * @param UserId - идентификатор пользователя
     */
    LoadUser(UserId){
        return $.ajax({
            method:"get",
            url: this.GetUrl('/AdminUsers/GetUser?id='+UserId),
            success: function(data){
                this.user = data;
                this.txId.textbox("setText", data.id);
                this.txCode.textbox("setText", data.code);
                this.txName.textbox("setText", data.name);
                this.cbDeleted.combobox("setValue", data.deleted.toString());
                this.txCreator.textbox("setText", data.creator);
                this.txCreated.textbox("setText", data.created);
                this.txChanger.textbox("setText", data.changer);
                this.txChanged.textbox("setText", data.changed);
            }.bind(this)
        });
    }
    /**
     * Загрузка территорий
     * @constructor
     */
    LoadKters(){
        return $.ajax({
            method:"get",
            url: this.GetUrl('/AdminUsers/GetKtersUserEdit'),
            success: function(data){
                this.cbKters.combobox({
                    valueField: 'id',
                    textField: 'name',
                    data: data
                });
                if(this.user!=null){
                    for(let iKter = 0; iKter < data.length; iKter++){
                        let Kter = data[iKter];
                        if(Kter.id==this.user.kterId){
                            this.cbKters.combobox("setValue", this.user.kterId);
                        }
                    }
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Загрузка подразделений
     * @param KterId - идентификатор территории
     */
    LoadDeps(KterId){
        return $.ajax({
            method:"get",
            url: this.GetUrl('/AdminUsers/GetDeps?KterId=' + KterId),
            success: function(data){
                this.cbDeps.combobox({
                    valueField: 'id',
                    textField: 'name',
                    data: data
                });
                if(this.user!=null){
                    for(let iDep = 0; iDep < data.length; iDep++){
                        let Dep = data[iDep];
                        if(Dep.id==this.user.depId){
                            this.cbDeps.combobox("setValue", this.user.depId);
                        }
                    }
                }
            }.bind(this),
            error:function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        })
    }

    /**
     * Обработка выбора территории
     * @param recod - выбранная запись
     */
    cbKters_onSelect(record){
        this.LoadDeps(record.id);
    }
    /**
     * Обработка сохранения записи
     */
    btnOk_onClick(){
        let Id = this.txId.textbox("getText");
        let Code = this.txCode.textbox("getText");
        let Name = this.txName.textbox("getText");
        let Password = this.txPassword.textbox("getText");
        let Password2 = this.txPassword2.textbox("getText");
        let kterId = this.cbKters.combobox("getValue");
        let depId = this.cbDeps.combobox("getValue");
        let Deleted = this.cbDeleted.combobox("getValue");

        if(Id.length == 0){
            Id = "-1";
        }
        if(kterId.length==0){
            this.ShowErrorAlert("Выберите пожалуйста территорию")
            return false;
        }
        if(depId.length==0){
            this.ShowErrorAlert("Выберите пожалуйста подразделение")
            return false;
        }
        if(Deleted.length==0){
            this.ShowErrorAlert("Выберите пожалуйста удалён пользователь или нет")
            return false;
        }
        if(Code.length==0){
            this.ShowErrorAlert("Введите пожалуйста логин пользователя")
            return false;
        }
        if(Name.length==0){
            this.ShowErrorAlert("Введите пожалуйста имя пользователя")
            return false;
        }
        if(Id == "-1" && Password.length == 0){
            this.ShowErrorAlert("Для нового пользователя обязательно необходимо ввести пароль");
            return false;
        }
        if(Password != Password2){
            this.ShowErrorAlert("Ввведённые пароли не совпадают");
            return false;
        }
        let json = {id: Id, kterId: kterId, depId: depId, code: Code, name: Name, password:Password, password2:Password2, deleted: Deleted};
        this.ExistUser(json);
        return false;
    }
    ExistUser(json){
        $.ajax({
            method:"get",
            url: this.GetUrl('/AdminUsers/ExistsUser?id=' + json.id.toString() + "&code="+encodeURIComponent(json.code)),
            success: function(data){
                if(data){
                    this.ShowErrorAlert("Пользователь с логином " + json.code + " уже существует.")
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
     * Продолжение сохранения пользователя
     * @param object - пользователь
     */
    Save(object){
        $.ajax({
            method:"POST",
            data: JSON.stringify(object),
            url: this.GetUrl('/AdminUsers/Save'),
            contentType: "application/json; charset=utf-8",
            success: function(data){
                if(this.OkFunc!=null)
                {
                    this.OkFunc(data);
                    this.wUserEdit.window("close");
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }
}