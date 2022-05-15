import {FormView} from "../Core/FormView.js";

export class ObjsFormFilter extends FormView {

    constructor() {
        super();
        this.filter = new LibFilter("objs");
        this.NameLP = "";
        this.NamePP = "";
        this.IdPP = "";
        this.FuncLP = "";
        this.FuncPP = "";
        this.TablePP = "";
        this.TableLP = "";
        this.setDelFilter = [];
        this.filterModel = {listParamId: "", periodParamId: ""};
        this.options = {}
        this.AccsId = -1;
        this.InvGrpsId = -1;
        this.TypeFondsId = -1;
        this.KekrId = -1;
        this.UnitsId = -1;
        this.WearMthdsId = -1;
    }

    /**
     * Показать форму фильтра
     * @param options
     * @constructor
     */
    Show(options) {
        this.options = options;
        LoadForm("#ModalWindows", this.GetUrl("/Objs/ObjsFormFilter"), this.InitFunc.bind(this));
    }

    /**
     * Инциализация интерфейса пользователя
     * @constructor
     */
    InitFunc() {
        this.InitComponents("wObjsFormFilter_Module_Objs", "");
        this.InitCloseEvents(this.wObjsFormFilter); //Инициализация закрытия формы по нажатию на клавиши "ESC" и "Enter"
        this.options.AddMode = true;
        this.options.EditMode = true;
        this.customizationAmount();
        //Загрузка данных
        this.LoadObjFilter();
        this.LoadListParamsList();
        this.LoadPeriodParamsList();

        this.LoadAccsList();
        this.LoadInvGrpsList();
        this.LoadTypeFondsList();
        this.LoadKekrList();
        this.LoadUnitsList();
        this.LoadWearMthdsList();


        //Кнопки управления формой
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({
            onClick: () => {
                this.wObjsFormFilter.window("close")
            }
        });

        //Кнопки добавления из справочников
        this.btnAddType.linkbutton({onClick: this.btnAddType_onClick.bind(this)});
        this.btnAddKter.linkbutton({onClick: this.btnAddKter_onClick.bind(this)});
        this.btnAddValueLP.linkbutton({onClick: this.btnAddValueLP_onClick.bind(this)});
        this.btnAddValuePP.linkbutton({onClick: this.btnAddValuePP_onClick.bind(this)});

        //Кнопки очистки полей и всей формы
        this.btnClear.linkbutton({onClick: this.btnClear_onClick.bind(this)});

        //Выбор данных в comboBox
        this.cbAccs.combobox({onSelect: this.cbAccs_onSelect.bind(this)});
        this.cbInvGrps.combobox({onSelect: this.cbInvGrps_onSelect.bind(this)});
        this.cbUnits.combobox({onSelect: this.cbUnits_onSelect.bind(this)});
        this.cbKekr.combobox({onSelect: this.cbKekr_onSelect.bind(this)});
        this.cbTypeFonds.combobox({onSelect: this.cbTypeFonds_onSelect.bind(this)});
        this.cbWearMthds.combobox({onSelect: this.cbWearMthds_onSelect.bind(this)});
        this.cbNameLP.combobox({onSelect: this.cbNameLP_onSelect.bind(this)});
        this.cbNamePP.combobox({onSelect: this.cbNamePP_onSelect.bind(this)});

        // Управление checkBox
        this.cbFlagSuspended.checkbox({onChange: this.cbFlagSuspended_onChange.bind(this)});
        this.cbFlagLikv.checkbox({onChange: this.cbFlagLikv_onChange.bind(this)});

        //Устновка формата в dateBox
        this.formatDate(this.dtDateBuyIn);
        this.formatDate(this.dtDateBuyBy);
        this.formatDate(this.dtDateExpIn);
        this.formatDate(this.dtDateExpBy);
        this.formatDate(this.dtDateLikvIn);
        this.formatDate(this.dtDateLikvBy);

        this.AddBtnTextBox();
    }

    /**
     * Анализируем comboBox "Приостановлен"
     */
    cbFlagSuspended_onChange() {
        if (this.cbFlagSuspended.checkbox("options").checked == false && this.cbFlagLikv.checkbox("options").checked == false) {
            this.lTextDate.html("Дата приостановления с ");
            this.cbFlagSuspended.checkbox('check');
        } else if (this.cbFlagSuspended.checkbox("options").checked == true) {
            this.lTextDate.html("Дата приостановления с ");
            this.cbFlagLikv.checkbox('uncheck');
        }

    }

    /**
     * Анализируем comboBox "Ликвидирован"
     */
    cbFlagLikv_onChange() {
        if (this.cbFlagSuspended.checkbox("options").checked == false && this.cbFlagLikv.checkbox("options").checked == false) {
            this.lTextDate.html("Дата приостановления с ");
            this.cbFlagLikv.checkbox('check');
        } else if (this.cbFlagLikv.checkbox("options").checked == true) {
            this.lTextDate.html("Дата ликвидации с ");
            this.cbFlagSuspended.checkbox('uncheck');
        }

    }


    /**
     * Настройка поля "Cтоимость"
     */
    customizationAmount() {
        this.txFromStrtAmount.numberbox({
            precision: 2,
            value: 0.00,
            decimalSeparator: '.',
            groupSeparator: ' '
        });

        this.txBeforeStrtAmount.numberbox({
            precision: 2,
            value: 0.00,
            decimalSeparator: '.',
            groupSeparator: ' '
        });

    }

    /**
     * Функция загрузки списка счетов
     * @constructor
     */
    LoadAccsList() {
        return $.ajax({
            method: "get",
            url: this.GetUrl('/Objs/GetAccsList'),
            success: function (data) {
                this.cbAccs.combobox({
                    valueField: 'id',
                    textField: 'name',
                    data: data
                });
                if (this.AccsId != -1) {
                    for (let iAccs = 0; iAccs < data.length; iAccs++) {
                        let accs = data[iAccs];
                        if (accs.id == this.AccsId) {
                            this.cbAccs.combobox("setValue", this.AccsId);
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
     * Функция загрузки списка групп инвентарного учета
     * @constructor
     */
    LoadInvGrpsList() {
        return $.ajax({
            method: "get",
            url: this.GetUrl('/Objs/GetInvGrpsList'),
            success: function (data) {
                this.cbInvGrps.combobox({
                    valueField: 'id',
                    textField: 'name',
                    data: data
                });
                if (this.InvGrpsId != -1) {
                    for (let iInvGrps = 0; iInvGrps < data.length; iInvGrps++) {
                        let invGrps = data[iInvGrps];
                        if (invGrps.id == this.InvGrpsId) {
                            this.cbInvGrps.combobox("setValue", this.InvGrpsId);
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
     * Функция загрузки списка "едениц измерения"
     * @constructor
     */
    LoadUnitsList() {
        return $.ajax({
            method: "get",
            url: this.GetUrl('/Objs/GetUnitsList'),
            success: function (data) {
                this.cbUnits.combobox({
                    valueField: 'id',
                    textField: 'name',
                    data: data
                });
                if (this.UnitsId != -1) {
                    for (let iUnits = 0; iUnits < data.length; iUnits++) {
                        let units = data[iUnits];
                        if (units.id == this.UnitsId) {
                            this.cbUnits.combobox("setValue", this.UnitsId);
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
     * Функция загрузки списка "КЭКР"
     * @constructor
     */
    LoadKekrList() {
        return $.ajax({
            method: "get",
            url: this.GetUrl('/Objs/GetKekrList'),
            success: function (data) {
                this.cbKekr.combobox({
                    valueField: 'id',
                    textField: 'name',
                    data: data
                });
                if (this.KekrId != -1) {
                    for (let iKekr = 0; iKekr < data.length; iKekr++) {
                        let kekr = data[iKekr];
                        if (kekr.id == this.KekrId) {
                            this.cbKekr.combobox("setValue", this.KekrId);
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
     * Функция загрузки списка "тип фонда"
     * @constructor
     */
    LoadTypeFondsList() {
        return $.ajax({
            method: "get",
            url: this.GetUrl('/Objs/GetTypeFondsList'),
            success: function (data) {
                this.cbTypeFonds.combobox({
                    valueField: 'id',
                    textField: 'name',
                    data: data
                });
                if (this.TypeFondsId != -1) {
                    for (let iTypefonds = 0; iTypefonds < data.length; iTypefonds++) {
                        let typeFonds = data[iTypefonds];
                        if (typeFonds.id == this.TypeFondsId) {
                            this.cbTypeFonds.combobox("setValue", this.TypeFondsId);
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
     * Функция загрузки списка счетов
     * @constructor
     */
    LoadWearMthdsList() {
        return $.ajax({
            method: "get",
            url: this.GetUrl('/Objs/ListWearMthds'),
            success: function (data) {
                for (let i = 0; i < data.length; i++) {
                    data[i].name = data[i].name.substring(0, data[i].name.length - 1).replace(',', '.');
                }
                this.cbWearMthds.combobox({
                    valueField: 'id',
                    textField: 'name',
                    data: data
                });
                if (this.WearMthdsId != -1) {
                    for (let iAWearMthds = 0; iAWearMthds < data.length; iAWearMthds++) {
                        let wearMthds = data[iAWearMthds];
                        if (wearMthds.id == this.WearMthdsId) {
                            this.cbWearMthds.combobox("setValue", this.WearMthdsId);
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
     * Добавление в textBox кнопок для очистки или добавления данных
     * @constructor
     */
    AddBtnTextBox() {
        // Поле выбора "Счет объекта"
        this.cbAccs.combobox({
            icons: [
                {
                    iconCls: 'icon-clear',
                    handler: function (e) {
                        $(e.data.target).combobox('setValue', '');
                    }
                }]
        });

        // Поле выбора "Группа инвентарного учета"
        this.cbInvGrps.combobox({
            icons: [
                {
                    iconCls: 'icon-clear',
                    handler: function (e) {
                        $(e.data.target).combobox('setValue', '');
                    }
                }]
        });

        // Поле ввода "Инвентарный номер" объекта
        this.txInvNo.textbox({
            icons: [
                {
                    iconCls: 'icon-clear',
                    handler: function (e) {
                        $(e.data.target).textbox('setValue', '');
                    }
                }]
        });

        // Поле ввода "Инвентарный номер серия" объекта
        this.txInvSer.textbox({
            icons: [
                {
                    iconCls: 'icon-clear',
                    handler: function (e) {
                        $(e.data.target).textbox('setValue', '');
                    }
                }]
        });

        // Поле ввода "Тип" объекта
        this.txObjType.textbox({
            icons: [
                {
                    iconCls: 'icon-clear',
                    handler: function (e) {
                        $(e.data.target).textbox('setValue', '');
                    }
                }]
        });

        // Поле ввода "Наименование" объекта
        this.txName.textbox({
            icons: [
                {
                    iconCls: 'icon-clear',
                    handler: function (e) {
                        $(e.data.target).textbox('setValue', '');
                    }
                }]
        });

        // Поле ввода "Стоимость от" объекта
        this.txFromStrtAmount.textbox({
            icons: [
                {
                    iconCls: 'icon-clear',
                    handler: function (e) {
                        $(e.data.target).textbox('setValue', '');
                    }
                }]
        });

        // Поле ввода "Стоимость до" объекта
        this.txBeforeStrtAmount.textbox({
            icons: [
                {
                    iconCls: 'icon-clear',
                    handler: function (e) {
                        $(e.data.target).textbox('setValue', '');
                    }
                }]
        });

        // Поле выбора "Тип фонда"
        this.cbTypeFonds.combobox({
            icons: [
                {
                    iconCls: 'icon-clear',
                    handler: function (e) {
                        $(e.data.target).combobox('setValue', '');
                    }
                }]
        });

        // Поле выбора "КЭКР"
        this.cbKekr.combobox({
            icons: [
                {
                    iconCls: 'icon-clear',
                    handler: function (e) {
                        $(e.data.target).combobox('setValue', '');
                    }
                }]
        });

        // Поле выбора "Единица измерения"
        this.cbUnits.combobox({
            icons: [
                {
                    iconCls: 'icon-clear',
                    handler: function (e) {
                        $(e.data.target).combobox('setValue', '');
                    }
                }]
        });

        // Поле ввода "Дата приобритения с" объекта
        this.dtDateBuyIn.datebox({
            icons: [{
                iconCls: 'icon-clear',
                handler: function (e) {
                    $(e.data.target).datebox('setValue', '');
                }
            }]
        });

        // Поле ввода "Дата приобритения по" объекта
        this.dtDateBuyBy.datebox({
            icons: [{
                iconCls: 'icon-clear',
                handler: function (e) {
                    $(e.data.target).datebox('setValue', '');
                }
            }]
        });

        // Поле ввода "Дата ввода в эксплуатацию с " объекта
        this.dtDateExpIn.datebox({
            icons: [{
                iconCls: 'icon-clear',
                handler: function (e) {
                    $(e.data.target).datebox('setValue', '');
                }
            }]
        });

        // Поле ввода "Дата ввода в эксплуатацию по" объекта
        this.dtDateExpBy.datebox({
            icons: [{
                iconCls: 'icon-clear',
                handler: function (e) {
                    $(e.data.target).datebox('setValue', '');
                }
            }]
        });

        // Поле ввода "Дата ликвидации с" объекта
        this.dtDateLikvIn.datebox({
            icons: [{
                iconCls: 'icon-clear',
                handler: function (e) {
                    $(e.data.target).datebox('setValue', '');
                }
            }]
        });

        // Поле ввода "Дата ликвидации по" объекта
        this.dtDateLikvBy.datebox({
            icons: [{
                iconCls: 'icon-clear',
                handler: function (e) {
                    $(e.data.target).datebox('setValue', '');
                }
            }]
        });

        // Поле ввода "Территория" объекта
        this.txKterName.textbox({
            icons: [
                {
                    iconCls: 'icon-clear',
                    handler: function (e) {
                        $(e.data.target).textbox('setValue', '');
                    }
                }]
        });

        // Поле выбора "Начисление износа"
        this.cbWearMthds.combobox({
            icons: [
                {
                    iconCls: 'icon-clear',
                    handler: function (e) {
                        $(e.data.target).combobox('setValue', '');
                    }
                }]
        });

        // Поле выбора "Дополнительные реквизиты"
        this.cbNameLP.combobox({
            icons: [
                {
                    iconCls: 'icon-clear',
                    handler: function (e) {
                        $(e.data.target).combobox('setValue', '');
                        this.cbNameLP.combobox("setValue", "");
                        this.pbAddDelLP.css("visibility", "hidden");
                        this.txValueLP.textbox("setText", "");
                        this.NameLP = "";
                    }.bind(this)
                }]
        });

        // Поле ввода "Значение дополнительных реквизитов" объекта
        this.txValueLP.textbox({
            icons: [
                {
                    iconCls: 'icon-clear',
                    handler: function (e) {
                        $(e.data.target).textbox('setValue', '');
                    }
                }]
        });

        // Поле выбора "Периодические реквизиты реквизиты"
        this.cbNamePP.combobox({
            icons: [
                {
                    iconCls: 'icon-clear',
                    handler: function (e) {
                        $(e.data.target).combobox('setValue', '');
                        this.cbNamePP.combobox("setValue", "");
                        this.pbAddDelPP.css("visibility", "hidden");
                        this.txValuePP.textbox("setText", "");
                        this.NamePP = "";
                    }.bind(this)
                }]
        });

        // Поле ввода "Значение периодических реквизитов" объекта
        this.txValuePP.textbox({
            icons: [
                {
                    iconCls: 'icon-clear',
                    handler: function (e) {
                        $(e.data.target).textbox('setValue', '');
                    }
                }]
        });

    }

    /**
     * Загрузка данных из БД(реестр)
     * @constructor
     */
    LoadObjFilter() {
        this.filter.LoadFilter(function () {
            this.AccsId = this.filter.GetValue("AccsId", -1);
            this.InvGrpsId = this.filter.GetValue("InvGrpsId", -1);
            this.txInvNo.textbox("setText", this.filter.GetValue("InvNo", ""));
            this.txInvSer.textbox("setText", this.filter.GetValue("InvSer", ""));
            let objTypeId = this.filter.GetValue("ObjTypeId", "");
            let objTypeName = this.filter.GetValue("ObjTypeName", "");
            if (objTypeId.length != 0 && objTypeName.length != 0) {
                this.txObjType.textbox("setText", objTypeId + " = " + objTypeName);
            }
            this.txName.textbox("setText", this.filter.GetValue("Name", ""));
            this.txFromStrtAmount.textbox("setText", this.filter.GetValue("FromStrtAmount", ""));
            this.txBeforeStrtAmount.textbox("setText", this.filter.GetValue("BeforeStrtAmount", ""));
            this.TypeFondsId = this.filter.GetValue("FondTypesId", -1);
            this.KekrId = this.filter.GetValue("KekrId", -1);
            this.UnitsId = this.filter.GetValue("UnitsId", -1);
            this.dtDateBuyIn.datebox("setValue", this.filter.GetValue("DateBuyIn", ""));
            this.dtDateBuyBy.datebox("setValue", this.filter.GetValue("DateBuyBy", ""));
            this.dtDateExpIn.datebox("setValue", this.filter.GetValue("DateExpIn", ""));
            this.dtDateExpBy.datebox("setValue", this.filter.GetValue("DateExpBy", ""));
            this.dtDateLikvIn.datebox("setValue", this.filter.GetValue("DateLikvIn", ""));
            this.dtDateLikvBy.datebox("setValue", this.filter.GetValue("DateLikvBy", ""));

            let kterId = this.filter.GetValue("KterId", "");
            let kterName = this.filter.GetValue("KterName", "");
            if (kterId.length != 0 && kterName.length != 0) {
                this.txKterName.textbox("setText", kterId + " = " + kterName);
            }


            let flagSuspended = this.filter.GetValue("FlagSuspended", "");
            let flagLikv = this.filter.GetValue("FlagLikv", "");
            if (flagSuspended.length > 0) {
                this.cbFlagSuspended.checkbox('check');
                this.lTextDate.html("Дата приостановления с ");
            }
            if (flagLikv.length > 0) {
                this.cbFlagLikv.checkbox('check');
                this.lTextDate.html("Дата ликвидации с ");
            }


            this.WearMthdsId = this.filter.GetValue("WearMthdsId", -1);
        }.bind(this));
    }


    /**
     * Обработка события нажатия кнопки OK
     */
    btnOk_onClick() {
        //Собираем все данные с формы
        if (this.cbAccs.combobox("getValue").length == 0) {
            this.AccsId = -1;
        }
        if (this.cbInvGrps.combobox("getValue").length == 0) {
            this.InvGrpsId = -1;
        }
        if (this.cbTypeFonds.combobox("getValue").length == 0) {
            this.TypeFondsId = -1;
        }
        if (this.cbKekr.combobox("getValue").length == 0) {
            this.KekrId = -1;
        }
        if (this.cbUnits.combobox("getValue").length == 0) {
            this.UnitsId = -1;
        }
        if (this.cbWearMthds.combobox("getValue").length == 0) {
            this.WearMthdsId = -1;
        }
        let cbFlagSuspended = this.cbFlagSuspended.checkbox("options").checked ? "true" : "false";
        let cbFlagLikv = this.cbFlagLikv.checkbox("options").checked ? "true" : "false";

        let accs = this.AccsId;
        let invGrps = this.InvGrpsId;
        let invno = this.txInvNo.textbox("getText");
        let invser = this.txInvSer.textbox("getText");
        let objtype = this.txObjType.textbox("getText");
        let name = this.txName.textbox("getText");
        let fromstrtamount = this.txFromStrtAmount.textbox("getText");
        if (fromstrtamount.length > 0) {
            fromstrtamount = fromstrtamount.split(' ').join('');
            fromstrtamount = fromstrtamount.replace('.', ',');
        }
        let beforestrtamount = this.txBeforeStrtAmount.textbox("getText");
        if (beforestrtamount.length > 0) {
            beforestrtamount = beforestrtamount.split(' ').join('');
            beforestrtamount = beforestrtamount.replace('.', ',');
        }
        let fondTypes = this.TypeFondsId;
        let kekr = this.KekrId;
        let units = this.UnitsId;
        let datebuyin = this.dtDateBuyIn.datebox("getValue");
        let datebuyby = this.dtDateBuyBy.datebox("getValue");
        let dateexpin = this.dtDateExpIn.datebox("getValue");
        let dateexpby = this.dtDateExpBy.datebox("getValue");
        let datelikvin = this.dtDateLikvIn.datebox("getValue");
        let datelikvby = this.dtDateLikvBy.datebox("getValue");
        let kter = this.txKterName.textbox("getText");
        let wearMthds = this.WearMthdsId;
        let valuelp = this.txValueLP.textbox("getText");
        let valuepp = this.txValuePP.textbox("getText");

        // Если справочная информация, то получаем отдельно  id и name "тип объекта"
        let objtypeid = "";
        let objtypename = "";
        if (objtype.length > 0) {
            let objTypeSplit = this.txObjType.textbox("getText").split(' = ');
            objtypeid = objTypeSplit[0];
            objtypename = objTypeSplit[1];
        }

        // Если справочная информация, то получаем отдельно  id и name "территория"
        let kterid = "";
        let ktername = "";
        if(kter.length > 0){
            let ketrSplit = this.txKterName.textbox("getText").split(' = ');
            kterid = ketrSplit[0];
            ktername = ketrSplit[1];
        }


        // Если справочная информация, то получаем отдельно  id и name "дополнительные реквизиты"
        let valuelpid = "";
        let valuelpname = "";
        if (valuelp.length > 0) {
            let indexValLP = valuelp.indexOf(' = ');
            if (indexValLP != -1) {
                let valueLPSplit = valuelp.split(' = ');
                valuelpid = valueLPSplit[0];
                valuelpname = valueLPSplit[1];
            }
        }
        // Если справочная информация, то получаем отдельно  id и name "периодические реквизиты"
        let valueppid = "";
        let valueppname = "";
        if (valuepp.length > 0) {
            let indexValPP = valuepp.indexOf(' = ');
            if (indexValPP != -1) {
                let valuePPSplit = valuepp.split(' = ');
                valueppid = valuePPSplit[0];
                valueppname = valuePPSplit[1];
            }
        }

        this.filter = new LibFilter("objs");

        this.filterModel =
            {
                accsid: accs,
                invGrpsid: invGrps,
                invno: invno,
                invser: invser,
                objtypeid: objtypeid,
                objtypename: objtypename,
                name: name,
                fromstrtamount: fromstrtamount,
                beforestrtamount: beforestrtamount,
                fondTypesid: fondTypes,
                kekrid: kekr,
                unitsid: units,
                datebuyin: datebuyin,
                datebuyby: datebuyby,
                dateexpin: dateexpin,
                dateexpby: dateexpby,
                datelikvin: datelikvin,
                datelikvby: datelikvby,
                kterid: kterid,
                ktername: ktername,
                flagSuspended: cbFlagSuspended,
                flagLikv: cbFlagLikv,
                wearMthdsid: wearMthds,
                paramlp: this.NameLP,
                valuelp: valuelp,
                parampp: this.NamePP,
                valuepp: valuepp,
                idpp: this.IdPP
            };

        if (accs != -1) {
            this.filter.SetValue("AccsId", accs);
        } else {
            this.setDelFilter.push("AccsId");
        }
        if (invGrps != -1) {
            this.filter.SetValue("InvGrpsId", invGrps);
        } else {
            this.setDelFilter.push("InvGrpsId");
        }
        if (invno.length > 0) {
            this.filter.SetValue("InvNo", invno);
        } else {
            this.setDelFilter.push("InvNo");
        }
        if (invser.length > 0) {
            this.filter.SetValue("InvSer", invser);
        } else {
            this.setDelFilter.push("InvSer");
        }
        if (objtypename.length > 0 && objtypeid.length > 0) {
            this.filter.SetValue("ObjTypeId", objtypeid);
            this.filter.SetValue("ObjTypeName", objtypename);
        } else {
            this.setDelFilter.push("ObjTypeId");
            this.setDelFilter.push("ObjTypeName");
        }
        if (name.length > 0) {
            this.filter.SetValue("Name", name);
        } else {
            this.setDelFilter.push("Name");
        }
        if (fromstrtamount.length > 0) {
            this.filter.SetValue("FromStrtAmount", fromstrtamount);
        } else {
            this.setDelFilter.push("FromStrtAmount");
        }
        if (beforestrtamount.length > 0) {
            this.filter.SetValue("BeforeStrtAmount", beforestrtamount);
        } else {
            this.setDelFilter.push("BeforeStrtAmount");
        }
        if (fondTypes != -1) {
            this.filter.SetValue("FondTypesId", fondTypes);
        } else {
            this.setDelFilter.push("FondTypesId");
        }
        if (kekr != -1) {
            this.filter.SetValue("KekrId", kekr);
        } else {
            this.setDelFilter.push("KekrId");
        }
        if (units != -1) {
            this.filter.SetValue("UnitsId", units);
        } else {
            this.setDelFilter.push("UnitsId");
        }
        if (datebuyin.length > 0) {
            this.filter.SetValue("DateBuyIn", datebuyin);
        } else {
            this.setDelFilter.push("DateBuyIn");
        }
        if (datebuyby.length > 0) {
            this.filter.SetValue("DateBuyBy", datebuyby);
        } else {
            this.setDelFilter.push("DateBuyBy");
        }
        if (dateexpin.length > 0) {
            this.filter.SetValue("DateExpIn", dateexpin);
        } else {
            this.setDelFilter.push("DateExpIn");
        }
        if (dateexpby.length > 0) {
            this.filter.SetValue("DateExpBy", dateexpby);
        } else {
            this.setDelFilter.push("DateExpBy");
        }
        if (datelikvin.length > 0) {
            this.filter.SetValue("DateLikvIn", datelikvin);
        } else {
            this.setDelFilter.push("DateLikvIn");
        }
        if (datelikvby.length > 0) {
            this.filter.SetValue("DateLikvBy", datelikvby);
        } else {
            this.setDelFilter.push("DateLikvBy");
        }
        if (cbFlagSuspended == "true") {
            this.filter.SetValue("FlagSuspended", cbFlagSuspended);
        } else {
            this.setDelFilter.push("FlagSuspended");
        }
        if (cbFlagLikv == "true") {
            this.filter.SetValue("FlagLikv", cbFlagLikv);
        } else {
            this.setDelFilter.push("FlagLikv");
        }

        if (ktername.length > 0 && kterid.length > 0) {
            this.filter.SetValue("KterId", kterid);
            this.filter.SetValue("KterName", ktername);
        } else {
            this.setDelFilter.push("KterId");
            this.setDelFilter.push("KterName");
        }

        if (wearMthds != -1) {
            this.filter.SetValue("WearMthdsId", wearMthds);
        } else {
            this.setDelFilter.push("WearMthdsId");
        }
        if (this.NameLP.length > 0) {
            this.filter.SetValue("NameLP", this.NameLP);
        } else {
            this.setDelFilter.push("NameLP");
        }
        if (valuelp.length > 0) {
            if (valuelpid.length > 0 && valuelpname.length > 0) {
                this.filter.SetValue("ValueLPId", valuelpid);
                this.filter.SetValue("ValueLPName", valuelpname);
                this.setDelFilter.push("ValLP");
            } else {
                this.filter.SetValue("ValLP", valuelp);
                this.setDelFilter.push("ValueLPId");
                this.setDelFilter.push("ValueLPName");
            }
        }
        if (valuelp.length == 0) {
            this.setDelFilter.push("ValLP");
            this.setDelFilter.push("ValueLPId");
            this.setDelFilter.push("ValueLPName");
        }
        if (this.NamePP.length != 0) {
            this.filter.SetValue("NamePP", this.NamePP);
            this.filter.SetValue("IdPP", this.IdPP);
        } else {
            this.setDelFilter.push("NamePP");
            this.setDelFilter.push("IdPP");
        }
        if (valuepp.length > 0) {
            if (valueppid.length > 0 && valueppname.length > 0) {
                this.filter.SetValue("ValuePPId", valueppid);
                this.filter.SetValue("ValuePPName", valueppname);
                this.setDelFilter.push("ValPP");
            } else {
                this.filter.SetValue("ValPP", valuepp);
                this.setDelFilter.push("ValuePPId");
                this.setDelFilter.push("ValuePPName");
            }
        }
        if (valuepp.length == 0) {
            this.setDelFilter.push("ValPP");
            this.setDelFilter.push("ValuePPId");
            this.setDelFilter.push("ValuePPName");
        }

        this.filter.DeleteParamsInFilter(this.setDelFilter, function () {
            this.filter.SaveFilter(function () {
                this.ResultFunc(this.filterModel);
                this.wObjsFormFilter.window("close");
            }.bind(this));
        }.bind(this));
    }

    /**
     * Выбор "типа объекта"
     */
    btnAddType_onClick() {
        try {
            StartModalModulGlobal("ObjTypes",
                "",
                ((data) => {
                    this.universalData(this.txObjType, 'ObjTypes', data.id);
                }).bind(this));

        } catch (e) {
            this.ShowError(e);
        }
    }

    /**
     * Выбор территории
     */
    btnAddKter_onClick() {
        try {
            StartModalModulGlobal("Kter",
                "",
                ((data) => {
                    this.universalData(this.txKterName, 'Kter', data.id);
                }).bind(this));

        } catch (e) {
            this.ShowError(e);
        }
    }

    /**
     * Функция загрузки списка дополнительных реквизитов
     * @constructor
     */
    LoadListParamsList() {
        $.ajax({
            method: "get",
            url: this.GetUrl('/Objs/listListParams'),
            success: function (data) {
                this.cbNameLP.combobox({
                    valueField: 'name',
                    textField: 'name',
                    data: data
                });
                if (this.NameLP != "") {
                    let finded = false;
                    for (let i = 0; i < data.length; i++) {
                        let tc = data[i].name;
                        if (tc == this.NameLP) {
                            this.cbNameLP.combobox("setValue", this.NameLP);
                            finded = true;
                        }
                    }
                    if (finded == false) {
                        this.NameLP = "";
                    }
                }
                this.cbNameLP.combobox("setValues", this.filter.GetValue("NameLP", ""));
                let valLP = this.filter.GetValue("ValLP", "");
                let valueLPId = this.filter.GetValue("ValueLPId", "");
                let valueLPName = this.filter.GetValue("ValueLPName", "");
                if (valLP.length != 0) {
                    this.txValueLP.textbox("setText", valLP);
                }
                if (valueLPId.length != 0 && valueLPName.length != 0) {
                    this.txValueLP.textbox("setText", valueLPId + " = " + valueLPName);
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Функция загрузки списка дополнительных реквизитов
     * @constructor
     */
    LoadPeriodParamsList() {
        $.ajax({
            method: "get",
            url: this.GetUrl('/Objs/listPeriodParams'),
            success: function (data) {
                this.cbNamePP.combobox({
                    valueField: 'name',
                    textField: 'name',
                    data: data
                });
                if (this.NamePP != "") {
                    let finded = false;
                    for (let i = 0; i < data.length; i++) {
                        let tc = data[i].name;
                        if (tc == this.NamePP) {
                            this.cbNamePP.combobox("setValue", this.NamePP);
                            finded = true;
                        }
                    }
                    if (finded == false) {
                        this.NamePP = "";
                    }
                }
                this.cbNamePP.combobox("setValues", this.filter.GetValue("NamePP", ""));
                let valPP = this.filter.GetValue("ValPP", "");
                let valuePPId = this.filter.GetValue("ValuePPId", "");
                let valuePPName = this.filter.GetValue("ValuePPName", "");
                if (valPP.length != 0) {
                    this.txValuePP.textbox("setText", valPP);
                }
                if (valuePPId.length != 0 && valuePPName.length != 0) {
                    this.txValuePP.textbox("setText", valuePPId + " = " + valuePPName);
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Обработка выбранного списка дополнительного реквизита
     * @param record - объект с выбранным дополнительным реквизитом
     */
    cbNameLP_onSelect(record) {
        if (this.NameLP != record.lparamname) {
            this.txValueLP.textbox("setText", "");
        }
        this.NameLP = record.name;
        if (record.reffertable.length != 0) {
            this.FuncLP = record.refferfunc;
            this.TableLP = record.reffertable;
            this.pbAddDelLP.css("visibility", "visible");
            this.txValueLP.textbox({editable: false});
        } else {
            this.pbAddDelLP.css("visibility", "hidden");
            this.txValueLP.textbox({editable: true});
        }
    }

    /**
     * Обработка выбранного списка переодических реквизита
     * @param record - объект с выбранным переодическим реквизитом
     */
    cbNamePP_onSelect(record) {
        if (this.NamePP != record.pparamname) {
            this.txValuePP.textbox("setText", "");
        }
        this.NamePP = record.name;
        this.IdPP = record.id;
        if (record.reffertable.length != 0) {
            this.FuncPP = record.refferfunc;
            this.TablePP = record.reffertable;
            this.pbAddDelPP.css("visibility", "visible");
            this.txValuePP.textbox({editable: false});
        } else {
            this.pbAddDelPP.css("visibility", "hidden");
            this.txValuePP.textbox({editable: true});
        }
    }

    /**
     * Очитска всего фильтра сразу
     */
    btnClear_onClick() {
        this.cbAccs.combobox("setText", "");
        this.AccsId = -1;
        this.cbInvGrps.combobox("setText", "");
        this.InvGrpsId = -1;
        this.txInvNo.textbox("setText", "");
        this.txInvSer.textbox("setText", "");
        this.txObjType.textbox("setText", "");
        this.txName.textbox("setText", "");
        this.txFromStrtAmount.textbox("setText", "");
        this.txBeforeStrtAmount.textbox("setText", "");
        this.cbTypeFonds.combobox("setText", "");
        this.TypeFondsId = -1;
        this.cbKekr.combobox("setText", "");
        this.KekrId = -1;
        this.cbUnits.combobox("setText", "");
        this.UnitsId = -1;
        this.txKterName.textbox("setText", "");
        this.dtDateBuyIn.datebox("setValue", "");
        this.dtDateBuyBy.datebox("setValue", "");
        this.dtDateExpIn.datebox("setValue", "");
        this.dtDateExpBy.datebox("setValue", "");
        this.dtDateLikvIn.datebox("setValue", "");
        this.dtDateLikvBy.datebox("setValue", "");
        this.cbWearMthds.combobox("setText", "");
        this.WearMthdsId = -1;
        this.cbNameLP.combobox("setValue", "");
        this.pbAddDelLP.css("visibility", "hidden");
        this.txValueLP.textbox("setText", "");
        this.cbNamePP.combobox("setValue", "");
        this.pbAddDelPP.css("visibility", "hidden");
        this.txValuePP.textbox("setText", "");
        this.NameLP = "";
        this.NamePP = "";
    }

    /**
     * Выбор дополнительного реквизита (если реквизит - справочная инфомрация)
     */
    btnAddValueLP_onClick() {
        try {
            StartModalModulGlobal(this.FuncLP,
                "",
                ((data) => {
                    this.universalData(this.txValueLP, this.TableLP, data.id);
                }).bind(this));

        } catch (e) {
            this.ShowError(e);
        }
    }

    /**
     * Выбор переодического реквизита (если реквизит - справочная инфомрация)
     */
    btnAddValuePP_onClick() {
        try {
            StartModalModulGlobal(this.FuncPP,
                "",
                ((data) => {
                    this.universalData(this.txValuePP, this.TablePP, data.id);
                }).bind(this));

        } catch (e) {
            this.ShowError(e);
        }
    }

    /**
     * Функция загрузки строки в формате id = name (универсальный)
     * @param textBox - получает textBox в который будет вставляться результат
     * @param table - получает имя таблицы
     * @param id - получает идентификатор в таблице которая была вызвана
     */
    universalData(textBox, table, id) {
        $.ajax({
            method: "get",
            url: this.GetUrl('/Objs/universalDataAcquisition?table=' + table + "&id=" + id),
            success: function (data) {
                textBox.textbox("setText", data);
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
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
     * Обработка выбранного значения "справочник счетов"
     * @param record объект с выбранным счетом
     */
    cbAccs_onSelect(record) {
        this.AccsId = record.id;
    }

    /**
     * Обработка выбранного значения "справочник групп инвентарного учета"
     * @param record объект с выбранной группой  инвентарного учета
     */
    cbInvGrps_onSelect(record) {
        this.InvGrpsId = record.id;
    }

    /**
     * Обработка выбранного значения "справочник единиц измерения"
     * @param record объект с выбранной единицой измерения
     */
    cbUnits_onSelect(record) {
        this.UnitsId = record.id;
    }

    /**
     * Обработка выбранного значения "справочник КЭКР"
     * @param record объект с выбранным КЭКР
     */
    cbKekr_onSelect(record) {
        this.KekrId = record.id;
    }

    /**
     * Обработка выбранного значения "справочник типов фондов"
     * @param record объект с выбранным типом фонда
     */
    cbTypeFonds_onSelect(record) {
        this.TypeFondsId = record.id;
    }

    /**
     * Обработка выбранного значения "справочник типов фондов"
     * @param record объект с выбранным типом фонда
     */
    cbWearMthds_onSelect(record) {
        this.WearMthdsId = record.id;
    }
}