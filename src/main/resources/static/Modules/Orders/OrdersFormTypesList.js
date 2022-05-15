import {FormView} from "../Core/FormView.js";

/**
 * Основной класс модуля
 */
export class OrdersFormTypesList extends FormView {
    constructor() {
        super();
    }

    /**
     * Показать форму
     * @param options
     * @constructor
     */
    Show(options) {
        LoadForm("#ModalWindows", this.GetUrl("/Orders/OrdersFormTypesList"), this.InitFunc.bind(this));
    }

    InitFunc() {
        this.InitComponents("wOrdersFormTypesList_Module_Orders", "");
        this.InitCloseEvents(this.wOrdersFormTypesList);
        this.btnCancel.linkbutton({
            onClick: () => {
                this.wOrdersFormTypesList.window("close")
            }
        });
        this.dgTypes.datagrid({
            url: this.GetUrl("/Orders/listOrderTypes")
        });

        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
    }

    btnOk_onClick() {
        let selectedData = this.dgTypes.datagrid("getSelected");
        if (selectedData == null) {
            this.ShowSlide("Предупреждение", "Выберите тип заявки!");
        }
        this.ResultFunc(selectedData);
        this.wOrdersFormTypesList.window("close")
    }
}