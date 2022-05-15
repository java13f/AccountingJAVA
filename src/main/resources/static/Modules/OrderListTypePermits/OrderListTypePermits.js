import {FormView} from "../Core/FormView.js";
import {OrderListTypePermitsEdit} from "./OrderListTypePermitsEdit.js";

class OrderListTypePermits extends FormView {
    /**
     * Конструктор
     * @param prefix - приставка для идентификаторов. Данная приставка добавится для каждого идентификатора
     * @param StartParams - стартовые параметры в формате JSON
     */
    constructor(prefix, StartParams) {
        super();
        this.OrderId = -1;
        this.OrderIndex = 0;
        this.ListParamsId = -1;
        this.ListParamsIndex = 0;
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
        LoadForm("#"+this.ModuleId, this.GetUrl("/OrderListTypePermits/OrderListTypePermitsList"), this.InitFunc.bind(this));
    }
    /**
     * Функция инициализации
     * @constructor
     */
    InitFunc(){
        this.InitComponents(this.ModuleId, "");
        AddKeyboardNavigationForGrid(this.dgOrderTypeList);
        this.btnAdd.linkbutton({disabled:true});
        this.btnChange.linkbutton({disabled:true});
        this.btnDelete.linkbutton({disabled:true});
        this.UpdateOrders_onClick();
        this.dgOrderTypeList.datagrid({
            loadFilter: this.LoadFilter.bind(this),
            onLoadError:(data)=> {this.ShowErrorResponse(data.responseJSON);},
            onLoadSuccess: this.dgList_onLoadSuccess.bind(this),
            onSelect: this.UpdateOrderList_onClick.bind(this) // Обработка нажатия на грид
        });
        this.txFilter.textbox({onChange: this.UpdateOrderList_onClick.bind(this)});
        this.btnClearFilter.linkbutton({onClick:this.btnClearFilter_onClick.bind(this)});
        this.btnDelete.linkbutton({onClick:this.btnDelete_onClick.bind(this)});
        this.btnUpdate.linkbutton({onClick: this.Updates.bind(this)});
        this.dgListParams.datagrid({
            loadFilter: this.LoadFilter.bind(this),
            //onSelect: this.Verification.bind(this),
            onLoadSuccess: this.dgOrder_onLoadSuccess.bind(this)
        })

        this.btnAdd.linkbutton({onClick:this.AddClickOrder.bind(this)});
        this.btnChange.linkbutton({onClick:this.btnChange_Click.bind(this)});
    }

    /**
     * Обновление верхнего и нижнего грида
     * @constructor
     */
    Updates(){
        this.UpdateOrderList_onClick();
    }
    /**
     * Обновление списка записей в верхнем гриде
     */
    UpdateOrders_onClick(){
        let row = this.dgOrderTypeList.datagrid("getSelected");
        if (row != null) {
            this.ListParamsIndex = this.dgOrderTypeList.datagrid("getRowIndex", row);
            if (this.ListParamsIndex < 0) {
                this.ListParamsIndex = 0;
            }
        }
        this.dgOrderTypeList.datagrid({url: this.GetUrl("/OrderListTypePermits/getOrderTypeList")});
    }

    /**
     * Выставление курсора верхний грид
     *
     */
    dgOrder_onLoadSuccess(data){
        if(data.total>0) {
            if (this.OrderId != -1) {
                this.dgListParams.datagrid("selectRecord", this.OrderId);
            } else {
                if (this.OrderIndex >= 0 && this.OrderIndex < data.total) {
                    this.dgListParams.datagrid("selectRow", this.OrderIndex);
                } else if (data.total > 0) {
                    this.dgListParams.datagrid("selectRow", data.total - 1);
                }
            }
            this.OrderId = -1;
            this.OrderIndex = 0;
        }
    }
    /**
     * выставление курсора на нижный грид
     */
    dgList_onLoadSuccess(data){
        if(data.total>0) {
            if (this.ListParamsId != -1) {
                this.dgOrderTypeList.datagrid("selectRecord", this.ListParamsId);
            } else {
                if (this.ListParamsIndex >= 0 && this.ListParamsIndex < data.total) {
                    this.dgOrderTypeList.datagrid("selectRow", this.ListParamsIndex);
                } else if (data.total > 0) {
                    this.dgOrderTypeList.datagrid("selectRow", data.total - 1);
                }
            }
            this.ListParamsId = -1;
            this.ListParamsIndex = 0;
        }
    }
    /**
     * Обновление списка записей в нижнем гриде
     */
    UpdateOrderList_onClick(){
        let row = this.dgListParams.datagrid("getSelected");
        if (row != null) {
            this.OrderIndex  = this.dgListParams.datagrid("getRowIndex", row);
            if (this.OrderIndex <= 0) {
                this.OrderIndex = 1;
            }
        }

        let selData = this.dgOrderTypeList.datagrid("getSelected");
        this.btnAdd.linkbutton({disabled:false});
        this.btnDelete.linkbutton({disabled: false});
        this.btnChange.linkbutton({disabled: false});
        this.idorders = selData.id;
        this.nameorders = selData.name;
        let filter = this.txFilter.textbox("getText");//Получаем значение фильтра по коду
        filter = encodeURIComponent(filter);
        this.dgListParams.datagrid({url: this.GetUrl("/OrderListTypePermits/getOrderListTypePerList?id="+ selData.id + "&filter=" + filter)});
    }

    /**
     * нажание на нижный грид
     * @constructor
     */
    Verification(){
        this.UpdateOrderList_onClick();
        this.LoadRights();
        let row = this.dgListParams.datagrid("getSelected");
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
            url: this.GetUrl('/CoreUtils/GetActRights?TaskCode=OrderListTypePermits.dll&ActCode=OrderListTypePermitsChange'),
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
    btnClearFilter_onClick(){
        this.txFilter.textbox("setValue") == "";
        this.UpdateOrderList_onClick();
    }
    AddClickOrder(){
        let form = new OrderListTypePermitsEdit();//Ссоздание формы редактирования
        form.SetResultFunc((RecId)=>{
            this.ListParamsId = RecId;
            this.UpdateOrderList_onClick();
        });

        form.Show({AddMode: true, id: this.idorders, name: this.nameorders });//Показать форму
    }

    /**
     * Проверкана на заполнение при редактировании
     * @returns {boolean}
     */
    btnChange_Click(){
        if(this.dgListParams.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для изменения");
            return false;
        }
        let selData = this.dgListParams.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для изменения");
            return false;
        }
        let editMode = true;
        if(editMode){
            this.sLoc.LockRecord("OrderListTypePermits", selData.id ,  this.btnContinueChange_onClick.bind(this));
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
        let form = new OrderListTypePermitsEdit();
        form.SetResultFunc((RecId)=>{  this.OrderId = RecId; this.UpdateOrderList_onClick();});
        form.SetCloseWindowFunction((options)=>{
            if(options!=null){
                if(options.lockState){
                    this.sLoc.FreeLockRecord("orderlisttypepermits", options.id);
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
        if(this.dgListParams.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для удаления");
            return false;
        }
        let selData = this.dgListParams.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для удаления");
            return false;
        }
        let header = "Удаление";
        $.messager.confirm( header ,"Вы хотите удалить запись c id="+selData.id + "?",
            function(result){
                if(result){
                    this.sLoc.StateLockRecord("orderlisttypepermits", selData.id , this.btnContinueDelete.bind(this));
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
                url: this.GetUrl('/OrderListTypePermits/delete'),
                data: {id: options.id},
                success:function(data){
                    if(data.length) {
                        this.ShowWarning(data);
                    }
                    else{
                        this.UpdateOrderList_onClick();
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
    let form = new OrderListTypePermits("nested_", "");
    form.Start(Id);
}