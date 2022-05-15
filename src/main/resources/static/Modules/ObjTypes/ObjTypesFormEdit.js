import {FormView} from "../Core/FormView.js";

export class ObjTypesFormEdit extends FormView {

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
            LoadForm("#ModalWindows", this.GetUrl("/ObjTypes/ObjTypesFormEdit"), this.InitFunc.bind(this));
        }

    /**
     * Инциализация интерфейса пользователя
     * @constructor
     */
    InitFunc(){
        this.InitComponents("wObjTypesFormEdit_Module_ObjTypes", "");
        this.InitCloseEvents(this.wObjTypesFormEdit);
        this.btnCancel.linkbutton({onClick:()=>{this.wObjTypesFormEdit.window("close")}});
        if (this.options.AddMode) {
            this.pbEditMode.attr("class", "icon-addmode");
            this.wObjTypesFormEdit.window({title: "Добавление новой записи"});
            this.lAction.html("Введите данные для новой записи");
        }
        else {
            this.pbEditMode.attr("class", "icon-editmode");
            this.wObjTypesFormEdit.window({title: "Редактирование записи"});
            this.lAction.html("Введите данные для редактирования текущей записи");
            if (this.options.editMode) {
                this.btnOk.linkbutton({disabled: false});
            } else {
                this.btnOk.linkbutton({disabled: true});
            }
            this.LoadObjTypes();
        }
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
    }

    /**
     * Функция загрузки
     * @constructor
     */
    LoadObjTypes(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/ObjTypes/get?id='+this.options.id),
            success: function(data){
                this.txId.textbox("setText", data.id);
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
     * проверка на уникалность наименования
     * @param obj территория
     * @constructor
     */
    ExistsObjTypes(obj){
        $.ajax({
            method:"get",
            url: this.GetUrl('/ObjTypes/exists?id=' + obj.id.toString() + '&name='+obj.name),
            success: function(data){
                if(data){
                    this.ShowWarning("Такой объект " + obj.name + " уже существует в баз данных");
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
     * Сохранение
     * @param obj код территории
     * @constructor
     */
    Save(obj){
        $.ajax({
            method:"POST",
            data: JSON.stringify(obj),
            url: this.GetUrl('/ObjTypes/save'),
            contentType: "application/json; charset=utf-8",
            success: function(data){
                if(this.ResultFunc!=null)
                {
                    this.ResultFunc(data);
                    this.wObjTypesFormEdit.window("close");
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * по нажатию на кнопку OK
     */
    btnOk_onClick(){
        let id = this.txId.textbox("getText");
        let name = this.txName.textbox("getText");
        if(id.length == 0){
            id = "-1";
        }
        if(name.length == 0){
            this.ShowError("Введите пожалуйста наименование ");
            return false;
        }
        let obj = {id: id, name: name}
        this.ExistsObjTypes(obj)
        return false;
    }
}

