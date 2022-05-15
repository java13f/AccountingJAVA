import {FormView} from "../Core/FormView.js";

export class InvGrpsAccFormEdit extends FormView {
    constructor() {
        super();
        this.accId = -1;
        this.perc = -1;
    }

    /**
     * Показать форму добавления/изменения записи
     * @param options
     * @constructor
     */
    Show(options) {
        this.options = options; //JSON - объект с параметрами
        LoadForm("#ModalWindows", this.GetUrl("/InvGrps/InvGrpsAccFormEdit"), this.InitFunc.bind(this));
    }

    /**
     * Инциализация интерфейса пользователя
     * @constructor
     */
    InitFunc() {
        this.InitComponents("wInvGrpsAccFormEdit_Module_InvGrps", "");
        this.InitCloseEvents(this.wInvGrpsAccFormEdit);
        this.btnCancel.linkbutton({
            onClick: () => {
                this.wInvGrpsAccFormEdit.window("close")
            }
        });
        if (this.options.AddMode) {
            this.pbEditMode.attr("class", "icon-addmode");
            this.wInvGrpsAccFormEdit.window({title: "Добавление новой записи"});
            this.lAction.html("Введите данные для новой записи");
        } else {
            this.pbEditMode.attr("class", "icon-editmode");
            this.wInvGrpsAccFormEdit.window({title: "Редатирование записи"});
            this.lAction.html("Введите данные для редактирования текущей записи");

            if (this.options.editMode) { //editMode: true - запсь открыта на редактирование, false - запись открыта на просмотр. Данная насройка нужна только для изменения или просмотра записи
                this.btnOk.linkbutton({disabled: false});
            } else {
                this.btnOk.linkbutton({disabled: true});
            }

            this.LoadInvGrpAcc();
        }

        this.btnChooseInvGrpsAcc.linkbutton({onClick: this.btnChooseInvGrpsAcc_onClick.bind(this)});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
    }

    /**
     * Функция загрузки счета группы для просмотра или редактирования
     * @constructor
     */
    LoadInvGrpAcc() {
        $.ajax({
            method: "get",
            url: this.GetUrl('/InvGrps/getGroupAccById?id=' + this.options.id),
            success: function (data) {
                this.txId.textbox("setText", data.id);
                this.txTag.textbox("setText", data.tag);
                this.txName.textbox("setText", data.name);
                this.txCode.textbox("setText", data.code);
                this.txPerc.textbox("setText", data.perc);

                this.invGrpId = data.invGrpId;
                this.accId = data.accId;
                this.txCreator.textbox("setText", data.creator);
                this.txCreated.textbox("setText", data.created);
                this.txChanger.textbox("setText", data.changer);
                this.txChanged.textbox("setText", data.changed);

            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Проверка существованиясчета в группе
     * @param obj счет
     * @constructor
     */
    CheckForDublicate(obj) {
        $.ajax({
            method:"get",
            url: this.GetUrl('/InvGrps/existsGroupAcc?id='+obj.id+'&accId=' + obj.accId + '&invGrpId='+obj.invGrpId),
            success: function(data){
                if(data){
                    this.ShowWarning("Этот счет уже есть в группе");
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
     * Сохранение счета
     * @param obj счет
     * @constructor
     */
    Save(obj) {
        $.ajax({
            method: "POST",
            data: JSON.stringify(obj),
            url: this.GetUrl('/InvGrps/saveGroupAcc'),
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (this.ResultFunc != null) {
                    this.ResultFunc(data);
                    this.wInvGrpsAccFormEdit.window("close");
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Обработка нажатия на кнопку "ОК"
     */
    btnOk_onClick() {
        let id = this.txId.textbox("getText");
        let code = this.txCode.textbox("getText");
        let perc = this.txPerc.textbox("getText");
        let name = this.txName.textbox("getText");
        let tag = this.txTag.textbox("getText");

        if (id.length == 0) {
            id = "-1";
        }
        if (perc.length == 0) {
            perc = "0";
        }

        if (!this.isNumericPositive(perc)) {
            this.ShowToolTip('#txPerc_Module_InvGrps_InvGrpsAccFormEdit_toolTip', 'Процент износа должен быть положительным числовым значением', {icon:'icon-no', title:'Ошибка', position:'right', delay:5000})
            return false;
        }

        if (code.length == 0) {
            this.ShowToolTip('#txCode_Module_InvGrps_InvGrpsAccFormEdit_toolTip', 'Код не заполнен', {icon:'icon-no', title:'Ошибка', position:'right', delay:5000})
            return false;
        }
        if (isNaN(code)) {
            this.ShowToolTip('#txTag_Module_InvGrps_InvGrpsAccFormEdit_toolTip', 'Код счета должен содержать только числа', {icon:'icon-no', title:'Ошибка', position:'right', delay:5000})
            return false;
        }
        if (tag.length == 0) {
            this.ShowToolTip('#txTag_Module_InvGrps_InvGrpsAccFormEdit_toolTip', 'Тэг не заполнен', {icon:'icon-no', title:'Ошибка', position:'right', delay:5000})
            return false;
        }
        if (name.length == 0) {
            this.ShowToolTip('#txName_Module_InvGrps_InvGrpsAccFormEdit_toolTip', 'Наименование счета не заполнено', {icon:'icon-no', title:'Ошибка', position:'right', delay:5000})
            return false;
        }

        $.ajax({
            method:"get",
            url: this.GetUrl('/InvGrps/getGroupAccByCodeAndTag?code='+code+'&tag='+tag),
            success: function(data){
                let obj = {id: id, code: code, name: name, perc: perc, accId: data.id, invGrpId: this.options.invGrpsId}
                this.CheckForDublicate(obj)
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });


        return false;
    }


    /**
     * Вызов справочника счетов
     */
    btnChooseInvGrpsAcc_onClick() {
        try {
            this.perc = this.txPerc.textbox("getText");

            StartModalModulGlobal("Accs",
                "",
                ((data)=>{this.accId=data.id; this.setAccData();}).bind(this));
        }
        catch (e) {
            this.ShowError(e);
        }
    }

    /*
    * Заполнение полей данными выбранного счета
    * */
    setAccData() {
        $.ajax({
            method:"get",
            url: this.GetUrl('/InvGrps/getAccById?id='+this.accId),
            success: function(data){
                this.txCode.textbox("setText", data.code);
                this.txPerc.textbox("setText", this.perc);
                this.txName.textbox("setText", data.name);
                this.txTag.textbox("setText", data.tag);
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /*
    * Является ли строка натуральным числовым значением (от 0)
    * */
    isNumericPositive(value) {
        return !isNaN(value) && Number(value) >= 0;
    }
}