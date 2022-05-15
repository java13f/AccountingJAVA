import {FormView} from "../Core/FormView.js";
import {PeriodParamsFormEdit} from "./PeriodParamsFormEdit.js";

/**
 * Основной класс модуля
 */
class PeriodParams extends FormView {
    /**
     * Конструктор
     * @param prefix - приставка для идентификаторов. Данная приставка добавится для каждого идентификатора
     * @param StartParams - стартовые параметры в формате JSON
     */
    constructor(prefix, StartParams) {
        super();
        this.paramId = -1;
        this.paramIndex = 0;
        this.prefix = prefix;
        this.StartParams = StartParams;
        this.sLoc = new LibLockService(300000);
        this.editMode = false;
        this.currentTaskCode = "";
        this.taskCodes = [];
    }

    /**
     * Функция загрузки формы
     * @param id - идентификатор эелемента HTML, в который будет загружена разметка частичного представления
     * @constructor
     */
    Start(id) {
        this.ModuleId = id;
        LoadForm("#" + this.ModuleId, this.GetUrl("/PeriodParams/PeriodParamsFormList?prefix=" + this.prefix), this.InitFunc.bind(this));
    }

    /**
     * Функция инициализации пользовательского интерфейса
     * @constructor
     */
    InitFunc() {
        this.InitComponents(this.ModuleId, this.prefix);
        AddKeyboardNavigationForGrid(this.dgPP);
        this.dgPP.datagrid({
            loadFilter: this.LoadFilter.bind(this),
            onLoadError: (data) => {
                this.ShowErrorResponse(data.responseJSON);
            },
            rowStyler: this.dgPP_rowStyler.bind(this),
            onLoadSuccess: this.dgPP_onLoadSuccess.bind(this),
            onSelect: this.btnDeleteChangeText.bind(this)
        });
        this.LoadRights();
        this.btnUpdate.linkbutton({onClick: this.btnUpdate_onClick.bind(this)});
        this.cbTaskCodeFilter.combobox({onSelect: this.cbTaskCodeFilter_onSelect.bind(this)});
        this.btnClearTaskCodeFilter.linkbutton({onClick: this.btnClearTaskCodeFilter_onClick.bind(this)});
        this.cbShowDel.checkbox({onChange: this.btnUpdate_onClick.bind(this)});
        this.btnAdd.linkbutton({onClick: this.btnAdd_onClick.bind(this)});
        this.btnChange.linkbutton({onClick: this.btnChange_onClick.bind(this)});
        this.btnDelete.linkbutton({onClick: this.btnDelete_onClick.bind(this)});
        this.LoadTaskCodes();
        this.btnUpdate_onClick();
        if (this.prefix == "modal_") {
            this.pOkCancel.css("visibility", "visible");
            this.wPeriodParams = $("#" + this.ModuleId);
            this.InitCloseEvents(this.wPeriodParams, false);//Инициализация закрытия формы по нажатию на клавиши "ESC"
            this.btnCancel.linkbutton({
                onClick: function () {
                    this.wPeriodParams.window("close")
                }.bind(this)
            });
            this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        }
    }

    /**
     * Обработка события перерисовки грида (подсветка удалённых записей)
     * @param index - позиция записи
     * @param row - запись
     */
    dgPP_rowStyler(index, row) {
        if (row.del == 1) {
            return "background-color:gray;";
        }
    }

    /**
     * Обработка окончания загрузки списка реквизитов
     * @param data - информация о загруженных данных
     */
    dgPP_onLoadSuccess(data) {
        if (data.total > 0) {
            if (this.paramId != -1) {
                this.dgPP.datagrid("selectRecord", this.paramId);
            } else {
                if (this.paramIndex >= 0 && this.paramIndex < data.total) {
                    this.dgPP.datagrid("selectRow", this.paramIndex);
                } else if (data.total > 0) {
                    this.dgPP.datagrid("selectRow", data.total - 1);
                }
            }
            this.paramId = -1;
            this.paramIndex = 0;
        }
    }

    /**
     * Обновление списка реквизитов
     */
    async btnUpdate_onClick() {
        let row = this.dgPP.datagrid("getSelected");//получаем выбранную запись
        if (row != null) {
            this.paramIndex = this.dgPP.datagrid("getRowIndex", row);// получаем индекс выбранной записи
            if (this.paramIndex < 0) {
                this.paramIndex = 0;
            }//даже если нет выбранной записи getSelected может вернуть запись, но getRowIndex отработает корректно и вернёт -1 поэтому заместо -1 запоминаем 0
        }
        // let filter = this.cbTaskCodeFilter.combobox("getValue");//Получаем значение фильтра по коду
        // filter = encodeURIComponent(filter);//Кодируем значение фильтра в часть url-а
        let showDel = this.cbShowDel.checkbox("options").checked ? "true" : "false";//Получаем значение флага отображения удалённых записей
        await this.LoadDataToDrig(this.currentTaskCode, showDel).catch(reason => this.ShowErrorResponse(reason.responseJSON));
        // this.dgPP.datagrid({url: this.GetUrl("/PeriodParams/list?filter=" + this.currentTaskCode + "&showDel=" + showDel)});//Загружаем список кодов территорий
    }

    LoadDataToDrig(taskcode, showdel) {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "get",
                url: this.GetUrl('/PeriodParams/list?filter=' + taskcode + '&showDel=' + showdel),
                success: function (data) {
                    if (data != null) {
                        this.dgPP.datagrid({data: data});
                    }
                    resolve(true);
                }.bind(this),
                error: function (data) {
                    reject(data);
                }.bind(this)
            });
        });
    }

    /**
     * Проверка прав
     */
    LoadRights() {
        $.ajax({
            method: "get",
            url: this.GetUrl('/CoreUtils/GetActRights?TaskCode=PeriodParams.dll&ActCode=PeriodParamsChange'),
            success: function (data) {
                if (data.length == 0) {
                    this.btnAdd.linkbutton({disabled: false});
                    this.btnDelete.linkbutton({disabled: false});
                    this.editMode = true;
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Обработка нажатия кнопки добавления
     */
    btnAdd_onClick() {
        let form = new PeriodParamsFormEdit(); // Создание формы редактирования
        form.SetResultFunc(async (RecId) => {
            this.paramId = RecId;
            await this.LoadTaskCodes().catch(reason =>
                this.ShowErrorResponse(reason.responseJSON)
            );
        }); // Передача функции, которая будет вызвана по нажатию на кнопку ОК
        form.Show({AddMode: true}); // Показать форму
    }

    /**
     * Обработка нажатия на кнопку редактирования
     * @returns {boolean}
     */
    btnChange_onClick() {
        if (this.dgPP.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для изменения");
            return false;
        }
        let selData = this.dgPP.datagrid("getSelected");
        if (selData == null) {
            this.ShowWarning("Выберите запись для изменения");
            return false;
        }
        if (this.editMode) {
            this.sLoc.LockRecord("periodparams", selData.id, this.btnContinueChange_onClick.bind(this));
        } else {
            this.btnContinueChange_onClick({
                id: selData.id,
                AddMode: false,
                editMode: this.editMode,
                lockMessage: '',
                lockState: false
            });
        }
    }

    /**
     * Продолжение редактирования
     */
    btnContinueChange_onClick(options) {
        if (options.lockMessage.length != 0) {
            this.ShowSlide("Предупреждение", options.lockMessage)
            options.editMode = false;
        } else {
            if (options.editMode) {
                options.lockState = true;
            }
        }
        let form = new PeriodParamsFormEdit();
        form.SetResultFunc(async (RecId) => {
            this.paramId = RecId;
            await this.LoadTaskCodes().catch(reason =>
                this.ShowErrorResponse(reason.responseJSON)
            );
        });
        form.SetCloseWindowFunction((options) => {
            if (options != null) {
                if (options.lockState) {
                    this.sLoc.FreeLockRecord("periodparams", options.id);
                }
            }
        });
        form.Show(options);
    }

    /**
     * Обработка нажатия на кнопку удаления
     * @returns {boolean}
     */
    btnDelete_onClick() {
        if (this.dgPP.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для удаления");
            return false;
        }
        let selData = this.dgPP.datagrid("getSelected");
        if (selData == null) {
            this.ShowWarning("Выберите запись для удаления");
            return false;
        }
        let del = selData.del;
        let header = "Удаление"
        let action = "удалить"
        if (del == 1) {
            header = "Восстановление";
            action = "восстановить";
        }
        $.messager.confirm(header, "Вы действительно хотите " + action + " выделенный реквизит?",
            function (result) {
                if (result) {
                    this.sLoc.StateLockRecord("periodparams", selData.id, this.btnContinueDelete_onClick.bind(this));
                }
            }.bind(this));
    }

    /**
     * Продолжение удаления
     */
    btnContinueDelete_onClick(options) {
        if (options.data.length > 0) {
            this.ShowWarning(options.data);
        } else {
            $.ajax({
                method: "POST",
                url: this.GetUrl('/PeriodParams/delete'),
                data: {id: options.id},
                success: function (data) {
                    if (data.length) {
                        this.ShowWarning(data);
                    } else {
                        this.btnUpdate_onClick();
                    }
                }.bind(this),
                error: function (data) {
                    this.ShowErrorResponse(data.responseJSON);
                }.bind(this)
            });
        }
    }

    /**
     * Изменение текста на кнопке "Удалить"
     */
    btnDeleteChangeText() {
        if (this.dgPP.datagrid("getRows").length != 0) {

            if (!this.editMode) {
                return;
            }

            let selData = this.dgPP.datagrid("getSelected");
            if (selData != null) {
                if (selData.del == 1) {
                    this.btnDelete.linkbutton({iconCls: "icon-undo", text: "Вернуть"});

                } else {
                    this.btnDelete.linkbutton({iconCls: "icon-remove", text: "Удалить"});
                }
            } else {
                this.btnDelete.linkbutton({iconCls: "icon-remove", text: "Удалить"});
            }
        } else {
            this.btnDelete.linkbutton({iconCls: "icon-remove", text: "Удалить"});
        }
    }

    /**
     * Обработка выбора записи
     */
    btnOk_onClick() {
        if (this.dgPP.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для выбора");
            return false;
        }
        let selData = this.dgPP.datagrid("getSelected");
        if (selData == null) {
            this.ShowWarning("Выберите запись");
            return false;
        }
        if (this.ResultFunc != null) {
            this.ResultFunc({id: selData.id.toString()});
        }
        this.wPeriodParams.window("close");
        return false;
    }

    /**
     * Функция загрузки кодов задач для фильтра
     * @constructor
     */
    LoadTaskCodes() {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "get",
                url: this.GetUrl('/PeriodParams/listTaskCodes'),
                success: function (data) {
                    this.cbTaskCodeFilter.combobox({
                        valueField: 'taskCode',
                        textField: 'taskCode',
                        data: data
                    });
                    if (this.currentTaskCode != "") {
                        let finded = false;
                        for (let i = 0; i < data.length; i++) {
                            let tc = data[i].taskCode;
                            if (tc == this.currentTaskCode) {
                                this.cbTaskCodeFilter.combobox("setValue", this.currentTaskCode);
                                finded = true;
                            }
                        }
                        if (finded == false) {
                            this.currentTaskCode = "";
                        }
                    }
                    resolve(true);
                }.bind(this),
                error: function (data) {
                    reject(data);
                }.bind(this)
            });
        });
    }

    /**
     * Обработка события выбора кода в фильтре по коду
     * @param record
     */
    cbTaskCodeFilter_onSelect(record) {
        this.currentTaskCode = record.taskCode;
        this.btnUpdate_onClick();
    }

    btnClearTaskCodeFilter_onClick() {
        this.cbTaskCodeFilter.combobox("setValue", "");
        this.currentTaskCode = "";
        this.paramId = this.dgPP.datagrid("getSelected").id;
        this.btnUpdate_onClick();
    }
}

/**
 * Функция встраиваемого запуска модуля
 * @param Id идентификатор
 * @constructor
 */
export function StartNestedModul(Id) {
    let form = new PeriodParams("nested_", "");
    form.Start(Id);
}

/**
 * Вызов модуля в диалоговом окне
 * @param StartParams стартовые параметры
 * @param ResultFunc функция, которая будет вызываться по нажатию на кнопку "ОК"
 * @constructor
 */
export function StartModalModul(StartParams, ResultFunc) {
    let id = "wPeriodParams_Module_PeriodParams_PeriodParamsFormList";
    CreateModalWindow(id, "Периодические реквезиты")
    let form = new PeriodParams("modal_", StartParams);
    form.SetResultFunc(ResultFunc);
    form.Start(id);
}