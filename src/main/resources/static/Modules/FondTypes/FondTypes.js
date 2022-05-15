import {FormView} from "../Core/FormView.js";
import {FondTypesEdit} from "./FondTypesEdit.js";



class FondTypes extends FormView{

    constructor(prefix, StartParams) {
        super();
        this.FTid = -1;
        this.FTindex = 0;
        this.StartParams = StartParams;
        this.prefix = prefix;
        this.sLoc = new LibLockService(300000);
    }
    Start(id){
        this.ModuleId = id;
        LoadForm("#"+this.ModuleId, this.GetUrl("/FondTypes/FondTypesList?prefix=" + this.prefix), this.InitFunc.bind(this));
    }
    InitFunc() {
        this.InitComponents(this.ModuleId, this.prefix);
        AddKeyboardNavigationForGrid(this.dgFT);
        this.Update();
        this.LoadRights();
        this.dgFT.datagrid({
            loadFilter: this.LoadFilter.bind(this),
            onLoadError: (data) => { this.ShowErrorResponse(data.responseJSON);},
            rowStyler: this.dgFT_rowStyler.bind(this),
            onSelect: this.btnDeleteChangeText.bind(this),
            onLoadSuccess: this.dgFT_onLoadSuccess.bind(this)
        });
        this.cbShowDel.checkbox({onChange: this.Update.bind(this)});
        this.btnAdd.linkbutton({onClick:this.AddClick.bind(this)});
        this.btnChange.linkbutton({onClick:this.btnChange_onClick.bind(this)});
        this.btnDelete.linkbutton({onClick:this.btnDelete_onClick.bind(this)});
        this.btnUpdate.linkbutton({onClick:this.Update.bind(this)});
        if(this.prefix=="modal_"){
            this.pOkCancel.css("visibility", "visible");
            this.wFondTypes = $("#"+this.ModuleId);
            this.InitCloseEvents(this.wFondTypes, false);//Инициализация закрытия формы по нажатию на клавиши "ESC"
            this.btnCancel.linkbutton({onClick: function(){ this.wFondTypes.window("close") }.bind(this)});
            this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this) });
        }
    }

    AddClick() {
        let form = new FondTypesEdit();
        form.SetResultFunc((RecId) => {
            this.Update();
            this.FTid = RecId;
        });
        form.Show({AddMode: true});
    }
    btnChange_onClick(){
        if(this.dgFT.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для изменения");
            return false;
        }
        let selData = this.dgFT.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для изменения");
            return false;
        }
        this.sLoc.LockRecord("fond_types", selData.id, this.btnContinueChange_onClick.bind(this));

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
        let form = new FondTypesEdit();
        form.SetResultFunc((RecId)=>{  this.FTid = RecId; this.Update();});
        form.SetCloseWindowFunction((options)=>{
            if(options!=null){
                if(options.lockState){
                    this.sLoc.FreeLockRecord("fond_types", options.id);
                }
            }
        });
        let i = this.editMode;
        form.Show(options,i);
    }
    btnDelete_onClick(){
        if(this.dgFT.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для удаления");
            return false;
        }
        let selData = this.dgFT.datagrid("getSelected");
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
        $.messager.confirm(header, "Вы действительно хотите " + action + " единицу измерения " + selData.name + " с кодом " + selData.code + "?",
            function(result){
                if(result){
                    this.sLoc.StateLockRecord("fond_types", selData.id, this.btnContinueDelete_onClick.bind(this));
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
                url: this.GetUrl('/FondTypes/delete'),
                data: {id: options.id},
                success:function(data){
                    if(data.length) {
                        this.ShowWarning(data);
                    }
                    else{
                        this.Update();
                    }
                }.bind(this),
                error:function(data){ this.ShowErrorResponse(data.responseJSON); }.bind(this)
            });
        }
    }
    /**
     * выставление индекса
     */
    dgFT_onLoadSuccess(data){
        if(data.total > 0) {
            if(this.FTid != -1 ) {
                this.dgFT.datagrid("selectRecord", this.FTid);
            }
            else {
                if(this.FTindex>=0&& this.FTindex < data.total) {
                    this.dgFT.datagrid("selectRow", this.FTindex);
                }
                else if (data.total>0) {
                    this.dgFT.datagrid("selectRow", data.total-1);
                }
            }
            this.FTid = -1;
            this.FTindex = 0;
        }
    }
    /**
     * отображение удаленных и изменение надписи на кнопки
     */
    btnDeleteChangeText(){
        if(this.dgFT.datagrid("getRows").length != 0){
            let selData = this.dgFT.datagrid("getSelected");
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
    dgFT_rowStyler(index, row) {
        if(row.del==1) {
            return "background-color:gray;";
        }
    }
    /**
     * Проверка прав
     */
    LoadRights(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/CoreUtils/GetActRights?TaskCode=FondTypes.dll&ActCode=FondTypesChange'),
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
     * Загрузка и обновление грда
     * @constructor
     */
    Update(){
        let row = this.dgFT.datagrid("getSelected");
        if(row!=null) {
            this.FTindex = this.dgFT.datagrid("getRowIndex", row);
            if(this.FTindex<0){
                this.FTindex = 0;
            }
        }
        let showDel = this.cbShowDel.checkbox("options").checked?"true":"false";
        this.dgFT.datagrid({url: this.GetUrl("/FondTypes/list?showDel=" + showDel )});
    }
    btnOk_onClick(){

        if(this.dgFT.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для выбора");
            return false;
        }
        let selData = this.dgFT.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись");
            return false;
        }
        if(this.ResultFunc!=null) {
            this.ResultFunc({id: selData.id.toString()});
        }
        this.wFondTypes.window("close");
        return false;
    }

}
export function StartNestedModul(Id) {
    let form = new FondTypes("nested_", "");
    form.Start(Id);
}
export function StartModalModul(StartParams, ResultFunc) {
    let id = "wFondTypes_Module_FondTypes_FondTypesList";//идентификатор диалогового окна
    CreateModalWindow(id, "Справочник типов фондов")//функция создания диалогового окна для модуля
    let form = new FondTypes("modal_", StartParams);
    form.SetResultFunc(ResultFunc);
    form.Start(id);
}
