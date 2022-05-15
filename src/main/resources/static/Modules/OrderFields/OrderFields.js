import {FormView} from "../Core/FormView.js"; //Класс формы с часто используемыми функциями
import {OrderFieldsFormEdit} from "./OrderFieldsFormEdit.js";
/**
 * Основной класс модуля
 */
class OrderFields extends FormView {
    /**
     * Конструктор
     * @param prefix - приставка для идентификаторов. Данная приставка добавится для каждого идентификатора
     * @param StartParams - стартовые параметры в формате JSON
     */
    constructor(prefix, StartParams) {
        super();//Вызов контруктора у родительского класса
        this.OrderFieldsId = -1; //Переменная для запоминанися последней добавленной/изменённой записи
        this.OrderFieldsIndex = 0; //Позиция курсора. Применяется для восстановления позиции курсора при обновлении данных
        this.prefix = prefix; //Приставка для идентификаторов
        this.StartParams = StartParams; //Стартовые параметры в формате JSON
        this.sLoc = new LibLockService(300000);//Создадим объект работы с блокировками
    }

    /**
     * Функция загрузки формы
     * @param id - идентификатор эелемента HTML, в который будет загружена разметка частичного представления
     * @constructor
     */
    Start(id){
        this.ModuleId = id;
        //Загружаем макет формы и выполняем  функци InitFunc в случае успеха
        LoadForm("#"+this.ModuleId, this.GetUrl("/OrderFields/OrderFieldsFormList?prefix=" + this.prefix), this.InitFunc.bind(this));
    }


    /**
     * Обработка
     */
    btnAdd_onClick(){
        let form = new OrderFieldsFormEdit();//Ссоздание формы редактирования
        form.SetResultFunc((RecId)=>{  this.OrderFieldsId = RecId; this.btnUpdate_onClick(); } );//Передача функции, которая будет вызвана по нажатию на кнопку ОК
        form.Show({AddMode: true});//Показать форму
    }
    /**
     * Обработка изменения записи
     */
    btnChange_onClick(){
        if(this.dgOrderFields.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для изменения");
            return false;
        }
        let selData = this.dgOrderFields.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для изменения");
            return false;
        }
        let editMode = Keys.isKeyDown(Keys.VK_Z) || Keys.isKeyDown(Keys.VK_OEM_PERIOD); //проверка нажатия на кнопки Z и . если одна из них нажата, то запись нужно попытаться открыть на редактирование
        if(editMode){
            this.sLoc.LockRecord("OrderFields", selData.id, this.btnContinueChange_onClick.bind(this));
        }
        else {
            this.btnContinueChange_onClick({id: selData.id, editMode: editMode, lockMessage:'', lockState: false});
        }
    }
    /**
     *
     * @param options
     */
    btnContinueChange_onClick(options){
        if(options.lockMessage.length!=0){
            this.ShowSlide("Предупреждение", options.lockMessage)
            options.editMode = false;
        }
        else{
            if(options.editMode){
                options.lockState = true
            }
        }
        let form = new OrderFieldsFormEdit();
        form.SetResultFunc((RecId)=>{  this.OrderFieldsId = RecId; this.btnUpdate_onClick();});
        form.SetCloseWindowFunction((options)=>{
            if(options!=null){
            if(options.lockState){
                this.sLoc.FreeLockRecord("OrderFields", options.id);
            }
        }
    });
        form.Show(options);
    }
    /**
     * Удаление записи
     */
    btnDelete_onClick(){
        if(this.dgOrderFields.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для удаления");
            return false;
        }
        let selData = this.dgOrderFields.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для удаления");
            return false;
        }
        let del = selData.del;
        let header = "Удаление"
        let action = "удалить"
        if(del == 1){
            header = "Восстановление";
            action = "восстановить";
        }
        $.messager.confirm(header, "Вы действительно хотите " + action + " выделенную запись " + selData.name + " с кодом " + selData.code + "?",
            function(result){
                if(result){
                    this.sLoc.StateLockRecord("OrderFields", selData.id, this.btnContinueDelete_onClick.bind(this));
                }
            }.bind(this));
    }
    /**
     * ПРподолжение процесса удаления записи
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
                url: this.GetUrl('/OrderFields/delete'),
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
        if(this.dgOrderFields.datagrid("getRows").length != 0){
            let selData = this.dgOrderFields.datagrid("getSelected");
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
     * Функция инициализации пользовательского интерфейса
     * @constructor
     */
    InitFunc(){
        this.LoadRights();//загрузка прав доступности кнопок Добавить/Изменить/Удалить
        this.InitComponents(this.ModuleId, this.prefix); //Автоматическое получение идентификаторов формы
        AddKeyboardNavigationForGrid(this.dgOrderFields); //Добавляем в датагрид возможность навигации с помощью стрлочек

        //обработчик событий датагрида
        this.dgOrderFields.datagrid({
            loadFilter:this.LoadFilter.bind(this), //LoadFilter - функция, которая находится в родительском классе. Она занимется тем что экранирует теги HTML
            onLoadError:(data)=>{ this.ShowErrorResponse(data.responseJSON); }, //ShowErrorResponse - выводит ошибку в понятном для чтения виде
            rowStyler: this.dgOrderFields_rowStyler.bind(this), //Обработка события перерисовки грида (подсветка удалённых записей)
            onLoadSuccess: this.dgOrderFields_onLoadSuccess.bind(this), //Обработка успешной загрузки данных в грид
            onSelect: this.btnDeleteChangeText.bind(this)
         });

        //обновить
        this.btnUpdate.linkbutton({onClick: this.btnUpdate_onClick.bind(this)});
        this.btnUpdate_onClick();
        //фильтр
        this.txFilter.textbox({onChange: this.btnUpdate_onClick.bind(this)}); //обработаем событие изменения текста в фильтре по коду
        this.cbShowDel.checkbox({onChange: this.btnUpdate_onClick.bind(this)});//обработка события изменения значения чекбокса

        this.dgOrderFields.datagrid({url: this.GetUrl("/OrderFields/list")});//Задаём url - датагриду для загрузки данных


        this.btnAdd.linkbutton({onClick:this.btnAdd_onClick.bind(this)});
        this.btnChange.linkbutton({onClick:this.btnChange_onClick.bind(this)});//назначение функции обработки нажатия на кнопку изменения записи
        this.btnDelete.linkbutton({onClick:this.btnDelete_onClick.bind(this)});//назначение функции обработки нажатия на кнопку удаления записи
        if(this.prefix=="modal_"){
            this.pOkCancel.css("visibility", "visible");
            this.wOrderFields = $("#"+this.ModuleId);
            this.InitCloseEvents(this.wOrderFields, false);//Инициализация закрытия формы по нажатию на клавиши "ESC"
            this.btnCancel.linkbutton({onClick: function(){ this.wOrderFields.window("close") }.bind(this)});
            this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this) });
        }


    }


    /**
     * Обработка события перерисовки грида (подсветка удалённых записей)
     * @param index - позиция записи
     * @param row - запись
     */
    dgOrderFields_rowStyler(index, row) {
        if(row.del==1) {
            return "background-color:gray;";
        }
    }
    /**
     * Обработка окончания загрузки списка
     * @param data - информация о загруженных данных
     */
    dgOrderFields_onLoadSuccess(data){
     if(data.total>0) { //в поле total хранится общее количество строк в гриде
        if(this.OrderFieldsId!=-1) {
            this.dgOrderFields.datagrid("selectRecord", this.OrderFieldsId); //если сохранённы идентификатор отличается от значения по кмолчанию, то заставляем грид установить курсор на запись с данным идентификатором
        }
        else {//иначе устанавливаем курсор согласно сохранённому положению курсору
            if(this.OrderFieldsIndex>=0&& this.OrderFieldsIndex < data.total) {
                this.dgOrderFields.datagrid("selectRow", this.OrderFieldsIndex);
            }
            else if (data.total>0) {
                this.dgOrderFields.datagrid("selectRow", data.total-1);
            }
        }
        //возвращаем значения по умолчанию
        this.OrderFieldsId = -1;
        this.OrderFieldsIndex = 0;
      }
        this.btnDeleteChangeText();
     }

     /**
     * Обновление
     */
    btnUpdate_onClick(){
        let row = this.dgOrderFields.datagrid("getSelected");//получаем выбранную запись
        if(row!=null) {
            this.OrderFieldsIndex = this.dgOrderFields.datagrid("getRowIndex", row);// получаем индекс выбранной записи
            if(this.OrderFieldsIndex<0){this.OrderFieldsIndex = 0;}//даже если нет выбранной записи getSelected может вернуть запись, но getRowIndex отработает корректно и вернёт -1 поэтому заместо -1 запоминаем 0
        }
        let filter = this.txFilter.textbox("getText");//Получаем значение фильтра по коду
        filter = encodeURIComponent(filter);//Кодируем значение фильтра в часть url-а
        let showDel = this.cbShowDel.checkbox("options").checked?"true":"false";//Получаем значение флага отображения удалённых записей
        this.dgOrderFields.datagrid({url: this.GetUrl("/OrderFields/list?filter=" + filter + "&showDel=" + showDel )});//Загружаем список
    }

    /**
     * Проверка прав
     */
    LoadRights(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/CoreUtils/GetActRights?TaskCode=OrderFields.dll&ActCode=OrderFieldsChange'),
            success: function(data){
                if(data.length == 0){
                    this.btnAdd.linkbutton({disabled:false});
                    this.btnChange.linkbutton({disabled:false});
                    this.btnDelete.linkbutton({disabled:false});
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }
    /**
     * Обработка выбора записи
     */
    btnOk_onClick(){
        if(this.dgOrderFields.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для выбора");
            return false;
        }
        let selData = this.dgOrderFields.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись");
            return false;
        }
        if(this.ResultFunc!=null) {
            this.ResultFunc({id: selData.id.toString()});
        }
        this.wOrderFields.window("close");
        return false;
    }

}







/**
 * Функция встраиваемого запуска модуля
 * @param Id идентификатор
 * @constructor
 */
export function StartNestedModul(Id) {
    let form = new OrderFields("nested_", "");
    form.Start(Id);
}
/**
 * Вызов модуля в диалоговом окне
 * @param StartParams стартовые параметры
 * @param ResultFunc функция, которая будет вызываться по нажатию на кнопку "ОК"
 * @constructor
 */
export function StartModalModul(StartParams, ResultFunc) {
    let id = "wOrderFields_Module_OrderFields_OrderFieldsFormList";//идентификатор диалогового окна
    CreateModalWindow(id, "Справочник полей заявки")//функция создания диалогового окна для модуля
    let form = new OrderFields("modal_", StartParams);
    form.SetResultFunc(ResultFunc);
    form.Start(id);
}
