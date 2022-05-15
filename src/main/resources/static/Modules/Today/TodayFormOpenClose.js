import {FormView} from "../Core/FormView.js";

export class TodayFormOpenClose extends FormView {
    constructor() {
        super();
        this.mode = null;
    }

    Show(options) {
        this.options = options;
        LoadForm("#ModalWindows", this.GetUrl("/Today/TodayFormOpenClose"), this.InitFunc.bind(this));
    }

    InitFunc() {
        this.InitComponents("wTodayFormOpenClose_Module_TodayFormOpenClose", "");
        this.InitCloseEvents(this.wTodayFormOpenClose);

        this.btnOk.linkbutton({onClick: this.ExistTextBox.bind(this)});
        this.btnCancel.linkbutton({
            onClick: () => {
                this.wTodayFormOpenClose.window("close")
            }
        });

        if (this.options.AddMode) {
            this.pbEditMode.attr("class", "icon-addmode");
            this.wTodayFormOpenClose.window({title: "Открытие года"});
            this.lAction.html("Введите год, доступ к которому вы хотите открыть в базе данных ");
            this.mode = 1;
        } else {
            this.pbEditMode.attr("class", "icon-editmode");
            this.wTodayFormOpenClose.window({title: "Введите год закрытия"});
            this.lAction.html(" Введите год, который вы хотите закрыть");
            this.mode = 0;
        }


    }

    ExistTextBox(){
        let year = this.txYears.textbox("getText");
        let tyear = year.trim();
        if(year.length === 0){
            this.ShowToolTip("#divtbYears_Module_TodayFormOpenClose","Заполните поле \"Год\"",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }
        if (year.trim() === ""){
            this.ShowToolTip("#divtbYears_Module_TodayFormOpenClose","Заполните поле \"Год\"",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }
        if(isNaN(year)){
            this.ShowToolTip("#divtbYears_Module_TodayFormOpenClose","Поле год должно быть числовым" ,{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }
        if(tyear.length > 4 || tyear.length < 4){
            this.ShowToolTip("#divtbYears_Module_TodayFormOpenClose","Длинна поля год должна быть 4 цифры" ,{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }
        if(year < 2019 || year >=2100){
            this.ShowToolTip("#divtbYears_Module_TodayFormOpenClose","Год не может быть меньше 2019" ,{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }
        let obj ={year:year,mode: this.mode};
        this.FuncAddDay(obj);
    }

FuncAddDay(obj){
    $.ajax({
        method:"POST",
        data: JSON.stringify(obj),
        url: this.GetUrl('/Today/addDays'),
        contentType: "application/json; charset=utf-8",
        success: function(data){
            if(this.ResultFunc!=null)
            {
                this.ResultFunc(obj.year);
                this.wTodayFormOpenClose.window("close");
            }
        }.bind(this),
        error: function(data){
            this.ShowErrorResponse(data.responseJSON);
        }.bind(this)
    });
}
}