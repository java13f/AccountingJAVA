import {FormView} from "../Core/FormView.js";
import {KEKRFormEdit} from "./KEKRFormEdit.js";

class KEKR extends FormView {

    constructor(prefix, StartParams) {
        super();
        this.KEKRId = -1;
        this.KEKRIndex = 0;
        this.prefix = prefix;
        this.StartParams = StartParams;
        this.sLoc = new LibLockService(300000);
        this.editMode = false;
    }

    Start(id) {
        this.ModuleId = id;
        LoadForm("#" + this.ModuleId, this.GetUrl("/KEKR/KEKRFormList?prefix=" + this.prefix), this.InitFunc.bind(this));
    }

    InitFunc() {
        this.InitComponents(this.ModuleId, this.prefix);
        AddKeyboardNavigationForGrid(this.dgKEKR);

        // Инициализация грида
        this.dgKEKR.datagrid({
            onLoadError: (data) => {
                this.ShowErrorResponse(data.responseJSON);
            },
            rowStyler: this.dgKEKR_rowStyler.bind(this),
            onLoadSuccess: this.dgKEKR_onLoadSuccess.bind(this),
            onSelect: this.btnDeleteChangeText.bind(this)
        });

        // Привязываем события на элементы формы
        this.btnUpdate.linkbutton({onClick: this.btnUpdate_onClick.bind(this)});
        this.cbShowDel.checkbox({onChange: this.btnUpdate_onClick.bind(this)});
        this.btnAdd.linkbutton({onClick: this.btnAdd_onClick.bind(this)});
        this.btnChange.linkbutton({onClick: this.btnChange_onClick.bind(this)});
        this.btnDelete.linkbutton({onClick: this.btnDelete_onClick.bind(this)});

        this.LoadRights();
        this.btnUpdate_onClick();

        if (this.prefix == "modal_") {
            this.pOkCancel.css("visibility", "visible");
            this.wKEKR = $("#" + this.ModuleId);
            this.InitCloseEvents(this.wKEKR, false);
            this.btnCancel.linkbutton({
                onClick: function () {
                    this.wKEKR.window("close")
                }.bind(this)
            });
            this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        }
    }

    /**
     * Проверка прав
     * @constructor
     */
    LoadRights() {
        $.ajax({
            method: "GET",
            url: this.GetUrl('/CoreUtils/GetActRights?TaskCode=KEKR.dll&ActCode=KEKRChange'),
            success: function (data) {
                if (data.length == 0) {
                    this.btnAdd.linkbutton({disabled: false});
                    this.btnDelete.linkbutton({disabled: false});
                    this.btnChange.linkbutton({text: 'Изменить'})
                    this.editMode = true;
                }
                else {
                    this.btnAdd.linkbutton({disabled: true});
                    this.btnDelete.linkbutton({disabled: true});
                    this.btnChange.linkbutton({text: 'Просмотр'})
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Удаление записи
     */
    btnDelete_onClick(){
        if(this.dgKEKR.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для удаления");
            return false;
        }
        let selData = this.dgKEKR.datagrid("getSelected");
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

        $.messager.confirm(header, "Вы действительно хотите " + action + " выделенный код \"" + selData.name + "\" с Id = " + selData.id + "?",
            function (result) {
                if (result) {
                    this.sLoc.StateLockRecord("kekr", selData.id, this.btnContinueDelete_onClick.bind(this));
                }
            }.bind(this));
    }

    /**
     * Продолжение процесса удаления записи
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
                url: this.GetUrl('/KEKR/Delete'),
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

    /**
     * Добавить запись
     */
    btnAdd_onClick() {
        let form = new KEKRFormEdit();
        form.SetResultFunc((RecId) => {
            this.KEKRId = RecId;
            this.btnUpdate_onClick();
        });
        form.Show({AddMode: true});
    }

    /**
     * Обработка события перерисовки грида (подсветка удалённых записей)
     * @param index - позиция записи
     * @param row - запись
     */
    dgKEKR_rowStyler(index, row) {
        if (row.del == 1) {
            return "background-color:gray;";
        }
    }

    /**
     * Обновление спиcка записей
     */
    btnUpdate_onClick() {
        let row = this.dgKEKR.datagrid("getSelected");
        if (row != null) {
            this.KEKRIndex = this.dgKEKR.datagrid("getRowIndex", row);
            if (this.KEKRIndex < 0) {
                this.KEKRIndex = 0;
            }
        }

        let del = this.cbShowDel.checkbox("options").checked ? "true" : "false";
        this.dgKEKR.datagrid({url: this.GetUrl('/KEKR/list?del=' + del)});
    }

    /**
     * Обработка окончания загрузки списка записей
     * @param data - информация о загруженных данных
     */
    dgKEKR_onLoadSuccess(data) {
        if (data.total > 0) {
            if (this.KEKRId != -1) {
                this.dgKEKR.datagrid("selectRecord", this.KEKRId);
            } else {
                if (this.KEKRIndex >= 0 && this.KEKRIndex < data.total) {
                    this.dgKEKR.datagrid("selectRow", this.KEKRIndex);
                } else if (data.total > 0) {
                    this.dgKEKR.datagrid("selectRow", data.total - 1);
                }
            }

            this.KEKRId = -1;
            this.KEKRIndex = 0;
        }
        this.btnDeleteChangeText();
    }

    /**
     * Обработка изменения записи
     */
    btnChange_onClick() {
        if (this.dgKEKR.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для изменения");
            return false;
        }
        let selData = this.dgKEKR.datagrid("getSelected");
        if (selData == null) {
            this.ShowWarning("Выберите запись для изменения");
            return false;
        }

        if (this.editMode) {
            this.sLoc.LockRecord("kekr", selData.id, this.btnContinueChange_onClick.bind(this));
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

    /**
     * Процедура продолжения изменения записи
     * @param options
     */
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
        let form = new KEKRFormEdit();
        form.SetResultFunc((RecId)=>{  this.KEKRId = RecId; this.btnUpdate_onClick();});
        form.SetCloseWindowFunction((options)=>{
            if(options!=null){
                if(options.lockState){
                    this.sLoc.FreeLockRecord("kekr", options.id);
                }
            }
        });
        form.Show(options);
    }

    /**
     * Изменение текста на кнопке "Удалить/Вернуть"
     */
    btnDeleteChangeText(){
        if(this.dgKEKR.datagrid("getRows").length != 0){
            let selData = this.dgKEKR.datagrid("getSelected");
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
     * Обработка выбора записи
     */
    btnOk_onClick(){
        if(this.dgKEKR.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для выбора");
            return false;
        }
        let selData = this.dgKEKR.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись");
            return false;
        }
        if(this.ResultFunc!=null) {
            this.ResultFunc({id: selData.id.toString()});
        }
        this.wKEKR.window("close");
        return false;
    }
}


/**
 * Функция встраиваемого запуска модуля
 * @param Id идентификатор
 * @constructor
 */
export function StartNestedModul(Id) {
    let form = new KEKR("nested_", {});
    form.Start(Id);
}

/**
 * Вызов модуля в диалоговом окне
 * @param StartParams стартовые параметры
 * @param ResultFunc функция, которая будет вызываться по нажатию на кнопку "ОК"
 * @constructor
 */
export function StartModalModul(StartParams, ResultFunc) {
    let id = "wKEKR_Module_KEKR_KEKRFormList";
    CreateModalWindow(id, "Справочник \"Коды экономической классификации расходов\"");
    let form = new KEKR("modal_", StartParams);
    form.SetResultFunc(ResultFunc);
    form.Start(id);
}