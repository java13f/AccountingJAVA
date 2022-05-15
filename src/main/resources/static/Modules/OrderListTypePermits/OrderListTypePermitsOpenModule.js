import {FormView} from "../Core/FormView.js";


export class OrderListTypePermitsOpenModule extends FormView {
    constructor() {
        super();

        this.OrderIndex = 0;
        this.OrderId = -1;
    }

    Show(options) {
        this.options = options;
        LoadForm("#ModalWindows", this.GetUrl("/OrderListTypePermits/OrderListTypePermitsOpenModule"), this.InitFunc.bind(this));
    }

    InitFunc() {
        this.InitComponents("wSelected_Module_OrderListTypePermits", "");
        this.InitCloseEvents(this.wSelected, false);
        AddKeyboardNavigationForGrid(this.dgSelectedListParams);

        this.dgSelectedListParams.datagrid({
            loadFilter: this.LoadFilter.bind(this),
            onLoadError:(data)=> {this.ShowErrorResponse(data.responseJSON);},
            onLoadSuccess: this.OnLoad.bind(this),

        });

        this.btnCancel.linkbutton({onClick: function(){ this.wSelected.window("close") }.bind(this)});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this) });

        this.loadData();
    }

    /**
     * загрузка записей в грид
     * @constructor
     */
    loadData(){
        $.ajax({
            method:"get",
            url: this.GetUrl("/OrderListTypePermits/getListParamsList"),
            success: function(data){
                this.dgSelectedListParams.datagrid({data:data});
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });

        this.dgSelectedListParams.datagrid("getRowIndex", 1);
    }

    /**
     * выставоление курсора
     * @param data
     * @constructor
     */
    OnLoad(data){
    if(data.total>0) {
        if (this.OrderId != -1) {
            this.dgSelectedListParams.datagrid("selectRecord", this.OrderId);
        } else {
            if (this.OrderIndex >= 0 && this.OrderIndex < data.total) {
                this.dgSelectedListParams.datagrid("selectRow", this.OrderIndex);
            } else if (data.total > 0) {
                this.dgSelectedListParams.datagrid("selectRow", data.total - 1);
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
        if(this.dgSelectedListParams.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для выбора");
            return false;
        }

        let selData = this.dgSelectedListParams.datagrid("getSelected");

        if(selData==null) {
            this.ShowWarning("Выберите запись");
            return false;
        }

        if(this.ResultFunc!=null) {
            this.ResultFunc({id: selData.id});
        }

        this.wSelected.window("close");

        return true;
    }
}