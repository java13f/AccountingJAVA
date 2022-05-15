import {FormView} from "../Core/FormView.js";

/**
 * Основной класс модуля
 */
export class OrdersFormFilterParams extends FormView {
    constructor() {
        super();
        this.filterParams = new LibFilter("ordersParams");
        this.filterParamsModel = {};
        this.ListAndPeriodParams = {};
    }

    /**
     * Показать форму
     * @param options
     * @constructor
     */
    Show(options) {
        this.options = {};
        this.filterParamsModel = options;
        LoadForm("#ModalWindows", this.GetUrl("/Orders/OrdersFormFilterParams"), this.InitFunc.bind(this));
    }

    InitFunc() {
        this.InitComponents("wOrdersFormFilterParams_Module_Orders", "");
        this.options.AddMode = true;
        this.options.EditMode = true;
        this.InitCloseEvents(this.wOrdersFormFilterParams);
        this.btnCancel.linkbutton({
            onClick: () => {
                this.wOrdersFormFilterParams.window("close")
            }
        });
        this.LoadPeriodAndListParams();

        this.btnLpAll.linkbutton({onClick: this.btnLpAll_onClick.bind(this)});
        this.btnLpClear.linkbutton({onClick: this.btnLpClear_onClick.bind(this)});
        this.btnPpAll.linkbutton({onClick: this.btnPpAll_onClick.bind(this)});
        this.btnPpClear.linkbutton({onClick: this.btnPpClear_onClick.bind(this)});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
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

                this.lpList.datalist({
                    data: list,
                    valueField: "id",
                    textField: "paramname",
                    checkbox: true,
                    singleSelect: false,
                    lines: true
                });

                this.ppList.datalist({
                    data: period,
                    valueField: "id",
                    textField: "paramname",
                    checkbox: true,
                    singleSelect: false,
                    lines: true
                });

                let allLP = this.lpList.datalist("getRows");
                let allPP = this.ppList.datalist("getRows");

                if (this.filterParamsModel != null) {
                    for (let [key, value] of Object.entries(this.filterParamsModel)) {
                        for (let i = 0; i < allLP.length; i++) {
                            if (key == allLP[i].paramcode) {
                                this.lpList.datalist("selectRow", i);
                                break;
                            }
                        }
                        for (let i = 0; i < allPP.length; i++) {
                            if (key == allPP[i].paramcode) {
                                this.ppList.datalist("selectRow", i);
                                break;
                            }
                        }
                    }
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    btnLpAll_onClick() {
        this.lpList.datalist("selectAll");
    }

    btnPpAll_onClick() {
        this.ppList.datalist("selectAll");
    }

    btnLpClear_onClick() {
        this.lpList.datalist("unselectAll");
    }

    btnPpClear_onClick() {
        this.ppList.datalist("unselectAll");
    }

    btnOk_onClick() {
        this.filterParams.DeleteFilter(function () {
            this.filterParams = new LibFilter("ordersParams");

            let lp = this.lpList.datalist("getSelections");
            let pp = this.ppList.datalist("getSelections");

            let hasParams = false;

            for (let i = 0; i < lp.length; i++) {
                this.filterParams.SetValue(lp[i].paramcode, lp[i].paramname);
                hasParams = true;
            }

            for (let i = 0; i < pp.length; i++) {
                this.filterParams.SetValue(pp[i].paramcode, pp[i].paramname);
                hasParams = true;
            }

            if (hasParams) {
                this.filterParams.SaveFilter();
            }

            this.ResultFunc(this.filterParams.filterObj);
            this.wOrdersFormFilterParams.window("close");
        }.bind(this));

    }
}