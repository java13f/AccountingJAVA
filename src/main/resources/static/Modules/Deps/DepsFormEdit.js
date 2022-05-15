import {FormView} from "../Core/FormView.js";

export class DepsFormEdit extends FormView {
    constructor() {
        super();
        this.BossUserId = -1;
        this.KterId = -1;
    }

    /**
     * Показать форму добавления/изменения записи
     * @param options
     * @constructor
     */
    Show(options) {
        this.options = options; //JSON - объект с параметрами
        LoadForm("#ModalWindows", this.GetUrl("/Deps/DepsFormEdit"), this.InitFunc.bind(this));
    }

    /**
     * Инциализация интерфейса пользователя
     * @constructor
     */
    InitFunc() {
        this.InitComponents("wDepsFormEdit_Module_Deps", "");
        this.InitCloseEvents(this.wDepsFormEdit);
        this.btnCancel.linkbutton({
            onClick: () => {
                this.wDepsFormEdit.window("close")
            }
        });
        if (this.options.AddMode) {
            this.pbEditMode.attr("class", "icon-addmode");
            this.wDepsFormEdit.window({title: "Добавление новой записи"});
            this.lAction.html("Введите данные для новой записи");
            this.LoadUsers();
        } else {
            this.pbEditMode.attr("class", "icon-editmode");
            this.wDepsFormEdit.window({title: "Редатирование записи"});
            this.lAction.html("Введите данные для редактирования текущей записи");
            if (this.options.editMode) {
                this.btnOk.linkbutton({disabled: false});
            } else {
                this.btnOk.linkbutton({disabled: true});
                this.btnChooseKter.linkbutton({disabled: true});
                this.btnClearBossUser.linkbutton({disabled: true});
                this.txCode.textbox({editable: false});
                this.txName.textbox({editable: false});
                this.txKter.textbox({editable: false});
                this.txParentName.textbox({editable: false});
                this.cbBossUser.combobox({disabled: true});
                this.chbMainDep.checkbox({disabled:true});
            }
            this.LoadDep(this.options.main_dep);
        }
        this.cbBossUser.combobox({onSelect: this.cbBossUser_onSelect.bind(this)});
        this.btnClearBossUser.linkbutton({onClick: this.btnClearBossUser_onClick.bind(this)});
        this.btnChooseKter.linkbutton({onClick: this.btnChooseKter_onClick.bind(this)});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
    }

    loadDataStts() {

    }

    /**
     * Функция загрузки кода территории для просмотра или редактирования
     * @constructor
     */
    LoadDep(main_dep) {
        $.ajax({
            method: "get",
            url: this.GetUrl('/Deps/get?id=' + this.options.id),
            success: function (data) {
                this.txId.textbox("setText", data.id);
                this.txCode.textbox("setText", data.code);
                this.txName.textbox("setText", data.name);
                this.BossUserId = data.bossUserId;
                this.KterId = data.kterId;
                this.txParent.textbox("setText", data.parentName);
                main_dep===1?this.chbMainDep.checkbox("check"):this.chbMainDep.checkbox("uncheck");
                this.txCreator.textbox("setText", data.creator);
                this.txCreated.textbox("setText", data.created);
                this.txChanger.textbox("setText", data.changer);
                this.txChanged.textbox("setText", data.changed);
                this.LoadKter();
                this.LoadUsers();
                // this.LoadBossUser();
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Функция загрузки списка пользователей
     * @constructor
     */
    LoadUsers() {
        $.ajax({
            method: "get",
            url: this.GetUrl('/Deps/getUsers'),
            success: function (data) {
                this.cbBossUser.combobox({
                    valueField: 'id',
                    textField: 'name',
                    data: data
                });

                if (this.BossUserId != -1) {
                    for (let iUser = 0; iUser < data.length; iUser++) {
                        let user = data[iUser];
                        if (user.id == this.BossUserId) {
                            this.cbBossUser.combobox("setValue", this.BossUserId);
                        }
                    }
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Загрузка пользователя
     * @constructor
     */
    LoadBossUser() {
        $.ajax({
            method: "get",
            url: this.GetUrl('/Deps/getBossUser?id=' + this.BossUserId),
            success: function (data) {
                if (this.BossUserId != -1) {
                    this.txBossUser.textbox("setText", (data.name));
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Загрузка территории
     * @constructor
     */
    LoadKter() {
        $.ajax({
            method: "get",
            url: this.GetUrl('/Deps/getKter?id=' + this.KterId),
            success: function (data) {
                if (this.KterId != -1) {
                    this.txKter.textbox("setText", (data.name));
                }
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
            url: this.GetUrl('/Deps/checkSameCode?id=' + obj.id.toString()
                + '&kterId=' + obj.kterId.toString()
                + '&code=' + obj.code),
            success: function (data) {
                if (data) {
                    this.ShowWarning("Подразделение с кодом " + obj.code + " для указанной территории уже существует в базe данных");
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
     * Сохранение подразделения
     * @param obj подразделение
     * @constructor
     */
    Save(obj) {
        $.ajax({
            method: "POST",
            data: JSON.stringify(obj),
            url: this.GetUrl('/Deps/save'),
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (this.ResultFunc != null) {
                    this.ResultFunc(data);
                    this.wDepsFormEdit.window("close");
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
        let code = this.txCode.textbox("getText");
        let name = this.txName.textbox("getText");
        let maindep=this.chbMainDep.checkbox("options").checked ? "true" : "false";

        if (id.length == 0) {
            id = "-1";
        }
        if (code.length == 0) {

            this.ShowToolTip("#divtbCode_Module_Deps","Введите пожалуйста код территории",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }
        if (code.length > 10) {
            this.ShowToolTip("#divtbCode_Module_Deps","Код не может быть больше 10 символов",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }

        if (isNaN(code)) {
            this.ShowToolTip("#divtbCode_Module_Deps","Код подразделения должен содержать только числа",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }
        if (name.length == 0) {

            this.ShowToolTip("#divtbName_Module_Deps","Введите пожалуйста наименование подразделения",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }
        if (this.KterId == -1) {
            this.ShowToolTip("#divtbKter_Module_Deps","Выберите пожалуйста территорию",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }
        if(maindep==="true"){
            $.ajax({
                method: "get",
                url: this.GetUrl("/Deps/CheckMainDep?id=" + this.KterId),
                success: function (data) {
                    if( data.length!=0){
                        if(data[0].code!=code) {
                            this.ShowWarning("Для указанной территории уже существует главное подразделение (код \""+data[0].code+"\")!");
                            return false;
                        }
                        else{
                            let obj = {id: id, code: code, name: name, kterId: this.KterId, bossUserId: this.BossUserId,main_dep:maindep==="true"?1:0}
                            this.CheckSameCode(obj)
                        }
                    }
                    else {
                        let obj = {
                            id: id,
                            code: code,
                            name: name,
                            kterId: this.KterId,
                            bossUserId: this.BossUserId,
                            main_dep: maindep === "true" ? 1 : 0
                        }
                        this.CheckSameCode(obj)
                    }
                }.bind(this),
                error: function (data) {
                    this.ShowErrorResponse(data.responseJSON);
                }.bind(this)
            });
        }
        else{
            let obj = {id: id, code: code, name: name, kterId: this.KterId, bossUserId: this.BossUserId,main_dep:maindep==="true"?1:0}
            this.CheckSameCode(obj)
        }

        return false;
    }

    /**
     * Обработка нажатия на кнопку выбора руководителя
     */
    btnChooseBossUser_onClick() {
        StartModalModulGlobal("Users", {}, ((data) => {
            this.BossUserId = data.id;
            this.LoadBossUser();
        }).bind(this));
    }

    /**
     * Обработка выбранного казначейства
     * @param record объект с выбранным казначейством
     */
    cbBossUser_onSelect(record) {
        this.BossUserId = record.id;
    }

    /**
     * Обработка нажатия на кнопку очистки руководителя
     */
    btnClearBossUser_onClick() {
        // this.txBossUser.textbox("setText", "");
        this.cbBossUser.combobox("setValue", "");
        this.BossUserId = -1;
    }

    /**
     * Обработка нажатия на кнопку выбора территории
     */
    btnChooseKter_onClick() {
        StartModalModulGlobal("Kter", {}, ((data) => {
            this.KterId = data.id;
            this.LoadKter()
        }).bind(this));
    }
}