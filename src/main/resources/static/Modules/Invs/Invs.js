import {FormView} from "../Core/FormView.js";
import {InvsEdit} from "./InvsEdit.js";
import {InvsCommisEdit} from "./InvsCommisEdit.js";



class Invs extends  FormView {

constructor(prefix, StartParams) {
    super();
    this.InvsId = -1;
    this.InvsIndex = 0;
    this.InvsCommisId =-1;
    this.InvsCommisIndex = 0;
    this.prefix = prefix;
    this.StartParams = StartParams;
    this.sLoc = new LibLockService(300000);
}
Start(id){
    this.ModulId = id;
    LoadForm("#"+this.ModulId, this.GetUrl("/Invs/InvsFormList?prefix=" + this.prefix), this.InitFunc.bind(this));
}
    InitFunc(){
        this.InitComponents(this.ModulId, this.prefix);
        AddKeyboardNavigationForGrid(this.dgInvs);
        this.dgInvs.datagrid({
            loadFilter: this.LoadFilter.bind(this),
            onLoadError:(data)=> {this.ShowErrorResponse(data.responseJSON);},
            onLoadSuccess: this.dgInvsList_onLoadSuccess.bind(this),
            onSelect: this.dgInvs_UpdateCommis.bind(this)//нажатие
        });
        this.Update();
        this.LoadRights();
        this.btnAddInvs.linkbutton({onClick:this.AddClickInvs.bind(this)});
        this.btnChangeInvs.linkbutton({onClick:this.btnChange_onClick.bind(this)});
        this.btnDeleteInvs.linkbutton({onClick:this.btnDeleInvs.bind(this)});
        this.btnUpdateInvs.linkbutton({onClick:this.Update.bind(this)});

        if(this.prefix==="modal_"){
            this.pOkCancel.css("visibility", "visible");
            this.wInvs = $("#"+this.ModulId);
            this.InitCloseEvents(this.wInvs, false);
            this.btnCancelInvs.linkbutton({onClick: function(){ this.wInvs.window("close") }.bind(this)});
            this.btnOkInvs.linkbutton({onClick: this.btnOkInvs_onClick.bind(this) });
        }
        this.InitFuncCommis();
}
    InitFuncCommis(){
        this.dgInvsCommis.datagrid({
            loadFilter: this.LoadFilter.bind(this),
            onLoadSuccess: this.dgInvsListCommis_onLoadSuccess.bind(this),

        });
        this.btnAddInvsCommis.linkbutton({onClick:this.AddCommis.bind(this)});
        this.btnChangeInvsCommis.linkbutton({onClick:this.ChangeCommis.bind(this)});
        this.btnDeleteInvsCommis.linkbutton({onClick:this.btnDeleInvsCommis.bind(this)});
        this.btnUpdateInvsCommis.linkbutton({onClick:this.dgInvs_UpdateCommis.bind(this)});
    }

    /**
     * проверка грида перед изменением записи
     * @returns {boolean}
     */
    btnChange_onClick(){
        if(this.dgInvs.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для изменения");
            return false;
        }
        let selData = this.dgInvs.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для изменения");
            return false;
        }
        this.sLoc.LockRecord("invs", selData.id, this.btnContinueChange_onClick.bind(this));
    }

    /**
     * продолжение изменения записи
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
        let form = new InvsEdit();
        form.SetResultFunc((RecId)=>{  this.InvsId = RecId; this.Update();});
        form.SetCloseWindowFunction((options)=>{
            if(options!=null){
                if(options.lockState){
                    this.sLoc.FreeLockRecord("invs", options.id);
                }
            }
        });
        let i = this.editMode;
        form.Show(options,i);
    }

    /**
     * Обработка нажатия кнопки ОК
     * @returns {boolean}
     */
    btnOkInvs_onClick(){
        if(this.dgInvs.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для выбора");
            return false;
        }
        let selData = this.dgInvs.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись");
            return false;
        }
        if(this.ResultFunc!=null) {
            this.ResultFunc({id: selData.id.toString()});
        }
        this.wInvs.window("close");
        return false;
    }

    /**
     * обновление нижнего грида
     */
    dgInvs_UpdateCommis(){
        let selData = this.dgInvs.datagrid("getSelected");
        let selDataCommis = this.dgInvsCommis.datagrid("getSelected");
        if (selData == null) return;
        //this.InvsCommisId = selDataCommis.id;
        this.dgInvsCommis.datagrid({url: this.GetUrl("/Invs/getInvsCommisList?id=" + selData.id)});
        let row = this.dgInvsCommis.datagrid("getSelected");
        if (row != null) {
            this.InvsCommisIndex = this.dgInvsCommis.datagrid("getRowIndex", row);
            if (this.InvsCommisIndex < 0) {
                this.InvsCommisIndex = 0;
            }
        }
    }
    /**
     * Обновление верхнего грида
     * @constructor
     */
    Update(){
        let row = this.dgInvs.datagrid("getSelected");
        if (row != null) {
        this.InvsIndex = this.dgInvs.datagrid("getRowIndex", row);
        if (this.InvsIndex < 0) {
            this.InvsIndex = 1;
        }
    }

    this.dgInvs.datagrid({url: this.GetUrl("/Invs/List")});
}
    /**
     * Проверка прав пользователя
     * @constructor
     */
    LoadRights() {
        $.ajax({
            method: "get",
            url: this.GetUrl('/CoreUtils/GetActRights?TaskCode=Invs.dll&ActCode=InvsChange'),
            success: function (data) {
                if (data.length == 0) {
                    this.btnAddInvs.linkbutton({disabled: false});
                    this.btnDeleteInvs.linkbutton({disabled: false});
                    this.btnChangeInvs.linkbutton({disabled: false});
                    this.btnAddInvsCommis.linkbutton({disabled: false});
                    this.btnDeleteInvsCommis.linkbutton({disabled: false});
                    this.btnChangeInvsCommis.linkbutton({disabled: false});
                    this.editMode = true;
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * нажатие на кнопку добавить в верхнем гриде
     * @constructor
     */
    AddClickInvs(){
        let form = new InvsEdit();
        form.SetResultFunc((RecId)=>{
            this.InvsId = RecId;
            this.Update();
        });
        form.Show({AddMode: true, id: this.InvsId });
    }

    /**
     * выставление курсора на верхний грид
     */
    dgInvsList_onLoadSuccess(data){
        if(data.total>0) {
            if (this.InvsId != -1) {
                this.dgInvs.datagrid("selectRecord", this.InvsId);
            } else {
                if (this.InvsIndex >= 0 && this.InvsIndex < data.total) {
                    this.dgInvs.datagrid("selectRow", this.InvsIndex);
                } else if (data.total > 0) {
                    this.dgInvs.datagrid("selectRow", data.total - 1);
                }
            }
            this.InvsId = -1;
            this.InvsIndex = 0;
        }
    }
    /**
     * выставление курсора на нижний грид
     */
    dgInvsListCommis_onLoadSuccess(data){
        if(data.total>0) {
            if (this.InvsCommisId !== -1) {
                this.dgInvsCommis.datagrid("selectRecord", this.InvsCommisId);
            }
            else {
                if (this.InvsCommisIndex >= 0 && this.InvsCommisIndex < data.total) {
                    this.dgInvsCommis.datagrid("selectRow", this.InvsCommisIndex);
                } else if (data.total > 0) {
                    this.dgInvsCommis.datagrid("selectRow", data.total - 1);
                }
            }
            this.InvsCommisId = -1;
            this.InvsCommisIndex = 0;
        }
    }
    /**
     * Удаление
     * @returns {boolean}
     */
    btnDeleInvs(){
        if(this.dgInvs.datagrid("getRows").length === 0) {
            this.ShowWarning("Нет записей для удаления");
            return false;
        }
        let selData = this.dgInvs.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для удаления");
            return false;
        }
        let header = "Удаление";
        $.messager.confirm(header, "Вы действительно хотите удалить выделенную запись c id = " + selData.id + "?",
            function(result){
                if(result){
                    this.sLoc.StateLockRecord("invs", selData.id, this.btnDelInvsCont.bind(this));
                }
            }.bind(this));
    }

    /**
     * продолжение удаления
     */
    btnDelInvsCont(options){
        if(options.data.length > 0){
            this.ShowWarning(options.data);
        }
        else
        {
            $.ajax({
                method: "POST",
                url: this.GetUrl('/Invs/delete'),
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
     * Добавление
     * @param options
     */
    AddCommis(){
        let selData = this.dgInvs.datagrid("getSelected");
        if(selData === -1){ this.ShowWarning("Нет записей в списке инвентаризаций!"); return false;}
        let form = new InvsCommisEdit();
        form.SetResultFunc((RecId)=>{
            this.InvsCommisId = RecId;
            this.dgInvs_UpdateCommis();
        });
        form.Show({AddMode: true, id: this.InvsId, Invs_id: selData.id });
    }
    /**
     * Изменение
     * @param options
     */
    ChangeCommis(){
        if(this.dgInvsCommis.datagrid("getRows").length === 0) {
            this.ShowWarning("Нет записей для изменения");
            return false;
        }
        let selData = this.dgInvsCommis.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для изменения");
            return false;
        }
        this.sLoc.LockRecord("invs_commis", selData.id, this.ChangeCommisCont.bind(this));

    }
    /**
     * Продолжение изменения
     * @param options
     */
    ChangeCommisCont(options){

        if(options.lockMessage.length!=0){
            this.ShowSlide("Предупреждение", options.lockMessage)
            options.editMode = false;
        }
        else{
            if(options.editMode){
                options.lockState = true
            }
        }
        let form = new InvsCommisEdit();
        form.SetResultFunc((RecId)=>{  this.InvsCommisId = RecId; this.Update();});
        form.SetCloseWindowFunction((options)=>{
            if(options!=null){
                if(options.lockState){
                    this.sLoc.FreeLockRecord("invs_commis", options.id);
                }
            }
        });
        let i = this.editMode;
        form.Show(options,i);
    }
    /**
     * удаления
     * @param options
     */
    btnDeleInvsCommis(){
        if(this.dgInvsCommis.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для удаления");
            return false;
        }
        let selData = this.dgInvsCommis.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для удаления");
            return false;
        }
        let header = "Удаление";
        $.messager.confirm(header, "Вы действительно хотите удалить выделенную запись c id = " + selData.id + "?",
            function(result){
                if(result){
                    this.sLoc.StateLockRecord("invs_commis", selData.id, this.btnDelInvsCommisCont.bind(this));
                }
            }.bind(this));
    }

    /**
     * Продолжение удаления
     * @param options
     */
    btnDelInvsCommisCont(options){
        if(options.data.length > 0){
            this.ShowWarning(options.data);
        }
        else
        {
            $.ajax({
                method: "POST",
                url: this.GetUrl('/Invs/delete_commis'),
                data: {id: options.id},
                success:function(data){
                    if(data.length) {
                        this.ShowWarning(data);
                    }
                    else{
                        this.dgInvs_UpdateCommis();
                    }
                }.bind(this),
                error:function(data){ this.ShowErrorResponse(data.responseJSON); }.bind(this)
            });
        }
    }
}
/**
 * Функция встраиваемого запуска модуля
 * @param Id идентификатор
 * @constructor
 */
export function StartNestedModul(Id)  {
    let form = new Invs("nested_", {});
    form.Start(Id);
}


export function StartModalModul(StartParams, ResultFunc) {
    let id = "wInvs_Module_Invs_InvsFormList";//идентификатор диалогового окна
    CreateModalWindow(id, "Справочник инвентаризаций");//функция создания диалогового окна для модуля
    let form = new Invs("modal_", StartParams);
    form.SetResultFunc(ResultFunc);
    form.Start(id);
}
