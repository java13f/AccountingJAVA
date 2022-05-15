import {FormView}        from "../Core/FormView.js";
import {RepParams}       from "../Jasper/RepParams.js";
import {StaticRepParams} from "../Jasper/StaticRepParams.js";

/**
 * Основной класс модуля
 */
class jrOSV extends FormView {
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
        LoadForm("#"+this.ModuleId, this.GetUrl("/jrOSV/jrOSV?prefix=" + this.prefix), this.InitFunc.bind(this));
    }

    /**
     * Функция инициализации пользовательского интерфейса
     * @constructor
     */
    InitFunc(){
        this.InitComponents(this.ModuleId, this.prefix); //Автоматическое получение идентификаторов формы
        this.wjrOSV = $("#"+this.ModuleId);
        this.InitCloseEvents(this.wjrOSV, false);//Инициализация закрытия формы по нажатию на клавиши "ESC"

        this.btnUser.linkbutton({onClick: this.btnUser_onClick.bind(this) });
        this.cbAcc.combobox({onSelect: this.cbAcc_onSelect.bind(this)});
        this.btnCancel.linkbutton({onClick: function(){ this.wjrOSV.window("close") }.bind(this)});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this) });

        this.initDate(this.dtDateBeg);
        this.initDate(this.dtDateEnd);


        $.ajax({    // Загрузка списка счетов
            method:"get",
            url: this.GetUrl('/jrOSV/getAccs'),
            success: function(data){
                this.cbAcc.combobox({ valueField: 'id', textField: 'name',  data: data   });

                this.txUser.textbox('setText',StaticRepParams.user);                                     // Восстанавливаем ранее введенные параметры
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
     * Нажали на кнопку выбора пользователя
     */
    btnUser_onClick(){
        StartModalModulGlobal("Users",   {},
            ((data) => {
                $.ajax({
                    method:"get",
                    url: this.GetUrl('/jrOSV/getUser?id='+data.id),
                    success: function(data1){
                        this.txUser.textbox('setText',data1);
                    }.bind(this),
                    error: function(data){
                        this.ShowErrorResponse(data.responseJSON);
                    }.bind(this)
                });
            })
        );
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
        if(this.txUser.textbox("getText").length==0){
            this.ShowToolTip("#"+this.prefix+"divCbUser_Module_jrOSV","Выберите пожалуйста пользователя.",{});
            //this.ShowError("Выберите пожалуйста пользователя.");
            return;
        }

        if(this.cbAcc.combobox("getText").length==0){
            this.ShowToolTip("#"+this.prefix+"divCbAcc_Module_jrOSV","Выберите пожалуйста счет.",{});
            //this.ShowError("Выберите пожалуйста счет.");
            return;
        }
        StaticRepParams.user=this.txUser.textbox("getText");                                     // Запоминаем введенные параметры
        StaticRepParams.acc=this.cbAcc.textbox("getText");                                      // (для удобства пользователя)
        StaticRepParams.accId=this.accId;
        StaticRepParams.dateBeg=this.dtDateBeg.datebox("getText");
        StaticRepParams.dateEnd=this.dtDateEnd.datebox("getText");

                                                                                                 // Создание списка параметров
         let jrParam=new RepParams("jrOSV",                                                // имя отчета
             [{name:"date_beg", type:"String", value:this.dtDateBeg.datebox("getText")}, // Параметры
                      {name:"date_end", type:"String", value:this.dtDateEnd.datebox("getText")},
                      {name:"userId",   type:"int",    value:this.txUser.textbox("getText").substr(0,this.txUser.textbox("getText").indexOf(" = "))},
                      {name:"acc_id",   type:"int",    value:this.accId}
                      ]);
        $.ajax({
            method:"POST",
            data: JSON.stringify(jrParam),
            url: this.GetUrl('/Jasper/Report'),
            contentType: "application/json; charset=utf-8",
            success: function(data){
                if(this.ResultFunc!=null) {
                    this.ResultFunc(data);
                    this.wjrOSV.window("close");
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
    let id = "wjrOSV_Module_jrOSV_jrOSV";//идентификатор диалогового окна
    CreateModalWindow(id, "Построение отчета")//функция создания диалогового окна для модуля
    $('#'+id).window('resize',{width: 647, height: 400});
    $('#'+id).window('center');
    let form = new jrOSV("modal_", StartParams);
    form.SetResultFunc(ResultFunc);
    form.Start(id);
}