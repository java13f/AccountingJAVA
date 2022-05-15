import {FormView} from "../Core/FormView.js";
import {OrderPeriodTypePermitsOpenModule} from "./OrderPeriodTypePermitsOpenModule.js";


export class OrderPeriodTypePermitsEdit extends FormView {
    constructor() {
        super();
        this.OrderId = -1;
        this.UserId = -1;
        this.propertyname = "";
        this.propertyid = "";
    }

    Show(options) {
        this.options = options;
        LoadForm("#ModalWindows", this.GetUrl("/OrderPeriodTypePermits/OrderPeriodTypePermitsEdit"), this.InitFunc.bind(this));
    }
    InitFunc(){
        this.InitComponents("wOrderPeriodTypePermitsEdit_Module_OrderPeriodTypePermits", ""); //Автоматическое получение идентификаторов формы
        this.InitCloseEvents(this.wOrderPeriodTypePermitsEdit);
        this.btnCancel.linkbutton({onClick:()=>{this.wOrderPeriodTypePermitsEdit.window("close")}});
        this.btnClear.linkbutton({onClick:()=>{this.txProperty.textbox("setText", "")}});
        this.btnOk.linkbutton({onClick: ()=>{this.btnOk_onClick()}});
        this.btnOpenModul.linkbutton({onClick: this.btPeriodParams_onClickButton.bind(this)});
        if (this.options.AddMode) {
            this.pbEditMode.attr("class", "icon-addmode");
            this.wOrderPeriodTypePermitsEdit.window({title: "Добавление новой записи"});
            this.lAction.html("Введите данные для новой записи");
            //let id = this.options.id;
            this.txObj.textbox("setText",(this.options.id + " = "+ this.options.name))

            }
        else {
            this.pbEditMode.attr("class", "icon-editmode");
            this.wOrderPeriodTypePermitsEdit.window({title: "Редатирование записи"});
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
    btPeriodParams_onClickButton(){
        let form = new OrderPeriodTypePermitsOpenModule();
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
            url: this.GetUrl('/OrderPeriodTypePermits/get?id='+ this.options.id),
            success: function(data){
                if (data.visible == 1) {
                    this.cbVisible.checkbox("check")
                }
                this.txId.textbox("setText", data.id);
                this.txObj.textbox("setText", data.name);
                this.txProperty.textbox("setText" , data.type);
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
            url: this.GetUrl('/OrderPeriodTypePermits/GetProperty?id='+ this.propertyid),
            success: function(data){
               this.txProperty.textbox("setText", data);
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
        let orderType =  this.txObj.textbox("getText");
        let type = orderType.split('=');//this.options.id;
        let visible = this.cbVisible.checkbox("options").checked ? 1 : 0;
        let orderName =  this.txProperty.textbox("getText");
        let name = orderName.split('=');//this.options.id;
        //let name = this.propertyid;
        if (name[0] == "") {
            this.ShowError("Выберите пожалуйста реквизит!");
            return false;
        }
        let obj = {id: id , type: type[0], name: name[0],visible: visible};
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
            url: this.GetUrl('/OrderPeriodTypePermits/exists?id=' + obj.id.toString() + '&type='+obj.type + '&name='+obj.name),
            success: function(data){
                if(data){
                    this.ShowWarning("Такая запись уже существует в баз данных!");
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
            url: this.GetUrl('/OrderPeriodTypePermits/save'),
            contentType: "application/json; charset=utf-8",
            success: function(data){
                if(this.ResultFunc!=null)
                {
                    this.ResultFunc(data);
                    this.wOrderPeriodTypePermitsEdit.window("close");
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }
}
