import {FormView} from "../Core/FormView.js";

export class OrderTypesFormEdit extends FormView{
    constructor() {
        super();
        this.ModeId = null;
        this.ModeData = [{ "id" : -1, "name" : "-1 - Уменьшается стоимость"}, { "id" : 0, "name" : "0 - Стоимость не изменяется"}, { "id" : 1, "name" : "1 - Увеличивается стоимость"}];
    }

    /**
     * Показать форму добавления/изменения записи
     * @param options
     * @constructor
     */
    Show(options) {
        this.options = options; //JSON - объект с параметрами
        LoadForm("#ModalWindows", this.GetUrl("/OrderTypes/OrderTypesFormEdit"), this.InitFunc.bind(this));
    }


    /**
     * Инциализация интерфейса пользователя
     * @constructor
     */
    InitFunc(){
        this.InitComponents("wOrderTypesFormEdit_Module_OrderTypes", ""); //Автоматическое получение идентификаторов формы
        this.InitCloseEvents(this.wOrderTypesFormEdit);//Инициализация закрытия формы по нажатию на клавиши "ESC" и "Enter"

        if (this.options.AddMode) {
            this.pbEditMode.attr("class", "icon-addmode");
            this.wOrderTypesFormEdit.window({title: "Добавление новой записи"});
            this.lAction.html("Введите данные для новой записи");
            this.LoadModeList();
        }
        else {
            this.pbEditMode.attr("class", "icon-editmode");
            this.wOrderTypesFormEdit.window({title: "Редатирование записи"});
            this.lAction.html("Введите данные для редактирования текущей записи");
            if (this.options.editMode) { // editMode: true - запсь открыта на редактирование, false - запись открыта на просмотр. Данная насройка нужна только для изменения или просмотра записи
                this.btnOk.linkbutton({disabled: false});
            } else {
                this.btnOk.linkbutton({disabled: true});

                this.txName.textbox({editable:false});
                this.txFunc.textbox({editable:false});
                this.txModul.textbox({editable:false});
                this.txName.textbox({editable:false});
                this.txCode.textbox({editable:false});
                this.txCodeJS.textbox({editable:false});
            }
            this.LoadOrderTypes();
        }

        this.btnCancel.linkbutton({onClick:()=>{this.wOrderTypesFormEdit.window("close")}});//Обработка события нажатия на кнопку отмены
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
    }

    /**
     * Функция загрузки типа заявки для просмотра или редактирования
     * @constructor
     */
    LoadOrderTypes(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/OrderTypes/get?id='+this.options.id),
            success: function(data){
                this.txId.textbox("setText", data.id);
                this.txCode.textbox("setText", data.code);
                this.txName.textbox("setText", data.name);
                this.ModeId = data.mode;
                this.txFunc.textbox("setText", data.func);
                this.txModul.textbox("setText", data.modul);
                this.txCodeJS.textbox("setText", data.codejs);
                this.txCreator.textbox("setText", data.creator);
                this.txCreated.textbox("setText", data.created);
                this.txChanger.textbox("setText", data.changer);
                this.txChanged.textbox("setText", data.changed);

                this.LoadModeList();
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    LoadModeList() {
        this.cbMode.combobox({
            valueField: 'id',
            textField: 'name',
            data: this.ModeData
        });

        this.cbMode.combobox('setValue', '-2');
        this.cbMode.combobox('setText','');
        if (this.ModeId != null) {
            for (let iMode = 0; iMode < this.ModeData.length; iMode++) {
                let mode = this.ModeData[iMode];
                if (mode.id == this.ModeId) {
                    this.cbMode.combobox("setValue", this.ModeId);
                }
            }
        }
    }

    /**
     * Сохранение типа заявки
     * @param obj тип заявки
     * @constructor
     */
    Save(obj){
        $.ajax({
            method:"POST",
            data: JSON.stringify(obj),
            url: this.GetUrl('/OrderTypes/save'),
            contentType: "application/json; charset=utf-8",
            success: function(data){
                if(this.ResultFunc!=null)
                {
                    this.ResultFunc(data);
                    this.wOrderTypesFormEdit.window("close");
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
        let code = this.txCode.textbox("getText");
        let name = this.txName.textbox("getText");
        let func = this.txFunc.textbox("getText");
        let modul = this.txModul.textbox("getText");
        let codejs = this.txCodeJS.textbox("getText");
        if(id.length == 0){
            id = "-1";
        }
        if(code.length == 0){
            this.ShowError("Введите пожалуйста код типа заявки");
            return false;
        }
        if(code.length < 2 || code.length > 2){
            this.ShowError("Код типа заявки должен содержать два символа");
            return false;
        }
        if(isNaN(code)){
            this.ShowError("Код типа заявки должен содержать только числа");
            return false;
        }
        if(name.length == 0){
            this.ShowError("Введите пожалуйста наименование типа заявки");
            return false;
        }

        if(this.cbMode.combobox('getText').length == 0){
            this.ShowError("Выберите пожалуйста режим стоимости");
            return false;
        }
        if(modul.length == 0){
            this.ShowError("Введите пожалуйста код модуля");
            return false;
        }
        if(func.length == 0){
            this.ShowError("Введите пожалуйста название функции");
            return false;
        }
        if(codejs.length == 0){
            this.ShowError("Введите пожалуйста код модуля (.js)");
            return false;
        }

        this.ModeId = this.cbMode.combobox("getValue");

        let obj = {id: id, code: code, name: name, func: func, modul: modul, mode: this.ModeId, codejs: codejs};
        this.ExistsOrderTypes(obj);
        return false;
    }

    /**
     * Проверка существования типа заявки в базе данных
     * @param obj тип заявки
     * @constructor
     */
    ExistsOrderTypes(obj){
        $.ajax({
            method:"get",
            url: this.GetUrl('/OrderTypes/exists?id=' + obj.id.toString() + '&code='+obj.code),
            success: function(data){
                if(data){
                    this.ShowWarning("Тип заявки с кодом " + obj.code + " уже существует в базе данных");
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
