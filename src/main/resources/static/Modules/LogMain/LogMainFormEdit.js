import {FormView} from "../Core/FormView.js";

export class LogMainFormEdit extends FormView {
    constructor() {
        super();
        this.TranslogId = -1;
    }

    /**
     * Показать форму просмотра записи
     * @param id
     * @constructor
     */
    Show(id){
        this.TranslogId = id; //id выбранной записи
        LoadForm("#ModalWindows", this.GetUrl("/LogMain/LogMainFormEdit"), this.InitFunc.bind(this));
    }


    /**
     * Инциализация интерфейса пользователя
     * @constructor
     */
    InitFunc(){
        this.InitComponents("wLogMainFormEdit_Module_LogMain", ""); //Автоматическое получение идентификаторов формы
        this.InitCloseEvents(this.wLogMainFormEdit);//Инициализация закрытия формы по нажатию на клавиши "ESC" и "Enter"
        this.btnClose.linkbutton({onClick:()=>{this.wLogMainFormEdit.window("close")}});//Обработка события нажатия на кнопку отмены

        this.LoadLogMain();
    }


    /**
     * Функция загрузки лога для просмотра
     * @constructor
     */
    LoadLogMain(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/LogMain/get?id='+this.TranslogId),
            success: function(data){
                this.txId.textbox("setText", data.id);
                this.txDate.textbox("setText", data.date);
                this.txUserName.textbox("setText", data.userName);
                this.txTime.textbox("setText", data.time);
                let paramsAndSql = data.params +"\n\n"+ data.sql;
                this.txSQL.textbox("setText", paramsAndSql);
                this.txResult.textbox("setText", data.result);
                this.txApp.textbox("setText", data.appName);
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }



}