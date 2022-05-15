import {FormView} from "../Core/FormView.js";

export class ObjsFormExplEdit extends FormView {

    constructor(StartParams, ListData) {
        super();
        this.ExplModel = {};
        this.StartParams = StartParams;
        this.ListData = ListData;

        this.actnom = "";
        this.datebeg = "";
        this.outInfo = "";
        this.dateend = "";
        this.datebegBase = "";
        this.dateendBase = "";
        this.flaglikv = "";

    }

    /**
     * Показать форму работа со соками эксплуатации
     * @param options
     * @constructor
     */
    Show(options) {
        this.options = options;
        LoadForm("#ModalWindows", this.GetUrl("/Objs/ObjsFormExplEdit"), this.InitFunc.bind(this));
    }

    /**
     * Инциализация интерфейса пользователя
     * @constructor
     */
    InitFunc() {
        this.InitComponents("wObjsFormExplEdit_Module_Objs", "");
        this.InitCloseEvents(this.wObjsFormExplEdit);

        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({
            onClick: () => {
                this.wObjsFormExplEdit.window("close")
            }
        });

        // Добавление кнопки в dateBox
        this.AddBtnDateBox();

        //Форматирование даты
        this.formatDate(this.dtDateBeg);
        this.formatDate(this.dtDateEnd);

        // Запись данных на форму
        this.LoadData();

        let StartParamsFlag = isEmpty(this.StartParams);
        if (StartParamsFlag) {
            this.pbEditMode.attr("class", "icon-addmode");
            this.wObjsFormExplEdit.window({title: "Добавление новой записи"});
            this.lAction.html("Введите данные для новой записи");
            this.txId.textbox("setText", -1);
        } else {
            this.pbEditMode.attr("class", "icon-editmode");
            this.wObjsFormExplEdit.window({title: "Редатирование записи"});
            this.lAction.html("Введите данные для редактирования текущей записи");
        }
    }

    /**
     * Запись данных на форму
     * @constructor
     */
    LoadData() {
        let StartParamsFlag = isEmpty(this.StartParams);
        if (!StartParamsFlag) {
            let id = this.StartParams.id;
            let actNom = this.StartParams.actnom;
            let dateBeg = this.StartParams.datebeg;
            let dateEnd = this.StartParams.dateend;
            let flagLikv = this.StartParams.flaglikvtx;
            let outInfo = this.StartParams.out_info;

            this.datebegBase = this.StartParams.datebegbase;
            this.dateendBase = this.StartParams.dateendbase;

            this.txId.textbox("setText", id);
            if (actNom !== null && actNom.length > 0) {
                this.txActNom.textbox("setText", actNom);
            }
            this.dtDateBeg.datebox({disabled: true});

            if (dateBeg.length > 0) {
                this.dtDateBeg.datebox("setValue", dateBeg);
            }

            if (dateEnd !== null && dateEnd.length > 0) {
                this.dtDateEnd.datebox("setValue", dateEnd);
            }
            if (flagLikv == 'Ликвидирован') {
                this.cbFlagLikv.checkbox("check");
            }

            if(outInfo != null && outInfo.length > 0)
            {
                this.txOutInfo.textbox("setText", outInfo);
            }
            this.txCreator.textbox("setText", this.StartParams.creator);
            this.txCreated.textbox("setText", this.StartParams.created);
            this.txChanger.textbox("setText", this.StartParams.changer);
            this.txChanged.textbox("setText", this.StartParams.changed);
        }
    }

    /**
     * Добавление кнопки в dateBox
     * @constructor
     */
    AddBtnDateBox() {
        // Поле ввода "Дата начала эксплуатации"
        this.dtDateBeg.datebox({
            icons: [{
                iconCls: 'icon-clear',
                handler: function (e) {
                    $(e.data.target).datebox('setValue', '');
                }
            }]
        });

        // Поле ввода "Дата окончания эксплуатации"
        this.dtDateEnd.datebox({
            icons: [{
                iconCls: 'icon-clear',
                handler: function (e) {
                    $(e.data.target).datebox('setValue', '');
                }
            }]
        });
    }

    /**
     * Устанавливает формат даты в виде dd.mm.yyyy
     * @param dateBox - получет dateBox в котором нужно сделать преобразование
     */
    formatDate(dateBox) {
        dateBox.datebox({
            formatter: function (date) {
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                var d = date.getDate();
                return (d < 10 ? ('0' + d) : d) + '.'
                    + (m < 10 ? ('0' + m) : m) + '.'
                    + y.toString();
            },
            parser: function (s) {
                if (!s) return new Date();
                var ss = (s.split('.'));
                var y = parseInt(ss[2], 10);
                var m = parseInt(ss[1], 10);
                var d = parseInt(ss[0], 10);
                if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
                    return new Date(y, m - 1, d);
                } else {
                    return new Date();
                }
            }
        });
    }

    /**
     * Обработка нажатия кнопки "ОК"
     */
    btnOk_onClick() {
        // Записываем данные в переменные
        this.actnom = this.txActNom.textbox("getText");
        this.outInfo = this.txOutInfo.textbox("getText");
        this.datebeg = this.dtDateBeg.datebox("getValue");
        this.dateend = this.dtDateEnd.datebox("getValue");
        this.flaglikv = this.cbFlagLikv.checkbox("options").checked ? "1" : "0";
        let row_index = this.txIndex.textbox("getText");
        let id = this.txId.textbox("getText");

        // date_beg - обязательное поле
        if (this.datebeg.length == 0) {
            this.ShowToolTip('#dtDateBeg_Module_Objs_ObjsFormExplEdit_toolTip', 'Введите пожалуйста <b>Дату начала эксплуатации</b>', {
                icon: 'icon-no',
                title: 'Ошибка',
                position: 'bottom',
                delay: 5000
            });
            return false;
        }

        // Если flag_likv был отмечен, то date_end обязательно должна быть установлена
        if (this.dateend.length == 0 && this.flaglikv == 1) {
            this.ShowToolTip('#dtDateEnd_Module_Objs_ObjsFormExplEdit_toolTip', 'Введите пожалуйста <b>Дату окончания эксплуатации</b>, поскольку объект ликвидируется', {
                icon: 'icon-no',
                title: 'Ошибка',
                position: 'bottom',
                delay: 5000
            });
            return false;
        }

        // Если date_end установлена, то проверяем что бы на не была меньше date_beg
        if (this.dateend.length > 0) {
            let dB = this.ChangeFormatDate(this.datebeg);
            let dE = this.ChangeFormatDate(this.dateend);
            if (dB > dE) {
                this.ShowToolTip('#dtDateEnd_Module_Objs_ObjsFormExplEdit_toolTip', '<b>Дату окончания эксплуатации</b> не может быть меньше <b>Даты начала эксплуатации</b>', {
                    icon: 'icon-no',
                    title: 'Ошибка',
                    position: 'bottom',
                    delay: 5000
                });
                return false;
            }
        }

        // Если заполнено поле out_info и не установлено "Ликвидирован"
        if(this.flaglikv == 0 &&  this.outInfo.length > 0 ){
            this.ShowToolTip('#txOutInfo_Module_Objs_ObjsFormExplEdit_toolTip', '<b>Причина выбытия</b> не может быть заполнена, поскольку объект не ливидируется', {
                icon: 'icon-no',
                title: 'Ошибка',
                position: 'bottom',
                delay: 5000
            });
            return false;
        }

        for (let i = 0; i < this.ListData.length; ++i) {
            // Провекра на дубликаты даты ввода в эксплуатацию
            if (this.ListData[i].datebeg == this.datebeg && this.ListData[i].del == 0 && this.options.rowIndex != i) {
                this.ShowToolTip('#dtDateBeg_Module_Objs_ObjsFormExplEdit_toolTip', 'На дату <b>' + this.datebeg + '</b> объект уже был введен в эксплуатацию', {
                    icon: 'icon-no',
                    title: 'Ошибка',
                    position: 'bottom',
                    delay: 5000
                });
                return false;
            }
            // Проверка на дубликаты даты ликвидицаии объекта
            if (this.dateend.length > 0) {
                if (this.ListData[i].dateend == this.dateend && this.ListData[i].del == 0 && this.options.rowIndex != i) {
                    this.ShowToolTip('#dtDateEnd_Module_Objs_ObjsFormExplEdit_toolTip', 'На дату <b>' + this.dateend + '</b> объект уже был выведен из эксплуатации', {
                        icon: 'icon-no',
                        title: 'Ошибка',
                        position: 'bottom',
                        delay: 5000
                    });
                    return false;
                }
            }
        }
        this.checkCloseDayDateBeg();
    }

    /**
     * Переводим строку в формат даты
     * @param dttm
     * @returns {Date}
     */
    dtFormat(dttm) {
        let dt = (dttm.split('.'));

        let y = parseInt(dt[2], 10);
        let m = parseInt(dt[1], 10);
        let d = parseInt(dt[0], 10);
        let nD = new Date(y, m - 1, d)
        return nD;
    }

    /**
     * Проверка даты начала эксплуатации (если день открыт, то идем в следующую проверку иначе ошибка)
     * @param date
     */
    checkCloseDayDateBeg() {
        if (this.StartParams.datebeg == null || this.StartParams.datebeg == "" || this.StartParams.datebeg == undefined) {
            $.ajax({
                method: "get",
                url: this.GetUrl('/Objs/checkCloseDay?date=' + this.datebeg),
                success: function (data) {
                    if (data == 0) {
                        this.ShowError("День " + this.datebeg + " закрыт или не был открыт");
                        return false;
                    }
                    this.checkCloseDayDateEnd();
                }.bind(this),
                error: function (data) {
                    this.ShowErrorResponse(data.responseJSON);
                }.bind(this)
            });
        } else {
            this.checkCloseDayDateEnd();
        }


    }

    checkCloseDayDateEnd() {
        if (this.dateend == null || this.dateend == "" || this.dateend == undefined) {
            this.checkCloseDayDateEndСontinuation();
        } else {
            $.ajax({
                method: "get",
                url: this.GetUrl('/Objs/checkCloseDay?date=' + this.dateend),
                success: function (data) {
                    if (data == 0) {
                        this.ShowError("День " + this.dateend + " закрыт или не был открыт");
                        return false;
                    }
                    this.checkCloseDayDateEndСontinuation();
                }.bind(this),
                error: function (data) {
                    this.ShowErrorResponse(data.responseJSON);
                }.bind(this)
            });
        }
    }

    checkCloseDayDateEndСontinuation() {
        if (this.dateendBase == null || this.dateendBase == "" || this.dateendBase == undefined) {
            this.Save();
        } else {
            $.ajax({
                method: "get",
                url: this.GetUrl('/Objs/checkCloseDay?date=' + this.dateendBase),
                success: function (data) {
                    if (data == 0) {
                        this.ShowError("День (установленный до изменения) " + this.dateendBase + " закрыт или не был открыт");
                        return false;
                    }
                    this.Save();
                }.bind(this),
                error: function (data) {
                    this.ShowErrorResponse(data.responseJSON);
                }.bind(this)
            });
        }
    }

    /**
     * Сохраняем в модель веденные данные и выходим из формы
     * @constructor
     */
    Save() {
        let index = this.txIndex.textbox('getText');
        let id = this.txId.textbox('getText');
        if (index.length == 0) {
            index = this.ListData.length;
        }
        let flaglikvtx = "Не ликвидирован";
        if (this.flaglikv == 1) {
            flaglikvtx = "Ликвидирован";
        }
        let newR = 0;
        let changeR = 0;

        if (id == "-1" && this.StartParams.new == undefined) {
            newR = 1;
            changeR = 1;
        } else {
            changeR = 1;
        }
        this.ExplModel =
            {
                id: parseInt(id),
                actnom: this.actnom,
                datebeg: this.datebeg,
                dateend: this.dateend,
                flaglikv: this.flaglikv,
                flaglikvtx: flaglikvtx,
                out_info: this.outInfo,
                new: newR,
                change: changeR,
                del: 0,
                error: 0
            };
        this.ResultFunc(this.ExplModel, this.options);
        this.wObjsFormExplEdit.window("close");
    }


    /**
     * Изменяем формат даты с dd.mm.yyyy на dd/mm/yyyy
     * @param date
     * @returns {number}
     * @constructor
     */
    ChangeFormatDate(date) {
        let myDate = date;
        myDate = myDate.split(".");
        let newDateBeg = myDate[2] + "-" + myDate[1] + "-" + myDate[0];
        return newDateBeg;
    }
}

/**
 * Проверка на пустоту
 * @param obj
 * @returns {boolean}
 */
function isEmpty(obj) {
    for (let key in obj) {
        // если тело цикла начнет выполняться - значит в объекте есть свойства
        return false;
    }
    return true;
}
