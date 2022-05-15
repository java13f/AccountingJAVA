import {FormView} from "../Core/FormView.js";
import {UnitsFormEdit} from "./UnitsFormEdit.js";


class Units extends  FormView {


    constructor(prefix, StartParams) {
        super();
        this.UnitsId = -1;
        this.UnitsIndex = 0;
        this.prefix = prefix;
        this.StartParams = StartParams;
        this.sLoc = new LibLockService(300000);
    }
    Start(id){
        this.ModuleId = id;
        LoadForm("#"+this.ModuleId, this.GetUrl("/Units/UnitsList?prefix=" + this.prefix), this.InitFunc.bind(this));
        //LoadForm("#"+this.ModuleId, this.GetUrl("/Units/UnitsList"), this.InitFunc.bind(this));
    }
    /**
     * Функция инициализации пользовательского интерфейса
     * @constructor
     */
    InitFunc(){
        this.InitComponents(this.ModuleId, this.prefix);
        AddKeyboardNavigationForGrid(this.dgUnits);
        this.Update();
        this.dgUnits.datagrid({
            loadFilter:this.LoadFilter.bind(this),
            onLoadError:(data)=>{ this.ShowErrorResponse(data.responseJSON);},
            rowStyler: this.dgUnits_rowStyler.bind(this),
            onSelect: this.btnDeleteChangeText.bind(this),
            onLoadSuccess: this.dgUnits_onLoadSuccess.bind(this)
        });
        this.LoadRights();
        this.cbShowDel.checkbox({onChange: this.Update.bind(this)});
        this.btnAdd.linkbutton({onClick:this.AddClick.bind(this)});
        this.btnChange.linkbutton({onClick:this.btnChange_onClick.bind(this)});
        this.btnDelete.linkbutton({onClick:this.btnDelete_onClick.bind(this)});
        this.btnUpdate.linkbutton({onClick:this.Update.bind(this)});
        if(this.prefix=="modal_"){
            this.pOkCancel.css("visibility", "visible");
            this.wUnits = $("#"+this.ModuleId);
            this.InitCloseEvents(this.wUnits, false);//Инициализация закрытия формы по нажатию на клавиши "ESC"
            this.btnCancel.linkbutton({onClick: function(){ this.wUnits.window("close") }.bind(this)});
            this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this) });
        }
    }
    /**
     * нажатие на кнопку добавть
     * @constructor
     */
    AddClick(){
        let form = new UnitsFormEdit();//Ссоздание формы редактирования
        form.SetResultFunc((RecId)=>{
            this.Update();
            this.UnitsId = RecId;
        });
        form.Show({AddMode: true});//Показать форму

            }
    /**
     * Загрузка и обновление грда
     * @constructor
     */
    Update(){
        let row = this.dgUnits.datagrid("getSelected");
        if(row!=null) {
            this.UnitsIndex = this.dgUnits.datagrid("getRowIndex", row);
            if(this.UnitsIndex<0){
                this.UnitsIndex = 0;

            }
        }
        let showDel = this.cbShowDel.checkbox("options").checked?"true":"false";
        this.dgUnits.datagrid({url: this.GetUrl("/Units/list?showDel=" + showDel )});
    }

    /**
     * отображение удаленных записей серым
     * @param index
     * @param row
     * @returns {string}
     */
    dgUnits_rowStyler(index, row) {
        if(row.del==1) {
            return "background-color:gray;";
        }
    }

    /**
     * отображение удаленных и изменение надписи на кнопки
     */
    btnDeleteChangeText(){
        if(this.dgUnits.datagrid("getRows").length != 0){
            let selData = this.dgUnits.datagrid("getSelected");
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
     * выставление индекса
     */
    dgUnits_onLoadSuccess(data){
        if(data.total > 0) {
            if(this.UnitsId != -1 ) {
                this.dgUnits.datagrid("selectRecord", this.UnitsId);
            }
            else {
                if(this.UnitsIndex>=0&& this.UnitsIndex < data.total) {
                    this.dgUnits.datagrid("selectRow", this.UnitsIndex);
                }
                else if (data.total>0) {
                    this.dgUnits.datagrid("selectRow", data.total-1);
                }
            }
            this.UnitsId = -1;
            this.UnitsIndex = 0;
        }
    }
    /**
     * Проверка прав
     */
    LoadRights(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/CoreUtils/GetActRights?TaskCode=Units.dll&ActCode=UnitsChange'),
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
     * Обработка изменения записи
     */
    btnChange_onClick(){
        if(this.dgUnits.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для изменения");
            return false;
        }
        let selData = this.dgUnits.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для изменения");
            return false;
        }
        this.sLoc.LockRecord("units", selData.id, this.btnContinueChange_onClick.bind(this));
    }

    /**
     * продолжить обработку
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
        let form = new UnitsFormEdit();
        form.SetResultFunc((RecId)=>{  this.UnitsId = RecId; this.Update();});
        form.SetCloseWindowFunction((options)=>{
            if(options!=null){
                if(options.lockState){
                    this.sLoc.FreeLockRecord("units", options.id);
                }
            }
        });
        let i = this.editMode;
        form.Show(options,i);
    }
    /**
     * Удаление записи
     */
    btnDelete_onClick(){
        if(this.dgUnits.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для удаления");
            return false;
        }
        let selData = this.dgUnits.datagrid("getSelected");
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
                    this.sLoc.StateLockRecord("units", selData.id, this.btnContinueDelete_onClick.bind(this));
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
                url: this.GetUrl('/Units/delete'),
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
    btnOk_onClick(){

        if(this.dgUnits.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для выбора");
            return false;
        }
        let selData = this.dgUnits.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись");
            return false;
        }
        if(this.ResultFunc!=null) {
            this.ResultFunc({id: selData.id.toString()});
        }
        this.wUnits.window("close");
        return false;
    }
}

export function StartNestedModul(Id) {
    let form = new Units("nested_", "");
    form.Start(Id);
}

export function StartModalModul(StartParams, ResultFunc) {
    let id = "wUnits_Module_Units_UnitsList";//идентификатор диалогового окна
    CreateModalWindow(id, "Справочник единиц измерений")//функция создания диалогового окна для модуля
    let form = new Units("modal_", StartParams);

    form.SetResultFunc(ResultFunc);
    form.Start(id);
}