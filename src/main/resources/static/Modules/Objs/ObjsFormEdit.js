import {FormView} from "../Core/FormView.js";
import {ObjsFormExplList} from "./ObjsFormExplList.js";

export class ObjsFormEdit extends FormView {

    constructor(DateObjs) {
        super();
        this.prefix = "";
        this.ListParamsId = -1;
        this.ListParamsIndex = 0;

        this.DateObjs = DateObjs;

        this.PeriodParamsId = -1;
        this.PeriodParamsIndex = 0;

        this.editIndex = -1;

        this.AccsId = -1;
        this.InvGrpsId = -1;
        this.UnitsId = -1;
        this.KekrId = -1;
        this.TypeFondsId = -1;
        this.explModelList = {};

        this.DateBase = "";

        this.imgObjs = 0;
        this.GenUUID = "";
        this.tableID = "";
        this.currentIndexLP = -1;
        this.currentIndexPP = -1;

        this.RightListParams = 0;
        this.RightPeriodParams = 0;
    }

    /**
     * Показать форму добавления/изменения записи
     * @param options
     * @constructor
     */
    Show(options) {
        this.options = options;
        LoadForm("#ModalWindows", this.GetUrl("/Objs/ObjsFormEdit"), this.InitFunc.bind(this));
    }

    /**
     * Инциализация интерфейса пользователя
     * @constructor
     */
    InitFunc() {
        this.InitComponents("wObjsFormEdit_Module_Objs", "");
        this.InitCloseEvents(this.wObjsFormEdit);

        AddKeyboardNavigationForGrid(this.dgListParams);
        AddKeyboardNavigationForGrid(this.dgPeriodParams);

        //Кнопки управления формой
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({
            onClick: () => {
                this.wObjsFormEdit.window("close");
            }
        });
        this.wObjsFormEdit[0].tag = this;
        this.wObjsFormEdit.window({onBeforeClose: this.wObjsFormEdit_onBeforeClose});


        // Настройка формы
        $.when(this.banOnFields(), this.RightsUsersKT(), this.RightsUsersBuh(), this.customizationGridLP(), this.customizationGridPP(), this.LoadAccsList(),
            this.LoadInvGrpsList(), this.LoadUnitsList(), this.LoadKekrList(), this.LoadTypeFondsList(),
            this.generationGUID()).then(() => {
            if (this.DateObjs.length > 0) {
                this.IDate.html('<i>за дату: ' + this.DateObjs + '</i>');
            } else {
                let now = new Date();
                let formated_date = ('0' + now.getDate()).slice(-2) + '.' + ('0' + (now.getMonth() + 1)).slice(-2) + '.' + now.getFullYear();
                this.IDate.html('<i>за дату: ' + formated_date + '</i>');
            }
            this.customizationStrtAmount();
            this.dateFormat(this.dtDateBuy);
            if (this.options.AddMode) {
                this.pbEditMode.attr("class", "icon-addmode");
                this.wObjsFormEdit.window({title: "Добавление новой записи"});
                this.lAction.html("Введите данные для новой записи");
                this.txId.textbox("setText", '-1');
            } else {
                this.pbEditMode.attr("class", "icon-editmode");
                this.wObjsFormEdit.window({title: "Редатирование записи"});
                this.lAction.html("Введите данные для редактирования текущей записи");
                if (this.options.editMode) {
                    this.btnOk.linkbutton({disabled: false});
                } else {
                    this.btnOk.linkbutton({disabled: true});
                }
                this.LoadObjs();
            }
        });
        $.when(this.tableId("objs")).then(function (result) {
            this.tableID = result;
        }.bind(this));


        // Добавление картинки на объект
        this.btnImgObjs.linkbutton({onClick: this.btnImgObjs_onClick.bind(this)});

        // Кнопки добавления данных из справочников
        this.btnAddObjsType.linkbutton({onClick: this.btnAddObjsType_onClick.bind(this)});

        //Сроки эксплуатации
        this.btnObjsExpl.linkbutton({onClick: this.btnObjsExpl_onClick.bind(this)});

        //Выбор данных в comboBox
        this.cbAccs.combobox({onSelect: this.cbAccs_onSelect.bind(this)});
        this.cbInvGrps.combobox({onSelect: this.cbInvGrps_onSelect.bind(this)});
        this.cbUnits.combobox({onSelect: this.cbUnits_onSelect.bind(this)});
        this.cbKekr.combobox({onSelect: this.cbKekr_onSelect.bind(this)});
        this.cbTypeFonds.combobox({onSelect: this.cbTypeFonds_onSelect.bind(this)});

       // this.cbCheckSer.checkbox({onChange: this.cbCheckSer_onChange.bind(this)});
    }

    banOnFields() {
        this.btnAddObjsType.linkbutton({disabled: true}); // тип объекта
        this.txName.textbox({disabled: true}); // наименование
        this.btnImgObjs.linkbutton({disabled: true}); // добавление изображения
        this.txDescr.textbox({disabled: true}); // описание
        this.cbTypeFonds.combobox({disabled: true}); // тип фонда
        this.cbKekr.combobox({disabled: true}); // КЭКР
        this.txStrtAmount.numberbox({disabled: true}); // первоначальная стоимость
        this.dtDateBuy.datebox({disabled: true}); // дата приобретения
        this.btnObjsExpl.linkbutton({disabled: true}); // ввод/вывод
        this.cbUnits.combobox({disabled: true}); // единица измерения
        this.txInfo.textbox({disabled: true}); // примечание
     //   this.cbCheckSer.checkbox({disabled: true}); // указатель серии
        this.txCountObjs.textbox({disabled: true}); // количество сохраняемых объектов
    }


    /**
     * Проверяем права пользователя и открываем поля в соответствии с правами (для  КТ)
     * @constructor
     */
    RightsUsersKT() {
        if (this.options.id == undefined) {
            $.ajax({
                method: "GET",
                url: this.GetUrl("/Objs/RightsUsersKT"),
                data: {sesId: this.GenUUID},
                success: function (data) {
                    if (data.length == 0) {
                        this.btnAddObjsType.linkbutton({disabled: false}); // тип объекта
                    }
                }.bind(this),
                error: function (data) {
                    this.ShowErrorResponse(data.responseJSON);
                }.bind(this)
            });

        } else {
            $.ajax({
                method: "GET",
                url: this.GetUrl("/Objs/RightsUsersKTId?objId=" + this.options.id),
                data: {sesId: this.GenUUID},
                success: function (data) {
                    if (data == "All") {
                        this.btnAddObjsType.linkbutton({disabled: false}); // тип объекта
                        this.txName.textbox({disabled: false}); // наименование
                        this.btnImgObjs.linkbutton({disabled: false}); // добавление изображения
                        this.txDescr.textbox({disabled: false}); // описание
                        this.cbTypeFonds.combobox({disabled: false}); // тип фонда
                        this.cbKekr.combobox({disabled: false}); // КЭКР
                        this.txStrtAmount.numberbox({disabled: false}); // первоначальная стоимость
                        this.dtDateBuy.datebox({disabled: false}); // дата приобретения
                        this.btnObjsExpl.linkbutton({disabled: false}); // ввод/вывод
                        this.cbUnits.combobox({disabled: false}); // единица измерения
                        this.txInfo.textbox({disabled: false}); // примечание
                        this.RightListParams = 1;
                        this.RightPeriodParams = 1;
                    } else if (data == "Part") {
                        this.RightListParams = 1;
                    }
                }.bind(this),
                error: function (data) {
                    this.ShowErrorResponse(data.responseJSON);
                }.bind(this)
            });
        }
    }

    RightsUsersBuh() {
        $.ajax({
            method: "GET",
            url: this.GetUrl("/Objs/RightsUsersBuh"),
            data: {sesId: this.GenUUID},
            success: function (data) {
                if (data.length == 0) {
                    this.btnAddObjsType.linkbutton({disabled: false}); // тип объекта
                    this.txName.textbox({disabled: false}); // наименование
                    this.btnImgObjs.linkbutton({disabled: false}); // добавление изображения
                    this.txDescr.textbox({disabled: false}); // описание
                    this.cbTypeFonds.combobox({disabled: false}); // тип фонда
                    this.cbKekr.combobox({disabled: false}); // КЭКР
                    this.txStrtAmount.numberbox({disabled: false}); // первоначальная стоимость
                    this.dtDateBuy.datebox({disabled: false}); // дата приобретения
                    this.btnObjsExpl.linkbutton({disabled: false}); // ввод/вывод
                    this.cbUnits.combobox({disabled: false}); // единица измерения
                    this.txInfo.textbox({disabled: false}); // примечание
                    this.RightListParams = 1;
                    this.RightPeriodParams = 1;
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }


    /**
     * Настройка поля "Первоночальная стоимость"
     */
    customizationStrtAmount() {
        this.txStrtAmount.numberbox({
            precision: 2,
            value: 0.00,
            decimalSeparator: '.',
            groupSeparator: ' '
        });

    }

    /**
     * Удаление данный из periodlock и imglock по sesId
     * @param sesId
     * @constructor
     */
    DeleteLockTable(sesId) {
        $.ajax({
            method: "POST",
            url: this.GetUrl("/Objs/DeleteImgLockAndDeletePeriodLock"),
            data: {sesId: this.GenUUID},
            success: function (data) {
                if (data.length) {
                    this.ShowWarning(data);
                } else {
                    this.wObjsFormEdit.window("close");
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }


    /**
     * Выбор "типа объекта"
     */
    btnAddObjsType_onClick() {
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
     * Работа с картинкой для  объекта
     */
    btnImgObjs_onClick() {

        let id = this.txId.textbox("getText");
        if (id.length == 0) {
            id = -1;
        }
        let params = {};
        params.ObjectId = this.tableID;
        params.RecId = id;
        params.SesId = this.GenUUID;
        params.ListParamId = -1;
        params.PeriodParamId = -1;
        params.period_lock_id = "";

        try {
            StartModalModulGlobal("ImgWork",
                params,
                ((data) => {
                    if (data.id != -1) {
                        this.imgObjs = data.id;
                        $.when().then(function (result) {
                            if (result == 0) {
                                this.btnImgObjs.linkbutton({
                                    iconCls: 'icon-ObjsView'
                                });
                            } else {
                                this.btnImgObjs.linkbutton({
                                    iconCls: 'icon-ObjsView_bw'
                                });
                                this.countImgValuesObjs();
                            }
                        }.bind(this));
                    }
                }).bind(this));

        } catch (e) {
            this.ShowError(e);
        }
    }

    /**
     * Проверяем существует ли картинка на объекте (Objs)
     */
    countImgValuesObjs() {
        let id = this.txId.textbox("getText");
        $.ajax({
            method: "get",
            url: this.GetUrl("/Objs/CountImgValuesObjs?objectid=" + this.tableID + "&recid=" + id + "&sesId=" + this.GenUUID),
            success: function (data) {
                if (data != 1) {
                    this.btnImgObjs.linkbutton({
                        iconCls: 'icon-ObjsView'
                    });
                } else {
                    this.btnImgObjs.linkbutton({
                        iconCls: 'icon-ObjsView_bw'
                    });
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Получаем Id таблицы по наименованию
     * @param tableName
     */
    tableId(tableName) {
        let res = $.ajax({
            method: "get",
            url: this.GetUrl("/Objs/TableId?TableName=" + tableName),
            success: function (data) {
                return data;
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
        return res;
    }

    /**
     * Проверяем была ли удалена картинка
     * @param id
     */
    flagDelImg(id) {
        return $.ajax({
            method: "get",
            url: this.GetUrl("/Objs/flagDelImg?id=" + id),
            success: function (data) {
                return data;
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Генерация GUID
     */
    generationGUID() {
        return $.ajax({
            method: "get",
            url: this.GetUrl('/CoreUtils/GetUUID'),
            success: function (data) {
                if (data !== undefined && data !== "") {
                    this.GenUUID = data;
                } else {
                    this.ShowError("Не удалось получить UUID");
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
     * Настройка грида с дополнительными реквизитами
     * @returns {jQuery|{getAllResponseHeaders: function(): (*|null), abort: function(*=): this, setRequestHeader: function(*=, *): this, readyState: number, getResponseHeader: function(*): (null|*), overrideMimeType: function(*): this, statusCode: function(*=): this}|$|jQuery|HTMLElement|{getAllResponseHeaders: function(): (*|null), abort: function(*=): this, setRequestHeader: function(*=, *): this, readyState: number, getResponseHeader: function(*): (null|*), overrideMimeType: function(*): this, statusCode: function(*=): this}}
     */
    customizationGridLP() {
        return $.ajax({
            method: "get",
            url: this.GetUrl('/Objs/listListParams'),
            success: function (data) {
                if (data == null || data === "" || data.length === 0) return;
                this.dgPeriodData = data;
                let dEditorIndex = this.GetElement("dEditorIndexLP_Module_ObjsFormEdit");
                this.dgPeriodColumn = [[
                    {field: 'lvalueid', title: 'lvalueid', width: 50, fixed: true, hidden: true},
                    {field: 'name', title: 'Наименование', width: 180, fixed: true},
                    {
                        field: 'val', title: 'Значение', width: 10000,
                        styler: function cellStyler(value, row, index) {
                            if (row.strict == 1 && (row.val == null || row.val == '')) {
                                return 'border: 1.5px solid red;';
                            }
                        },
                        editor: {
                            type: 'textbox', options: {
                                editable: true,
                                height: '100%',
                                onChange: function (value) {
                                    let cc = this;
                                    setTimeout(function () {
                                        let ed = $("#dgListParams_Module_Objs_ObjsFormEdit").datagrid('getEditor', {
                                            index: this.editIndex,
                                            field: 'val'
                                        });
                                        let editIndex = dEditorIndex.html();
                                        let row = $("#dgListParams_Module_Objs_ObjsFormEdit").datagrid('getRows')[editIndex];
                                        row.val = $(cc).textbox('getText');
                                    }, 0);
                                }
                            }
                        }
                    },
                    {field: 'imgFlag', title: 'imgFlag', width: 100, hidden: true},
                    {field: 'lvimg', title: 'lvimg', width: 100, hidden: true},
                    {field: 'flagDel', title: 'flagDel', width: 100, hidden: true},
                    {field: 'refferfunc', title: 'Func', width: 10000, hidden: true},
                    {
                        field: 'ref', title: '...', width: 38, fixed: true, align: 'center',
                        formatter: function (value, row) {
                            if (row.refferfunc != '' && row.refferfunc != null) {
                                return '<a act="ref" row-id="' + row.refferfunc + '" href="#" class="easyui-linkbutton"></a>'
                            } else {
                                return ''
                            }
                        }
                    },
                    {
                        field: 'view', title: 'Вид', width: 38, fixed: true, align: 'center',
                        formatter: function (value, row) {
                            let icon = 'icon-ObjsView'
                            // if (row.imgFlag === null || row.imgFlag === undefined || row.imgFlag === "" || row.lvimg == -1 || row.lvimg === null || row.lvimg === undefined || row.lvimg === "") {
                            if (row.lvimg == undefined || row.lvimg == -1 && row.imgFlag === null || row.imgFlag === undefined || row.imgFlag === "") {
                                icon = 'icon-ObjsView_bw'
                            }
                            return '<a act="view" row-id="' + row.id + '" href="#" class="easyui-linkbutton" iconCls="' + icon + '"></a>'
                        }
                    },
                    {
                        field: 'clear', title: '', width: 38, fixed: true, align: 'center',
                        formatter: function (value, row) {
                            return '<a act="clear" row-id="' + row.id + '" href="#" class="easyui-linkbutton" iconCls="icon-ObjsDelete"></a>'
                        }
                    }
                ]];
                this.dgListParams.datagrid({
                    fitColumns: true,
                    singleSelect: true,
                    onLoadSuccess: this.dgListParams_onLoadSuccess.bind(this),
                    data: this.dgPeriodData,
                    columns: this.dgPeriodColumn,
                    onClickCell: function (index, field) {
                        if (this.RightListParams == 0) {
                            return;
                        }
                        this.currentIndexLP = index;
                        let editIndex = dEditorIndex.html();
                        this.dgListParams.datagrid('selectRow', index).datagrid('endEdit', editIndex);
                        dEditorIndex.html(index);
                        this.field = field;
                        this.dgListParams_onLoadSuccess();
                        if (field === "val") {
                            // Обработать спарвочная или нет
                            let currentRow = this.dgListParams.datagrid("getRows")[index];
                            if (currentRow.reffertable === null || currentRow.reffertable === undefined || currentRow.reffertable === "") {
                                this.dgListParams.datagrid('selectRow', index).datagrid('beginEdit', index);
                            }
                        }
                    }.bind(this)
                });
                return true;
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Работа с дополнительными реквизитами
     */
    dgListParams_onLoadSuccess() {
        let getDataTable = function (table, id) {
            return this.universalDataDGV(table, id);
        }.bind(this);

        let returnCurrentIndex = function () {
            return this.currentIndexLP;
        }.bind(this);

        let refreshGrid = function () {
            return this.dgListParams_onLoadSuccess();
        }.bind(this);

        let getSesId = function () {
            return this.GenUUID;
        }.bind(this);

        let tableID = function (tableName) {
            return this.tableId(tableName);
        }.bind(this);

        let flagDel = function (id) {
            return this.flagDelImg(id);
        }.bind(this);

        let indx = -1;
        this.dgListParams.datagrid('getPanel').find('.easyui-linkbutton').each(function () {
            $(this).linkbutton({
                onClick: function btnListParam() {

                    // Вызываем модуль для работы с картинками
                    if ($(this).attr("act") === "view") {
                        setTimeout(function () {

                            $.when(tableID('listvalues')).then(function (result) {
                                indx = returnCurrentIndex();
                                let row = $("#dgListParams_Module_Objs_ObjsFormEdit").datagrid("getRows")[indx];
                                let recId = row.lvalueid;
                                if (recId == undefined) {
                                    recId = -1;
                                }
                                let listParamId = row.id;
                                let params = {};
                                params.ObjectId = result;
                                params.RecId = recId;
                                params.SesId = getSesId();
                                params.ListParamId = listParamId;
                                params.PeriodParamId = -1;
                                params.period_lock_id = "";
                                StartModalModulGlobal("ImgWork", params, ((data) => {
                                    if (data !== undefined && data !== "") {
                                        $.when(flagDel(data.id)).then(function (result) {
                                            if (data.id != -1 && result != 1) {
                                                row.imgFlag = 'true';
                                                row.lvimg = data.id;
                                                $("#dgListParams_Module_Objs_ObjsFormEdit").datagrid("updateRow", {
                                                    index: indx,
                                                    row: row,
                                                });
                                            } else {
                                                row.imgFlag = '';
                                                row.lvimg = data.id;
                                                $("#dgListParams_Module_Objs_ObjsFormEdit").datagrid("updateRow", {
                                                    index: indx,
                                                    row: row,
                                                });
                                            }
                                            $("#dgListParams_Module_Objs_ObjsFormEdit").datagrid("refreshRow", indx);
                                            refreshGrid();
                                        });
                                    }
                                }));
                            });
                        }, 1);
                    }

                    // Если справочная информация, то вызываем соотвутствующий модуль
                    if ($(this).attr("act") === "ref") {
                        setTimeout(function () {
                            indx = returnCurrentIndex();
                            let row = $("#dgListParams_Module_Objs_ObjsFormEdit").datagrid("getRows")[indx];
                            if (row.reffertable != null && row.reffertable !== "null" && row.reffertable !== "") {
                                StartModalModulGlobal(row.reffertable, "", ((data) => {
                                        if (data.id !== undefined && data.id !== "") {
                                            $.when(getDataTable(row.reffertable, data.id)).then(function (result) {
                                                row.val = result;
                                                $("#dgListParams_Module_Objs_ObjsFormEdit").datagrid("updateRow", {
                                                    index: indx,
                                                    row: row
                                                });
                                                $("#dgListParams_Module_Objs_ObjsFormEdit").datagrid("refreshRow", indx);
                                                refreshGrid();
                                            })
                                        }
                                    }
                                ));
                            }
                        }, 1);
                    }

                    // Очистка поля "Значение"
                    if ($(this).attr("act") === "clear") {
                        setTimeout(function () {
                            indx = returnCurrentIndex();
                            let row = $("#dgListParams_Module_Objs_ObjsFormEdit").datagrid("getRows")[indx];
                            row.val = "";
                            row.flagDel = 1;
                            $("#dgListParams_Module_Objs_ObjsFormEdit").datagrid("updateRow", {index: indx, row: row})
                            $("#dgListParams_Module_Objs_ObjsFormEdit").datagrid("refreshRow", indx);
                            refreshGrid();
                        }, 1);
                    }
                }
            })
        })
    }

    /**
     * Настройка грида с периодическими реквизитами
     */
    customizationGridPP() {
        return $.ajax({
            method: "get",
            url: this.GetUrl('/Objs/listPeriodParams'),
            success: function (data) {
                if (data == null || data === "" || data.length === 0) return;
                this.dgPeriodData = data;
                let dEditorIndex = this.GetElement("dEditorIndexPP_Module_ObjsFormEdit");
                this.dgPeriodColumn = [[
                    {field: 'name', title: 'Наименование', width: 180, fixed: true, editable: false},
                    {
                        field: 'val', title: 'Значение', width: 240, fixed: true,
                        styler: function cellStyler(value, row, index) {
                            if (row.strict == 1 && (row.val == null || row.val == '')) {
                                return 'border: 1.5px solid red;';
                            }
                        },
                        editor: {
                            type: 'textbox', options: {
                                editable: true,
                                height: '100%',
                                onChange: function (value) {
                                    let cc = this;
                                    setTimeout(function () {
                                        let ed = $("#dgPeriodParams_Module_Objs_ObjsFormEdit").datagrid('getEditor', {
                                            index: this.editIndex,
                                            field: 'val'
                                        });
                                        let editIndex = dEditorIndex.html();
                                        let row = $("#dgPeriodParams_Module_Objs_ObjsFormEdit").datagrid('getRows')[editIndex];
                                        row.val = $(cc).textbox('getText');
                                    }, 0);
                                }
                            }
                        }
                    },
                    {
                        field: 'ref', title: '...', width: 35, fixed: true, align: 'center',
                        formatter: function (value, row) {
                            return '<a act="ref" row-id="' + row.id + '" href="#" class="easyui-linkbutton"></a>'
                        }
                    },
                    {field: 'pvalueid', title: 'pvalueid', width: 180, fixed: true, hidden: true}
                ]];
                this.dgPeriodParams.datagrid({
                    fitColumns: true,
                    singleSelect: true,
                    onLoadSuccess: this.dgPeriodParams_onLoadSuccess.bind(this),
                    data: this.dgPeriodData,
                    columns: this.dgPeriodColumn,
                    onClickCell: function (index, field) {
                        if (this.RightPeriodParams == 0) {
                            return;
                        }
                        this.currentIndexPP = index;
                        let editIndex = dEditorIndex.html();
                        this.dgPeriodParams.datagrid('selectRow', index).datagrid('endEdit', editIndex);
                        dEditorIndex.html(index);
                        this.field = field;
                        this.dgPeriodParams_onLoadSuccess();
                    }.bind(this)
                });
                return true;
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Работа с дополнительными реквизитами
     */
    dgPeriodParams_onLoadSuccess() {
        let returnCurrentIndex = function () {
            return this.currentIndexPP;
        }.bind(this);

        let refreshGrid = function () {
            return this.dgPeriodParams_onLoadSuccess();
        }.bind(this);

        let getSesId = function () {
            return this.GenUUID;
        }.bind(this);

        let tableID = function (tableName) {
            return this.tableId(tableName);
        }.bind(this);

        let dataPeriodEdit = function (id) {
            return this.getPeriodEdit(id)
        }.bind(this);

        let flagDelPeriodLock = function (periodparamid, sesId) {
            return this.flagDelPeriodLock(periodparamid, sesId)
        }.bind(this);

        let indx = -1;
        let id = this.txId.textbox("getText");
        if (id.length == 0) {
            id = -1;
        }
        let dateObjs = this.DateObjs;
        this.dgPeriodParams.datagrid('getPanel').find('.easyui-linkbutton').each(function () {
            $(this).linkbutton({
                onClick: function btnPeriodParam() {
                    if ($(this).attr("act") === "ref") {
                        $.when(tableID('periodvalues')).then(function (result) {
                            indx = returnCurrentIndex();
                            let row = $("#dgPeriodParams_Module_Objs_ObjsFormEdit").datagrid("getRows")[indx];
                            let params = {};
                            params.PeriodParamId = row.id;
                            params.SesId = getSesId();
                            params.ObjectId = result;
                            params.RecId = id;
                            params.PeriodParamData = dateObjs;
                            StartModalModulGlobal("PeriodEdit", params, ((data) => {
                                $.when(dataPeriodEdit(data.id), flagDelPeriodLock(row.id, getSesId())).then(function (dataResult, flagResult) {
                                    if (flagResult[0] === 1) {
                                        row.val = "";
                                    } else {
                                        row.val = dataResult[0];
                                    }
                                    $("#dgPeriodParams_Module_Objs_ObjsFormEdit").datagrid("updateRow", {
                                        index: indx,
                                        row: row
                                    })
                                    $("#dgPeriodParams_Module_Objs_ObjsFormEdit").datagrid("refreshRow", indx);
                                    refreshGrid();
                                });
                            }));
                        });
                    }
                }
            })
        })
    }

    /**
     * Получаем значение из таблицы periodlock
     * @param id - идентификатор  записи в таблице periodlock
     * @returns {jQuery|{getAllResponseHeaders: function(): (*|null), abort: function(*=): this, setRequestHeader: function(*=, *): this, readyState: number, getResponseHeader: function(*): (null|*), overrideMimeType: function(*): this, statusCode: function(*=): this}|$|jQuery|(function(*=, *=): *)|(function(*=, *=): *)|*}
     */
    getPeriodEdit(id) {
        return $.ajax({
            method: "get",
            url: this.GetUrl('/Objs/getPeriodEdit?id=' + parseInt(id)),
            success: function (data) {
                return data;
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     *
     * @param periodparamid
     * @param sesId
     * @returns {jQuery|{getAllResponseHeaders: (function(): *), abort: (function(*=): jqXHR), setRequestHeader: (function(*=, *): jqXHR), readyState: number, getResponseHeader: (function(*): *), overrideMimeType: (function(*): jqXHR), statusCode: (function(*=): jqXHR)}|$|(function(*=, *=, *=, *=): void)|(function(*=, *=): *)|(function(*=, *=): *)|*}
     */
    flagDelPeriodLock(periodparamid, sesId) {
        return $.ajax({
            method: "get",
            url: this.GetUrl('/Objs/FlagDelPeriodLock?periodparamid=' + parseInt(periodparamid) + '&sesId=' + sesId),
            success: function (data) {
                return data;
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Установка формата в DateBox
     * @constructor
     */
    dateFormat(dateBox) {
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
     * Функция загрузки выбранной записи
     * @constructor
     */
    LoadObjs() {
        $.ajax({
            method: "get",
            url: this.GetUrl('/Objs/get?id=' + this.options.id),
            success: function (data) {
                this.txId.textbox("setText", data.id);
                this.cbAccs.combobox("setValue", data.acc_id);
                this.cbInvGrps.combobox("setValue", data.inv_grp_id);
                if (data.perc != null) {
                    let prc = data.perc.substring(0, data.perc.length - 1);
                    this.txWearMthds.textbox("setText", prc);
                } else {
                    this.txWearMthds.textbox("setText", 'Не указано');
                }
                this.txInvNo.textbox("setText", data.invno);
                this.txInvSer.textbox("setText", data.invser);
                this.txObjType.textbox("setText", data.objtype);
                this.txName.textbox("setText", data.name);
                this.txDescr.textbox("setText", data.descr);
                this.cbTypeFonds.combobox("setValue", data.fond_type_id);
                this.cbKekr.combobox("setValue", data.kekr_id);
                this.txStrtAmount.textbox("setText", data.strtamount.substring(0, data.strtamount.length - 1).replace(',', '.'));
                this.dtDateBuy.datebox("setText", data.datebuy);
                this.DateBase = data.datebuy;
                this.txDateBeg.textbox("setText", data.datebeg);
                this.txDateLikv.textbox("setText", data.dateend);

                if (data.flaglikv == 0 && data.dateend != "Не ликвидирован") {
                    this.lDateEnd.text('Дата окончания эксплуатации')
                } else {
                    this.lDateEnd.text('Дата ликвидации объекта')
                }
                this.cbUnits.combobox("setValue", data.unit_id);
                this.txInfo.textbox("setText", data.info);
                this.txCreator.textbox("setText", data.creator);
                this.txCreated.textbox("setText", data.created);
                this.txChanger.textbox("setText", data.changer);
                this.txChanged.textbox("setText", data.changed);
                this.cbAccs.textbox({disabled: true});
                this.cbInvGrps.textbox({disabled: true});
                this.imgObjs = data.img;
                if (data.img != 0) {
                    this.btnImgObjs.linkbutton({
                        iconCls: 'icon-ObjsView'
                    });
                } else {
                    this.btnImgObjs.linkbutton({
                        iconCls: 'icon-ObjsView_bw'
                    });
                }
                this.LoadListValues(data.id);
                $.when().then(() => {
                    this.LoadPeriodValues(data.id);
                });
                this.ExplDateValues(data.id);

            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }


    /**
     * Получаем данные о "сроках эксплуатации"
     * @param id
     * @constructor
     */
    ExplDateValues(id) {
        return $.ajax({
            method: "get",
            url: this.GetUrl("/Objs/listDateObjs?objsId=" + id),
            success: function (data) {
                this.explModelList = data;
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Получаем значения для дополнительных реквизитов
     * @param id
     * @constructor
     */
    LoadListValues(id) {
        $.ajax({
            method: "get",
            url: this.GetUrl("/Objs/listListValues?id=" + id),
            success: function (data) {
                let row = this.dgListParams.datagrid("getRows");
                for (let i = 0; i < row.length; i++) {
                    let val = data.find(function (e) {
                        return e.lparamid == row[i].id
                    });
                    if (val != undefined && val != "") {
                        if (row[i].refferfunc != null && row[i].refferfunc != "") {
                            this.dgListParams.datagrid('updateRow', {
                                index: i,
                                row: {
                                    lvimg: val.lvimg,
                                    lvalueid: val.lvalueid,
                                    val: val.lvalueval + ' = ' + val.lvaluename
                                }
                            });
                        } else {
                            this.dgListParams.datagrid('updateRow', {
                                index: i,
                                row: {
                                    lvimg: val.lvimg,
                                    lvalueid: val.lvalueid,
                                    val: val.lvalueval
                                }
                            });
                        }
                    } else {
                        this.dgListParams.datagrid('updateRow', {
                            index: i,
                            row: {
                                lvalueid: -1,
                                lvimg: -1
                            }
                        });
                    }
                }
                this.dgListParams_onLoadSuccess();

            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Получаем значения для периодических реквизитов
     * @param id
     * @constructor
     */
    LoadPeriodValues(id) {
        $.ajax({
            method: "get",
            url: this.GetUrl("/Objs/listPeriodValues?id=" + id + "&date=" + this.DateObjs),
            success: function (data) {
                let row = this.dgPeriodParams.datagrid("getRows");
                for (let i = 0; i < row.length; i++) {
                    let val = data.find(function (e) {
                        return e.pparamid == row[i].id
                    });
                    if (val != undefined && val != "") {
                        if (val.pparamreffermodul != null && val.pparamreffermodul.length > 0) {
                            this.dgPeriodParams.datagrid('updateRow', {
                                index: i,
                                row: {
                                    pvalueid: val.pvalueid,
                                    val: val.pvalueval + ' = ' + val.pvaluename
                                }
                            });
                        } else {
                            this.dgPeriodParams.datagrid('updateRow', {
                                index: i,
                                row: {
                                    pvalueid: val.pvalueid,
                                    val: val.pvalueval
                                }
                            });
                        }
                    }
                }
                this.dgPeriodParams_onLoadSuccess();
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    contains(arr, elem) {
        let t = '';
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].lparamname === elem) {
                if (arr[i].lvaluename != null) {
                    return arr[i].lvaluename;
                } else {
                    return arr[i].lvalueval;
                }
            }
        }
        return "";
    }

    /**
     * Вызываем форму для работы с сроками эксплуатации
     */
    btnObjsExpl_onClick() {
        let id = this.txId.textbox("getText");
        let form = new ObjsFormExplList(this.explModelList, id);
        form.SetResultFunc((ExplModel) => {
            this.explModelList = ExplModel;
            this.DateBegAndLikv();
        });
        form.Show({AddMode: true});

    }

    /**
     * Анализируем занчение о вводе/выводе объекта в эксплуатацию
     * @constructor
     */
    DateBegAndLikv() {
        let masDateBeg = [];
        let masDateLikv = [];
        let flaglikv = -1;
        for (let obj in this.explModelList) {
            if (this.explModelList[obj].del == 0) {
                masDateBeg.push(this.ChangeFormatDate(this.explModelList[obj].datebeg));
                masDateLikv.push(this.explModelList[obj].dateend);
                flaglikv = this.explModelList[obj].flaglikv;
            }
        }

        // Получаем максимальную и минимальную дату
        if (masDateBeg.length > 0) {
            let maxDateBeg = masDateBeg.reduce(function (a, b) {
                return a > b ? a : b;
            });
            if (maxDateBeg != '') {
                this.txDateBeg.textbox("setText", this.ChangeFormatDateBack(maxDateBeg));
            }
        } else {
            this.txDateBeg.textbox("setText", 'Не эксплуатируется');
        }
        if (masDateLikv.length > 0) {
            let maxDateLikv = masDateLikv.reduce(function (a, b) {
                return a > b ? a : b;
            });
            if (maxDateLikv != '') {
                if (flaglikv != 1) {
                    this.lDateEnd.text('Дата окончания эксплуатации')
                } else {
                    this.lDateEnd.text('Дата ликвидации объекта')
                }
                this.txDateLikv.textbox("setText", maxDateLikv);
            } else {
                this.lDateEnd.text('Дата ликвидации объекта')
                this.txDateLikv.textbox("setText", 'Не ликвидирован');
            }
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
                if (id == 42) {
                    this.txName.textbox({disabled: false}); // наименование
                    this.btnImgObjs.linkbutton({disabled: false}); // добавление изображения
                    this.txDescr.textbox({disabled: false}); // описание
                    this.cbTypeFonds.combobox({disabled: false}); // тип фонда
                    this.cbKekr.combobox({disabled: false}); // КЭКР
                    this.txStrtAmount.numberbox({disabled: false}); // первоначальная стоимость
                    this.dtDateBuy.datebox({disabled: false}); // дата приобретения
                    this.btnObjsExpl.linkbutton({disabled: false}); // ввод/вывод
                    this.cbUnits.combobox({disabled: false}); // единица измерения
                    this.txInfo.textbox({disabled: false}); // примечание
                    this.RightListParams = 1;
                    this.RightPeriodParams = 1;
                    this.dgPeriodParams_onLoadSuccess();
                    this.dgListParams_onLoadSuccess();
                } else {
                    this.RightListParams = 1;
                    this.dgPeriodParams_onLoadSuccess();
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }


    /**
     *  Функция загрузки строки в формате id = name (универсальный)
     * @param table - наименование таблицы
     * @param id - идентификатор записи
     * @returns {jQuery|{getAllResponseHeaders: (function(): *), abort: (function(*=): jqXHR), setRequestHeader: (function(*=, *): jqXHR), readyState: number, getResponseHeader: (function(*): *), overrideMimeType: (function(*): jqXHR), statusCode: (function(*=): jqXHR)}|$|(function(*=, *=): *)|(function(*=, *=): *)|HTMLElement|*}
     */
    universalDataDGV(table, id) {
        let res = $.ajax({
            method: "get",
            url: this.GetUrl('/Objs/universalDataAcquisition?table=' + table + "&id=" + id),
            success: function (data) {
                return data
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
        return res;
    }


    /**
     * Обработка нажатия на кнопку ОК
     * @returns {boolean}
     */
    btnOk_onClick() {

        let objType = this.txObjType.textbox("getText");
        let name = this.txName.textbox("getText");
        let dateBuy = this.dtDateBuy.datebox("getText");
        let strtAmount = this.txStrtAmount.textbox("getText");
        let cntObjs = this.txCountObjs.textbox("getText");

        if (cntObjs.length == 0) {
            this.tTabs.tabs('select', 0);
            this.ShowToolTip('#txCountObjs_Objs_ObjsFormEdit_toolTip', '<b>Количество</b> не может быть пустым', {
                icon: 'icon-no',
                title: 'Ошибка',
                position: 'right',
                delay: 5000
            });
            return false;
        }

        if (cntObjs < "1") {
            this.tTabs.tabs('select', 0);
            this.ShowToolTip('#txCountObjs_Objs_ObjsFormEdit_toolTip', '<b>Количество</b> не может быть меньше нуля', {
                icon: 'icon-no',
                title: 'Ошибка',
                position: 'right',
                delay: 5000
            });
            return false;
        }

        if (cntObjs.length > 4) {
            this.tTabs.tabs('select', 0);
            this.ShowToolTip('#txCountObjs_Objs_ObjsFormEdit_toolTip', '<b>Количество</b> не может быть больше 4 символов', {
                icon: 'icon-no',
                title: 'Ошибка',
                position: 'right',
                delay: 5000
            });
            return false;
        }
        if (isNaN(cntObjs)) {
            this.tTabs.tabs('select', 0);
            this.ShowToolTip('#txCountObjs_Objs_ObjsFormEdit_toolTip', '<b>Количество</b> должно содержать только целые цифры', {
                icon: 'icon-no',
                title: 'Ошибка',
                position: 'right',
                delay: 5000
            });
            return false;
        }

        if (this.AccsId == -1) {
            this.tTabs.tabs('select', 0);
            this.ShowToolTip('#cbAccs_Module_Objs_ObjsFormEdit_toolTip', 'Выберите пожалуйста <b>Счёт объекта</b>', {
                icon: 'icon-no',
                title: 'Ошибка',
                position: 'right',
                delay: 5000
            });
            return false;
        }

        if (this.InvGrpsId == -1) {
            this.tTabs.tabs('select', 0);
            this.ShowToolTip('#cbInvGrps_Module_Objs_ObjsFormEdit_toolTip', 'Выберите пожалуйста <b>Группу инвентарного учета объекта</b>', {
                icon: 'icon-no',
                title: 'Ошибка',
                position: 'right',
                delay: 5000
            });
            return false;
        }

        if (this.txInvNo.textbox("getText").length == 0) {
            this.tTabs.tabs('select', 0);
            this.ShowToolTip('#txInvNo_Module_Objs_ObjsFormEdit_toolTip', 'Укажите пожалуйста  <b>Инвентарный номер</b>', {
                icon: 'icon-no',
                title: 'Ошибка',
                position: 'bottom',
                delay: 5000
            });
            return false;
        }


        if (objType.length == 0) {
            this.tTabs.tabs('select', 0);
            this.ShowToolTip('#txObjType_Module_Objs_ObjsFormEdit_toolTip', 'Выберите пожалуйста <b>Тип объекта</b>', {
                icon: 'icon-no',
                title: 'Ошибка',
                position: 'bottom',
                delay: 5000
            });
            return false;
        }

        if (name.length == 0) {
            this.tTabs.tabs('select', 0);
            this.ShowToolTip('#txName_Module_Objs_ObjsFormEdit_toolTip', 'Введите пожалуйста <b>Наименование объекта</b>', {
                icon: 'icon-no',
                title: 'Ошибка',
                position: 'bottom',
                delay: 5000
            });
            return false;
        }

        if (this.UnitsId == -1) {
            this.tTabs.tabs('select', 1);
            this.ShowToolTip('#cbUnits_Module_Objs_ObjsFormEdit_toolTip', 'Выберите пожалуйста <b>Единицу измерения</b>', {
                icon: 'icon-no',
                title: 'Ошибка',
                position: 'right',
                delay: 5000
            });
            return false;
        }

        if (this.KekrId == -1) {
            this.tTabs.tabs('select', 0);
            this.ShowToolTip('#cbKekr_Module_Objs_ObjsFormEdit_toolTip', 'Выберите пожалуйста <b>КЭКР</b>', {
                icon: 'icon-no',
                title: 'Ошибка',
                position: 'right',
                delay: 5000
            });
            return false;
        }

        if (this.TypeFondsId == -1) {
            this.tTabs.tabs('select', 0);
            this.ShowToolTip('#cbTypeFonds_Module_Objs_ObjsFormEdit_toolTip', 'Выберите пожалуйста <b>Тип фонда</b>', {
                icon: 'icon-no',
                title: 'Ошибка',
                position: 'right',
                delay: 5000
            });
            return false;
        }

        if (dateBuy.length == 0) {
            this.tTabs.tabs('select', 1);
            this.ShowToolTip('#dtDateBuy_Module_Objs_ObjsFormEdit_toolTip', 'Укажите пожалуйста <b>Дату приобритения объекта</b>', {
                icon: 'icon-no',
                title: 'Ошибка',
                position: 'right',
                delay: 5000
            });
            return false;
        }
        if (strtAmount.length == 0) {
            this.tTabs.tabs('select', 0);
            this.ShowToolTip('#txStrtAmount_Module_Objs_ObjsFormEdit_toolTip', 'Укажите пожалуйста <b>Первоначальную стоимость объекта</b>', {
                icon: 'icon-no',
                title: 'Ошибка',
                position: 'right',
                delay: 5000
            });
            return false;
        }

        let strtAmountT = strtAmount.replace(/\s/g, '');
        strtAmountT = strtAmountT.split(' ').join('');
        // проврека на число
        if (isNaN(strtAmountT)) {
            this.tTabs.tabs('select', 0);
            this.ShowToolTip('#txStrtAmount_Module_Objs_ObjsFormEdit_toolTip', "'Первоначальная стоимость' объекта должна содержать только числовые значения", {
                icon: 'icon-no',
                title: 'Ошибка',
                position: 'right',
                delay: 5000
            });
            return false;
        }

        //проврека стоимости
        if (strtAmount < 0) {
            this.tTabs.tabs('select', 0);
            this.ShowToolTip('#txStrtAmount_Module_Objs_ObjsFormEdit_toolTip', "'Первоначальная стоимость' не может быть отрицательной", {
                icon: 'icon-no',
                title: 'Ошибка',
                position: 'right',
                delay: 5000
            });
            return false;
        }

        // проверка гридов на заполненость
        let gridPP = this.dgPeriodParams.datagrid('getRows');
        for (let i = 0; i < gridPP.length; ++i) {
            if (gridPP[i].strict == '1' && gridPP[i].val == null) {
                this.ShowError("Значения периодического реквизита '" + gridPP[i].name + "' должно быть обязательно заполнено");
                return false;
            }
        }


        let gridLP = this.dgListParams.datagrid('getRows');
        for (let i = 0; i < gridLP.length; ++i) {
            if (gridLP[i].strict == '1' && gridLP[i].val == null) {
                this.ShowError("Значения дополнительного реквизита '" + gridLP[i].name + "' должно быть обязательно заполнено");
                return false;
            }
            if (gridLP[i].imgFlag == 'true' && gridLP[i].val == null) {
                this.ShowError("Выбрана картинка на дополнительном реквизите '" + gridLP[i].name + "' заполните его или удалите картинку");
                return false;
            }
        }
        let dateMinExpl = "21000101";
        for (let i = 0; i < this.explModelList.length; ++i) {
            if (this.explModelList[i].del == 1) {
                continue;
            }
            let dateBeg = this.explModelList[i].datebeg.substr(6, 4) +
                this.explModelList[i].datebeg.substr(3, 2) +
                this.explModelList[i].datebeg.substr(0, 2);
            if (dateBeg < dateMinExpl) {
                dateMinExpl = dateBeg
            }
        }
        if (dateMinExpl != "21000101") {
            if (dateMinExpl <
                dateBuy.substr(6, 4) +
                dateBuy.substr(3, 2) +
                dateBuy.substr(0, 2)) {
                this.ShowError("Дата ввода в эксплуатация не может быть ментше даты приобретения");
                return false;
            }
        }


        let baseDate = this.ChangeFormatDate(this.DateBase);
        let buyDate = this.ChangeFormatDate(dateBuy);
        if (baseDate !== buyDate) {
            this.checkCloseDayForm(dateBuy);
        } else {
            this.ContinueSave();
        }
    }

    /**
     * Проверка даты начала эксплуатации (если день открыт, то идем в следующую проверку иначе ошибка)
     * @param date
     */
    checkCloseDayForm(date) {
        $.ajax({
            method: "get",
            url: this.GetUrl('/Objs/checkCloseDay?date=' + date),
            success: function (data) {
                if (data == 0) {
                    this.tTabs.tabs('select', 1);
                    this.ShowToolTip('#dtDateBuy_Module_Objs_ObjsFormEdit_toolTip', "День <b>" + date + "</b> закрыт или не был открыт", {
                        icon: 'icon-no',
                        title: 'Ошибка',
                        position: 'right',
                        delay: 5000
                    });
                    return false;
                } else {
                    if (this.DateBase != "") {
                        this.checkCloseDayBase();
                    } else {
                        this.ContinueSave();
                    }
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }


    checkCloseDayBase() {
        $.ajax({
            method: "get",
            url: this.GetUrl('/Objs/checkCloseDay?date=' + this.DateBase),
            success: function (data) {
                if (data == 0) {
                    this.tTabs.tabs('select', 1);
                    this.ShowError("День <b>" + this.DateBase + "</b> закрыт или не был открыт");
                    return false;
                } else {
                    this.ContinueSave();
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Продолжение сохранения объекта
     * @constructor
     */
    ContinueSave() {
        let id = this.txId.textbox('getText');
        let accs = this.cbAccs.combobox('getValue');
        let accsIndex = accs.indexOf(' = ');
        if (accsIndex != -1) {
            let accsSplit = accs.split(' = ');
            accs = accsSplit[0];
        }
        let invGrps = this.cbInvGrps.combobox('getValue');
        let invGrpsIndex = invGrps.indexOf(' = ');
        if (invGrpsIndex != -1) {
            let invGrpsSplit = invGrps.split(' = ');
            invGrps = invGrpsSplit[0];
        }
        let invNo = this.txInvNo.textbox('getText');
        let invSer = this.txInvSer.textbox('getText');
        let countObjs = this.txCountObjs.textbox('getText');
        let objType = this.txObjType.textbox('getText');
        let objTypeIndex = objType.indexOf(' = ');
        if (objTypeIndex != -1) {
            let objTypeSplit = objType.split(' = ');
            objType = objTypeSplit[0];
        }
        let name = this.txName.textbox('getText');
        let descr = this.txDescr.textbox('getText');
        let typeFonds = this.cbTypeFonds.combobox('getValue');
        let typeFondsIndex = typeFonds.indexOf(' = ');
        if (typeFondsIndex != -1) {
            let typeFondsSplit = typeFonds.split(' = ');
            typeFonds = typeFondsSplit[0];
        }
        let kekr = this.cbKekr.combobox('getValue');
        let kekrIndex = kekr.indexOf(' = ');
        if (kekrIndex != -1) {
            let kekrSplit = kekr.split(' = ');
            kekr = kekrSplit[0];
        }
        let strtAmount = this.txStrtAmount.textbox('getText');
        strtAmount = strtAmount.split(' ').join('');
        strtAmount = strtAmount.replace('.', ',');

        let dateBuy = this.dtDateBuy.datebox('getText');
        let units = this.cbUnits.combobox('getValue');
        let unitsIndex = units.indexOf(' = ');
        if (unitsIndex != -1) {
            let unitsSplit = units.split(' = ');
            units = unitsSplit[0];
        }
        let info = this.txInfo.textbox("getText");

        let dataDgLP = this.dgListParams.datagrid('getRows');

        let dataLP = [];
        for (let i = 0; i < dataDgLP.length; ++i) {
            if (dataDgLP[i].val != null && dataDgLP[i].val.length > 0 || dataDgLP[i].flagDel == 1) {
                let val = dataDgLP[i].val;
                let lvimg = dataDgLP[i].lvimg;
                if (dataDgLP[i].refferfunc != "") {
                    let valIndex = val.indexOf(' = ');
                    if (valIndex != -1) {
                        let valSplit = val.split(' = ');
                        val = valSplit[0];
                    }
                }
                let lvid = dataDgLP[i].lvalueid;
                if (lvid == undefined) {
                    lvid = -1;
                }
                dataLP.push({lvalueid: lvid, lparamid: dataDgLP[i].id, lvalueval: val, lvimg: lvimg});
            }
        }
        let dataDgPP = this.dgPeriodParams.datagrid('getRows');
        let dataPP = [];
        for (let i = 0; i < dataDgPP.length; ++i) {
            if (dataDgPP[i].val != null && dataDgPP[i].val.length > 0) {
                dataPP.push({pparamid: dataDgPP[i].id, pvalueval: dataDgPP[i].val, pvalueid: dataDgPP[i].pvalueid});
            }
        }
        let dataExpl = [];
        for (let obj in this.explModelList) {
            let change = 1;
            if (this.explModelList[obj].change == undefined) {
                change = 0;
            }
            dataExpl.push({
                id: this.explModelList[obj].id,
                actnom: this.explModelList[obj].actnom,
                datebeg: this.explModelList[obj].datebeg,
                dateend: this.explModelList[obj].dateend,
                flaglikv: this.explModelList[obj].flaglikv,
                del: this.explModelList[obj].del,
                out_info: this.explModelList[obj].out_info,
                change: change
            });
        }
        let model = {
            id: id,
            accs: accs,
            invGrps: invGrps,
            invNo: invNo,
            invSer: invSer,
            objType: objType,
            name: name,
            descr: descr,
            typeFonds: typeFonds,
            kekr: kekr,
            strtAmount: strtAmount,
            dateBuy: dateBuy,
            units: units,
            info: info,
            explmodel: dataExpl,
            lvmodel: dataLP,
            pvmodel: dataPP,
            sesid: this.GenUUID,
            img: this.imgObjs,
            countObjs: countObjs
        }
        this.saveObjs(model);

    }

    /**
     * Сохранение объекта со всеми реквизитами,картинками и датами
     * @param model
     */
    saveObjs(model) {
        $.ajax({
            method: "POST",
            data: JSON.stringify(model),
            url: this.GetUrl('/Objs/save'),
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (this.ResultFunc != null) {
                    this.ResultFunc(data);
                    this.DeleteLockTable(this.GenUUID);
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });

    }

    /**
     * Обработка выбранного значения "справочник счетов"
     * @param record объект с выбранным счетом
     */
    cbAccs_onSelect(record) {
        this.AccsId = record.id;
        this.genInvNo();
    }

    /**
     * Обработка выбранного значения "справочник групп инвентарного учета"
     * @param record объект с выбранной группой  инвентарного учета
     */
    cbInvGrps_onSelect(record) {
        this.InvGrpsId = record.id;
        this.genInvNo();
    }

    /**
     * Генерируем инвентарный номер в разрезе "счета" и "группы инентраного учета" объектта
     */
    genInvNo() {
        let id = this.txId.textbox("getText");
        if (id == -1 && this.AccsId !== -1 && this.InvGrpsId !== -1) {
            $.when(this.checkInvGrpAccs()).then(function (result) {
                if (result === 1) {
                    this.gennerationInvNo();
                } else {
                    this.tTabs.tabs('select', 0);
                 //  this.cbCheckSer.checkbox({disabled: true});
                    this.txCountObjs.textbox({disabled: true});
                    this.txCountObjs.textbox("setText", "1");
                 //   this.cbCheckSer.checkbox("uncheck");
                    this.ShowToolTip('#cbAccs_Module_Objs_ObjsFormEdit_toolTip', 'Выбранный <b>Счёт объекта</b> отсутствует в  <b>Группе инвентарного учета объекта</b>', {
                        icon: 'icon-no',
                        title: 'Ошибка',
                        position: 'right',
                        delay: 5000
                    });
                    this.txInvNo.textbox("setText", "");
                    return false;
                }
            }.bind(this));
        }
    }

    /**
     * Проверка наличия счета в группе
     * @returns {jQuery|{getAllResponseHeaders: function(): (*|null), abort: function(*=): this, setRequestHeader: function(*=, *): this, readyState: number, getResponseHeader: function(*): (null|*), overrideMimeType: function(*): this, statusCode: function(*=): this}|$|jQuery|HTMLElement|{getAllResponseHeaders: function(): (*|null), abort: function(*=): this, setRequestHeader: function(*=, *): this, readyState: number, getResponseHeader: function(*): (null|*), overrideMimeType: function(*): this, statusCode: function(*=): this}}
     */
    checkInvGrpAccs() {
        return $.ajax({
            method: "get",
            url: this.GetUrl("/Objs/checkInvGrpAccs?AccsId=" + this.AccsId + "&InvGrpsId=" + this.InvGrpsId),
            success: function (data) {
                return data;
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Генерация инвентарного номера
     */
    gennerationInvNo() {
        $.ajax({
            method: "get",
            url: this.GetUrl("/Objs/genInvNo?AccsId=" + this.AccsId + "&InvGrpsId=" + this.InvGrpsId),
            success: function (data) {
                this.txInvNo.textbox("setText", data);
               // this.cbCheckSer.checkbox({disabled: false});
                this.txCountObjs.textbox({disabled: false});
                this.wearMthdsPerc()
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    wearMthdsPerc() {
        $.ajax({
            method: "get",
            url: this.GetUrl("/Objs/wearMthdsPerc?accId=" + this.AccsId + "&invGrpId=" + this.InvGrpsId),
            success: function (data) {
                if (data == 0) {
                    this.txWearMthds.textbox("setText", 'Не указано');
                } else {
                    let prc = data.substring(0, data.length - 1);
                    this.txWearMthds.textbox("setText", prc);
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
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

    // /**
    //  * Проставляем серию
    //  */
    // cbCheckSer_onChange() {
    //     if (this.cbCheckSer.checkbox("options").checked) {
    //         this.txInvSer.textbox("setText", "001");
    //     } else {
    //         this.txInvSer.textbox("setText", "");
    //     }
    // }

    /**
     * Обратка загртия формы
     */
    wObjsFormEdit_onBeforeClose() {
        if (this.tag.GenUUID) {
            $.ajax({
                method: "POST",
                url: this.tag.GetUrl("/Objs/DeleteImgLockAndDeletePeriodLock"),
                data: {sesId: this.tag.GenUUID},
                success: (data) => {
                    return;
                },
                error: (data) => {
                    this.ShowErrorResponse(data.responseJSON);
                }
            });
        }
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
        let newDateBeg = myDate[1] + "/" + myDate[0] + "/" + myDate[2];
        return newDateBeg;
    }


    /**
     * Изменяем формат даты с dd.mm.yyyy на dd/mm/yyyy
     * @param date
     * @returns {number}
     * @constructor
     */
    ChangeFormatDateBack(date) {
        let myDate = date;
        myDate = myDate.split("/");
        let newDateBeg = myDate[1] + "." + myDate[0] + "." + myDate[2];
        return newDateBeg;
    }
}