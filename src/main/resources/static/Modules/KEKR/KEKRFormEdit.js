import {FormView} from "../Core/FormView.js";

export class KEKRFormEdit extends FormView{
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
        LoadForm("#ModalWindows", this.GetUrl("/KEKR/KEKRFormEdit"), this.InitFunc.bind(this));
    }

    /**
     * Инциализация интерфейса пользователя
     * @constructor
     */
    InitFunc(){
        // Инициализация компонентов
        this.InitComponents("wKEKRFormEdit_Module_KEKR", "");
        this.InitCloseEvents(this.wKEKRFormEdit);

        // Привязываем события на элементы формы
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({onClick:()=>{this.wKEKRFormEdit.window("close")}});

        // Загрузка данных на форму
        if (this.options.AddMode) {
            this.pbEditMode.attr("class", "icon-addmode");
            this.wKEKRFormEdit.window({title: "Добавление новой записи"});
            this.lAction.html("Введите данные для новой записи");
        }
        else {
            this.pbEditMode.attr("class", "icon-editmode");
            if (this.options.editMode) {
                this.wKEKRFormEdit.window({title: "Редактирование записи"});
                this.lAction.html("Введите данные для редактирования текущей записи");
                this.btnOk.linkbutton({disabled: false});
            } else {
                this.btnOk.linkbutton({disabled: true});

                this.txCode.textbox({editable:false});
                this.txName.textbox({editable:false});
            }
            this.LoadRec();
        }
    }

    /**
     * Функция загрузки записи для просмотра или редактирования
     * @constructor
     */
    LoadRec(){
        $.ajax({
            method:"GET",
            url: this.GetUrl('/KEKR/GetRec?id='+this.options.id),
            success: function(data){
                this.txId.textbox("setText", data.id);
                this.txCode.textbox("setText", data.code);
                this.txName.textbox("setText", data.name);

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
     * Сохранение записи
     * @param obj
     * @constructor
     */
    Save(obj){
        $.ajax({
            method:"POST",
            data: JSON.stringify(obj),
            url: this.GetUrl('/KEKR/Save'),
            contentType: "application/json; charset=utf-8",
            success: function(data){
                if(this.ResultFunc != null)
                {
                    this.ResultFunc(data);
                    this.wKEKRFormEdit.window("close");
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

        if(id.length == 0){
            id = "-1";
        }

        if(code.length == 0){
            this.ShowWarning("Заполните пожалуйста поле \"Код\"");
            return false;
        }

        if(!$.isNumeric(code)){
            this.ShowWarning("\"Код\" должен состоять только из числовых значений");
            return false;
        }

        if(code.length > 4){
            this.ShowWarning("\"Код\" не может состоять больше чем из 4-х цифр");
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

        let obj = {id: id, code: code, name: name };
        this.ExistsRec(obj);
        return false;
    }

    /**
     * Проверка существования КЭКР с заданным кодом в базе данных
     * @param obj - запись с данными
     * @constructor
     */
    ExistsRec(obj){
        $.ajax({
            method:"GET",
            url: this.GetUrl('/KEKR/Exists?id=' + obj.id.toString() + '&code='+obj.code),
            success: function(data){
                if(data){
                    this.ShowWarning("КЭКР с кодом " + obj.code + " уже существует в базе данных");
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