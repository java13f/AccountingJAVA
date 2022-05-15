import {FormView} from "../Core/FormView.js";

export class WearMethodsFormEdit extends FormView {
    constructor() {
        super();
        this.InvGrpId = -1;
        this.accId = -1;
    }

    /**
     * Показать форму добавления/изменения записи
     * @param options
     * @constructor
     */
    Show(options) {
        this.options = options; //JSON - объект с параметрами
        LoadForm("#ModalWindows", this.GetUrl("/WearMethods/WearMethodsFormEdit"), this.InitFunc.bind(this));
    }

    /**
     * Инциализация интерфейса пользователя
     * @constructor
     */
    async InitFunc() {
        this.InitComponents("wWearMethodsFormEdit_Module_WearMethods", "");
        this.InitCloseEvents(this.wWearMethodsFormEdit);
        this.btnCancel.linkbutton({
            onClick: () => {
                this.wWearMethodsFormEdit.window("close")
            }
        });

        this.btnClearInvGrp.linkbutton({onClick: this.btnClearInvGrp_onClick.bind(this)});

        this.btnChooseAcc.linkbutton({onClick: this.btnChooseAcc_onClick.bind(this)});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.cbInvGrp.combobox({onSelect: this.cbInvGrp_onSelect.bind(this)});

        await this.loadInvGr();

        if (this.options.AddMode) {
            this.pbEditMode.attr("class", "icon-addmode");
            this.wWearMethodsFormEdit.window({title: "Добавление новой записи"});
            this.lAction.html("Введите данные для новой записи");
        } else {
            this.pbEditMode.attr("class", "icon-editmode");
            this.wWearMethodsFormEdit.window({title: "Редатирование записи"});
            this.lAction.html("Введите данные для редактирования текущей записи");

            if (this.options.editMode) {
                this.btnOk.linkbutton({disabled: false});
            } else {
                this.btnOk.linkbutton({disabled: true});

                this.btnClearInvGrp.linkbutton({disabled: true});
                this.cbInvGrp.combobox({disabled: true});
                this.btnChooseAcc.linkbutton({disabled: true});

                this.txPerc.textbox({editable: false});
                
                this.txAcc.textbox({editable: false});
            }

            await this.LoadWearMethod();
        }
    }

    /**
     * Функция загрузки кода методы наичсления износа для просмотра или редактирования
     * @constructor
     */
    LoadWearMethod() {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "get",
                url: this.GetUrl('/WearMethods/getWearMethodById?id=' + this.options.id),
                success: function (data) {
                    this.txId.textbox("setText", data.id);
                    this.txPerc.textbox("setText", data.perc);

                    this.txAcc.textbox("setText", data.accName);

                    this.InvGrpId = data.grId;
                    this.accId = data.accId;

                    this.cbInvGrp.combobox("setValue", this.InvGrpId===-1?'':this.InvGrpId);

                    this.txCreator.textbox("setText", data.creator);
                    this.txCreated.textbox("setText", data.created);
                    this.txChanger.textbox("setText", data.changer);
                    this.txChanged.textbox("setText", data.changed);
                    resolve(true);
                }.bind(this),
                error: function (data) {
                    reject(data);
                }
            });
        });
    }

    /**
     * Загрузка методы наичсления износа
     * @constructor
     */
    loadInvGr() {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "get",
                url: this.GetUrl('/WearMethods/getInvGrList'),
                success: function (data) {
                    this.cbInvGrp.combobox({
                        valueField: 'id',
                        textField: 'name',
                        data: data
                    });

                    resolve(true);
                }.bind(this),
                error: function (data) {
                    reject(data);
                }.bind(this)
            });
        });

        // $.ajax({
        //     method: "get",
        //     url: this.GetUrl('/WearMethods/getInvGrList'),
        //     success: function (data) {
        //         this.cbInvGrp.combobox({
        //             valueField: 'id',
        //             textField: 'name',
        //             data: data
        //         });
        //
        //         if (!this.options.AddMode) {
        //             for (let i = 0; i < data.length; i++) {
        //                 let gr = data[i];
        //                 if (gr.id == this.InvGrpId) {
        //                     this.cbInvGrp.combobox("setValue", this.InvGrpId);
        //                 }
        //             }
        //         }
        //     }.bind(this),
        //     error: function (data) {
        //         this.ShowErrorResponse(data.responseJSON);
        //     }.bind(this)
        // });
    }

    /**
     * Загрузка методы наичсления износа
     * @constructor
     */
    loadAcc() {
        $.ajax({
            method: "get",
            url: this.GetUrl('/WearMethods/getAccById?id=' + this.accId),
            success: function (data) {
                if (this.accId != -1) {
                    this.txAcc.textbox("setText", (data.name));
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Проверка на дубликат
     * @param
     * @constructor
     */
    checkForDublicate(obj) {
        $.ajax({
            method: "get",
            url: this.GetUrl('/WearMethods/checkForDublicate?id=' + obj.id.toString()
                + '&grId=' + obj.grId.toString()
                + '&accId=' + obj.accId.toString()),
            success: function (data) {
                if (data) {
                    this.ShowWarning("Запись с такой группой " + obj.grName + " и счетом " + obj.accName + " для указанной методы наичсления износа уже существует в базe данных");
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
     * Сохранение
     * @param obj
     * @constructor
     */
    Save(obj) {
        $.ajax({
            method: "POST",
            data: JSON.stringify(obj),
            url: this.GetUrl('/WearMethods/save'),
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (this.ResultFunc != null) {
                    this.ResultFunc(data);
                    this.wWearMethodsFormEdit.window("close");
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
        let perc = this.txPerc.textbox("getText");
        let acc = this.txAcc.textbox("getText");
        let invGrp = this.cbInvGrp.combobox("getText");

        if (id.length == 0) {
            id = "-1";
        }

        if (perc === "") {
            //this.ShowError("Процент износа не был введен.");
            this.ShowToolTip('#txPerc_Module_WearMethods_WearMethodsFormEdit_toolTip', 'Процент износа не был введен', {icon:'icon-no', title:'Внимание', position:'right', delay:5000})
            return false;
        }
        if (perc > 100) {
            //this.ShowError("Процент износа не был введен.");
            this.ShowToolTip('#txPerc_Module_WearMethods_WearMethodsFormEdit_toolTip', 'Процент износа не может быть больше 100 процентов', {icon:'icon-no', title:'Внимание', position:'right', delay:5000})
            return false;
        }
        if (isNaN(perc)) {
            //this.ShowError("Процент износа должен содержать только числа.");
            this.ShowToolTip('#txPerc_Module_WearMethods_WearMethodsFormEdit_toolTip', 'Процент износа должен содержать только числа', {icon:'icon-no', title:'Внимание', position:'right', delay:5000})
            return false;
        }

        if (acc === "") {
            //this.ShowError("Выберите пожалуйста счет");
            this.ShowToolTip('#txAcc_Module_WearMethods_WearMethodsFormEdit_toolTip', 'Выберите пожалуйста счет', {icon:'icon-no', title:'Внимание', position:'right', delay:5000})
            return false;
        }

        if (invGrp === "") {
            //this.ShowError("Выберите пожалуйста группу");
            this.ShowToolTip('#txInvGrp_Module_WearMethods_WearMethodsFormEdit_toolTip', 'Выберите пожалуйста группу', {icon:'icon-no', title:'Внимание', position:'right', delay:5000})
            return false;
        }

        let obj = {id: id, perc: this.txPerc.textbox("getText"), grId: this.InvGrpId, accId: this.accId}
        this.checkForDublicate(obj);
        return false;
    }



    /**
     * Обработка выбранного казначейства
     * @param record объект с выбранным казначейством
     */
    cbInvGrp_onSelect(record) {
        this.InvGrpId = record.id;
    }

    /**
     * Обработка нажатия на кнопку очистки руководителя
     */
    btnClearInvGrp_onClick() {
        // this.txInvGrp.textbox("setText", "");
        this.cbInvGrp.combobox("setValue", "");
        this.InvGrpId = -1;
    }

    /**
     * Обработка нажатия на кнопку выбора методы наичсления износа
     */
    btnChooseAcc_onClick() {
        StartModalModulGlobal("Accs", {}, ((data) => {
            this.accId = data.id;
            this.loadAcc();
        }).bind(this));
    }
}