import {FormView} from "../Core/FormView.js";

/**
 * Основной класс модуля
 */
export class PeriodParamsFormEdit extends FormView {
    constructor() {
        super();
        this.Strict = -1;
        this.Nom = -1;
    }

    /**
     * Показать форму добавления/изменения записи
     * @param options
     * @constructor
     */
    Show(options) {
        this.options = options;
        LoadForm("#ModalWindows", this.GetUrl("/PeriodParams/PeriodParamsFormEdit"), this.InitFunc.bind(this));
    }

    /**
     * Инциализация интерфейса пользователя
     * @constructor
     */
    InitFunc() {
        this.InitComponents("wPeriodParamsFormEdit_Module_PeriodParams", "");
        this.InitCloseEvents(this.wPeriodParamsFormEdit);
        this.btnCancel.linkbutton({
            onClick: () => {
                this.wPeriodParamsFormEdit.window("close")
            }
        });
        if (this.options.AddMode) {
            this.pbEditMode.attr("class", "icon-addmode");
            this.wPeriodParamsFormEdit.window({title: "Добавление новой записи"});
            this.lAction.html("Введите данные для новой записи");
        } else {
            this.pbEditMode.attr("class", "icon-editmode");
            this.wPeriodParamsFormEdit.window({title: "Редатирование записи"});
            this.lAction.html("Введите данные для редактирования текущей записи");
            if (this.options.editMode) {
                this.btnOk.linkbutton({disabled: false});
            } else {
                this.btnOk.linkbutton({disabled: true});

                this.txParamCode.textbox({editable: false});
                this.txTaskCode.textbox({editable: false});
                this.txName.textbox({editable: false});
                this.txNom.textbox({editable: false});
                this.cbStrict.checkbox({disabled: true});
                this.txRefferModul.textbox({editable: false});
                this.txRefferFunc.textbox({editable: false});
                this.txRefferTable.textbox({editable: false});
                this.txRefferCode.textbox({editable: false});
                this.txCodeJs.textbox({editable: false});

            }
            this.LoadPeriodParam();
        }
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
    }

    /**
     * Функция загрузки реквизита
     * @constructor
     */
    LoadPeriodParam() {
        $.ajax({
            method: "get",
            url: this.GetUrl('/PeriodParams/get?id=' + this.options.id),
            success: function (data) {
                this.txId.textbox("setText", data.id);
                this.txParamCode.textbox("setText", data.paramCode);
                this.txTaskCode.textbox("setText", data.taskCode);
                this.txName.textbox("setText", data.name);
                if (data.strict == 1) {
                    this.cbStrict.checkbox("check")
                }
                this.txNom.textbox("setText", data.nom);
                this.txRefferModul.textbox("setText", data.refferModul);
                this.txRefferFunc.textbox("setText", data.refferFunc);
                this.txRefferTable.textbox("setText", data.refferTable);
                this.txRefferCode.textbox("setText", data.refferCode);
                this.txCreator.textbox("setText", data.creator);
                this.txCreated.textbox("setText", data.created);
                this.txChanger.textbox("setText", data.changer);
                this.txChanged.textbox("setText", data.changed);
                this.txCodeJs.textbox("setText", data.codeJs);
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Проверка существования кода подразделения
     * @param obj территория
     * @constructor
     */
    CheckSameCode(obj) {
        $.ajax({
            method: "get",
            url: this.GetUrl('/PeriodParams/checkSameCode?id=' + obj.id.toString()
                + '&taskCode=' + obj.taskCode
                + '&paramCode=' + obj.paramCode),
            success: function (data) {
                if (data) {
                    this.ShowWarning("Такой реквизит уже существует базe данных");
                } else {
                    this.Save(obj);
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Сохранение реквизита
     * @param obj модель реквизита
     * @constructor
     */
    Save(obj) {
        $.ajax({
            method: "POST",
            data: JSON.stringify(obj),
            url: this.GetUrl('/PeriodParams/save'),
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (this.ResultFunc != null) {
                    this.ResultFunc(data);
                    this.wPeriodParamsFormEdit.window("close");
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Обработка нажатия на кнопку "ОК"
     */
    btnOk_onClick() {
        let id = this.txId.textbox("getText");
        let taskCode = this.txTaskCode.textbox("getText");
        let paramCode = this.txParamCode.textbox("getText");
        let nom = this.txNom.textbox("getText");
        let name = this.txName.textbox("getText");
        let strict = this.cbStrict.checkbox("options").checked ? 1 : 0;

        let refferModul = this.txRefferModul.textbox("getText");
        let refferFunc = this.txRefferFunc.textbox("getText");
        let refferTable = this.txRefferTable.textbox("getText");
        let refferCode = this.txRefferCode.textbox("getText");

        let codeJs = this.txCodeJs.textbox("getText");

        if (id.length == 0) {
            id = "-1";
        }

        if (paramCode.length == 0) {
            this.ShowError("Введите пожалуйста код параметра");
            return false;
        }
        if (paramCode.length > 16) {
            this.ShowError("Код параметра должен быть не более 16 символов");
            return false;
        }

        if (taskCode.length == 0) {
            this.ShowError("Введите пожалуйста код задачи");
            return false;
        }
        if (taskCode.length > 16) {
            this.ShowError("Код задачи должен быть не более 16 символов");
            return false;
        }

        if (nom.length == 0) {
            this.ShowError("Введите пожалуйста номер по порядку");
            return false;
        }

        if (isNaN(nom)) {
            this.ShowError("Номер по порядку должен содержать только числа");
            return false;
        }

        if (name.length == 0) {
            this.ShowError("Введите пожалуйста наименование реквизита");
            return false;
        }

        if (!((!refferModul.length == 0 && !refferFunc.length == 0 && !refferTable.length == 0)
            ||
            (refferModul.length == 0 && refferFunc.length == 0 && refferTable.length == 0))) {
            this.ShowError("Поля Модуль справочника, Функция справочника и Таблица справочника должны быть либо пустыми либо заполненными ")
            return false;
        }

        let obj =
            {
                id: id,
                paramCode: paramCode,
                taskCode: taskCode,
                name: name,
                strict: strict,
                refferModul: refferModul,
                refferFunc: refferFunc,
                refferTable: refferTable,
                refferCode: refferCode,
                nom: nom,
                codeJs: codeJs
            }
        this.CheckSameCode(obj)
        return false;
    }
}