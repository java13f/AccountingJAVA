import {FormView} from "../Core/FormView.js";

/**
 * Основной класс модуля
 */
class Users extends FormView {
    /**
     * Конструктор
     * @param prefix - приставка для идентификаторов. Данная приставка добавится для каждого идентификатора
     * @param StartParams - стартовые параметры в формате JSON
     */
    constructor(prefix, StartParams) {
        super();
        this.UsersId = -1;
        this.UsersIndex = 0;
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
        LoadForm("#" + this.ModuleId, this.GetUrl("/Users/UsersFormList?prefix=" + this.prefix), this.InitFunc.bind(this));
    }

    /**
     * Функция инициализации пользовательского интерфейса
     * @constructor
     */
    InitFunc() {
        this.InitComponents(this.ModuleId, this.prefix);
        AddKeyboardNavigationForGrid(this.dgUsers);
        this.dgUsers.datagrid({
            loadFilter: this.LoadFilter.bind(this),
            onLoadError: (data) => {
                this.ShowErrorResponse(data.responseJSON);
            },
            rowStyler: this.dgUsers_rowStyler.bind(this),
            onLoadSuccess: this.dgUsers_onLoadSuccess.bind(this),

        });
        this.txFilter.textbox({onChange: this.btnUpdate_onClick.bind(this)});
        this.btnUpdate.linkbutton({onClick: this.btnUpdate_onClick.bind(this)});
        this.cbShowDel.checkbox({onChange: this.btnUpdate_onClick.bind(this)});

        this.btnUpdate_onClick();
        if (this.prefix == "modal_") {
            this.pOkCancel.css("visibility", "visible");
            this.wUsers = $("#" + this.ModuleId);
            this.InitCloseEvents(this.wUsers, false);
            this.btnCancel.linkbutton({
                onClick: function () {
                    this.wUsers.window("close")
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
    dgUsers_rowStyler(index, row) {
        if (row.del == 1) {
            return "background-color:gray;";
        }
    }

    /**
     * Обработка окончания загрузки списка кодов территорий
     * @param data - информация о загруженных данных
     */
    dgUsers_onLoadSuccess(data) {
        if (data.total > 0) {
            if (this.UsersId != -1) {
                this.dgUsers.datagrid("selectRecord", this.UsersId);
            } else {
                if (this.UsersIndex >= 0 && this.UsersIndex < data.total) {
                    this.dgUsers.datagrid("selectRow", this.UsersIndex);
                } else if (data.total > 0) {
                    this.dgUsers.datagrid("selectRow", data.total - 1);
                }
            }
            this.UsersId = -1;
            this.UsersIndex = 0;
        }
    }

    /**
     * Обновление списка кодов территорий
     */
    btnUpdate_onClick() {
        let row = this.dgUsers.datagrid("getSelected");
        if (row != null) {
            this.UsersIndex = this.dgUsers.datagrid("getRowIndex", row);
            if (this.UsersIndex < 0) {
                this.UsersIndex = 0;
            }
        }

        let filter = this.txFilter.textbox("getText");
        filter = encodeURIComponent(filter);

        let showDel = this.cbShowDel.checkbox("options").checked ? "true" : "false";
        this.dgUsers.datagrid({url: this.GetUrl("/Users/List?filter=" + filter + "&showDel=" + showDel)});
    }



    /**
     * Обработка выбора записи
     */
    btnOk_onClick() {
        if (this.dgUsers.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для выбора");
            return false;
        }
        let selData = this.dgUsers.datagrid("getSelected");
        if (selData == null) {
            this.ShowWarning("Выберите запись");
            return false;
        }
        if (this.ResultFunc != null) {
            this.ResultFunc({id: selData.id.toString()});
        }
        this.wUsers.window("close");
        return false;
    }
}

/**
 * Функция встраиваемого запуска модуля
 * @param Id идентификатор
 * @constructor
 */
export function StartNestedModul(Id) {
    let form = new Users("nested_", "");
    form.Start(Id);
}

/**
 * Вызов модуля в диалоговом окне
 * @param StartParams стартовые параметры
 * @param ResultFunc функция, которая будет вызываться по нажатию на кнопку "ОК"
 * @constructor
 */
export function StartModalModul(StartParams, ResultFunc) {
    let id = "wUsers_Module_Users_UsersFormList";
    CreateModalWindow(id, "Справочник пользователей");
    let form = new Users("modal_", StartParams);
    form.SetResultFunc(ResultFunc);
    form.Start(id);
}