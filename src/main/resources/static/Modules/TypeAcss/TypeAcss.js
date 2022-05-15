import {FormView} from "../Core/FormView.js";
import {TypeAcssFormEdit} from "./TypeAcssFormEdit.js";

class TypeAcss extends FormView {
    constructor(prefix) {
        super();
        this.TypeAcssId = -1;//Для последней добавленной/изменной записи
        this.TypeAcssIndex = 0;//Позиция курсора
        this.prefix = prefix;
        this.options = {AddMode: true, editMode: false};
        this.sLoc = new LibLockService(300000);
    }

    Start(id) {
        this.ModuleId = id;
        LoadForm("#" + this.ModuleId, this.GetUrl("/TypeAcss/TypeAcssList?prefix=" + this.prefix), this.InitFunc.bind(this));
    }

    InitFunc() {
        this.InitComponents(this.ModuleId, this.prefix);//id - элементам
        //dataGrid
        AddKeyboardNavigationForGrid(this.dgTypeAcss);
        this.dgTypeAcss.datagrid({
            loadFilter: this.LoadFilter.bind(this),
            onLoadError: data => {
                this.ShowErrorResponse(data.responseJSON);
            },
            onLoadSuccess: this.dgTypeAcss_onLoadSuccess.bind(this),
        });
        this.btnAdd.linkbutton({onClick: this.btnAdd_onClick.bind(this)});
        this.btnChange.linkbutton({onClick: this.btnChange_onClick.bind(this)});
        this.btnDelete.linkbutton({onClick: this.btnDelete_onClick.bind(this)});
        this.btnUpdate.linkbutton({onClick: this.LoadDataGrd.bind(this)});
        this.txFilter.textbox({onChange: this.LoadDataGrd.bind(this)});
        this.cbCodeTypeAcssAll.combobox({
            loader: (param, success, error) => {
                $.ajax({
                    url: this.GetUrl('/TypeAcss/LoadGroup'),
                    success: dt => success(dt),
                    error: er => error($.messager(JSON.stringify(er)))
                })
            },
            valueField: 'id',
            textField: 'idName',
            onLoadSuccess: () => {
                /*  if((this.options.editMode || (!this.options.editMode && !this.options.AddMode))  && data2[0].length>0)
                      if(this.options.obj_type_id>0)
                          this.cbNameTypeAcss.combobox('select', this.options.obj_type_id)
                      else//Все объекты*/
                //this.cbNameTypeAcss.combobox('select', -1)
            }
        });
        this.btnCodeAll.linkbutton({onClick: this.btnCodeAll_onClick.bind(this)});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({
            onClick: function () {
                return this.wPeriodEditList.window("close");
            }.bind(this)
        });

        if (this.prefix == "modal_") {
            this.pOkCancel.css("visibility", "visible");
            this.wTypeAcss = $("#" + this.ModuleId);
            this.InitCloseEvents(this.wTypeAcss, false);
            this.btnCancel.linkbutton({
                onClick: function () {
                    this.wTypeAcss.window('close')
                }.bind(this)
            });
            this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        }

        $.when(this.LoadRight("TypeAcssView"))
            .done(data => {
                if (data.length == 0) return this.LoadDataGrd();
                else return this.ShowWarning(JSON.stringify(data));
            });
    }

    /**
     * Проверка прав
     * @param NameRight
     * @returns {*}
     * @constructor
     */
    LoadRight(NameRight) {
        return $.get({
            url: this.GetUrl('/CoreUtils/GetActRights?TaskCode=TypeAcss.dll&ActCode=' + NameRight),
            success: function (data) {
                if (data.length == 0) {
                    this.btnAdd.linkbutton({disabled: false});
                    this.btnChange.linkbutton({disabled: false});
                    this.btnDelete.linkbutton({disabled: false});
                    this.btnOk.linkbutton({disabled: false});
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Загрузка данных в датагрид
     * @returns {*|jQuery}
     * @constructor
     */
    LoadDataGrd() {
        let row = this.dgTypeAcss.datagrid("getSelected");
        if (row != null) {
            this.TypeAcssIndex = this.dgTypeAcss.datagrid("getRowIndex", row);
            if (this.TypeAcssIndex < 0)
                this.TypeAcssIndex = 0;
        }
        //let showDel =  this.cbShowDel.checkbox("options").checked?"true":"false";
        let filter = this.txFilter.textbox("getText");//Получаем значение фильтра по коду
        filter = encodeURIComponent(filter);//Кодируем значение фильтра в часть url-а
        return this.dgTypeAcss.datagrid({url: this.GetUrl('/TypeAcss/list?filter=' + filter)});
    }

    /**
     * Обработка окончания загрузки списка кодов
     * территорий
     * @param data
     */
    dgTypeAcss_onLoadSuccess(data) {
        //console.log(" dgTypeAcss_onLoadSuccess, data = ", data)
        if (data.total > 0) {
            if (this.TypeAcssId != -1)//ставим курсор на запись
                this.dgTypeAcss.datagrid("selectRecord", this.TypeAcssId);
            else if (this.TypeAcssId > -1 && this.TypeAcssId < data.total)
                this.dgTypeAcss.datagrid("selectRecord", this.TypeAcssIndex);
            else if (this.total > 0)
                this.dgTypeAcss.datagrid("selectRecord", data.total - 1);

            this.TypeAcssId = -1;
            this.TypeAcssIndex = 0;
        }
    }

    /**
     * Обработка выбора записи
     * @returns {boolean|jQuery}
     */
    btnOk_onClick() {
        if (this.dgTypeAcss.datagrid("getRows").length == 0) return this.ShowWarning("Нет записей для выбора");
        let slDt = this.dgTypeAcss.datagrid("getSelected");
        if (slDt == null) return this.ShowWarning("Выберите запись");
        if (this.ResultFunc != null) this.ResultFunc({id: slDt.id.toString()});
        return this.wTypeAcss.window("close");
    }


    btnAdd_onClick() {
        $.when(this.LoadRight('TypeAcssChange'))
            .done(data => {
                if (data.length == 0) {
                    let frm = new TypeAcssFormEdit();
                    frm.Show({AddMode: true, editMode: false, text: 'Добавление записи'});
                    frm.SetResultFunc(options => {
                        this.LoadDataGrd();
                    });
                } else this.ShowWarning(JSON.stringify(data));
            });
    }

    /**
     * Изменить запись
     */
    btnChange_onClick() {
        if (this.dgTypeAcss.datagrid("getRows").length == 0) return this.ShowWarning("Нет записей для изменения");
        let selData = this.dgTypeAcss.datagrid("getSelected");
        console.log(" selData = ", selData)
        if (selData == null) return this.ShowWarning("Выберите запись для изменения");
        $.when(this.LoadRight('TypeAcssChange'))
            .done(data => {
                    if (data.length == 0) {
                        this.sLoc.LockRecord("type_acss", selData.id, this.btnContinueChange_onClick.bind(this));
                    } else {
                        this.ShowSlide('Предупреждение', data);
                        this.btnContinueChange_onClick({
                            id: selData.id,
                            AddMode: false,
                            editMode: false,
                            lockMessage: '',
                            lockState: false
                        });
                    }
                }
            )
    }

    /**
     * Продолжкние изменение записи
     * @param options
     */
    btnContinueChange_onClick(options) {
        //console.log(" btnContinueChange_onClick, options = ", options)
        if (options.lockMessage.length != 0) {
            this.ShowSlide('Предупреждение', options.lockMessage);
            options.editMode = false;
        } else if (options.editMode)
            options.lockState = true;

        let form = new TypeAcssFormEdit();
        form.SetResultFunc(RecId => {
            this.TypeAcssId = RecId;
            this.LoadDataGrd();
        });
        form.SetCloseWindowFunction(options => {
            if (options != null)
                if (options.lockState)
                    this.sLoc.FreeLockRecord("type_acss", options.id);
        });
        let selections = this.dgTypeAcss.datagrid('getSelections');
        options.group_id = selections[0].group_id;
        options.obj_type_id = selections[0].obj_type_id;
        form.Show(options);
    }


    /**
     * Удаление записи
     * @returns {number}
     */
    btnDelete_onClick() {
        console.log("btnDelete_onClick");
        if (this.dgTypeAcss.datagrid("getRows").length == 0) return this.ShowWarning("Нет записей для удаления");
        let selData = this.dgTypeAcss.datagrid("getSelected");
        if (selData == null) return this.ShowWarning("Выберите запись для удаления");
        //let del = selData.del;
        $.messager.confirm("Удаление", "Вы действительно хотите удалить строку \"Код\"  " + selData.nameGroup + "  \"Наименование\" " + selData.nameTypeObject + "?",
            function (result) {
                console.log(" result = ", result);
                if (result) {
                    this.sLoc.StateLockRecord("type_acss", selData.id, this.btnContinueDelete_onClick.bind(this));
                }
            }.bind(this));
    }

    btnContinueDelete_onClick(options) {
        //console.log(" btnContinueDelete_onClick , options = ", options);
        if (options.data.length > 0) {
            this.ShowWarning(options.data);
        } else {
            $.ajax({
                method: "POST",
                url: this.GetUrl('/TypeAcss/delete'),
                data: {id: options.id},
                success: function (data) {
                    if (data.length) {
                        this.ShowWarning(data);
                    } else {
                        this.LoadDataGrd();
                    }
                }.bind(this),
                error: function (data) {
                    this.ShowErrorResponse(data.responseJSON);
                }.bind(this)
            });
        }

    }

    /**
     * Обновление грида
     */
    btnUpdate_onClick() {
        return 0;
    }

    /**
     * Добавить доступ ко всем типам объектов для выбранной группы
     */
    btnCodeAll_onClick() {
        //console.log(" btnCodeAll_onClick  ");
        let group = this.cbCodeTypeAcssAll.combobox("getValue");
        if (group.length > 0) {
            $.when(this.LoadRight('TypeAcssChange'))
                .done(data => {
                    if (data.length == 0) {
                        let txGr = this.cbCodeTypeAcssAll.combobox("getText").split('=')[1];
                        $.messager.confirm("Добавление доступа", "Вы действительно хотите добавить доступ ко всем типам объектам для группы <strong>"+txGr+'</strong> ?',
                            function (result) {
                                if (result) {
                                    $.ajax({
                                        url: this.GetUrl('/TypeAcss/AddAllObj?group=' + group),
                                        dataType: 'text',
                                        mimeType: 'text/html',
                                        success: function (data) {
                                            this.LoadDataGrd();
                                        }.bind(this),
                                        error: function (data) {
                                            let inf = JSON.parse(data.responseText);
                                            this.ShowError("Ошибка: " + inf.error + '. ' + inf.message);
                                        }.bind(this)
                                    });
                            }
                            }.bind(this))
                    } else
                        this.ShowWarning(JSON.stringify(data));
                });
        } else {
            this.ShowWarning("Выберете наименование группы пользователей ! ")
        }
    }
}
    /**
     * Функция встраиваемого запуска модуля
     * @param Id
     * @constructor
     */
export function StartNestedModul(Id) {
        let form = new TypeAcss("nested_", {});
        form.Start(Id);
}


/**
 * Вызов модуля в диалоговом окне
 * @param ResultFunc - функция которая вызываеться при нажатии на OK
 * @constructor
 */
export function StartModalModul({}, ResultFunc) {
    let id = "wTypeAcss_Module_TypeAcss_TypeAcssList";
    CreateModalWindow(id, "Справочник доступа к объектам в зависимости от их типов")
    let form = new TypeAcss("modal_", {});
    form.SetResultFunc(ResultFunc);ResultFunc
    form.Start(id);
}