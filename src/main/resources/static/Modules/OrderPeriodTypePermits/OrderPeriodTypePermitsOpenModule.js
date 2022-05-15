import {FormView} from "../Core/FormView.js";


export class OrderPeriodTypePermitsOpenModule extends FormView {
    constructor() {
        super();

        this.OrderIndex = 0;
        this.OrderId = -1;

    }
    Show(options) {
        this.options = options;
        LoadForm("#ModalWindows", this.GetUrl("/OrderPeriodTypePermits/OrderPeriodTypePermitsOpenModule"), this.InitFunc.bind(this));
    }

    InitFunc(){

        this.InitComponents("wOpenModule_Module_OrderPeriodTypePermits", "");
        this.InitCloseEvents(this.wOpenModule, false);
        AddKeyboardNavigationForGrid(this.dgOpenModulePeriodParams);
        this.dgOpenModulePeriodParams.datagrid({
            loadFilter: this.LoadFilter.bind(this),
            onLoadError:(data)=> {this.ShowErrorResponse(data.responseJSON);},
            onLoadSuccess: this.OnLoad.bind(this),

        });
        this.btnCancel.linkbutton({onClick: function(){ this.wOpenModule.window("close") }.bind(this)});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this) });
        this.LoadTable();
    }

    /**
     * загрузка записей в грид
     * @constructor
     */
    LoadTable(){
    $.ajax({
        method:"get",
        url: this.GetUrl("/OrderPeriodTypePermits/GetListPeriodParams"),
        success: function(data){

            this.dgOpenModulePeriodParams.datagrid({data:data});
        }.bind(this),
        error: function(data){
            this.ShowErrorResponse(data.responseJSON);
        }.bind(this)
    });
    this.dgOpenModulePeriodParams.datagrid("getRowIndex", 1);
    //this.dgOpenModulePeriodParams.datagrid({url: this.GetUrl("/OrderPeriodTypePermits/GetListPeriodParams" )});
}

    /**
     * выставоление курсора
     * @param data
     * @constructor
     */
    OnLoad(data){
    if(data.total>0) {
        if (this.OrderId != -1) {
            this.dgOpenModulePeriodParams.datagrid("selectRecord", this.OrderId);
        } else {
            if (this.OrderIndex >= 0 && this.OrderIndex < data.total) {
                this.dgOpenModulePeriodParams.datagrid("selectRow", this.OrderIndex);
            } else if (data.total > 0) {
                this.dgOpenModulePeriodParams.datagrid("selectRow", data.total - 1);
            }
        }
        this.OrderId = -1;
        this.OrderIndex = 0;
    }
}

    /**
     * обработка нажатия на кнопку ОК
     * @returns {boolean}
     */
    btnOk_onClick(){
        if(this.dgOpenModulePeriodParams.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для выбора");
            return false;
        }
        let selData = this.dgOpenModulePeriodParams.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись");
            return false;
        }
        if(this.ResultFunc!=null) {
            this.ResultFunc({id: selData.periodid});
        }
        this.wOpenModule.window("close");
        return true;
    }
}