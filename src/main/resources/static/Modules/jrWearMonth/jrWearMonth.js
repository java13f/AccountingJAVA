import {FormView} from "../Core/FormView.js";
import {StaticRepParams} from "../Jasper/StaticRepParams.js";
import {RepParams} from "../Jasper/RepParams.js";

/**
 * Основной класс модуля
 */
class jrWearMonth extends FormView {

    /**
     * Конструктор
     * @param prefix - приставка для идентификаторов. Данная приставка добавится для каждого идентификатора
     * @param StartParams - стартовые параметры в формате JSON
     */
    constructor(prefix, StartParams) {
        super(); //Вызов контруктора у родительского класса
        this.name = 'List';
        this.prefix = prefix; //Приставка для идентификаторов
        this.StartParams = StartParams; //Стартовые параметры в формате JSON
        this.kterId = -1;
        this.Year = -1;
    }

    /**
     * Функция загрузки формы
     * @param id - идентификатор эелемента HTML, в который будет загружена разметка частичного представления
     * @constructor
     */
    Start(id) {
        this.ModuleId = id;
        //Загружаем макет формы и выполняем  функци InitFunc в случае успеха
        LoadForm("#" + this.ModuleId, this.GetUrl("/jrWearMonth/jrWearMonth?prefix=" + this.prefix), this.InitFunc.bind(this));
    }

    /**
     * Функция инициализации пользовательского интерфейса
     * @constructor
     */
    InitFunc() {
        this.InitComponents(this.ModuleId, this.prefix); //Автоматическое получение идентификаторов формы
        this.wjrWearMonth = $("#" + this.ModuleId);
        this.InitCloseEvents(this.wjrWearMonth, false);//Инициализация закрытия формы по нажатию на клавиши "ESC"

        this.btnCancel.linkbutton({
            onClick: function () {
                this.wjrWearMonth.window("close")
            }.bind(this)
        });
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnKter.linkbutton({onClick: this.btnKter_onClick.bind(this)});

        if(StaticRepParams.year != null || StaticRepParams.year != undefined ){
            this.txYaer.textbox("setText",StaticRepParams.year);
        }
        if (StaticRepParams.kterId != null || StaticRepParams.kterId != undefined) {
            if(StaticRepParams.kterId != -1) {
                this.kterId = StaticRepParams.kterId;
                this.DataKter(StaticRepParams.kterId);
            }
        }
    }

    /**
     * Выбор территории
     */
    btnKter_onClick()
    {
        try {
            StartModalModulGlobal("Kter",
                "",
                ((data) => {
                    this.kterId = data.id;
                    this.DataKter(data.id);
                }).bind(this));

        } catch (e) {
            this.ShowError(e);
        }
    }

    /**
     * Получаем наименование территории в виде id =  code : name
     * @param objId - индентификатор  объекта
     * @constructor
     */
    DataKter(kterId) {
        $.ajax({
            method: "get",
            url: this.GetUrl('/jrWearMonth/KterName?id=' + kterId),
            success: function (data) {
                this.txKter.textbox("setText", data);
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Закрытие формы и построение отчета
     */
    btnOk_onClick()
    {
        this.Year = this.txYaer.textbox("getText");
        let id_Kter = this.txKter.textbox("getText");

        if (this.Year.length == 0) {
            this.ShowToolTip("#" + this.prefix + "divtxYaer_Module_jrWearMonth", "Укажите пожалуйста год", {});
            return;
        }
        if (this.Year.length > 4) {
            this.ShowToolTip("#" + this.prefix + "divtxYaer_Module_jrWearMonth", "Год должен состоять из 4 символов", {});
            return;
        }

        if (id_Kter.length == 0) {
            this.ShowToolTip("#" + this.prefix + "divtxKter_Module_jrWearMonth", "Выберите пожалуйста территорию", {});
            return;
        }
        if(isNaN(this.Year))
        {
            this.ShowToolTip("#" + this.prefix + "divtxYaer_Module_jrWearMonth", "Год должен быть указан цифрами", {});
            return;
        }

        StaticRepParams.year =  this.Year
        StaticRepParams.kterId = this.kterId;

        // Создание списка параметров
        let jrParam = new RepParams("jrWearMonth",                                                  // имя отчета
            [ // Параметры
                {name: "kterId", type: "int", value: this.kterId},
                {name: "year", type: "int", value: this.Year}
            ]);
        $.ajax({
            method: "POST",
            data: JSON.stringify(jrParam),
            url: this.GetUrl('/Jasper/Report'),
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (this.ResultFunc != null) {
                    this.ResultFunc(data);
                    this.wjrWearMonth.window("close");
                }
            }.bind(this),
            error: function (data) {
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
    let id = "wjrWearMonth_Module_jrWearMonth_jrWearMonth";//идентификатор диалогового окна
    CreateModalWindow(id, "Построение отчета")//функция создания диалогового окна для модуля
    $('#' + id).window('resize', {width: 647, height: 400});
    $('#' + id).window('center');
    let form = new jrWearMonth("modal_", StartParams);
    form.SetResultFunc(ResultFunc);
    form.Start(id);
}