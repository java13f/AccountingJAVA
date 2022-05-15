import {FormView} from "../Core/FormView.js";
import {RepParams} from "../Jasper/RepParams.js";
import {StaticRepParams} from "../Jasper/StaticRepParams.js";

/**
 * Основной класс модуля
 */
class jrInvMainAssets extends FormView {
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

        this.accsData = {};
        this.ktersData = {};

        this.invsId = -1;
        this.kterId = -1;
        this.accId = -1;

        this.invtypes = [
            {"id": "1", "name": "Инвентризационная опись основных средств (пообъектная)"},
            {"id": "2", "name": "Сравнительная ведомость результатов инвентаризации основных средств (пообъектная)"},
            {"id": "3", "name": "Инвентризационная опись прочих необоротных материальных активов (групповая)"},
            {
                "id": "4",
                "name": "Сравнительная ведомость результатов инвентаризации прочих необоротных материальных активов (групповая)"
            }
        ];
        this.currentInvType = -1;
    }

    /**
     * Функция загрузки формы
     * @param id - идентификатор эелемента HTML, в который будет загружена разметка частичного представления
     * @constructor
     */
    Start(id) {
        this.ModuleId = id;
        LoadForm("#" + this.ModuleId, this.GetUrl("/jrInvMainAssets/jrInvMainAssets?prefix=" + this.prefix), this.InitFunc.bind(this));
    }

    /**
     * Функция инициализации пользовательского интерфейса
     * @constructor
     */
    async InitFunc() {
        this.InitComponents(this.ModuleId, this.prefix); //Автоматическое получение идентификаторов формы
        this.wjrInvMainAssets = $("#" + this.ModuleId);
        this.InitCloseEvents(this.wjrInvMainAssets, false);//Инициализация закрытия формы по нажатию на клавиши "ESC"
        this.btnCancel.linkbutton({
            onClick: function () {
                this.wjrInvMainAssets.window("close")
            }.bind(this)
        });

        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});

        this.btnChInv.linkbutton({onClick: this.btnChInv_onClick.bind(this)});
        this.cbAcc.combobox({onSelect: this.cbAcc_onSelect.bind(this)});
        this.cbKter.combobox({onSelect: this.cbKter_onSelect.bind(this)});
        this.cbInvType.combobox({onSelect: this.cbInvType_onSelect.bind(this)});
        this.InitInvTypes();
        this.RestoreParams();
    }

    /***
     * Обработка нажатия кнопки вызова справочника инвентаризаций
     */
    btnChInv_onClick() {
        try {
            StartModalModulGlobal("Invs", "",
                (async (data) => {
                    this.invsId = data.id;
                    await this.GetInv();
                }).bind(this));
        } catch (e) {
            this.ShowError(e);
        }
    }

    LoadRights() {
        return new Promise((resolve, reject) => {
            $.ajax({    // Загрузка списка территорий
                method: "get",
                url: this.GetUrl('/CoreUtils/GetActRights?TaskCode=jrInvMainAssets.dll&ActCode=jrInvMainAssetsView'),
                success: function (data) {
                    if (data.length > 0) {
                        this.btnOk.linkbutton({disabled: true});
                        this.ShowWarning(data);
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                }.bind(this),
                error: function (data) {
                    reject(data);
                }.bind(this)
            });
        });
    }

    /***
     * Получение инвентаризации
     * @returns {Promise<unknown>}
     * @constructor
     */
    GetInv() {
        return new Promise((resolve, reject) => {
            $.ajax({    // Загрузка списка территорий
                method: "get",
                url: this.GetUrl('/jrInvMainAssets/getInv?id=' + this.invsId),
                success: function (data) {
                    this.txInv.textbox("setText", data.name);
                    resolve(true);
                }.bind(this),
                error: function (data) {
                    reject(data);
                }.bind(this)
            });
        });
    }

    /***
     * Загрузка списка территорий
     * @returns {Promise<unknown>}
     * @constructor
     */
    LoadKterList() {
        return new Promise((resolve, reject) => {
            $.ajax({    // Загрузка списка территорий
                method: "get",
                url: this.GetUrl('/jrInvMainAssets/getKters'),
                success: function (data) {
                    this.ktersData = data;
                    this.cbKter.combobox({
                        valueField: 'id',
                        textField: 'name',
                        data: this.ktersData
                    });
                    resolve(true);
                }.bind(this),
                error: function (data) {
                    reject(data);
                }.bind(this)
            });
        });
    }

    /***
     * Загрузка списка счетов
     * @returns {Promise<unknown>}
     * @constructor
     */
    LoadAccList() {
        return new Promise((resolve, reject) => {
            $.ajax({    // Загрузка списка счетов
                method: "get",
                url: this.GetUrl('/jrInvMainAssets/getAccs?accs=' + this.currentInvType),
                success: function (data) {
                    this.accsData = data;
                    this.cbAcc.combobox({
                        valueField: 'id',
                        textField: 'name',
                        data: this.accsData
                    });
                    resolve(true);
                }.bind(this),
                error: function (data) {
                    reject(data);
                }.bind(this)
            });
        });
    }

    /**
     * Восстановление параметров отчёта (если они есть)
     * @constructor
     */
    RestoreParams() {
        if (StaticRepParams.invType != null && StaticRepParams.invsName != null) {
            this.currentInvType = StaticRepParams.invType;
            this.cbInvType.combobox("setValue", StaticRepParams.invType);
        }
        // if (StaticRepParams.kterId != null && StaticRepParams.kterName != null) {
        //     this.kterId = StaticRepParams.kterId;
        //     this.cbKter.combobox('setValue', StaticRepParams.kterId);
        // }
        // if (StaticRepParams.accId != null && StaticRepParams.accName != null) {
        //     this.accId = StaticRepParams.accId;
        //     this.cbAcc.combobox('setValue', StaticRepParams.accId);
        // }
        // if (StaticRepParams.invsId != null && StaticRepParams.invsName != null) {
        //     this.invsId = StaticRepParams.invsId;
        //     this.txInv.textbox("setText", StaticRepParams.invsName);
        // }
    }

    /**
     * Обработка выбранного счёта
     * @param record объект с выбранным казначейством
     */
    cbAcc_onSelect(record) {
        this.accId = record.id;
    }

    /**
     * Обработка выбранной территории
     * @param record объект с выбранным казначейством
     */
    cbKter_onSelect(record) {
        this.kterId = record.id;
    }

    /**
     * Инициализация типов инв. описи
     * @constructor
     */
    InitInvTypes() {
        this.cbInvType.combobox({
            valueField: 'id',
            textField: 'name',
            data: this.invtypes
        });
        this.cbInvType.combobox("setValue", 1);
        this.currentInvType = 1;
    }

    /**
     * Обработка выбора типа инв. описи
     * @param record
     * @returns {Promise<void>}
     */
    async cbInvType_onSelect(record) {
        this.currentInvType = record.id;

        let loadedKterList = await this.LoadKterList().catch(reason => {
            this.ShowErrorResponse(reason.responseJSON);
            return false;
        });
        if (!loadedKterList) {
            return;
        }
        let loadedAccList = await this.LoadAccList().catch(reason => {
            this.ShowErrorResponse(reason.responseJSON);
            return false;
        });
        if (!loadedAccList) {
            return;
        }

        if (StaticRepParams.kterId != null && StaticRepParams.kterName != null) {
            for (let i = 0; i < this.ktersData.length; i++) {
                if (this.ktersData[i].id == StaticRepParams.kterId) {
                    this.kterId = StaticRepParams.kterId;
                    this.cbKter.combobox('setValue', StaticRepParams.kterId);
                }
            }
        }

        if (StaticRepParams.accId != null && StaticRepParams.accName != null) {
            for (let i = 0; i < this.accsData.length; i++) {
                if (this.accsData[i].id == StaticRepParams.accId) {
                    this.accId = StaticRepParams.accId;
                    this.cbAcc.combobox('setValue', StaticRepParams.accId);
                }
            }
        }

        if (StaticRepParams.invsId != null && StaticRepParams.invsName != null) {
            this.invsId = StaticRepParams.invsId;
            this.txInv.textbox("setText", StaticRepParams.invsName);
        }
    }

    /**
     * Обработка нажатия Ok
     */
    btnOk_onClick() {
        if (this.cbKter.combobox("getText").length == 0) {
            this.ShowToolTip("#" + this.prefix + "divCbKter_Module_jrInvMainAssets", "Выберите пожалуйста территорию.", {});
            return;
        }

        if (this.cbAcc.combobox("getText").length == 0) {
            this.ShowToolTip("#" + this.prefix + "divCbAcc_Module_jrInvMainAssets", "Выберите пожалуйста счет.", {});
            return;
        }

        if (this.txInv.combobox("getText").length == 0) {
            this.ShowToolTip("#" + this.prefix + "divTxInv_Module_jrInvMainAssets", "Выберите пожалуйста инвентаризацию.", {});
            return;
        }

        let report = "";
        if (this.currentInvType == "1") {
            report = "jrInvMainAssets";
        } else if (this.currentInvType == "2") {
            report = "jrCompMainAssets";
        } else if (this.currentInvType == "3") {
            report = "jrInvOtherAssets";
        } else if (this.currentInvType == "4") {
            report = "jrCompOtherAssets";
        } else {
            this.ShowWarning("Указан не верный тип инвентаризационной описи");
            return;
        }
        StaticRepParams.invsId = this.invsId;
        StaticRepParams.invsName = this.txInv.textbox("getText");

        StaticRepParams.invType = this.currentInvType;
        StaticRepParams.invTypeName = this.cbInvType.combobox("getText");

        StaticRepParams.kterId = this.kterId;
        StaticRepParams.kterName = this.cbKter.combobox("getText");

        StaticRepParams.accId = this.accId;
        StaticRepParams.accName = this.cbAcc.combobox("getText");


        // Создание списка параметров
        let jrParam = new RepParams(report,  // имя отчета
            [ // Параметры
                {name: "kter_id", type: "int", value: this.kterId},
                {name: "acc_id", type: "int", value: this.accId},
                {name: "invs_id", type: "int", value: this.invsId}
            ]);

        $.ajax({
            method: "POST",
            data: JSON.stringify(jrParam),
            url: this.GetUrl('/Jasper/Report'),
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (this.ResultFunc != null) {
                    this.ResultFunc(data);
                    this.wjrInvMainAssets.window("close");
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
    let id = "wjrInvMainAssets_Module_jrInvMainAssets_jrInvMainAssets";//идентификатор диалогового окна
    CreateModalWindow(id, "Построение отчета")//функция создания диалогового окна для модуля
    $('#' + id).window('resize', {width: 647, height: 400});
    $('#' + id).window('center');
    let form = new jrInvMainAssets("modal_", StartParams);
    form.SetResultFunc(ResultFunc);
    form.Start(id);
}