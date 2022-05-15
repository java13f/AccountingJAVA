import {FormView} from "../Core/FormView.js";
import {OrderListTypePermitsOpenModule} from "./OrderListTypePermitsOpenModule.js";


export class OrderListTypePermitsEdit extends FormView {
    constructor() {
        super();
        this.OrderId = -1;
        this.UserId = -1;
        this.propertyid = "";
    }

    Show(options) {
        this.options = options;
        LoadForm("#ModalWindows", this.GetUrl("/OrderListTypePermits/OrderListTypePermitsEdit"), this.InitFunc.bind(this));
    }
    InitFunc(){
        this.InitComponents("wOrderListTypePermitsEdit_Module_OrderListTypePermits", ""); //Автоматическое получение идентификаторов формы
        this.InitCloseEvents(this.wOrderListTypePermitsEdit);
        this.btnCancel.linkbutton({onClick:()=>{this.wOrderListTypePermitsEdit.window("close")}});
        this.btnClear.linkbutton({onClick:()=>{this.txListParam.textbox("setText", "")}});
        this.btnOk.linkbutton({onClick: ()=>{this.btnOk_onClick()}});
        this.btnOpenModul.linkbutton({onClick: this.btListParams_onClickButton.bind(this)});
        if (this.options.AddMode) {
            this.pbEditMode.attr("class", "icon-addmode");
            this.wOrderListTypePermitsEdit.window({title: "Добавление новой записи"});
            this.lAction.html("Введите данные для новой записи");
            //let id = this.options.id;
            this.txOrderType.textbox("setText",(this.options.id + " = "+ this.options.name))

            }
        else {
            this.pbEditMode.attr("class", "icon-editmode");
            this.wOrderListTypePermitsEdit.window({title: "Редатирование записи"});
            this.lAction.html("Введите данные для редактирования текущей записи");
            if (this.options.editMode) { //editMode: true - запсь открыта на редактирование, false - запись открыта на просмотр. Данная насройка нужна только для изменения или просмотра записи
                this.btnOk.linkbutton({disabled: false});
            } else {
                this.btnOk.linkbutton({disabled: true});

            }
            this.UpdateTextBox();
        }
}


    /**
     * вызов окна
     */
    btListParams_onClickButton(){
        let form = new OrderListTypePermitsOpenModule();
        form.SetResultFunc((id)=>{
            this.propertyid = id.id;
            this.GetOrder();
        });
        form.Show({AddMode: true});
    }

    /**
     * Обновление текстовых полей
     * @constructor
     */
    UpdateTextBox(){

        $.ajax({
            method:"get",
            url: this.GetUrl('/OrderListTypePermits/getOrderListTypePerById?id='+ this.options.id),
            success: function(data){
                if (data.visible == 1) {
                    this.cbVisible.checkbox("check")
                }
                this.txId.textbox("setText", data.id);

                this.txOrderType.textbox("setText", data.orderTypeId);
                this.txListParam.textbox("setText" , data.listParamId);

                this.txCreator.textbox("setText", data.creator);
                this.txCreated.textbox("setText", data.created);
                this.txChanger.textbox("setText", data.changer);
                this.txChanged.textbox("setText", data.changed);
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Полученеи списка записей
     * @constructor
     */
    GetOrder(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/OrderListTypePermits/getListParamById?id='+ this.propertyid),
            success: function(data){
               this.txListParam.textbox("setText", data);
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Обработка нажития кнопки ОК
     * @returns {boolean}
     */
    btnOk_onClick() {
        let id;

        if (this.txId.textbox("getText") == ""){
            id = -1
        }
        else{
            id = this.txId.textbox("getText");
        }

        let orderTypeId =  (this.txOrderType.textbox("getText")).split(" =");
        let visible = this.cbVisible.checkbox("options").checked ? 1 : 0;
        let listParamId =  (this.txListParam.textbox("getText")).split(" =");

        if (listParamId[0] == "") {
            this.ShowToolTip('#txListParam_Module_OrderListTypePermits_toolTip', 'Выберите пожалуйста реквизит!', {icon:'icon-no', title:'Внимание', position:'right', delay:5000})
            return false;
        }
        let obj = {id: id , orderTypeId: orderTypeId[0], listParamId: listParamId[0], visible: visible};
        this.ExistSave(obj);
    }

    /**
     * проверка на уникальность
     * @param obj
     * @constructor
     */
    ExistSave(obj){
        $.ajax({
            method:"get",
            url: this.GetUrl('/OrderListTypePermits/exists?id=' + parseInt(obj.id) + '&orderTypeId='+parseInt(obj.orderTypeId) + '&listParamId='+parseInt(obj.listParamId)),
            success: function(data){
                if(data){
                    this.ShowWarning("Запись с указанным реквизитом уже существует.");
                }
                else{
                    this.Save(obj);
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * функция сохранения
     * @param obj
     * @constructor
     */
    Save(obj){
        $.ajax({
            method:"POST",
            data: JSON.stringify(obj),
            url: this.GetUrl('/OrderListTypePermits/save'),
            contentType: "application/json; charset=utf-8",
            success: function(data) {
                if(this.ResultFunc!=null)
                {
                    this.ResultFunc(data);
                    this.wOrderListTypePermitsEdit.window("close");
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }
}
