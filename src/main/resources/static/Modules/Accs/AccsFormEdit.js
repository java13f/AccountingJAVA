import {FormView} from "../Core/FormView.js";

export class AccsFormEdit extends FormView{
    constructor() {
        super();

    }

    /**
     * Показать форму добавления/изменения записи
     * @param options
     * @constructor
     */
    Show(options){
        this.options = options;
        LoadForm("#ModalWindows", this.GetUrl("/Accs/AccsFormEdit"), this.InitFunc.bind(this));
    }

    /**
     * Инциализация интерфейса пользователя
     * @constructor
     */
    InitFunc(){
        this.InitComponents("wAccsFormEdit_Module_Accs", "");
        this.InitCloseEvents(this.wAccsFormEdit);

        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({onClick:()=>{this.wAccsFormEdit.window("close")}});

        // Загрузка данных на форму
        if (this.options.AddMode) {
            this.pbEditMode.attr("class", "icon-addmode");
            this.wAccsFormEdit.window({title: "Добавление новой записи"});
            this.lAction.html("Введите данные для новой записи");
        }
        else {
            this.pbEditMode.attr("class", "icon-editmode");
            if (this.options.editMode) {
                this.wAccsFormEdit.window({title: "Редактирование записи"});
                this.lAction.html("Введите данные для редактирования текущей записи");
                this.btnOk.linkbutton({disabled: false});
            } else {
                this.btnOk.linkbutton({disabled: true});

                this.txName.textbox({editable:false});
            }
            this.LoadAcc();
        }
    }

    /**
     * Функция загрузки счета для просмотра или редактирования
     * @constructor
     */
    LoadAcc(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/Accs/GetAcc?id='+this.options.id),
            success: function(data){
                this.txId.textbox("setText", data.id);
                this.txCode.textbox("setText", data.code);
                this.txName.textbox("setText", data.name);
                this.txTag.textbox("setText", data.tag);

                this.txCreator.textbox("setText", data.creator);
                this.txCreated.textbox("setText", data.created);
                this.txChanger.textbox("setText", data.changer);
                this.txChanged.textbox("setText", data.changed);

            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }


    /**
     * Сохранение счета
     * @param obj
     * @constructor
     */
    Save(obj){
        $.ajax({
            method:"POST",
            data: JSON.stringify(obj),
            url: this.GetUrl('/Accs/Save'),
            contentType: "application/json; charset=utf-8",
            success: function(data){
                if(this.ResultFunc != null)
                {
                    this.ResultFunc(data);
                    this.wAccsFormEdit.window("close");
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Обработка нажатия на кнопку "ОК"
     */
    btnOk_onClick(){
        let id = this.txId.textbox("getText");
        let name = this.txName.textbox("getText");
        let code = this.txCode.textbox("getText");
        let tag = this.txTag.textbox("getText");

        if(id.length == 0){
            id = "-1";
        }

        if(code.length == 0){
            this.ShowWarning("Заполните пожалуйста поле \"Номер счета\"");
            return false;
        }

        if(!$.isNumeric(code)){
            this.ShowWarning("\"Номер счета\" должен состоять только из цифр");
            return false;
        }

        if(code.length > 4){
            this.ShowWarning("\"Номер счета\" не может состоять больше чем из 4-x цифр");
            return false;
        }

        if(name.length == 0){
            this.ShowWarning("Заполните пожалуйста поле \"Наименование\"");
            return false;
        }

        if(name.length > 64){
            this.ShowWarning("\"Наименование\" не может состоять больше чем из 64-x символов");
            return false;
        }

        if(tag.length == 0){
            this.ShowWarning("Заполните пожалуйста поле \"Субсчет\"");
            return false;
        }

        if(!$.isNumeric(tag)){
            this.ShowWarning("\"Субсчет\" должен состоять только из цифр");
            return false;
        }

        if(tag.length > 2){
            this.ShowWarning("Поле \"Субсчет\" не может состоять больше чем из 2-x цифр");
            return false;
        }

        if(code.indexOf(tag) !== 0){
            this.ShowWarning("Номер субсчета не соответствует номеру счета");
            return false;
        }

        let obj = {id: id, code: code, name: name, tag: tag };
        this.ExistsAcc(obj);
        return false;
    }

    /**
     * Проверка существования счета с заданным кодом в базе данных
     * @param obj тип заявки
     * @constructor
     */
    ExistsAcc(obj){
        $.ajax({
            method:"GET",
            url: this.GetUrl('/Accs/Exists?id=' + obj.id.toString() + '&code='+obj.code),
            success: function(data){
                if(data){
                    this.ShowWarning("Счет с номером " + obj.code + " уже существует в базе данных");
                }
                else{
                    this.Save(obj);
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }
}