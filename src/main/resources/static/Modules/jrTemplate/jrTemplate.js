import {FormView}        from "../Core/FormView.js";
import {RepParams}       from "../Jasper/RepParams.js";
import {StaticRepParams} from "../Jasper/StaticRepParams.js";

/**
 * Основной класс модуля
 */
class jrTemplate extends FormView {
    /**
     * Конструктор
     * @param prefix - приставка для идентификаторов. Данная приставка добавится для каждого идентификатора
     * @param StartParams - стартовые параметры в формате JSON
     */
    constructor(prefix, StartParams) {
        super();//Вызов контруктора у родительского класса
        this.prefix = prefix; //Приставка для идентификаторов
        this.StartParams = StartParams; //Стартовые параметры в формате JSON
    }

    /**
     * Функция загрузки формы
     * @param id - идентификатор эелемента HTML, в который будет загружена разметка частичного представления
     * @constructor
     */
    Start(id) {
        this.ModuleId = id;
        //Загружаем макет формы и выполняем  функци InitFunc в случае успеха
        this.InitComponents(this.ModuleId, this.prefix); //Автоматическое получение идентификаторов формы

        let jrParam=new RepParams("jrTemplate",                                                // имя отчета
            []);

        $.ajax({
            method:"POST",
            data: JSON.stringify(jrParam),
            url: this.GetUrl('/Jasper/Report'),
            contentType: "application/json; charset=utf-8",
            success: function(data){
                if(this.ResultFunc!=null) {
                    this.ResultFunc(data);
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }


}


/**
 * Вызов модуля в диалоговом окне
 * @param StartParams стартовые параметры
 * @param ResultFunc функция, которая будет вызываться по нажатию на кнопку "ОК"
 * @constructor
 */
export function StartModalModul(StartParams, ResultFunc) {
    let id = "wjrTemplateModule_Template";//идентификатор диалогового окна
    //CreateModalWindow(id, "Построение отчета")//функция создания диалогового окна для модуля
    let form = new jrTemplate("modal_", StartParams);
    form.SetResultFunc(ResultFunc);
    form.Start(id);
}