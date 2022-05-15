import {FormView} from "../Core/FormView.js";
import {SttsOrderTransferConfirm} from "./SttsOrderTransferConfirm.js";

export class SttsOrderTransfer extends FormView {
    constructor() {
        super();

        this.isEmpty = null; // есть ли статусы у указанной группы и типа заявки
    }

    Show(options) {
        this.options = options; //JSON - объект с параметрами
        LoadForm("#ModalWindows", this.GetUrl("/SttsOrder/SttsOrderTransfer"), this.InitFunc.bind(this));
    }

    InitFunc() {
        this.InitComponents("wSttsOrderTransfer_Module_SttsOrder", ""); //Автоматическое получение идентификаторов формы
        this.InitCloseEvents(this.wSttsOrderTransfer);//Инициализация закрытия формы по нажатию на клавиши "ESC" и "Enter"

        this.loadData();

        this.txOrderTypeFrom.textbox({editable:false});
        this.txGroupFrom.textbox({editable:false});

        this.cbOrderTypeTo.combobox({editable: false, onClick: this.cbOrderTypeTo_onClick.bind(this)});
        this.cbGroupTo.combobox({editable: false, onClick: this.cbGroupTo_onClick.bind(this)});

        this.btnCancel.linkbutton({onClick:()=>{this.wSttsOrderTransfer.window("close")}});//Обработка события нажатия на кнопку отмены
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
    }

    cbOrderTypeTo_onClick() { }
    cbGroupTo_onClick() { }

    /*
    * Начальная загрузка данных формы (
    * группа и тип заявки с которых будет переноситься;
    * списки групп и типов заявок)
    * */
    loadData() {
        this.txOrderTypeFrom.textbox("setText", this.options.orderTypeFrom.fullName);
        this.txGroupFrom.textbox("setText", this.options.groupFrom.fullName);

        this.loadGroups();
        this.loadOrderTypes();
    }

    /*
    * Загрузка групп
    * */
    loadGroups() {
        $.ajax({
            method: "get",
            url: this.GetUrl('/SttsOrder/groupsList'),
            success: function (data) {
                this.cbGroupTo.combobox({
                    valueField: 'id',
                    textField: 'name',
                    data: data
                });
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /*
    * Загрузка типов заявок
    * */
    loadOrderTypes() {
        $.ajax({
            method: "get",
            url: this.GetUrl('/SttsOrder/orderTypesList'),
            success: function (data) {
                this.cbOrderTypeTo.combobox({
                    valueField: 'id',
                    textField: 'name',
                    data: data
                });
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /*
    * Есть ли статусы у указанной группы и типа заявки
    * */
    checkForEmpty(grId, otId) {
        return new Promise((resolve, reject) => {
             $.ajax({
                url: this.GetUrl('/SttsOrder/checkForEmptyGr?groupId='+grId+'&orderTypeId='+otId),
                method: "get",
                success: function (data) {
                    resolve(data);
                },
                error: function (data) {
                    reject(data);
                }.bind(this)
            });
        });
    }


    async btnOk_onClick() {
        let orderType = this.cbOrderTypeTo.combobox('getText');
        let group = this.cbGroupTo.combobox('getText');

        if (orderType === "") {
            this.ShowToolTip('#txOrderTypeTo_Module_SttsOrder_SttsOrderTransfer_toolTip', 'Выберите тип заявки', {icon:'icon-no', title:'Внимание', position:'right', delay:5000})
            return false;
        }

        if (group === "") {
            this.ShowToolTip('#txGroupTo_Module_SttsOrder_SttsOrderTransfer_toolTip', 'Выберите группу', {icon:'icon-no', title:'Внимание', position:'right', delay:5000})
            return false;
        }

        let otToId = (this.cbOrderTypeTo.combobox('getText').split("=")[0]);
        let grToId = (this.cbGroupTo.combobox('getText').split("=")[0]);
        let otFromId = (this.txOrderTypeFrom.textbox('getText').split("=")[0]);
        let grFromId = (this.txGroupFrom.textbox('getText').split("=")[0]);

        let orderTypeToTxt = this.cbOrderTypeTo.combobox('getText');
        let groupToTxt = this.cbGroupTo.combobox('getText');

        let orderTypeFromTxt = this.txOrderTypeFrom.textbox('getText');
        let groupFromTxt = this.txGroupFrom.textbox('getText');

        let isFromEmpty = await this.checkForEmpty(grFromId, otFromId); // имеют ли статусы указанные гр. и тип заявки с которых переноситься
        let isToEmpty = await this.checkForEmpty(grToId, otToId); // имеют ли статусы указанные гр. и тип заявки на которых переноситься

        let form = new SttsOrderTransferConfirm();
        let opt = {
            TxtFrom: isFromEmpty ? "Тип заявки "+orderTypeFromTxt+" и группа "+groupFromTxt+", с которых будут переноситься данные не имеют статусов. Продолжить?" : "",
            TxtTo: isToEmpty ? "" : "Тип заявки "+orderTypeToTxt+" и группа "+groupToTxt+" на которые будут переноситься данные не пустые. Продолжить?",
        };

        if (isFromEmpty) { // гр. и тип. з. с кот. переноситься - не имеют статусов
            form.Show(opt);
            form.SetResultFunc((isPressOk) => {
                if (isPressOk && !isToEmpty) {
                    opt.TxtFrom="";
                    form.Show(opt);
                    form.SetResultFunc((isPressOk) => {
                        if (isPressOk)
                            this.save(isToEmpty, grFromId, grToId, otFromId, otToId);
                    });
                } else {
                    this.save(isToEmpty, grFromId, grToId, otFromId, otToId);
                }
            });
        } else if (!isToEmpty) { // гр. и тип. з. на кот. переноситься - имеет статусы
            opt.TxtFrom="";
            form.Show(opt);
            form.SetResultFunc((isPressOk) => {
                if (isPressOk)
                    this.save(isToEmpty, grFromId, grToId, otFromId, otToId);
            });
        } else { // гр. и тип. з. с кот. переноситься - имеет статусы и гр.; и тип. з. на кот. переноситься - не имеет статусы
            this.save(isToEmpty, grFromId, grToId, otFromId, otToId);
        }
    }

    /*
    * Сохранение
    * */
    save(isEmpty, groupFromId, groupToId, orderTypeFromId, orderTypeToId) {
        let obj = {
            isEmpty: isEmpty, groupFromId: groupFromId, groupToId: groupToId, orderTypeFromId: orderTypeFromId, orderTypeToId: orderTypeToId
        };

        $.ajax({
            method:"POST",
            data: JSON.stringify(obj),
            url: this.GetUrl('/SttsOrder/saveTransfer'),
            contentType: "application/json; charset=utf-8",
            success: function(data) {
                this.wSttsOrderTransfer.window("close");
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }
}