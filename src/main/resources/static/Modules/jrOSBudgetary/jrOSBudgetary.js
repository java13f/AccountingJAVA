import {FormView} from "../Core/FormView.js";
import {RepParams} from "../Jasper/RepParams.js";
import {StaticRepParams} from "../Jasper/StaticRepParams.js";

/**
 * Основной класс модуля
 */
class jrOSBudgetary extends FormView {

    /**
     * Конструктор
     * @param prefix - приставка для идентификаторов. Данная приставка добавится для каждого идентификатора
     * @param StartParams - стартовые параметры в формате JSON
     */
    constructor(prefix, StartParams) {
        super();//Вызов контруктора у родительского класса
        this.name = 'List';
        this.prefix = prefix; //Приставка для идентификаторов
        this.StartParams = StartParams; //Стартовые параметры в формате JSON
        this.obj_Id = -1;
        this.obj_Date = "";
    }

    /**
     * Функция загрузки формы
     * @param id - идентификатор эелемента HTML, в который будет загружена разметка частичного представления
     * @constructor
     */
    Start(id) {
        this.ModuleId = id;
        //Загружаем макет формы и выполняем  функци InitFunc в случае успеха
        LoadForm("#" + this.ModuleId, this.GetUrl("/jrOSBudgetary/jrOSBudgetary?prefix=" + this.prefix), this.InitFunc.bind(this));
    }

    /**
     * Функция инициализации пользовательского интерфейса
     * @constructor
     */
    InitFunc() {
        this.InitComponents(this.ModuleId, this.prefix); //Автоматическое получение идентификаторов формы
        this.wjrOSBudgetary = $("#" + this.ModuleId);
        this.InitCloseEvents(this.wjrOSBudgetary, false);//Инициализация закрытия формы по нажатию на клавиши "ESC"

        this.formatDate(this.dtDateBeg);
        this.btnCancel.linkbutton({
            onClick: function () {
                this.wjrOSBudgetary.window("close")
            }.bind(this)
        });
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnObjs.linkbutton({onClick: this.btnObjs_onClick.bind(this)});

        if (StaticRepParams.dateBeg == null || StaticRepParams.dateBeg == undefined || StaticRepParams.dateBeg.length == 0) {
            let currentDate = new Date();
            let year = currentDate.getFullYear(); // 2020
            let month = currentDate.getMonth() + 1; // 0-11
            let day = currentDate.getDate(); // 1-31
            let fullDate = day + '.' + month + '.' + year;

            this.dtDateBeg.datebox("setText", fullDate);
        } else {
            this.dtDateBeg.datebox("setText", StaticRepParams.dateBeg);
        }

        if (StaticRepParams.objId != null || StaticRepParams.objId != undefined) {
            if(StaticRepParams.objId != -1) {
                this.obj_Id = StaticRepParams.objId;
                this.DataObjs(StaticRepParams.objId);
            }
        }
    }

    /**
     * Устанавливает формат даты в виде dd.mm.yyyy
     * @param dateBox - получет dateBox в котором нужно сделать преобразование
     */
    formatDate(dateBox) {
        dateBox.datebox({
            formatter: function (date) {
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                var d = date.getDate();
                return (d < 10 ? ('0' + d) : d) + '.'
                    + (m < 10 ? ('0' + m) : m) + '.'
                    + y.toString();
            },
            parser: function (s) {
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
            }
        });
    }

    /**
     * Выбираем объект на который будет строится отчет
     */
    btnObjs_onClick() {
        try {
            StartModalModulGlobal("Objs",
                "",
                ((data) => {
                    this.obj_Id = data.id;
                    this.DataObjs(data.id);
                }).bind(this));

        } catch (e) {
            this.ShowError(e);
        }
    }

    /**
     * Получаем наименование объекта в виде id = invno : name
     * @param objId - индентификатор  объекта
     * @constructor
     */
    DataObjs(objId) {
        $.ajax({
            method: "get",
            url: this.GetUrl('/jrOSBudgetary/ObjName?id=' + objId),
            success: function (data) {
                this.txObjs.textbox("setText", data);
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }


    /**
     * Обработка нажатия Ok
     */
    btnOk_onClick() {
        this.obj_Date = this.dtDateBeg.datebox("getText");

        if (this.obj_Date.length == 0) {
            this.ShowToolTip("#" + this.prefix + "divDateBeg_Module_jrOSBudgetary", "Укажите пожалуйста дату.", {});
            return;
        }

        if (this.txObjs.textbox("getText").length == 0) {
            this.ShowToolTip("#" + this.prefix + "divObjs_Module_jrOSBudgetary", "Выберите пожалуйста объект.", {});
            return;
        }

        this.checkObjsAccs();
    }

    /**
     * Проверка выбора счета. Счет не должен быть 113
     */
    checkObjsAccs() {
        $.ajax({
            method: "get",
            url: this.GetUrl('/jrOSBudgetary/checkAccs?objId=' + this.obj_Id),
            success: function (data) {
                if (data == 0) {
                    this.ShowToolTip("#" + this.prefix + "divObjs_Module_jrOSBudgetary", "Выбрать <b>113</b> счет невозможно", {});
                    return;
                } else {
                    this.ContinOK();
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Закртыие формы и постороение объекта
     * @returns {boolean}
     * @constructor
     */
    ContinOK() {
        StaticRepParams.dateBeg = this.dtDateBeg.datebox("getText");
        StaticRepParams.objId = this.obj_Id;

        // Создание списка параметров
        let jrParam = new RepParams("jrOS6",                                                  // имя отчета
            [ // Параметры
                {name: "Id", type: "int", value: this.obj_Id},
                {name: "Date", type: "String", value: this.obj_Date}
            ]);
        $.ajax({
            method: "POST",
            data: JSON.stringify(jrParam),
            url: this.GetUrl('/Jasper/Report'),
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (this.ResultFunc != null) {
                    this.ResultFunc(data);
                    this.wjrOSBudgetary.window("close");
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
    let id = "wjrOSBudgetary_Module_jrOSBudgetary_jrOSBudgetary";//идентификатор диалогового окна
    CreateModalWindow(id, "Построение отчета")//функция создания диалогового окна для модуля
    $('#' + id).window('resize', {width: 647, height: 400});
    $('#' + id).window('center');
    let form = new jrOSBudgetary("modal_", StartParams);
    form.SetResultFunc(ResultFunc);
    form.Start(id);
}