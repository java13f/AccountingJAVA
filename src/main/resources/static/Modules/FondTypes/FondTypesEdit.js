import {FormView} from "../Core/FormView.js";

export class FondTypesEdit extends FormView{
    constructor() {
        super();
    }

    Show(options){
        this.options = options;
        LoadForm("#ModalWindows", this.GetUrl("/FondTypes/FondTypesEdit"), this.InitFunc.bind(this));
    }
    InitFunc(){
        this.InitComponents("wFondTypesEdit_Module_FondTypes", "");
        this.InitCloseEvents(this.wFondTypesEdit);
        this.btnCancel.linkbutton({onClick:()=>{this.wFondTypesEdit.window("close")}});

        this.btnOk.linkbutton({onClick: ()=>{this.btnOk_onClick()}});

        if (this.options.AddMode) {
            this.pbEditMode.attr("class", "icon-addmode");
            this.wFondTypesEdit.window({title: "Добавление новой записи"});
            this.lAction.html("Введите данные для новой записи");
        }
        else {
            this.pbEditMode.attr("class", "icon-editmode");
            this.wFondTypesEdit.window({title: "Редатирование записи"});
            this.lAction.html("Введите данные для редактирования текущей записи");
            if (this.options.editMode) { //editMode: true - запсь открыта на редактирование, false - запись открыта на просмотр. Данная насройка нужна только для изменения или просмотра записи
                this.btnOk.linkbutton({disabled: false});
            } else {
                this.btnOk.linkbutton({disabled: true});

            }
            this.GetTextBox();
        }
    }
    GetTextBox(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/FondTypes/get?id='+ this.options.id),
            success: function(data){
                this.txId.textbox("setText", data.id);
                this.txName.textbox("setText", data.name);
                this.txCode.textbox("setText", data.code);
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
    btnOk_onClick(){
        let id = this.txId.textbox("getText");
        let name = this.txName.textbox("getText");
        let code = this.txCode.textbox("getText");
        if(id.length == 0){
            id = "-1";
        }
        if(code.length == 0){
            this.ShowToolTip("#divtbCode_Module_FondTypes","Заполните поле \"Код\"",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }
        if(code.length > 10){
            this.ShowToolTip("#divtbCode_Module_FondTypes","Заполните поле \"Код\" не может быть больше 10 цифр",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }
        if(isNaN(code)){
            this.ShowToolTip("#divtbCode_Module_FondTypes","Поле код может содержать только цифры",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }
        if(code.length>4){
            this.ShowToolTip("#divtbCode_Module_FondTypes","Поле код может содержать не больше 4 цифр",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }
        if(name.length == 0){
            this.ShowToolTip("#divtbName_Module_FondTypes","Заполните поле \"Наименование\"",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }
        if(name.trim() === ""){
            this.ShowToolTip("#divtbName_Module_FondTypes","Заполните поле \"Наименование\"",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }
        let obj = {id: id, name: name, code: code};
        this.ExistsUnits(obj);
        return false;
    }
    ExistsUnits(obj){
        $.ajax({
            method:"get",
            url: this.GetUrl('/FondTypes/exists?id=' + obj.id + '&code='+obj.code ),
            success: function(data){
                if (data){
                    this.ShowToolTip("#divtbCode_Module_FondTypes","Такой \"Код\" уже существует",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
                    return false;
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
    Save(obj){
        $.ajax({
            method:"POST",
            data: JSON.stringify(obj),
            url: this.GetUrl('/FondTypes/save'),
            contentType: "application/json; charset=utf-8",
            success: function(data){
                if(this.ResultFunc!=null)
                {
                    this.ResultFunc(data);
                    this.wFondTypesEdit.window("close");
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }
}