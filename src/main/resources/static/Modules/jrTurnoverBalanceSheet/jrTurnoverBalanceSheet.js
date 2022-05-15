import {FormView}        from "../Core/FormView.js";
import {RepParams}       from "../Jasper/RepParams.js";
import {StaticRepParams} from "../Jasper/StaticRepParams.js";

/**
 * Основной класс модуля
 */
class jrTurnoverBalanceSheet extends FormView {
    /**
     * Конструктор
     * @param prefix - приставка для идентификаторов. Данная приставка добавится для каждого идентификатора
     * @param StartParams - стартовые параметры в формате JSON
     */
    constructor(prefix, StartParams) {
        super();//Вызов контруктора у родительского класса
        this.name='List';
        this.prefix = prefix; //Приставка для идентификаторов
        this.StartParams = StartParams; //Стартовые параметры в формате JSON
    }

    /**
     * Функция загрузки формы
     * @param id - идентификатор эелемента HTML, в который будет загружена разметка частичного представления
     * @constructor
     */
    Start(id){
        this.ModuleId = id;
        //Загружаем макет формы и выполняем  функци InitFunc в случае успеха
        LoadForm("#"+this.ModuleId, this.GetUrl("/jrTurnoverBalanceSheet/jrTurnoverBalanceSheet?prefix=" + this.prefix), this.InitFunc.bind(this));
    }

    /**
     * Функция инициализации пользовательского интерфейса
     * @constructor
     */
    InitFunc(){
        this.InitComponents(this.ModuleId, this.prefix); //Автоматическое получение идентификаторов формы
        this.wjrTurnoverBalanceSheet = $("#"+this.ModuleId);
        this.InitCloseEvents(this.wjrTurnoverBalanceSheet, false);//Инициализация закрытия формы по нажатию на клавиши "ESC"

        this.cbAcc.combobox({onSelect: this.cbAcc_onSelect.bind(this)});
        this.btnCancel.linkbutton({onClick: function(){ this.wjrTurnoverBalanceSheet.window("close") }.bind(this)});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this) });

        this.initDate(this.dtDateBeg);
        this.initDate(this.dtDateEnd);


        $.ajax({    // Загрузка списка счетов
            method:"get",
            url: this.GetUrl('/jrTurnoverBalanceSheet/getAccs'),
            success: function(data){
                this.cbAcc.combobox({ valueField: 'id', textField: 'name',  data: data   });

                this.cbAcc.textbox('setText',StaticRepParams.acc);                                       // (если они есть)
                this.accId = StaticRepParams.accId;
                if(StaticRepParams.dateBeg) this.dtDateBeg.datebox('setText',StaticRepParams.dateBeg);
                if(StaticRepParams.dateEnd) this.dtDateEnd.datebox('setText',StaticRepParams.dateEnd);

            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });

    }

    /**
     * Обработка выбранного казначейства
     * @param record объект с выбранным казначейством
     */
    cbAcc_onSelect(record){
        this.accId = record.id;
    }
    /**
     * Обработка нажатия Ok
     */
    btnOk_onClick(){

        if(this.cbAcc.combobox("getText").length==0){
            this.ShowToolTip("#"+this.prefix+"divCbAcc_Module_jrTurnoverBalanceSheet","Выберите пожалуйста счет.",{});
            //this.ShowError("Выберите пожалуйста счет.");
            return;
        }
        StaticRepParams.acc=this.cbAcc.textbox("getText");                                      // (для удобства пользователя)
        StaticRepParams.accId=this.accId;
        StaticRepParams.dateBeg=this.dtDateBeg.datebox("getText");
        StaticRepParams.dateEnd=this.dtDateEnd.datebox("getText");

        // Создание списка параметров
        let jrParam=new RepParams("jrTurnoverBalanceSheet",                                                // имя отчета
            [{name:"date_beg", type:"String", value:this.dtDateBeg.datebox("getText")}, // Параметры
                     {name:"date_end", type:"String", value:this.dtDateEnd.datebox("getText")},
                     {name:"accs",   type:"int",    value:this.accId}
            ]);
        $.ajax({
            method:"POST",
            data: JSON.stringify(jrParam),
            url: this.GetUrl('/Jasper/Report'),
            contentType: "application/json; charset=utf-8",
            success: function(data){
                if(this.ResultFunc!=null) {
                    this.ResultFunc(data);
                    this.wjrTurnoverBalanceSheet.window("close");
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
        return false;
    }

}


/**
 * Вызов модуля в диалоговом окне
 * @param StartParams стартовые параметры
 * @param ResultFunc функция, которая будет вызываться по нажатию на кнопку "ОК"
 * @constructor
 */
export function StartModalModul(StartParams, ResultFunc) {
    let id = "wjrTurnoverBalanceSheet_Module_jrTurnoverBalanceSheet_jrTurnoverBalanceSheet";//идентификатор диалогового окна
    CreateModalWindow(id, "Построение отчета")//функция создания диалогового окна для модуля
    $('#'+id).window('resize',{width: 647, height: 400});
    $('#'+id).window('center');
    let form = new jrTurnoverBalanceSheet("modal_", StartParams);
    form.SetResultFunc(ResultFunc);
    form.Start(id);
}