export class GroupEditForm{
    constructor() {
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
        LoadForm("#ModalWindows", this.GetUrl("/AdminGroups/GroupEditForm"), this.InitFunc.bind(this));
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
        this.wGroupEdit = $("#wGroupEdit_Module_Admin");
        this.lAction = $("#lAction_Module_Admin_GroupEdit");
        this.btnCancel = $("#btnCancel_Module_Admin_GroupEdit");
        this.btnOk = $("#btnOk_Module_Admin_GroupEdit");
        this.cbDel = $("#cbDel_Module_Admin_GroupEdit");
        this.pbEditMode = $("#pbEditMode_Module_Admin_GroupEdit");
        this.txId = $("#txId_Module_Admin_GroupEdit");
        this.txCode = $("#txCode_Module_Admin_GroupEdit");
        this.txName = $("#txName_Module_Admin_GroupEdit");
        this.txCreator = $("#txCreator_Module_Admin_GroupEdit");
        this.txCreated = $("#txCreated_Module_Admin_GroupEdit");
        this.txChanger = $("#txChanger_Module_Admin_GroupEdit");
        this.txChanged = $("#txChanged_Module_Admin_GroupEdit");

        this.wGroupEdit.window({onClose:()=>{
            if(this.CloseWindowFunc!=null){
                this.CloseWindowFunc(this.options);
            }
            this.wGroupEdit.window("destroy");
        }});
        this.wGroupEdit.window('window').attr('tabindex',1).focus().bind('keyup', function(e){
            if (e.keyCode == Keys.VK_ESCAPE){
                this.wGroupEdit.window('close');
            }
            if(e.keyCode == Keys.VK_RETURN){
                if(this.options!=null) {
                    if (this.options.editMode) {
                        this.btnOk_onClick();
                    }
                }
                else {
                    this.btnOk_onClick();
                }
            }
        }.bind(this))

        this.cbDel.combobox({data: [{value: 0, text: 'Не удалён'}, {value: 1, text: 'Удалён'}]});
        this.cbDel.combobox("setValue", 0);
        this.btnOk.attr("href", "javascript:void(0)");
        this.btnOk.linkbutton({onClick:this.btnOk_onClick.bind(this)});
        this.btnCancel.attr("href", "javascript:void(0)");
        this.btnCancel.linkbutton({onClick:()=>{
            this.wGroupEdit.window("close");
        }});
        if(this.options==null){
            this.pbEditMode.attr("class", "icon-addmode");
            this.wGroupEdit.window({title:"Добавление новой записи"});
            this.lAction.html("Введите данные для новой записи");
        }
        else {
            this.pbEditMode.attr("class", "icon-editmode");
            this.wGroupEdit.window({title:"Редатирование записи"});
            this.lAction.html("Введите данные для редактирования текущей записи");
            if(this.options.editMode){
                this.btnOk.linkbutton({disabled: false});
            }
            else{
                this.btnOk.linkbutton({disabled: true});
            }
            $.ajax({
                method:"get",
                url: this.GetUrl('/AdminGroups/GetGroup?GroupId='+this.options.id),
                success: function(data){
                    this.txId.textbox("setText", data.id.toString());
                    this.txCode.textbox("setText", data.code);
                    this.txName.textbox("setText", data.name);
                    this.txCreator.textbox("setText", data.creator);
                    this.txCreated.textbox("setText", data.created);
                    this.txChanger.textbox("setText", data.changer);
                    this.txChanged.textbox("setText", data.changed);
                    this.cbDel.combobox("setValue", data.deleted);
                }.bind(this),
                error: function(data) {
                    this.ShowErrorResponse(data.responseJSON);
                }.bind(this)
            })
        }
    }

    /**
     * Обработка сохранения записи
     */
    btnOk_onClick(){
        let Id = this.txId.textbox("getText");
        let Code = this.txCode.textbox("getText");
        let Name = this.txName.textbox("getText");
        let deleted = this.cbDel.combobox("getValue");

        if(Id.length==0){
            Id = "-1";
        }

        if(Code.length==0){
            this.ShowErrorAlert("Введите пожалуйста код группы")
            return false;
        }
        if(Name.length==0){
            this.ShowErrorAlert("Введите пожалуйста наименование группы")
            return false;
        }
        let json = JSON.stringify({'id': Id, 'code': Code, 'name': Name, 'deleted': deleted});
        $.ajax({
            method:"get",
            url: this.GetUrl('/AdminGroups/ExistsGroup?id=' + Id.toString() + "&code="+encodeURIComponent(Code)),
            success: function(data){
                if(data){
                    this.ShowErrorAlert("Группа с кодом " + Code + " уже существует.")
                }
                else {
                    this.Save(json);
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
        return false;
    }

    /**
     * Продолжение сохранения группы
     * @param object - группа
     */
    Save(object){
        $.ajax({
            method:"POST",
            data: object,
            url: this.GetUrl('/AdminGroups/Save'),
            contentType: "application/json; charset=utf-8",
            success: function(data){
                if(this.OkFunc!=null)
                {
                    this.OkFunc(data);
                    this.wGroupEdit.window("close");
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }
}