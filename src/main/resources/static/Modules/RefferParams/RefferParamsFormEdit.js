import {FormView} from "../Core/FormView.js";

export class RefferParamsFormEdit extends FormView
{
    constructor() {
        super();
        this.IsCodeDigitId = null;
        this.IsCodeDigitData = [{"id":1, "flag":1, "name":"Используется"}, {"id":2, "flag":0, "name":"Не используется"}];
    }

    /**
     * Показать форму добавления/изменения записи
     * @param options
     * @constructor
     */
    Show(options) {
        this.options = options; // JSON - объект с параметрами
        LoadForm("#ModalWindows", this.GetUrl("/RefferParams/RefferParamsFormEdit"), this.InitFunc.bind(this));
    }

    /**
     * Инциализация интерфейса пользователя
     * @constructor
     */
    InitFunc(){
        this.InitComponents("wRefferParamsFormEdit_Module_RefferParams", ""); //Автоматическое получение идентификаторов формы
        this.InitCloseEvents(this.wRefferParamsFormEdit);//Инициализация закрытия формы по нажатию на клавиши "ESC" и "Enter"
        this.cbIsCodeDigit.combobox({onSelect: this.cbIsCodeDigit_onSelect.bind(this)});
        this.cbIsCodeDigit.combobox({onUnselect: this.cbIsCodeDigit_onUnselect.bind(this)});

        if (this.options.AddMode) {
            this.pbEditMode.attr("class", "icon-addmode");
            this.wRefferParamsFormEdit.window({title: "Добавление новой записи"});
            this.lAction.html("Введите данные для новой записи");
            this.LoadcbIsCodeDigit();
        }
        else {
            this.pbEditMode.attr("class", "icon-editmode");
            this.wRefferParamsFormEdit.window({title: "Редатирование записи"});
            this.lAction.html("Введите данные для редактирования текущей записи");
            if (this.options.editMode) { // editMode: true - запсь открыта на редактирование, false - запись открыта на просмотр. Данная насройка нужна только для изменения или просмотра записи
                this.btnOk.linkbutton({disabled: false});
            } else {
                this.btnOk.linkbutton({disabled: true});

                this.txName.textbox({editable:false});
                this.txParamCode.textbox({editable:false});
                this.txCodeLen.textbox({editable:false});
            }
            this.LoadRecord();
        }

        this.btnCancel.linkbutton({onClick:()=>{this.wRefferParamsFormEdit.window("close")}});//Обработка события нажатия на кнопку отмены
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
    }

    /**
     * Функция загрузки типа заявки для просмотра или редактирования
     * @constructor
     */
    LoadRecord(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/RefferParams/get?id='+this.options.id),
            success: function(data){
                this.txId.textbox("setText", data.id);
                this.txParamCode.textbox("setText", data.paramcode);
                this.txName.textbox("setText", data.name);
                this.txCodeLen.textbox("setText", data.codelen);
                this.IsCodeDigitId = data.iscodedigit;

                this.txCreator.textbox("setText", data.creator);
                this.txCreated.textbox("setText", data.created);
                this.txChanger.textbox("setText", data.changer);
                this.txChanged.textbox("setText", data.changed);

                this.LoadcbIsCodeDigit();
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Загрузить данные в комбобокс
     * @constructor
     */
    LoadcbIsCodeDigit() {
        this.cbIsCodeDigit.combobox({
            valueField: 'id',
            textField: 'name',
            data: this.IsCodeDigitData
        });

        /*
        this.cbIsCodeDigit.combobox('setValue', '-2');
        this.cbIsCodeDigit.combobox('setText','');
        */

        if (this.IsCodeDigitId != null) {

            for (let i = 0; i < this.IsCodeDigitData.length; i++) {
                let codedigit = this.IsCodeDigitData[i];
                if (codedigit.flag == this.IsCodeDigitId) {
                    this.cbIsCodeDigit.combobox("setValue", this.IsCodeDigitData[i].id);
                }
            }
        }
    }

    cbIsCodeDigit_onUnselect(record){
        if(record.flag == 0){
            this.txCodeLen.textbox("clear");
        }
    }

    /**
     * Обработка выбора пользователя
     * @param record объект с выбранным пользователем
     */
    cbIsCodeDigit_onSelect(record){
        this.IsCodeDigitId = record.flag;
        if(this.IsCodeDigitId == 0) {
            this.txCodeLen.textbox("clear");
            this.txCodeLen.textbox("setText", 0);
            this.txCodeLen.textbox({disabled: true});
        }
        else {
            this.txCodeLen.textbox({disabled: false});
        }
    }

    /**
     * Обработка нажатия на кнопку "ОК"
     */
    btnOk_onClick(){
        let id = this.txId.textbox("getText");
        let paramcode = this.txParamCode.textbox("getText");
        let name = this.txName.textbox("getText");
        let codelen = this.txCodeLen.textbox("getText");

        if(id.length == 0){
            id = "-1";
        }
        if(paramcode.length == 0){
            this.ShowError("Введите пожалуйста код справочника");
            return false;
        }

        if(paramcode.length > 32){
            this.ShowError("Код справочника не может быть больше 32 символов");
            return false;
        }

        if(name.length == 0){
            this.ShowError("Введите пожалуйста наименование справочника");
            return false;
        }

        if(name.length > 256){
            this.ShowError("Имя справочника не может быть больше 256 символов");
            return false;
        }

        if(this.cbIsCodeDigit.combobox('getText').length == 0){
            this.ShowError("Выберите пожалуйста признак использования поля код");
            return false;
        }

        console.log(this.txCodeLen.textbox("getValue"));
        if(this.IsCodeDigitId == 1 && this.txCodeLen.textbox("getText") == "0")
        {
            this.ShowError("Когда значение поля \"Признак использования поля код\" установлен в \"Используется\", то значение поля \"Длина кода\" не может быть 0");
            return false;
        }

        if(isNaN(codelen)){
            this.ShowError("Поле \"Длина кода\" должно содержать только числа");
            return false;
        }

        //this.IsCodeDigitId = this.cbIsCodeDigit.combobox("getValue");

        if(this.IsCodeDigitId == 0)
            codelen = 0;
        else if(this.IsCodeDigitId == 1 && codelen.length == 0)
            codelen = null;


        let obj = { id: id, paramcode: paramcode, name: name, codelen: codelen, iscodedigit: this.IsCodeDigitId };

        this.ExistsRefferParams(obj);
        return false;
    }

    /**
     * Проверка существования реквизита в базе данных
     * @param obj - реквизит
     * @constructor
     */
    ExistsRefferParams(obj){
        $.ajax({
            method:"get",
            url: this.GetUrl('/RefferParams/exists?id=' + obj.id.toString() + '&paramcode=' + obj.paramcode),
            success: function(data){
                if(data){
                    this.ShowWarning("Запись с таким кодом " + obj.paramcode + " уже существует в базе данных");
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
     * Сохранение записи
     * @param obj реквизит
     * @constructor
     */
    Save(obj){
        $.ajax({
            method:"POST",
            data: JSON.stringify(obj),
            url: this.GetUrl('/RefferParams/save'),
            contentType: "application/json; charset=utf-8",
            success: function(data){
                if(this.ResultFunc!=null)
                {
                    this.ResultFunc(data);
                    this.wRefferParamsFormEdit.window("close");
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

}