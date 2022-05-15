import {FormView} from "../Core/FormView.js";

export class OrderFieldsFormEdit extends FormView{
    constructor() {
        super();
    }

    /**
     * Показать форму добавления/изменения записи
     * @param options
     * @constructor
     */
    Show(options){
        this.options = options; //JSON - объект с параметрами
        LoadForm("#ModalWindows", this.GetUrl("/OrderFields/OrderFieldsFormEdit"), this.InitFunc.bind(this));
    }

    /**
     * Инциализация интерфейса пользователя
     * @constructor
     */
    InitFunc(){
        this.InitComponents("wOrderFieldsFormEdit_Module_OrderFields", ""); //Автоматическое получение идентификаторов формы
        this.InitCloseEvents(this.wOrderFieldsFormEdit);//Инициализация закрытия формы по нажатию на клавиши "ESC" и "Enter"

        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({onClick:()=>{this.wOrderFieldsFormEdit.window("close")}});//Обработка события нажатия на кнопку отмены

        if (this.options.AddMode) {
            this.pbEditMode.attr("class", "icon-addmode");
            this.wOrderFieldsFormEdit.window({title: "Добавление новой записи"});
            this.lAction.html("Введите данные для новой записи");
        }
        else {
            this.pbEditMode.attr("class", "icon-editmode");
            this.wOrderFieldsFormEdit.window({title: "Редатирование записи"});
            this.lAction.html("Введите данные для редактирования текущей записи");
            if (this.options.editMode) { //editMode: true - запсь открыта на редактирование, false - запись открыта на просмотр. Данная насройка нужна только для изменения или просмотра записи
                this.btnOk.linkbutton({disabled: false});
            } else {
                this.btnOk.linkbutton({disabled: true});
            }
            this.LoadOrderFields();
        }
    }

    /**
     * Обработка нажатия на кнопку "ОК"
     */
    btnOk_onClick(){
        let id = this.txId.textbox("getText");
        let code = this.txCode.textbox("getText");
        let name = this.txName.textbox("getText");

        if(id.length == 0){
            id = "-1";
        }
        if(code.length == 0){
            this.ShowError("Введите пожалуйста код Поля заявки");
            return false;
        }
        if(code.length<2 || code.length > 2){
            this.ShowError("Код Поля заявки должен содержать два символа");
            return false;
        }
        if(isNaN(code)){
            this.ShowError("Код поля заявки должен содержать только числа");
            return false;
        }
        if(name.length == 0){
            this.ShowError("Введите пожалуйста наименование Поля заявки");
            return false;
        }

        let obj = {id: id, code: code, name: name}
        this.ExistsOrderFields(obj)
        return false;

    }
    /**
     * Проверка существования поля заявки
     * @param obj территория
     * @constructor
     */
    ExistsOrderFields(obj){
        $.ajax({
            method:"get",
            url: this.GetUrl('/OrderFields/exists?id=' + obj.id.toString() + '&code='+obj.code),
            success: function(data){
                if(data){
                    this.ShowWarning("Поле заявки с кодом " + obj.code + " уже существует в баз данных");
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

    /**
     * Сохранение Заявки
     * @param obj код территории
     * @constructor
     */
    Save(obj){
        $.ajax({
            method:"POST",
            data: JSON.stringify(obj),
            url: this.GetUrl('/OrderFields/save'),
            contentType: "application/json; charset=utf-8",
            success: function(data){
                if(this.ResultFunc!=null)
                {
                    this.ResultFunc(data);
                    this.wOrderFieldsFormEdit.window("close");
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Функция загрузки формы для просмотра или редактирования
     * @constructor
     */
    LoadOrderFields(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/OrderFields/get?id='+this.options.id),
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




}
