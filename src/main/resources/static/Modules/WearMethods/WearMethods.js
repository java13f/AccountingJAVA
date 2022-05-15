import {FormView} from "../Core/FormView.js";
import {WearMethodsFormEdit} from "./WearMethodsFormEdit.js";

/**
 * Основной класс модуля
 */
class WearMethods extends FormView {
    /**
     * Конструктор
     * @param prefix - приставка для идентификаторов. Данная приставка добавится для каждого идентификатора
     * @param StartParams - стартовые параметры в формате JSON
     */
    constructor(prefix, StartParams) {
        super();
        this.WearMethodsId = -1;
        this.WearMethodsIndex = 0;
        this.prefix = prefix;
        this.StartParams = StartParams;
        this.sLoc = new LibLockService(300000);
        this.editMode = false;
    }

    /**
     * Функция загрузки формы
     * @param id - идентификатор эелемента HTML, в который будет загружена разметка частичного представления
     * @constructor
     */
    Start(id) {
        this.ModuleId = id;
        LoadForm("#" + this.ModuleId, this.GetUrl("/WearMethods/WearMethodsFormList?prefix=" + this.prefix), this.InitFunc.bind(this));
    }

    /**
     * Функция инициализации пользовательского интерфейса
     * @constructor
     */
    InitFunc() {
        this.InitComponents(this.ModuleId, this.prefix);
        AddKeyboardNavigationForGrid(this.dgWearMethods);

        this.dgWearMethods.datagrid({
            loadFilter: this.LoadFilter.bind(this),
            onLoadError: (data) => {
                this.ShowErrorResponse(data.responseJSON);
            },
            rowStyler: this.dgWearMethods_rowStyler.bind(this),
            onLoadSuccess: this.dgWearMethods_onLoadSuccess.bind(this),
            onSelect: this.btnDeleteChangeText.bind(this)
        });

        this.LoadRights();

        this.btnUpdate.linkbutton({onClick: this.btnUpdate_onClick.bind(this)});
        this.cbShowDel.checkbox({onChange: this.btnUpdate_onClick.bind(this)});
        this.btnAdd.linkbutton({onClick: this.btnAdd_onClick.bind(this)});
        this.btnChange.linkbutton({onClick: this.btnChange_onClick.bind(this)});
        this.btnDelete.linkbutton({onClick: this.btnDelete_onClick.bind(this)});
        this.btnUpdate_onClick();

        if (this.prefix == "modal_") {
            this.pOkCancel.css("visibility", "visible");
            this.wWearMethods = $("#" + this.ModuleId);
            this.InitCloseEvents(this.wWearMethods, false);
            this.btnCancel.linkbutton({
                onClick: function () {
                    this.wWearMethods.window("close")
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
    dgWearMethods_rowStyler(index, row) {
        if (row.del == 1) {
            return "background-color:gray;";
        }
    }

    /**
     * Обработка окончания загрузки списка кодов территорий
     * @param data - информация о загруженных данных
     */
    dgWearMethods_onLoadSuccess(data) {
        if (data.total > 0) {
            if (this.WearMethodsId != -1) {
                this.dgWearMethods.datagrid("selectRecord", this.WearMethodsId);
            } else {
                if (this.WearMethodsIndex >= 0 && this.WearMethodsIndex < data.total) {
                    this.dgWearMethods.datagrid("selectRow", this.WearMethodsIndex);
                } else if (data.total > 0) {
                    this.dgWearMethods.datagrid("selectRow", data.total - 1);
                }
            }
            this.WearMethodsId = -1;
            this.WearMethodsIndex = 0;
        }
    }

    /**
     * Обновление списка кодов территорий
     */
    btnUpdate_onClick() {
        let row = this.dgWearMethods.datagrid("getSelected");
        if (row != null) {
            this.WearMethodsIndex = this.dgWearMethods.datagrid("getRowIndex", row);
            if (this.WearMethodsIndex < 0) {
                this.WearMethodsIndex = 0;
            }
        }
        let showDel = this.cbShowDel.checkbox("options").checked ? "true" : "false";
        this.dgWearMethods.datagrid({url: this.GetUrl("/WearMethods/getWearMethodsList?showDel=" + showDel)});
    }

    /**
     * Проверка прав
     */
    LoadRights() {
        $.ajax({
            method: "get",
            url: this.GetUrl('/CoreUtils/GetActRights?TaskCode=WearMethods.dll&ActCode=WearMethodsChange'),
            success: function (data) {
                if (data.length == 0) {
                    this.btnAdd.linkbutton({disabled: false});
                    //this.btnChange.linkbutton({disabled: false});
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
     * Обработка кнопки добавления
     */
    btnAdd_onClick() {
        let form = new WearMethodsFormEdit();
        form.SetResultFunc((RecId) => {
            this.WearMethodsId = RecId;
            this.btnUpdate_onClick();
        });
        form.Show({AddMode: true});
    }

    /**
     * Обработка нажатия на кнопку редактирования
     * @returns {boolean}
     */
    btnChange_onClick() {
        if (this.dgWearMethods.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для изменения");
            return false;
        }
        let selData = this.dgWearMethods.datagrid("getSelected");
        if (selData == null) {
            this.ShowWarning("Выберите запись для изменения");
            return false;
        }
        if (this.editMode) {
            this.sLoc.LockRecord("wear_mthds", selData.id, this.btnContinueChange_onClick.bind(this));
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
        let form = new WearMethodsFormEdit();
        form.SetResultFunc((RecId) => {
            this.WearMethodsId = RecId;
            this.btnUpdate_onClick();
        });
        form.SetCloseWindowFunction((options) => {
            if (options != null) {
                if (options.lockState) {
                    this.sLoc.FreeLockRecord("wear_mthds", options.id);
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
        if (this.dgWearMethods.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для удаления");
            return false;
        }
        let selData = this.dgWearMethods.datagrid("getSelected");
        if (selData == null) {
            this.ShowWarning("Выберите запись для удаления");
            return false;
        }
        let del = selData.del;
        let header = "Удаление";
        let action = "удалить";
        if (del == 1) {
            header = "Восстановление";
            action = "восстановить";
        }
        $.messager.confirm(header, "Вы действительно хотите " + action + " выделенный метод начисления износа?",
            function (result) {
                if (result) {
                    this.sLoc.StateLockRecord("wear_mthds", selData.id, this.btnContinueDelete_onClick.bind(this));
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
                url: this.GetUrl('/WearMethods/delete'),
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
        if (this.dgWearMethods.datagrid("getRows").length != 0) {
            let selData = this.dgWearMethods.datagrid("getSelected");

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
        if (this.dgWearMethods.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для выбора");
            return false;
        }
        let selData = this.dgWearMethods.datagrid("getSelected");
        if (selData == null) {
            this.ShowWarning("Выберите запись");
            return false;
        }
        if (this.ResultFunc != null) {
            this.ResultFunc({id: selData.id.toString()});
        }
        this.wWearMethods.window("close");
        return false;
    }
}

/**
 * Функция встраиваемого запуска модуля
 * @param Id идентификатор
 * @constructor
 */
export function StartNestedModul(Id) {
    let form = new WearMethods("nested_", "");
    form.Start(Id);
}

/**
 * Вызов модуля в диалоговом окне
 * @param StartParams стартовые параметры
 * @param ResultFunc функция, которая будет вызываться по нажатию на кнопку "ОК"
 * @constructor
 */
export function StartModalModul(StartParams, ResultFunc) {
    let id = "wWearMethods_Module_WearMethods_WearMethodsFormList";
    CreateModalWindow(id, "Методы начисления износа");
    let form = new WearMethods("modal_", StartParams);
    form.SetResultFunc(ResultFunc);
    form.Start(id);
}