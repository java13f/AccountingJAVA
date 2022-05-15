import {FormView} from "../Core/FormView.js";
import {DepsFormEdit} from "./DepsFormEdit.js";

/**
 * Основной класс модуля
 */
class Deps extends FormView {
    /**
     * Конструктор
     * @param prefix - приставка для идентификаторов. Данная приставка добавится для каждого идентификатора
     * @param StartParams - стартовые параметры в формате JSON
     */
    constructor(prefix, StartParams) {
        super();
        this.DepsId = -1;
        this.DepsIndex = 0;
        this.prefix = prefix;
        this.StartParams = StartParams;
        this.sLoc = new LibLockService(300000);
        this.editMode = false;
        this.maindep="";
    }

    /**
     * Функция загрузки формы
     * @param id - идентификатор эелемента HTML, в который будет загружена разметка частичного представления
     * @constructor
     */
    Start(id) {
        this.ModuleId = id;
        LoadForm("#" + this.ModuleId, this.GetUrl("/Deps/DepsFormList?prefix=" + this.prefix), this.InitFunc.bind(this));
    }

    /**
     * Функция инициализации пользовательского интерфейса
     * @constructor
     */
    InitFunc() {
        this.InitComponents(this.ModuleId, this.prefix);
        AddKeyboardNavigationForGrid(this.dgDeps);
        this.dgDeps.datagrid({
            loadFilter: this.LoadFilter.bind(this),
            onLoadError: (data) => {
                this.ShowErrorResponse(data.responseJSON);
            },
            rowStyler: this.dgDeps_rowStyler.bind(this),
            onLoadSuccess: this.dgDeps_onLoadSuccess.bind(this),
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
            this.wDeps = $("#" + this.ModuleId);
            this.InitCloseEvents(this.wDeps, false);
            this.btnCancel.linkbutton({
                onClick: function () {
                    this.wDeps.window("close")
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
    dgDeps_rowStyler(index, row) {
        if (row.del == 1) {
            return "background-color:gray;";
        }
    }

    /**
     * Обработка окончания загрузки списка кодов территорий
     * @param data - информация о загруженных данных
     */
    dgDeps_onLoadSuccess(data) {
        if (data.total > 0) {
            if (this.DepsId != -1) {
                this.dgDeps.datagrid("selectRecord", this.DepsId);
            } else {
                if (this.DepsIndex >= 0 && this.DepsIndex < data.total) {
                    this.dgDeps.datagrid("selectRow", this.DepsIndex);
                } else if (data.total > 0) {
                    this.dgDeps.datagrid("selectRow", data.total - 1);
                }
            }
            this.DepsId = -1;
            this.DepsIndex = 0;
        }
    }

    /**
     * Обновление списка кодов территорий
     */
    btnUpdate_onClick() {
        let row = this.dgDeps.datagrid("getSelected");
        if (row != null) {
            this.DepsIndex = this.dgDeps.datagrid("getRowIndex", row);
            if (this.DepsIndex < 0) {
                this.DepsIndex = 0;
            }
        }
        let showDel = this.cbShowDel.checkbox("options").checked ? "true" : "false";
        this.dgDeps.datagrid({url: this.GetUrl("/Deps/list?showDel=" + showDel)});
    }

    /**
     * Проверка прав
     */
    LoadRights() {
        $.ajax({
            method: "get",
            url: this.GetUrl('/CoreUtils/GetActRights?TaskCode=Deps.dll&ActCode=DepsChange'),
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
        let form = new DepsFormEdit();
        form.SetResultFunc((RecId) => {
            this.DepsId = RecId;
            this.btnUpdate_onClick();
        });
        form.Show({AddMode: true});
    }

    /**
     * Обработка нажатия на кнопку редактирования
     * @returns {boolean}
     */
    btnChange_onClick() {
        if (this.dgDeps.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для изменения");
            return false;
        }
        let selData = this.dgDeps.datagrid("getSelected");
        if (selData == null) {
            this.ShowWarning("Выберите запись для изменения");
            return false;
        }
        this.maindep=selData.maindep;
        if (this.editMode) {
            this.sLoc.LockRecord("deps", selData.id, this.btnContinueChange_onClick.bind(this));
        } else {
            this.btnContinueChange_onClick({
                id: selData.id,
                AddMode: false,
                editMode: this.editMode,
                lockMessage: '',
                lockState: false,
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
        let form = new DepsFormEdit();
        form.SetResultFunc((RecId) => {
            this.DepsId = RecId;
            this.btnUpdate_onClick();
        });
        form.SetCloseWindowFunction((options) => {
            if (options != null) {
                if (options.lockState) {
                    this.sLoc.FreeLockRecord("deps", options.id);
                }
            }
        });
        options["main_dep"]=this.maindep==="*"?1:0;
        form.Show(options);
    }

    /**
     * Обработка нажатия на кнопку удаления
     * @returns {boolean}
     */
    btnDelete_onClick() {
        if (this.dgDeps.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для удаления");
            return false;
        }
        let selData = this.dgDeps.datagrid("getSelected");
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
        $.messager.confirm(header, "Вы действительно хотите " + action + " выделенное подразделение " + selData.name + " с кодом " + selData.code + "?",
            function (result) {
                if (result) {
                    this.sLoc.StateLockRecord("deps", selData.id, this.btnContinueDelete_onClick.bind(this));
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
                url: this.GetUrl('/Deps/delete'),
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
        if (this.dgDeps.datagrid("getRows").length != 0) {
            let selData = this.dgDeps.datagrid("getSelected");

            if (!this.canChange) {
                return;
            }

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
        if (this.dgDeps.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для выбора");
            return false;
        }
        let selData = this.dgDeps.datagrid("getSelected");
        if (selData == null) {
            this.ShowWarning("Выберите запись");
            return false;
        }
        if (this.ResultFunc != null) {
            this.ResultFunc({id: selData.id.toString()});
        }
        this.wDeps.window("close");
        return false;
    }
}

/**
 * Функция встраиваемого запуска модуля
 * @param Id идентификатор
 * @constructor
 */
export function StartNestedModul(Id) {
    let form = new Deps("nested_", "");
    form.Start(Id);
}

/**
 * Вызов модуля в диалоговом окне
 * @param StartParams стартовые параметры
 * @param ResultFunc функция, которая будет вызываться по нажатию на кнопку "ОК"
 * @constructor
 */
export function StartModalModul(StartParams, ResultFunc) {
    let id = "wDeps_Module_Deps_DepsFormList";
    CreateModalWindow(id, "Справочник подразделений");
    let form = new Deps("modal_", StartParams);
    form.SetResultFunc(ResultFunc);
    form.Start(id);
}