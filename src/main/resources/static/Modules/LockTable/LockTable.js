import {FormView} from "../Core/FormView.js";
class LockTable extends  FormView {
    constructor(prefix, StartParams) {
        super();
        this.lockId = "";
        this.LockTableIndex = 0;
        this.prefix = prefix;
        this.StartParams = StartParams;
        this.sLoc = new LibLockService(300000);
    }

    Start(id){
        this.ModuleId = id;
        LoadForm("#"+this.ModuleId, this.GetUrl("/LockTable/LockTableFormList"), this.InitFunc.bind(this));
        //LoadForm("#ModalWindows", this.GetUrl("/LockTable/LockTableFormList"), this.InitFunc.bind(this));
    }
    InitFunc(){
        this.InitComponents(this.ModuleId, "");
        AddKeyboardNavigationForGrid(this.dgLockTable);
        this.dgLockTable.datagrid({
            loadFilter:this.LoadFilter.bind(this),
            onLoadError:(data)=>{ this.ShowErrorResponse(data.responseJSON); },
            onLoadSuccess: this.dgLockTable_onLoadSuccess.bind(this)
        });
        this.btnUpdate.linkbutton({onClick: this.btnUpdate_onClick.bind(this)});
        this.txFilter.textbox({onChange: this.btnUpdate_onClick.bind(this)});
        this.LoadRights();
        this.btnUnlock.linkbutton({onClick:this.UnlockData_onClick.bind(this)});
        this.btnUpdate_onClick();//вызовем функцию обновления
    }
    /**
     * Обновление
     */
    btnUpdate_onClick(){
        let row = this.dgLockTable.datagrid("getSelected");
        if(row!=null) {
            this.LockTableIndex = this.dgLockTable.datagrid("getRowIndex", row);
            if(this.LockTableIndex <0 ){this.LockTableIndex = 0;}
        }
        let filter = this.txFilter.textbox("getText");//Получаем значение фильтра по коду
        filter = encodeURIComponent(filter);//Кодируем значение фильтра в часть url-а
        this.dgLockTable.datagrid({url: this.GetUrl("/LockTable/list?Filter=" + filter )});
    }

    /**
     * Получение время блокировки / проверки
     * @returns {boolean}
     * @constructor
     */
    UnlockData_onClick(){
        if(this.dgLockTable.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для разблокирвки");
            return false;
        }

        let selData = this.dgLockTable.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для разблокировки");
            return false;
        }
        $.ajax({
            method:"get",
            url: this.GetUrl('/LockTable/getDate?id='+selData.id),
            success: function(data){
                this.Minutes = data.min;
                this.Hours = data.hour;
                this.Seconds = data.seconds;
                this.btnUnlock_onClick();
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)

        });

    }

    /**
     *Разблокирование записи
     */
    btnUnlock_onClick(){
        let selData = this.dgLockTable.datagrid("getSelected");
         let header = "Разблокировать";
        $.messager.confirm({
            title: header,
            msg: 'Вы действительно хотите разблокировать запись с id = '+ selData.recid +' ?',
            fn: function (result) {
                if (result) {
                    let header = "Предупреждение";
                    if (this.Minutes < 10 && this.Hours === 0) {
                            $.messager.confirm({
                            title: header,
                            msg: 'С момента блокировки прошло меньше 10 минут ',
                            fn: function (result) {
                                if (result) {
                                        this.btnContinueUnlock_onClick();
                                }
                            }.bind(this)
                        });
                }

                    else{
                          this.btnContinueUnlock_onClick();
                    }
                }
            }.bind(this)
        });
    }
    /**
     * Прподолжение разблокирывания
     *
     * @param options
     */
    btnContinueUnlock_onClick(){
        let selData = this.dgLockTable.datagrid("getSelected");

            $.ajax({
                method: "POST",
                url: this.GetUrl('/LockTable/unlock'),
                data: {id: selData.id},
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
    /**
     * Обработка окончания загрузки списка
     * @param data - информация о загруженных данных
     */
    dgLockTable_onLoadSuccess(data){
        
        if(data.total>0) {
            if(this.LockId != "") {
                this.dgLockTable.datagrid("selectRecord", this.LockId);
            }
            else {
                if(this.LockTableIndex>=0&& this.LockTableIndex < data.total) {
                    this.dgLockTable.datagrid("selectRow", this.LockTableIndex);
                }
                else if (data.total>0) {
                    this.dgLockTable.datagrid("selectRow", data.total-1);
                }
            }
            this.LockId = "";
            this.LockTableIndex = 0;
        }
    }
    /**
     * Проверка прав
     */
    LoadRights(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/CoreUtils/GetActRights?TaskCode=LockTable.dll&ActCode=LockTableChange'),
            success: function(data){
                if(data.length == 0){
                    this.btnUnlock.linkbutton({disabled:false});
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }
}
    export function StartNestedModul(Id) {
        let form = new LockTable("nested_", {});
        form.Start(Id);
    }
