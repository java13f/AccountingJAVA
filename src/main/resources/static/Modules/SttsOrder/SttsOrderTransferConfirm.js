import {FormView} from "../Core/FormView.js";

export class SttsOrderTransferConfirm extends FormView {
    constructor() {
        super();
    }

    Show(options) {
        this.options = options; //JSON - объект с параметрами
        LoadForm("#ModalWindows", this.GetUrl("/SttsOrder/SttsOrderTransferConfirm"), this.InitFunc.bind(this));
    }

    InitFunc() {
        this.InitComponents("wSttsOrderTransferConfirm_Module_SttsOrder", ""); //Автоматическое получение идентификаторов формы
        this.InitCloseEvents(this.wSttsOrderTransferConfirm);//Инициализация закрытия формы по нажатию на клавиши "ESC" и "Enter"

        this.txMsg.textbox({editable:false});

        this.loadText();

        this.btnOk.linkbutton({onClick: () => {
                this.ResultFunc(true);
                this.wSttsOrderTransferConfirm.window("close");
            }
        });

        this.btnCancel.linkbutton({onClick:()=>{this.wSttsOrderTransferConfirm.window("close");}});//Обработка события нажатия на кнопку отмены
    }

    loadText() {
        this.txMsg.textbox("setValue", this.options.TxtFrom === "" ? this.options.TxtTo : this.options.TxtFrom);
    }
}