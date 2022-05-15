import {FormView} from "../Core/FormView.js";
import {ObjTypesFormEdit} from "./ObjTypesFormEdit.js";



class ObjTypes extends  FormView {

    constructor(prefix, StartParams) {
        super();
        this.ObjTypesId = -1;
        this.ObjTypesIndex = 0;
        this.prefix = prefix;
        this.StartParams = StartParams;
        this.sLoc = new LibLockService(300000);
    }
    /**
     * Функция загрузки формы
     * @param id - идентификатор эелемента HTML, в который будет загружена разметка частичного представления
     * @constructor
     */
    Start(id){
        this.ModuleId = id;
        //Загружаем макет формы и выполняем  функци InitFunc в случае успеха
        LoadForm("#"+this.ModuleId, this.GetUrl("/ObjTypes/ObjTypesFormList?prefix=" + this.prefix), this.InitFunc.bind(this));
    }
    /**
     * Функция инициализации пользовательского интерфейса
     * @constructor
     */
    InitFunc(){
        this.InitComponents(this.ModuleId, this.prefix);
        AddKeyboardNavigationForGrid(this.dgObjTypes);
        this.dgObjTypes.datagrid({
            loadFilter:this.LoadFilter.bind(this),
            onLoadError:(data)=>{ this.ShowErrorResponse(data.responseJSON); },
            rowStyler: this.dgObjTypes_rowStyler.bind(this),
            onLoadSuccess: this.dgObjTypes_onLoadSuccess.bind(this),
            onSelect: this.btnDeleteChangeText.bind(this)
         });
        this.btnUpdate.linkbutton({onClick: this.btnUpdate_onClick.bind(this)});
        this.cbShowDel.checkbox({onChange: this.btnUpdate_onClick.bind(this)});
        this.LoadRights();
        this.btnDelete.linkbutton({onClick:this.btnDelete_onClick.bind(this)});
        this.btnAdd.linkbutton({onClick:this.btnAdd_onClick.bind(this)});
        this.btnChange.linkbutton({onClick:this.btnChange_onClick.bind(this)});
        this.btnUpdate_onClick();
        if(this.prefix=="modal_"){
            this.pOkCancel.css("visibility", "visible");
            this.wObjTypes = $("#"+this.ModuleId);
            this.InitCloseEvents(this.wObjTypes, false);//Инициализация закрытия формы по нажатию на клавиши "ESC"
            this.btnCancel.linkbutton({onClick: function(){ this.wObjTypes.window("close") }.bind(this)});
            this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this) });
        }
    }
    btnAdd_onClick(){
         let form = new ObjTypesFormEdit();//Ссоздание формы редактирования
         form.SetResultFunc((RecId)=>{ this.ObjTypesId = RecId; this.btnUpdate_onClick();});
         form.Show({AddMode: true});//Показать форму

    }
    /**
     * Обработка изменения записи
     */
    btnChange_onClick(){
        if(this.dgObjTypes.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для изменения");
            return false;
        }
        let selData = this.dgObjTypes.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для изменения");
            return false;
        }

            this.sLoc.LockRecord("ObjTypes", selData.id, this.btnContinueChange_onClick.bind(this));

    }
    /**
     * Обработка события перерисовки грида (подсветка удалённых записей)
     * @param index - позиция записи
     * @param row - запись
     */
    dgObjTypes_rowStyler(index, row) {
        if(row.del==1) {
            return "background-color:gray;";
        }
    }
    /**
     *Изменение
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
        let form = new ObjTypesFormEdit();
        form.SetResultFunc((RecId)=>{  this.ObjTypesId = RecId; this.btnUpdate_onClick();});
        form.SetCloseWindowFunction((options)=>{
            if(options!=null){
                if(options.lockState){
                    this.sLoc.FreeLockRecord("objtypes", options.id);
                }
            }
        });
        form.Show(options);
    }
    /**
     * Обработка окончания загрузки списка типов объектов
     * @param data - информация о загруженных данных
     */
    dgObjTypes_onLoadSuccess(data){
        if(data.total>0) {
            if(this.ObjTypesId!=-1 ) {
                this.dgObjTypes.datagrid("selectRecord", this.ObjTypesId);
            }
            else {
                if(this.ObjTypesIndex>=0&& this.ObjTypesIndex < data.total) {
                    this.dgObjTypes.datagrid("selectRow", this.ObjTypesIndex);
                }
                else if (data.total>0) {
                    this.dgObjTypes.datagrid("selectRow", data.total-1);
                }
            }
            //возвращаем значения по умолчанию
            this.ObjTypesId = -1;
            this.ObjTypesIndex = 0;
        }
    }
    /**
     * Обновление
     */
    btnUpdate_onClick(){
        let row = this.dgObjTypes.datagrid("getSelected");
        if(row!=null) {
            this.ObjTypesIndex = this.dgObjTypes.datagrid("getRowIndex", row);
            if(this.ObjTypesIndex<0){this.ObjTypesIndex = 0;}
        }
        let showDel = this.cbShowDel.checkbox("options").checked?"true":"false";
        this.dgObjTypes.datagrid({url: this.GetUrl("/ObjTypes/list?showDel=" + showDel )});
    }
    /**
     * Обработка события перерисовки грида (подсветка удалённых записей)
     * @param index - позиция записи
     * @param row - запись
     */
    dgObjTypes_rowStyler(index, row) {
        if(row.del==1) {
            return "background-color:gray;";
        }
    }
    /**
     * Удаление записи
     */
    btnDelete_onClick(){
        if(this.dgObjTypes.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для удаления");
            return false;
        }
        let selData = this.dgObjTypes.datagrid("getSelected");
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
        $.messager.confirm(header, "Вы действительно хотите " + action + " выделенную территорию " + selData.name + " с кодом " + selData.code + "?",
            function(result){
                if(result){
                    this.sLoc.StateLockRecord("objtypes", selData.id, this.btnContinueDelete_onClick.bind(this));
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
                url: this.GetUrl('/ObjTypes/delete'),
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
     * Проверка прав
     */
    LoadRights(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/CoreUtils/GetActRights?TaskCode=ObjTypes.dll&ActCode=ObjTypesChange'),
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
     * Изменение текста на кнопке "Удалить"
     */
    btnDeleteChangeText(){
        if(this.dgObjTypes.datagrid("getRows").length != 0){
            let selData = this.dgObjTypes.datagrid("getSelected");
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
        if(this.dgObjTypes.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для выбора");
            return false;
        }
        let selData = this.dgObjTypes.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись");
            return false;
        }
        if(this.ResultFunc!=null) {
            this.ResultFunc({id: selData.id.toString()});
        }
        this.wObjTypes.window("close");
        return false;
    }

}

/**
 * Функция встраиваемого запуска модуля
 * @param Id идентификатор
 * @constructor
 */
export function StartNestedModul(Id) {
    let form = new ObjTypes("nested_", "");
    form.Start(Id);
}
export function StartModalModul(StartParams, ResultFunc) {
    let id = "wObjTypes_Module_ObjTypes_ObjTypesFormList";//идентификатор диалогового окна
    CreateModalWindow(id, "Справочник типы объектов")//функция создания диалогового окна для модуля
    let form = new ObjTypes("modal_", StartParams);
    form.SetResultFunc(ResultFunc);
    form.Start(id);
}




