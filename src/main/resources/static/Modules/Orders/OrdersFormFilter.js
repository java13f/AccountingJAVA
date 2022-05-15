import {FormView} from "../Core/FormView.js";

/**
 * Основной класс модуля
 */
export class OrdersFormFilter extends FormView {
    constructor() {
        super();
        this.ordertypeid = -1;
        this.ListAndPeriodParams = null;
        this.filter = new LibFilter("orders");
        this.filterModel = {listParamId: -1, periodParamId: -1};

        this.ListParam = {};
        this.PeriodParam = {};

        this.deleteParams = [];
    }

    /**
     * Функция загрузки формы
     * @param id - идентификатор эелемента HTML, в который будет загружена разметка частичного представления
     * @constructor
     */
    Show(options) {
        this.options = {};
        if (options != null) {
            this.filterModel = options;
        }
        LoadForm("#ModalWindows", this.GetUrl("/Orders/OrdersFormFilter"), this.InitFunc.bind(this));
    }

    /**
     * Функция инициализации пользовательского интерфейса
     * @constructor
     */
    InitFunc() {
        this.options.AddMode = true;
        this.options.EditMode = true;

        this.InitComponents("wOrdersFormFilter_Module_Orders", "");
        this.InitCloseEvents(this.wOrdersFormFilter);
        this.btnCancel.linkbutton({
            onClick: () => {
                this.wOrdersFormFilter.window("close")
            }
        });
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.cbType.combobox({onSelect: this.cbType_onSelect.bind(this)});
        this.LoadOrdersTypes();

        this.cbDtStart.checkbox({onChange: this.cbDtStart_onChange.bind(this)});
        this.cbDtEnd.checkbox({onChange: this.cbDtEnd_onChange.bind(this)});
        this.dtStart.datebox({formatter: this.formatter.bind(this), parser: this.parser.bind(this)});
        this.dtEnd.datebox({formatter: this.formatter.bind(this), parser: this.parser.bind(this)});

        this.cbListParams.combobox({onSelect: this.cbListParams_onSelect.bind(this)});
        this.cbPeriodParams.combobox({onSelect: this.cbPeriodParams_onSelect.bind(this)});

        // кнопки очистки полей
        this.btnClearDtStart.linkbutton({onClick: this.btnClearDtStart_onClick.bind(this)});
        this.btnClearDtEnd.linkbutton({onClick: this.btnClearDtEnd_onClick.bind(this)});
        this.btnClearNom.linkbutton({onClick: this.btnClearNom_onClick.bind(this)});
        this.btnClearType.linkbutton({onClick: this.btnClearType_onClick.bind(this)});
        this.btnClearInvNom.linkbutton({onClick: this.btnClearInvNom_onClick.bind(this)});
        this.btnClearName.linkbutton({onClick: this.btnClearName_onClick.bind(this)});
        this.btnClearInitUser.linkbutton({onClick: this.btnClearInitUser_onClick.bind(this)});
        this.btnClearWorkUser.linkbutton({onClick: this.btnClearWorkUser_onClick.bind(this)});
        this.btnClearListParams.linkbutton({onClick: this.btnClearListParams_onClick.bind(this)});
        this.btnClearPeriodParams.linkbutton({onClick: this.btnClearPeriodParams_onClick.bind(this)});
        this.btnClearListParamsVal.linkbutton({onClick: this.btnClearListParamsVal_onClick.bind(this)});
        this.btnClearPeriodParamsVal.linkbutton({onClick: this.btnClearPeriodParamsVal_onClick.bind(this)});
        this.btnClearAll.linkbutton({onClick: this.btnClearAll_onClick.bind(this)});
        this.btnListRef.linkbutton({
            onClick: this.btnListRef_onClick.bind(this),
            disabled: true
        });
        this.btnPeriodRef.linkbutton({
            onClick: this.btnPeriodRef_onClick.bind(this),
            disabled: true
        });
        this.txListParam.textbox({editable: false});
        this.txPeriodParam.textbox({editable: false});

        this.ApplyFilterOnLoad();
    }

    /**
     * Обработка нажатия на ОК
     */
    btnOk_onClick() {
        let isDtStart = this.cbDtStart.checkbox("options").checked ? 1 : 0;
        let isDtEnd = this.cbDtEnd.checkbox("options").checked ? 1 : 0;
        let dtStart = this.dtStart.datebox("getText");
        let dtEnd = this.dtEnd.datebox("getText");
        let no = this.txNo.textbox("getText");
        let type = this.ordertypeid;
        let invNo = this.txInvNo.textbox("getText");
        let name = this.txName.textbox("getText");
        let initUser = this.txInitUser.textbox("getText");
        let workUser = this.txWorkUser.textbox("getText");
        let sttsNew = this.cbSttsNew.checkbox("options").checked ? 1 : 0;
        let sttsPaused = this.cbSttsPaused.checkbox("options").checked ? 1 : 0;
        let sttsWork = this.cbSttsWork.checkbox("options").checked ? 1 : 0;
        let sttsCompleted = this.cbSttsCompleted.checkbox("options").checked ? 1 : 0;
        let sttsRejects = this.cbSttsRejects.checkbox("options").checked ? 1 : 0;

        let listParamId = -1;
        if (this.cbListParams.combobox("getText").length > 0) {
            listParamId = this.cbListParams.combobox("getValue");
        }
        let periodParamId = -1;
        if (this.cbPeriodParams.combobox("getText").length > 0) {
            periodParamId = this.cbPeriodParams.combobox("getValue");
        }

        let listParamVal = "";
        let listParamValId = "";
        let listParamValName = "";
        let periodParamVal = "";
        let periodParamValId = "";
        let periodParamValName = "";

        if (this.txListParam.textbox("getText").length > 0) {
            let lpValue = this.txListParam.textbox("getText");
            let index = lpValue.indexOf(' = ');
            if (index != -1) {
                let lp = lpValue.split(' = ');
                this.filter.SetValue("listParamValId", lp[0]);
                this.filter.SetValue("listParamValName", lp[1]);
                listParamValId = lp[0];
                listParamValName = lp[1];
            } else {
                this.filter.SetValue("listParamVal", lpValue);
                listParamVal = lpValue;
            }
        } else {
            this.deleteParams.push("listParamVal");
            this.deleteParams.push("listParamValId");
            this.deleteParams.push("listParamValName");
        }
        if (this.txPeriodParam.textbox("getText").length > 0) {
            let ppValue = this.txPeriodParam.textbox("getText");
            let index = ppValue.indexOf(' = ');
            if (index != -1) {
                let pp = ppValue.split(' = ');
                this.filter.SetValue("periodParamValId", pp[0]);
                this.filter.SetValue("periodParamValName", pp[1]);
                periodParamValId = pp[0];
                periodParamValName = pp[1];
            } else {
                this.filter.SetValue("periodParamVal", ppValue);
                periodParamVal = ppValue;
            }
        } else {
            this.deleteParams.push("periodParamVal");
            this.deleteParams.push("periodParamValId");
            this.deleteParams.push("periodParamValName");
        }

        this.filterModel =
            {
                isDtStart: isDtStart,
                isDtEnd: isDtEnd,
                dtStart: dtStart,
                dtEnd: dtEnd,
                no: no,
                type: type,
                invNo: invNo,
                name: name,
                initUser: initUser,
                workUser: workUser,
                sttsNew: sttsNew,
                sttsPaused: sttsPaused,
                sttsWork: sttsWork,
                sttsCompleted: sttsCompleted,
                sttsRejects: sttsRejects,
                listParamId: listParamId,
                periodParamId: periodParamId,
                listParamVal: listParamVal,
                listParamValId: listParamValId,
                listParamValName: listParamValName,
                periodParamVal: periodParamVal,
                periodParamValId: periodParamValId,
                periodParamValName: periodParamValName
            };

        if (isDtStart == 1) {
            this.filter.SetValue("isDtStart", isDtStart);
        } else {
            this.deleteParams.push("isDtStart");
        }

        if (isDtEnd == 1) {
            this.filter.SetValue("isDtEnd", isDtEnd);
        } else {
            this.deleteParams.push("isDtEnd");
        }

        if (dtStart.length > 0) {
            this.filter.SetValue("dtStart", dtStart);
        } else {
            this.deleteParams.push("dtStart");
        }
        if (dtEnd.length > 0) {
            this.filter.SetValue("dtEnd", dtEnd);
        } else {
            this.deleteParams.push("dtEnd");
        }

        if (no.length > 0) {
            this.filter.SetValue("no", no);
        } else {
            this.deleteParams.push("no");
        }

        if (invNo.length > 0) {
            this.filter.SetValue("invNo", invNo);
        } else {
            this.deleteParams.push("invNo");
        }

        if (name.length > 0) {
            this.filter.SetValue("name", name);
        } else {
            this.deleteParams.push("name");
        }

        if (this.ordertypeid != -1) {
            this.filter.SetValue("type", type);
        } else {
            this.deleteParams.push("type");
        }

        if (initUser.length > 0) {
            this.filter.SetValue("initUser", initUser);
        } else {
            this.deleteParams.push("initUser");
        }

        if (workUser.length > 0) {
            this.filter.SetValue("workUser", workUser);
        } else {
            this.deleteParams.push("workUser");
        }

        if (sttsNew == 1) {
            this.filter.SetValue("sttsNew", sttsNew);
        } else {
            this.deleteParams.push("sttsNew");
        }
        if (sttsPaused == 1) {
            this.filter.SetValue("sttsPaused", sttsPaused);
        } else {
            this.deleteParams.push("sttsPaused");
        }
        if (sttsWork == 1) {
            this.filter.SetValue("sttsWork", sttsWork);
        } else {
            this.deleteParams.push("sttsWork");
        }
        if (sttsCompleted == 1) {
            this.filter.SetValue("sttsCompleted", sttsCompleted);
        } else {
            this.deleteParams.push("sttsCompleted");
        }
        if (sttsRejects == 1) {
            this.filter.SetValue("sttsRejects", sttsRejects);
        } else {
            this.deleteParams.push("sttsRejects");
        }

        if (listParamId != -1) {
            this.filter.SetValue("listParamId", listParamId)
        } else {
            this.deleteParams.push("listParamId");
        }
        if (periodParamId != -1) {
            this.filter.SetValue("periodParamId", periodParamId)
        } else {
            this.deleteParams.push("periodParamId");
        }

        this.filter.DeleteParamsInFilter(this.deleteParams, function () {
            this.filter.SaveFilter(function () {
                this.ResultFunc(this.filterModel);
                this.wOrdersFormFilter.window("close");
            }.bind(this));
        }.bind(this));

    }

    /**
     * Функция загрузки списка типов
     * @constructor
     */
    LoadOrdersTypes() {
        $.ajax({
            method: "get",
            url: this.GetUrl('/Orders/listOrderTypes'),
            success: function (data) {
                this.cbType.combobox({
                    valueField: 'id',
                    textField: 'name',
                    data: data
                });
                if (this.filterModel.type != -1) {
                    for (let i = 0; i < data.length; i++) {
                        let type = data[i];
                        if (type.id == this.filterModel.type) {
                            this.cbType.combobox("setValue", this.filterModel.type);
                        }
                    }
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Функция загрузки списка реквизитов
     * @constructor
     */
    LoadPeriodAndListParams() {
        $.ajax({
            method: "get",
            url: this.GetUrl('/Orders/listPeriodAndListParams'),
            success: function (data) {
                this.ListAndPeriodParams = data;
                let list = this.ListAndPeriodParams.filter(function (item) {
                    return item.tablename == 'listparams';
                });
                let period = this.ListAndPeriodParams.filter(function (item) {
                    return item.tablename == 'periodparams';
                });

                this.cbPeriodParams.combobox({
                    valueField: 'id',
                    textField: 'paramname',
                    data: period
                });
                this.cbListParams.combobox({
                    valueField: 'id',
                    textField: 'paramname',
                    data: list
                });
                if (this.filterModel.periodParamId != -1) {
                    this.cbPeriodParams.combobox("setValue", this.filterModel.periodParamId);
                    if (this.filterModel.periodParamValId != "") {
                        let val = this.filterModel.periodParamValId.toString() + ' = ' + this.filterModel.periodParamValName.toString();
                        this.txPeriodParam.textbox("setText", val)
                    } else {
                        this.txPeriodParam.textbox("setText", this.filterModel.periodParamVal);
                    }
                }

                if (this.filterModel.listParamId != -1) {
                    this.cbListParams.combobox("setValue", this.filterModel.listParamId);
                    if (this.filterModel.listParamValId != "") {
                        let val = this.filterModel.listParamValId + ' = ' + this.filterModel.listParamValName;
                        this.txListParam.textbox("setText", val)
                    } else {
                        this.txListParam.textbox("setText", this.filterModel.listParamVal);
                    }
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Функция применения параметров фильтра при открытии формы
     * @constructor
     */
    ApplyFilterOnLoad() {
        if (this.filterModel.isDtStart == 1) {
            this.cbDtStart.checkbox("check");
            this.dtStart.datebox("setValue", this.filterModel.dtStart);
        }
        if (this.filterModel.isDtEnd == 1) {
            this.cbDtEnd.checkbox("check");
            this.dtEnd.datebox("setValue", this.filterModel.dtEnd);
        }
        this.txNo.textbox("setText", this.filterModel.no);
        this.txInvNo.textbox("setText", this.filterModel.invNo);
        this.txName.textbox("setText", this.filterModel.name);
        this.txInitUser.textbox("setText", this.filterModel.initUser);
        this.txWorkUser.textbox("setText", this.filterModel.workUser);
        this.filterModel.sttsNew == 1 ? this.cbSttsNew.checkbox("check") : this.cbSttsNew.checkbox("uncheck");
        this.filterModel.sttsPaused == 1 ? this.cbSttsPaused.checkbox("check") : this.cbSttsPaused.checkbox("uncheck");
        this.filterModel.sttsWork == 1 ? this.cbSttsWork.checkbox("check") : this.cbSttsWork.checkbox("uncheck");
        this.filterModel.sttsCompleted == 1 ? this.cbSttsCompleted.checkbox("check") : this.cbSttsCompleted.checkbox("uncheck");
        this.filterModel.sttsRejects == 1 ? this.cbSttsRejects.checkbox("check") : this.cbSttsRejects.checkbox("uncheck");

        this.LoadPeriodAndListParams();
    }

    cbDtStart_onChange() {
        if (this.cbDtStart.checkbox("options").checked) {
            this.dtStart.datebox({disabled: false});
        } else {
            this.dtStart.datebox({disabled: true});
        }
    }

    cbDtEnd_onChange() {
        if (this.cbDtEnd.checkbox("options").checked) {
            this.dtEnd.datebox({disabled: false});
        } else {
            this.dtEnd.datebox({disabled: true});
        }
    }

    cbType_onSelect(record) {
        this.ordertypeid = record.id;
    }

    btnClearDtStart_onClick() {
        this.dtStart.datebox("setText", "");
        this.cbDtStart.checkbox("uncheck");
    }

    btnClearDtEnd_onClick() {
        this.dtEnd.datebox("setText", "");
        this.cbDtEnd.checkbox("uncheck");
    }

    btnClearNom_onClick() {
        this.txNo.textbox("setText", "");
    }

    btnClearInvNom_onClick() {
        this.txInvNo.textbox("setText", "");
    }

    btnClearType_onClick() {
        this.cbType.combobox("setValue", null);
        this.ordertypeid = -1;

    }

    btnClearName_onClick() {
        this.txName.textbox("setText", "");
    }

    btnClearInitUser_onClick() {
        this.txInitUser.textbox("setText", "");
    }

    btnClearWorkUser_onClick() {
        this.txWorkUser.textbox("setText", "");
    }

    btnClearListParams_onClick() {
        this.cbListParams.combobox("setValue", null);
        this.btnListRef.linkbutton({disabled: true});
        this.ListParam = null;
        this.filterModel.listParamId = -1;
        this.btnClearListParamsVal_onClick();
    }

    btnClearPeriodParams_onClick() {
        this.cbPeriodParams.combobox("setValue", null);
        this.btnPeriodRef.linkbutton({disabled: true});
        this.PeriodParam = null;
        this.filterModel.periodParamId = -1;
        this.btnClearPeriodParamsVal_onClick();
    }

    btnClearListParamsVal_onClick() {
        this.txListParam.textbox("setText", "");
    }

    btnClearPeriodParamsVal_onClick() {
        this.txPeriodParam.textbox("setText", "");
    }

    btnClearAll_onClick() {
        this.btnClearDtStart_onClick();
        this.btnClearDtEnd_onClick();
        this.btnClearNom_onClick();
        this.btnClearInvNom_onClick();
        this.btnClearType_onClick();
        this.btnClearName_onClick();
        this.btnClearInitUser_onClick();
        this.btnClearWorkUser_onClick();
        this.btnClearListParams_onClick();
        this.btnClearPeriodParams_onClick();
        this.btnClearListParamsVal_onClick();
        this.btnClearPeriodParamsVal_onClick();
        this.cbSttsNew.checkbox("uncheck");
        this.cbSttsPaused.checkbox("uncheck");
        this.cbSttsWork.checkbox("uncheck");
        this.cbSttsCompleted.checkbox("uncheck");
        this.cbSttsRejects.checkbox("uncheck");
    }

    cbListParams_onSelect(record) {
        // нужно проверить в зависимости от выбранной записи три поля реффер
        // и в итоге либо editable и выключена кнопка, либо наоборот
        if (this.ListParam != record) {
            this.ListParam = record;
            this.txListParam.textbox("setText", "");
        }

        if (record.reffermodul.toString().length > 0) {
            this.btnListRef.linkbutton({disabled: false});
            this.txListParam.textbox({editable: false});
        } else {
            this.btnListRef.linkbutton({disabled: true});
            this.txListParam.textbox({editable: true});
        }

    }

    btnListRef_onClick() {
        if (this.ListParam != null) {
            try {
                StartModalModulGlobal(this.ListParam.refferfunc,
                    "",
                    ((data) => {
                        this.getDataFromTableById(this.txListParam, this.ListParam.reffertable, data.id);
                    }).bind(this));

            } catch (e) {
                this.ShowError(e);
            }
        }
    }

    cbPeriodParams_onSelect(record) {
        // нужно проверить в зависимости от выбранной записи три поля реффер
        // и в итоге либо editable и выключена кнопка, либо наоборот
        if (this.PeriodParam != record) {
            this.PeriodParam = record;
            this.txPeriodParam.textbox("setText", "");
        }

        if (record.reffermodul.toString().length > 0) {
            this.btnPeriodRef.linkbutton({disabled: false});
            this.txPeriodParam.textbox({editable: false});
        } else {
            this.btnPeriodRef.linkbutton({disabled: true});
            this.txPeriodParam.textbox({editable: true});
        }
    }

    btnPeriodRef_onClick() {
        if (this.PeriodParam != null) {
            try {
                StartModalModulGlobal(this.PeriodParam.refferfunc,
                    "",
                    ((data) => {
                        this.getDataFromTableById(this.txPeriodParam, this.PeriodParam.reffertable, data.id);
                    }).bind(this));

            } catch (e) {
                this.ShowError(e);
            }
        }
    }

    /**
     * Функция загрузки строки в формате id = name (универсальный)
     * @param textBox - получает textBox в который будет вставляться результат
     * @param table - получает имя таблицы
     * @param id - получает идентификатор в таблице которая была вызвана
     */
    getDataFromTableById(textBox, table, id) {
        $.ajax({
            method: "get",
            url: this.GetUrl('/Orders/getDataFromTableById?table=' + table + "&id=" + id),
            success: function (data) {
                textBox.textbox("setText", data);
            }.bind(this),
            error: function (data) {
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
    };

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
    };
}