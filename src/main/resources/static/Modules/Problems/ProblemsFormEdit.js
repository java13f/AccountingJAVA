import {FormView} from "../Core/FormView.js";

export class ProblemsFormEdit extends FormView {
    constructor() {
        super();
        this.objTypeId = null;
    }

    /**
     * Показать форму добавления/изменения записи
     * @param options
     * @constructor
     */
    Show(options) {
        this.options = options; //JSON
        LoadForm("#ModalWindows", this.GetUrl("/Problems/ProblemsFormEdit"),
            this.InitFunc.bind(this));
    }

    /**
     * Инициализация интерфейса пользователя
     * @constructor
     */
    InitFunc(){
        //Автоматическое получение идентификаторов формы
        this.InitComponents("wProblemsFormEdit_Module_Problems", "");

        //Закрытие формы по "ESC" и "Enter"
        this.InitCloseEvents(this.wProblemsFormEdit);
        this.btnTpObjName.linkbutton({onClick: this.btnTpObjName_OnClick.bind(this)});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({onClick: ()=>{this.wProblemsFormEdit.window("close")}});

        if(this.options.AddMode){
            this.pbEditMode.attr("class", "icon-addmode");
            this.wProblemsFormEdit.window({title: "Редактирование записи"});
            this.lAction.html("Введите данные для редактирования текущей записи");
        }
        else{
            this.pbEditMode.attr("class", "icon-editmode");
            this.wProblemsFormEdit.window({title: "Редатирование записи"});
            this.lAction.html("Введите данные для редактирования текущей записи");

            /*
            editMode: true - запсь открыта на редактирование,
            false - запись открыта на просмотр.
            Данная насройка нужна только для изменения или просмотра записи
            */
            if(this.options.editMode){
                this.btnOk.linkbutton({disabled: false});
            }else{
                this.btnOk.linkbutton({disabled: true});
            }
            this.LoadProblems();
        }
    }

    /**
     * Получение из модуля Objs, id выбранного объекта
     */
    btnTpObjName_OnClick() {
        StartModalModulGlobal("ObjTypes", "",
            data => {
                this.objTypeId = data.id;
                this.getObjectType();
            }
        );
    }

    /**
     * Получить информацию о типе объекте
     */
    getObjectType() {
        $.get({url: this.GetUrl('/Problems/getObjectType?id=' + this.objTypeId)}, function (data) {
            this.txtTpObjName.textbox("setText", data)
        }.bind(this));
    }
    /**
     * Сохранение кода проблемы
     * @param obj
     * @constructor
     */
    Save(obj){
        $.ajax({
            method: "POST",
            data: JSON.stringify(obj),
            url: this.GetUrl('/Problems/save'),
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if(this.ResultFunc!=null){
                    this.ResultFunc(data);
                    this.wProblemsFormEdit.window("close");
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * добавить новую проблему
     * @returns {boolean}
     */
    btnOk_onClick(){
        let id = this.txId.textbox("getText");
        let name = this.txName.textbox("getText");

        if(id.length == 0) id="-1";
        if(name.length==0) return this.ShowError("Введите пожалуйста наименование проблемы");

        let tp_ob =  this.txtTpObjName.textbox("getText").split('=')[0].trim();
        if(tp_ob.length==0) return this.ShowError("Выберете пожалуйста тип объекта");
        let obj = {id: id, name: name, tp_ob: tp_ob};
        this.Save(obj);
        return false;
    }

    LoadProblems(){
        $.ajax({
            method: "get",
            url: this.GetUrl('/Problems/get?id='+this.options.id),
            success: function (data) {
                this.txId.textbox("setText", data.id);
                this.txName.textbox("setText", data.name);
                this.txCreator.textbox("setText", data.creator);
                this.txCreated.textbox("setText", data.created);
                this.txChanger.textbox("setText", data.changer);
                this.txChanged.textbox("setText", data.changed);
                this.txtTpObjName.textbox("setText", data.tp_ob);
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

}