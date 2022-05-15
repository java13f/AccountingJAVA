import {FormView} from "../Core/FormView.js";

export class ListParamsFormEdit extends FormView {

    constructor() {
        super();
    }

    /**
     * Показать форму добавления/изменения записи
     * @param options
     * @constructor
     */
    Show(options) {
        this.options = options;
        LoadForm("#ModalWindows", this.GetUrl("/ListParams/ListParamsFormEdit"), this.InitFunc.bind(this));
    }

    /**
     * Функция загрузки списка таблиц
     * @constructor
     */
    LoadListParams() {
        $.ajax({
            method: "get",
            url: this.GetUrl('/ListParams/get?id=' + this.options.id),
            success: function (data) {
                this.txId.textbox("setText", data.id);
                this.txParamCode.textbox("setText", data.paramcode);
                this.txTaskCode.textbox("setText", data.taskcode);
                this.txName.textbox("setText", data.name);
                this.txNom.textbox("setText", data.nom);
                if (data.strict == 1) {
                    this.cbStrict.checkbox("check");
                }
                this.txRefferModul.textbox("setText", data.reffermodul);
                this.txRefferFunc.textbox("setText", data.refferfunc);
                this.txRefferTable.textbox("setText", data.reffertable);
                this.txRefferCode.textbox("setText", data.reffercode);
                this.txRefferEditCode.textbox("setText", data.reffereditcode);
                this.txCodeJs.textbox("setText", data.codejs);
                this.txCreator.textbox("setText", data.creator);
                this.txCreated.textbox("setText", data.created);
                this.txChanger.textbox("setText", data.changer);
                this.txChanged.textbox("setText", data.changed);

                if (data.paramcode.length != 0) {
                    this.lbNameParL.html("<b><i>" + "'" + data.paramcode + "'" + "</i> </b>")
                    this.lbNameParR.html("<b><i>" + "'" + data.paramcode + "'" + "</i> </b>")

                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Инциализация интерфейса пользователя
     * @constructor
     */
    InitFunc() {
        this.InitComponents("wListParamsFormEdit_Module_ListParams", "");
        this.InitCloseEvents(this.wListParamsFormEdit);
        this.btnCancel.linkbutton({
            onClick: () => {
                this.wListParamsFormEdit.window("close")
            }
        });
        if (this.options.AddMode) {
            this.pbEditMode.attr("class", "icon-addmode");
            this.wListParamsFormEdit.window({title: "Добавление новой записи"});
            this.lAction.html("Введите данные для новой записи");
        } else {
            this.pbEditMode.attr("class", "icon-editmode");
            this.wListParamsFormEdit.window({title: "Редатирование записи"});
            this.lAction.html("Введите данные для редактирования текущей записи");
            if (this.options.editMode) {
                this.btnOk.linkbutton({disabled: false});
            } else {
                this.btnOk.linkbutton({disabled: true});
            }
            this.LoadListParams();
        }
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.txParamCode.textbox({
            onChange: (value) => {
                if (this.txParamCode.textbox("getText") != "") {
                    this.lbNameParL.html("<b><i>" + "'" + this.txParamCode.textbox("getText").toLowerCase() + "'" + "</i> </b>")
                    this.lbNameParR.html("<b><i>" + "'" + this.txParamCode.textbox("getText").toLowerCase() + "'" + "</i> </b>")
                    if (this.txParamCode.textbox("getText").toLowerCase() != this.txParamCode.textbox("getText")) {
                        this.txParamCode.textbox("setText", value.toLowerCase());
                        this.ShowSlide("Внимание", "'Код параметра' переведен в нижний регистр");
                    }
                } else {
                    this.lbNameParL.text("'название реквизита'");
                    this.lbNameParR.text("'название реквизита'");
                }
            }
        }); // перевод в нижний регистр, сообщение и замена текста в label

        this.txTaskCode.textbox({
            onChange: (value) => {
                if (this.txTaskCode.textbox("getText").toLowerCase() != this.txTaskCode.textbox("getText")) {
                    this.txTaskCode.textbox("setText", value.toLowerCase());
                    this.ShowSlide("Внимание", 'Код задачи(таблицы) переведен  в нижний регистр');
                }
            }
        }); // перевод в нижний регистр  и сообщение
    }

    /**
     * Обработка нажатия на кнопку "ОК"
     */
    btnOk_onClick() {
        let id = this.txId.textbox("getText");
        let paramcode = this.txParamCode.textbox("getText");
        let taskcode = this.txTaskCode.textbox("getText");
        let name = this.txName.textbox("getText");
        let nom = this.txNom.textbox("getText");
        let cbStrict = this.cbStrict.checkbox("options").checked ? "true" : "false";
        let strict = "0";
        if (cbStrict === "true") {
            strict = "1";
        }
        let reffermodul = this.txRefferModul.textbox("getText");
        let refferfunc = this.txRefferFunc.textbox("getText");
        let reffertable = this.txRefferTable.textbox("getText");
        let codejs = this.txCodeJs.textbox("getText");
        let reffercode = this.txRefferCode.textbox("getText");
        let reffereditcode = this.txRefferEditCode.textbox("getText");
        if (id.length == 0) {
            id = "-1";
        }
        if (paramcode.length == 0) {
            this.ShowToolTip('#txParamCode_Module_ListParams_ListParamsFormEdit_toolTip', 'Введите пожалуйста <b>код параметра</b>', {
                icon: 'icon-no',
                title: 'Ошибка',
                position: 'bottom',
                delay: 5000
            });
            return false;
        }
        if (taskcode.length == 0) {
            this.ShowToolTip('#txTaskCode_Module_ListParams_ListParamsFormEdit_toolTip', 'Введите пожалуйста <b>код задачи(таблицы)</b>', {
                icon: 'icon-no',
                title: 'Ошибка',
                position: 'bottom',
                delay: 5000
            });
            return false;
        }
        if (name.length == 0) {
            this.ShowToolTip('#txName_Module_ListParams_ListParamsFormEdit_toolTip', 'Введите пожалуйста <b>наименование параметра</b>', {
                icon: 'icon-no',
                title: 'Ошибка',
                position: 'bottom',
                delay: 5000
            });
            return false;
        }
        if (nom.length == 0) {
            this.ShowToolTip('#txNom_Module_ListParams_ListParamsFormEdit_toolTip', 'Введите пожалуйста <b> порядковый номер параметра</b>', {
                icon: 'icon-no',
                title: 'Ошибка',
                position: 'bottom',
                delay: 5000
            });
            return false;
        }
        if (isNaN(nom)) {
            this.ShowToolTip('#txNom_Module_ListParams_ListParamsFormEdit_toolTip', '<b> Порядковый номер параметра</b> должен содержать только числа', {
                icon: 'icon-no',
                title: 'Ошибка',
                position: 'bottom',
                delay: 5000
            });
            return false;
        }

        let model = {
            id: id,
            paramcode: paramcode,
            taskcode: taskcode,
            name: name,
            nom: nom,
            strict: strict,
            reffermodul: reffermodul,
            refferfunc: refferfunc,
            reffertable: reffertable,
            codejs: codejs,
            reffercode: reffercode,
            reffereditcode: reffereditcode
        }

        this.ExistsParamsTaskCodeAndNom(model);
        return false;
    }

    /**
     * Сохранение дополниельного реквизита
     * @param obj дополниельный реквизит
     * @constructor
     */
    Save(obj) {
        $.ajax({
            method: "POST",
            data: JSON.stringify(obj),
            url: this.GetUrl('/ListParams/save'),
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (this.ResultFunc != null) {
                    this.ResultFunc(data);
                    this.wListParamsFormEdit.window("close");
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Проверка существования дополнительного реквизита с уникальными полями (taskcode и nom)
     * @param model модель проверяемого реквизита
     * @constructor
     */
    ExistsParamsTaskCodeAndNom(model) {
        $.ajax({
            method: "get",
            url: this.GetUrl('/ListParams/duplicateTaskCodeAndNom?taskcode=' + model.taskcode + '&nom=' + model.nom + '&id=' + model.id),
            success: function (data) {
                if (data) {
                    this.ShowError("В базе уже существует запись с уникальным индексом: код задачи (таблицы): " + model.taskcode + "; порядковый номер параметра: " + model.nom);
                } else {
                    this.ExistsParamsTaskCodeAndParamCode(model);
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Проверка существования дополнительного реквизита с уникальными полями (taskcode и paramcode)
     * @param model
     * @constructor
     */
    ExistsParamsTaskCodeAndParamCode(model) {
        $.ajax({
            method: "get",
            url: this.GetUrl('/ListParams/duplicateTaskCodeAndParamCode?taskcode=' + model.taskcode + '&paramcode=' + model.paramcode + '&id=' + model.id),
            success: function (data) {
                if (data) {
                    this.ShowError("В базе уже существует запись с уникальным индексом: код задачи (таблицы): " + model.taskcode + "; код параметра: " + model.paramcode);
                } else {
                    if (model.reffercode !== "") {
                        this.ExistsRefferParams(model);
                    }
                    else {this.Save(model);}
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     *
     * @param model
     * @constructor
     */
    ExistsRefferParams(model) {
        $.ajax({
            method: "get",
            url: this.GetUrl('/ListParams/exsistRefferParams?reffercode=' + model.reffercode),
            success: function (data) {
                if (!data) {
                    this.ShowToolTip('#txRefferCode_Modul_ListParams_ListParamsFormEdit_toolTip', 'В таблице RefferParams не существует кода <b>'+model.reffercode+'</b>', {
                        icon: 'icon-no',
                        title: 'Ошибка',
                        position: 'bottom',
                        delay: 5000
                    });
                } else {
                    this.Save(model);
                }

            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

}
