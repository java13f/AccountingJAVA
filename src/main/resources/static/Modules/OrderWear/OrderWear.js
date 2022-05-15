import {FormView} from "../Core/FormView.js";
import {OrderWearChange} from "./OrderWearChange.js";

class OrderWear extends FormView {
    constructor(prefix, StartParams) {
        super();
        this.Orders = [];
        this.StartParams = StartParams;
        this.OrderParentId = StartParams.orderid;
        this.OrderId = -1;
        this.ObjId = -1;
        this.No = "";
        this.OrderTypeId = StartParams.ordertype;
        this.InitUserId = -1;
        this.SttsList = [
            {"id": "1", "stts": 0, "name": "Новая"},
            {"id": "2", "stts": 3, "name": "Исполнена"}
        ];
        this.Stts = 0;
        this.okstate = false;
        this.okenabled = this.StartParams.lockstate;
    }
    /**
     * Функция загрузки формы
     * @param id - идентификатор эелемента HTML, в который будет загружена разметка частичного представления
     * @constructor
     */
    Start(id) {
        this.ModuleId = id;
        LoadForm("#ModalWindows", this.GetUrl("/OrderWear/OrderWearForm"), this.InitFunc.bind(this));
    }

    InitFunc() {
        this.InitComponents(this.ModuleId, "");
        this.SetCloseWindowFunction(async (options) => {
            this.ResultFunc({
                orderid: this.OrderParentId,
                lockstate: this.StartParams.lockstate,
                okstate: this.okstate
            });
        });
        this.InitCloseEvents(this.wOrderWear);
        this.btnCancel.linkbutton({onClick: ()=>{ this.wOrderWear.window("close") }});
        this.btnOk.linkbutton({
            onClick: this.btnOk_onClick.bind(this),
            disabled: !this.okenabled
        });
        this.btnAdd.linkbutton({
            onClick: this.btnAdd_onClick.bind(this),
            disabled: !this.StartParams.lockstate
        });
        this.btnChange.linkbutton({
            onClick: this.btnChange_onClick.bind(this),
            disabled: !this.StartParams.lockstate
        });
        this.btnDel.linkbutton({
            onClick: this.btnDel_onClick.bind(this),
            disabled: !this.StartParams.lockstate
        });
        this.dgvChilds.datagrid({
            singleSelect: true,
            rowStyler: this.dgvChilds_rowStyler.bind(this),
            onSelect: this.dgvChilds_OnSelect.bind(this),
        });
        this.dgvChilds.datagrid('getColumnOption', 'orderId').formatter = ((val, row)=> {
            return val === -1 ? "" : val;
        }).bind(this);
        this.dgvChilds.datagrid('getColumnOption', 'amount').formatter = ((val, row)=> {
            return this.number_format(row.amount,2,',',' ');
        }).bind(this);
        this.dgvChilds.datagrid('getColumnOption', 'amount').sorter = ((a, b)=> {
            return (parseFloat(a.replace(' ', '')) > parseFloat(b.replace(' ', '')) ? 1 : -1);
        }).bind(this);
        this.dgvChilds.datagrid('getColumnOption', 'invNo').sorter = ((a, b)=> {
            try {
                return (parseFloat(a.replace('-', '.')) > parseFloat(b.replace('-', '.')) ? 1 : -1);
            }
            catch (e) {
                return -1;
            }
        }).bind(this);
        this.dateBox.datebox({
            onChange: function(newValue,oldValue) {
                if (this.dtParser(newValue) == null) {
                    newValue = oldValue;
                }
            }.bind(this),
            formatter: this.dtFormatter.bind(this),
            parser: this.dtParser.bind(this)
        });
        if(this.OrderParentId === -1) {
            this.dateBox.datebox('setValue', this.dtFormatter(new Date()));
            this.GetNextNo(this.dtFormatter(new Date()));
        }
        else {
            this.GetOrderWearFromId(this.OrderParentId);
        }
        this.btnInit.linkbutton({onClick: this.btnInit_onClick.bind(this)});
        this.cbStts.combobox({
            valueField: "stts",
            textField: "name",
            onSelect: this.cbStts_onSelect.bind(this),
            data: this.SttsList
        });
        this.cbStts.combobox('setValue', this.Stts);
        this.InitAsync();
        AddKeyboardNavigationForGrid(this.dgvChilds);
    }

    async InitAsync(){
        let isLoadRights = await this.LoadRights().catch(reason => {
            this.ShowErrorResponse(reason.responseJSON)
            return false;
        });
        if (!isLoadRights) {
            return;
        }
        this.SetUserInit(this.InitUserId);
        if(this.OrderParentId !== -1) {
            await this.GetOrderWearFromId(this.OrderParentId);
        }
    }

    number_format(num,dig,dec,sep) {
        let x = new Array();
        let s = (num < 0? "-" : "");
        num = Math.abs(num).toFixed(dig).split(".");
        let r = num[0].split("").reverse();
        for(let i = 1; i <= r.length; i++){
            x.unshift(r[i-1]);
            if(i%3 == 0 && i != r.length)x.unshift(sep);
        }
        return s+x.join("") + (num[1] ? dec + num[1] : "");
    }

    dtFormatter(date){
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        let d = date.getDate();
        return (d < 10 ? ('0'+ d) : d) + '.' + (m < 10 ? ('0' + m) : m) + '.' + y;
    }

    dtParser(str){
        let t = Date.parse(str);
        let ss = (str.split('.'));
        let y = parseInt(ss[2],10);
        let m = parseInt(ss[1],10);
        let d = parseInt(ss[0],10);
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
            return new Date(y, m - 1, d);
        } else {
            return null;
        }
    }

    dgvChilds_OnSelect() {
        let row = this.dgvChilds.datagrid("getSelected");
        if(row != null){
            if(row.del === 0) {
                this.btnDel.linkbutton({iconCls:"icon-remove", text:"Удалить"});
            }
            else {
                this.btnDel.linkbutton({iconCls:"icon-undo", text:"Вернуть"});
            }
        }
        else {
            this.btnDel.linkbutton({iconCls:"icon-remove", text:"Удалить"});
        }
    }

    dgvChilds_rowStyler(index, row)
    {
        if(row.del === 1) {
            return "background-color:gray;";
        }
    }

    dgvChilds_Update(){
        this.dgvChilds.datagrid({data: this.Orders});
        let data = this.dgvChilds.datagrid('getData');
        for(let i = 0; i < data.rows.length; i++) {
            let row = data.rows[i];
            if(data.rows[i].orderId === this.OrderId && data.rows[i].objId === this.ObjId) {
                let index = this.dgvChilds.datagrid("getRowIndex", row);
                this.dgvChilds.datagrid("selectRow", index);
                return;
            }
        }
        this.dgvChilds.datagrid("selectRow", 0);
    }

    cbStts_onSelect(record){
        this.Stts = record.stts;
    }

    btnAdd_onClick(){
        let form = new OrderWearChange();
        form.SetResultFunc((obj)=>{
            this.OrderId = obj.orderId;
            this.ObjId = obj.objId;
            this.dgvChilds_Update();
        });
        if(this.dtParser(this.dateBox.datebox('getText')) == null){
            this.ShowError("Не верная дата заявки");
        }
        form.Start({ orderId: -1, objId: -1, date: this.dateBox.datebox('getText'), orders: this.Orders });
    }

    btnChange_onClick(){
        let row = this.dgvChilds.datagrid("getSelected");
        if (row != null && row.del === 0) {
            let form = new OrderWearChange();
            form.SetResultFunc((obj)=> {
                this.OrderId = obj.orderId;
                this.ObjId = obj.objId;
                this.dgvChilds_Update();
            });
            if(this.dtParser(this.dateBox.datebox('getText')) == null){
                this.ShowError("Не верная дата заявки");
            }
            form.Start({ orderId: row.orderId, objId: row.objId, date: this.dateBox.datebox('getText'), orders: this.Orders });
        }
        else if (row != null && row.del === 1){
            this.ShowWarning("Сначала восстановите удаленную запись");
        }
        else {
            this.ShowWarning("Не выбрана запись для редактирования");
        }
    }

    btnDel_onClick(){
        let row = this.dgvChilds.datagrid("getSelected");
        if(row != null) {
            if(row.del === 1){
                for(let i = 0; i < this.Orders.length; i++){
                    if(row.objId === this.Orders[i].objId && this.Orders[i].del === 0){
                        this.ShowError("Запись с id " + row.objId + " объекта уже есть в списке в активной записи");
                        return;
                    }
                }
            }
            row.del = 1 - row.del;
            this.OrderId = row.orderId;
            this.ObjId = row.objId;
            this.dgvChilds_Update();
        }
    }

    btnInit_onClick(){
        StartModalModulGlobal("Users", {}, (async (data) => {
            if (data.id !== -1) {
                await this.CheckInitUser(data.id).catch(reason => this.ShowErrorResponse(reason.responseJSON));
            }
        }).bind(this));
    }

    async GetOrderWearFromId(orderId){
        this.dgvChilds.datagrid('loading');
        this.btnOk.linkbutton({disabled: true});
        $.ajax({
            method: "get",
            url: this.GetUrl('/OrderWear/getOrderFromId?id=' + orderId),
            success: function (data) {
                this.Orders = data.objsList;
                this.OrderParentId = data.id;
                this.No = data.no;
                this.InitUserId = data.initUserId;
                this.Stts = data.stts;
                this.UpdateContrils(this.Stts);
                this.tbId.textbox('setValue', this.OrderParentId);
                this.tbNo.textbox('setValue', this.No);
                this.dateBox.datebox('setValue', data.date);
                this.cbStts.combobox('setValue', this.Stts);
                this.tbCreate.textbox('setValue', data.create);
                this.tbChange.textbox('setValue', data.change);
                this.SetUserInit(this.InitUserId);
                this.dgvChilds_Update();
                this.btnOk.linkbutton({disabled: !this.okenabled});
            }.bind(this),
            error: function (data) {
                this.dgvChilds.datagrid('loaded');
                this.btnOk.linkbutton({disabled: !this.okenabled});
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    UpdateContrils(stts){
        this.tbNo.textbox({disabled: stts !== 0});
        this.dateBox.datebox(stts === 0 ? "enable" : "disable");
        this.btnAdd.linkbutton({disabled: stts !== 0});
        this.btnChange.linkbutton({disabled: stts !== 0});
        this.btnDel.linkbutton({disabled: stts !== 0});
        this.btnInit.linkbutton({disabled: stts !== 0});
        this.tbInit.textbox({disabled: stts !== 0});
    }

    GetNextNo(date) {
        $.ajax({
            method: "get",
            url: this.GetUrl('/OrderWear/getNextNo?date=' + date),
            success: function (data) {
                this.tbNo.textbox('setValue', data);
                this.No = data;
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    SetUserInit(id){
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "get",
                url: this.GetUrl('/OrderWear/getUserFromId?id=' + id),
                success: function (data) {
                    this.tbInit.textbox('setValue', data.id + " = " + data.name);
                    this.InitUserId = data.id;
                    resolve(true);
                }.bind(this),
                error: function (data) {
                    reject(data);
                    this.ShowErrorResponse(data.responseJSON);
                }.bind(this)
            });
        });
    }

    async btnOk_onClick(){
        let obj = {
            orderParentId: this.OrderParentId,
            date: this.dateBox.datebox('getText'),
            stts: this.Stts,
            initUserId: this.InitUserId,
            no: this.tbNo.textbox('getText')
        };
        await this.ChkObj(obj).catch((data) => {
            if (data === false) {
                return false;
            }
        })
        for(let i = 0; i < this.Orders.length; i++){
            this.Orders[i].date = obj.date;
            this.Orders[i].stts = obj.stts;
            this.Orders[i].initUserId = obj.initUserId;
            this.Orders[i].no = obj.no;
            this.Orders[i].orderParentId = this.Orders[i].orderId !== obj.orderParentId || obj.orderParentId === -1 ? obj.orderParentId : -1;
            this.Orders[i].orderTypeId = this.OrderTypeId;
        }
        this.OrderParentId = await this.Save(this.Orders);
        this.ResultFunc({
            orderid: this.OrderParentId,
            lockstate: this.StartParams.lockstate,
            okstate: true
        });
        this.wOrderWear.window("close");
    }

    async ChkObj(obj){
    return new Promise(async (resolve, reject) => {
            this.btnOk.linkbutton({disabled: true});
            this.dgvChilds.datagrid('options').loadMsg = 'Проверка данных, пожалуйста подождите...';
            this.dgvChilds.datagrid('loading');
            if (obj.no.trim().length === 0) {
                this.ChkError('Введите номер заявки.');
                throw new Error(false);
            }
            if((obj.no != this.No && this.OrderParentId !== -1) || this.OrderParentId === -1) {
                let res = await this.ChkNo(obj);
                if (res.result == true) {
                    if (res.data.length > 0) {
                        $.messager.confirm("Предупреждение", res.data + "<br>Проставить новый номер автоматически?", async function (result) {
                            if (result) {
                                this.tbNo.textbox("setText", this.No);
                            }
                        }.bind(this));
                        throw new Error(false);
                    }
                } else {
                    this.ChkErrorResponse(res.data.responseJSON);
                    throw new Error(false);
                }
            }
            if (this.dtParser(obj.date) === null) {
                this.ChkError( 'Не выбрана дата заявки или дата указана не корректно');
                throw new Error(false);
            }
            let dayOpen = await this.CheckDay(this.dateBox.datebox("getText"));
            if (dayOpen === false) {
                this.ChkError("День с данной датой " + this.dateBox.datebox("getText") + " закрыт либо не был открыт вовсе.");
                throw new Error(false);
            }
            if (this.InitUserId === -1) {
                this.ChkError('Не выбран инициатор заявки.');
                throw new Error(false);
            }
            let rows = this.dgvChilds.datagrid('getData').rows;
            if(rows === null || rows.length === 0){
                this.ChkError('Нет ни одного добавленного объекта в заявку.');
                throw new Error(false);
            }
            let count = 0;
            let resExpChk = "";
            let ids = [];
            for(let i = 0; i < rows.length; i++){
                if(rows[i].del === 0){
                    count++;
                    ids.push(rows[i].objId);
                    //let res = await this.CheckExpObjs(rows[i].objId, this.dateBox.datebox("getText"));
                    //if(res.length > 0){
                    //    resExpChk += res + '<br><br>'
                    //}
                }
            }
            resExpChk = await this.CheckExpObjsArray(ids, this.dateBox.datebox("getText"));
            if(resExpChk.length > 0){
                this.ChkError(resExpChk);
                throw new Error(false);
            }
            if(count === 0){
                let errorText = this.OrderParentId == -1 ? 'Нет ни одного добавленного объекта в заявку' : 'Нельзя удалить все объекты из заявки. Если вы хотите удалить заявку, то сделайте это в списке заявок.';
                this.ChkError(errorText);
                throw new Error(false);
            }
            this.dgvChilds.datagrid('loaded');
            resolve(true);
        });
    }

    ChkError(mess){
        this.dgvChilds.datagrid('loaded');
        this.dgvChilds.datagrid('options').loadMsg = 'Идет загрузка, пожалуйста подождите...';
        this.btnOk.linkbutton({disabled: !this.okenabled});
        this.ShowError(mess);
    }

    ChkErrorResponse(mess){
        this.dgvChilds.datagrid('loaded');
        this.dgvChilds.datagrid('options').loadMsg = 'Идет загрузка, пожалуйста подождите...';
        this.btnOk.linkbutton({disabled: !this.okenabled});
        this.ShowErrorResponse(mess);
    }

    CheckExpObjsArray(objectids, date){
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "get",
                url: this.GetUrl("/OrderWear/checkExpObjsArray?objid=" + objectids + "&date=" + date),
                success: function (data) {
                    resolve(data)
                }.bind(this),
                error: function (data) {
                    resolve(data.responseJSON)
                }.bind(this)
            });
        });
    }

    ChkNo(obj){
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "get",
                url: this.GetUrl('/OrderWear/chkNo?no=' + obj.no + '&date=' + obj.date),
                success: function (data) {
                    resolve({data: data, result: true});
                }.bind(this),
                error: function (data) {
                    resolve({data: data, result: false});
                }.bind(this)
            })
        });
    }

    CheckDay(date) {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "get",
                url: this.GetUrl('/OrderWear/checkDay?date=' + date),
                success: function (data) {
                    resolve(data);
                }.bind(this),
                error: function (data) {
                    reject(data);
                }.bind(this)
            })
        });
    }

    LoadRights() {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "get",
                url: this.GetUrl('/CoreUtils/GetActRights?TaskCode=Orders.dll&ActCode=ChangeOrders'),
                success: function (data) {
                    if (data.length > 0) {
                        this.ShowSlide("Предупреждение", data);
                        this.okenabled = false;
                        this.btnOk.linkbutton({disabled: !this.okenabled});
                        resolve(false);
                    } else {
                        this.btnOk.linkbutton({disabled: !this.okenabled});
                        resolve(true);
                    }
                }.bind(this),
                error: function (data) {
                    reject(data);
                }.bind(this)
            });
        })
    }

    CheckInitUser(userid) {
        try {
            $.ajax({
                method: "get",
                url: this.GetUrl("/OrderWear/checkInitUser?userid=" + userid),
                success: function (data) {
                    if (data != "") {
                        this.ShowError(data);
                    } else {
                        this.SetUserInit(userid);
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

    Save(obj){
        return new Promise((resolve, reject) => {
            this.dgvChilds.datagrid('options').loadMsg = 'Отправка данных, пожалуйста подождите...';
            this.dgvChilds.datagrid('loading');
            $.ajax({
                    method: "POST",
                    data: JSON.stringify(obj),
                    url: this.GetUrl('/OrderWear/save'),
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                        resolve(data);
                    }.bind(this),
                    error: function (data) {
                        this.ChkErrorResponse(data.responseJSON);
                    }.bind(this)
                });
            });
    }
}

export function StartModalModul(StartParams, ResultFunc) {
    let id = "wOrderWear_Module_OrderWear";
    let form = new OrderWear("", StartParams);
    form.SetResultFunc(ResultFunc);
    form.Start(id);
}