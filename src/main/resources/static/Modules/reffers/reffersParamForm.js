import {FormView} from "../Core/FormView.js";

export class reffersParamForm extends FormView {
    constructor() {
        super();
    }

    Start(options) {
        this.options = options; //JSON - объект с параметрами
        LoadForm("#ModalWindows",
            this.GetUrl("/reffers/reffersParamFormHtml"), this.InitFunc.bind(this));
    }

    InitFunc() {
        // Окно
        this.InitComponents("wreffersParamForm_Module_Reffers", "");
        this.InitCloseEvents(this.wreffersParamForm);
        this.wreffersParamForm.window('resize', {width: 500, height: 200});
        this.wreffersParamForm.window('center');

    }
}