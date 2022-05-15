import {FormView} from "../Core/FormView.js";

export class KterFormEdit extends FormView{
    constructor() {
        super();
        this.KokId = -1;
        this.UserId = -1;
    }

    /**
     * Показать форму добавления/изменения записи
     * @param options
     * @constructor
     */
    Show(options){
        this.options = options; //JSON - объект с параметрами
        LoadForm("#ModalWindows", this.GetUrl("/Kter/KterFormEdit"), this.InitFunc.bind(this));
    }

    /**
     * Инциализация интерфейса пользователя
     * @constructor
     */
    InitFunc(){
        this.InitComponents("wKterFormEdit_Module_Kter", ""); //Автоматическое получение идентификаторов формы
        this.InitCloseEvents(this.wKterFormEdit);//Инициализация закрытия формы по нажатию на клавиши "ESC" и "Enter"
        this.btnCancel.linkbutton({onClick:()=>{this.wKterFormEdit.window("close")}});//Обработка события нажатия на кнопку отмены
        if (this.options.AddMode) {
            this.pbEditMode.attr("class", "icon-addmode");
            this.wKterFormEdit.window({title: "Добавление новой записи"});
            this.lAction.html("Введите данные для новой записи");
            this.LoadKOKList();
        }
        else {
            this.pbEditMode.attr("class", "icon-editmode");
            this.wKterFormEdit.window({title: "Редатирование записи"});
            this.lAction.html("Введите данные для редактирования текущей записи");
            if (this.options.editMode) { //editMode: true - запсь открыта на редактирование, false - запись открыта на просмотр. Данная насройка нужна только для изменения или просмотра записи
                this.btnOk.linkbutton({disabled: false});
            } else {
                this.btnOk.linkbutton({disabled: true});
            }
            this.LoadKter();
        }
        this.cbKok.combobox({onSelect: this.cbKok_onSelect.bind(this)});
        this.cbUser.combobox({onSelect: this.cbUser_onSelect.bind(this)});
        this.btnClearUser.linkbutton({onClick: this.btnClearUser_onClick.bind(this)});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
    }

    /**
     * Функция загрузки кода территории для просмотра или редактирования
     * @constructor
     */
    LoadKter(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/Kter/get?id='+this.options.id),
            success: function(data){
                this.txId.textbox("setText", data.id);
                this.txCode.textbox("setText", data.code);
                this.txName.textbox("setText", data.name);
                this.KokId = data.kokId;
                this.txAddress.textbox("setText", data.addr);
                this.UserId = data.userId;
                this.txCreator.textbox("setText", data.creator);
                this.txCreated.textbox("setText", data.created);
                this.txChanger.textbox("setText", data.changer);
                this.txChanged.textbox("setText", data.changed);
                this.LoadKOKList();
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }
    /**
     * Функция загрузки списка казначейств
     * @constructor
     */
    LoadKOKList(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/Kter/GetKOKList'),
            success: function(data){
                this.cbKok.combobox({
                    valueField: 'id',
                    textField: 'name',
                    data: data
                });
                if(this.KokId!=-1){
                    for(let iKok = 0; iKok < data.length; iKok++){
                        let kok = data[iKok];
                        if(kok.id==this.KokId){
                            this.cbKok.combobox("setValue", this.KokId);
                        }
                    }
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Обработка выбранного казначейства
     * @param record объект с выбранным казначейством
     */
    cbKok_onSelect(record){
        this.KokId = record.id;
        this.LoadUsers();
    }
    /**
     * Обработка выбора пользователя
     * @param record объект с выбранным пользователем
     */
    cbUser_onSelect(record){
        this.UserId = record.id;
    }
    /**
     * Функция загрузки списка пользователей
     * @constructor
     */
    LoadUsers(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/Kter/GetUsers?kokId='+this.KokId),
            success: function(data){
                this.cbUser.combobox({
                    valueField: 'id',
                    textField: 'name',
                    data: data
                });
                if(this.UserId!=-1){
                    for(let iUser = 0; iUser < data.length; iUser++){
                        let user = data[iUser];
                        if(user.id==this.UserId){
                            this.cbUser.combobox("setValue", this.UserId);
                        }
                    }
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Очистка выбранного пользователя
     */
    btnClearUser_onClick(){
        this.cbUser.combobox("setValue", "");
        this.UserId = -1;
    }

    /**
     * Проверка существования пользователя
     * @param obj территория
     * @constructor
     */
    ExistsKter(obj){
        $.ajax({
            method:"get",
            url: this.GetUrl('/Kter/exists?id=' + obj.id.toString() + '&code='+obj.code),
            success: function(data){
                if(data){
                    this.ShowWarning("Территория с кодом " + obj.code + " уже существует в баз данных");
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
     * Сохранение кода территориии
     * @param obj код территории
     * @constructor
     */
    Save(obj){
        $.ajax({
            method:"POST",
            data: JSON.stringify(obj),
            url: this.GetUrl('/Kter/save'),
            contentType: "application/json; charset=utf-8",
            success: function(data){
                if(this.ResultFunc!=null)
                {
                    this.ResultFunc(data);
                    this.wKterFormEdit.window("close");
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
        let code = this.txCode.textbox("getText");
        let name = this.txName.textbox("getText");
        let address = this.txAddress.textbox("getText");

        if(id.length == 0){
            id = "-1";
        }
        if(code.length == 0){
            this.ShowError("Введите пожалуйста код территории");
            return false;
        }
        if(code.length<3 || code.length > 3){
            this.ShowError("Код территории должен содержать три символа");
            return false;
        }
        if(isNaN(code)){
            this.ShowError("Код территории должен содержать только числа");
            return false;
        }
        if(name.length == 0){
            this.ShowError("Введите пожалуйста наименование территории");
            return false;
        }
        if(this.KokId == -1){
            this.ShowError("Выберите пожалуйста казначейство");
            return false;
        }
        if(address.length == 0){
            this.ShowError("Введите пожалуйста адрес территории");
            return false;
        }
        let obj = {id: id, code: code, name: name, kokId: this.KokId, addr: address, userId: this.UserId}
        this.ExistsKter(obj)
        return false;
    }
}