import {FormView} from "../Core/FormView.js";
import {LocationsFilterForm} from "./LocationsFilterForm.js";
import {LocationsFormEdit} from "./LocationsFormEdit.js";

class Locations extends FormView {

    constructor(prefix, StartParams) {
        super();
        this.LocationsId = -1;
        this.LocationsIndex = 0;
        this.FilterDepId = -1;
        this.FilterKterId = -1;
        this.FilterDel = 'false';
        this.prefix = prefix;
        this.StartParams = StartParams;
        this.sLoc = new LibLockService(300000);
        this.editMode = false;
    }

    Start(id) {
        this.ModuleId = id;
        LoadForm("#" + this.ModuleId, this.GetUrl("/Locations/LocationsFormList?prefix=" + this.prefix), this.InitFunc.bind(this));
    }

    InitFunc() {
        this.InitComponents(this.ModuleId, this.prefix);
        AddKeyboardNavigationForGrid(this.dgLocations);
        this.btnAdd.linkbutton({disabled: true});
        this.btnDelete.linkbutton({disabled: true});
        this.dgLocations.datagrid({
            loadFilter: this.LoadFilter.bind(this),
            onLoadError: (data) => {
                this.ShowErrorResponse(data.responseJSON);
            },
            rowStyler: this.dgLocations_rowStyler.bind(this),
            onLoadSuccess: this.dgLocations_onLoadSuccess.bind(this),
            onSelect: this.btnDeleteChangeText.bind(this)
        });

        this.LoadRights();
        this.btnUpdate.linkbutton({onClick: this.btnUpdate_onClick.bind(this)});
        this.btnFilter.linkbutton({onClick: this.btnFilter_onClick.bind(this)});
        this.AddLifeSearch(this.txName, this.btnUpdate_onClick.bind(this));
        this.btnAdd.linkbutton({onClick: this.btnAdd_onClick.bind(this)});
        this.btnChange.linkbutton({onClick: this.btnChange_onClick.bind(this)});
        this.btnDelete.linkbutton({onClick: this.btnDelete_onClick.bind(this)});
        this.btnClear.linkbutton({onClick: this.btnClear_onClick.bind(this)});
        this.btnUpdate_onClick();

        if (this.prefix == "modal_") {
            this.pOkCancel.css("visibility", "visible");
            this.wLocations = $("#" + this.ModuleId);
            this.InitCloseEvents(this.wLocations, false);
            this.btnCancel.linkbutton({
                onClick: function () {
                    this.wLocations.window("close")
                }.bind(this)
            });
            this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        }
    }

    /**
     * Очистить фильтр по имени
     */
    btnClear_onClick(){
        this.txName.textbox("setText", "");
        this.btnUpdate_onClick();
    }

    /**
     * Обработка выбора записи
     */
    btnOk_onClick(){
        if(this.dgLocations.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для выбора");
            return false;
        }
        let selData = this.dgLocations.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись");
            return false;
        }
        if(this.ResultFunc!=null) {
            this.ResultFunc({id: selData.id.toString()});
        }
        this.wLocations.window("close");
        return false;
    }

    /**
     * Живой фильтр по наименованию
     * @param textBox
     * @param func
     * @constructor
     */
    AddLifeSearch(textBox, func) {
        textBox.textbox({
            inputEvents: $.extend({}, textBox.textbox.defaults.inputEvents, {
                keyup: function (e) {
                    func();
                }
            })
        });
    }

    /**
     * Добавить запись
     */
    btnAdd_onClick() {
        let form = new LocationsFormEdit();
        form.SetResultFunc((RecId) => {
            this.LocationsId = RecId;
            this.btnUpdate_onClick();
        });
        form.Show({AddMode: true});
    }

    /**
     * Обработка изменения записи
     */
    btnChange_onClick() {
        if (this.dgLocations.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для изменения");
            return false;
        }
        let selData = this.dgLocations.datagrid("getSelected");
        if (selData == null) {
            this.ShowWarning("Выберите запись для изменения");
            return false;
        }

        if (this.editMode) {
            this.sLoc.LockRecord("locations", selData.id, this.btnContinueChange_onClick.bind(this));
        } else {
            this.btnContinueChange_onClick({
                id: selData.id,
                AddMode: false,
                editMode: this.editMode,
                lockMessage: '',
                lockState: false
            });
        }
    }

    btnContinueChange_onClick(options){
        if(options.lockMessage.length!=0){
            this.ShowSlide("Предупреждение", options.lockMessage)
            options.editMode = false;
        }
        else{
            if(options.editMode){
                options.lockState = true
            }
        }
        let form = new LocationsFormEdit();
        form.SetResultFunc((RecId)=>{  this.LocationsId = RecId; this.btnUpdate_onClick();});
        form.SetCloseWindowFunction((options)=>{
            if(options!=null){
                if(options.lockState){
                    this.sLoc.FreeLockRecord("locations", options.id);
                }
            }
        });
        form.Show(options);
    }

    /**
     * Удаление записи
     */
    btnDelete_onClick(){
        if(this.dgLocations.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для удаления");
            return false;
        }
        let selData = this.dgLocations.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для удаления");
            return false;
        }
        let del = selData.del;
        let header = "Удаление";
        let action = "удалить";
        if(del == 1){
            header = "Восстановление";
            action = "восстановить";
        }

        $.messager.confirm(header, "Вы действительно хотите " + action + " выделенное месторасположение " + selData.name + " с Id = " + selData.id + "?",
            function (result) {
                if (result) {
                    this.sLoc.StateLockRecord("locations", selData.id, this.btnContinueDelete_onClick.bind(this));
                }
            }.bind(this));
    }

    /**
     * ПРподолжение процесса удаления записи
     * @param options
     */
    btnContinueDelete_onClick(options){
        if(options.data.length > 0){
            this.ShowWarning(options.data);
        }
        else
        {
            $.ajax({
                method: "POST",
                url: this.GetUrl('/Locations/Delete'),
                data: {id: options.id},
                success:function(data){
                    if(data.length) {
                        this.ShowWarning(data);
                    }
                    else{
                        this.btnUpdate_onClick();
                    }
                }.bind(this),
                error:function(data){ this.ShowErrorResponse(data.responseJSON); }.bind(this)
            });
        }
    }

    LoadRights() {
        $.ajax({
            method: "get",
            url: this.GetUrl('/CoreUtils/GetActRights?TaskCode=Locations.dll&ActCode=LocationsChange'),
            success: function (data) {
                if (data.length == 0) {
                    this.btnAdd.linkbutton({disabled: false});
                    this.btnDelete.linkbutton({disabled: false});
                    this.editMode = true;
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Обработка события перерисовки грида (подсветка удалённых записей)
     * @param index - позиция записи
     * @param row - запись
     */
    dgLocations_rowStyler(index, row) {
        if (row.del == 1) {
            return "background-color:gray;";
        }
    }

    /**
     * Обработка окончания загрузки списка кодов территорий
     * @param data - информация о загруженных данных
     */
    dgLocations_onLoadSuccess(data) {
        if (data.total > 0) {
            if (this.LocationsId != -1) {
                this.dgLocations.datagrid("selectRecord", this.LocationsId);
            } else {
                if (this.LocationsIndex >= 0 && this.LocationsIndex < data.total) {
                    this.dgLocations.datagrid("selectRow", this.LocationsIndex);
                } else if (data.total > 0) {
                    this.dgLocations.datagrid("selectRow", data.total - 1);
                }
            }

            this.LocationsId = -1;
            this.LocationsIndex = 0;
        }
        this.btnDeleteChangeText();
    }

    /**
     * Изменение текста на кнопке "Удалить"
     */
    btnDeleteChangeText(){
        if(this.dgLocations.datagrid("getRows").length != 0){
            let selData = this.dgLocations.datagrid("getSelected");
            if(selData !=null ){
                if(selData.del==1){
                    this.btnDelete.linkbutton({iconCls:"icon-undo", text:"Вернуть"});
                }
                else {
                    this.btnDelete.linkbutton({iconCls:"icon-remove", text:"Удалить"});
                }
            }
            else {
                this.btnDelete.linkbutton({iconCls:"icon-remove", text:"Удалить"});
            }
        }
        else {
            this.btnDelete.linkbutton({iconCls:"icon-remove", text:"Удалить"});
        }
    }

    /**
     * Показать фильтр по пользователям
     */
    btnFilter_onClick() {
        let form = new LocationsFilterForm();
        form.SetResultFunc(function (data) {
            this.FilterDepId = data.depid;
            this.FilterKterId = data.kterid;
            this.FilterDel = data.del;
            this.btnUpdate_onClick();
        }.bind(this));
        form.Show({depid: this.FilterDepId, kterid: this.FilterKterId, del: this.FilterDel});
    }

    /**
     * Обновление спсика кодов территорий
     */
    btnUpdate_onClick() {
        let row = this.dgLocations.datagrid("getSelected");
        if (row != null) {
            this.LocationsIndex = this.dgLocations.datagrid("getRowIndex", row);
            if (this.LocationsIndex < 0) {
                this.LocationsIndex = 0;
            }
        }

        let depid = encodeURIComponent(this.FilterDepId);
        let kterid = encodeURIComponent(this.FilterKterId);
        let del = encodeURIComponent(this.FilterDel);
        let name = encodeURIComponent(this.txName.textbox("getText"));
        this.dgLocations.datagrid({url: this.GetUrl("/Locations/list?name=" + name + "&depid=" + depid + "&kterid=" + kterid + "&del=" + del)});
    }

}


/**
 * Функция встраиваемого запуска модуля
 * @param Id идентификатор
 * @constructor
 */
export function StartNestedModul(Id) {
    let form = new Locations("nested_", {});
    form.Start(Id);
}

/**
 * Вызов модуля в диалоговом окне
 * @param StartParams стартовые параметры
 * @param ResultFunc функция, которая будет вызываться по нажатию на кнопку "ОК"
 * @constructor
 */
export function StartModalModul(StartParams, ResultFunc) {
    let id = "wLocations_Module_Locations_LocationsFormList";
    CreateModalWindow(id, "Справочник месторасположений");
    let form = new Locations("modal_", StartParams);
    form.SetResultFunc(ResultFunc);
    form.Start(id);
}