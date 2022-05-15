import {FormView} from "../Core/FormView.js";
import {SttsOrderTransfer} from "./SttsOrderTransfer.js";


/**
 * Основной класс модуля
 */
class SttsOrder extends FormView {
    /**
     * Конструктор
     * @param prefix - приставка для идентификаторов. Данная приставка добавится для каждого идентификатора
     * @param StartParams - стартовые параметры в формате JSON
     */
    constructor(prefix, StartParams) {
        super();

        this.paramId = -1;
        this.paramIndex = 0;
        this.prefix = prefix;
        this.StartParams = StartParams;

        this.editMode = false;

        this.groupId = '';
        this.orderTypeId = '';

        this.editIndex = -1;
        this.field = "id";
    }

    /**
     * Функция загрузки формы
     * @param id - идентификатор эелемента HTML, в который будет загружена разметка частичного представления
     * @constructor
     */
    Start(id) {
        this.ModuleId = id;
        LoadForm("#" + this.ModuleId, this.GetUrl("/SttsOrder/SttsOrderFormList?prefix=" + this.prefix), this.InitFunc.bind(this));
    }

    /**
     * Функция инициализации пользовательского интерфейса
     * @constructor
     */
    InitFunc() {
        this.InitComponents(this.ModuleId, this.prefix);

        AddKeyboardNavigationForGrid(this.dgSttsOrder);

        this.dgSttsOrder.datagrid({
            loadFilter: this.LoadFilter.bind(this),
            onLoadError: (data) => {
                this.ShowErrorResponse(data.responseJSON);
            },

            onLoadSuccess: this.dgSttsOrder_onLoadSuccess.bind(this)
        });

        this.LoadRights();

        this.btnUpdate.linkbutton({onClick: this.btnUpdate_onClick.bind(this)});
        this.btnTransfer.linkbutton({onClick: this.btnTransfer_onClick.bind(this)});

        this.cbGroups.combobox({editable: false, onSelect: this.cbGroups_onSelect.bind(this)});
        this.cbOrdertypes.combobox({editable: false, onSelect: this.cbOrdertypes_onSelect.bind(this)});

        this.LoadGroups();
        this.LoadOrderTypes();

        this.btnUpdate_onClick();

        this.fillDg();
    }

    /*
    * Создание и заполнение грида
    * */
    fillDg() {
        let sttsList = [{id: 'ПУСТО', stts: 'ПУСТО'},
            {id: 'В-НД', stts: 'В-НД'},
            {id: 'В-Д', stts: 'В-Д'}];

        let _data = this.GetElement("dgSttsOrder_Module_SttsOrder");
        let dEditorIndex = this.GetElement("dEditorIndex_Module_SttsOrder");

        let changedFields = [];

        let _this = this;
        let row;

        let updateStts = function (row) {
            return this.saveStts(row, this);
        }.bind(this)

        $(_data).datagrid({
            fitColumns: true,
            singleSelect: true,
            columns: [[
                {field: 'id', title: 'id', width: 35, fixed: true, sortable: true},
                {field: 'code', title: 'Код', width: 50, fixed: true, sortable: true},
                {field: 'name', title: 'Название поля', width: 1000, sortable: true},

                {
                    field: 'newStts', title: 'Новая', width: 100, fixed: true,
                    editor: {
                        type: 'combobox',
                        options: {
                            editable: false,
                            valueField: 'id',
                            textField: 'stts',
                            data: sttsList,
                            onClick: async function (value) {
                                _this.editIndex = dEditorIndex.html();
                                row = $(_data).datagrid('getRows')[_this.editIndex];

                                let ed = $(_data).datagrid('getEditor', {
                                    index: this.editIndex,
                                    field: 'newStts'
                                });

                                $(_data).datagrid("updateRow", {index: _this.editIndex, row: row});
                                row.newStts = value.stts;
                                await updateStts(row);
                            }
                        }
                    },
                    formatter: function (value, row, index) {
                        return row.newStts == "ПУСТО" ? "&nbsp;" : row.newStts
                    }
                },
                {
                    field: 'inProgressStts', title: 'В работе', width: 100, fixed: true,
                    editor: {
                        type: 'combobox',
                        options: {
                            editable: false,
                            valueField: 'id',
                            textField: 'stts',
                            data: sttsList,
                            onClick: async function (value) {
                                _this.editIndex = dEditorIndex.html();
                                row = $(_data).datagrid('getRows')[_this.editIndex];

                                let ed = $(_data).datagrid('getEditor', {
                                    index: this.editIndex,
                                    field: 'inProgressStts'
                                });

                                $(_data).datagrid("updateRow", {index: _this.editIndex, row: row});
                                row.inProgressStts = value.stts;
                                await updateStts(row);
                            }
                        }
                    },
                    formatter: function (value, row, index) {
                        return row.inProgressStts == "ПУСТО" ? "&nbsp;" : row.inProgressStts
                    }
                },
                {
                    field: 'pauseStts', title: 'Приостановлена', width: 107, fixed: true,
                    editor: {
                        type: 'combobox',
                        options: {
                            editable: false,
                            valueField: 'id',
                            textField: 'stts',
                            data: sttsList,
                            onClick: async function (value) {
                                _this.editIndex = dEditorIndex.html();
                                row = $(_data).datagrid('getRows')[_this.editIndex];

                                let ed = $(_data).datagrid('getEditor', {
                                    index: this.editIndex,
                                    field: 'pauseStts'
                                });

                                $(_data).datagrid("updateRow", {index: _this.editIndex, row: row});
                                row.pauseStts = value.stts;
                                await updateStts(row);
                            }
                        }
                    },
                    formatter: function (value, row, index) {
                        return row.pauseStts == "ПУСТО" ? "&nbsp;" : row.pauseStts
                    }
                },
                {
                    field: 'rejectedStts', title: 'Отклонена', width: 107, fixed: true,
                    editor: {
                        type: 'combobox',
                        options: {
                            editable: false,
                            valueField: 'id',
                            textField: 'stts',
                            data: sttsList,
                            onClick: async function (value) {
                                _this.editIndex = dEditorIndex.html();
                                row = $(_data).datagrid('getRows')[_this.editIndex];

                                let ed = $(_data).datagrid('getEditor', {
                                    index: this.editIndex,
                                    field: 'rejectedStts'
                                });

                                $(_data).datagrid("updateRow", {index: _this.editIndex, row: row});
                                row.rejectedStts = value.stts;
                                await updateStts(row);
                            }
                        }
                    },
                    formatter: function (value, row, index) {
                        return row.rejectedStts == "ПУСТО" ? "&nbsp;" : row.rejectedStts
                    }
                },
                {
                    field: 'doneStts', title: 'Исполнена', width: 100, fixed: true,
                    editor: {
                        type: 'combobox',
                        options: {
                            editable: false,
                            valueField: 'id',
                            textField: 'stts',
                            data: sttsList,
                            onClick: async function (value) {
                                _this.editIndex = dEditorIndex.html();
                                row = $(_data).datagrid('getRows')[_this.editIndex];

                                let ed = $(_data).datagrid('getEditor', {
                                    index: this.editIndex,
                                    field: 'doneStts'
                                });

                                $(_data).datagrid("updateRow", {index: _this.editIndex, row: row});
                                row.doneStts = value.stts;
                                await updateStts(row);
                            }
                        }
                    },
                    formatter: function (value, row, index) {
                        return row.doneStts == "ПУСТО" ? "&nbsp;" : row.doneStts
                    }
                }

            ]],
            onClickCell: function (index, field) {
                let editIndex = this.dEditorIndex.html();
                this.dgSttsOrder.datagrid('selectRow', index).datagrid('endEdit', editIndex);

                this.dEditorIndex.html(index);
                this.field = field;
                changedFields.push(field);
                if (field != "id" && field != "name") {
                    this.dgSttsOrder.datagrid('selectRow', index).datagrid('beginEdit', index);
                }
            }.bind(this),
            onEndEdit: function (index, row) {
                let item = sttsList.findIndex(i => i.id === row.id);
                sttsList[item] = row;

                row.groupId = (this.groupId.split("=")[0]);
                row.orderTypeId = (this.orderTypeId.split("=")[0]);
            }.bind(this)
        });
    }

    /**
     * Обработка окончания загрузки списка
     * @param data - информация о загруженных данных
     */
    dgSttsOrder_onLoadSuccess(data) {
        if (data.total > 0) {
            if (this.paramId != -1) {
                this.dgSttsOrder.datagrid("selectRecord", this.paramId);
            } else {
                if (this.paramIndex >= 0 && this.paramIndex < data.total) {
                    this.dgSttsOrder.datagrid("selectRow", this.paramIndex);
                } else if (data.total > 0) {
                    this.dgSttsOrder.datagrid("selectRow", data.total - 1);
                }
            }

            let editIndex = this.dEditorIndex.html();

            if (this.field != "id" && this.field != "name") {
                this.dgSttsOrder.datagrid('selectRow', editIndex).datagrid('beginEdit', editIndex);
            }

            this.paramId = -1;
            this.paramIndex = 0;
        }
    }

    /**
     * Обновление грида
     */
    btnUpdate_onClick() {
        let row = this.dgSttsOrder.datagrid("getSelected");
        if (row != null) {
            this.paramIndex = this.dgSttsOrder.datagrid("getRowIndex", row);
            if (this.paramIndex < 0) {
                this.paramIndex = 0;
            }
        }

        let grId = -1;
        let otId = -1;

        if (!!this.groupId) {
            grId = (this.groupId.split("=")[0]);
        }
        if (!!this.orderTypeId) {
            otId = (this.orderTypeId.split("=")[0]);
        }

        this.dgSttsOrder.datagrid({url: this.GetUrl("/SttsOrder/list?groupId=" + grId + "&orderTypeId=" + otId)});
    }

    /*
    * Кнопка переноса статусов
    * */
    btnTransfer_onClick() {
        let form = new SttsOrderTransfer();

        let opt = {
            orderTypeFrom: {
                id: (this.orderTypeId.split("=")[0]),
                fullName: this.cbOrdertypes.combobox("getText"),
            },
            groupFrom: {
                id: (this.groupId.split("=")[0]),
                fullName: this.cbGroups.combobox("getText"),
            }
        }
        form.Show(opt);
    }

    /**
     * Проверка прав
     */
    LoadRights() {
        $.ajax({
            method: "get",
            url: this.GetUrl('/CoreUtils/GetActRights?TaskCode=SttsOrder.dll&ActCode=SttsOrderChange'),
            success: function (data) {
                if (data.length == 0) {
                    this.editMode = true;
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }


    /**
     * Функция загрузки групп для фильтра
     * @constructor
     */
    LoadGroups() {
        $.ajax({
            method: "get",
            url: this.GetUrl('/SttsOrder/groupsList'),
            success: function (data) {
                this.cbGroups.combobox({
                    valueField: 'id',
                    textField: 'name',
                    data: data
                });

                for (let i = 0; i < data.length; i++) {
                    let tc = data[i].name;
                    this.cbGroups.combobox("setValue", data[0].name);
                    this.groupId = data[0].name;
                }
                this.btnUpdate_onClick();
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Функция загрузки типов заявки для фильтра
     * @constructor
     */
    LoadOrderTypes() {
        $.ajax({
            method: "get",
            url: this.GetUrl('/SttsOrder/orderTypesList'),
            success: function (data) {
                this.cbOrdertypes.combobox({
                    valueField: 'id',
                    textField: 'name',
                    data: data
                });

                for (let i = 0; i < data.length; i++) {
                    let tc = data[i].name;
                    this.cbOrdertypes.combobox("setValue", data[0].name);
                    this.orderTypeId = data[0].name;
                }
                this.btnUpdate_onClick();
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Обработка события выбора кода в фильтре по группе
     * @param record
     */
    cbGroups_onSelect(record) {
        this.groupId = record.name;
        this.btnUpdate_onClick();
    }

    /**
     * Обработка события выбора кода в фильтре по типу заявки
     * @param record
     */
    cbOrdertypes_onSelect(record) {
        this.orderTypeId = record.name;
        this.btnUpdate_onClick();
    }

    /*
    * Сохранение статусов для указанной группы и типа заявки
    * */
    saveStts(row, _this) {
        row.groupId = (this.groupId.split("=")[0]);
        row.orderTypeId = (this.orderTypeId.split("=")[0]);

        return new Promise((resolve, reject) => {
            $.ajax({
                method: "POST",
                data: JSON.stringify(row),
                url: _this.GetUrl('/SttsOrder/save'),
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    _this.btnUpdate_onClick();
                    _this.changedFields = [];

                    resolve(true);
                },
                error: function (data) {
                    _this.ShowErrorResponse(data.responseJSON);
                }
            });
        })
    }
}

/**
 * Функция встраиваемого запуска модуля
 * @param Id идентификатор
 * @constructor
 */
export function StartNestedModul(Id) {
    let form = new SttsOrder("nested_", "");
    form.Start(Id);
}

