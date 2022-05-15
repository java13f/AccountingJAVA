import {FormView} from "../Core/FormView.js";

export class LocationsFormEdit extends FormView{
    constructor() {
        super();
        this.KterId = -1;
        this.DepId = -1;
    }

    /**
     * Показать форму добавления/изменения записи
     * @param options
     * @constructor
     */
    Show(options){
        this.options = options;
        LoadForm("#ModalWindows", this.GetUrl("/Locations/LocationsFormEdit"), this.InitFunc.bind(this));
    }

    /**
     * Инциализация интерфейса пользователя
     * @constructor
     */
    InitFunc(){
        this.InitComponents("wLocationsFormEdit_Module_Locations", "");
        this.InitCloseEvents(this.wLocationsFormEdit);
        this.txKter.textbox({onClickButton: this.txKter_onClickButton.bind(this)});
        this.btnCancel.linkbutton({onClick:()=>{this.wLocationsFormEdit.window("close")}});

        if (this.options.AddMode) {
            this.pbEditMode.attr("class", "icon-addmode");
            this.wLocationsFormEdit.window({title: "Добавление новой записи"});
            this.lAction.html("Введите данные для новой записи");
        }
        else {
            this.pbEditMode.attr("class", "icon-editmode");
            this.wLocationsFormEdit.window({title: "Редатирование записи"});
            this.lAction.html("Введите данные для редактирования текущей записи");
            if (this.options.editMode) {
                this.btnOk.linkbutton({disabled: false});
            } else {
                this.btnOk.linkbutton({disabled: true});

                this.txName.textbox({editable:false});
            }
            this.LoadLocation();
        }

        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
    }

    /**
     * Функция загрузки кода территории для просмотра или редактирования
     * @constructor
     */
    LoadLocation(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/Locations/GetLocation?id='+this.options.id),
            success: function(data){
                this.txId.textbox("setText", data.id);
                this.txName.textbox("setText", data.name);
                this.KterId = data.kterid;
                this.GetKterObj();

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
    GetKterObj(){
        $.ajax({
            method: "get",
            url: this.GetUrl('/Locations/GetKterObj?KterId=' + this.KterId),
            success: function(data){
                this.DepId = data.depId;
                this.txKter.textbox("setText", data.name);
                this.txDeps.textbox("setText", data.depName);
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Выбор территории
     */
    txKter_onClickButton(){
        StartModalModulGlobal("Kter", {}, ((data)=>{
            this.KterId = data.id
            this.GetKterObj();
        }).bind(this));
    }

    /**
     * Сохранение местопаложения
     * @param obj код местопаложения
     * @constructor
     */
    Save(obj){
        $.ajax({
            method:"POST",
            data: JSON.stringify(obj),
            url: this.GetUrl('/Locations/Save'),
            contentType: "application/json; charset=utf-8",
            success: function(data){
                if(this.ResultFunc != null)
                {
                    this.ResultFunc(data);
                    this.wLocationsFormEdit.window("close");
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }
    /**
     * Обработка нажатия на кнопку "ОК"
     */
    btnOk_onClick(){
        let id = this.txId.textbox("getText");
        let name = this.txName.textbox("getText");

        if(id.length == 0){
            id = "-1";
        }
        if(name.length == 0){
            this.ShowError("Введите пожалуйста наименование");
            return false;
        }

        if(this.DepId == -1){
            this.ShowError("Не найдено подразделение. Необходимо для выбранной территории назначить основное подразделение в справочнике подразделений.");
            return false;
        }

        let obj = {id: id, name: name, depid: this.DepId};
        this.Save(obj);
        return false;
    }
}