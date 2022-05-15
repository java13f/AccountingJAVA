import {FormView} from "../Core/FormView.js";

export class TodayFormEdit extends FormView{
    constructor(CurrentDate) {
        super();
        this.OpenModeData = [{ "id" : 1, "openmode":"закрыто", "flag":0}, { "id" : 2, "openmode":"открыто", "flag":1}];
        this.OpenModeId = -1;
        this.CurrentDate = CurrentDate;
    }

    /**
     * Показать форму добавления/изменения записи
     * @param options
     * @constructor
     */
    Show(options){
        this.options = options;
        LoadForm("#ModalWindows", this.GetUrl("/Today/TodayFormEdit"), this.InitFunc.bind(this));
    }

    InitFunc(){
        this.InitComponents("wTodayFormEdit_Module_Today", "");
        this.InitCloseEvents(this.wTodayFormEdit);

        this.dbDate.datebox({formatter: this.formatter.bind(this), parser: this.parser.bind(this)});

        this.btnCancel.linkbutton({onClick:()=>{this.wTodayFormEdit.window("close")}});
        this.cbOpenMode.combobox({onSelect: this.cbOpenMode_onSelect.bind(this)});

        if (this.options.AddMode) {
            this.pbEditMode.attr("class", "icon-addmode");
            this.wTodayFormEdit.window({title: "Добавление новой записи"});
            this.lAction.html("Введите данные для новой записи");
            this.SetOpenMode();
        }
        else {
            this.pbEditMode.attr("class", "icon-editmode");
            this.wTodayFormEdit.window({title: "Редатирование записи"});
            this.lAction.html("Введите данные для редактирования текущей записи");
            if (this.options.editMode) {
                this.btnOk.linkbutton({disabled: false});
            } else {
                this.btnOk.linkbutton({disabled: true});

            }
            this.LoadRecord();
        }

        this.btnCancel.linkbutton({onClick:()=>{this.wTodayFormEdit.window("close")}});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
    }

    // Форматер и парсер для Datebox
    formatter(date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        return (d < 10 ? ('0' + d) : d) + '.'
            + (m < 10 ? ('0' + m) : m) + '.'
            + y.toString();
    };

    parser(s) {
        if (!s) return new Date();
        var ss = (s.split('.'));
        var y = parseInt(ss[2], 10);
        var m = parseInt(ss[1], 10);
        var d = parseInt(ss[0], 10);
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
            return new Date(y, m - 1, d);
        } else {
            return new Date();
        }
    };


    /**
     * Загрузить открываемую запись в поля
     * @constructor
     */
    LoadRecord(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/Today/getTodayRecord?id='+this.options.id),
            success: function(data){
                this.txId.textbox("setText", data.id);
                this.dbDate.datebox("setValue", data.date);
                this.OpenModeId = data.openmode;
                this.txCreator.textbox("setText", data.creator);
                this.txCreated.textbox("setText", data.created);
                this.txChanger.textbox("setText", data.changer);
                this.txChanged.textbox("setText", data.changed);
                this.SetOpenMode();
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Загрузить данные в комбобокс
     * @constructor
     */
    SetOpenMode() {
        this.cbOpenMode.combobox({
            valueField: 'id',
            textField: 'openmode',
            data: this.OpenModeData
        });


        if (this.OpenModeId != -1) {

            for (let i = 0; i < this.OpenModeData.length; i++) {
                let openmode = this.OpenModeData[i];
                if (openmode.flag == this.OpenModeId) {
                    this.cbOpenMode.combobox("setValue", this.OpenModeData[i].id);
                }
            }
        }
        else{
            this.cbOpenMode.combobox("setValue", 2);
            this.dbDate.datebox("setValue", this.CurrentDate);
        }
    }

    cbOpenMode_onSelect(record) {
        this.OpenModeId = record.flag;
    }

    /**
     * Обработка нажатия на кнопку "ОК"
     */
    btnOk_onClick(){
        let id = this.txId.textbox("getText");
        let date = this.dbDate.datebox("getValue");
        //let date  = "14";
        if(id.length == 0){
            id = "-1";
        }

        let obj = { id: id, date: date, openmode: this.OpenModeId };
        this.ExistsDay(obj);
        return false;
    }

    /**
     * Проверка существования дня в базе данных
     * @param obj - реквизит
     * @constructor
     */
    ExistsDay(obj){
        $.ajax({
            method:"get",
            url: this.GetUrl('/Today/existsDay?id=' + obj.id.toString() + '&date=' + obj.date),
            success: function(data){
                if(data){
                    this.ShowWarning("День с такой датой  " + obj.date + " уже существует в базе данных");
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
     * Сохранение записи
     * @param obj реквизит
     * @constructor
     */
    Save(obj){
        $.ajax({
            method:"POST",
            data: JSON.stringify(obj),
            url: this.GetUrl('/Today/saveToday'),
            contentType: "application/json; charset=utf-8",
            success: function(data){
                if(this.ResultFunc!=null)
                {
                    this.ResultFunc(data);
                    this.wTodayFormEdit.window("close");
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }
}