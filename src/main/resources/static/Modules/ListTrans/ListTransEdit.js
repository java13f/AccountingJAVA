import {FormView} from "../Core/FormView.js";

export class ListTransEdit extends FormView {

    constructor() {
        super();
        this.ordersid = -1;
        this.ListId = -1;
        this.RefferName = -1;
        this.paramid = -1;//параметр значения
        this.listName = "";
        this.ValuesId = -1;

    }

    Show(options,i) {

        this.options = options;
        this.i = i;
        LoadForm("#ModalWindows", this.GetUrl("/ListTrans/ListTransEdit"), this.InitFunc.bind(this));
    }

    InitFunc() {
        this.InitComponents("wListTransEdit_Module_ListTrans", "");
        this.InitCloseEvents(this.wListTransEdit);
        this.btnOrders.linkbutton({onClick: this.OpenModulOrders.bind(this)});
        this.LoadComboBox();
        this.cbParams.combobox({onSelect: this.cbValues_onSelect.bind(this)});
        this.btnValues.linkbutton({onClick: this.OpenModulValues.bind(this)});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({onClick:()=>{this.wListTransEdit.window("close")}});
        if (this.options.AddMode) {
            this.pbEditMode.attr("class", "icon-addmode");
            this.wListTransEdit.window({title: "Добавление новой записи"});
            this.lAction.html("Введите данные для новой записи");
            this.ValuesId = 1;
        }
        else {
            this.pbEditMode.attr("class", "icon-editmode");
            this.wListTransEdit.window({title: "Редатирование записи"});
            this.lAction.html("Введите данные для редактирования текущей записи");
            if (this.options.editMode) {
                this.btnOk.linkbutton({disabled: false});
            } else {
                this.btnOk.linkbutton({disabled: true});

            }
            if(!this.i){
                this.btnOk.linkbutton({disabled: true});
            }
            this.ValuesId = 0;
            this.UpdateTextBox();

        }

    }

    /**
     * получение значений в поля при открытии на редактирование
     * @constructor
     */
    UpdateTextBox(){

        $.ajax({
            method:"get",
            url: this.GetUrl('/ListTrans/get?id='+ this.options.id),
            success: function(data){
                this.txId.textbox("setText", data.id);
                this.ordersid = data.order;
                this.ListId = data.params;
                this.In_TextBoxOrder();
                this.LoadComboBox();
                let name = data.tables;
                let id = data.values;
                if(name == ""){
                    this.txValues.textbox("setText", data.values);
                }
                else{
                this.LoadVal(id,name);
                }

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
     * Заполнение поля "Значение"
     * @param id
     * @param name
     * @constructor
     */
    LoadVal(id,name){
    if(name == ""){
        this.txValues.textbox("setText", id);
    }
    else{
        this.SetTextOnModul(id,name);
    }

}

    /**
     * Открытие модуля Orders
     * @constructor
     */
    OpenModulOrders(){
        StartModalModulGlobal("Orders", {}, ((data) =>{
            this.ordersid = data.id;
            this.In_TextBoxOrder();
        }).bind(this));
    }

    /**
     * Открытие модуля в зависимости от значения в поле "параметр"
     * @constructor
     */
    OpenModulValues(){
let name = this.paramid;

        StartModalModulGlobal(name, {}, ((data) => {
            this.SetTextOnModul(data.id, name);
        }).bind(this));


        // let txparams = this.listName;
        // let params = txparams.split(' = ');
        // let id = params[0];
        // let type = "ListParams";
        // let paramcode = params[1];
        // let tasccode = this.paramid;
        // StartModalModulGlobal("ParamRefEdit", {id: id, type: type , paramcode: paramcode,tasccode: tasccode},  ((data) =>{
        //     // this.ordersid = data.id;
        //     // this.In_TextBoxOrder();
        // }).bind(this));
    }

    /**
     * получение значения в поле значения
     * @param id
     * @param name
     * @constructor
     */

    SetTextOnModul(id,name){
        $.ajax({
            method:"get",
            url: this.GetUrl('/ListTrans/getValuesText?id=' + id+'&name='+name),
            success: function(data){
                this.txValues.textbox("setValue" , data);
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * получене записи в поле заявка
     * @constructor
     */
    In_TextBoxOrder(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/ListTrans/getOrders?id=' + this.ordersid.toString()),
            success: function(data){
            this.txOrders.textbox("setValue" , data);
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * загрузка combobox
     * @constructor
     */
    LoadComboBox() {
        $.ajax({
            method: "get",
            url: this.GetUrl('/ListTrans/GetListParams'),
            success: function (data) {
                this.cbParams.combobox({
                    valueField: 'id',
                    textField: 'name',
                    data: data
                });
                if (this.ListId != -1) {
                    for (let iList = 0; iList < data.length; iList++) {
                        let list = data[iList];
                        if (list.id == this.ListId) {
                            this.cbParams.combobox("setValue", this.ListId);
                        }
                    }
                }

            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * выбор значения в Сombobox
     * @param record
     */
    cbValues_onSelect(record) {
        this.ListId = record.id;
        this.listName = record.name;
         this.LoadParams();

    }

    /**
     * обработака значения в combobox и выставление доступнасти на поле значение и на кнопку значения
     * @constructor
     */
    LoadParams() {
        $.ajax({
            method: "get",
            url: this.GetUrl('/ListTrans/GetReffers?id=' + this.ListId),
            success: function (data) {
                let name = data;
                this.paramid = data;
                if (name == "") {
                    this.txValues.textbox({disabled: false});
                    this.btnValues.linkbutton({disabled: true});

                    if (this.ValuesId == 1){
                        this.txValues.textbox("setText","");
                    }
                } else {
                    this.txValues.textbox({disabled: true});
                    this.btnValues.linkbutton({disabled: false});
                    if (this.ValuesId == 1){
                    this.txValues.textbox("setText","");
                    }
                }
                    this.ValuesId = 1;

            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Нажатие на кнопку ОК
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
        let txorder =  this.txOrders.textbox("getText");
        let order = txorder.split('=');
        let txparams = this.listName;
        let params = txparams.split(' = ');
        let txvalues = this.txValues.textbox("getText");

        let val;
        let values;
        if (this.paramid == ""){ values = txvalues; }  else{val = txvalues.split(' = '); values = val[0]}
        let ord = this.txOrders.textbox("getText");
        let valu = this.txValues.textbox("getText");
        if(ord.trim() == ""){
            this.ShowToolTip("#divtbOrder_Module_ListTrans","Заполните поле \"Заявка\"",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }
        if(params[0] == ""){
            this.ShowToolTip("#divtbParams_Module_ListTrans","Заполните поле \"Параметр\"",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }
        if(valu.trim() ==""){
            this.ShowToolTip("#divtbValues_Module_ListTrans","Заполните поле \"Значение\"",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }

        let obj = {id: id , order: order[0], params: params[1],values: values};
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
            url: this.GetUrl('/ListTrans/exists?id=' + obj.id.toString() + '&order='+obj.order + '&params='+obj.params ),
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
            url: this.GetUrl('/ListTrans/save'),
            contentType: "application/json; charset=utf-8",
            success: function(data){
                if(this.ResultFunc!=null)
                {
                    this.ResultFunc(data);
                    this.wListTransEdit.window("close");
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }
}