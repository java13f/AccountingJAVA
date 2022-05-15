import {FormView} from "../Core/FormView.js";
import {TodayFormEdit} from "../Today/TodayFormEdit.js";
import {TodayFormOpenClose} from "./TodayFormOpenClose.js";

class Today extends FormView {
    constructor(prefix, StartParams) {
        super();
        this.TodayIndex = 0;
        this.TodayId = -1;
        this.TodayUsersIndex = 0;
        this.TodayUsersId = -1;
        this.UserId = -1;
        this.CurrentDate = null;
        this.FirstOpening = true;
        this.prefix = prefix;
        this.StartParams = StartParams;
        this.sLoc = new LibLockService(300000);
        this.editMode = false;
    }

    /**
     * Функция загрузки формы
     * @param id - идентификатор элемента HTML, в который будет загружена разметка частичного представления
     * @constructor
     */
    Start(id){
        this.ModuleId = id;
        /** Загружаем макет формы и выполняем  функции InitFunc в случае успеха */
        LoadForm("#"+this.ModuleId, this.GetUrl("/Today/TodayFormList?prefix=" + this.prefix), this.InitFunc.bind(this));
    }

    InitTodayUsers() {
        this.dgTodayUsers.datagrid({
            loadFilter: this.LoadFilter.bind(this),
            onLoadError:(data)=> {this.ShowErrorResponse(data.responseJSON);},
            rowStyler: this.dgTodayUsers_rowStyler.bind(this),
            onLoadSuccess: this.dgTodayUsers_onLoadSuccess.bind(this),
            onSelect: this.btnDeleteChangeText.bind(this)
        });
        AddKeyboardNavigationForGrid(this.dgTodayUsers);
        this.btnUpdateTodayUsers.linkbutton({onClick: this.btnUpdateTodayUsers_onClick.bind(this)});

        this.btnAddTodayUsers.linkbutton({onClick:this.btnAddTodayUsers_onClick.bind(this)});

        this.btnDeleteTodayUsers.linkbutton({onClick:this.btnDeleteTodayUsers_onClick.bind(this)});


    }

    /**
     * Функция инициализации пользовательского интерфейса
     * @constructor
     */
    InitFunc(){
        this.InitComponents(this.ModuleId, this.prefix);
        AddKeyboardNavigationForGrid(this.dgToday);
        this.dgToday.datagrid({
            loadFilter: this.LoadFilter.bind(this),
            onLoadError:(data)=> {this.ShowErrorResponse(data.responseJSON);},
            onLoadSuccess: this.dgToday_onLoadSuccess.bind(this),
            onSelect: this.dgToday_onSelect.bind(this),
            rowStyler: this.dgToday_rowStyler.bind(this)
        });
        this.InitTodayUsers();
        this.CurrentDate = this.GetCurrentDate();
        this.btnUpdateToday.linkbutton({onClick: this.btnUpdateToday_onClick.bind(this)});
        this.btnChangeToday.linkbutton({onClick: this.btnChangeToday_onClick.bind(this)});

        this.LoadRights();
        this.btnAddToday.linkbutton({onClick:this.btnAddToday_onClick.bind(this)});
        this.btnOpenToday.linkbutton({onClick:this.OpenFormsYears.bind(this)});
        this.btnCloseToday.linkbutton({onClick: this.CloseFormsYears.bind(this)});
        this.btnDeleteToday.linkbutton({onClick:this.btnDeleteToday_onClick.bind(this)});
        this.btnUpdateToday_onClick();

        if(this.prefix=="modal_"){
            this.pOkCancel.css("visibility", "visible");
            this.wToday = $("#"+this.ModuleId);
            this.InitCloseEvents(this.wToday, false);
            this.btnCancelToday.linkbutton({onClick: function(){ this.wToday.window("close") }.bind(this)});
            this.btnOkToday.linkbutton({onClick: this.btnOkToday_onClick.bind(this) });
        }
    }

    GetCurrentDate(){
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();

        today = dd + '.' + mm + '.' + yyyy;
        return today;
    }

    /**
     * Удаление записи
     */
    btnDeleteToday_onClick(){
        if(this.dgToday.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для удаления");
            return false;
        }
        let selData = this.dgToday.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для удаления");
            return false;
        }
        let del = selData.del;
        let header = "Удаление";
        let action = "удалить";
        if(del == 1){
            header = "Восстановление";
            action = "восстановить";
        }

        $.messager.confirm(header, "Вы действительно хотите " + action + " выделенный день " + selData.date + " с Id = " + selData.id + "?",
            function (result) {
                if (result) {
                    this.sLoc.StateLockRecord("today", selData.id, this.btnContinueDeleteToday_onClick.bind(this));
                }
            }.bind(this));
    }

    /**
     * Открытие года
     * @constructor
     */
    OpenFormsYears(){
        let form = new TodayFormOpenClose(this.CurrentDate);
        form.SetResultFunc((RecId) => {
            this.btnUpdateToday_onClick();
            this.btnUpdateTodayUsers_onClick();
            let mode = "открыт";
            this.Show_mess(RecId, mode);
        });
        form.Show({AddMode: true});
    }

    /**
     * Закрытие года
     * @constructor
     */
    CloseFormsYears(){
        let form = new TodayFormOpenClose(this.CurrentDate);
        form.SetResultFunc((RecId) => {
            this.btnUpdateToday_onClick();
            this.btnUpdateTodayUsers_onClick();
            let mode = "закрыт";
            this.Show_mess(RecId, mode);
        });
        form.Show({AddMode: false});
    }

    /**
     * Вывод сообщения после закрытия или открытия
     * @param RecId
     * @param mode
     * @constructor
     */
    Show_mess(RecId, mode){
        //this.ShowWarning(RecId +" год был "+ mode +" !");
        let text = RecId +" год был "+ mode +" !";
       // $.messager.alert("Информация", RecId +" год был "+ mode +" !","warning");
        this.ShowSlide("Информация" , text);
      }

    /**
     * ПРподолжение процесса удаления записи
     * @param options
     */
    btnContinueDeleteToday_onClick(options){
        if(options.data.length > 0){
            this.ShowWarning(options.data);
        }
        else
        {
            $.ajax({
                method: "POST",
                url: this.GetUrl('/Today/deleteToday'),
                data: {id: options.id},
                success:function(data){
                    if(data.length) {
                        this.ShowWarning(data);
                    }
                    else{
                        this.btnUpdateToday_onClick();
                    }
                }.bind(this),
                error:function(data){ this.ShowErrorResponse(data.responseJSON); }.bind(this)
            });
        }
    }

    /**
     * Добавить запись в Today
     */
    btnAddToday_onClick() {
        let form = new TodayFormEdit(this.CurrentDate);
        form.SetResultFunc((RecId) => {
            this.TodayId = RecId;
            this.btnUpdateToday_onClick();
        });
        form.Show({AddMode: true});
    }

    LoadRights() {
        $.ajax({
            method: "get",
            url: this.GetUrl('/CoreUtils/GetActRights?TaskCode=Today.dll&ActCode=TodayChange'),
            success: function (data) {
                if (data.length == 0) {
                    this.btnAddToday.linkbutton({disabled: false});
                    this.btnDeleteToday.linkbutton({disabled: false});
                    this.btnAddTodayUsers.linkbutton({disabled: false});
                    this.btnDeleteTodayUsers.linkbutton({disabled: false});
                    this.editMode = true;
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }


    dgToday_onSelect(index, row)
    {
        this.btnUpdateTodayUsers_onClick();
    }

    /**
     * Обработка события перерисовки грида (подсветка удалённых записей)
     * @param index - позиция записи
     * @param row - запись
     */
    dgToday_rowStyler(index, row) {
        if(row.cntusers > 0 && row.openmode === "Закрыт" && row.date !== this.CurrentDate) {
            return "background-color:orange;";
        }
        if(row.openmode === "Открыт" && row.date !== this.CurrentDate) {
            return "background-color:red;";
        }
    }

    /**
     * Обработка окончания загрузки в верхний грид
     * @param data - информация о загруженных данных
     */
    dgToday_onLoadSuccess(data){
        if(data.total > 0) {
            if(this.FirstOpening) {
                this.FirstOpening = false;
                this.dgToday.datagrid("selectRow", data.total-1);
            }
            else if(this.TodayId != -1) {
                this.dgToday.datagrid("selectRecord", this.TodayId);
            }
            else {
                if(this.TodayIndex >= 0 && this.TodayIndex < data.total) {
                    this.dgToday.datagrid("selectRow", this.TodayIndex);
                }
                else if (data.total > 0) {
                    this.dgToday.datagrid("selectRow", data.total-1);
                }
            }

            this.TodayId = -1;
            this.TodayIndex = 0;
        }
    }

    btnChangeToday_onClick(){
        if (this.dgToday.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для изменения");
            return false;
        }
        let selData = this.dgToday.datagrid("getSelected");
        if (selData == null) {
            this.ShowWarning("Выберите запись для изменения");
            return false;
        }

        if (this.editMode) {
            this.sLoc.LockRecord("today", selData.id, this.btnContinueChangeToday_onClick.bind(this));
        } else {
            this.btnContinueChangeToday_onClick({
                id: selData.id,
                AddMode: false,
                editMode: this.editMode,
                lockMessage: '',
                lockState: false
            });
        }
    }

    btnContinueChangeToday_onClick(options){
        if(options.lockMessage.length!=0){
            this.ShowSlide("Предупреждение", options.lockMessage)
            options.editMode = false;
        }
        else{
            if(options.editMode){
                options.lockState = true
            }
        }
        let form = new TodayFormEdit();
        form.SetResultFunc((RecId)=>{  this.TodayId = RecId; this.btnUpdateToday_onClick();});
        form.SetCloseWindowFunction((options)=>{
            if(options!=null){
                if(options.lockState){
                    this.sLoc.FreeLockRecord("today", options.id);
                }
            }
        });
        form.Show(options);
    }


    /**
     * Обновление спиcка
     */
    btnUpdateToday_onClick() {
        let row = this.dgToday.datagrid("getSelected");
        if (row != null) {
            this.TodayIndex = this.dgToday.datagrid("getRowIndex", row);
            if (this.TodayIndex < 0) {
                this.TodayIndex = 0;
            }
        }

        this.dgToday.datagrid({url: this.GetUrl("/Today/getTodayList")});
    }

    /**
     * Обработка выбора записи
     */
    btnOkToday_onClick(){
        if(this.dgToday.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для выбора");
            return false;
        }
        let selData = this.dgToday.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись");
            return false;
        }
        if(this.ResultFunc!=null) {
            this.ResultFunc({id: selData.id.toString()});
        }
        this.wToday.window("close");
        return false;
    }

    /** ------------------------------------------------------------------------------ */

    /**
     * Обработка события перерисовки грида (подсветка удалённых записей)
     * @param index - позиция записи
     * @param row - запись
     */
    dgTodayUsers_rowStyler(index, row) {
        if(row.del == 1) {
            return "background-color:gray;";
        }
    }

    /**
     * Обработка окончания загрузки в верхний грид
     * @param data - информация о загруженных данных
     */
    dgTodayUsers_onLoadSuccess(data){
        if(data.total > 0) {
            if(this.TodayUsersId != -1) {
                this.dgTodayUsers.datagrid("selectRecord", this.TodayUsersId);
            }
            else {
                if(this.TodayUsersIndex >= 0 && this.TodayUsersIndex < data.total) {
                    this.dgTodayUsers.datagrid("selectRow", this.TodayUsersIndex);
                }
                else if (data.total > 0) {
                    this.dgTodayUsers.datagrid("selectRow", data.total-1);
                }
            }

            this.TodayUsersId = -1;
            this.TodayUsersIndex = 0;
        }
        this.btnDeleteChangeText();
    }

    btnUpdateTodayUsers_onClick() {
        let row = this.dgTodayUsers.datagrid("getSelected");
        if (row != null) {
            this.TodayUsersIndex = this.dgTodayUsers.datagrid("getRowIndex", row);
            if (this.TodayUsersIndex < 0) {
                this.TodayUsersIndex = 0;
            }
        }

        //this.TodayId = this.dgToday.datagrid("getSelected").id;
        this.dgTodayUsers.datagrid({url: this.GetUrl("/TodayUsers/getTodayUsersList?todayid=" + this.dgToday.datagrid("getSelected").id)});
    }

    /**
     * Изменение текста на кнопке "Удалить"
     */
    btnDeleteChangeText(){
        if(this.dgTodayUsers.datagrid("getRows").length != 0){
            let selData = this.dgTodayUsers.datagrid("getSelected");
            if(selData !=null ){
                if(selData.del==1){
                    this.btnDeleteTodayUsers.linkbutton({iconCls:"icon-undo", text:"Вернуть"});
                }
                else {
                    this.btnDeleteTodayUsers.linkbutton({iconCls:"icon-remove", text:"Удалить"});
                }
            }
            else {
                this.btnDeleteTodayUsers.linkbutton({iconCls:"icon-remove", text:"Удалить"});
            }
        }
        else {
            this.btnDeleteTodayUsers.linkbutton({iconCls:"icon-remove", text:"Удалить"});
        }
    }

    /**
     * Добавить запись в TodayUsers
     */
    btnAddTodayUsers_onClick() {
        StartModalModulGlobal("Users", {}, ((data) =>{
            this.TodayId = this.dgToday.datagrid("getSelected").id;
            let obj = { todayid: this.TodayId, userid: data.id };
            this.ExistsUserInDay(obj);
            this.btnUpdateToday_onClick();

        }).bind(this));
    }

    ExistsUserInDay(obj)
    {
        $.ajax({
            method: "GET",
            url: this.GetUrl('/TodayUsers/existsUserInDay?todayid=' + obj.todayid.toString() + '&userid=' + obj.userid.toString()),
            success:function(data){
                if(data) {
                    this.ShowWarning("Данный пользователь уже был добавлен в выбранный день");
                }
                else{
                    this.Save(obj);
                }
            }.bind(this),
            error:function(data){ this.ShowErrorResponse(data.responseJSON); }.bind(this)
        });
    }

    /**
     * Сохранение записи
     * @param obj
     * @constructor
     */
    Save(obj){
        $.ajax({
            method:"POST",
            data: JSON.stringify(obj),
            url: this.GetUrl('/TodayUsers/saveTodayUsers'),
            contentType: "application/json; charset=utf-8",
            success: function(data){
                this.TodayUsersId = data;
                this.btnUpdateTodayUsers_onClick();
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }


    /**
     * Удаление записи
     */
    btnDeleteTodayUsers_onClick(){
        if(this.dgTodayUsers.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для удаления");
            return false;
        }
        let selData = this.dgTodayUsers.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для удаления");
            return false;
        }
        let del = selData.del;
        let header = "Удаление";
        let action = "удалить";
        if(del == 1){
            header = "Восстановление";
            action = "восстановить";
        }

        $.messager.confirm(header, "Вы действительно хотите " + action + " выделенного пользователя " + selData.username + " с Id = " + selData.id + "?",
            function (result) {
                if (result) {
                    this.sLoc.StateLockRecord("today", selData.id, this.btnContinueDeleteTodayUsers_onClick.bind(this));
                }
            }.bind(this));
    }

    /**
     * ПРподолжение процесса удаления записи
     * @param options
     */
    btnContinueDeleteTodayUsers_onClick(options){
        if(options.data.length > 0){
            this.ShowWarning(options.data);
        }
        else
        {
            $.ajax({
                method: "POST",
                url: this.GetUrl('/TodayUsers/deleteTodayUsers'),
                data: {id: options.id},
                success:function(data){
                    if(data.length) {
                        this.ShowWarning(data);
                    }
                    else{
                        this.btnUpdateTodayUsers_onClick();
                    }
                }.bind(this),
                error:function(data){ this.ShowErrorResponse(data.responseJSON); }.bind(this)
            });
        }
    }

}

/**
 * Функция встраиваемого запуска модуля
 * @param Id
 * @constructor
 */
export function StartNestedModul(Id){
    let form = new Today("nested_", {});
    form.Start(Id);
}

/**
 * Вызов модуля в диалоговом окне
 * @param StartParams стартовые параметры
 * @param ResultFunc функция, которая будет вызываться по нажатию на кнопку "ОК"
 * @constructor
 */
export function StartModalModul(StartParams, ResultFunc) {
    let id = "wToday_Module_Today_TodayFormList";
    CreateModalWindow(id, "Точка актуальности");
    let form = new Today("modal_", StartParams);
    form.SetResultFunc(ResultFunc);
    form.Start(id);
}