import {FormView} from "../../static/Modules/Core/FormView.js";
import {OrderPeriodTypePermitsEdit} from "../../static/Modules/OrderPeriodTypePermits/OrderPeriodTypePermitsEdit.js";



class OrderPeriodTypePermits extends FormView{
    /**
     * Конструктор
     * @param prefix - приставка для идентификаторов. Данная приставка добавится для каждого идентификатора
     * @param StartParams - стартовые параметры в формате JSON
     */
    constructor(prefix, StartParams) {
        super();
        this.OrderId = -1;
        this.OrderIndex = 0;
        this.PeriodParamsId = -1;
        this.PeriodParamsIndex = 0;
        this.prefix = prefix;
        this.StartParams = StartParams;
        this.sLoc = new LibLockService(300000);
        this.idorders = 0;
        this.nameorders = "";
    }
    /**
     * Функция загрузки формы
     * @param id - идентификатор эелемента HTML, в который будет загружена разметка частичного представления
     * @constructor
     */
    Start(id){
        this.ModuleId = id;
        LoadForm("#"+this.ModuleId, this.GetUrl("/OrderPeriodTypePermits/OrderPeriodTypePermitsList"), this.InitFunc.bind(this));
    }
    /**
     * Функция инициализации
     * @constructor
     */
    InitFunc(){
        this.InitComponents(this.ModuleId, "");
        AddKeyboardNavigationForGrid(this.dgPeriodParams);
        this.btnAdd.linkbutton({disabled:true});
        this.btnChange.linkbutton({disabled:true});
        this.btnDelete.linkbutton({disabled:true});
        this.UpdateOrders_onClick();
        this.dgPeriodParams.datagrid({
            loadFilter: this.LoadFilter.bind(this),
            onLoadError:(data)=> {this.ShowErrorResponse(data.responseJSON);},
            onLoadSuccess: this.dgPeriod_onLoadSuccess.bind(this),
            onSelect: this.UpdateOrderPeriod_onClick.bind(this) // Обработка нажатия на грид
        });
        this.txFilter.textbox({onChange: this.UpdateOrderPeriod_onClick.bind(this)});
        this.btnDeleteFilter.linkbutton({onClick:this.btnDeleteFilter_onClick.bind(this)});
        this.btnDelete.linkbutton({onClick:this.btnDelete_onClick.bind(this)});
        this.btnUpdate.linkbutton({onClick: this.Updates.bind(this)});
        this.InitFuncPermits();

        this.btnAdd.linkbutton({onClick:this.AddClickOrder.bind(this)});
        this.btnChange.linkbutton({onClick:this.btnChange_Click.bind(this)});
    }
    InitFuncPermits(){
        this.dgOrderPeriodTypePermits.datagrid({
            loadFilter: this.LoadFilter.bind(this),
            //onSelect: this.Verification.bind(this),
            onLoadSuccess: this.dgOrder_onLoadSuccess.bind(this)
        })
    }

    /**
     * Обновление верхнего и нижнего грида
     * @constructor
     */
    Updates(){
        this.UpdateOrderPeriod_onClick();
        //this.UpdateOrders_onClick();
    }
    /**
     * Обновление списка записей в верхнем гриде
     */
    UpdateOrders_onClick(){
        let row = this.dgPeriodParams.datagrid("getSelected");
        if (row != null) {
            this.PeriodParamsIndex = this.dgPeriodParams.datagrid("getRowIndex", row);
            if (this.PeriodParamsIndex < 0) {
                this.PeriodParamsIndex = 0;
            }
        }
        this.dgPeriodParams.datagrid({url: this.GetUrl("/OrderPeriodTypePermits/ListOrder")});
    }

    /**
     * Выставление курсора верхний грид
     *
     */
    dgOrder_onLoadSuccess(data){
        if(data.total>0) {
            if (this.OrderId != -1) {
                this.dgOrderPeriodTypePermits.datagrid("selectRecord", this.OrderId);
            } else {
                if (this.OrderIndex >= 0 && this.OrderIndex < data.total) {
                    this.dgOrderPeriodTypePermits.datagrid("selectRow", this.OrderIndex);
                } else if (data.total > 0) {
                    this.dgOrderPeriodTypePermits.datagrid("selectRow", data.total - 1);
                }
            }
            this.OrderId = -1;
            this.OrderIndex = 0;
        }
    }
    /**
     * выставление курсора на нижный грид
     */
    dgPeriod_onLoadSuccess(data){
        if(data.total>0) {
            if (this.PeriodParamsId != -1) {
                this.dgPeriodParams.datagrid("selectRecord", this.PeriodParamsId);
            } else {
                if (this.PeriodParamsIndex >= 0 && this.PeriodParamsIndex < data.total) {
                    this.dgPeriodParams.datagrid("selectRow", this.PeriodParamsIndex);
                } else if (data.total > 0) {
                    this.dgPeriodParams.datagrid("selectRow", data.total - 1);
                }
            }
            this.PeriodParamsId = -1;
            this.PeriodParamsIndex = 0;
        }
    }
    /**
     * Обновление списка записей в нижнем гриде
     */
    UpdateOrderPeriod_onClick(){
        let row = this.dgOrderPeriodTypePermits.datagrid("getSelected");
        if (row != null) {
            this.OrderIndex  = this.dgOrderPeriodTypePermits.datagrid("getRowIndex", row);
            if (this.OrderIndex <= 0) {
                this.OrderIndex = 1;
            }

        }
        let selData = this.dgPeriodParams.datagrid("getSelected");
        this.btnAdd.linkbutton({disabled:false});
        this.btnDelete.linkbutton({disabled: false});
        this.btnChange.linkbutton({disabled: false});
        this.idorders = selData.orderid;
        this.nameorders = selData.ordername;
        let filter = this.txFilter.textbox("getText");//Получаем значение фильтра по коду
        filter = encodeURIComponent(filter);
        this.dgOrderPeriodTypePermits.datagrid({url: this.GetUrl("/OrderPeriodTypePermits/ListPeriod?id="+ selData.orderid + "&filter=" + filter)});
    }

    /**
     * нажание на нижный грид
     * @constructor
     */
    Verification(){
        this.UpdateOrderPeriod_onClick();
        this.LoadRights();
        let row = this.dgOrderPeriodTypePermits.datagrid("getSelected");
        if (row != null){
            this.btnChange.linkbutton({disabled:false});
            this.btnDelete.linkbutton({disabled:false});
        }
    }
    /**
     * Проверка прав пользователя
     * @constructor
     */
    LoadRights() {
        $.ajax({
            method: "get",
            url: this.GetUrl('/CoreUtils/GetActRights?TaskCode=OrderPeriodTypePermits.dll&ActCode=OrderPeriodTypePermitsChange'),
            success: function (data) {
                if (data.length == 0) {
                    this.btnAdd.linkbutton({disabled: false});
                    this.btnDelete.linkbutton({disabled: false});
                    this.btnChange.linkbutton({disabled: false});
                    this.editMode = true;
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Очистка поля фильтра
     */
    btnDeleteFilter_onClick(){
        this.txFilter.textbox("setValue") == "";
        this.UpdateOrderPeriod_onClick();
    }
    AddClickOrder(){
        let form = new OrderPeriodTypePermitsEdit();//Ссоздание формы редактирования
        form.SetResultFunc((RecId)=>{
            this.PeriodParamsId = RecId;
            this.UpdateOrderPeriod_onClick();
        });

        form.Show({AddMode: true, id: this.idorders, name: this.nameorders });//Показать форму
    }

    /**
     * Проверкана на заполнение при редактировании
     * @returns {boolean}
     */
    btnChange_Click(){
        if(this.dgOrderPeriodTypePermits.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для изменения");
            return false;
        }
        let selData = this.dgOrderPeriodTypePermits.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для изменения");
            return false;
        }
        let editMode = true;
        if(editMode){
            this.sLoc.LockRecord("OrderPeriodTypePermits", selData.id ,  this.btnContinueChange_onClick.bind(this));
        }
        else {
            this.btnContinueChange_onClick({id: selData.id, AddMode:false, editMode: editMode, lockMessage:'',lockState: false, name: selData.name});
        }
    }
    /**
     * открытие формы редактирывания
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
        let form = new OrderPeriodTypePermitsEdit();
        form.SetResultFunc((RecId)=>{  this.OrderId = RecId; this.UpdateOrderPeriod_onClick();});
        form.SetCloseWindowFunction((options)=>{
            if(options!=null){
                if(options.lockState){
                    this.sLoc.FreeLockRecord("orderperiodtypepermits", options.id);
                }
            }
        });
        form.Show(options);
    }

    /**
     * нажание и проверка при удалении
     * @returns {boolean}
     */
    btnDelete_onClick(){
        if(this.dgOrderPeriodTypePermits.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для удаления");
            return false;
        }
        let selData = this.dgOrderPeriodTypePermits.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для удаления");
            return false;
        }
        let header = "Удаление";
        $.messager.confirm( header ,"Вы хотите удалить запись c id="+selData.id + "?",
            function(result){
                if(result){
                    this.sLoc.StateLockRecord("orderperiodtypepermits", selData.id , this.btnContinueDelete.bind(this));
                }
            }.bind(this));
    }
    /**
     * Удаление
     * @param options
     */
    btnContinueDelete(options){
        if(options.data.length > 0){
            this.ShowWarning(options.data);
        }
        else
        {
            $.ajax({
                method: "POST",
                url: this.GetUrl('/OrderPeriodTypePermits/delete'),
                data: {id: options.id},
                success:function(data){
                    if(data.length) {
                        this.ShowWarning(data);
                    }
                    else{
                        this.UpdateOrderPeriod_onClick();
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
    let form = new OrderPeriodTypePermits("nested_", "");
    form.Start(Id);
}