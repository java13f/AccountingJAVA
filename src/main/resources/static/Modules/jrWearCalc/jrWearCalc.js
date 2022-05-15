import {FormView} from "../Core/FormView.js";
import {RepParams}       from "../Jasper/RepParams.js";
import {StaticRepParams} from "../Jasper/StaticRepParams.js";

class jrWearCalc extends FormView {
    constructor(prefix, StartParams) {
        super();
        this.prefix = prefix;
        this.StartParams = StartParams;
        this.KterId = -1;
        this.WearId = -1;
        this.wearFlag = 0;
        this.wearObj = null;
        this.WearIndex = 0;
        this.CurrentStatus = 0;
        this.User = null;
        this.jrWearCalcRunRight = "";
        this.StatusData = [{"id":1, "flag":0, "name":"Новая"}, {"id":2, "flag":3, "name":"Исполнена"}];
    }

    Start(id) {
        this.ModuleId = id;
        LoadForm('#'+this.ModuleId, this.GetUrl("/jrWearCalc/jrWearCalc?prefix=" + this.prefix), this.InitFunc.bind(this));
    }

     InitFunc(){
        this.InitComponents(this.ModuleId, this.prefix); //Автоматическое получение идентификаторов формы
        this.wjrWearCalc = $("#"+this.ModuleId);
        this.InitCloseEvents(this.wjrWearCalc, false);//Инициализация закрытия формы по нажатию на клавиши "ESC"

        AddKeyboardNavigationForGrid(this.dgWear); //Добавляем в датагрид возможность навигации с помощью стрлочек
        this.dgWear.datagrid({
            loadFilter:this.LoadFilter.bind(this), //LoadFilter - функция, которая находится в родительском классе. Она занимется тем что экранирует теги HTML
            onLoadError:(data)=>{ this.ShowErrorResponse(data.responseJSON); }, //ShowErrorResponse - выводит ошибку в понятном для чтения виде
            onLoadSuccess: this.dgWear_onLoadSuccess.bind(this) //Обработка успешной загрузки данных в грид
        });

        this.GetActRight().then((data) => {
            if (data.length > 0) {
                this.jrWearCalcRunRight = data;
            }
        }).catch((data) => {
            this.ShowErrorResponse(data.responseJSON);
        });

        this.GetUser();
        this.dbDate.datebox({formatter: this.formatter.bind(this), parser: this.parser.bind(this)});
        this.cmbKter.combobox({onSelect: this.cmbKter_onSelect.bind(this)});
        this.dbDate.datebox({onSelect: this.dbDate_onSelect.bind(this)});
        this.btnCancel.linkbutton({onClick: function(){ this.wjrWearCalc.window("close") }.bind(this)});
        this.btnCalc.linkbutton({onClick: this.btnCalc_onClick.bind(this)});
        this.btnPrint.linkbutton({onClick: this.btnPrint_onClick.bind(this)});
        this.cmbStts.combobox({onSelect: this.cmbStts_onSelect.bind(this)});
        this.cmbStts.combobox({onChange: this.cmbStts_onChange.bind(this)});

        if(StaticRepParams.kterId) this.KterId = StaticRepParams.kterId;
        if(StaticRepParams.stts) this.CurrentStatus = StaticRepParams.stts;
        if(StaticRepParams.date) {
            this.dbDate.datebox("setText", StaticRepParams.date);
            this.SelectedDate = StaticRepParams.date;
        }
        else
            this.dbDate.datebox("setText", this.GetToday());

        this.LoadcmbStatus();
        this.LoadcmbKter();
        this.LoadGrid();
    }

    GetActRight() {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "GET",
                url: this.GetUrl('/jrWearCalc/GetActRight'),
                success: function (data) {
                    resolve(data);
                }.bind(this),
                error: function (data) {
                    reject(data);
                }.bind(this)
            })
        });
    }

    /**
     * Получить пользователя
     * @constructor
     */
    GetUser() {
        $.ajax({
            method: "GET",
            url:this.GetUrl('/jrWearCalc/GetUser'),
            success: function(data){
                this.User = data;

            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }


    async btnPrint_onClick() {
        StaticRepParams.kterId = this.KterId;
        StaticRepParams.date = this.dbDate.datebox("getText");
        StaticRepParams.stts = this.CurrentStatus;

        if(this.dgWear.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для печати");
            return false;
        }
        let selData = this.dgWear.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для печати");
            return false;
        }


        // Создание списка параметров
        let jrParam = new RepParams("jrWear",                          // имя отчета
            [   {name: "date", type: "String", value: selData.date}, // Параметры
                {name: "kterId",   type: "int",    value: this.KterId},
                {name: "stts", type: "int", value: selData.idStts },
                {name: "userId", type: "int", value: this.User.id }
            ]);


        this.lbLoader.html('Подготовка к печати...');
        this.lbLoaderBlock.css("display", "table-cell");
        this.pbLoaderBlock.css("display", "table-cell");
        let progress = setInterval(() => this.OnProgress(), 100);

        $.ajax({
            method: "POST",
            data: JSON.stringify(jrParam),
            url: this.GetUrl('/Jasper/Report'),
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (this.ResultFunc != null) {
                    this.ResultFunc(data);
                    clearInterval(progress);
                    this.ProgressIsOver();
                    this.wjrWearCalc.window("close");
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });

    }


    /**
     * Загрузить данные в комбобокс статус
     * @constructor
     */
    LoadcmbStatus() {
        this.cmbStts.combobox({
            valueField: 'id',
            textField: 'name',
            data: this.StatusData
        });

        if (this.CurrentStatus != -1) {
            for (let i = 0; i < this.StatusData.length; i++) {
                let stts = this.StatusData[i];
                if (stts.flag == this.CurrentStatus) {
                    this.cmbStts.combobox("setValue", this.StatusData[i].id);
                }
            }
        }
        else
            this.cmbStts.combobox("setValue", this.StatusData[0].id);
    }

    cmbStts_onChange(newValue, oldValue){
        if(oldValue.length > 0) {
            this.CurrentStatus = this.StatusData[newValue - 1].flag;
        }
    }

    cmbStts_onSelect(record) {
        this.CurrentStatus = record.flag;
    }

    // Форматер и парсер для Datebox
    formatter(date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        return (d < 10 ? ('0' + d) : d) + '.'
            + (m < 10 ? ('0' + m) : m) + '.'
            + y.toString();
    }

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
    }

    async btnCalc_onClick() {
        try {

            if(this.jrWearCalcRunRight.length > 0) {
                this.ShowWarning(this.jrWearCalcRunRight);
                return false;
            }

            let result = await this.dialog("Вы уверены, что хотите произвести расчёт износа?");
            if (!result) return false;

            let isDayOpen = await this.IsDayOpen();
            if (isDayOpen == 0) {
                this.ShowToolTip("#divdbDate_Module_WearCalc", "День закрыт", {
                    icon: 'icon-no',
                    title: 'Ошибка',
                    position: 'top',
                    delay: 5000
                });
                return false;
            }

            let splitDate = this.dbDate.datebox('getText').split('.');
            if (this.CurrentStatus == 3) {
                let requestsCount = await this.WearUntilSelectedDate(splitDate);
                if (requestsCount > 0) {
                    let result = await this.dialog("Износ был посчитан в " + splitDate[2] + " году. Пересчитать?");
                    if (!result) return false;
                }

                let cnt = await this.WearOnSelectedDate();
                if (cnt > 0) {

                    let result = await this.dialog("Износ был посчитан на " + this.dbDate.datebox('getText') + ". Пересчитать?");
                    if (!result) return false;
                }
            }

            let obj = {
                date: this.dbDate.datebox('getText'),
                stts: this.CurrentStatus,
                year: splitDate[2],
                kterId: this.KterId
            };

            this.lbLoader.html('Идет расчёт износа...');
            this.lbLoaderBlock.css("display", "table-cell");
            this.pbLoaderBlock.css("display", "table-cell");
            let progress = setInterval(() => this.OnProgress(), 100);

            this.calculateWear(obj).then((data) => {
                if (!data) {
                    clearInterval(progress);
                    this.ProgressIsOver();
                    this.wearFlag = 1;
                    this.wearObj = obj;
                    this.LoadGrid();
                }
            })
                .catch((data) => {
                    clearInterval(progress);
                    this.ProgressIsOver();
                    data.responseJSON.message = "Нет права на расчёт износа";
                    this.ShowErrorResponse(data.responseJSON);
                });
        } catch (err) {
            this.ShowErrorResponse(err.responseJSON);
        }
    }

    /**
     * Отключаем кнопки и заполняем progressbar
     * @constructor
     */
    OnProgress() {
        this.dbDate.datebox("disable");
        this.cmbKter.combobox("disable");
        this.cmbStts.combobox("disable");
        this.btnCalc.linkbutton("disable");
        this.btnPrint.linkbutton("disable");
        this.btnCancel.linkbutton("disable");

        let value = $("#modal_pbLoader_Module_WearCalc").progressbar('getValue');
        if(value < 99) {
            value++;
            $("#modal_pbLoader_Module_WearCalc").progressbar('setValue', value);
        }
    }

    /**
     * Включаем кнопки после того как расчет окончен
     * @constructor
     */
    ProgressIsOver() {
        $("#modal_pbLoader_Module_WearCalc").progressbar('setValue', 100);
        this.dbDate.datebox("enable");
        this.cmbKter.combobox("enable");
        this.cmbStts.combobox("enable");
        this.btnCalc.linkbutton("enable");
        this.btnPrint.linkbutton("enable");
        this.btnCancel.linkbutton("enable");

        $("#modal_pbLoader_Module_WearCalc").progressbar('setValue', 0);
        this.lbLoaderBlock.css("display", "none");
        this.pbLoaderBlock.css("display", "none");
    }

    getLastAddedRec(obj) {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "GET",
                url: this.GetUrl('/jrWearCalc/GetLastAddedRec?date=' + obj.date + '&stts=' + obj.stts),
                success: function (data) {
                    resolve(data);
                }.bind(this),
                error: function (data) {
                    reject(data);
                }.bind(this)
            })
        });
    }

    /**
     * Диалоговое окно для проверок
     * @param text
     * @returns {Promise<unknown>}
     */
    dialog(text){
        return new Promise((resolve, reject) => {
            $.messager.confirm("Расчёт износа", text, ((r)=>{
                resolve(r);
            }).bind(this));
        });
    }

    /**
     * Расчёт износа
     * @param obj
     * @returns {Promise<unknown>}
     */
    calculateWear(obj) {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "POST",
                data: JSON.stringify(obj),
                url: this.GetUrl('/jrWearCalc/Calc'),
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    resolve(data);
                }.bind(this),
                error: function (data) {
                    reject(data);
                }.bind(this)
            })
        });
    }

    dbDate_onSelect(date) {
        this.SelectedDate = this.GetFormatDate(date);
    }

    cmbKter_onSelect(record) {
        this.KterId = record.id;
        this.LoadGrid();
    }

    /**
     * Поиск индекса в данных грида
     * @param arr
     * @param id
     * @returns {number}
     */
    findIndex(arr, id) {
        for (let i = 0; i < arr.total; i++) {
            if(arr.rows[i].id == id) {
                return i;
            }
        }
    }

    /**
     * Обработка окончания загрузки списка расчетов
     * @param data - информация о загруженных данных
     */
    async dgWear_onLoadSuccess(data) {
        if (data.total > 0) {
            if (this.wearFlag) {
                try {
                    let id = await this.getLastAddedRec(this.wearObj);
                    this.wearFlag = 0;
                    this.wearObj = null;
                    let index = this.findIndex(data, id);
                    this.dgWear.datagrid("selectRow", index);
                } catch (err) {
                    this.wearFlag = 0;
                    this.wearObj = null;
                    this.dgWear.datagrid("selectRow", data.total - 1);
                    this.ShowErrorResponse(err.responseJSON);
                }
            } else {
                if (this.WearId != -1) {
                    this.dgWear.datagrid("selectRecord", this.WearId);
                } else {
                    if (this.WearIndex >= 0 && this.WearIndex < data.total) {
                        this.dgWear.datagrid("selectRow", this.WearIndex);
                    } else if (data.total > 0) {
                        this.dgWear.datagrid("selectRow", data.total - 1);
                    }
                }

                this.wearFlag = 0;
                this.WearId = -1;
                this.WearIndex = 0;
            }
        }
    }

    /**
     * Проверка был ли посчитан износ в году за исключением выбранной даты
     * @param date
     * @returns {Promise<unknown>}
     * @constructor
     */
    WearUntilSelectedDate(date) {
        let selectedDate = date[0] + '/' + date[1] + '/' + date[2];

        return new Promise((resolve, reject) => {
            $.ajax({
                method: "GET",
                url: this.GetUrl('/jrWearCalc/WearUntilSelectedDate?selectedDate=' + selectedDate + '&kterId=' + this.KterId +
                    '&stts=' + this.CurrentStatus + '&year=' + date[2]),
                success: function (data) {
                    resolve(data);
                }.bind(this),
                error: function (data) {
                    reject(data);
                }.bind(this)
            })
        });
    }

    /**
     * Проверка был ли посчитан износ на выбранную дату
     * @returns {Promise<unknown>}
     * @constructor
     */
    WearOnSelectedDate() {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "GET",
                url: this.GetUrl('/jrWearCalc/WearOnSelectedDate?selectedDate=' + this.SelectedDate + '&kterId=' + this.KterId + '&stts=' + this.CurrentStatus),
                success: function (data) {
                    resolve(data);
                }.bind(this),
                error: function (data) {
                    reject(data);
                }.bind(this)
            })
        });
    }

    /**
     * Проверка открыт ли день
     * @returns {Promise<unknown>}
     * @constructor
     */
    IsDayOpen() {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "GET",
                url: this.GetUrl('/jrWearCalc/IsDayOpen?date=' + this.SelectedDate),
                success: function (data) {
                    resolve(data);
                }.bind(this),
                error: function (data) {
                    reject(data);
                }.bind(this)
            })
        });
    }

    /**
     * Загрузка записей в грид
     * @constructor
     */
    LoadGrid() {
        this.dgWear.datagrid({url: this.GetUrl("/jrWearCalc/GetRecords?kterId=" + this.KterId)});
    }

    /**
     * Загрузить данные в комбобокс территории
     * @constructor
     */
    LoadcmbKter() {
        $.ajax({
            method: "GET",
            url:this.GetUrl('/jrWearCalc/GetKters'),
            success: function(data){
                this.cmbKter.combobox({
                    valueField: 'id',
                    textField: 'name',
                    data: data
                });

                if (this.KterId != -1) {
                    for (let i = 0; i < data.length; i++) {
                        let code = data[i];
                        if (code.id == this.KterId) {
                            this.cmbKter.combobox("setValue", data[i].id);
                        }
                    }
                }
                else
                    this.cmbKter.combobox("setValue", data[0].id);
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Получить текущую дату
     * @returns {string}
     * @constructor
     */
    GetToday() {
        var today = new Date();

        today = this.GetFormatDate(today);
        this.SelectedDate = today;
        return today;
    }

    /**
     * Форматирование даты в вид 'dd.mm.yyyy'
     * @param date
     * @returns {string}
     * @constructor
     */
    GetFormatDate(date) {
        var dd = String(date.getDate()).padStart(2, '0');
        var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = date.getFullYear();

        date = dd + '.' + mm + '.' + yyyy;
        return date;
    }
}

/**
 * Вызов модуля в диалоговом окне
 * @param StartParams стартовые параметры
 * @param ResultFunc функция
 * @constructor
 */
export function StartModalModul(StartParams, ResultFunc) {
    let id = "wjrWearCalc_Module_WearCalc"; //идентификатор диалогового окна
    CreateModalWindow(id, "Построение отчета"); //функция создания диалогового окна для модуля
    $('#'+id).window('resize',{width: 792, height: 490});
    $('#'+id).window('center');
    $('#'+id).window({maximizable: false});
    let form = new jrWearCalc("modal_", StartParams);
    form.SetResultFunc(ResultFunc);
    form.Start(id);
}
