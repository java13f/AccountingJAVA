import {FormView} from "../Core/FormView.js";
import {ListTransEdit } from "./ListTransEdit.js";


class ListTrans extends FormView {

    constructor(prefix, StartParams) {
        super();
        this.ListTansId = -1;
        this.ListTransIndex = 0;
        this.prefix = prefix;
        this.StartParams = StartParams;
        this.sLoc = new LibLockService(300000);

    }
    Start(id){
        this.ModuleId = id;
        LoadForm("#"+this.ModuleId, this.GetUrl("/ListTrans/ListTransList"), this.InitFunc.bind(this));
    }

    InitFunc(){
        this.InitComponents(this.ModuleId, "");
        AddKeyboardNavigationForGrid(this.dgListTrans);
        this.UpdateListTrans();
        this.LoadRights();

        this.dgListTrans.datagrid({
            loadFilter: this.LoadFilter.bind(this),
            onLoadError:(data)=> {this.ShowErrorResponse(data.responseJSON);},
             onLoadSuccess: this.On_LoadListTrans.bind(this)
            // onSelect: this.UpdateOrderPeriod_onClick.bind(this)
        });
        this.btnAdd.linkbutton({onClick: this.btnAdd_onClick.bind(this)});
        this.btnChange.linkbutton({onClick: this.btnChange_onClick.bind(this)});
        this.btnDelete.linkbutton({onClick: this.btnDelete_onClick.bind(this)});
        this.btnUpdate.linkbutton({onClick: this.UpdateListTrans.bind(this)});
    }

    /**
     * Выставление фокуса на нужную запись
     * @param data
     * @constructor
     */
    On_LoadListTrans(data) {
        if (data.total > 0) {
            if (this.ListTansId != -1) {
                this.dgListTrans.datagrid("selectRecord", this.ListTansId);
            }
            else {
                if (this.ListTransIndex >= 0 && this.ListTransIndex < data.total) {
                    this.dgListTrans.datagrid("selectRow", this.ListTransIndex);
                }
                else if (data.total > 0) {
                    this.dgListTrans.datagrid("selectRow", data.total - 1);
                }
            }
            this.ListTansId = -1;
            this.ListTransIndex = 0;
        }
    }

    /**
     * Удаление
     * @returns {boolean}
     */
    btnDelete_onClick(){
        if(this.dgListTrans.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для удаления");
            return false;
        }
        let selData = this.dgListTrans.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для удаления");
            return false;
        }
        let header = "Удаление";
        $.messager.confirm(header, "Вы действительно хотите удалить выделенную запись c id = " + selData.id + "?",
            function(result){
                if(result){
                    this.sLoc.StateLockRecord("listtrans", selData.id, this.btnContinueDelete_onClick.bind(this));
                }
            }.bind(this));
    }

    /**
     * продолжение удаления
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
                url: this.GetUrl('/ListTrans/delete'),
                data: {id: options.id},
                success:function(data){
                    if(data.length) {
                        this.ShowWarning(data);
                    }
                    else{
                        this.UpdateListTrans();
                    }
                }.bind(this),
                error:function(data){ this.ShowErrorResponse(data.responseJSON); }.bind(this)
            });
        }
    }


    /**
     * Обновление и вывод заисей в datagrid
     * @constructor
     */
    UpdateListTrans(){
        let row = this.dgListTrans.datagrid("getSelected");
        if (row != null) {
            this.ListTransIndex  = this.dgListTrans.datagrid("getRowIndex", row);
            if (this.ListTransIndex < 0) {
                this.ListTransIndex  = 0;
            }
        }

        this.dgListTrans.datagrid({url: this.GetUrl("/ListTrans/list")});
        }

    /**
     * проверка прав
     * @constructor
     */
    LoadRights() {
        $.ajax({
            method: "get",
            url: this.GetUrl('/CoreUtils/GetActRights?TaskCode=ListTrans.dll&ActCode=ListTransChange'),
            success: function (data) {
                if (data.length == 0) {
                    this.btnAdd.linkbutton({disabled: false});
                    this.btnDelete.linkbutton({disabled: false});
                    //this.btnChange.linkbutton({disabled: false});
                    this.editMode = true;
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * нажатие на кнопку добавить
     */
    btnAdd_onClick(){
        let form = new ListTransEdit();//Ссоздание формы редактирования
        form.SetResultFunc((RecId)=>{
            this.UpdateListTrans();
            this.ListTansId = RecId;
        });
        form.Show({AddMode: true});

    }

    /**
     * Обработка изменения записи
     */
    btnChange_onClick(){
        if(this.dgListTrans.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для изменения");
            return false;
        }
        let selData = this.dgListTrans.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для изменения");
            return false;
        }
            this.sLoc.LockRecord("listtrans", selData.id, this.btnContinueChange_onClick.bind(this));
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
        let form = new ListTransEdit();
        form.SetResultFunc((RecId)=>{  this.ListTansId = RecId; this.UpdateListTrans();});
        form.SetCloseWindowFunction((options)=>{
            if(options!=null){
                if(options.lockState){
                    this.sLoc.FreeLockRecord("listtrans", options.id);
                }
            }
        });
        let i = this.editMode;
        form.Show(options,i);
    }

}

/**
 * открытие модуля
 * @param Id
 * @constructor
 */
export function StartNestedModul(Id)  {
    let form = new ListTrans("nested_", "");
    form.Start(Id);
}