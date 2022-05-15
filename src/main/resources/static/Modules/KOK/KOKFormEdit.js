
import {FormView} from "../Core/FormView.js";

export class KOKFormEdit extends FormView{

    constructor() {
        super();
        this.AppId = -1;
    }



    /**
     * Загрузить и показать UI формы
     * @param options - настройки
     */
    Show(options) {
        this.options = options;
        LoadForm("#ModalWindows", this.GetUrl("/KOK/KOKFormEdit"), this.InitFunc.bind(this));
    }


    /**
     * Функция инициализации пользовательского интерфейса
     */
    InitFunc(){
        this.InitComponents("wKokEdit_Module_Kok", "");
        this.InitCloseEvents(this.wKokEdit);
        this.btnCancel.linkbutton({onClick:()=>{this.wKokEdit.window("close")}});

        this.btnOk.linkbutton({onClick: ()=>{this.btnOk_onClick()}});

        if (this.options.AddMode) {
            this.pbEditMode.attr("class", "icon-addmode");
            this.wKokEdit.window({title:"Добавление новой записи"});
            this.lAction.html("Введите данные для новой записи");
        }
        else {
            this.pbEditMode.attr("class", "icon-editmode");
            this.wKokEdit.window({title:"Редатирование записи"});
            this.lAction.html("Введите данные для редактирования текущей записи");
            if(this.options.editMode){
                this.btnOk.linkbutton({disabled: false});
            }
            else{
                this.btnOk.linkbutton({disabled: true});
            }
            this.LoadKok(this.options.id);
        }
    }

    /**
     * Загрузка данных кода органа казначейства
     * @param KokId - идентификатор кода органа казначейства
     */
    LoadKok(KokId){
        $.ajax({
            method:"get",
            url: this.GetUrl('/KOK/Get?id='+KokId),
            success: function(data){
                this.txId.textbox("setText", data.id);
                this.txCode.textbox("setText", data.code);
                this.txName.textbox("setText", data.name);
                this.txDirector.textbox("setText", data.director);
                this.txAccountant.textbox("setText", data.accountant);
                this.txStateCode.textbox("setText", data.state_code);
                this.txCreator.textbox("setText", data.creator);
                this.txCreated.textbox("setText", data.created);
                this.txChanger.textbox("setText", data.changer);
                this.txChanged.textbox("setText", data.changed);
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }
    /**
     * Обработка сохранения записи
     */
    btnOk_onClick(){
        let Id = this.txId.textbox("getText");
        let Code = this.txCode.textbox("getText");
        let Name = this.txName.textbox("getText");
        let Director = this.txDirector.textbox("getText");
        let Accountant = this.txAccountant.textbox("getText");
        let StatCode = this.txStateCode.textbox("getText");

        if(Id.length == 0){
            Id = "-1";
        }
        if(Code.length==0){

            this.ShowToolTip("#divtbCode_Module_KokEdit","Введите пожалуйста код органа казначейства",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }
        if(Code.length < 4 || Code.length > 4){

            this.ShowToolTip("#divtbCode_Module_KokEdit","Код орагана казначейства должен содержать 4 цифры",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }
        if(isNaN(Code)){

            this.ShowToolTip("#divtbCode_Module_KokEdit","Код орагана казначейства должен содержать только цифры",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }
        if (StatCode.length == 0 ){
            this.ShowToolTip("#divtbStateCode_Module_KokEdit","Введите пожалуйста  \"ЕГРЮЛ\"",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }
        if(isNaN(StatCode)){
            this.ShowToolTip("#divtbStateCode_Module_KokEdit","ЕГРЮЛ может содержать только цифры",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }
        if (StatCode.length != 8 && StatCode.length != 10 ){
        this.ShowToolTip("#divtbStateCode_Module_KokEdit","ЕГРЮЛ должен содержать 8-10 цифр",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
        return false;
        }
        if(Name.length==0){
            this.ShowToolTip("#divtbName_Module_KokEdit","Введите пожалуйста наименование кода органа казначейства",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }
        let json = {id: Id, code: Code, name:Name, director:Director, accountant:Accountant, state_code:StatCode};
        this.ExistsKok(json);
        return false;
    }
    ExistsKok(json){
        $.ajax({
            method:"get",
            url: this.GetUrl('/KOK/Exists?id=' + json.id.toString() + "&code="+encodeURIComponent(json.code)),
            success: function(data){
                if(data){
                    this.ShowToolTip("#divtbCode_Module_KokEdit","Орган казначейства с таким кодом  уже существует",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
                }
                else {
                    this.Save(json);
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }
    /**
     * Продолжение сохранения кода органа казначейства
     * @param object - код органа казначейства
     */
    Save(json){
        $.ajax({
            method:"POST",
            data: JSON.stringify(json),
            url: this.GetUrl('/KOK/Save'),
            contentType: "application/json; charset=utf-8",
            success: function(data){
                if(this.ResultFunc!=null)
                {
                    this.ResultFunc(data);
                    this.wKokEdit.window("close");
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }
}