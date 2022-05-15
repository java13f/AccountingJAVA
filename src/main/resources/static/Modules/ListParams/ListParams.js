import {FormView} from "../Core/FormView.js";
import {ListParamsFormEdit} from "./ListParamsFormEdit.js";

class ListParams extends FormView {

    /**
     * Конструктор
     * @param prefix - приставка для идентификаторов. Данная приставка добавится для каждого идентификатора
     * @param StartParams - стартовые параметры в формате JSON
     */
    constructor(prefix, StartParams) {
        super();
        this.ListParamsId = -1;
        this.ListParamsIndex = 0;
        this.prefix = prefix;
        this.StartParams = StartParams;
        this.TaskCode = "";
        this.sLoc = new LibLockService(300000);
    }

    /**
     * Функция загрузки формы
     * @param id - идентификатор эелемента HTML, в который будет загружена разметка частичного представления
     * @constructor
     */
    Start(id){
        this.ModuleId = id;
        LoadForm("#"+this.ModuleId, this.GetUrl("/ListParams/ListParamsFormList?prefix=" + this.prefix), this.InitFunc.bind(this));
    }

    /**
     * Функция инициализации пользовательского интерфейса
     * @constructor
     */
    InitFunc(){
        this.InitComponents(this.ModuleId, this.prefix);
        this.LoadTaskCodeList();
        AddKeyboardNavigationForGrid(this.dgListParams);
        this.dgListParams.datagrid({
            loadFilter:this.LoadFilter.bind(this),
            onLoadError:(data)=>{ this.ShowErrorResponse(data.responseJSON); },
            rowStyler: this.dgListParams_rowStyler.bind(this),
            onLoadSuccess: this.dgListParams_onLoadSuccess.bind(this),
            onSelect: this.btnDeleteChangeText.bind(this)
        });
        this.btnUpdate.linkbutton({onClick: this.btnUpdate_onClick.bind(this)});
        this.btnUpdate_onClick();
        this.cbShowDel.checkbox({onChange: this.btnUpdate_onClick.bind(this)});
        this.LoadRights();
        this.btnAdd.linkbutton({onClick:this.btnAdd_onClick.bind(this)});
        this.btnChange.linkbutton({onClick:this.btnChange_onClick.bind(this)});
        this.cbTableList.combobox({onSelect: this.cbTableList_onSelect.bind(this)});
        this.btnClear.linkbutton({onClick: this.btnClear_onClick.bind(this)});
        this.btnDelete.linkbutton({onClick:this.btnDelete_onClick.bind(this)});
        if(this.prefix=="modal_"){
            this.pOkCancel.css("visibility", "visible");
            this.wListParams = $("#"+this.ModuleId);
            this.InitCloseEvents(this.wListParams, false);
            this.btnCancel.linkbutton({onClick: function(){ this.wListParams.window("close") }.bind(this)});
            this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this) });
        }
    }

    /**
     * Функция загрузки списка таблиц(TaskCode)
     * @constructor
     */
    LoadTaskCodeList() {
        $.ajax({
            method: "get",
            url: this.GetUrl('/ListParams/GetTaskCodeList'),
            success: function (data) {
                this.cbTableList.combobox({
                    valueField: 'taskcode',
                    textField: 'taskcode',
                    data: data
                });
                if (this.TaskCode != "") {
                    let finded = false;
                    for (let i = 0; i < data.length; i++) {
                        let tc = data[i].taskcode;
                        if (tc == this.TaskCode) {
                            this.cbTableList.combobox("setValue", this.TaskCode);
                            finded = true;
                        }
                    }
                    if (finded == false) {
                        this.TaskCode = "";
                    }
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
        this.btnDeleteChangeText();
    }


     /**
     * Обработка выбранного списка таблиц(TaskCode)
     * @param record объект с выбранным казначейством
     */
    cbTableList_onSelect(record){
        this.TaskCode = record.taskcode;
        this.btnUpdate_onClick();
        this.btnDeleteChangeText();
     }

    /**
     * Обработка события перерисовки грида (подсветка удалённых записей)
     * @param index - позиция записи
     * @param row - запись
     */
    dgListParams_rowStyler(index, row) {
        if(row.del==1) {
            return "background-color:gray;";
        }
    }

    /**
     * Обработка окончания загрузки списка дополнительных реквизитов
     * @param data - информация о загруженных данных
     */
    dgListParams_onLoadSuccess(data){
        if(data.total>0) {
            if(this.ListParamsId!=-1) {
                this.dgListParams.datagrid("selectRecord", this.ListParamsId);
            }
            else {
                if(this.ListParamsIndex>=0&& this.ListParamsIndex < data.total) {
                    this.dgListParams.datagrid("selectRow", this.ListParamsIndex);
                }
                else if (data.total>0) {
                    this.dgListParams.datagrid("selectRow", data.total-1);
                }
            }
            this.ListParamsId = -1;
            this.ListParamsIndex = 0;
        }
        this.btnDeleteChangeText();
    }

    /**
     * Обновление списка дополнительных реквизитов
     */
    btnUpdate_onClick(){
        let row = this.dgListParams.datagrid("getSelected");
        if(row!=null) {
            this.ListParamsIndex = this.dgListParams.datagrid("getRowIndex", row);
            if(this.ListParamsIndex<0){this.ListParamsIndex = 0;}
        }
        let showDel = this.cbShowDel.checkbox("options").checked?"true":"false";
        this.dgListParams.datagrid({url: this.GetUrl("/ListParams/list?taskcode="+ this.TaskCode+"&showDel=" + showDel)});
    }

    /**
     * Очитска данных находящихся в comboBox
     */
    btnClear_onClick(){
        this.cbTableList.combobox("setValue", "");
        this.TaskCode = "";
        this.LoadTaskCodeList();
        this.btnUpdate_onClick();
    }

    /**
     * Проверка прав
     */
    LoadRights(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/CoreUtils/GetActRights?TaskCode=ListParams.dll&ActCode=ListParamsChange'),
            success: function(data){
                if(data.length == 0){
                    this.btnAdd.linkbutton({disabled:false});
                    this.btnChange.linkbutton({disabled:false});
                    this.btnDelete.linkbutton({disabled:false});
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Обработка
     */
    btnAdd_onClick(){
        let form = new ListParamsFormEdit();
        form.SetResultFunc((RecId)=>{ this.ListParamsId = RecId; this.LoadTaskCodeList();});
        form.Show({AddMode: true});
    }

    /**
     * Обработка изменения записи
     */
    btnChange_onClick(){
        if(this.dgListParams.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для изменения");
            return false;
        }
        let selData = this.dgListParams.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для изменения");
            return false;
        }
         this.sLoc.LockRecord("listparams", selData.id, this.btnContinueChange_onClick.bind(this));
     }

    /**
     * Блокировка
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
        let form = new ListParamsFormEdit();
        form.SetResultFunc((RecId)=>{  this.ListParamsId = RecId; this.LoadTaskCodeList();});
        form.SetCloseWindowFunction((options)=>{
            if(options!=null){
                if(options.lockState){
                    this.sLoc.FreeLockRecord("listparams", options.id);
                }
            }
        });
        form.Show(options);
    }

    /**
     * Удаление записи
     */
    btnDelete_onClick(){
        if(this.dgListParams.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для удаления");
            return false;
        }
        let selData = this.dgListParams.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для удаления");
            return false;
        }
        let del = selData.del;
        let header = "Удаление"
        let action = "удалить"
        if(del == 1){
            header = "Восстановление";
            action = "восстановить";
        }
        $.messager.confirm(header, "Вы действительно хотите " + action + " выделенный реквизит с кодом параметра '" + selData.paramcode + "' , который относиться к таблице '" + selData.taskcode + "'?",
            function(result){
                if(result){
                    this.sLoc.StateLockRecord("ListParams", selData.id, this.btnContinueDelete_onClick.bind(this));
                }
            }.bind(this));
    }

    /**
     * Прподолжение процесса удаления записи
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
                url: this.GetUrl('/ListParams/delete'),
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
     * Изменение текста на кнопке "Удалить"
     */
    btnDeleteChangeText(){
        if(this.dgListParams.datagrid("getRows").length != 0){
            let selData = this.dgListParams.datagrid("getSelected");
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
        if(this.dgListParams.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для выбора");
            return false;
        }
        let selData = this.dgListParams.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись");
            return false;
        }
        if(this.ResultFunc!=null) {
            this.ResultFunc({id: selData.id.toString()});
        }
        this.wListParams.window("close");
        return false;
    }
}
    /**
    * Функция встраиваемого запуска модуля
    * @param Id идентификатор
    * @constructor
    */
    export function StartNestedModul(Id)  {
        let form = new ListParams("nested_", "");
        form.Start(Id);
}

    /**
 * Вызов модуля в диалоговом окне
 * @param StartParams стартовые параметры
 * @param ResultFunc функция, которая будет вызываться по нажатию на кнопку "ОК"
 * @constructor
 */
export function StartModalModul(StartParams, ResultFunc) {
    let id = "wListParams_Module_ListParams_ListParamsList";
    CreateModalWindow(id, "Справочник дополнительных реквизитов")
    let form = new ListParams("modal_", StartParams);
    form.SetResultFunc(ResultFunc);
    form.Start(id);
}

