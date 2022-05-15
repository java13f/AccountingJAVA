import {FormView} from "../Core/FormView.js";

export class UnitsFormEdit extends FormView {
    constructor() {
        super();
   }
    Show(options) {
        this.options = options;
        LoadForm("#ModalWindows", this.GetUrl("/Units/UnitsFormEdit"), this.InitFunc.bind(this));
    }



    InitFunc(){
        this.InitComponents("wUnitsFormEdit_Module_Units", "");
        this.InitCloseEvents(this.wUnitsFormEdit);
        this.btnCancel.linkbutton({onClick:()=>{this.wUnitsFormEdit.window("close")}});

        this.btnOk.linkbutton({onClick: ()=>{this.btnOk_onClick()}});

        if (this.options.AddMode) {
            this.pbEditMode.attr("class", "icon-addmode");
            this.wUnitsFormEdit.window({title: "Добавление новой записи"});
            this.lAction.html("Введите данные для новой записи");
        }
        else {
            this.pbEditMode.attr("class", "icon-editmode");
            this.wUnitsFormEdit.window({title: "Редатирование записи"});
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
            url: this.GetUrl('/Units/get?id='+ this.options.id),
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
    /**
     * по нажатию на кнопку OK
     */
    btnOk_onClick(){
        let id = this.txId.textbox("getText");
        let name = this.txName.textbox("getText");
        let code = this.txCode.textbox("getText");
        if(id.length == 0){
            id = "-1";
        }
        if(name.length == 0){
            this.ShowToolTip("#divtbName_Module_Units","Заполните поле \"Наименование\"",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }
        if(code.length == 0){
            this.ShowToolTip("#divtbCode_Module_Units","Заполните поле \"Код\"",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }
        if(code.length > 10){
            this.ShowToolTip("#divtbCode_Module_Units","Заполните поле \"Код\" не может быть больше 10 символов",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }
        let obj = {id: id, name: name, code: code};
        this.ExistsUnits(obj);
        return false;
    }
    ExistsUnits(obj){
        $.ajax({
            method:"get",
            url: this.GetUrl('/Units/exists?id=' + obj.id + '&name='+obj.name + '&code='+obj.code ),
            success: function(data){

                 if (data){
                    this.ShowToolTip("#divtbCode_Module_Units","Такой \"Код\" уже существует",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
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
            url: this.GetUrl('/Units/save'),
            contentType: "application/json; charset=utf-8",
            success: function(data){
                if(this.ResultFunc!=null)
                {
                    this.ResultFunc(data);
                    this.wUnitsFormEdit.window("close");
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }
}