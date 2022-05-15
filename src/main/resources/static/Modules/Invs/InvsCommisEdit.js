import {FormView} from "../Core/FormView.js";


export class InvsCommisEdit extends FormView{
constructor() {
        super();
        this.InvsId = -1;
        this.InvsIndex = 0;
        this.Userid = -1;
        this.Invs_id = -1;
        this.i = -1;
    }

    Show(options){
        this.options = options;
        LoadForm("#ModalWindows",this.GetUrl("/Invs/InvsCommisFormEdit"), this.InitFunc.bind(this))
    }

    InitFunc() {
        this.InitComponents("wInvsCommisEdit_Module_Invs", "");
        this.InitCloseEvents(this.wInvsCommisEdit);
        this.btnCancel.linkbutton({ onClick: () => { this.wInvsCommisEdit.window("close")} });
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this) });
        this.btFio.linkbutton({onClick: this.FioOnClock.bind(this)});
        if (this.options.AddMode) {
            this.i = 1;
            this.pbEditMode.attr("class", "icon-addmode");
            this.wInvsCommisEdit.window({title: "Добавление новой записи"});
            this.lAction.html("Добавление инвентаризации");
        }
        else {
            this.i = 0;
            this.pbEditMode.attr("class", "icon-editmode");
            this.wInvsCommisEdit.window({title: "Редатирование записи"});
            this.lAction.html("Редактирования текущей записи");
            if (this.options.editMode) {
                this.btnOk.linkbutton({disabled: false});
            } else {
                this.btnOk.linkbutton({disabled: true});

            }
            this.UpdateTextBox();
        }
    }

    FioOnClock(){
        StartModalModulGlobal("Users", {}, ((data) =>{
            this.Userid = data.id;
            this.GetMatre();
        }).bind(this));
    }

    GetMatre(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/Invs/GetFio?Id='+this.Userid),
            success: function(data){
                this.txFio.textbox("setText", data);
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    btnOk_onClick() {
        let id;
        if (this.txId.textbox("getText") === ""){
            id = -1
        }
        else{
            id = this.txId.textbox("getText");
        }
        let nom =  this.txNom.textbox("getText");
        let post =  this.txPost.textbox("getText");
        let user_id =  this.Userid;
        let invs_id;
        if (this.i === 1){ invs_id = this.options.Invs_id;}
        if (this.i === 0){ invs_id = this.Invs_id;}
        if (nom === "") {
            this.ShowToolTip("#divtbNom_Module_Invs","Заполните поле номер п//п",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }
        if (post === "") {
            this.ShowToolTip("#divtbPost_Module_Invs","Заполните поле должность",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }
        if (user_id === -1) {
            this.ShowToolTip("#divtbFio_Module_Invs","Заполните поле ФИО",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            return false;
        }
        let obj = { id: id , nom: nom, post: post, user_id: user_id, invs_id: invs_id };

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
            url: this.GetUrl('/Invs/exists_commis?id=' + obj.id.toString() +
                '&user_id=' + obj.user_id+
                '&invs_id=' + obj.invs_id
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
            url: this.GetUrl('/Invs/save_commis'),
            contentType: "application/json; charset=utf-8",
            success: function(data){
                if(this.ResultFunc!=null)
                {
                    this.ResultFunc(data);
                    this.wInvsCommisEdit.window("close");
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }
    UpdateTextBox(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/Invs/get_commis?id='+ this.options.id),
            success: function(data){
                this.txId.textbox("setText", data.id);
                this.txPost.textbox("setText", data.post);
                this.txNom.textbox("setText", data.nom);
                this.GetNameFio(data.user_id);
                this.Userid = data.user_id;
                this.Invs_id = data.invs_id;
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
    GetNameFio(id){
        $.ajax({
            method:"get",
            url: this.GetUrl('/Invs/GetNameFio?id=' + id),
            success: function(data){
                    this.txFio.textbox("setText", data);
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }
}