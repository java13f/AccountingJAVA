import {FormView} from "../Core/FormView.js";
import {OrdersFormFilter} from "./OrdersFormFilter.js";
import {OrdersFormFilterParams} from "./OrdersFormFilterParams.js";
import {OrdersFormTypesList} from "./OrdersFormTypesList.js";

/**
 * Основной класс модуля
 */
class Orders extends FormView {
    /**
     * Конструктор
     * @param prefix - приставка для идентификаторов. Данная приставка добавится для каждого идентификатора
     * @param StartParams - стартовые параметры в формате JSON
     */
    constructor(prefix, StartParams) {
        super();
        this.OrdersId = -1;
        this.OrdersIndex = 0;
        this.StartParams = StartParams;
        this.sLoc = new LibLockService(300000);
        this.editMode = false;
        this.prefix = prefix;
        this.filter = new LibFilter("orders");
        this.filterParams = new LibFilter("ordersParams");
        this.filterModel = {};
        this.filterParamsModel = {};
        this.dataGridJson = [[]];
        this.orderForEdit = {};
    }

    /**
     * Функция загрузки формы
     * @param id - идентификатор эелемента HTML, в который будет загружена разметка частичного представления
     * @constructor
     */
    Start(id) {
        this.ModuleId = id;
        LoadForm("#" + this.ModuleId, this.GetUrl("/Orders/OrdersFormList?prefix=" + this.prefix), this.InitFunc.bind(this));
    }

    /**
     * Функция инициализации пользовательского интерфейса
     * @constructor
     */
    InitFunc() {
        this.InitComponents(this.ModuleId, this.prefix);
        AddKeyboardNavigationForGrid(this.dgOrders);
        this.dataGridJson[0].push();
        this.dgOrders.datagrid({
            onLoadError: (data) => {
                this.ShowErrorResponse(data.responseJSON);
            },
            onLoadSuccess: this.dgOrders_onLoadSuccess.bind(this),
        });
        this.filterParams.LoadFilter(function () {
            this.filterParamsModel = this.filterParams.filterObj;
        }.bind(this))
        this.filter.LoadFilter(function () {
            this.filterModel.isDtStart = this.filter.GetValue("isDtStart", 0);
            this.filterModel.isDtEnd = this.filter.GetValue("isDtEnd", 0);
            this.filterModel.dtStart = this.filter.GetValue("dtStart", "");
            this.filterModel.dtEnd = this.filter.GetValue("dtEnd", "");
            this.filterModel.no = this.filter.GetValue("no", "");
            this.filterModel.invNo = this.filter.GetValue("invNo", "");
            this.filterModel.name = this.filter.GetValue("name", "");
            this.filterModel.type = this.filter.GetValue("type", -1);
            this.filterModel.initUser = this.filter.GetValue("initUser", "");
            this.filterModel.workUser = this.filter.GetValue("workUser", "");
            this.filterModel.sttsNew = this.filter.GetValue("sttsNew", 0);
            this.filterModel.sttsPaused = this.filter.GetValue("sttsPaused", 0);
            this.filterModel.sttsWork = this.filter.GetValue("sttsWork", 0);
            this.filterModel.sttsCompleted = this.filter.GetValue("sttsCompleted", 0);
            this.filterModel.sttsRejects = this.filter.GetValue("sttsRejects", 0);
            this.filterModel.periodParamId = this.filter.GetValue("periodParamId", -1);
            this.filterModel.periodParamVal = this.filter.GetValue("periodParamVal", "");
            this.filterModel.periodParamValId = this.filter.GetValue("periodParamValId", "");
            this.filterModel.periodParamValName = this.filter.GetValue("periodParamValName", "");
            this.filterModel.listParamId = this.filter.GetValue("listParamId", -1);
            this.filterModel.listParamVal = this.filter.GetValue("listParamVal", "");
            this.filterModel.listParamValId = this.filter.GetValue("listParamValId", "");
            this.filterModel.listParamValName = this.filter.GetValue("listParamValName", "");
            this.btnUpdate_onClick();
        }.bind(this));

        this.btnAdd.linkbutton({disabled: true});
        this.btnDelete.linkbutton({disabled: true});
        this.LoadRights();

        this.btnAdd.linkbutton({onClick: this.btnAdd_onClick.bind(this)});
        this.btnChange.linkbutton({onClick: this.btnChange_onClick.bind(this)});
        this.btnDelete.linkbutton({onClick: this.btnDelete_onClick.bind(this)});
        this.btnUpdate.linkbutton({onClick: this.btnUpdate_onClick.bind(this)});
        this.btnFilter.linkbutton({onClick: this.btnFilter_onClick.bind(this)});
        this.btnFilterParams.linkbutton({onClick: this.btnFilterParams_onClick.bind(this)});

        if (this.prefix == "modal_") {
            this.pOkCancel.css("visibility", "visible");
            this.wOrders = $("#" + this.ModuleId);
            this.InitCloseEvents(this.wOrders, false);
            this.btnCancel.linkbutton({
                onClick: function () {
                    this.wOrders.window("close")
                }.bind(this)
            });
            this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        }
    }

    /**
     * Проверка прав
     */
    LoadRights() {
        $.ajax({
            method: "get",
            url: this.GetUrl('/CoreUtils/GetActRights?TaskCode=Orders.dll&ActCode=ChangeOrders'),
            success: function (data) {
                if (data.length == 0) {
                    this.btnAdd.linkbutton({disabled: false});
                    this.btnDelete.linkbutton({disabled: false});
                    this.editMode = true;
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Обработка окончания загрузки списка
     * @param data - информация о загруженных данных
     */
    dgOrders_onLoadSuccess(data) {
        if (data.total > 0) {
            if (this.OrdersId != -1) {
                this.dgOrders.datagrid("selectRecord", this.OrdersId);
            } else {
                if (this.OrdersIndex >= 0 && this.OrdersIndex < data.total) {
                    this.dgOrders.datagrid("selectRow", this.OrdersIndex);
                } else if (data.total > 0) {
                    this.dgOrders.datagrid("selectRow", data.total - 1);
                }
            }
            this.OrdersId = -1;
            this.OrdersIndex = 0;
        }
    }

    /**
     * Обновление списка заявок
     */
    btnUpdate_onClick() {
        this.UpdateData();
    }

    /**
     * Обновление данных в таблице
     * @constructor
     */
    UpdateData() {
        $.ajax({
            method: "post",
            data: JSON.stringify(this.filterModel),
            url: this.GetUrl("/Orders/list"),
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                let row = this.dgOrders.datagrid("getSelected");
                if (row != null) {
                    this.OrdersIndex = this.dgOrders.datagrid("getRowIndex", row);
                    if (this.OrdersIndex < 0) {
                        this.OrdersIndex = 0;
                    }
                }

                this.dataGridJson = [[
                    {field: 'id', title: 'ID', width: '50', fixed: 'true', resizable: 'true', sortable: 'true'},
                    {field: 'date', title: 'Дата', width: '90', fixed: 'true', resizable: 'true', sortable: 'true'},
                    {field: 'no', title: '№', width: '60', fixed: 'true', resizable: 'true', sortable: 'true'},
                    {field: 'ordertype', title: 'Тип', width: '120', fixed: 'true', resizable: 'true', sortable: 'true'},
                    {field: 'invno', title: 'Инв. №', width: '140', fixed: 'true', resizable: 'true', sortable: 'true'},
                    {field: 'name', title: 'Наименование', width: '140', fixed: 'true', resizable: 'true', sortable: 'true'},
                    {field: 'initusername', title: 'Инициатор', width: '250', fixed: 'true', resizable: 'true', sortable: 'true'},
                    {field: 'workusername', title: 'Исполнитель', width: '250', fixed: 'true', resizable: 'true', sortable: 'true'},
                    {field: 'stts', title: 'Статус', width: '100', fixed: '100', resizable: 'true', sortable: 'true'}
                ]]
                for (let [key, value] of Object.entries(this.filterParamsModel)) {
                    this.dataGridJson[0].push({field: key, title: value, width: '180', fixed: 'true', resizable: 'true', sortable: 'true'});
                }

                // Добавление реквизитов в модель для вывода в таблицу.
                for (let i = 0; i < data.length; i++) {
                    if (data[i].listValues != null) {
                        for (let iLV = 0; iLV < data[i].listValues.length; iLV++) {
                            let currL = data[i].listValues[iLV];
                            data[i][currL.paramcode] = currL.valueDisplay;
                        }
                    }
                    if (data[i].periodValues != null) {
                        for (let iPV = 0; iPV < data[i].periodValues.length; iPV++) {
                            let currP = data[i].periodValues[iPV];
                            data[i][currP.paramcode] = currP.valueDisplay;
                        }
                    }
                }

                this.dgOrders.datagrid({dataType: 'json', data: data, columns: this.dataGridJson});
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        })
    }

    /**
     * Обработка нажатия на добавить
     */
    btnAdd_onClick() {
        let form = new OrdersFormTypesList();

        let params = {};
        params.orderid = -1;
        params.lockstate = true;

        form.SetResultFunc((ordertype) => {
            params.ordertype = ordertype.id;
            params.ordertypecode = ordertype.code;
            StartModalModulGlobal(ordertype.codejs, params, ((data) => {
                this.OrdersId = data.orderid;
                this.UpdateData();
        }).bind(this)
    )
}

)
;
form.Show();
}

/**
 * Обработка нажатия на изменение
 * @returns {boolean}
 */
btnChange_onClick()
{
    if (this.dgOrders.datagrid("getRows").length == 0) {
        this.ShowWarning("Нет записей для изменения");
        return false;
    }
    let selData = this.dgOrders.datagrid("getSelected");
    if (selData == null) {
        this.ShowWarning("Предупреждение", "Выберите заявку!");
        return false;
    }

    this.orderForEdit.id = selData.id;
    this.orderForEdit.ordertype = selData.ordertypeid;
    this.orderForEdit.ordertypecode = selData.ordertypecode;
    this.orderForEdit.codejs = selData.codejs;

    if (this.editMode) {
        this.sLoc.LockRecord("orders", selData.id, this.btnContinueChange_onClick.bind(this));
    } else {
        this.btnContinueChange_onClick({
            id: selData.id,
            editMode: this.editMode,
            lockMessage: '',
            lockState: false
        });
    }
}

/**
 * Продолжение изменения записи
 * @param options
 */
btnContinueChange_onClick(options)
{
    let params = {};
    params.orderid = this.orderForEdit.id;
    params.ordertype = this.orderForEdit.ordertype;
    params.ordertypecode = this.orderForEdit.ordertypecode;
    params.okstate = false;

    if (options.lockMessage.length !== 0) {
        this.ShowSlide("Предупреждение", options.lockMessage)
        options.editMode = false;
    } else {
        if (options.editMode) {
            options.lockState = true;
        }
    }
    params.lockstate = options.lockState;
    StartModalModulGlobal(this.orderForEdit.codejs, params, ((data) => {
        // alert("Должен открыться модуль " + this.orderForEdit.codejs + ".");
        if (data.okstate) {
            this.OrdersId = data.orderid;
            this.UpdateData();
        }

        if (options.lockState) {
            this.sLoc.FreeLockRecord("orders", params.id);
        }
    }).bind(this));
}

/**
 * Обработка нажатия на удаление
 */
btnDelete_onClick()
{
    let selData = this.dgOrders.datagrid("getSelected");
    if (selData == null) {
        this.ShowWarning("Предупреждение", "Выберите заявку для удаления!");
        return;
    }
    if (selData.stts !== "новая") {
        this.ShowWarning("Удалить можно заявку только со статусом \"Новая\"");
        return;
    }
    $.messager.confirm("Удаление", "Вы действительно хотите удалить заявку и все её дочерние?",
        function (result) {
            if (result) {
                this.sLoc.StateLockRecord("orders", selData.id, this.DeleteOrder.bind(this));
            }
        }.bind(this));
}

/**
 * Удаление заявки
 * @param options
 * @constructor
 */
DeleteOrder(options)
{
    $.ajax({
        method: "POST",
        url: this.GetUrl('/Orders/deleteOrder'),
        data: {id: options.id},
        success: function (data) {
            if (data.length) {
                this.ShowWarning(data);
            } else {
                this.btnUpdate_onClick();
            }
        }.bind(this),
        error: function (data) {
            this.ShowErrorResponse(data.responseJSON);
        }.bind(this)
    });
}

/**
 * Обработка нажития на фильтр
 */
btnFilter_onClick()
{
    let form = new OrdersFormFilter();
    form.SetResultFunc((filterModel) => {
        this.filterModel = filterModel;
        this.btnUpdate_onClick();
    });
    form.Show(this.filterModel);
}

/**
 * Обработка нажатия на фильтр реквизитов
 */
btnFilterParams_onClick()
{
    let form = new OrdersFormFilterParams();
    form.SetResultFunc((filterParamsModel) => {
        this.filterParamsModel = filterParamsModel;
        this.btnUpdate_onClick();
    });
    form.Show(this.filterParamsModel);
}

btnOk_onClick()
{
    if (this.dgOrders.datagrid("getRows").length === 0) {
        this.ShowWarning("Нет записей для выбора");
        return false;
    }
    let selData = this.dgOrders.datagrid("getSelected");
    if (selData == null) {
        this.ShowWarning("Выберите запись");
        return false;
    }
    if (this.ResultFunc != null) {
        this.ResultFunc({id: selData.id.toString()});
    }
    this.wOrders.window("close");
    return false;
}
}


/**
 * Функция встраиваемого запуска модуля
 * @param Id идентификатор
 * @constructor
 */
export function StartNestedModul(Id) {
    let form = new Orders("nested_", "");
    form.Start(Id);
}

/**
 * Вызов модуля в диалоговом окне
 * @param StartParams стартовые параметры
 * @param ResultFunc функция, которая будет вызываться по нажатию на кнопку "ОК"
 * @constructor
 */
export function StartModalModul(StartParams, ResultFunc) {
    let id = "wOrders_Module_Orders_OrdersFormList";
    CreateModalWindow(id, "Заявки");
    let form = new Orders("modal_", StartParams);
    form.SetResultFunc(ResultFunc);
    form.Start(id);
}