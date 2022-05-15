import {FormView} from "../Core/FormView.js";


/**
 * Основной класс модуля
 */
class OrderUniversal extends FormView {
    /**
     * Конструктор
     * @param prefix - приставка для идентификаторов. Данная приставка добавится для каждого идентификатора
     * @param StartParams - стартовые параметры в формате JSON
     */
    constructor(prefix, StartParams) {
        // StartParams - orderid, ordertype, lockstate, okstate
        super();
        this.prefix = prefix;
        this.StartParams = StartParams;
        this.OrderModel = {stts: 0, objid: -1, id: -1, ordertypeid: -1};
        this.dgListColumn = [[]];
        this.dgPeriodColumn = [[]];
        this.dgListData = {};
        this.dgPeriodData = {};
        this.dgListRows = {};
        this.dgPeriodRows = {};

        this.statuses = [
            {"id": "1", "stts": 0, "name": "Новая"},
            {"id": "2", "stts": 1, "name": "Приостановлена"},
            {"id": "3", "stts": 2, "name": "В работе"},
            {"id": "4", "stts": 3, "name": "Исполнена"},
            {"id": "9", "stts": -1, "name": "Отклонена"}
        ];

        this.ListSttsOrder = {};

        this.editIndex = -1;
        this.okstate = false;
        this.currentIndex = -1;
        this.orderNo = -1;

        this.oldStts = -2;
    }

    /**
     * Функция загрузки формы
     * @param id - идентификатор эелемента HTML, в который будет загружена разметка частичного представления
     * @constructor
     */
    Start(id) {
        this.ModuleId = id;
        //Загружаем макет формы и выполняем  функци InitFunc в случае успеха
        LoadForm("#ModalWindows", this.GetUrl("/OrderUniversal/OrderUniversalForm"), this.InitFunc.bind(this));
    }

    /*
    Функция инициализации элементов
     */
    InitFunc() {
        this.InitComponents(this.ModuleId, "");
        this.SetCloseWindowFunction(async (options) => {
            this.ResultFunc({
                orderid: this.OrderModel.id,
                lockstate: this.StartParams.lockstate,
                okstate: this.okstate
            });
            await this.ClearLocks();
        });

        this.InitCloseEvents(this.wOrderUniversal);
        AddKeyboardNavigationForGrid(this.dgList);
        AddKeyboardNavigationForGrid(this.dgPeriod);
        this.btnCancel.linkbutton({
            onClick: () => {
                this.wOrderUniversal.window("close")
            }
        });
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnChType.linkbutton({onClick: this.btnChType_onClick.bind(this)})
        this.dtStart.datebox({formatter: this.dtFormatter.bind(this), parser: this.dtParser.bind(this)});
        this.dtClose.datebox({formatter: this.dtFormatter.bind(this), parser: this.dtParser.bind(this)});
        this.cbDtClose.checkbox({onChange: this.cbDtClose_onChange.bind(this)})
        this.btnChInitUser.linkbutton({onClick: this.btnChInitUser_onClick.bind(this)});
        this.btnChWorkUser.linkbutton({onClick: this.btnChWorkUser_onClick.bind(this)});
        this.btnChObject.linkbutton({onClick: this.btnChObject_onClick.bind(this)});
        this.btnChProblemCode.linkbutton({onClick: this.btnChProblemCode_onClick.bind(this)});
        this.btnClearWorkUser.linkbutton({onClick: this.btnClearWorkUser_onClick.bind(this)});
        this.btnClearProblemCode.linkbutton({onClick: this.btnClearProblemCode_onClick.bind(this)});
        this.txProblem.textbox({onChange: this.txProblem_onChange.bind(this)});
        this.btnOk.linkbutton({disabled: !this.StartParams.lockstate});

        this.DisableAndHideAllFields();
        this.asyncInit();
    }

    /*
    Функция инициализации при первой загрузке
     */
    async asyncInit() {
        let isLoadRights = await this.LoadRights().catch(reason => {
            this.ShowErrorResponse(reason.responseJSON)
            return false;
        });
        if (!isLoadRights) {
            return;
        }

        let isInitDgPeriod = await this.InitDgPeriod().catch(reason => {
            this.ShowErrorResponse(reason.responseJSON);
            return false;
        });
        if (!isInitDgPeriod) {
            return;
        }
        let isInitDgList = await this.InitDgList().catch(reason => {
            this.ShowErrorResponse(reason.responseJSON);
            return false;
        });
        if (!isInitDgList) {
            return;
        }
        await this.LoadOrder();
    }

    /**
     * Проверка прав
     */
    LoadRights() {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "get",
                url: this.GetUrl('/CoreUtils/GetActRights?TaskCode=Orders.dll&ActCode=ChangeOrders'),
                success: function (data) {
                    if (data.length > 0) {
                        this.btnOk.linkbutton({disabled: true});
                    } else {
                        this.btnOk.linkbutton({disabled: false});
                    }
                    resolve(true);
                }.bind(this),
                error: function (data) {
                    reject(data);
                }.bind(this)
            });
        })
    }

    /*
    Получение уникального идентификатора для SesId
     */
    GetUUID() {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "get",
                url: this.GetUrl('/CoreUtils/GetUUID'),
                success: function (data) {
                    resolve(data);
                }.bind(this),
                error: function (data) {
                    reject(data);
                }.bind(this)
            })
        });
    }

    /*
    Инициализация статусов
     */
    InitSttsCb() {
        this.cbStts.combobox({
            valueField: 'id',
            textField: 'name',
            data: this.statuses,
            onSelect: this.cbStts_onSelect.bind(this)
        });
        this.cbStts.combobox("setValue", 1);
    }

    /*
    Инициализация таблицы дополнительных реквизитов
     */
    InitDgList() {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "get",
                url: this.GetUrl('/OrderUniversal/getListValues?orderid=' + this.StartParams.orderid + '&ordertype=' + this.StartParams.ordertype),
                success: function (data) {
                    this.dgListData = data;
                    for (let i = 0; i < this.dgListData.length; i++) {
                        let curr = this.dgListData[i];
                        if (!isEmpty(curr.codejs)) {
                            if (!isEmpty(curr.valueval)) {
                                curr.valueval = curr.valueval + " = " + curr.valuename;
                            }
                        }
                    }
                    let _data = this.GetElement("dgList_Module_OrderUniversal");
                    let dEditorIndex = this.GetElement("dEditorIndex_Module_OrderUniversal");
                    this.dgListColumn = [[
                        {field: 'paramname', title: 'Реквизит', width: 160, fixed: 'true'},
                        {
                            field: 'valueval',
                            title: 'Значение реквизита',
                            width: 240,
                            heigth: '100%',
                            editor: {
                                type: 'textbox', options: {
                                    editable: true,
                                    height: '100%',
                                    onChange: function (value) {
                                        let cc = this;
                                        setTimeout(function () {
                                            let ed = $(_data).datagrid('getEditor', {
                                                index: this.editIndex,
                                                field: 'valueval'
                                            });
                                            let editIndex = dEditorIndex.html();
                                            let row = $(_data).datagrid('getRows')[editIndex];
                                            row.valueval = $(cc).textbox('getText');
                                        }, 0);
                                    },
                                }
                            },
                            styler: function (value, row, index) {
                                if (row.paramstrict === 1 && (row.valueval == null || row.valueval === '')) {
                                    return 'border: 1.5px solid red;';
                                }
                            }
                        },
                        {
                            field: 'ref',
                            title: 'Справочная информация',
                            width: 38,
                            fixed: true,
                            align: 'center',
                            formatter: function (value, row) {
                                if (isEmpty(row.codejs)) {
                                    return;
                                }
                                return '<a act="ref" row-codejs="' + row.codejs + '" href="#" class="easyui-linkbutton" iconCls="icon-edit"></a>'
                            }
                        },
                        {
                            field: 'view',
                            title: 'Вид',
                            width: 38,
                            fixed: true,
                            align: 'center',
                            formatter: function (value, row) {
                                let icon = 'icon-grayEye';
                                if (row.imglock != null && row.imglock.id > 0 && row.imglock.flagdel === 0 ||
                                    (!isEmpty(row.imgvalueid) && (row.imglock == null || row.imglock.flagdel === 0))) {
                                    icon = 'icon-blueEye';
                                }
                                return '<a act="view" row-imgvalueid="' + row.imgvalueid + '" href="#" class="easyui-linkbutton" iconCls="' + icon + '"></a>'
                            }
                        },
                        {
                            field: 'clearref',
                            title: 'Очистить',
                            width: 38,
                            fixed: true,
                            align: 'center',
                            formatter: function (value, row) {
                                return '<a act="clearref" row-codejs="' + row.codejs + '" href="#" class="easyui-linkbutton" iconCls="icon-clear"></a>'
                            }
                        }
                    ]];
                    this.dgList.datagrid({
                        fitColumns: true,
                        singleSelect: true,
                        onLoadSuccess: this.dgList_onLoadSucess.bind(this),
                        data: this.dgListData,
                        columns: this.dgListColumn,
                        onClickCell: function (index, field) {
                            this.currentIndex = index;
                            let editIndex = this.dEditorIndex.html();
                            if (this.oldStts === 3) {
                                return;
                            }
                            this.dgList.datagrid('selectRow', index).datagrid('endEdit', editIndex);
                            this.dEditorIndex.html(index);
                            this.field = field;
                            this.dgList_onLoadSucess();
                            if (field === "valueval") {
                                let currentRow = this.dgList.datagrid("getRows")[index];
                                if (currentRow.codejs === null || currentRow.codejs === undefined || currentRow.codejs === "") {
                                    this.dgList.datagrid('selectRow', index).datagrid('beginEdit', index);
                                }
                            }
                        }.bind(this)
                    });
                    resolve(true);
                }.bind(this),
                error: function (data) {
                    throw new Error(data);
                }.bind(this)
            })
        });
    }

    /*
    Инициализация таблицы периодических реквизитов
     */
    InitDgPeriod() {
        let date = this.dtStart.datebox("getText").length > 0 ? this.dtStart.datebox("getText") : this.dtFormatter(new Date());
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "get",
                url: this.GetUrl('/OrderUniversal/getPeriodValues?orderid=' + this.StartParams.orderid
                    + '&ordertype=' + this.StartParams.ordertype
                    + '&objid=' + this.OrderModel.objid
                    + '&date=' + date),
                success: function (data) {
                    this.dgPeriodData = data;
                    for (let i = 0; i < this.dgPeriodData.length; i++) {
                        let curr = this.dgPeriodData[i];
                        if (!isEmpty(curr.codejs)) {
                            if (!isEmpty(curr.valueval) && !isEmpty(curr.valuename)) {
                                curr.valueval = curr.valueval + " = " + curr.valuename;
                            } else {
                                curr.valueval = "";
                            }
                        }
                    }
                    let _data = this.GetElement("dgPeriod_Module_OrderUniversal");
                    let dEditorIndex = this.GetElement("dEditorIndex_Module_OrderUniversal");
                    this.dgPeriodColumn = [[
                        {field: 'paramname', title: 'Реквизит', width: 160, fixed: 'true'},
                        {
                            field: 'valueval',
                            title: 'Значение реквизита',
                            width: 240,
                            heigth: '100%',
                            editor: {
                                type: 'textbox', options: {
                                    editable: true,
                                    height: '100%',
                                    onChange: function (value) {
                                        let cc = this;
                                        setTimeout(function () {
                                            let ed = $(_data).datagrid('getEditor', {
                                                index: this.editIndex,
                                                field: 'valueval'
                                            });
                                            let editIndex = dEditorIndex.html();
                                            let row = $(_data).datagrid('getRows')[editIndex];
                                            row.valueval = $(cc).textbox('getText');
                                        }, 0);
                                    }
                                }
                            },
                            styler: function (value, row, index) {
                                if (row.paramstrict === 1 && (row.valueval == null || row.valueval === '')) {
                                    return 'border: 1.5px solid red;';
                                }
                            }
                        },
                        {
                            field: 'ref',
                            title: 'Справочная информация',
                            width: 38,
                            fixed: true,
                            align: 'center',
                            formatter: function (value, row) {
                                if (isEmpty(row.codejs)) {
                                    return;
                                }
                                return '<a act="ref" row-codejs="' + row.codejs + '" href="#" class="easyui-linkbutton" iconCls="icon-edit"></a>'
                            }
                        },
                        {
                            field: 'view',
                            title: 'Вид',
                            width: 38,
                            fixed: true,
                            align: 'center',
                            formatter: function (value, row) {
                                let icon = 'icon-grayEye';
                                if (row.imglock != null && row.imglock.id > 0 && row.imglock.flagdel === 0 ||
                                    (!isEmpty(row.imgvalueid) && (row.imglock == null || row.imglock.flagdel === 0))) {
                                    icon = 'icon-blueEye';
                                }
                                return '<a act="view" row-imgvalueid="' + row.imgvalueid + '" href="#" class="easyui-linkbutton" iconCls="' + icon + '"></a>';
                            }
                        },
                        {
                            field: 'clearref',
                            title: 'Очистить',
                            width: 38,
                            fixed: true,
                            align: 'center',
                            formatter: function (value, row) {
                                return '<a act="clearref" row-codejs="' + row.codejs + '" href="#" class="easyui-linkbutton" iconCls="icon-clear"></a>'
                            }
                        }
                    ]];
                    this.dgPeriod.datagrid({
                        fitColumns: true,
                        singleSelect: true,
                        onLoadSuccess: this.dgPeriod_onLoadSuccess.bind(this),
                        data: this.dgPeriodData,
                        columns: this.dgPeriodColumn,
                        onClickCell: function (index, field) {
                            this.currentIndex = index;
                            let editIndex = this.dEditorIndex.html();
                            if (this.oldStts === 3) {
                                return;
                            }
                            this.dgPeriod.datagrid('selectRow', index).datagrid('endEdit', editIndex);
                            this.dEditorIndex.html(index);
                            this.field = field;
                            this.dgPeriod_onLoadSuccess();
                            if (field === "valueval") {
                                let currentRow = this.dgPeriod.datagrid("getRows")[index];
                                if (isEmpty(currentRow.codejs)) {
                                    this.dgPeriod.datagrid('selectRow', index).datagrid('beginEdit', index);
                                }
                            }
                        }.bind(this)
                    });
                    resolve(true);
                }.bind(this),
                error: function (data) {
                    reject(data);
                }.bind(this)
            })
        });
    }

    /*
    Обработка загрузки таблицы дополнительных реквизитов
     */
    dgList_onLoadSucess() {
        let getDataFromTableFunc = function (a, b) {
            return this.GetDataFromTable(a, b);
        }.bind(this);

        let getImgLock = function (id) {
            return this.GetImgLock(id).catch((data) => {
                this.ShowErrorResponse(data.responseJSON);
                return;
            })
        }.bind(this);

        let getImgLockByModel = function (params) {
            return this.GetImgLockByModel(params).catch((data) => {
                this.ShowErrorResponse(data.responseJSON);
                return;
            })
        }.bind(this);

        let dataGrid = this.GetElement("dgList_Module_OrderUniversal");

        let returnCurrentIndex = function () {
            return this.currentIndex;
        }.bind(this);

        let refreshGrid = function () {
            return this.dgList_onLoadSucess();
        }.bind(this);

        let getSesId = function () {
            return this.OrderModel.sesid;
        }.bind(this);

        let onLoadSucc = function () {
            return this.dgList_onLoadSucess();
        }.bind(this);

        let indx = -1;
        this.dgList.datagrid('getPanel').find('.easyui-linkbutton').each(function () {
            $(this).linkbutton({
                onClick: function () {
                    if ($(this).attr("act") === "view") {
                        setTimeout(async function () {
                            indx = returnCurrentIndex();
                            let row = $(dataGrid).datagrid("getRows")[indx];
                            let params = {};
                            params.ObjectId = row.objectid;
                            params.RecId = row.valueid != null ? row.valueid : -1;
                            params.SesId = getSesId();
                            params.ListParamId = row.paramid;
                            params.PeriodParamId = -1;
                            StartModalModulGlobal("ImgWork", params, (async (data) => {
                                if (data !== undefined && data !== "") {
                                    row.imglock = await getImgLock(data.id);
                                    $(dataGrid).datagrid("updateRow", {index: indx, row: row});
                                    $(dataGrid).datagrid("refreshRow", indx);
                                    onLoadSucc();
                                }
                            }));
                        }, 1);
                    }
                    if ($(this).attr("act") === "ref") {
                        setTimeout(async function () {
                            indx = returnCurrentIndex();
                            let row = $(dataGrid).datagrid("getRows")[indx];
                            if (row.codejs != null && row.codejs !== "null" && row.codejs !== "") {
                                StartModalModulGlobal(row.codejs, "", ((data) => {
                                    if (data.id !== undefined && data.id !== "") {
                                        $.when(getDataFromTableFunc(row.codejs, data.id)).then(function (result) {
                                            if (result !== "") {
                                                let res = result.split(' = ');
                                                row.valueval = result;
                                                row.valuename = res[1];
                                                $(dataGrid).datagrid("updateRow", {index: indx, row: row});
                                                $(dataGrid).datagrid("refreshRow", indx);
                                                refreshGrid();
                                            }
                                        })
                                    }
                                }));
                            }
                        }, 1);
                    }
                    if ($(this).attr("act") === "clearref") {
                        setTimeout(function () {
                            indx = returnCurrentIndex();
                            if (indx !== -1) {
                                let row = $(dataGrid).datagrid("getRows")[indx];
                                if (!isEmpty(row.valueval) || !isEmpty(row.valuename)) {
                                    row.valueval = "";
                                    row.valuename = "";
                                    $(dataGrid).datagrid("updateRow", {index: indx, row: row})
                                    $(dataGrid).datagrid("refreshRow", indx);
                                    refreshGrid();
                                }
                            }
                        }, 1)
                    }
                }
            })
        })
    }

    /*
    Обработка загрузки таблицы периодических реквизитов
     */
    dgPeriod_onLoadSuccess() {
        let getDataFromTableFunc = function (a, b) {
            return this.GetDataFromTable(a, b);
        }.bind(this);

        let getImgLock = function (id) {
            return this.GetImgLock(id).catch((data) => {
                this.ShowErrorResponse(data.responseJSON);
                return;
            })
        }.bind(this);

        let dataGrid = this.GetElement("dgPeriod_Module_OrderUniversal");

        let returnCurrentIndex = function () {
            return this.currentIndex;
        }.bind(this);

        let refreshGrid = function () {
            return this.dgPeriod_onLoadSuccess();
        }.bind(this);

        let getSesId = function () {
            return this.OrderModel.sesid;
        }.bind(this);

        let onLoadSucc = function () {
            return this.dgPeriod_onLoadSuccess();
        }.bind(this)

        let indx = -1;
        this.dgPeriod.datagrid('getPanel').find('.easyui-linkbutton').each(function () {
                $(this).linkbutton({
                        onClick: function () {
                            if ($(this).attr("act") === "view") {
                                setTimeout(function () {
                                    indx = returnCurrentIndex();
                                    let row = $(dataGrid).datagrid("getRows")[indx];
                                    let params = {};
                                    params.ObjectId = row.objectid;
                                    params.RecId = row.valueid != null ? row.valueid : -1;
                                    params.SesId = getSesId();
                                    params.ListParamId = row.paramid;
                                    params.PeriodParamId = -1;
                                    StartModalModulGlobal("ImgWork", params, (async (data) => {
                                        if (data !== undefined && data !== "") {
                                            row.imglock = await getImgLock(data.id);
                                            $(dataGrid).datagrid("updateRow", {index: indx, row: row});
                                            $(dataGrid).datagrid("refreshRow", indx);
                                            onLoadSucc();
                                        }
                                    }));
                                }, 1);
                            }
                            if ($(this).attr("act") === "ref") {
                                setTimeout(async function () {
                                    indx = returnCurrentIndex();
                                    let row = $(dataGrid).datagrid("getRows")[indx];
                                    if (row.codejs != null && row.codejs !== "null" && row.codejs !== "") {
                                        StartModalModulGlobal(row.codejs, "", ((data) => {
                                            if (data.id !== undefined && data.id !== "") {
                                                $.when(getDataFromTableFunc(row.codejs, data.id)).then(function (result) {
                                                    if (result !== "") {
                                                        let res = result.split(' = ');
                                                        row.valueval = result;
                                                        row.valuename = res[1];
                                                        $(dataGrid).datagrid("updateRow", {index: indx, row: row});
                                                        $(dataGrid).datagrid("refreshRow", indx);
                                                        refreshGrid();
                                                    }
                                                })
                                            }
                                        }));
                                    }
                                }, 1);
                            }
                            if ($(this).attr("act") === "clearref") {
                                setTimeout(function () {
                                    indx = returnCurrentIndex();
                                    if (indx !== -1) {
                                        let row = $(dataGrid).datagrid("getRows")[indx];
                                        if (!isEmpty(row.valueval) || !isEmpty(row.valuename)) {
                                            row.valueval = "";
                                            row.valuename = "";
                                            $(dataGrid).datagrid("updateRow", {index: indx, row: row});
                                            $(dataGrid).datagrid("refreshRow", indx);
                                            refreshGrid();
                                        }
                                    }
                                }, 1);
                            }
                        }
                    }
                )
            }
        )
    }

    /*
    Функция первоначальной загрузки заявки
     */
    async LoadOrder() {
        if (this.StartParams.orderid === -1) {
            this.ListSttsOrder = await this.GetOrderPermits().catch(reason => {
                this.ShowErrorResponse(reason.responseJSON);
                return null;
            });
            if (this.ListSttsOrder == null) {
                return;
            }
            this.InitSttsCb();
            this.ApplyOrderFieldPermits();

            this.txId.textbox("setText", -1);
            this.dtStart.datebox("setText", this.dtFormatter(new Date()));
            this.txAmount.numberbox("setValue", 0);

            let type = await this.GetOrderType(this.StartParams.ordertype);
            this.OrderModel.ordertypeid = type.id;
            this.SetHeaders(type);

            let no = await this.GetOrderNo(this.dtStart.datebox("getText"));
            this.txNo.textbox("setText", no);
        } else if (this.StartParams.orderid > 0) {
            let isOrderGet = await this.GetOrderById().catch((data) => {
                return false;
            });
            if (isOrderGet === false) {
                this.ShowError("Не удалось получить данные заявки");
                return;
            }
        }
        this.OrderModel.sesid = await this.GetUUID().catch((data) => {
            return "";
        });
        if (isEmpty(this.OrderModel.sesid)) {
            this.ShowError("Не удалось получить уникальный идентификатор");
            return;
        }
        console.log("Current sesid: " + this.OrderModel.sesid);
    }

    /*
    Получение заявки по Id
     */
    GetOrderById() {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "get",
                url: this.GetUrl('/OrderUniversal/getOrder?id=' + this.StartParams.orderid),
                success: async function (data) {
                    if (isEmpty(data)) return;
                    this.InitSttsCb();
                    this.ListSttsOrder = await this.GetOrderPermits();
                    this.ApplyOrderFieldPermits();
                    this.OrderModel = data;
                    this.txId.textbox("setText", this.OrderModel.id);

                    let type = await this.GetOrderType(this.OrderModel.ordertypeid);
                    this.OrderModel.ordertypeid = type.id;
                    this.SetHeaders(type);

                    this.txNo.textbox("setText", this.OrderModel.no);
                    this.dtStart.datebox("setText", this.OrderModel.date);
                    this.txObject.textbox("setText", this.OrderModel.objname);
                    this.txInitUser.textbox("setText", this.OrderModel.initusername);
                    this.txWorkUser.textbox("setText", this.OrderModel.workusername);
                    if (this.OrderModel.problemid == null) {
                        this.txProblem.textbox("setText", this.OrderModel.probleminfo);
                    } else {
                        this.txProblemCode.textbox("setText", this.OrderModel.problemname);
                    }
                    this.txWorkInfo.textbox("setText", this.OrderModel.workinfo);
                    this.txAmount.numberbox("setValue", this.OrderModel.amount);
                    for (let i = 0; i < this.statuses.length; i++) {
                        if (this.statuses[i].stts === this.OrderModel.stts) {
                            this.cbStts.combobox("setValue", this.statuses[i].id);
                        }
                    }
                    if (this.OrderModel.isdtclose === 1) {
                        this.cbDtClose.checkbox("check");
                        this.dtClose.datebox("setText", this.OrderModel.dateclose);
                    }
                    this.txInfo.textbox("setText", this.OrderModel.info);

                    if (this.OrderModel.creator !== null) {
                        this.txCreatorCreated.textbox("setText", this.OrderModel.creator + " " + this.OrderModel.created);
                    }
                    if (this.OrderModel.changer !== null) {
                        this.txChangerChanged.textbox("setText", this.OrderModel.changer + " " + this.OrderModel.changed);
                    }
                    this.orderNo = this.OrderModel.no;
                    this.oldStts = this.OrderModel.stts;

                    let oldStts = this.oldStts;
                    this.dgList.datagrid('getPanel').find('.easyui-linkbutton').each(function () {
                        $(this).linkbutton({disabled: oldStts === 3});
                    });
                    this.dgPeriod.datagrid('getPanel').find('.easyui-linkbutton').each(function () {
                        $(this).linkbutton({disabled: oldStts === 3});
                    });
                    resolve(true);
                }.bind(this),
                error: function (data) {
                    reject(data);
                }.bind(this)
            });
        })
    }

    /*
    Функция установки заголовков для окна заявки в зависимости от типа
     */
    SetHeaders(type) {
        let typename = "";
        switch (type.id) {
            case 21:
                typename = "приобретение";
                break;
            case 23:
                typename = "модернизацию";
                break;
            case 29:
                typename = "обслуживание";
                break;
            case 31:
                typename = "перезакрепление";
                break;
            case 33:
                typename = "регистрацию отказов";
                break;
            case 34:
                typename = "ликвидацию объекта";
                break;
        }
        this.txType.textbox("setText", type.name);
        this.wOrderUniversal.window({title: "Заявка на " + typename});
        this.GetElement("LabelOrder_Module_OrderUniversal")[0].innerHTML = "Заявка на " + typename;
    }

    /*
    Обработка при события при выборе значения в комбобоксе с статусами
     */
    cbStts_onSelect(record) {
        this.OrderModel.stts = record.stts;
        this.ApplyOrderFieldPermits();
        if (this.oldStts === 3 && this.oldStts !== record.stts) {
            this.DisableAllFields();
        }
    }

    /*
    Обработка изменения статуса чекбокса даты закрытия
     */
    cbDtClose_onChange() {
        if (this.cbDtClose.checkbox("options").checked) {
            this.dtClose.datebox("enable");
        } else {
            this.dtClose.datebox("disable");
        }

    }

    /*
    Получение объекта по Id
     */
    GetObj(id) {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "GET",
                url: this.GetUrl('/OrderUniversal/getObj?id=' + id),
                success: function (data) {
                    if (data !== null) {
                        this.txObject.textbox("setText", data.id + " = " + data.name);
                        this.OrderModel.objid = data.id;
                    } else {
                        this.ShowError("Не удалось получить объект.");
                    }
                    resolve(true);
                }.bind(this),
                error: function (data) {
                    reject(data);
                    this.ShowErrorResponse(data.responseJSON);
                }.bind(this)
            });
        });
    }

    /*
    Получить пользователя по Id
     */
    GetUser(id, init = true) {
        $.ajax({
            method: "GET",
            url: this.GetUrl('/OrderUniversal/getUser?id=' + id),
            success: function (data) {
                if (data !== null) {
                    if (init) {
                        this.txInitUser.textbox("setText", data.id + " = " + data.name);
                    } else {
                        this.txWorkUser.textbox("setText", data.id + " = " + data.name);
                    }
                } else {
                    this.ShowError("Не удалось получить пользователя.");
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /*
    Получить проблему по Id
     */
    GetProblem(id) {
        $.ajax({
            method: "GET",
            url: this.GetUrl('/OrderUniversal/getProblem?id=' + id),
            success: function (data) {
                if (data !== null) {
                    this.txProblemCode.textbox("setText", data.id + " = " + data.name);
                } else {
                    this.ShowError("Не удалось получить проблему.");
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /*
    Получить достпуности полей заявок
     */
    GetOrderPermits() {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "GET",
                url: this.GetUrl('/OrderUniversal/getOrderPermits?ordertype=' + this.StartParams.ordertype),
                success: function (data) {
                    resolve(data)
                }.bind(this),
                error: function (data) {
                    reject(data);
                }.bind(this)
            })
        });
    }

    /*
    Получение типа заявки по Id
     */
    GetOrderType(ordertype) {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "get",
                url: this.GetUrl('/OrderUniversal/getOrderType?id=' + ordertype),
                success: function (data) {
                    if (!isEmpty(data)) {
                        resolve(data);
                    } else {
                        this.ShowError("Не удалось получить тип заявки");
                    }
                }.bind(this),
                error: function (data) {
                    this.ShowErrorResponse(data.responseJSON);
                }.bind(this)
            });
        })
    }

    /*
    Получение данных изображения по ID
     */
    GetImgLock(id) {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "get",
                url: this.GetUrl('/OrderUniversal/getImgLockById?id=' + id),
                success: function (data) {
                    resolve(data);
                }.bind(this),
                error: function (data) {
                    reject(data);
                }.bind(this)
            })
        });
    }

    /*
    Получение данных изображения по данным из модели
     */
    GetImgLockByModel(params) {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "post",
                data: JSON.stringify(params),
                url: this.GetUrl('/OrderUniversal/getImgLockByModel'),
                success: function (data) {
                    resolve(data);
                }.bind(this),
                error: function (data) {
                    reject(data);
                }.bind(this)
            })
        });
    }

    /*
    Получение записи по Id с указанной таблицы
     */
    GetDataFromTable(tablename, id) {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "get",
                url: this.GetUrl('/OrderUniversal/getDataFromTable?tablename=' + tablename + "&id=" + id),
                success: function (data) {
                    resolve(data);
                }.bind(this),
                error: function (data) {
                    reject(data);
                }.bind(this)
            })
        });
    }

    /*
    Отключение всех полей заявки
     */
    DisableAllFields() {
        this.txType.textbox({disabled: true});
        this.btnChType.linkbutton({disabled: true});
        this.txNo.textbox({disabled: true});
        this.dtStart.datebox("disable");
        this.txObject.textbox({disabled: true});
        this.btnChObject.linkbutton({disabled: true});
        this.txInitUser.textbox({disabled: true});
        this.btnChInitUser.linkbutton({disabled: true});
        this.txWorkUser.textbox({disabled: true});
        this.btnChWorkUser.linkbutton({disabled: true});
        this.btnClearWorkUser.linkbutton({disabled: true});
        this.txProblem.textbox({disabled: true});
        this.txProblemCode.textbox({disabled: true});
        this.btnChProblemCode.linkbutton({disabled: true});
        this.btnClearProblemCode.linkbutton({disabled: true});
        this.txWorkInfo.textbox({disabled: true});
        this.txAmount.numberbox({disabled: true});
        this.dtClose.datebox("disable");
        this.txInfo.textbox({disabled: true});

        let oldStts = this.oldStts;
        let currentStts = this.OrderModel.stts;

        this.dgList.datagrid('getPanel').find('.easyui-linkbutton').each(function () {
            $(this).linkbutton({disabled: oldStts === 3 && oldStts !== currentStts});
        });

        this.dgPeriod.datagrid('getPanel').find('.easyui-linkbutton').each(function () {
            $(this).linkbutton({disabled: oldStts === 3 && oldStts !== currentStts});
        });
    }

    /*
    Выключени и скрытие всех полей заявки
     */
    DisableAndHideAllFields() {
        this.txType.textbox({disabled: true});
        this.btnChType.linkbutton({disabled: true});
        this.txNo.textbox({disabled: true});
        this.dtStart.datebox("disable");
        this.txObject.textbox({disabled: true});
        this.btnChObject.linkbutton({disabled: true});
        this.txInitUser.textbox({disabled: true});
        this.btnChInitUser.linkbutton({disabled: true});
        this.txWorkUser.textbox({disabled: true});
        this.btnChWorkUser.linkbutton({disabled: true});
        this.btnClearWorkUser.linkbutton({disabled: true});
        this.txProblem.textbox({disabled: true});
        this.txProblemCode.textbox({disabled: true});
        this.btnChProblemCode.linkbutton({disabled: true});
        this.btnClearProblemCode.linkbutton({disabled: true});
        this.txWorkInfo.textbox({disabled: true});
        this.txAmount.numberbox({disabled: true});
        this.cbStts.combobox("disable");
        this.dtClose.datebox("disable");
        this.txInfo.textbox({disabled: true});

        this.pnType.css("visibility", "hidden");
        this.pnNo.css("visibility", "hidden");
        this.pnDtStart.css("visibility", "hidden");
        this.pnObject.css("visibility", "hidden");
        this.pnInit.css("visibility", "hidden");
        this.pnWork.css("visibility", "hidden");
        this.pnProblem.css("visibility", "hidden");
        this.pnCodeProblem.css("visibility", "hidden");
        this.pnWorkInfo.css("visibility", "hidden");
        this.pnAmount.css("visibility", "hidden");
        this.pnStts.css("visibility", "hidden");
        this.pnDtClose.css("visibility", "hidden");
        this.pnInfo.css("visibility", "hidden");
    }

    /*
    Применение параметров достпуности полей заявки в зависимости от статуса
     */
    ApplyOrderFieldPermits() {
        if (this.ListSttsOrder == null) {
            return;
        }
        this.DisableAndHideAllFields();
        for (let i = 0; i < this.ListSttsOrder.length; i++) {

            let SO = this.ListSttsOrder[i];
            let orderFieldCode = SO.orderfieldcode;
            let isEnable = SO.isenable;
            let isVisible = SO.isvisible;

            if (this.OrderModel.stts !== this.ListSttsOrder[i].orderstts) continue;

            if (orderFieldCode === "01") {
                if (this.txType.textbox("options").disabled === true)
                    this.txType.textbox({disabled: isEnable === 0});

                if (this.btnChType.linkbutton("options").disabled === true)
                    this.btnChType.linkbutton({disabled: isEnable === 0})

                if (this.pnType.css("visibility") === "hidden")
                    this.pnType.css("visibility", isVisible === 1 ? "visible" : "hidden");

            } else if (orderFieldCode === "02") {
                if (this.txNo.textbox("options").disabled === true)
                    this.txNo.textbox({disabled: isEnable === 0});

                if (this.pnNo.css("visibility") === "hidden")
                    this.pnNo.css("visibility", isVisible === 1 ? "visible" : "hidden");
            } else if (orderFieldCode === "03") {
                if (this.dtStart.datebox("options").disabled === true)
                    isEnable === 0 ? this.dtStart.datebox("disable") : this.dtStart.datebox("enable");

                if (this.pnDtStart.css("visibility") === "hidden")
                    this.pnDtStart.css("visibility", isVisible === 1 ? "visible" : "hidden");
            } else if (orderFieldCode === "04") {
                if (this.txObject.textbox("options").disabled === true)
                    this.txObject.textbox({disabled: isEnable === 0});

                if (this.btnChObject.linkbutton("options").disabled === true)
                    this.btnChObject.linkbutton({disabled: isEnable === 0});

                if (this.pnObject.css("visibility") === "hidden")
                    this.pnObject.css("visibility", isVisible === 1 ? "visible" : "hidden");
            } else if (orderFieldCode === "05") {
                if (this.txInitUser.textbox("options").disabled === true)
                    this.txInitUser.textbox({disabled: isEnable === 0});

                if (this.btnChInitUser.linkbutton("options").disabled === true)
                    this.btnChInitUser.linkbutton({disabled: isEnable === 0});

                if (this.pnInit.css("visibility") === "hidden")
                    this.pnInit.css("visibility", isVisible === 1 ? "visible" : "hidden");
            } else if (orderFieldCode === "06") {
                if (this.txWorkUser.textbox("options").disabled === true)
                    this.txWorkUser.textbox({disabled: isEnable === 0});

                if (this.btnChWorkUser.linkbutton("options").disabled === true)
                    this.btnChWorkUser.linkbutton({disabled: isEnable === 0});

                if (this.btnClearWorkUser.linkbutton("options").disabled === true)
                    this.btnClearWorkUser.linkbutton({disabled: isEnable === 0});

                if (this.pnWork.css("visibility") === "hidden")
                    this.pnWork.css("visibility", isVisible === 1 ? "visible" : "hidden");
            } else if (orderFieldCode === "07") {
                if (this.txProblem.textbox("options").disabled === true)
                    this.txProblem.textbox({disabled: isEnable === 0});

                if (this.pnProblem.css("visibility") === "hidden")
                    this.pnProblem.css("visibility", isVisible === 1 ? "visible" : "hidden");
            } else if (orderFieldCode === "08") {
                if (this.txProblemCode.textbox("options").disabled === true)
                    this.txProblemCode.textbox({disabled: isEnable === 0});

                if (this.btnChProblemCode.linkbutton("options").disabled === true)
                    this.btnChProblemCode.linkbutton({disabled: isEnable === 0});

                if (this.btnClearProblemCode.linkbutton("options").disabled === true)
                    this.btnClearProblemCode.linkbutton({disabled: isEnable === 0});

                if (this.pnCodeProblem.css("visibility") === "hidden")
                    this.pnCodeProblem.css("visibility", isVisible === 1 ? "visible" : "hidden");
            } else if (orderFieldCode === "09") {
                if (this.txWorkInfo.textbox("options").disabled === true)
                    this.txWorkInfo.textbox({disabled: isEnable === 0});

                if (this.pnWorkInfo.css("visibility") === "hidden")
                    this.pnWorkInfo.css("visibility", isVisible === 1 ? "visible" : "hidden");
            } else if (orderFieldCode === "10") {
                if (this.txAmount.numberbox("options").disabled === true)
                    this.txAmount.numberbox({disabled: isEnable === 0});

                if (this.pnAmount.css("visibility") === "hidden")
                    this.pnAmount.css("visibility", isVisible === 1 ? "visible" : "hidden");
            } else if (orderFieldCode === "11") {
                if (this.cbStts.combobox("options").disabled === true)
                    isEnable === 0 ? this.cbStts.combobox("disable") : this.cbStts.combobox("enable");

                if (this.pnStts.css("visibility") === "hidden")
                    this.pnStts.css("visibility", isVisible === 1 ? "visible" : "hidden");
            } else if (orderFieldCode === "12") {
                if (this.dtClose.datebox("options").disabled === true)
                    isEnable === 0 ? this.dtClose.datebox("disable") : this.dtClose.datebox("enable");

                if (this.cbDtClose.checkbox("options").disabled === true)
                    this.cbDtClose.checkbox({disabled: isEnable === 0});

                if (this.pnDtClose.css("visibility") === "hidden")
                    this.pnDtClose.css("visibility", isVisible === 1 ? "visible" : "hidden");
            } else if (orderFieldCode === "15") {
                if (this.txInfo.textbox("options").disabled === true)
                    this.txInfo.textbox({disabled: isEnable === 0});

                if (this.pnInfo.css("visibility") === "hidden")
                    this.pnInfo.css("visibility", isVisible === 1 ? "visible" : "hidden");
            }
        }
    }

    /*
    Обработка нажатия на кнопку выбора типа
     */
    btnChType_onClick() {
        StartModalModulGlobal("OrderTypes", {}, (async (data) => {
            if (!isEmpty(data)) {
                let type = await this.GetOrderType(data.id);
                if (type.codejs !== "OrderUniversal") {
                    this.ShowWarning("Данный тип заявки обрабатывается в другом модуле.");
                    return false;
                }
                this.txType.textbox("setText", type.name);
                this.OrderModel.ordertypeid = type.id;
            } else {
                this.ShowError("Не удалось получить тип заявки.");
            }
        }).bind(this));
    }

    /*
    Обработка нажатия на кнопку выбора инициатора
     */
    btnChInitUser_onClick() {
        StartModalModulGlobal("Users", {}, ((data) => {
            if (data.id !== -1) {
                this.OrderModel.inituserid = data.id;
                this.GetUser(this.OrderModel.inituserid);
            }
        }).bind(this));
    }

    /*
    Обработка нажатия на кнопку выбора исполнителя
     */
    btnChWorkUser_onClick() {
        StartModalModulGlobal("Users", {}, ((data) => {
            if (data.id !== -1) {
                this.OrderModel.workuserid = data.id;
                this.GetUser(this.OrderModel.workuserid, false);
            }
        }).bind(this));
    }

    /*
    Обработка нажатия на кнопку выбора объекта
     */
    btnChObject_onClick() {
        StartModalModulGlobal("Objs", {}, (async (data) => {
            if (data.id !== -1) {
                this.OrderModel.objid = data.id;
                await this.GetObj(this.OrderModel.objid).catch(reason => this.ShowErrorResponse(reason.responseJSON));
                await this.InitDgPeriod().catch(reason => this.ShowErrorResponse(reason.responseJSON));
            }
        }).bind(this));
    }

    /*
    Обработка нажатия на кнопку выбора проблемы
     */
    btnChProblemCode_onClick() {
        StartModalModulGlobal("Problems", {}, ((data) => {
            if (data.id !== -1) {
                this.OrderModel.problemid = data.id;
                this.GetProblem(this.OrderModel.problemid);
            }
        }).bind(this));
    }

    /*
    Обработка нажатия на кнопку очистки паля "Исполнитель"
     */
    btnClearWorkUser_onClick() {
        this.txWorkUser.textbox("clear");
        this.OrderModel.workuserid = null;
    }

    /*
    Обработка нажатия на кнопку очистки поля "Код проблемы"
     */
    btnClearProblemCode_onClick() {
        this.txProblemCode.textbox("clear");
        this.OrderModel.problemid = null;
    }

    /*
    Обработчик изменений данных в поле Проблема
     */
    txProblem_onChange(oldValue, newValue) {
        if (this.txProblemCode.textbox("getText").length > 0) {
            this.txProblem.textbox("setText", "");
            this.ShowToolTip(this.ttProblemCode, "Уже заполнено поле \"Код проблемы\".\n Удалите данные в поле для описания проблемы вручную.", {
                icon: '',
                title: 'Ошибка',
                position: 'bottom',
                delay: 50002
            });
        }
    }

    /*
    Обработка нажатия на кнопку "Ок"
     */
    async btnOk_onClick() {
        let id = this.txId.textbox("getText");
        let ordertypeid = this.OrderModel.ordertypeid;
        let no = this.txNo.textbox("getText");
        let date = this.dtStart.datebox("getText");
        let objid = this.OrderModel.objid;
        let inituserid = this.OrderModel.inituserid;
        let workuserid = this.OrderModel.workuserid;
        let problemid = this.OrderModel.problemid;
        let problem = this.txProblem.textbox("getText").length > 0 ? this.txProblem.textbox("getText") : null;
        let workinfo = this.txWorkInfo.textbox("getText").length > 0 ? this.txWorkInfo.textbox("getText") : null;
        let amount = (this.txAmount.numberbox("getText")).split(' ').join('');
        let info = this.txInfo.textbox("getText").length > 0 ? this.txInfo.textbox("getText") : null;
        let dateclose = null;
        let sesid = this.OrderModel.sesid;
        let stts = this.OrderModel.stts;
        let isdtclose = 0;
        if (this.cbDtClose.checkbox("options").checked) {
            isdtclose = 1;
            dateclose = this.dtClose.datebox("getText");
        }
        this.dgPeriodData = this.dgPeriod.datagrid("getRows");
        this.dgListData = this.dgList.datagrid("getRows");


        let saveObject = {
            id: id,
            ordertypeid: ordertypeid,
            no: no,
            date: date,
            objid: objid,
            inituserid: inituserid,
            workuserid: workuserid,
            problemid: problemid,
            probleminfo: problem,
            workinfo: workinfo,
            amount: amount,
            info: info,
            isdtclose: isdtclose,
            dateclose: dateclose,
            sesid: sesid,
            listvalues: this.dgListData,
            periodvalues: this.dgPeriodData,
            stts: stts
        }
        await this.CheckData(saveObject).catch((data) => {
            if (data === false) {
                return false;
            }
        });
        this.OrderModel.id = await this.SaveOrder(saveObject);
        this.ResultFunc({
            orderid: this.OrderModel.id,
            lockstate: this.StartParams.lockstate,
            okstate: true
        });
        this.wOrderUniversal.window("close");
    }


    /*
    Сохранение заявки
     */
    SaveOrder(obj) {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "POST",
                data: JSON.stringify(obj),
                url: this.GetUrl('/OrderUniversal/save'),
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    resolve(data);
                }.bind(this),
                error: function (data) {
                    this.ShowErrorResponse(data.responseJSON);
                }.bind(this)
            });
        });
    }

    /*
    Проверка введённых данных на форме
     */
    async CheckData(saveObject) {
        return new Promise(async (resolve, reject) => {
            if (isEmpty(this.dtStart.datebox("getText"))
                && !this.dtStart.datebox("options").disabled
                && this.pnDtStart.css("visibility") === "visible") {
                this.ShowToolTip(this.ttDtStart, 'Укажите дату заявки.', {
                    icon: '',
                    title: 'Ошибка',
                    position: 'bottom',
                    delay: 5000
                });
                throw new Error(false);
            }

            if (isEmpty(this.txNo.textbox("getText"))
                && !this.txNo.textbox("options").disabled
                && this.pnNo.css("visibility") === "visible") {
                this.ShowToolTip(this.ttNo, 'Укажите номер заявки.', {
                    icon: '',
                    title: 'Ошибка',
                    position: 'bottom',
                    delay: 5000
                });
                throw new Error(false);
            }
            if (isEmpty(this.txObject.textbox("getText"))
                && !this.txObject.textbox("options").disabled
                && this.pnObject.css("visibility") === "visible") {
                this.ShowToolTip(this.ttObject, 'Выберите объект.', {
                    icon: '',
                    title: 'Ошибка',
                    position: 'bottom',
                    delay: 5000
                });
                throw new Error(false);
            }

            if (isEmpty(this.txInitUser.textbox("getText"))
                && !this.txInitUser.textbox("options").disabled
                && this.pnInit.css("visibility") === "visible") {
                this.ShowToolTip(this.ttInitUser, 'Укажите инициатора.', {
                    icon: '',
                    title: 'Ошибка',
                    position: 'bottom',
                    delay: 5000
                });
                throw new Error(false);
            }

            if (this.OrderModel.stts === 3) {
                if (isEmpty(this.txWorkUser.textbox("getText"))
                    && !this.txWorkUser.textbox("options").disabled
                    && this.pnWork.css("visibility") === "visible") {
                    this.ShowToolTip(this.ttWorkUser, 'Укажите исполнителя.', {
                        icon: '',
                        title: 'Ошибка',
                        position: 'bottom',
                        delay: 5000
                    });
                    throw new Error(false);
                }
                if (isEmpty(this.dtClose.datebox("getText"))
                    && !this.dtClose.textbox("options").disabled
                    && this.pnDtClose.css("visibility") === "visible") {
                    this.ShowToolTip(this.ttDtClose, 'Укажите дату исполнения.', {
                        icon: '',
                        title: 'Ошибка',
                        position: 'bottom',
                        delay: 5000
                    });
                    throw new Error(false);
                }
            }

            if (isEmpty(this.txWorkInfo.textbox("getText"))
                && !this.txWorkInfo.textbox("options").disabled
                && this.pnInfo.css("visibility") === "visible") {
                this.ShowToolTip(this.ttInfo, 'Заполите поле \"Примечание\".', {
                    icon: '',
                    title: 'Ошибка',
                    position: 'bottom',
                    delay: 5000
                });
                throw new Error(false);
            }

            if (isEmpty(this.txInfo.textbox("getText"))
                && !this.txInfo.textbox("options").disabled
                && this.pnInfo.css("visibility") === "visible") {
                this.ShowToolTip(this.ttInfo, 'Заполите поле \"Примечание\".', {
                    icon: '',
                    title: 'Ошибка',
                    position: 'bottom',
                    delay: 5000
                });
                throw new Error(false);
            }

            if (
                (isEmpty(this.txProblem.textbox("getText"))
                    && !this.txProblem.textbox("options").disabled
                    && this.pnProblem.css("visibility") === "visible")
                &&
                (isEmpty(this.txProblemCode.textbox("getText"))
                    && !this.txProblemCode.textbox("options").disabled
                    && this.pnCodeProblem.css("visibility") === "visible")
            ) {
                this.ShowWarning("Заполните поле \"Проблема\" или поле  \"Код проблемы\"");
                throw new Error(false);
            }

            if (
                (!isEmpty(this.txProblem.textbox("getText"))
                    && !this.txProblem.textbox("options").disabled
                    && this.pnProblem.css("visibility") === "visible")
                &&
                (!isEmpty(this.txProblemCode.textbox("getText"))
                    && !this.txProblemCode.textbox("options").disabled
                    && this.pnCodeProblem.css("visibility") === "visible")
            ) {
                this.ShowError("Должно быть заполнено только одно из полей: \"Проблема\" или \"Код проблемы\"");
                throw new Error(false);
            }

            let dayOpen = await this.CheckDay(this.dtStart.datebox("getText"));
            if (dayOpen === false) {
                this.ShowToolTip(this.ttDtStart, "День с данной датой закрыт либо не был открыт вовсе.", {
                    icon: '',
                    title: 'Ошибка',
                    position: 'bottom',
                    delay: 5000
                });
                throw new Error(false);
            }

            let resOrdNo = "";
            if ((this.OrderModel.id === -1 || this.OrderModel.id > 0 && this.OrderModel.no !== this.orderNo)
                && !this.txNo.textbox("options").disabled
                && this.pnNo.css("visibility") === "visible") {
                resOrdNo = await this.CheckOrderNo(saveObject.no, saveObject.date);
            }
            if (!isEmpty(resOrdNo)) {
                await new Promise((resolve1, reject1) => {
                    $.messager.confirm("Предупреждение", "Проставить новый номер автоматически?", async function (result) {
                        if (result) {
                            if (this.OrderModel.id !== -1 && this.orderNo !== this.OrderModel.no) {
                                this.txNo.textbox("setText", this.orderNo);
                            } else {
                                let res = await this.GetOrderNo(saveObject.date);
                                if (!isEmpty(res)) {
                                    this.txNo.textbox("setText", res);
                                    this.OrderModel.no = res;
                                } else {
                                    this.ShowError("Не удалось получить номер заявки.")
                                    throw new Error(false);
                                }
                            }
                        }
                    }.bind(this));
                })
            }

            // Проверка дат объекта ( старый вариант )
            let resObjDates = "";
            if (this.OrderModel.stts === 3 && !isEmpty(this.OrderModel.dateclose)) {
                resObjDates = await this.CheckObjectDates();
                if (!isEmpty(resObjDates)) {
                    this.ShowError(resObjDates);
                    throw new Error(false);
                }
            }

            // Проверка обязательных периодических реквизитов
            for (let i = 0; i < this.dgPeriodData.length; i++) {
                let current = this.dgPeriodData[i];

                current.dateval = saveObject.date + ' ' + this.getCurrentTime();

                if (current.paramstrict === 1 && isEmpty(current.valueval)) {
                    this.ShowError("Заполните обязательные периодические реквизиты.");
                    throw new Error(false);
                }
            }

            // Проверка обязательных дополнительных реквизитов
            for (let i = 0; i < this.dgListData.length; i++) {
                let current = this.dgListData[i];

                current.dateval = saveObject.date + ' ' + this.getCurrentTime();

                if (current.paramstrict === 1 && isEmpty(current.valueval)) {
                    this.ShowError("Заполните обязательные дополнительные реквизиты.");
                    throw new Error(false);
                }
            }

            resolve(true);
        })
    }

    /*
    Функция проверки даты
     */
    CheckDay(date) {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "get",
                url: this.GetUrl('/OrderUniversal/checkDay?date=' + date),
                success: function (data) {
                    resolve(data);
                }.bind(this),
                error: function (data) {
                    reject(data);
                }.bind(this)
            })
        });
    }

    /*
    Проверка номера заявки
     */
    CheckOrderNo(no, date) {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "get",
                url: this.GetUrl('/OrderUniversal/checkOrderNo?no=' + no + "&date=" + date),
                success: function (data) {
                    resolve(data);
                }.bind(this),
                error: function (data) {
                    reject(data);
                }.bind(this)
            })
        });
    }

    /*
    Получение номера заявки
    */
    GetOrderNo(date) {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "get",
                url: this.GetUrl('/OrderUniversal/getOrderNo?date=' + date),
                success: function (data) {
                    resolve(data);
                }.bind(this),
                error: function (data) {
                    reject(data);
                }.bind(this)
            })
        });
    }

    /*
    Очистка временных таблиц ImgLock и PeriodLock по SesId
     */
    ClearLocks() {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "get",
                url: this.GetUrl('/OrderUniversal/clearLocks?sesid=' + this.OrderModel.sesid),
                success: function (data) {
                    resolve(true);
                }.bind(this),
                error: function (data) {
                    reject(false);
                }.bind(this)
            })
        });
    }

    /*
      Проверка дат объекта
       */
    CheckObjectDates() {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "get",
                url: this.GetUrl('/OrderUniversal/checkObjectDates?objid=' + this.OrderModel.objid + '&date=' + this.OrderModel.date),
                success: function (data) {
                    resolve(data);
                }.bind(this),
                error: function (data) {
                    reject(data);
                }.bind(this)
            })
        });
    }


// Форматер и парсер для Datebox
    dtFormatter(date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        return (d < 10 ? ('0' + d) : d) + '.'
            + (m < 10 ? ('0' + m) : m) + '.'
            + y.toString();
    }

    dtParser(s) {
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

    /*
    Получение текущего времени в формате ЧЧ:ММ:СС
     */
    getCurrentTime() {
        let current = new Date();
        let h = current.getHours();
        let m = current.getMinutes();
        let s = current.getSeconds();

        m = this.checkTime(m);
        s = this.checkTime(s);

        return h.toString() + ":" + m.toString() + ":" + s.toString();
    }

    checkTime(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }
}

// Проверка строки на пустоту
function isEmpty(s) {
    return (!s || s.length === 0)
}

/*
Вызов модального окна
 */
export function StartModalModul(StartParams, ResultFunc) {
    let id = "wOrderUniversal_Module_OrderUniversal";//идентификатор диалогового окна
    let form = new OrderUniversal("", StartParams);
    form.SetResultFunc(ResultFunc);
    form.Start(id);
}