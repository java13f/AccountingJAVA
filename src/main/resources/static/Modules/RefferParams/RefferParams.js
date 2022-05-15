import {FormView} from "../Core/FormView.js";
import {RefferParamsFormEdit} from "../RefferParams/RefferParamsFormEdit.js";

class RefferParams extends FormView
{
    /**
     * Конструктор
     * @param prefix - приставка для идентификаторов. Данная приставка добавится для каждого идентификатора
     * @param StartParams - стартовые параметры в формате JSON
     */
    constructor(prefix, StartParams) {
        super(); /** Вызов контруктора у родительского класса */
        this.RefferParamsId = -1; /** Переменная для запоминания последней добавленной/изменённой записи */
        this.RefferParamsIndex = 0; /** Позиция курсора. Применяется для восстановления позиции курсора при обновлении данных */
        this.prefix = prefix; /** Приставка для идентификаторов */
        this.StartParams = StartParams; /** Старотовые параметры в формате JSON */
        this.sLoc = new LibLockService(300000); // Создадим объект работы с блокировками
        this.editMode = false;
    }

    /**
     * Функция загрузки формы
     * @param id - идентификатор эелемента HTML, в который будет загружена разметка частичного представления
     * @constructor
     */
    Start(id){
        this.ModuleId = id;
        /** Загружаем макет формы и выполняем  функции InitFunc в случае успеха */
        LoadForm("#"+this.ModuleId, this.GetUrl("/RefferParams/RefferParamsFormList?prefix=" + this.prefix), this.InitFunc.bind(this));
    }

    /**
     * Функция инициализации пользовательского интерфейса
     * @constructor
     */
    InitFunc(){
        this.InitComponents(this.ModuleId, this.prefix); /** Автоматическое получение идентификатора формы */
        AddKeyboardNavigationForGrid(this.dgRefferParams); /** Добавляем в датагрид возможность навигации с помощью стрелочек */
        this.dgRefferParams.datagrid({
            loadFilter: this.LoadFilter.bind(this), /** LoadFilter - функция, которая находится в родительском классе. Она занимется тем что экранирует теги HTML */
            onLoadError:(data)=> {this.ShowErrorResponse(data.responseJSON);}, /** ShowErrorResponse - выводит ошибку в понятном для чтения виде */
            rowStyler: this.dgRefferParams_rowStyler.bind(this), /** Обработка события прорисовки грида (подсветка удалённых записей) */
            onLoadSuccess: this.dgRefferParams_onLoadSuccess.bind(this), /** Обработка успешной загрузки данных в грид */
            onSelect: this.btnDeleteChangeText.bind(this)
        });

        this.btnUpdate.linkbutton({onClick: this.btnUpdate_onClick.bind(this)});
        this.cbShowDel.checkbox({onChange: this.btnUpdate_onClick.bind(this)});//обработка события изменения значения чекбокса

        this.LoadRights();

        this.btnAdd.linkbutton({onClick:this.btnAdd_onClick.bind(this)});
        this.btnChange.linkbutton({onClick:this.btnChange_onClick.bind(this)});//назначение функции обработки нажатия на кнопку изменения записи
        this.btnDelete.linkbutton({onClick:this.btnDelete_onClick.bind(this)});//назначение функции обработки нажатия на кнопку удаления записи

        this.btnUpdate_onClick();
        if(this.prefix=="modal_"){
            this.pOkCancel.css("visibility", "visible");
            this.wRefferParams = $("#"+this.ModuleId);
            this.InitCloseEvents(this.wRefferParams, false);//Инициализация закрытия формы по нажатию на клавиши "ESC"
            this.btnCancel.linkbutton({onClick: function(){ this.wRefferParams.window("close") }.bind(this)});
            this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this) });
        }
    }

    /**
     * Обработка события перерисовки грида (подсветка удалённых записей)
     * @param index - позиция записи
     * @param row - запись
     */
    dgRefferParams_rowStyler(index, row) {
        if(row.del == 1) {
            return "background-color:gray;";
        }
    }

    /**
     * Обновление списка типов заявок
     */
    btnUpdate_onClick(){
        let row = this.dgRefferParams.datagrid("getSelected"); // получаем выбранную запись

        if(row!=null) {
            this.RefferParamsIndex = this.dgRefferParams.datagrid("getRowIndex", row); // получаем индекс выбранной записи
            if(this.RefferParamsIndex<0){this.RefferParamsIndex = 0;} // даже если нет выбранной записи getSelected может вернуть запись, но getRowIndex отработает корректно и вернёт -1 поэтому заместо -1 запоминаем 0
        }

        let showDel = this.cbShowDel.checkbox("options").checked?"true":"false"; // Получаем значение флага отображения удалённых записей

        $.ajax({
            method:"get",
            url: this.GetUrl('/RefferParams/list?showDel='+ showDel),
            success: function(data){
                for (let i = 0; i < data.length; i++) {
                    let iscodedigit = data[i].iscodedigit;

                    if (iscodedigit == 1) {
                        data[i].iscodedigit = "Используется";
                    }
                    else if(iscodedigit == 0) {
                        data[i].iscodedigit = "Не используется";
                    }

                    if(data[i].codelen == null)
                    {
                        data[i].codelen = "Не ограничено";
                    }
                }

                this.dgRefferParams.datagrid({data});
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    btnChange_onClick(){
        if(this.dgRefferParams.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для изменения");
            return false;
        }
        let selData = this.dgRefferParams.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для изменения");
            return false;
        }

        if(this.editMode){
            this.sLoc.LockRecord("RefferParams", selData.id, this.btnContinueChange_onClick.bind(this));
        }
        else {
            this.btnContinueChange_onClick({id: selData.id, AddMode:false, editMode: this.editMode, lockMessage:'', lockState: false});
        }
    }


    btnContinueChange_onClick(options){
        if(options.lockMessage.length!=0){
            this.ShowSlide("Предупреждение", options.lockMessage)
            options.editMode = false;
        }
        else{
            if(options.editMode){
                options.lockState = true;
            }
        }
        let form = new RefferParamsFormEdit();
        form.SetResultFunc((RecId)=>{  this.RefferParamsId = RecId; this.btnUpdate_onClick();});
        form.SetCloseWindowFunction((options)=>{
            if(options!=null){
                if(options.lockState){
                    this.sLoc.FreeLockRecord("RefferParams", options.id);
                }
            }
        });
        form.Show(options);
    }


    /**
     * Обработка окончания загрузки списка типов заявок
     * @param data - информация о загруженных данных
     */
    dgRefferParams_onLoadSuccess(data){
        if(data.total > 0) { // в поле total хранится общее количество строк в гриде
            if(this.RefferParamsId != -1) {
                this.dgRefferParams.datagrid("selectRecord", this.RefferParamsId); // если сохранённый идентификатор отличается от значения по умолчанию, то заставляем грид установить курсор на запись с данным идентификатором
            }
            else { // иначе устанавливаем курсор согласно сохранённому положению курсору
                if(this.RefferParamsIndex >= 0 && this.RefferParamsIndex < data.total) {
                    this.dgRefferParams.datagrid("selectRow", this.RefferParamsIndex);
                }
                else if (data.total > 0) {
                    this.dgRefferParams.datagrid("selectRow", data.total-1);
                }
            }
            // возвращаем значения по умолчанию
            this.RefferParamsId = -1;
            this.RefferParamsIndex = 0;
        }
        this.btnDeleteChangeText();
    }

    LoadRights(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/CoreUtils/GetActRights?TaskCode=RefferParams.dll&ActCode=RefferParamsChange'),
            success: function(data){
                if(data.length == 0){
                    this.btnAdd.linkbutton({disabled:false});
                    this.btnDelete.linkbutton({disabled:false});
                    this.editMode = true;
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Удаление записи
     */
    btnDelete_onClick(){
        if(this.dgRefferParams.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для удаления");
            return false;
        }
        let selData = this.dgRefferParams.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для удаления");
            return false;
        }
        let del = selData.del;
        let header = "Удаление";
        let action = "удалить";
        if(del == 1){
            header = "Восстановление";
            action = "восстановить";
        }
        $.messager.confirm(header, "Вы действительно хотите " + action + " выделенный реквизит  \"" + selData.name + "\" с кодом " + selData.paramcode + "?",
            function(result){
                if(result){
                    this.sLoc.StateLockRecord("RefferParams", selData.id, this.btnContinueDelete_onClick.bind(this));
                }
            }.bind(this));
    }

    /**
     * Продолжение процесса удаления записи
     * @param options
     */
    btnContinueDelete_onClick(options){
        if(options.data.length > 0){
            this.ShowWarning(options.data);
        }
        else
        {
            $.ajax({
                method: "POST",
                url: this.GetUrl('/RefferParams/delete'),
                data: {id: options.id},
                success:function(data){
                    if(data.length) {
                        this.ShowWarning(data);
                    }
                    else{
                        this.btnUpdate_onClick();
                    }
                }.bind(this),
                error:function(data){ this.ShowErrorResponse(data.responseJSON); }.bind(this)
            });
        }
    }

    /**
     * Изменение текста на кнопке "Удалить"
     */
    btnDeleteChangeText(){
        if(this.dgRefferParams.datagrid("getRows").length != 0){
            let selData = this.dgRefferParams.datagrid("getSelected");
            if(selData !=null ){
                if(selData.del==1){
                    this.btnDelete.linkbutton({iconCls:"icon-undo", text:"Вернуть"});
                }
                else {
                    this.btnDelete.linkbutton({iconCls:"icon-remove", text:"Удалить"});
                }
            }
            else {
                this.btnDelete.linkbutton({iconCls:"icon-remove", text:"Удалить"});
            }
        }
        else {
            this.btnDelete.linkbutton({iconCls:"icon-remove", text:"Удалить"});
        }
    }


    /**
     * Обработка
     */
    btnAdd_onClick(){
        let form = new RefferParamsFormEdit(); // Ссоздание формы редактирования
        form.SetResultFunc((RecId)=>{ this.RefferParamsId = RecId; this.btnUpdate_onClick();}); // Передача функции, которая будет вызвана по нажатию на кнопку ОК
        form.Show({AddMode: true}); // Показать форму
    }


    /**
     * Обработка выбора записи
     */
    btnOk_onClick(){
        if(this.dgRefferParams.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для выбора");
            return false;
        }
        let selData = this.dgRefferParams.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись");
            return false;
        }
        if(this.ResultFunc != null) {
            this.ResultFunc({id: selData.id.toString()});
        }
        this.wRefferParams.window("close");
        return false;
    }
}

/**
 * Функция встраиваемого запуска модуля
 * @param Id
 * @constructor
 */
export function StartNestedModul(Id){
    let form = new RefferParams("nested_", {});
    form.Start(Id);
}

/**
 * Вызов модуля в диалоговом окне
 * @param StartParams стартовые параметры
 * @param ResultFunc функция, которая будет вызываться по нажатию на кнопку "ОК"
 * @constructor
 */
export function StartModalModul(StartParams, ResultFunc) {
    let id = "wRefferParams_Module_RefferParams_RefferParamsFormList";//идентификатор диалогового окна
    CreateModalWindow(id, "Справочник реквизитов"); //функция создания диалогового окна для модуля
    let form = new RefferParams("modal_", StartParams);
    form.SetResultFunc(ResultFunc);
    form.Start(id);
}