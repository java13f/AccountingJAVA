import {FormView} from "../Core/FormView.js";

export class OrderRepairs extends FormView {

    constructor(prefix, StartParams) {
        super();
        this.prefix = prefix;
        this.StartParams = StartParams;
        this.okstate = false;
        this.CurrentStatus = 0;
        this.ProblemId = -1;
        this.ParamId = -1;
        this.InitUserId = -1;
        this.WorkUserId = -1;
        this.ObjsId = -1;
        this.ObjTypeId = -1;
        this.IdVal = -1;
        this.StatusData = [{"id":1, "flag":0, "name":"Новая"}, {"id":2, "flag":1, "name":"Приостановлена"}, {"id":3, "flag":2, "name":"В работе"},
                            {"id":4, "flag":3, "name":"Исполнена"}, {"id":5, "flag":-1, "name":"Отклонена"}];
    }

    Start(id) {
        this.ModuleId = id;
        LoadForm('#ModalWindows', this.GetUrl("/OrderRepairs/OrderRepairsForm"), this.InitFunc.bind(this));
    }

    /**
     * Инциализация интерфейса пользователя
     * @constructor
     */
    InitFunc(){
        this.InitComponents(this.ModuleId, "");
        this.InitCloseEvents(this.wOrderRepairsForm);

        if(this.StartParams.ordertype == 29) {
            this.wOrderRepairsForm.window({title: 'Замена картриджа'});
            if(this.StartParams.orderid == -1)
                $(this.lblAction).html('Добавление заявки \"Замена картриджа\"');
            else
                $(this.lblAction).html('Редактирование заявки \"Замена картриджа\"');

        } else if(this.StartParams.ordertype == 32) {
            this.wOrderRepairsForm.window({title: 'Заявка на ремонт'});
            if(this.StartParams.orderid == -1)
                $(this.lblAction).html('Добавление заявки на ремонт компьютерной техники');
            else
                $(this.lblAction).html('Редактирование заявки на ремонт компьютерной техники');
        }

        this.GetUser();

        this.dbOrderDate.datebox({formatter: this.formatter.bind(this), parser: this.parser.bind(this)});
        this.dbCloseOrderDate.datebox({formatter: this.formatter.bind(this), parser: this.parser.bind(this)});
        this.btnProblems.linkbutton({onClick: this.btnProblems_onClick.bind(this)});

        this.btnObject.linkbutton({onClick: this.btnObject_onClick.bind(this)});
        this.btnName.linkbutton({onClick: this.btnName_onClick.bind(this)});
        this.btnExecutive.linkbutton({onClick: this.btnExecutive_onClick.bind(this)});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.cmbStts.combobox({onSelect: this.cmbStts_onSelect.bind(this)});
        this.cmbStts.combobox({onChange: this.cmbStts_onChange.bind(this)});
        this.chkCloseOrderDate.checkbox({onChange: this.chkCloseOrderDate_onChange.bind(this)});
        this.txCost.numberbox({
            precision: 2,
            value: 0.00,
            decimalSeparator: ',',
            groupSeparator: ' '
        });

        this.btnCancel.linkbutton({onClick:()=>{this.wOrderRepairsForm.window("close")}});
        this.SetCloseWindowFunction((options) => {
            this.ResultFunc({
                orderid: this.StartParams.orderid,
                lockstate: this.StartParams.lockstate,
                okstate: this.okstate
            });
        });
    }

    btnProblems_onClick() {
        if(this.ObjsId == -1) {
            this.ShowToolTip("#divtbObject_Module_OrderRepairs","Выберите объект, чтобы выбрать код проблемы!", { position: "right" });
            return false;
        }

        StartModalModulGlobal('Problems', {obj_type_id: this.ObjTypeId}, (data) => {
            this.GetProblem(data.id)
                .then((result) => {
                    if(data.id.length > 0) {
                        this.ProblemId = Number.parseInt(data.id);
                        this.SetProblemCode(result);
                    }
                })
                .catch((error) => { this.ShowErrorResponse(error.responseJSON); });
        })
    }

    GetProblem(id) {
        return new Promise((resolve, reject) => {
           $.ajax({
               method: 'GET',
               url: this.GetUrl('/OrderRepairs/GetProblem?id=' + id),
               success: function (data) {
                    resolve(data);
               }.bind(this),
               error: function (error) {
                    reject(error);
               }.bind(this)
           });
        });
    }

    SetProblemCode(problem) {
        this.txProblemCode.textbox("setText", problem);
    }

    chkCloseOrderDate_onChange() {
        if (this.chkCloseOrderDate.checkbox("options").checked) {
            this.dbCloseOrderDate.datebox("enable");
        }
        else {
            this.dbCloseOrderDate.datebox("disable");
        }
    }

    cmbStts_onChange(newValue, oldValue){

        if(oldValue.length > 0) {
            this.CurrentStatus = this.StatusData[newValue - 1].flag;
            this.GetListSttsOrder();
        }
    }

    cmbStts_onSelect(record) {
        this.CurrentStatus = record.flag;
    }

    /**
     * Открыть справочник пользователей, чтоб выбрать инициатора
     */
    btnName_onClick() {
        try {
            StartModalModulGlobal("Users",
                "",
                ((data)=>{this.GetUserDepName(data.id);}).bind(this));
        }
        catch (e) {
            this.ShowError(e);
        }
    }

    /**
     * Открыть модуль Объекты, чтобы выбрать объект для ремонта
     */
    btnObject_onClick() {
        try {
            StartModalModulGlobal("Objs",
                "",
                ((data)=>{this.getObject(data.id);}).bind(this));
        }
        catch (e) {
            this.ShowError(e);
        }
    }

    /**
     * Открыть справочник пользователе, чтобы выбрать испольняющего
     */
    btnExecutive_onClick() {
        try {
            StartModalModulGlobal("Users",
                "",
                ((data)=>{this.GetExecutive(data.id);}).bind(this));
        }
        catch (e) {
            this.ShowError(e);
        }
    }

    /**
     * Получить испольняющего
     * @param id
     * @constructor
     */
    GetExecutive(id) {
        $.ajax({
            method:"get",
            url: this.GetUrl('/OrderRepairs/GetUserDepName?Id='+id),
            success: function(data){
                this.WorkUserId = data.id;
                this.txExecutive.textbox("setText", data.username);
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Получить инициатора и его код подразделения
     * @param id
     * @constructor
     */
    GetUserDepName(id) {
        $.ajax({
            method:"get",
            url: this.GetUrl('/OrderRepairs/GetUserDepName?Id='+id),
            success: function(data){
                this.InitUserId = data.id;
                this.txName.textbox("setText", data.username);
                this.txDepCode.textbox("setText", data.depcode + ' = ' + data.depname);
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Получить наименование объекта и инв.номер
     * @param id
     */
    getObject(id) {
        $.ajax({
            method:"get",
            url: this.GetUrl('/OrderRepairs/GetObject?Id='+id),
            success: function(data){
                this.ObjsId = id;
                this.ObjTypeId = data.objtypeid;
                this.txInvNo.textbox("setText", data.invno);
                this.txObject.textbox("setText", data.name);
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    // Форматер и парсер для Datebox
    formatter(date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        return (d < 10 ? ('0' + d) : d) + '.'
            + (m < 10 ? ('0' + m) : m) + '.'
            + y.toString();
    }

    parser(s) {
        if (!s) return new Date();
        var ss = (s.split('.'));
        var y = parseInt(ss[2], 10);
        var m = parseInt(ss[1], 10);
        var d = parseInt(ss[0], 10);
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
            return new Date(y, m - 1, d);
        } else {
            return new Date();
        }
    }

    /**
     * Получить пользователя
     * @constructor
     */
    GetUser() {
        $.ajax({
            method: "GET",
            url:this.GetUrl('/OrderRepairs/GetUser'),
            success: function(data){
                this.User = data;
                this.InitUserId = data.id;

                if(this.StartParams.orderid != -1) {
                    this.LoadData();
                }
                else {
                    this.txName.textbox("setText", data.username);
                    this.txDepCode.textbox("setText", data.depcode + ' = ' + data.depname);
                    this.dbOrderDate.datebox("setValue", this.GetToday());
                    this.dbCloseOrderDate.datebox("setValue", this.GetToday());

                    this.LoadcmbStatus();

                    this.GetMaxOrderNumber(this.dbOrderDate.datebox("getValue"))
                        .then((data) => { this.txOrderNumber.textbox("setText", data); })
                        .catch((data) => { this.ShowErrorResponse(data.responseJSON); });

                    this.GetListSttsOrder();
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Получить текущую дату
     * @returns {string}
     * @constructor
     */
    GetToday() {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = dd + '.' + mm + '.' + yyyy;
        return today;
    }

    /**
     * Спрятать все поля
     * @constructor
     */
    InviseFields(){
        this.btnName.linkbutton({disabled: true});
        this.btnObject.linkbutton({disabled: true});
        this.btnExecutive.linkbutton({disabled: true});
        this.btnProblems.linkbutton({disabled: true});

        this.chkCloseOrderDate.checkbox({disabled: true});

        this.txOrderNumber.textbox({disabled: true});
        this.txProblemDescr.textbox({disabled: true});
        this.txProblemSolutionDescr.textbox({disabled: true});
        this.txCost.textbox({disabled: true});
        this.txDepCode.textbox({disabled: true});
        this.txInvNo.textbox({disabled: true});

        this.cmbStts.combobox("disable");

        this.dbCloseOrderDate.datebox("disable");
        this.dbOrderDate.datebox("disable");

        this.pnName.css("visibility", "hidden");
        this.pnExecutive.css("visibility", "hidden");
        this.pnProblemCode.css("visibility", "hidden");
        this.pnStts.css("visibility", "hidden");
        this.pnObject.css("visibility", "hidden");
        this.pnOrderNumber.css("visibility", "hidden");
        this.pnOrderDate.css("visibility", "hidden");
        this.pnProblemSolutionDescr.css("visibility", "hidden");
        this.pnProblemDescr.css("visibility", "hidden");
        this.pnDepCode.css("visibility", "hidden");
        this.pnInvNo.css("visibility", "hidden");
        this.pnCloseOrderDate.css("visibility", "hidden");
        this.pnCost.css("visibility", "hidden");
    }

    /**
     * Настроить доступность\видимость полей
     * @constructor
     */
    AdoptFields(ListSttsOrder) {
        if (ListSttsOrder == null) {
            return;
        }

        this.InviseFields();

        for(let i = 0; i < ListSttsOrder.length; i++){
            let isenable = ListSttsOrder[i].isenable;
            let isvisible = ListSttsOrder[i].isvisible;
            let orderfieldcode = ListSttsOrder[i].orderfieldcode;

            // Номер заявки
            if(orderfieldcode == "02") {
                if(this.pnOrderNumber.css("visibility") == "hidden") {
                    this.pnOrderNumber.css("visibility", isvisible == 1 ? "visible" : "hidden");
                }
            }
            // Дата
            else if(orderfieldcode == "03") {
                if(this.dbOrderDate.datebox('options').disabled) {
                    isenable ? this.dbOrderDate.datebox("enable") : this.dbOrderDate.datebox("disable");
                }

                if(this.pnOrderDate.css("visibility") == "hidden") {
                    this.pnOrderDate.css("visibility", isvisible == 1 ? "visible" : "hidden");
                }
            }
            // Объект
            else if(orderfieldcode == "04") {
                if(this.btnObject.linkbutton('options').disabled) {
                    this.btnObject.linkbutton({disabled: isenable == 1 ? false : true});
                }

                if(this.pnObject.css("visibility") == "hidden") {
                    this.pnObject.css("visibility", isvisible == 1 ? "visible" : "hidden");
                }
            }
            // Инициатор
            else if (orderfieldcode == "05") {
                if(this.pnName.css("visibility") == "hidden") {
                    this.pnName.css("visibility", isvisible == 1 ? "visible" : "hidden");
                }

                if(this.btnName.linkbutton('options').disabled) {
                    this.btnName.linkbutton({disabled: isenable == 1 ? false : true});
                }
            }
            // Исполнитель
            else if(orderfieldcode == "06") {
                if(this.btnExecutive.linkbutton('options').disabled) {
                    this.btnExecutive.linkbutton({disabled: isenable == 1 ? false : true});
                }

                if(this.pnExecutive.css("visibility") == "hidden") {
                    this.pnExecutive.css("visibility", isvisible == 1 ? "visible" : "hidden");
                }
            }
            // Проблема
            else if(orderfieldcode == "07") {
                if(this.txProblemDescr.textbox('options').disabled) {
                    this.txProblemDescr.textbox({disabled: isenable == 1 ? false : true});
                }

                if(this.pnProblemDescr.css("visibility") == "hidden") {
                    this.pnProblemDescr.css("visibility", isvisible == 1 ? "visible" : "hidden");
                }
            }
            // Код проблемы
            else if(orderfieldcode == "08") {
                if(this.btnProblems.linkbutton('options').disabled) {
                    this.btnProblems.linkbutton({disabled: isenable == 1 ? false : true});
                }

                if(this.pnProblemCode.css("visibility") == "hidden") {
                    this.pnProblemCode.css("visibility", isvisible == 1 ? "visible" : "hidden");
                }
            }
            // Описание решения проблемы
            else if(orderfieldcode == "09") {
                if(this.txProblemSolutionDescr.textbox('options').disabled) {
                    this.txProblemSolutionDescr.textbox({disabled: isenable == 1 ? false : true});
                }

                if(this.pnProblemSolutionDescr.css("visibility") == "hidden") {
                    this.pnProblemSolutionDescr.css("visibility", isvisible == 1 ? "visible" : "hidden");
                }
            }
            // Стоимость
            else if(orderfieldcode == "10") {
                if(this.txCost.textbox('options').disabled) {
                    this.txCost.textbox({disabled: isenable == 1 ? false : true});
                }

                if(this.pnCost.css("visibility") == "hidden") {
                    this.pnCost.css("visibility", isvisible == 1 ? "visible" : "hidden");
                }
            }
            // Статус
            else if(orderfieldcode == "11") {
                if(this.cmbStts.combobox('options').disabled) {
                    if(this.CurrentStatus == 0 && (this.WorkUserId == -1 || this.txExecutive.textbox("getText").length < 1) && this.pnExecutive.css("visibility") == "visible"
                        && !this.btnExecutive.linkbutton("options").disabled) {
                        this.cmbStts.combobox("disable");
                    } else {
                        isenable ? this.cmbStts.combobox("enable") : this.cmbStts.combobox("disable");
                    }
                }

                if(this.pnStts.css("visibility") == "hidden") {
                    this.pnStts.css("visibility", isvisible == 1 ? "visible" : "hidden");
                }
            }
            // Дата закрытия заявки
            else if(orderfieldcode == "12") {

                if(this.chkCloseOrderDate.checkbox("options").disabled) {
                    isenable == 1 ? this.chkCloseOrderDate.checkbox("enable") : this.chkCloseOrderDate.checkbox("disable");
                }

                if(this.dbCloseOrderDate.datebox("options").disabled) {
                    isenable == 1 && this.chkCloseOrderDate.checkbox("options").checked ? this.dbCloseOrderDate.datebox("enable") : this.dbCloseOrderDate.datebox("disable");
                }

                if(this.pnCloseOrderDate.css("visibility") == "hidden") {
                    this.pnCloseOrderDate.css("visibility", isvisible == 1 ? "visible" : "hidden");
                }
            }
            // Код подразделения
            else if(orderfieldcode == "17") {
                if(this.txDepCode.textbox('options').disabled) {
                    this.txDepCode.textbox({disabled: isenable == 1 ? false : true});
                }

                if(this.pnDepCode.css("visibility") == "hidden") {
                    this.pnDepCode.css("visibility", isvisible == 1 ? "visible" : "hidden");
                }
            }
            // Инвентарный номер
            else if(orderfieldcode == "18") {

                if(this.txInvNo.textbox('options').disabled) {
                    this.txInvNo.textbox({disabled: isenable == 1 ? false : true});
                }

                if(this.pnInvNo.css("visibility") == "hidden") {
                    this.pnInvNo.css("visibility", isvisible == 1 ? "visible" : "hidden");
                }
            }
        }

        if(this.CurrentStatus == 0) {
            this.txPhone.textbox({disabled: false});
        }
        else {
            this.txPhone.textbox({disabled: true});
        }


        this.btnOk.linkbutton({disabled: !this.StartParams.lockstate });
    }

    /**
     * Получить доп. реквизит (телефон)
     * @returns {Promise<unknown>}
     * @constructor
     */
    GetIdListparams() {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "GET",
                url: this.GetUrl('/OrderRepairs/GetIdListparams?ParamCode=user_phone&TaskCode=orders'),
                success: function (data) {
                    resolve(data);
                }.bind(this),
                error: function (data) {
                    reject(data);
                }.bind(this)
            })
        });
    }

    /**
     * Изменяем формат даты с dd.mm.yyyy на dd/mm/yyyy
     * @param date
     * @returns {number}
     * @constructor
     */
    ChangeFormatDate(date) {
        let myDate = date;
        myDate = myDate.split(".");
        let newDateBeg = myDate[1] + "/" + myDate[0] + "/" + myDate[2];
        return newDateBeg;
    }

    /**
     * Закрытие формы
     * @returns {Promise<boolean>}
     */
    async btnOk_onClick() {
        try {
            let id = this.StartParams.orderid;
            let phone = this.txPhone.textbox("getText");
            let executive = this.txExecutive.textbox("getText");
            let probleminfo = this.txProblemDescr.textbox("getText");
            let orderdate = this.dbOrderDate.datebox("getValue");
            let closedate = "";
            let cost = this.txCost.textbox("getText").trim().split(' ').join('');
            let workinfo = this.txProblemSolutionDescr.textbox("getText");
            let ordernumber = -1;
            let inituserid = -1;
            let workuserid = -1;
            let val = "";

            this.ParamId = await this.GetIdListparams();

            if (this.ObjsId == -1) {
                this.ShowToolTip("#divtbObject_Module_OrderRepairs", "Обьект не выбран! Заявка не может быть сохранена.", {position: 'right'});
                return false;
            }

            if (executive.length < 1 && this.pnExecutive.css("visibility") == "visible" && !this.btnExecutive.linkbutton("options").disabled) {
                this.ShowToolTip("#divtbExecutive_Module_OrderRepairs", "Исполнитель не выбран! Заявка не может быть сохранена.", {position: 'right'});
                return false;
            }

            this.CheckPropsAdditional()
                .then((data) => {
                    this.lpM = data;
                })
                .catch((data) => {
                    this.ShowErrorResponse(data.responseJSON);
                });

            if (this.ProblemId == -1 && this.pnProblemCode.css("visibility") == "visible" && !this.btnProblems.linkbutton("options").disabled) {
                this.ShowToolTip("#divtbProblems_Module_OrderRepairs", "Выберите пожалуйста код проблемы \"Код проблемы\"", {position: 'right'});
                return false;
            }

            if (workinfo.length < 1 && this.pnProblemSolutionDescr.css("visibility") == "visible" && !this.txProblemSolutionDescr.textbox("options").disabled && (this.CurrentStatus == 3 || this.CurrentStatus == -1)) {
                this.ShowToolTip("#divtbProblemSolutionDescr_Module_OrderRepairs", "Заполните поле \"Описание решения проблемы\"", {position: 'right'});
                return false;
            } else if (workinfo.length > 0 && this.pnProblemSolutionDescr.css("visibility") == "visible" && !this.txProblemSolutionDescr.textbox("options").disabled && this.CurrentStatus != 3 && this.CurrentStatus != -1) {
                this.ShowToolTip("#divtbProblemSolutionDescr_Module_OrderRepairs", "Поле \"Описание решения проблемы\" не может быть заполнено для текущего статуса", {position: 'right'});
                return false;
            }

            if (this.pnCloseOrderDate.css("visibility") == "visible" && !this.chkCloseOrderDate.checkbox("options").disabled && !this.chkCloseOrderDate.checkbox("options").checked && (this.CurrentStatus == 3 || this.CurrentStatus == -1)) {
                this.ShowToolTip("#divtbCloseOrderDate_Module_OrderRepairs", "Поставьте галочку напротив поля \"Дата закрытия заявки\", оно является обязательным для текущего статуса");
                return false;
            } else if (this.pnCloseOrderDate.css("visibility") == "visible" && !this.chkCloseOrderDate.checkbox("options").disabled && this.chkCloseOrderDate.checkbox("options").checked && this.CurrentStatus != 3 && this.CurrentStatus != -1) {
                this.ShowToolTip("#divtbCloseOrderDate_Module_OrderRepairs", "Поле \"Дата закрытия заявки\" не может быть заполнено для текущего статуса");
                return false;
            }

            let CloseOrderDate = this.ChangeFormatDate(this.dbCloseOrderDate.datebox("getValue"));
            let OrderDate = this.ChangeFormatDate(orderdate);
            if ((this.CurrentStatus == 3 || this.CurrentStatus == -1) && CloseOrderDate < OrderDate
                && this.pnCloseOrderDate.css("visibility") == "visible" && !this.dbCloseOrderDate.datebox("options").disabled) {
                this.ShowToolTip("#divtbCloseOrderDate_Module_OrderRepairs", "Дата закрытия заявки не может быть меньше, чем дата открытия заявки!");
                return false;
            }

            if (this.InitUserId == -1) {
                inituserid = this.User.id;
            } else {
                inituserid = this.InitUserId;
            }

            if (this.WorkUserId != -1) {
                workuserid = this.WorkUserId;
            }

            if (this.StartParams.orderid == -1) {
                ordernumber = await this.GetMaxOrderNumber(this.dbOrderDate.datebox("getValue"));
                this.CurrentStatus = 0;
            } else {
                ordernumber = this.txOrderNumber.textbox("getText");
            }

            if (phone.length > 0) {
                val = phone;
            }

            if ((this.CurrentStatus == 3 || this.CurrentStatus == -1) && this.chkCloseOrderDate.checkbox("options").checked) {
                closedate = this.dbCloseOrderDate.datebox("getValue");
            }

            let problemid = -1;
            if (this.ProblemId != -1) {
                problemid = this.ProblemId;
            }

            if (ordernumber == -1) {
                return false;
            }


            let obj = {
                id: id,
                ordertypeid: this.StartParams.ordertype,
                no: ordernumber,
                date: orderdate,
                objsid: this.ObjsId,
                inituserid: inituserid,
                workuserid: workuserid,
                amount: cost,
                problemid: problemid,
                probleminfo: probleminfo,
                workinfo: workinfo,
                closedate: closedate,
                stts: this.CurrentStatus,
                val: val,
                paramid: this.ParamId,
                idval: this.IdVal
            };

            this.Save(obj);
        } catch (error) {
            this.ShowErrorResponse(error.responseJSON);
        }
    }

    /**
     * Сохранение заявки
     * @param obj
     * @constructor
     */
    Save(obj){
        $.ajax({
            method:"POST",
            data: JSON.stringify(obj),
            url: this.GetUrl('/OrderRepairs/Save'),
            contentType: "application/json; charset=utf-8",
            success: function(id){
                if(this.ResultFunc != null)
                {
                    this.wOrderRepairsForm.window("close");
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Получить следующий номер заявки
     * @param orderDate
     * @returns {Promise<unknown>}
     * @constructor
     */
    GetMaxOrderNumber(orderDate){
                return new Promise((resolve, reject) => {
            $.ajax({
                method: "GET",
                url: this.GetUrl('/OrderRepairs/GetMaxOrderNumber?Date=' + orderDate),
                success: function (data) {
                    resolve(data);
                }.bind(this),
                error: function (data) {
                    reject(data);
                }.bind(this)
            })
        });
    }

    /**
     * Получить флаг обязательности доп. реквезита
     * @returns {Promise<unknown>}
     * @constructor
     */
    CheckPropsAdditional() {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "GET",
                url: this.GetUrl('/OrderRepairs/CheckPropsAdditional?ParamCode=user_phone&TaskCode=orders'),
                success: function (data) {
                    resolve(data);
                }.bind(this),
                error: function (data) {
                    reject(data);
                }.bind(this)
            })
        });
    }
    
    GetListSttsOrder() {
        $.ajax({
            method: "GET",
            url:this.GetUrl('/OrderRepairs/GetListSttsOrder?OrderTypeId=' + this.StartParams.ordertype + '&Stts=' + this.CurrentStatus),
            success: function(data){
                this.AdoptFields(data);
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Загрузить данные заявки на форму
     * @constructor
     */
    LoadData() {
        $.ajax({
            method: "GET",
            url: this.GetUrl('/OrderRepairs/GetRec?OrderId='+this.StartParams.orderid),
            success: function(data){
                this.dbOrderDate.datebox("setValue", data.date);
                this.txOrderNumber.textbox("setText", data.no);
                this.txObject.textbox("setText", data.objsname);
                this.txName.textbox("setText", data.username);
                this.txDepCode.textbox("setText", data.depcode);
                this.txInvNo.textbox("setText", data.invno);
                this.txExecutive.textbox("setText", data.executive);
                this.txPhone.textbox("setText", data.val == null ? "" : data.val);
                this.IdVal = data.idval;
                this.txCost.textbox("setText", data.amount.substring(0, data.amount.length - 1).trim());
                this.ProblemId = data.problemid != null ? data.problemid : -1;
                this.txProblemDescr.textbox("setText", data.probleminfo);
                this.txProblemSolutionDescr.textbox("setText", data.workinfo);
                this.CurrentStatus = data.stts;
                if(data.closedate != null) {
                    this.dbCloseOrderDate.datebox("setValue", data.closedate);
                    this.chkCloseOrderDate.checkbox("check");
                }
                else {
                    this.dbCloseOrderDate.datebox("setValue", this.GetToday());
                }

                this.txCreator.textbox("setText", data.creator);
                this.txCreated.textbox("setText", data.created);
                this.txChanger.textbox("setText", data.changer);
                this.txChanged.textbox("setText", data.changed);

                this.ObjsId = data.objsid;
                this.WorkUserId = data.workuserid == null ? -1 : data.workuserid;
                this.InitUserId = data.inituserid == 0 ? -1 : data.inituserid;

                this.LoadcmbStatus();

                if(this.ProblemId > 0) {
                    this.GetProblem(this.ProblemId)
                        .then((result) => {
                            this.SetProblemCode(result);
                        })
                        .catch((error) => {
                            this.ShowErrorResponse(error.responseJSON);
                        });
                }

                this.GetListSttsOrder();

            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Загрузить данные в комбобокс статус
     * @constructor
     */
    LoadcmbStatus() {
        this.cmbStts.combobox({
            valueField: 'id',
            textField: 'name',
            data: this.StatusData
        });

        if (this.CurrentStatus != null) {
            for (let i = 0; i < this.StatusData.length; i++) {
                let stts = this.StatusData[i];
                if (stts.flag == this.CurrentStatus) {
                    this.cmbStts.combobox("setValue", this.StatusData[i].id);
                }
            }
        }

        if (this.StartParams.orderid == -1){
            this.cmbStts.combobox("setValue", 1);
        }
    }

}


export function StartModalModul(StartParams, ResultFunc) {
    let id = "wOrderRepairsForm_Module_OrderRepairs";

    let form = new OrderRepairs("", StartParams);
    form.SetResultFunc(ResultFunc);
    form.Start(id);
}


