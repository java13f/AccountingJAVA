import {FormView} from "../Core/FormView.js";

export class OrderWearChange extends FormView {
    constructor() {
        super();
        this.Order = {};
        this.Orders = null;
        this.Mode = null;
        this.OrderDate = null;
    }

    Start(options) {
        this.Order.orderId = options.orderId;
        this.Order.objId = options.objId;
        this.Order.uniqId = "";
        this.Mode = "add";
        this.Orders = options.orders;
        this.OrderDate = options.date;
        LoadForm("#ModalWindows", this.GetUrl("/OrderWear/OrderWearChangeForm"), this.InitFunc.bind(this));
    }

    InitFunc() {
        this.InitComponents("wOrderWearChange_Module_OrderWear", "");
        this.InitCloseEvents(this.wOrderWearChange);
        this.btnCancel.linkbutton({onClick: ()=>{this.wOrderWearChange.window("close")}});
        this.btnAddObj.linkbutton({onClick: this.btnAddObj_onClick.bind(this)});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.tbAmount.numberbox({
            min: -2000000000,
            max: 2000000000
        });
        this.tbAmount.numberbox("setValue", 0);
        if(this.Order.orderId !== -1){
            this.tbId.textbox("setText", this.Order.orderId);
        }
        if(this.Order.objId !== -1) {
            this.GetObject(this.Order.objId).catch(reason => this.ShowErrorResponse(reason.responseJSON));
        }

        for(let i = 0; i < this.Orders.length; i++){
            if(this.Order.orderId === this.Orders[i].orderId && this.Order.objId === this.Orders[i].objId){
                this.Order.uniqId = this.Orders[i].uniqId;
                this.tbAmount.numberbox("setValue", this.Orders[i].amount);
                this.Mode = "change";
            }
        }
        let title = 'Добавление записи';
        if(this.Order.objId !== -1){
            title = 'Редактирование записи';
        }
        this.lbTitle.html(title);
        this.wOrderWearChange.window({title: title});
    }

    btnAddObj_onClick() {
        StartModalModulGlobal("Objs", {}, (async (data) => {
            if (data.id !== -1) {
                await this.CheckExpObjs(data.id, this.OrderDate).catch(reason => this.ShowErrorResponse(reason.responseJSON));
            }
        }).bind(this));
    }

    CheckExpObjs(objectid, date){
        try {
            $.ajax({
                method: "get",
                url: this.GetUrl("/OrderWear/checkExpObjs?objid=" + objectid + "&date=" + date),
                success: function (data) {
                    if (data != "") {
                        this.ShowError(data);
                    } else {
                        this.GetObject(objectid);
                    }
                }.bind(this),
                error: function (data) {
                    this.ShowErrorResponse(data.responseJSON);
                }.bind(this)

            });
        } catch (e) {
            this.ShowError(e);
        }
    }

    btnOk_onClick(){
        let res = this.CheckForm();
        if(res.length === 0) {
            if(this.Mode === "add") {
                this.Orders.push({
                    orderId: this.Order.orderId,
                    objId: this.Order.objId,
                    uniqId: this.Order.uniqId,
                    invNo: this.Order.invNo,
                    name: this.Order.name,
                    del: 0,
                    amount: this.tbAmount.numberbox("getValue")
                });
            }
            else if (this.Mode === "change") {
                for (let i = 0; i < this.Orders.length; i++) {
                    if (this.Orders[i].uniqId === this.Order.uniqId){
                        this.Orders[i].objId = this.Order.objId;
                        this.Orders[i].invNo = this.Order.invNo;
                        this.Orders[i].name = this.Order.name;
                        this.Orders[i].amount = this.tbAmount.numberbox("getValue");
                    }
                }
            }
            else {
                this.ShowError("Операция добавления или редактирования не распознана");
                return;
            }
            this.ResultFunc({orderId: this.Order.orderId, objId: this.Order.objId});
            this.wOrderWearChange.window("close");
        }
        else {
            this.ShowError(res);
        }
    }

    CheckForm(){
        if(this.Order.objId === -1) {
            return "Не выбран объект";
        }
        for(let i = 0; i < this.Orders.length; i++){
            if(this.Orders[i].del === 0 && this.Orders[i].objId === this.Order.objId && this.Order.uniqId !== this.Orders[i].uniqId)
            {
                return "Выбранный объект уже есть в списке";
            }
        }
        if(this.tbAmount.numberbox("getValue") == 0){
            return "Сумма не может быть равной 0.00";
        }
        return "";
    }

    GetObject(id) {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "GET",
                url: this.GetUrl('/OrderWear/getObj?id=' + id),
                success: function (data) {
                    if (data !== null) {
                        this.tbObj.textbox("setText", data.id + " = " + data.name);
                        this.Order.objId = data.id;
                        if(this.Order.uniqId.length == 0) {
                            this.Order.uniqId = data.uniqid;
                        }
                        this.Order.name = data.name;
                        this.Order.invNo = data.invno;
                    } else {
                        this.ShowError("Не удалось получить объект.");
                    }
                    resolve(true);
                }.bind(this),
                error: function (data) {
                    reject(data);
                    this.ShowErrorResponse(data.responseJSON);
                }.bind(this)
            });
        });
    }
}
