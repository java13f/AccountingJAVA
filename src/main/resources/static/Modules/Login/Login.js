import {FormView} from "../Core/FormView.js";

class Login extends FormView {
    constructor() {
        super();
    }

    /**
     * Инициализация формы
     * @constructor
     */
    Init(){
        this.InitComponents("wLoginForm_Module_Login", "");
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)})
        this.btnCancel.linkbutton({onClick: this.btnCancel_onClick.bind(this)})
    }
    /**
     * Обработка нажатия на кнопку "ОК"
     */
    btnOk_onClick(){
        this.fLogin.submit();
    }

    /**
     * Отоменить вход в систему
     */
    btnCancel_onClick(){
        document.location.href = this.GetUrl("/MainApp");
    }
}
export function LoginStart(){
    let form = new Login();
    form.Init();
}