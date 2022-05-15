import {FormView} from "../Core/FormView.js";

/**
 * Основной класс модуля
 */
class
OrderMov extends FormView {
    /**
     * Конструктор
     * @param prefix - приставка для идентификаторов. Данная приставка добавится для каждого идентификатора
     * @param StartParams - стартовые параметры в формате JSON
     */
    constructor(prefix, StartParams) {
        super();//Вызов контруктора у родительского класса
        this.StartParams = StartParams; //Стартовые параметры в формате JSON
        this.orderid = -1;
        this.okstate = false;

        //---переменные для контроля(что бы пользователь не получил право редактирования полей просто при смене значения комбобокса)
        this.sttsonstart = -1; //статус заявки при загрузке
        this.initonstart = ""; //инициатор при загрузке
        this.solveronstart = "";//исполнитель при загрузке
        this.roomfromonstart = "";
        this.roomtoonstart = "";
        this.dateonstart = "";//дата документа на момент открытия
        this.noonstart = "";
        this.storedobjcts = [];
        this.givetoonstart = "";
        //----
        this.initid = -1;
        this.solverid = -1;
        this.fromroom = -1;
        this.toroom = -1;
        this.objects = [];
        this.saveM = {};
        this.objid = -1;
        this.chmodel = {};
        this.options = {};
        this.retid = -1;
        this.permitsdata = {};
        this.ordertypeid = -1;
        this.ordertypecode="";


        //this.options={ AddMode:false, editMode: editMode, lockMessage:'', lockState: false}
    }

    /**
     * Функция загрузки формы
     * @param id - идентификатор эелемента HTML, в который будет загружена разметка частичного представления
     * @constructor
     */
    Start(id) {
        this.ModuleId = id;
        //Загружаем макет формы и выполняем  функци InitFunc в случае успеха
        LoadForm("#ModalWindows", this.GetUrl("/OrderMov/OrderMovFormList"), this.InitFunc.bind(this));

    }


    /**
     * Функция инициализации пользовательского интерфейса
     * @constructor
     */
    InitFunc() {
        this.InitComponents(this.ModuleId, ""); //Автоматическое получение идентификаторов формы
        this.InitCloseEvents(this.wOrderMov);//Инициализация закрытия формы по нажатию на клавиши "ESC" и "Enter"
        AddKeyboardNavigationForGrid(this.dgOrderMov); //Добавляем в датагрид возможность навигации с помощью стрлочек
        this.SetCloseWindowFunction((options) => {
            this.ResultFunc({
                orderid: this.retid,
                lockstate: this.StartParams.lockstate,
                okstate: this.okstate
            });
        });

        this.dtDate.datebox({
            formatter: function (date) {
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                var d = date.getDate();
                return (d < 10 ? ('0' + d) : d) + '.'
                    + (m < 10 ? ('0' + m) : m) + '.'
                    + y.toString();

            },
            //парсим дату так как из бд дата в одном формате, в самом пикере дата в другом  а должна бить в третьем
            //'-' разделитель из БД
            //'/' разделитель стандартный в тайм пикере
            //'.' разделитель который должен отображаться
            parser: function (s) {
                if (!s) return new Date();
                s = s.substring(0, 10);
                var ss = s.indexOf('-') != -1 ? (s.split('-')) : s.indexOf('/') != -1 ? (s.split('/')) : s.split('.');
                if (s.indexOf('-') != -1) {
                    var y = parseInt(ss[0], 10);
                    var m = parseInt(ss[1], 10);
                    var d = parseInt(ss[2], 10);
                }

                if (s.indexOf('/') != -1) {
                    var m = parseInt(ss[0], 10);
                    var d = parseInt(ss[1], 10);
                    var y = parseInt(ss[2], 10);
                }

                if (s.indexOf('.') != -1) {
                    var d = parseInt(ss[0], 10);
                    var m = parseInt(ss[1], 10);
                    var y = parseInt(ss[2], 10);
                }
                if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
                    return new Date(y, m - 1, d);
                } else {
                    return new Date();
                }
            }
        });

        this.cbStatus.combobox({onChange: this.cbStatus_onChange.bind(this)});
        this.btnInit.linkbutton({onClick: this.btnInit_onClick.bind(this)});
        this.btnSolver.linkbutton({onClick: this.btnSolver_onClick.bind(this)});
        this.btnFromRoom.linkbutton({onClick: this.btnFromRoom_onClick.bind(this)});
        this.btnToRoom.linkbutton({onClick: this.btnToRoom_onClick.bind(this)});
        this.btnAdd.linkbutton({onClick: this.btnAdd_onClick.bind(this)});
        this.btnChange.linkbutton({onClick: this.btnChange_onClick.bind(this)});
        this.btngiveto.linkbutton({onClick: this.btngiveto_onClick.bind(this)});
        this.btnDelete.linkbutton({onClick: this.btnDelete_onClick.bind(this)});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnClear.linkbutton({onClick: this.btnClear_onClick.bind(this)});
        this.btnCancel.linkbutton({onClick: this.btnCancel_onClick.bind(this)});

        this.FillCombobox();
        this.ParseParams();
        this.txId.textbox("setText", -1);
        this.getusername();
        this.cbStatus.combobox("setValue", 0);
        this.setCurrentDate();
        //если заявка новая
        if (this.orderid == -1) {
            if (this.ordertypecode == '07') {
                this.lblHeader.html("Новая заявка на перезакрепление")
                this.RowFromRoom.css("visibility", "hidden");
                this.getNo(this.dtDate.datebox("getText"));
            } else {
                this.lblHeader.html("Новая заявка на перемещение")
                this.blockGiveTo.css("visibility", "hidden");
                this.getNo(this.dtDate.datebox("getText"));
            }
            this.SetPermits(-1);
        }
        //если заявка на редактировании
        else {
            if (this.ordertypecode == '06') {
                this.lblHeader.html("Редактирование заявки на перемещение")
                this.LoadGrid();
            } else {
                this.lblHeader.html("Редактирование заявки на перезакрепление")
                this.LoadGrid();
            }
        }
        this.options.AddMode = true;
        this.options.EditMode = true;
    }

    //Установить текущую дату
    setCurrentDate() {
        let currentDate = new Date();

        let year = currentDate.getFullYear(); // 2020
        let month = currentDate.getMonth() + 1; // 0-11
        let day = currentDate.getDate(); // 1-31

        let fullDate = day + '.' + month + '.' + year;
        this.dtDate.datebox("setValue", fullDate);
    }


    /**
     * получает name из указанной таблицы в виде "id = название"
     * @param textBox
     * @param table
     * @param id
     */
    universalData(textBox, table, id) {
        $.ajax({
            method: "get",
            url: this.GetUrl('/OrderMov/universalDataAcquisition?table=' + table + "&id=" + id),
            success: function (data) {
                textBox.textbox("setText", data);
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * проверка номера заявки
     * @constructor
     */
    CheckOrderNo() {
        if (this.orderid == -1 || this.noonstart != this.txNumber.textbox("getText").replace(/\s/g, "")) {
            $.ajax({
                method: "get",
                url: this.GetUrl('/OrderMov/checkno?orderno=' + this.txNumber.textbox("getText").replace(/\s/g, "") + "&date=" + this.dtDate.datebox("getText")),
                success: function (data) {
                    if (data != "") {
                        $.messager.confirm("Внимание!", "Заявка с номером " + this.txNumber.textbox("getText").replace(/\s/g, "") + " уже существует. Проставить номер автоматически?",
                            function (result) {
                                if (result) {
                                    this.getNo(this.dtDate.datebox("getText"));
                                    this.CheckObjDate();
                                }
                                return false;
                            }.bind(this));
                    } else {
                        this.CheckObjDate();
                    }
                }.bind(this),
                error: function (data) {
                    this.ShowErrorResponse(data.responseJSON);
                    return false;
                }.bind(this)
            });
        } else {
            this.CheckObjDate();
        }


    }

    /**
     * проверяем поля на заполненность
     * @returns {boolean}
     * @constructor
     */
    CheckData() {

        if (this.txNumber.textbox("getText").replace(/\s/g, "") == "") {
            this.ShowToolTip("#divtbNo_Module_OrderMov", "Заполните поле \"Номер\"", {
                icon: 'icon-no',
                title: 'Ошибка',
                position: 'bottom',
                delay: 5000
            });
            return false;
        }


        if (this.tbInit.textbox("getText").replace(/\s/g, "") == "") {
            this.ShowToolTip("#divtbInit_Module_OrderMov", "Заполните поле \"Инициатор\"", {
                icon: 'icon-no',
                title: 'Ошибка',
                position: 'bottom',
                delay: 5000
            });
            return false;
        }

        if (this.tbgiveto.textbox("getText").replace(/\s/g, "") == "" && this.ordertypecode == '07') {
            this.ShowToolTip("#divtbgiveto_Module_OrderMov", "Заполните поле \"Закрепить за\"", {
                icon: 'icon-no',
                title: 'Ошибка',
                position: 'bottom',
                delay: 5000
            });
            return false;
        }

        if ((this.cbStatus.combobox("getValue") != 0) && (this.tbSolver.textbox("getText").replace(/\s/g, "") == "") && (this.ordertypecode != '07')) {
            let sq = this.tbSolver.textbox("getText");
            this.ShowToolTip("#divtbSolver_Module_OrderMov", "Заполните поле \"Исполнитель\"", {
                icon: 'icon-no',
                title: 'Ошибка',
                position: 'bottom',
                delay: 5000
            });
            return false;
        }

        if ((this.tbFromRoom.textbox("getText").replace(/\s/g, "") == "") && (this.ordertypecode != '07')) {
            this.ShowToolTip("#divtbFromRoom_Module_OrderMov", "Заполните поле \"Из кабинета\"", {
                icon: 'icon-no',
                title: 'Ошибка',
                position: 'bottom',
                delay: 5000
            });
            return false;
        }

        if ((this.txToRoom.textbox("getText").replace(/\s/g, "") == "") && (this.ordertypecode != '07')) {
            this.ShowToolTip("#divtxToRoom_Module_OrderMov", "Заполните поле \"В кабинет\"", {
                icon: 'icon-no',
                title: 'Ошибка',
                position: 'bottom',
                delay: 5000
            });
            return false;
        }

        if (this.txToRoom.textbox("getText") == this.tbFromRoom.textbox("getText") && (this.ordertypecode != '07')) {
            this.ShowToolTip("#divtxToRoom_Module_OrderMov", "Нельзя переместить в тот же кабинет!", {
                icon: 'icon-no',
                title: 'Ошибка',
                position: 'bottom',
                delay: 5000
            });
            return false;
        }

        //цикл для поиска кол-ва удаленных записей что бы при удалении всех записей из грида нельзя было сохранить
        let c = 0;
        for (let i = 0; i < this.objects.length; i++) {
            if (this.objects[i].del == 1) {
                c++;
            }
        }

        if (this.objects.length == 0 || (this.objects.length == c)) {
            let error = "";
            if (this.ordertypecode == '07') {
                error = "Добавьте объекты для перезакрепления!";
            } else {
                error = "Добавьте объекты для перемещения!";
            }
            this.ShowToolTip("#divbtnAdd_Module_OrderMov", error, {
                icon: 'icon-no',
                title: 'Ошибка',
                position: 'top',
                delay: 5000
            });
            return false;
        }
        if (this.sttsonstart != this.cbStatus.combobox("getValue")) {
            this.saveM.sttschange = 1;
        }
        if (this.ordertypecode == '06') {
            if (this.noonstart != this.txNumber.textbox("getText") ||
                this.dateonstart != this.dtDate.datebox("getValue") || this.initonstart != this.tbInit.textbox("getText") ||
                this.solveronstart != this.tbSolver.textbox("getText") || this.roomfromonstart != this.tbFromRoom.textbox("getText") ||
                this.roomtoonstart != this.txToRoom.textbox("getText")) {
                for (let i = 0; i < this.objects.length; i++) {
                    this.objects[i].changed = 1;
                }
            }
        } else {
            if (this.noonstart != this.txNumber.textbox("getText") ||
                this.dateonstart != this.dtDate.datebox("getValue") || this.initonstart != this.tbInit.textbox("getText")||
                this.givetoonstart!= this.tbgiveto.textbox("getText")) {
                for (let i = 0; i < this.objects.length; i++) {
                    this.objects[i].changed = 1;
                }
            }
        }


        this.CheckOrderNo();
    }


    CheckObjOwner() {
        let result = false;
        try {
            $.ajax({
                method: "post",
                data: JSON.stringify(this.objects),
                url: this.GetUrl("/OrderMov/checkobjowner"),
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    result = data;
                }.bind(this),
                error: function (data) {
                    this.ShowErrorResponse(data.responseJSON);
                }.bind(this)
            });
        } catch (e) {
            this.ShowError(e);
            return false;
        }
        return result;
    }

    /**
     * вносим данные в модель для сохранения
     * @returns {boolean}
     * @constructor
     */
    PrepareModel() {
        this.saveM.ordertypecode = this.ordertypecode;
        this.saveM.ordertypeid = this.ordertypeid;
        this.saveM.no = this.txNumber.textbox("getText");
        this.saveM.date = this.dtDate.datebox("getValue");
        this.saveM.inituserid = this.tbInit.textbox("getText").substr(0, this.tbInit.textbox("getText").indexOf('='));
        this.saveM.info = this.txNotice.textbox("getText");
        this.saveM.stts = this.cbStatus.combobox("getValue");
        this.saveM.ordertypecode=this.ordertypecode;
        let dates = new Date();
        this.saveM.pvdate = this.dtDate.datebox("getValue") + " " + dates.getHours() + ":" + dates.getMinutes() + ":" + dates.getSeconds();
        if (this.ordertypecode == '06') {
            this.saveM.workuserid = this.cbStatus.combobox("getValue") != 0 ? this.tbSolver.textbox("getText").substr(0, this.tbSolver.textbox("getText").indexOf('=')) : -1;
            let fromRoom = this.tbFromRoom.textbox("getText").substr(0, this.tbFromRoom.textbox("getText").indexOf('='));
            this.saveM.fromroom = fromRoom.trim();
            let toRoom = this.txToRoom.textbox("getText").substr(0, this.txToRoom.textbox("getText").indexOf('='));
            this.saveM.toroom = toRoom.trim();
        } else {
            this.saveM.giveto = this.tbgiveto.textbox("getText").substr(0, this.tbgiveto.textbox("getText").indexOf('='));
            this.saveM.workuserid =  -1;
        }

    }

    /**
     * проверяем дату всех объектов
     * @constructor
     */
    CheckObjDate() {
        let chmodel = {};
        let result = "";
        chmodel.date = this.dtDate.datebox("getValue");
        chmodel.objlist = this.objects;
        try {
            $.ajax({
                method: "post",
                data: JSON.stringify(chmodel),
                url: this.GetUrl("/OrderMov/checkobjdate"),
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    if (data != '') {
                        this.ShowError(data);
                    } else {
                        if (this.ordertypecode == '06') {
                            this.CheckLocation(-1, true);
                        } else {
                            this.CheckDate(this.dtDate.datebox("getValue"));
                        }
                    }
                }.bind(this),
                error: function (data) {
                    this.ShowErrorResponse(data.responseJSON);
                }.bind(this)
            });
        } catch (e) {
            this.ShowError(e);
            return false;
        }
        if (result != "" && result != null) {
            this.ShowError(result);
            return false;
        }
        return true;
    }

    /**
     *проверяем открыт ли день с выбранной датой     *
     * @returns {number}
     * @constructor
     */
    CheckDate(date) {
        let checked = 0;
        $.ajax({
            method: "get",
            url: this.GetUrl("/OrderMov/checkdate?date=" + date + "&dateonstart=" + this.dateonstart),
            success: function (data) {
                if (data != "") {
                    this.ShowToolTip("#divdtDate_Module_OrderMov", data, {
                        icon: 'icon-no',
                        title: 'Ошибка',
                        position: 'right',
                        delay: 5000
                    });
                    return;
                } else {
                    this.btnOKContinue();
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
        return checked;
    }

    btnCancel_onClick() {
        if (this.ResultFunc != null) {
            this.ResultFunc({okstate: false});
        }
        this.wOrderMov.window("close");
    }

    btnOKContinue() {
        //заполняем модель для сохранения общими данными
        this.PrepareModel();
        try {
            this.saveM.objlist = this.objects;
            $.ajax({
                method: "POST",
                data: JSON.stringify(this.saveM),
                url: this.GetUrl('/OrderMov/saveupdate'),
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    this.retid = data;
                    this.okstate = true;
                    // if (this.ResultFunc != null) {
                    //     this.ResultFunc({orderid: this.retid, okstate: true});
                    // }
                    this.wOrderMov.window("close");
                }.bind(this),
                error: function (data) {
                    this.ShowErrorResponse(data.responseJSON);
                }.bind(this)
            });
        } catch (e) {
            this.ShowError(e);
        }
        return false;
    }

    btnOk_onClick() {
        let sd = "";
        this.tmpobjlocat = "";
        //проверяем введенные данные
        if (!this.CheckData()) {
            return;
        }
    }

    btnClear_onClick() {
        this.tbSolver.textbox("setText", "");
    }

    btnInit_onClick() {
        try {
            StartModalModulGlobal("Users",

                "",
                ((data) => {
                    this.initid = data.id;
                    this.Checkinit(this.initid);

                }).bind(this));

        } catch (e) {
            this.ShowError(e);
        }
    }

    /**
     * проверяем имеет ли право пользователь выбрать такого инициатора
     * @param uid
     * @constructor
     */
    Checkinit(uid) {
        try {
            $.ajax({
                method: "get",
                url: this.GetUrl("/OrderMov/checkInit?uid=" + uid),
                success: function (data) {
                    if (data != "") {
                        this.ShowToolTip("#divtbInit_Module_OrderMov", "Невозможно выбрать пользователя " + data + " так как у вас нет на это прав.", {
                            icon: 'icon-no',
                            title: 'Ошибка',
                            position: 'bottom',
                            delay: 5000
                        });
                        this.getusername();
                    } else {
                        this.universalData(this.tbInit, 'Users', uid);
                    }
                }.bind(this),
                error: function (data) {
                    this.ShowErrorResponse(data.responseJSON);
                }.bind(this)

            });
        } catch (e) {
            this.ShowError(e);
        }
    }

    btngiveto_onClick() {
        try {
            StartModalModulGlobal("Users",
                "",
                ((data) => {
                    this.universalData(this.tbgiveto, 'Users', data.id);
                }).bind(this));
        } catch (e) {
            this.ShowError(e);
        }
    }

    btnAdd_onClick() {
        //проверяем заполнено ли поли из кабинета
        if (this.tbFromRoom.textbox("getText") == "" && this.ordertypecode != '07') {
            this.ShowToolTip("#divtbFromRoom_Module_OrderMov", "Заполните поле \"Из кабинета\"", {
                icon: 'icon-no',
                title: 'Ошибка',
                position: 'bottom',
                delay: 5000
            });
            return;
        }

        //-----------вызывается справочник объектов
        try {
            let objid = -1;
            let objlocat;
            StartModalModulGlobal("Objs",

                "",
                ((data) => {
                    if (this.ordertypecode == '07') {
                        this.GridWork(data.id);
                    } else {
                        this.CheckLocation(data.id);
                    }
                }).bind(this));

        } catch (e) {
            this.ShowError(e);
        }

        //this.GridWork(this.idlist[this.counter], false)
        //this.counter++;
    }

    /**
     * проверяем находится ли объект в выбранной комнате
     * @param objects
     * @param objid
     * @constructor
     */
    CheckLocation(objid, btnok, btnchange) {
        let objct = []
        let saveTMP = {};
        if (objid != -1) {
            let data = {"objid": objid, "orderid": -1};
            objct.push(data);
        } else {
            objct = JSON.parse(JSON.stringify(this.objects));
            for (let i = 0; i < objct.length; i++) {
                for (let a = 0; a < this.storedobjcts.length; a++) {
                    if (objct[i].objid == this.storedobjcts[a]) {
                        if (objct[i].orderid != -1 && objct[i].changed != 1 && objct.sttschange != 1) {
                            objct.splice(i, 1);
                        }
                    }
                }
            }
        }

        saveTMP.date = this.dtDate.datebox("getValue");
        saveTMP.fromroom = this.tbFromRoom.textbox("getText").substr(0, this.tbFromRoom.textbox("getText").indexOf('='));
        saveTMP.fromroom = saveTMP.fromroom.trim();
        saveTMP.objlist = objct;
        try {
            let result;
            $.ajax({
                method: "POST",
                data: JSON.stringify(saveTMP),
                url: this.GetUrl('/OrderMov/checklocat'),
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    if (!btnok) {
                        if (data != "") {
                            this.ShowError(data);
                        } else {
                            if (!btnchange) {
                                this.GridWork(objid);
                            } else {
                                this.GridWork(objid, true);
                            }
                        }
                    } else {
                        if (data != "") {
                            this.ShowError(data);
                        } else {
                            this.CheckDate(this.dtDate.datebox("getValue"));
                        }
                    }
                }.bind(this),
                error: function (data) {
                    this.ShowErrorResponse(data.responseJSON);
                }.bind(this)
            });
        } catch (e) {
            this.ShowError(e);
        }

    }


    /**
     * работа с гридом при обновлении и изменении записи
     * @param id
     * @param change
     * @constructor
     */
    GridWork(id, change) {
        let exist = 0;
        let listindex;

        for (let i = 0; i < this.objects.length; i++) {
            //если запись на изменении и objectid записи которая изменяется равна objectid из массива- запоминаем индекс массива
            if (change && this.chmodel.objid == this.objects[i].objid) {
                listindex = i;
            }
            //проверка есть ли уже этот объект в массиве
            if (this.objects[i].objid == id && this.objects[i].del != 1) {
                exist = 1;
            }
        }
        if (exist == 1) {
            this.ShowError("Выбранный объект уже существует!");
        } else {
            $.ajax({
                method: "get",
                url: this.GetUrl("/OrderMov/getobj?objid=" + id + "&date=" + this.dtDate.datebox("getValue")),
                success: function (data) {
                    if (!change) {
                        data.lvidto = -1;
                        data.lvidfrom = -1;
                        data.lvowner=-1;
                        this.objects.push(data);
                    } else {
                        this.objects[listindex].objid = data.objid;
                        this.objects[listindex].invno = data.invno;
                        this.objects[listindex].name = data.name;
                        this.objects[listindex].change = 1;
                    }
                    this.dgOrderMov.datagrid({data: this.ClearList()});
                }.bind(this),
                error: function (data) {
                    this.ShowErrorResponse(data.responseJSON);
                }.bind(this)

            });
        }

    }


    btnChange_onClick() {
        if (this.dgOrderMov.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для изменения");
            return false;
        }
        let selData = this.dgOrderMov.datagrid("getSelected");
        if (selData == null) {
            this.ShowWarning("Выберите запись для изменения");
            return false;
        }
        this.chmodel.objid = selData.objid;
        this.chmodel.orderid = selData.orderid;
        //-----------вызывается справочник объектов
        try {

            StartModalModulGlobal("Objs",

                "",
                ((data) => {
                    this.CheckLocation(data.id, false, true);//this.GridWork(data.id, true)
                }).bind(this));

        } catch (e) {
            this.ShowError(e);
        }
        //----------
        //this.GridWork(945, true);
    }

    btnDelete_onClick() {
        if (this.dgOrderMov.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для удаления");
            return false;
        }
        let selData = this.dgOrderMov.datagrid("getSelected");
        if (selData == null) {
            this.ShowWarning("Выберите запись для удаления");
            return false;
        }
        let listindex;
        for (let i = 0; i < this.objects.length; i++) {
            //если запись на изменении и objectid записи которая изменяется равна objectid из массива- запоминаем индекс массива
            if (selData.objid == this.objects[i].objid && this.objects[i].del != 1) {
                listindex = i;
                break;
            }
        }
        if (this.objects[listindex].orderid != -1) {
            if (this.objects[listindex].del != 1) {
                this.objects[listindex].del = 1;
            }
        } else {
            this.objects.splice(listindex, 1);
        }
        //this.dgOrderMov.datagrid({data: this.objects});
        this.dgOrderMov.datagrid({data: this.ClearList(selData.objid)});
    }

    /**
     * очищаем список от помеченых на удаление(что бы в гриде их не было)
     * @returns {[]}
     * @constructor
     */
    ClearList() {
        let newlist = [];
        for (let i = 0; i < this.objects.length; i++) {
            if (this.objects[i].del != 1) {
                newlist.push(this.objects[i]);
            }
        }
        return newlist;
    }


    btnSolver_onClick() {
        let uid;
        try {
            StartModalModulGlobal("Users",

                "",
                ((data) => {
                    this.solverid = data.id;
                    this.universalData(this.tbSolver, 'Users', data.id);
                }).bind(this));

        } catch (e) {
            this.ShowError(e);
        }
    }

    btnToRoom_onClick() {
        let uid;
        try {
            StartModalModulGlobal("Locations",

                "",
                ((data) => {
                    this.toroom = data.id;
                    this.universalData(this.txToRoom, 'Locations', data.id);
                }).bind(this));

        } catch (e) {
            this.ShowError(e);
        }
    }

    btnFromRoom_onClick() {
        let uid;
        try {
            StartModalModulGlobal("Locations",

                "",
                ((data) => {
                    this.fromroom = data.id;
                    this.universalData(this.tbFromRoom, 'Locations', data.id);
                }).bind(this));

        } catch (e) {
            this.ShowError(e);
        }
    }

    /**
     * получаем имя пользователя
     */
    getusername() {
        $.ajax({
            method: "get",
            url: this.GetUrl("/OrderMov/getusername"),
            success: function (data) {
                this.tbInit.textbox("setText", data);
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)

        });
    }

    /**
     * получаем номер для новой заявки
     */
    getNo() {
        $.ajax({
            method: "get",
            url: this.GetUrl("/OrderMov/getNo?date=" + this.dtDate.datebox("getValue")),
            success: function (data) {
                this.txNumber.textbox("setText", data);
                this.noonstart = this.txNumber.textbox("getText");
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * парсим параметры
     */
    ParseParams() {
        this.orderid = this.StartParams.orderid;
        this.ordertypeid = this.StartParams.ordertype;
        this.ordertypecode=this.StartParams.ordertypecode;
        if (this.StartParams.lockstate == false) {
            this.btnOk.linkbutton({disabled: true});
        }
    }

    /**
     * заполняет комбобокс статусами
     */
    FillCombobox() {
        this.cbStatus.combobox({
            valueField: "value",
            textField: "label",
            data: [{label: 'Новая', value: '0'}, {label: 'Исполнена', value: '3'}]
        })
    }

    /**
     * загружаем данные для редактирования
     * @constructor
     */
    LoadGrid() {
        $.ajax({
            method: "get",
            url: this.GetUrl('/OrderMov/GetData?orderid=' + this.orderid + "&date=" + this.dtDate.datebox("getValue")),
            success: function (data) {
                this.objects = data;
                this.dgOrderMov.datagrid({data});
                this.storeobjidonstart(data);
                if (this.dgOrderMov.datagrid("getRows").length != 0) {
                    this.GetDetails();//получаем доп информацию о заявке
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    storeobjidonstart(data) {
        for (let i = 0; i < data.length; i++) {
            this.storedobjcts.push(data[i].objid);
        }
    }

    /**
     * при изменении значения статуса
     */
    cbStatus_onChange() {
        this.SetPermits(this.permitsdata);
    }


    /**
     * скрываем поля в зависимости от статуса заявки
     */
    SetPermits(data) {

        this.tbSolver.textbox({disabled: false});
        this.txNumber.textbox({disabled: false});
        this.dtDate.datebox("enable");//{disabled: true}
        this.dtDate.linkbutton({disabled: false});
        this.btnInit.linkbutton({disabled: false});
        this.btnSolver.linkbutton({disabled: false});
        this.btnClear.linkbutton({disabled: false});
        this.btnFromRoom.linkbutton({disabled: false});
        this.btnToRoom.linkbutton({disabled: false});
        this.txNotice.textbox({disabled: false});
        this.btnAdd.linkbutton({disabled: false});
        this.btnChange.linkbutton({disabled: false});
        this.btnDelete.linkbutton({disabled: false});


        if (this.cbStatus.combobox("getValue") == 0) {
            this.lblSolver.css("visibility", "hidden");
            this.cellSolver.css("visibility", "hidden");
            this.btnSolver.css("visibility", "hidden");
            this.btnClear.css("visibility", "hidden");

            this.tbSolver.textbox({disabled: true});
            this.btnSolver.linkbutton({disabled: true});
            this.btnClear.linkbutton({disabled: true});
        } else {
            if (this.ordertypecode == '06') {
                this.lblSolver.css("visibility", "visible");
                this.cellSolver.css("visibility", "visible");
                this.btnSolver.css("visibility", "visible");
                this.btnClear.css("visibility", "visible");
            }
            else{
                this.lblSolver.css("visibility", "hidden");
                this.cellSolver.css("visibility", "hidden");
                this.btnSolver.css("visibility", "hidden");
                this.btnClear.css("visibility", "hidden");
            }
        }
        if (this.ordertypecode == '07') {
            //this.btnFromRoom.css("visibility", "hidden");
            //this.tbFromRoom.css("visibility", "hidden");
            this.RowFromRoom.css("visibility", "hidden");
            //this.workuserblock.css("visibility", "hidden");

        } else {
            this.blockGiveTo.css("visibility", "hidden");
        }
        if (data !== undefined && data !== null && this.orderid !== -1 && data.stts !== "0") {
            this.txNumber.textbox({disabled: true});
            this.dtDate.datebox("disable");
            this.dtDate.linkbutton({disabled: true});
            this.btnInit.linkbutton({disabled: true});
            this.btnSolver.linkbutton({disabled: true});
            this.btnClear.linkbutton({disabled: true});
            this.btnFromRoom.linkbutton({disabled: true});
            this.btnToRoom.linkbutton({disabled: true});
            this.txNotice.textbox({disabled: true});
            this.btnAdd.linkbutton({disabled: true});
            this.btnChange.linkbutton({disabled: true});
            this.btnDelete.linkbutton({disabled: true});
            this.btngiveto.linkbutton({disabled: true});
            this.tbgiveto.linkbutton({disabled: true});
        }
    }

    /**
     *получаем дополнительную информацию о заявке
     */
    GetDetails() {
        this.dgOrderMov.datagrid("selectRow", 0);
        let row = this.dgOrderMov.datagrid("getSelected");//получаем выбранную запись
        let id = row.orderid
        if (row != null) {

            $.ajax({
                method: "get",
                url: this.GetUrl('/OrderMov/getdetails?orderid=' + row.orderid+"&ordertypecode="+this.ordertypecode),
                success: function (data) {
                    this.permitsdata = data;
                    this.txId.textbox("setText", data.orderid);
                    this.txNumber.textbox("setText", data.no);
                    this.tbInit.textbox("setText", data.initusername);
                    if(this.ordertypecode == '06'){
                        this.tbSolver.textbox("setText", data.workusername);
                        this.tbFromRoom.textbox("setText", data.fromroom);
                        this.txToRoom.textbox("setText", data.toroom);
                    }
                    else{
                        this.tbgiveto.textbox("setText", data.owner);
                    }
                    this.dtDate.datebox("setValue", data.date);
                    this.dateonstart = this.dtDate.datebox("getValue");
                    this.txNotice.textbox("setText", data.info);
                    //выбираем значение в комбобоксе
                    this.cbStatus.combobox("setValue", data.stts);
                    this.txCreated.textbox("setText", data.created + ' ' + data.creator);
                    this.txChanged.textbox("setText", data.created + ' ' + data.creator);

                    this.sttsonstart = data.stts;
                    this.initonstart = data.initusername;
                    this.solveronstart = data.workusername;
                    this.roomfromonstart = data.fromroom;
                    this.roomtoonstart = data.toroom;
                    this.noonstart = data.no;
                    this.givetoonstart=data.owner;
                    this.SetPermits(data);
                }.bind(this),
                error: function (data) {
                    this.ShowErrorResponse(data.responseJSON);
                }.bind(this)

            });
            //this.GetUnit();
        }
    }

    /**
     * выбираем значение в комбобоксе
     */
    setCb(stts) {
        if (stts == 0) {
            this.cbStatus.combobox("setValue", stts);
        } else {
            this.cbStatus.combobox("setValue", 3);
        }
    }

}

export function StartNestedModul(Id) {
    StartModalModulGlobal("OrderMov", {}, () => {
    })
}

/**
 * Вызов модуля в диалоговом окне
 * @param StartParams стартовые параметры
 * @param ResultFunc функция, которая будет вызываться по нажатию на кнопку "ОК"
 * @constructor
 */
export function StartModalModul(StartParams, ResultFunc) {
    let id = "wOrderMov_Modul_OrderMov";//идентификатор диалогового окна
    //CreateModalWindow(id, "Заявки на перемещение")//функция создания диалогового окна для модуля
    let form = new OrderMov("", StartParams);
    form.SetResultFunc(ResultFunc);
    form.Start(id);
}

