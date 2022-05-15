import {FormView} from "../Core/FormView.js";


export class InvsEdit extends FormView{
    constructor() {
        super();
        this.InvsId =-1;
        this.MatreId = -1;
        this.MatreId_1 = null;
        this.MatreId_2 = null;
        this.MatreId_3 = null;
        this.MatreId_4 = null;
        this.MatreId_5 = null;
        this.NumFi = -1;
    }

    /**
     * Загрузка формы
     * @param options
     * @constructor
     */
    Show(options){
        this.options = options;
        LoadForm("#ModalWindows",this.GetUrl("/Invs/InvsFormEdit"), this.InitFunc.bind(this))
    }

    /**
     * Функция инециализации компонентов формы
     * @constructor
     */
    InitFunc(){
        this.InitComponents("wInvsFormEdit_Module_Invs", "");
        this.InitCloseEvents(this.wInvsFormEdit);
        this.btnCancel.linkbutton({onClick:()=>{this.wInvsFormEdit.window("close")}});
        this.btnOk.linkbutton({onClick: ()=>{this.btnOk_onClick()}});
        this.txDateOrd.datebox({formatter: this.formatter.bind(this), parser: this.parser.bind(this)});
        this.txDatePrep.datebox({formatter: this.formatter.bind(this), parser: this.parser.bind(this)});
        this.txDateAsOf.datebox({formatter: this.formatter.bind(this), parser: this.parser.bind(this)});
        this.txDateBegin.datebox({formatter: this.formatter.bind(this), parser: this.parser.bind(this)});
        this.txDateEnd.datebox({formatter: this.formatter.bind(this), parser: this.parser.bind(this)});

        if (this.options.AddMode) {
            this.pbEditMode.attr("class", "icon-addmode");
            this.wInvsFormEdit.window({title: "Добавление новой записи"});
            this.lAction.html("Добавление инвентаризации");
        }
         else {
            this.pbEditMode.attr("class", "icon-editmode");
            this.wInvsFormEdit.window({title: "Редатирование записи"});
            this.lAction.html("Редактирования текущей записи");
            if (this.options.editMode) {
                this.btnOk.linkbutton({disabled: false});
            } else {
                this.btnOk.linkbutton({disabled: true});

            }

             this.GetTxt();

         }

        this.btnMatrePostUserId1.linkbutton({onClick: ()=>{this.FioOnClock(), this.NumFi = 1}});
        this.btnMatrePostUserId2.linkbutton({onClick: ()=>{this.FioOnClock(), this.NumFi = 2}});
        this.btnMatrePostUserId3.linkbutton({onClick: ()=>{this.FioOnClock(), this.NumFi = 3}});
        this.btnCommisChFioUserId.linkbutton({onClick: ()=>{this.FioOnClock(), this.NumFi = 4}});
        this.btnCheckFioUserId.linkbutton({onClick: ()=>{this.FioOnClock(), this.NumFi = 5}});
        this.btnClearMatrePostUserId1.linkbutton({onClick: ()=>{this.Clean(1)}});
        this.btnClearMatrePostUserId2.linkbutton({onClick: ()=>{this.Clean(2)}});
        this.btnClearMatrePostUserId3.linkbutton({onClick: ()=>{this.Clean(3)}});
        this.btnClearCommisChFioUserId.linkbutton({onClick: ()=>{this.Clean(4)}});
        this.btnClearCheckFioUserId.linkbutton({onClick: ()=>{this.Clean(5)}});
       }

    /**
     * Очистка полей по кнопке
     * @param num
     * @constructor
     */
    Clean(num){
        if (num === 1) {
          this.txMatrePostUserId1.textbox("setValue", "");
          this.MatreId_1 = null;
        }
        if (num === 2) {
            this.txMatrePostUserId2.textbox("setValue", "");
            this.MatreId_2 = null;
        }
        if (num === 3) {
            this.txMatrePostUserId3.textbox("setValue", "");
            this.MatreId_3 = null;
        }
        if (num === 4) {
            this.txCommisChFioUserId.textbox("setValue", "");
            this.MatreId_4 = null;
        }
        if (num === 5) {
            this.txCheckFioUserId.textbox("setValue", "");
            this.MatreId_5 = null;
        }
    }
    /**
     * открытие модуля пользователей
     * @constructor
     */
    FioOnClock(){
        StartModalModulGlobal("Users", {}, ((data) =>{
            this.MatreId = data.id;
            this.GetMatre();
        }).bind(this));
    }


    /**
     * заполненеи полей ФИО
     * @constructor
     */
      GetMatre(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/Invs/GetFio?Id='+this.MatreId),
            success: function(data){
                if (this.NumFi === 1){
                    this.MatreId_1 = this.MatreId;
                    this.txMatrePostUserId1.textbox("setText", data);
                }
                if (this.NumFi === 2){
                    this.MatreId_2 = this.MatreId;
                    this.txMatrePostUserId2.textbox("setText", data);
                }
                if (this.NumFi === 3){
                    this.MatreId_3 = this.MatreId;
                    this.txMatrePostUserId3.textbox("setText", data);
                }
                if (this.NumFi === 4){
                    this.MatreId_4 = this.MatreId;
                    this.txCommisChFioUserId.textbox("setText", data);
                }
                if (this.NumFi === 5){
                    this.MatreId_5 = this.MatreId;
                    this.txCheckFioUserId.textbox("setText", data);
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Формирование даты
     * @param date
     * @returns {string}
     */
    formatter(date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        return (d < 10 ? ('0' + d) : d) + '.'
            + (m < 10 ? ('0' + m) : m) + '.'
            + y.toString();
    };

    /**
     * Привод даты в необходимый вид
     * @param s
     * @returns {Date}
     */
    parser(s) {
        if (!s) return new Date();
        var ss = (s.split('.'));
        var y = parseInt(ss[2], 10);
        var m = parseInt(ss[1], 10);
        var d = parseInt(ss[0], 10);
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
            return new Date(y, m - 1, d);
        } else {
            return new Date();
        }
    };

    /**
     * получение данных выбраной записи
     * @constructor
     */
    GetTxt(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/Invs/get?id='+ this.options.id),
            success: function(data){
                this.txId.textbox("setText", data.id);
                this.txName.textbox("setText", data.name);
                this.txMatrePost1.textbox("setText", data.matres_post_1);
                this.txMatrePost2.textbox("setText", data.matres_post_2);
                this.txMatrePost3.textbox("setText", data.matres_post_3);
                let fio_1 = data.matres_fio_user_id_1;
                this.GetNameFio(fio_1,1);
                this.MatreId_1 = fio_1;
                let fio_2 = data.matres_fio_user_id_2;
                if (fio_2 !== 0){this.GetNameFio(fio_2,2); this.MatreId_2 = fio_2;}
                let fio_3 = data.matres_fio_user_id_3;
                if (fio_3 !== 0){this.GetNameFio(fio_3,3); this.MatreId_3 = fio_3;}
                // this.txMatrePostUserId1.textbox("setText", data.matres_fio_user_id_1);
                // this.txMatrePostUserId2.textbox("setText", data.matres_fio_user_id_2);
                // this.txMatrePostUserId3.textbox("setText", data.matres_fio_user_id_3);
                this.txOrderNumb.textbox("setText", data.order_numb);
                this.txDateOrd.textbox("setText", data.date_ord);
                this.txDatePrep.textbox("setText", data.date_prep);
                this.txDateBegin.textbox("setText", data.date_begin);
                this.txDateAsOf.textbox("setText", data.date_as_of);
                this.txDateEnd.textbox("setText", data.date_end);
                this.txCommisChPost.textbox("setText", data.commis_ch_post);
                this.txCheckPost.textbox("setText", data.check_post);
                let fio_4 = data.commis_ch_fio;
                this.GetNameFio(fio_4,4);
                this.MatreId_4 = fio_4;
                let fio_5 = data.check_fio;
                this.GetNameFio(fio_5,5);
                this.MatreId_5 = fio_5;
                // this.txCommisChFioUserId.textbox("setText", data.commis_ch_fio);
                // this.txCheckFioUserId.textbox("setText", data.check_fio);
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
     * Запролнение полей ФИО
     * @param id
     * @param val
     * @constructor
     */
    GetNameFio(id,val){
        $.ajax({
            method:"get",
            url: this.GetUrl('/Invs/GetNameFio?id=' + id),
            success: function(data){
                if(val === 1){
                    this.txMatrePostUserId1.textbox("setText", data);
                }
                if(val === 2){
                    this.txMatrePostUserId2.textbox("setText", data);
                }
                if(val === 3){
                    this.txMatrePostUserId3.textbox("setText", data);
                }
                if(val === 4){
                    this.txCommisChFioUserId.textbox("setText", data);
                }
                if(val === 5){
                    this.txCheckFioUserId.textbox("setText", data);
                }
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
        if (this.txId.textbox("getText") === ""){
            id = -1
        }
        else{
            id = this.txId.textbox("getText");
        }
        let name =  this.txName.textbox("getText");
        let Matres_post_1 =  this.txMatrePost1.textbox("getText").trim();
        let Matres_post_2 =  this.txMatrePost2.textbox("getText").trim();
        let Matres_post_3 =  this.txMatrePost3.textbox("getText").trim();
        let Matres_fio_user_id_1 =   this.MatreId_1;
        let Matres_fio_user_id_2 =   this.MatreId_2;
        let Matres_fio_user_id_3 =   this.MatreId_3;
        let order_numb = this.txOrderNumb.textbox("getText").trim();
        let date_ord =  this.txDateOrd.textbox("getText").trim();
        let date_prep =  this.txDatePrep.textbox("getText").trim();
        let date_begin =  this.txDateBegin.textbox("getText").trim();
        let date_as_of =  this.txDateAsOf.textbox("getText").trim();
        let date_end =  this.txDateEnd.textbox("getText").trim();
        let commis_ch_post =  this.txCommisChPost.textbox("getText").trim();
        let check_post =  this.txCheckPost.textbox("getText").trim();
        let commis_ch_fio = this.MatreId_4;
        let check_fio =   this.MatreId_5;


        if (name === "") {
            this.ShowToolTip("#divtbName_Module_Invs","Заполните поле наименование",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }
        if (Matres_post_1 === "") {
            this.ShowToolTip("#divtbMatrePost1_Module_Invs","Заполните поле должность",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }


        if (Matres_fio_user_id_1 === null) {
            this.ShowToolTip("#divtbMatrePostUserId1_Module_Invs","Заполните поле ФИО",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }
        if (Matres_post_2  === "" ){
            if (!!Matres_fio_user_id_2 ){
            this.ShowToolTip("#divtbMatrePost2_Module_Invs","Если заполненно поле \"ФИО\", то необходимо заполнить и поле \"Должность\"!",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
            }
        }
        if (Matres_post_3  === "" ){
            if (!!Matres_fio_user_id_3 ){
                this.ShowToolTip("#divtbMatrePost3_Module_Invs","Если заполненно поле \"ФИО\", то необходимо заполнить и поле \"Должность\"!",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
                return false;
            }
        }


        if (Matres_fio_user_id_2 == null  ){
            if ( Matres_post_2  !== ""){
                this.ShowToolTip("#divtbMatrePostUserId2_Module_Invs","Если заполненно поле \"Должность\", то необходимо заполнить и поле \"ФИО\"!",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
                return false;
            }
        }

        if ( Matres_fio_user_id_3 == null ){
            if (Matres_post_3  !== ""){
                this.ShowToolTip("#divtbMatrePostUserId3_Module_Invs","Если заполненно поле \"Должность\", то необходимо заполнить и поле \"ФИО\"!",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
                return false;
            }
        }

        if (order_numb === "") {
            this.ShowToolTip("#divtbOrderNumb_Module_Invs","Заполните поле номер приказа",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }
        if (isNaN(order_numb)){
            this.ShowToolTip("#divtbOrderNumb_Module_Invs","Поле \"Номер приказа\" может содержать только цифры",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }
        if (date_ord === "") {
            this.ShowToolTip("#divtbDateOrd_Module_Invs","Заполните поле дата приказа",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }
        if (date_prep === "") {
            this.ShowToolTip("#divtbDatePrep_Module_Invs","Заполните поле дата составления",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }
        if (date_as_of === "") {
            this.ShowToolTip("#divtbDateAsOf_Module_Invs","Заполните поле дата по состояию на",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }
        if (date_begin === "") {
            this.ShowToolTip("#divtbDateBegin_Module_Invs","Заполните поле дата начала инв.",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }
        if (date_end === "") {
            this.ShowToolTip("#divtbDateEnd_Module_Invs","Заполните поле дата окончания инв.",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }

        if (commis_ch_post === "") {
            this.ShowToolTip("#divtbCommisChPost_Module_Invs","Заполните поле \"Должность\"",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }
        if (commis_ch_fio === null) {
            this.ShowToolTip("#divtbCommisChFioUserId_Module_Invs","Заполните поле \"ФИО\"",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }
        if (check_post === "") {
            this.ShowToolTip("#divtbCheckPost_Module_Invs","Заполните поле \"Должность\"",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }

        if (check_fio === null) {
            this.ShowToolTip("#divtbCheckFioUserId_Module_Invs","Заполните поле \"ФИО\"",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }
        if (Matres_post_3  === "" ){  Matres_post_3 = null; }
        if (Matres_post_2  === "" ){  Matres_post_2 = null; }


        let obj = { id: id ,
                    name: name,
                    matres_post_1: Matres_post_1,
                    matres_post_2: Matres_post_2,
                    matres_post_3: Matres_post_3,
                    matres_fio_user_id_1: Matres_fio_user_id_1,
                    matres_fio_user_id_2: Matres_fio_user_id_2,
                    matres_fio_user_id_3: Matres_fio_user_id_3,
                    order_numb: order_numb,
                    date_ord : date_ord,
                    date_prep : date_prep,
                    date_begin : date_begin,
                    date_as_of : date_as_of,
                    date_end : date_end,
                    commis_ch_post : commis_ch_post ,
                    check_post : check_post,
                    commis_ch_fio : commis_ch_fio ,
                    check_fio : check_fio
        };

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
            url: this.GetUrl('/Invs/exists?id=' + obj.id.toString() +
                            '&name=' + obj.name +
                            '&order_numb=' + obj.order_numb
                           ),
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
            url: this.GetUrl('/Invs/save'),
            contentType: "application/json; charset=utf-8",
            success: function(data){
                if(this.ResultFunc!=null)
                {
                    this.ResultFunc(data);
                    this.wInvsFormEdit.window("close");
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }
}