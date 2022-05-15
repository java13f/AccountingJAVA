import {FormView} from "../Core/FormView.js";

export class InvGrpsFormEdit extends FormView{
    constructor() {
        super();
    }

    /**
     * Показать форму добавления/изменения записи
     * @param options
     * @constructor
     */
    Show(options){
        this.options = options; //JSON - объект с параметрами
        LoadForm("#ModalWindows", this.GetUrl("/InvGrps/InvGrpsFormEdit"), this.InitFunc.bind(this));
    }

    /**
     * Инциализация интерфейса пользователя
     * @constructor
     */
    InitFunc(){
        this.InitComponents("wInvGrpsFormEdit_Module_InvGrps", ""); //Автоматическое получение идентификаторов формы
        this.InitCloseEvents(this.wInvGrpsFormEdit);//Инициализация закрытия формы по нажатию на клавиши "ESC" и "Enter"

        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({onClick:()=>{this.wInvGrpsFormEdit.window("close")}});//Обработка события нажатия на кнопку отмены

        if (this.options.AddMode) {
            this.pbEditMode.attr("class", "icon-addmode");
            this.wInvGrpsFormEdit.window({title: "Добавление новой записи"});
            this.lAction.html("Введите данные для новой записи");
        }
        else {
            this.pbEditMode.attr("class", "icon-editmode");
            this.wInvGrpsFormEdit.window({title: "Редатирование записи"});
            this.lAction.html("Введите данные для редактирования текущей записи");
            if (this.options.editMode) { //editMode: true - запсь открыта на редактирование, false - запись открыта на просмотр. Данная насройка нужна только для изменения или просмотра записи
                this.btnOk.linkbutton({disabled: false});
            } else {
                this.btnOk.linkbutton({disabled: true});
            }
            this.LoadInvGrps();
        }
    }

    /**
     * Обработка нажатия на кнопку "ОК"
     */
    btnOk_onClick(){
        let id = this.txId.textbox("getText");
        let code = this.txCode.textbox("getText");
        let name = this.txName.textbox("getText");

        if (name.slice(-1) === ')') {
            name = (name.slice(7,)).substring(0, name.length-9);
        }

        if(id.length == 0){
            id = "-1";
        }
        if(code.length == 0){
            this.ShowToolTip('#txCode_Module_InvGrps_InvGrpsFormEdit_toolTip', 'Код не заполнен', {icon:'icon-no', title:'Ошибка', position:'right', delay:5000})
            return false;
        }
        if(isNaN(code)){
            this.ShowToolTip('#txCode_Module_InvGrps_InvGrpsFormEdit_toolTip', 'Код должен содержать только числа', {icon:'icon-no', title:'Ошибка', position:'right', delay:5000})
            return false;
        }
        if(name.length == 0){
            this.ShowToolTip('#txName_Module_InvGrps_InvGrpsFormEdit_toolTip', 'Наименование счета не заполнено', {icon:'icon-no', title:'Ошибка', position:'right', delay:5000})
            return false;
        }

        let obj = {id: id, code: code.trim(), name: name.trim()}
        this.ExistsInvGrps(obj)
        return false;

    }
    /**
     * Проверка существования поля группы
     * @param obj группа
     * @constructor
     */
    ExistsInvGrps(obj){
        $.ajax({
            method:"get",
            url: this.GetUrl('/InvGrps/existsGroup?id='+obj.id+'&code=' + obj.code),
            success: function(data){
                if(data){
                    this.ShowWarning("Группа с кодом " + obj.code + " уже существует в базе данных");
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
     * Сохранение группы
     * @param obj код группа
     * @constructor
     */
    Save(obj){
        $.ajax({
            method:"POST",
            data: JSON.stringify(obj),
            url: this.GetUrl('/InvGrps/saveGroup'),
            contentType: "application/json; charset=utf-8",
            success: function(data){
                if(this.ResultFunc!=null)
                {
                    this.ResultFunc(data);
                    this.wInvGrpsFormEdit.window("close");
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Функция загрузки группы для просмотра или редактирования
     * @constructor
     */
    LoadInvGrps(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/InvGrps/getGroupById?id='+this.options.id),
            success: function(data){
                this.txId.textbox("setText", data.id);
                this.txCode.textbox("setText", data.code);
                this.txName.textbox("setText", data.name);
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
}
