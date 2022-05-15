import {FormView} from "../Core/FormView.js";
import {ObjsFormExplEdit} from "./ObjsFormExplEdit.js";

export class ObjsFormExplList extends FormView {

    constructor(StartParams, ObjsId) {
        super();
        this.explModelList = StartParams;
        this.ObjsId = ObjsId;
        this.ExplId = -1;
        this.ExplModel = {};
        this.RowIndex = 0;
        this.ExplId = -1;
        this.ExplIndex = -1;
        this.dgvColumns = [];
        this.flagErrorDate = false;
    }

    /**
     * Показать форму работа со соками эксплуатации
     * @param options
     * @constructor
     */
    Show(options) {
        this.options = options;
        LoadForm("#ModalWindows", this.GetUrl("/Objs/ObjsFormExplList"), this.InitFunc.bind(this));
    }

    /**
     * Инциализация интерфейса пользователя
     * @constructor
     */
    InitFunc() {
        // Настройка формы
        this.InitComponents("wObjsFormExplList_Module_Objs", "");
        this.InitCloseEvents(this.wObjsFormExplList);
        AddKeyboardNavigationForGrid(this.dgExpl);

        this.dgExpl.datagrid({
            rowStyler: this.dgExpl_rowStyler.bind(this),
            onSelect: this.btnDeleteChangeText.bind(this)
        });
        this.customDGV();
        // Получение/добавление данных
        this.LoadDataDGV();
        this.sortDGVData();
        // Кнопки для управления формой
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({
            onClick: () => {
                this.wObjsFormExplList.window("close")
            }
        });

        // Работа с записями на форме
        this.btnAdd.linkbutton({onClick: this.btnAdd_onClick.bind(this)});
        this.btnEdit.linkbutton({onClick: this.btnEdit_onClick.bind(this)});
        this.btnRemove.linkbutton({onClick: this.btnRemove_onClick.bind(this)});
    }

    sortDGVData() {
        let colIn = this.dgExpl.datagrid('getColumnOption', 'datebeg');
        colIn.sorter = ((a, b) => {
            return (this.dtFormat(a) > this.dtFormat(b) ? 1 : -1);
        }).bind(this);

        this.dgExpl.datagrid('sort', {
            sortName: 'datebeg',
            sortOrder: 'desc'
        });
    }

    customDGV() {
        this.dgvColumns.push(
            {title: 'Id', field: 'id', width: 50, sortable: true, resizable: true, fixed: true},
            {
                title: 'Дата начала эксплуатации',
                field: 'datebeg',
                width: 180,
                sortable: true,
                resizable: true,
                fixed: true,
                sorter: function (a, b) {
                    a = a.substr(6, 4) + a.substr(3, 2) + a.substr(0, 2);
                    b = b.substr(6, 4) + b.substr(3, 2) + b.substr(0, 2);
                    return (a > b ? -1 : 1);
                }
            },
            {
                title: 'Дата окончания эксплуатации',
                field: 'dateend',
                width: 185,
                sortable: true,
                resizable: true,
                fixed: true
            },
            {
                title: 'Ликвидация объекта',
                field: 'flaglikvtx',
                width: 130,
                sortable: true,
                resizable: true,
                fixed: true
            },
            {title: 'Номер акта', field: 'actnom', width: 10000, sortable: true, resizable: true, fixed: false},
            {title: 'FlagDel', field: 'del', width: 10, sortable: true, resizable: true, fixed: false, hidden: true},
            {
                title: 'FlagChange',
                field: 'change',
                width: 10,
                sortable: true,
                resizable: true,
                fixed: false,
                hidden: true
            },
            {title: 'FlagNew', field: 'new', width: 10, sortable: true, resizable: true, fixed: false, hidden: true},
            {title: 'Index', field: 'indexrow', width: 15, fixed: true, hidden: true},
            {title: 'dBBase', field: 'datebegbase', width: 20, fixed: true, hidden: true},
            {title: 'dEBase', field: 'dateendbase', width: 20, fixed: true, hidden: true},
            {title: 'FlagError', field: 'error', width: 25, fixed: true, hidden: true},
            {title: 'outInfo', field: 'out_info', width: 20, fixed: true, hidden: true},
        );
        this.dgExpl.datagrid({
            fitColumns: true,
            singleSelect: true,
            columns: [this.dgvColumns]
        });
    }

    /**
     * Изменяем название на кнопке "Удаление"
     */
    btnDeleteChangeText() {
        if (this.dgExpl.datagrid("getRows").length != 0) {
            let selData = this.dgExpl.datagrid("getSelected");
            if (selData != null) {
                if (selData.del == 1) {
                    this.btnRemove.linkbutton({iconCls: "icon-undo", text: "Вернуть"});
                } else {
                    this.btnRemove.linkbutton({iconCls: "icon-remove", text: "Удалить"});
                }
            } else {
                this.btnRemove.linkbutton({iconCls: "icon-remove", text: "Удалить"});
            }
        } else {
            this.btnRemove.linkbutton({iconCls: "icon-remove", text: "Удалить"});
        }
    }

    /**
     * Подсвечиваем удаленную запись
     * @param index
     * @param row
     * @returns {string}
     */
    dgExpl_rowStyler(index, row) {
        if (row.del == 1) {
            return "background-color:gray;";
        }
        if (row.error == 1) {
            return "background-color:LightCoral;";
        } else if (row.error == 2) {
            return "background-color:PowderBlue;";
        }
    }

    /**
     * Добавляем данные в грид
     * @constructor
     */
    LoadDataDGV() {
        if (this.explModelList.length > 0) {
            let dg = [];
            this.explModelList.forEach((i) => {
                if (i.del != 1) {
                    i.new = 0;
                    i.error = 0;
                    dg.push(Object.assign({}, i));
                }
            });
            this.dgExpl.datagrid({data: dg});
        }
    }

    /**
     * Закрытие формы
     */
    btnOk_onClick() {
        // Проверки на пересечение дат
        let rows = this.dgExpl.datagrid('getRows');
        let checkRow = [];
        for (let i = 0; i < rows.length; i++) {
            let dateEnd = rows[i].dateend;
            if (dateEnd == null || dateEnd == "" || dateEnd == undefined) {
                dateEnd = '31.12.2100';
            }
            checkRow.push({
                id: rows[i].id,
                datebeg: rows[i].datebeg,
                dateend: dateEnd,
                del: rows[i].del,
                datebegnorm: rows[i].datebeg,
                dateendnorm: rows[i].dateend
            });
        }

        if (rows.filter(gh => gh.dateend != "" && gh.flaglikv == 1 && gh.del == 0).length > 0) {
            let likvData = this.dtFormat(rows.filter(gh => gh.dateend != "" && gh.flaglikv == 1 && gh.del == 0)[0].dateend);
            if(rows.filter(g => (this.dtFormat(g.datebeg) > likvData || this.dtFormat(g.datebeg) == likvData) && g.del==0).length > 0)
            {
                this.ShowError("После ликвидации объекта его нельзя вводить в эксплуатацию");
                return false;
            }
        }


        // Проверка на пересечение сроков
        for (let i = 0; i < checkRow.length; ++i) {
            for (let j = 0; j < checkRow.length; ++j) {
                if (checkRow[i] == checkRow[j]) {
                    continue;
                }
                if (checkRow[i].del == 1 || checkRow[j].del == 1) {
                    continue;
                }

                let timeDateBegI = this.dtFormat(checkRow[i].datebeg);
                let timeDateEndI = this.dtFormat(checkRow[i].dateend);
                let timeDateBegJ = this.dtFormat(checkRow[j].datebeg);
                let timeDateEndJ = this.dtFormat(checkRow[j].dateend);

                let dateEndTextJ = checkRow[j].dateendnorm;
                if (checkRow[j].dateendnorm == "null" || checkRow[j].dateendnorm == "" || checkRow[j].dateendnorm == undefined) {
                    dateEndTextJ = "'Не указана'";
                }
                let dateEndTextI = checkRow[i].dateendnorm;
                if (checkRow[i].dateendnorm == null || checkRow[i].dateendnorm == "" || checkRow[i].dateendnorm == undefined) {
                    dateEndTextI = "'Не указана'";
                }

                if ((timeDateBegI >= timeDateBegJ && timeDateBegI <= timeDateEndJ) || (timeDateEndI >= timeDateBegJ && timeDateEndI <= timeDateEndJ)) {
                    this.ShowError('Запись имеющая дату начала эксплуатации: ' + checkRow[j].datebegnorm + ' и дату окончания эксплуатации: ' + dateEndTextJ +
                        ' попадает в пересечение с запиьсю которая имеет дату начала эксплуатации: ' + checkRow[i].datebegnorm + ' и дату окончания эксплуатации: ' + dateEndTextI);
                    this.dgExpl.datagrid("updateRow", {
                        index: i,
                        row: {error: 1}
                    });
                    this.dgExpl.datagrid("updateRow", {
                        index: j,
                        row: {error: 2}
                    });
                    return false;
                }
            }
        }
        if(rows.filter(gh => gh.flaglikv == 1 && gh.del == 0).length > 1){
            this.ShowError("Ликвидировать объект можно только один раз");
            return false;
        }


        let dataDGV = this.dgExpl.datagrid("getRows");
        let dg = dataDGV.filter((i) => i.change == 1);
        let newDg = dg.filter((i) => i.new == 1 && i.del == 0);  // вновь вставленные (таких в ExplModelList нет)
        let chngDg = dg.filter((i) => i.new == 0);              // удаленные и измененные - их нужно обновить в explModelList

        if(this.ObjsId == "-1"){
            this.explModelList = [];
        }
        // добавляем новые
        newDg.forEach((i) => this.explModelList.push({
            id: i.id,
            datebeg: i.datebeg,
            dateend: i.dateend,
            actnom: i.actnom,
            flaglikvtx: i.flaglikvtx,
            flaglikv: i.flaglikv,
            del: i.del,
            change: i.change,
            error: i.error,
            out_info: i.out_info
        }));

        // обновляем существующие
        chngDg.forEach((i) => this.explModelList[this.explModelList.findIndex(el => el.datebeg == i.datebeg && el.del == 0)] = {
            id: i.id,
            datebeg: i.datebeg,
            dateend: i.dateend,
            actnom: i.actnom,
            flaglikvtx: i.flaglikvtx,
            flaglikv: i.flaglikv,
            del: i.del,
            change: i.change,
            error: i.error,
            out_info: i.out_info
        });
        this.ResultFunc(this.explModelList);
        this.wObjsFormExplList.window("close");
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
     * Добавление новой записи
     */
    btnAdd_onClick() {
        let ListData = this.dgExpl.datagrid("getRows");
        let form = new ObjsFormExplEdit("", ListData);
        form.SetResultFunc((ExplModel, options) => {
            this.ExplModel = ExplModel;
            this.AddModuleData(options);
        });
        form.Show({AddMode: true, rowIndex: -1});
    }


    /**
     * Редактирование/просмотр существующей записи
     */
    btnEdit_onClick() {
        if (this.dgExpl.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для изменения");
            return false;
        }
        let selData = this.dgExpl.datagrid("getSelected");
        if (selData == null) {
            this.ShowWarning("Выберите запись для изменения");
            return false;
        }
        if(selData.del == 1){
            this.ShowError("Редактирование удаленных записей запрещено");
            return false;
        }
        let ListData = this.dgExpl.datagrid("getRows");
        let selections = this.dgExpl.datagrid('getSelected');
        let index = this.dgExpl.datagrid('getRowIndex', selections);
        let form = new ObjsFormExplEdit(selections, ListData);
        form.SetResultFunc((ExplModel, options) => {
            this.ExplModel = ExplModel;
            this.AddModuleData(options);
        });
        form.Show({AddMode: false, rowIndex: index});
    }

    /**
     * Удаление записи
     */
    btnRemove_onClick() {
        if (this.dgExpl.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записи для удаления");
            return false;
        }
        let selections = this.dgExpl.datagrid('getSelected');
        let row_index = this.dgExpl.datagrid('getRowIndex', selections);
        if (selections.del == 0) {
            this.dgExpl.datagrid('updateRow', {
                index: row_index,
                row: {
                    change: 1,
                    del: 1
                }
            });
            this.dgExpl.datagrid('refreshRow', row_index);
        } else {
            let rows = this.dgExpl.datagrid("getRows");
            for(let i =0; i< rows.length; ++i){
                if(rows[i].del == 1 || i == row_index){continue;}
                if(rows[i].datebeg == selections.datebeg){
                    this.ShowError("Вы пытаетесь восстановить запись с датой " + rows[i].datebeg + " , но запись с такой датой существует");
                    return  false;
                }
            }
            this.dgExpl.datagrid('updateRow', {
                index: row_index,
                row: {
                    change: 1,
                    del: 0
                }
            });
            this.dgExpl.datagrid('refreshRow', row_index);
        }
        this.dgvFlagError();
        this.btnDeleteChangeText();
    }

    /**
     * Добавление в список dg вновь добалвенных данных
     * @constructor
     */
    AddModuleData(options) {
        this.dgvFlagError();
        let dgSelected = this.dgExpl.datagrid("getSelected");
        let index = -1;
        if (dgSelected != null) {
            index = this.dgExpl.datagrid("getRowIndex", dgSelected);
        }
        if (options.AddMode == true) {
            this.dgExpl.datagrid("appendRow", {
                id: this.ExplModel.id,
                actnom: this.ExplModel.actnom,
                datebeg: this.ExplModel.datebeg,
                dateend: this.ExplModel.dateend,
                flaglikvtx: this.ExplModel.flaglikvtx,
                flaglikv: this.ExplModel.flaglikv,
                new: this.ExplModel.new,
                change: this.ExplModel.change,
                del: this.ExplModel.del,
                error: this.ExplModel.error,
                out_info: this.ExplModel.out_info
            });
        } else {
            this.dgExpl.datagrid("updateRow", {
                index: index,
                row: {
                    id: this.ExplModel.id,
                    actnom: this.ExplModel.actnom,
                    datebeg: this.ExplModel.datebeg,
                    dateend: this.ExplModel.dateend,
                    flaglikvtx: this.ExplModel.flaglikvtx,
                    flaglikv: this.ExplModel.flaglikv,
                    new: this.ExplModel.new,
                    change: this.ExplModel.change,
                    del: this.ExplModel.del,
                    error: this.ExplModel.error,
                    out_info: this.ExplModel.out_info
                }
            });
            this.dgExpl.datagrid("refreshRow", index);
        }
        let row = this.dgExpl.datagrid('getRows');
        for(let i = 0; i< row.length; ++i){
            if(row[i].datebeg == this.ExplModel.datebeg && row[i].del == 0){
                this.dgExpl.datagrid("selectRow", i);
                break;
            }
        }
        this.dgExpl.datagrid('sort', {
            sortName: 'datebeg',
            sortOrder: 'desc'
        });
    }

    /**
     * Убераем все ошибки в гриде
     */
    dgvFlagError() {
        let dgv = this.dgExpl.datagrid("getRows");
        for (let i = 0; i < dgv.length; ++i) {
            this.dgExpl.datagrid("updateRow", {
                index: i,
                row: {

                    error: 0
                }
            });
        }
    }
}