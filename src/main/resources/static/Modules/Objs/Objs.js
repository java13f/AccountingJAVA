import {FormView} from "../Core/FormView.js";
import {ObjsFormEdit} from "./ObjsFormEdit.js";
import {ObjsFormFilter} from "../Objs/ObjsFormFilter.js";
import {ObjsFormParamFilter} from "./ObjsFormParamFilter.js";
import {RepParams} from "../Jasper/RepParams.js";

class Objs extends FormView {

    /**
     * Конструктор
     * @param prefix - приставка для идентификаторов. Данная приставка добавится для каждого идентификатора
     * @param StartParams - стартовые параметры в формате JSON
     */
    constructor(prefix, StartParams) {
        super();
        this.ObjsId = -1;
        this.ObjsIndex = 0;
        this.prefix = prefix;
        this.StartParams = StartParams;
        this.sLoc = new LibLockService(300000);
        this.filterModel = {};
        this.filterMain = {};
        this.filterModelDGV = [];
        this.filter = new LibFilter("objs");
        this.filterDgv = new LibFilter("objsDGV");
        this.dgvColumns = [];
        this.page = "";
        this.rows = "";
        this.DateObjs = "";
    }

    /**
     * Функция загрузки формы
     * @param id - идентификатор эелемента HTML, в который будет загружена разметка частичного представления
     * @constructor
     */
    Start(id) {
        this.ModuleId = id;
        LoadForm("#" + this.ModuleId, this.GetUrl("/Objs/ObjsFormList?prefix=" + this.prefix), this.InitFunc.bind(this));
    }

    /**
     * Функция инициализации пользовательского интерфейса
     * @constructor
     */
    InitFunc() {
        this.InitComponents(this.ModuleId, this.prefix);
        AddKeyboardNavigationForGrid(this.dgObjs);

        // Настройка грида
        this.dgObjs.datagrid({
            onLoadError: (data) => {
                this.ShowErrorResponse(data.responseJSON);
            },
            onLoadSuccess: this.dgObjs_onLoadSuccess.bind(this),
            rowStyler: this.dgObjs_rowStyler.bind(this),
            onSelect: this.getSelectedRow.bind(this)
        });

        // Анализ и загрузка динамического грида (то что пришло из базы)
        this.LoadDataGridFilter();


        // Настройка навигационного блока для грида
        this.dgObjsPager.pagination({
            showRefresh: false,
            pageSize: 350,
            pageList: [50, 100, 150, 200, 250, 300, 350],
            onSelectPage: this.UpdateData.bind(this),
            onChangePageSize: this.UpdateData.bind(this)
        });


        // Форматирования даты
        this.formatDate(this.dtDate);

        // Обработка элементов на форме
        this.cbCheckDate.checkbox({onChange: this.cbCheckDate_onChange.bind(this)});
        this.dtDate.datebox({onChange: this.dtDate_onChange.bind(this)});

        this.btnAdd.linkbutton({onClick: this.btnAdd_onClick.bind(this)});
        this.btnChange.linkbutton({onClick: this.btnChange_onClick.bind(this)});
        this.btnDelete.linkbutton({onClick: this.btnDelete_onClick.bind(this)});
        this.btnUpdate.linkbutton({onClick: this.btnUpdate_onClick.bind(this)});
        this.btnFilter.linkbutton({onClick: this.btnFilter_onClick.bind(this)});
        this.btnToolsDgv.linkbutton({onClick: this.btnToolsDgv_onClick.bind(this)});
        $('#mm_Module_Objs').menu({
            onClick: function (item) {
                if (item.id == 'btnPrintCard_Module_Objs') {
                    this.btnPrintCard();
                }
                if (item.id == 'btnPrintList_Module_Objs') {
                    this.btnPrintList();
                }
            }.bind(this)
        });

        // Загрузка фильтра из базы для фильтрации данных
        this.LoadFilterObjs();

        // Вызов справочника в модльном режиме
        if (this.prefix == "modal_") {
            this.pOkCancel.css("visibility", "visible");
            this.wKter = $("#" + this.ModuleId);
            this.InitCloseEvents(this.wKter, false); //Инициализация закрытия формы по нажатию на клавиши "ESC"
            this.btnCancel.linkbutton({
                onClick: function () {
                    this.wKter.window("close")
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
    dgObjs_rowStyler(index, row) {
        if (row.datelikv.length > 0) {
            return "background-color: silver;";
        }
    }

    /**
     * Формирования столбцов в зависимости от фильтра (при старте)
     * @constructor
     */
    LoadDataGridFilter() {
        this.dgvColumns.push(
            {field: 'id', title: 'Id', width: 50, sortable: true, resizable: true, fixed: true},
            {field: 'objstypesname', title: 'Тип', width: 190, sortable: true, resizable: true, fixed: true},
            {field: 'name', title: 'Наименование', width: 10000, sortable: true, resizable: true},
            {
                field: 'amount', title: 'Стоимость', width: 150, align:'right', sortable: true, resizable: true, fixed: true, editor:
                    {
                        type: 'numberbox',
                        options: {
                            precision: 2
                            , decimalSeparator: '.'
                            , groupSeparator: ' '
                        }
                    },
                sorter: function (a, b) {
                    return (parseFloat(a.replace('.', ',')) > parseFloat(b.replace(' ', '')) ? 1 : -1);
                }
            },
            {field: 'datelikv', title: 'Дата_ликвидации', width: 50, hidden: true, sortable: true, resizable: true},
        );
        this.filterDgv = new LibFilter("objsDGV");
        this.filterDgv.LoadFilter(function () {
            let filterObj = this.filterDgv.GetFilterObject();
            for (let key in filterObj) {
                let dgv = {};
                let field = key.split('=');
                let name = filterObj[key].split(' = ');
                dgv.paramcode = key;
                dgv.paramname = name[1];
                dgv.reffertable = name[0];
                this.filterModelDGV.push(dgv);
                this.dgvColumns.push({
                    field: field[2] + "_t",
                    title: name[1],
                    width: 250,
                    sortable: true,
                    resizable: true,
                    fixed: true
                },);
            }
            this.dgObjs.datagrid({
                fitColumns: true,
                singleSelect: true,
                columns: [this.dgvColumns],
            });
            if (this.dgObjs.datagrid("getColumnOption", "name").width > 1000) {
                this.dgObjs.datagrid("getColumnOption", "name").width = 250;

            }
        }.bind(this));
    }

    /**
     *  Загрузка фильтра данных (при старте)
     * @constructor
     */
    LoadFilterObjs() {
        this.filter = new LibFilter("objs");
        let pagerOpt = this.dgObjsPager.pagination("options");
        let pageSize = pagerOpt.pageSize;
        let pageNumber = pagerOpt.pageNumber;
        this.filterModel.page = pageNumber;
        this.filterModel.rows = pageSize;

        this.filter.LoadFilter(function () {
            this.filterModel.accsid = this.filter.GetValue("AccsId", "");
            this.filterModel.invGrpsid = this.filter.GetValue("InvGrpsId", "");
            this.filterModel.invno = this.filter.GetValue("InvNo", "");
            this.filterModel.invser = this.filter.GetValue("InvSer", "");
            this.filterModel.objtypeid = this.filter.GetValue("ObjTypeId", "");
            this.filterModel.name = this.filter.GetValue("Name", "");
            this.filterModel.fromstrtamount = this.filter.GetValue("FromStrtAmount", "");
            this.filterModel.beforestrtamount = this.filter.GetValue("BeforeStrtAmount", "");
            this.filterModel.fondTypesid = this.filter.GetValue("FondTypesId", "");
            this.filterModel.kekrid = this.filter.GetValue("KekrId", "");
            this.filterModel.unitsid = this.filter.GetValue("UnitsId", "");
            this.filterModel.datebuyin = this.filter.GetValue("DateBuyIn", "");
            this.filterModel.datebuyby = this.filter.GetValue("DateBuyBy", "");
            this.filterModel.dateexpin = this.filter.GetValue("DateExpIn", "");
            this.filterModel.dateexpby = this.filter.GetValue("DateExpBy", "");
            this.filterModel.datelikvin = this.filter.GetValue("DateLikvIn", "");
            this.filterModel.datelikvby = this.filter.GetValue("DateLikvBy", "");
            this.filterModel.flagsuspended = this.filter.GetValue("FlagSuspended", "");
            this.filterModel.flaglikv = this.filter.GetValue("FlagLikv", "");
            this.filterModel.kterid = this.filter.GetValue("KterId", "");
            this.filterModel.wearMthdsid = this.filter.GetValue("WearMthdsId", "");
            this.filterModel.namelp = this.filter.GetValue("NameLP", "");
            this.filterModel.valuelpid = this.filter.GetValue("ValueLPId", "");
            this.filterModel.valuelpname = this.filter.GetValue("ValLP", "");
            this.filterModel.namepp = this.filter.GetValue("NamePP", "");
            this.filterModel.idpp = this.filter.GetValue("IdPP", "");
            this.filterModel.valueppid = this.filter.GetValue("ValuePPId", "");
            this.filterModel.valueppname = this.filter.GetValue("ValuePPName", "");
            this.UpdateData();
        }.bind(this));
    }

    /**
     * Обновление столбцов грида после вызовы формы
     * @constructor
     */
    LoadFilterObjsDGV() {
        this.dgvColumns = [];
        this.dgvColumns.push(
            {field: 'id', title: 'Id', width: 50, sortable: true, resizable: true, fixed: true},
            {field: 'objstypesname', title: 'Тип', width: 190, sortable: true, resizable: true, fixed: true},
            {field: 'name', title: 'Наименование', width: 10000, sortable: true, resizable: true},
            {
                field: 'amount', title: 'Стоимость', width: 150, sortable: true, resizable: true, fixed: true, editor:
                    {
                        type: 'numberbox',
                        options: {
                            precision: 5
                            , decimalSeparator: '.'
                            , groupSeparator: ' '
                        }
                    },
                sorter: function (a, b) {
                    return (parseFloat(a.replace('.', ',')) > parseFloat(b.replace(' ', '')) ? 1 : -1);
                }
            },
            {field: 'datelikv', title: 'Дата_ликвидации', width: 50, hidden: true, sortable: true, resizable: true},
        );
        for (let key in this.filterModelDGV) {
            let field = this.filterModelDGV[key].paramcode.split('=');
            this.dgvColumns.push({
                field: field[2] + "_t",
                title: this.filterModelDGV[key].paramname,
                width: 250,
                sortable: true,
                resizable: true,
                fixed: true
            },);
        }
        this.dgObjs.datagrid({
            fitColumns: true,
            singleSelect: true,
            columns: [this.dgvColumns],
        });
        if (this.dgObjs.datagrid("getColumnOption", "name").width > 1000) {
            this.dgObjs.datagrid("getColumnOption", "name").width = 250;
            //   this.LoadFilterObjs();
        }
        this.UpdateData();
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
     * Обработка окончания загрузки списка объектов
     * @param data - информация о загруженных данных
     */
    dgObjs_onLoadSuccess(data) {
        if (data.total > 0) {
            if (this.ObjsId != -1) {
                this.dgObjs.datagrid("selectRecord", this.ObjsId);
            } else {
                if (this.ObjsIndex >= 0 && this.ObjsIndex < data.total) {
                    this.dgObjs.datagrid("selectRow", this.ObjsIndex);
                } else if (data.total > 0) {
                    this.dgObjs.datagrid("selectRow", data.total - 1);
                }
            }
            this.ObjsId = -1;
            this.ObjsIndex = 0;
        }
    }

    /**
     * Обновление списка объектов
     */
    btnUpdate_onClick() {
        this.btnAdd.linkbutton({disabled: true});
        setTimeout(function () {
            this.btnAdd.linkbutton({disabled: false});
        }.bind(this), 1000);
        this.UpdateData();
    }

    /**
     * Получаем список объектов с учетом фильтра данных и фильтра столбцов
     * @constructor
     */
    UpdateData() {
        this.filter = new LibFilter("objs");
        let pagerOpt = this.dgObjsPager.pagination("options");
        let pageSize = pagerOpt.pageSize;
        let pageNumber = pagerOpt.pageNumber;
        this.filterModel.page = pageNumber;
        this.filterModel.rows = pageSize;

        this.filterMain.filterData = this.filterModel;
        this.filterMain.filterDgv = this.filterModelDGV;
        $.ajax({
            method: "post",
            data: JSON.stringify(this.filterMain),
            url: this.GetUrl("/Objs/list"),
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                this.dgObjsPager.pagination({total: data.total});
                let row = this.dgObjs.datagrid("getSelected");
                if (row != null) {
                    this.ObjsIndex = this.dgObjs.datagrid("getRowIndex", row);
                    if (this.ObjsIndex < 0) {
                        this.ObjsIndex = 0;
                    }
                }
                let t = JSON.parse(data.jstr);
                this.dgObjs.datagrid({data: t});
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        })
    }

    /**
     * Вызов формы фильтра
     */
    btnFilter_onClick() {
        let form = new ObjsFormFilter();
        form.SetResultFunc((RecId) => {
            this.filterModel = RecId;
            this.ObjsId = -1;
            this.LoadFilterObjs();
        });
        form.Show(this.filterModel);
    }

    /**
     * Вызов фильтра в котором настраиваются поля грида
     */
    btnToolsDgv_onClick() {
        let form = new ObjsFormParamFilter();
        form.SetResultFunc((RecId) => {
            this.filterModelDGV = RecId;
            this.LoadFilterObjsDGV();
        });
        form.Show(this.filterModelDGV);
    }

    /**
     * Обработка конопки "Добавить"
     */
    btnAdd_onClick() {
        this.btnAdd.linkbutton({disabled: true});
        setTimeout(function () {
            this.btnAdd.linkbutton({disabled: false});
        }.bind(this), 1000);
        let form = new ObjsFormEdit(this.DateObjs);
        form.SetResultFunc((RecId) => {
            this.ObjsId = RecId;
            this.btnUpdate_onClick();
        });
        form.Show({AddMode: true});
    }

    /**
     * Обработка изменения записи
     */
    btnChange_onClick() {
        this.btnChange.linkbutton({disabled: true});
        setTimeout(function () {
            this.btnChange.linkbutton({disabled: false});
        }.bind(this), 1000);
        if (this.dgObjs.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для изменения");
            return false;
        }
        let selData = this.dgObjs.datagrid("getSelected");
        if (selData == null) {
            this.ShowWarning("Выберите запись для изменения");
            return false;
        }
        this.sLoc.LockRecord("objs", selData.id, this.btnContinueChange_onClick.bind(this));
    }

    /**
     * Блокировка
     * @param options
     */
    btnContinueChange_onClick(options) {
        if (options.lockMessage.length != 0) {
            this.ShowSlide("Предупреждение", options.lockMessage)
            options.editMode = false;
        } else {

            if (options.editMode) {
                options.lockState = true
            }
        }
        let form = new ObjsFormEdit(this.DateObjs);
        form.SetResultFunc((RecId) => {
            this.ObjsId = RecId;
            this.btnUpdate_onClick();
        });
        form.SetCloseWindowFunction((options) => {
            if (options != null) {
                if (options.lockState) {
                    this.sLoc.FreeLockRecord("objs", options.id);
                }
            }
        });
        form.Show(options);
    }

    /**
     * Удаление заявки
     */
    btnDelete_onClick() {
        if (this.dgObjs.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для удаления");
            return false;
        }
        let selData = this.dgObjs.datagrid("getSelected");
        if (selData == null) {
            this.ShowWarning("Выберите запись для удаления");
            return false;
        }
        $.messager.confirm("Удаление", "Вы действительно хотите удалить выделенный объект?",
            function (result) {
                if (result) {
                    this.sLoc.StateLockRecord("Objs", selData.id, this.btnContinueDelete_onClick.bind(this));
                }
            }.bind(this));
    }


    /**
     * Прподолжение процесса удаления записи
     * @param options
     */
    btnContinueDelete_onClick(options) {
        if (options.data.length > 0) {
            this.ShowWarning(options.data);
        } else {
            $.ajax({
                method: "POST",
                url: this.GetUrl('/Objs/delete'),
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
     * Движение по гриду
     */
    getSelectedRow() {
        let selData = this.dgObjs.datagrid("getSelected");
        if (selData != null) {
            let date = this.dtDate.datebox("getValue");
            if (date.length == 0) {
                let today = new Date();
                let dd = String(today.getDate()).padStart(2, '0');
                let mm = String(today.getMonth() + 1).padStart(2, '0');
                let yyyy = today.getFullYear();

                date = dd + '.' + mm + '.' + yyyy;
            }
            let sub_acc = selData.invno.substr(0, 3);
            if (sub_acc != "113") {
                let jrParam = new RepParams("jrOS6",                                                  // имя отчета
                    [ // Параметры
                        {name: "Id", type: "int", value: selData.id},
                        {name: "Date", type: "String", value: date}
                    ]);
                $.ajax({
                    method: "POST",
                    data: JSON.stringify(jrParam),
                    url: this.GetUrl('/Jasper/Report'),
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                        $(this.WebDoc).html(data);
                    }.bind(this),
                    error: function (data) {
                        this.ShowErrorResponse(data.responseJSON);
                    }.bind(this)
                });
            } else if (sub_acc == "113") {
                let jrParam = new RepParams("jrInvCard",                                                  // имя отчета
                    [ // Параметры
                        {name: "objId", type: "int", value: selData.id},
                        {name: "date", type: "String", value: date}
                    ]);
                $.ajax({
                    method: "POST",
                    data: JSON.stringify(jrParam),
                    url: this.GetUrl('/Jasper/Report'),
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                        $(this.WebDoc).html(data);
                    }.bind(this),
                    error: function (data) {
                        this.ShowErrorResponse(data.responseJSON);
                    }.bind(this)
                });
            } else {
                $(this.WebDoc).html("");
            }
        }
    }

    /**
     * Разрешить/запретить ввод даты
     */
    cbCheckDate_onChange() {
        if (this.cbCheckDate.checkbox("options").checked) {
            this.dtDate.datebox({disabled: false});
        } else {
            this.dtDate.datebox({disabled: true});
            this.filterModel.date = "";
            this.DateObjs = "";
            this.btnUpdate_onClick();
        }

    }

    /**
     * Обработтка нажатия "ОК" в модальном режиме
     * @returns {boolean}
     */
    btnOk_onClick() {
        if (this.dgObjs.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для выбора");
            return false;
        }
        let selData = this.dgObjs.datagrid("getSelected");
        if (selData == null) {
            this.ShowWarning("Выберите запись");
            return false;
        }
        if (this.ResultFunc != null) {
            this.ResultFunc({id: selData.id.toString()});
        }
        this.wObjs.window("close");
        return false;
    }

    /**
     * Событие по выбору даты
     */
    dtDate_onChange() {
        this.filterModel.date = this.dtDate.datebox("getValue");
        this.DateObjs = this.dtDate.datebox("getValue");
        this.btnUpdate_onClick();
    }

    /**
     * Печать карочки объекта
     */
    btnPrintCard() {
        let selData = this.dgObjs.datagrid("getSelected");
        if (selData != null) {
            let date = this.dtDate.datebox("getValue");
            if (date.length == 0) {
                let today = new Date();
                let dd = String(today.getDate()).padStart(2, '0');
                let mm = String(today.getMonth() + 1).padStart(2, '0');
                let yyyy = today.getFullYear();

                date = dd + '.' + mm + '.' + yyyy;
            }

            let sub_acc = selData.invno.substr(0, 3);
            if (sub_acc != "113") {
                let jrParam = new RepParams("jrOS6",                                                  // имя отчета
                    [ // Параметры
                        {name: "Id", type: "int", value: selData.id},
                        {name: "Date", type: "String", value: date}
                    ]);
                $.ajax({
                    method: "POST",
                    data: JSON.stringify(jrParam),
                    url: this.GetUrl('/Jasper/Report'),
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                        let WinPrint =  window.open('','','left=50,top=50,width=800,height=640,toolbar=0,scrollbars=1,status=0');
                        WinPrint.document.write('');
                        WinPrint.document.write(data);
                        WinPrint.document.write('');
                        WinPrint.document.close();
                        WinPrint.focus();
                        WinPrint.print();
                    }.bind(this),
                    error: function (data) {
                        this.ShowErrorResponse(data.responseJSON);
                    }.bind(this)
                });
            } else if (sub_acc == "113") {
                let jrParam = new RepParams("jrInvCard",                                                  // имя отчета
                    [ // Параметры
                        {name: "objId", type: "int", value: selData.id},
                        {name: "date", type: "String", value: date}
                    ]);
                $.ajax({
                    method: "POST",
                    data: JSON.stringify(jrParam),
                    url: this.GetUrl('/Jasper/Report'),
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                        let WinPrint =  window.open('','','left=50,top=50,width=800,height=640,toolbar=0,scrollbars=1,status=0');
                        WinPrint.document.write('');
                        WinPrint.document.write(data);
                        WinPrint.document.write('');
                        WinPrint.document.close();
                        WinPrint.focus();
                        WinPrint.print();
                    }.bind(this),
                    error: function (data) {
                        this.ShowErrorResponse(data.responseJSON);
                    }.bind(this)
                });
            }
        }
    }

    /**
     * Печать списка объектаов
     */
    btnPrintList() {
        let date = this.dtDate.datebox("getValue");
        if (date.length == 0) {
            let today = new Date();
            let dd = String(today.getDate()).padStart(2, '0');
            let mm = String(today.getMonth() + 1).padStart(2, '0');
            let yyyy = today.getFullYear();
            date = dd + '.' + mm + '.' + yyyy;
        }

        let jrParam = new RepParams("jrList",                                                  // имя отчета
            [ // Параметры
                {name: "date", type: "String", value: date}
            ]);
        $.ajax({
            method: "POST",
            data: JSON.stringify(jrParam),
            url: this.GetUrl('/Jasper/Report'),
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                let newWin = window.open("about:blank", "Карточка объекта", "width=500,height=500");
                newWin.document.write(data);
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }
}

/**
 * Функция встраиваемого запуска модуля
 * @param Id идентификатор
 * @constructor
 */
export function StartNestedModul(Id) {
    let form = new Objs("nested_", "");
    form.Start(Id);
}

/**
 * Вызов модуля в диалоговом окне
 * @param StartParams стартовые параметры
 * @param ResultFunc функция, которая будет вызываться по нажатию на кнопку "ОК"
 * @constructor
 */
export function StartModalModul(StartParams, ResultFunc) {
    let id = "wObjs_Module_Objs_ObjsList";
    CreateModalWindow(id, "Объекты")
    let form = new Objs("modal_", StartParams);
    form.SetResultFunc(ResultFunc);
    form.Start(id);
}