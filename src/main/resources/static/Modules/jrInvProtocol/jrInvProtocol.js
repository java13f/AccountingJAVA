import {FormView} from "../Core/FormView.js";
import {RepParams} from "../Jasper/RepParams.js";
import {StaticRepParams} from "../Jasper/StaticRepParams.js";

/**
 * Основной класс модуля
 */
class jrInvProtocol extends FormView {
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
        this.accs = [];
    }

    /**
     * Функция загрузки формы
     * @param id - идентификатор эелемента HTML, в который будет загружена разметка частичного представления
     * @constructor
     */
    Start(id) {
        this.ModuleId = id;
        LoadForm("#" + this.ModuleId, this.GetUrl("/jrInvProtocol/jrInvProtocol?prefix=" + this.prefix), this.InitFunc.bind(this));
    }

    /**
     * Функция инициализации пользовательского интерфейса
     * @constructor
     */
    async InitFunc() {
        this.InitComponents(this.ModuleId, this.prefix); //Автоматическое получение идентификаторов формы
        this.wjrInvProtocol = $("#" + this.ModuleId);
        this.InitCloseEvents(this.wjrInvProtocol, false);//Инициализация закрытия формы по нажатию на клавиши "ESC"
        this.btnCancel.linkbutton({
            onClick: function () {
                this.wjrInvProtocol.window("close")
            }.bind(this)
        });

        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});

        this.btnCheckAllAccs.linkbutton({onClick: this.btnCheckAllAccs_onClick.bind(this)});
        this.btnUncheckAllAccs.linkbutton({onClick: this.btnUncheckAllAccs_onClick.bind(this)});

        this.btnChInv.linkbutton({onClick: this.btnChInv_onClick.bind(this)});
        this.cbKter.combobox({onSelect: this.cbKter_onSelect.bind(this)});

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
                url: this.GetUrl('/CoreUtils/GetActRights?TaskCode=jrInvProtocol.dll&ActCode=jrInvProtocolView'),
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
                url: this.GetUrl('/jrInvProtocol/getInv?id=' + this.invsId),
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
                url: this.GetUrl('/jrInvProtocol/getKters'),
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
                url: this.GetUrl('/jrInvProtocol/getAccs'),
                success: function (data) {
                    this.accsIds = data;

                    this.dlAccs.datalist({
                        data: this.accsIds,
                        valueField: "id",
                        textField: "name",
                        checkbox: true,
                        singleSelect: false,
                        lines: true
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
        if (StaticRepParams.kterId != null && StaticRepParams.kterName != null) {
            this.kterId = StaticRepParams.kterId;
            this.cbKter.combobox('setValue', StaticRepParams.kterId);
        }

        if (StaticRepParams.invsId != null && StaticRepParams.invsName != null) {
            this.invsId = StaticRepParams.invsId;
            this.txInv.textbox("setText", StaticRepParams.invsName);
        }


        if (StaticRepParams.accsIds != null) {
            let allAccs = this.dlAccs.datalist("getRows");

            if (StaticRepParams.accsIds.length > 0) {
                this.accsIds = StaticRepParams.accsIds;

                for (let i = 0; i < this.accsIds.length; i++) {
                    for (let j = 0; j < allAccs.length; j++) {
                        if (allAccs[j].id == this.accsIds[i].id) {
                            this.dlAccs.datalist("selectRow", j)
                        }
                    }
                }
            }
        }
    }

    btnCheckAllAccs_onClick() {
        let allAccs = this.dlAccs.datalist("getRows");
        for (let j = 0; j < allAccs.length; j++) {
            this.dlAccs.datalist("selectRow", j)
        }
    }

    btnUncheckAllAccs_onClick() {
        let allAccs = this.dlAccs.datalist("getRows");
        for (let j = 0; j < allAccs.length; j++) {
            this.dlAccs.datalist("unselectRow", j)
        }
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
     * Обработка выбора типа инв. описи
     * @param record
     * @returns {Promise<void>}
     */
    // async cbInvType_onSelect(record) {
    //     this.currentInvType = record.id;
    //
    //     let loadedKterList = await this.LoadKterList().catch(reason => {
    //         this.ShowErrorResponse(reason.responseJSON);
    //         return false;
    //     });
    //     if (!loadedKterList) {
    //         return;
    //     }
    //     let loadedAccList = await this.LoadAccList().catch(reason => {
    //         this.ShowErrorResponse(reason.responseJSON);
    //         return false;
    //     });
    //     if (!loadedAccList) {
    //         return;
    //     }
    //
    //     if (StaticRepParams.kterId != null && StaticRepParams.kterName != null) {
    //         for (let i = 0; i < this.ktersData.length; i++) {
    //             if (this.ktersData[i].id == StaticRepParams.kterId) {
    //                 this.kterId = StaticRepParams.kterId;
    //                 this.cbKter.combobox('setValue', StaticRepParams.kterId);
    //             }
    //         }
    //     }
    //
    //     if (StaticRepParams.invsId != null && StaticRepParams.invsName != null) {
    //         this.invsId = StaticRepParams.invsId;
    //         this.txInv.textbox("setText", StaticRepParams.invsName);
    //     }
    //
    //
    // }

    /**
     * Обработка нажатия Ok
     */
    btnOk_onClick() {
        if (this.cbKter.combobox("getText").length == 0) {
            this.ShowToolTip("#" + this.prefix + "divCbKter_Module_jrInvProtocol", "Выберите пожалуйста территорию.", {});
            return;
        }

        if (this.txInv.combobox("getText").length == 0) {
            this.ShowToolTip("#" + this.prefix + "divTxInv_Module_jrInvProtocol", "Выберите пожалуйста инвентаризацию.", {});
            return;
        }

        this.accsIds = this.dlAccs.datalist("getSelections");

        if (this.accsIds == null || this.accsIds.length == 0) {
            this.ShowWarning("Укажите счета!");
            return;
        }

        let report = "jrInvProtocol";

        StaticRepParams.invsId = this.invsId;
        StaticRepParams.invsName = this.txInv.textbox("getText");

        StaticRepParams.kterId = this.kterId;
        StaticRepParams.kterName = this.cbKter.combobox("getText");

        StaticRepParams.accsIds = this.accsIds;

        let accsIdsString = "-1";

        for (let i = 0; i < this.accsIds.length; i++) {
            accsIdsString = accsIdsString + "," + this.accsIds[i].id;
        }

        // Создание списка параметров
        let jrParam = new RepParams(report,  // имя отчета
            [ // Параметры
                {name: "kter_id", type: "int", value: this.kterId},
                {name: "accs_ids", type: "String", value: accsIdsString},
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
                    this.wjrInvProtocol.window("close");
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
    let id = "wjrInvProtocol_Module_wjrInvProtocol_wjrInvProtocol";//идентификатор диалогового окна
    CreateModalWindow(id, "Построение отчета")//функция создания диалогового окна для модуля
    $('#' + id).window('resize', {width: 647, height: 510});
    $('#' + id).window('center');
    let form = new jrInvProtocol("modal_", StartParams);
    form.SetResultFunc(ResultFunc);
    form.Start(id);
}