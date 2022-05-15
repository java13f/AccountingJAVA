import {FormView}        from "../Core/FormView.js";
import {RepParams}       from "../Jasper/RepParams.js";
import {StaticRepParams} from "../Jasper/StaticRepParams.js";

/**
 * Основной класс модуля
 */
class jrInvCard extends FormView {
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

        this.objId = -1;
        this.isNma = false; // проверка на 113 счет
    }

    /**
     * Функция загрузки формы
     * @param id - идентификатор эелемента HTML, в который будет загружена разметка частичного представления
     * @constructor
     */
    Start(id) {
        this.ModuleId = id;
        //Загружаем макет формы и выполняем  функци InitFunc в случае успеха
        LoadForm("#"+this.ModuleId, this.GetUrl("/jrInvCard/jrInvCard?prefix=" + this.prefix), this.InitFunc.bind(this));
    }

    /**
     * Функция инициализации пользовательского интерфейса
     * @constructor
     */
    InitFunc() {
        this.InitComponents(this.ModuleId, this.prefix); //Автоматическое получение идентификаторов формы
        this.wjrInvCard = $("#"+this.ModuleId);
        this.InitCloseEvents(this.wjrInvCard, false);//Инициализация закрытия формы по нажатию на клавиши "ESC"

        this.btnCancel.linkbutton({onClick: function(){ this.wjrInvCard.window("close") }.bind(this)});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this) });

        this.btnObjId.linkbutton({onClick: this.btnObjId_onClick.bind(this) });

        this.initDate(this.dtDate);

        this.objId = StaticRepParams.objId;
        this.txObjId.textbox('setText', StaticRepParams.objName);

        if(StaticRepParams.dateBeg)
            this.dtDate.datebox('setText', StaticRepParams.dateBeg);
    }

    /**
     * Нажали на кнопку выбора обьекта
     */
    btnObjId_onClick() {
        try {
            StartModalModulGlobal("Objs", "",
                (async (data) => {
                    StaticRepParams.objId = data.id;
                    this.objId = StaticRepParams.objId;
                    
                    this.getObj();
                }).bind(this));
        } catch (e) {
            this.ShowError(e);
        }
    }

    /**
     * Загрузка обьектов
     */
    getObj() {
        $.ajax({    // Загрузка списка обьектов
            method: "get",
            url: this.GetUrl('/jrInvCard/getObj?id=' + this.objId),
            success: function (data) {
                if (data.accCode != '113') {
                    this.isNma = true;
                } else {
                    this.isNma = false;
                }
                this.txObjId.textbox("setText", data.name);
            }.bind(this),
            error: function (data) {
                reject(data);
            }.bind(this)
        });
    }

    /**
     * Обработка нажатия Ok
     */
    btnOk_onClick(){
        if(this.txObjId.textbox("getText").length==0){
            this.ShowToolTip("#"+this.prefix+"divTxObjId_Module_jrInvCard","Выберите пожалуйста объект.", {});
            return;
        }

        if(this.isNma){
            this.ShowToolTip("#"+this.prefix+"divTxObjId_Module_jrInvCard","Выбранный объект не относится к 113 счету.", {});
            return;
        }

        StaticRepParams.objId = this.objId;
        StaticRepParams.objName = this.txObjId.combobox("getText");

        StaticRepParams.dateBeg = this.dtDate.datebox("getText");

        // Создание списка параметров
        let jrParam=new RepParams("jrInvCard",
            [   {name:"objId",   type:"int",    value:this.objId},
                {name:"date",   type:"String",    value: this.dtDate.datebox("getText")}
            ]);
        $.ajax({
            method:"POST",
            data: JSON.stringify(jrParam),
            url: this.GetUrl('/Jasper/Report'),
            contentType: "application/json; charset=utf-8",
            success: function(data){
                if(this.ResultFunc!=null) {
                    this.ResultFunc(data);
                    this.wjrInvCard.window("close");
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
    let id = "wjrInvCard_Module_jrInvCard_jrInvCard";//идентификатор диалогового окна
    CreateModalWindow(id, "Построение отчета")//функция создания диалогового окна для модуля
    $('#'+id).window('resize',{width: 647, height: 400});
    $('#'+id).window('center');
    let form = new jrInvCard("modal_", StartParams);
    form.SetResultFunc(ResultFunc);
    form.Start(id);
}