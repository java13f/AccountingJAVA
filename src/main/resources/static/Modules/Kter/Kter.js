import {FormView} from "../Core/FormView.js";
import {KterFormEdit} from "./KterFormEdit.js";

/**
 * Основной класс модуля
 */
class Kter extends FormView {
    /**
     * Конструктор
     * @param prefix - приставка для идентификаторов. Данная приставка добавится для каждого идентификатора
     * @param StartParams - стартовые параметры в формате JSON
     */
    constructor(prefix, StartParams) {
        super();//Вызов контруктора у родительского класса
        this.KterId = -1; //Переменная для запоминанися последней добавленной/изменённой записи
        this.KterIndex = 0; //Позиция курсора. Применяется для восстановления позиции курсора при обновлении данных
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
        LoadForm("#"+this.ModuleId, this.GetUrl("/Kter/KterFormList?prefix=" + this.prefix), this.InitFunc.bind(this));
    }

    /**
     * Функция инициализации пользовательского интерфейса
     * @constructor
     */
    InitFunc(){
        this.InitComponents(this.ModuleId, this.prefix); //Автоматическое получение идентификаторов формы
        AddKeyboardNavigationForGrid(this.dgKter); //Добавляем в датагрид возможность навигации с помощью стрлочек
        this.dgKter.datagrid({
            loadFilter:this.LoadFilter.bind(this), //LoadFilter - функция, которая находится в родительском классе. Она занимется тем что экранирует теги HTML
            onLoadError:(data)=>{ this.ShowErrorResponse(data.responseJSON); }, //ShowErrorResponse - выводит ошибку в понятном для чтения виде
            rowStyler: this.dgKter_rowStyler.bind(this), //Обработка события перерисовки грида (подсветка удалённых записей)
            onLoadSuccess: this.dgKter_onLoadSuccess.bind(this), //Обработка успешной загрузки данных в грид
            onSelect: this.btnDeleteChangeText.bind(this)
        });
        this.btnUpdate.linkbutton({onClick: this.btnUpdate_onClick.bind(this)});//зададим функцию обработки события кнопки onClick
        this.txFilter.textbox({onChange: this.btnUpdate_onClick.bind(this)}); //обработаем событие изменения текста в фильтре по коду
        this.cbShowDel.checkbox({onChange: this.btnUpdate_onClick.bind(this)});//обработка события изменения значения чекбокса
        this.LoadRights();//получение прав на изменение
        this.btnAdd.linkbutton({onClick:this.btnAdd_onClick.bind(this)});//назначение функции обработки нажатия на кнопку добавления записи
        this.btnChange.linkbutton({onClick:this.btnChange_onClick.bind(this)});//назначение функции обработки нажатия на кнопку изменения записи
        this.btnDelete.linkbutton({onClick:this.btnDelete_onClick.bind(this)});//назначение функции обработки нажатия на кнопку удаления записи
        this.btnUpdate_onClick();//вызовем функцию обновления кодов территорий
        if(this.prefix=="modal_"){
            this.pOkCancel.css("visibility", "visible");
            this.wKter = $("#"+this.ModuleId);
            this.InitCloseEvents(this.wKter, false);//Инициализация закрытия формы по нажатию на клавиши "ESC"
            this.btnCancel.linkbutton({onClick: function(){ this.wKter.window("close") }.bind(this)});
            this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this) });
        }
    }

    /**
     * Обработка события перерисовки грида (подсветка удалённых записей)
     * @param index - позиция записи
     * @param row - запись
     */
    dgKter_rowStyler(index, row) {
        if(row.del==1) {
            return "background-color:gray;";
        }
    }
    /**
     * Обработка окончания загрузки списка кодов территорий
     * @param data - информация о загруженных данных
     */
    dgKter_onLoadSuccess(data){
        if(data.total>0) { //в поле total хранится общее количество строк в гриде
            if(this.KterId!=-1) {
                this.dgKter.datagrid("selectRecord", this.KterId); //если сохранённы идентификатор отличается от значения по кмолчанию, то заставляем грид установить курсор на запись с данным идентификатором
            }
            else {//иначе устанавливаем курсор согласно сохранённому положению курсору
                if(this.KterIndex>=0&& this.KterIndex < data.total) {
                    this.dgKter.datagrid("selectRow", this.KterIndex);
                }
                else if (data.total>0) {
                    this.dgKter.datagrid("selectRow", data.total-1);
                }
            }
            //возвращаем значения по умолчанию
            this.KterId = -1;
            this.KterIndex = 0;
        }
        this.btnDeleteChangeText();
    }

    /**
     * Обновление спсика кодов территорий
     */
    btnUpdate_onClick(){
        let row = this.dgKter.datagrid("getSelected");//получаем выбранную запись
        if(row!=null) {
            this.KterIndex = this.dgKter.datagrid("getRowIndex", row);// получаем индекс выбранной записи
            if(this.KterIndex<0){this.KterIndex = 0;}//даже если нет выбранной записи getSelected может вернуть запись, но getRowIndex отработает корректно и вернёт -1 поэтому заместо -1 запоминаем 0
        }
        let filter = this.txFilter.textbox("getText");//Получаем значение фильтра по коду
        filter = encodeURIComponent(filter);//Кодируем значение фильтра в часть url-а
        let showDel = this.cbShowDel.checkbox("options").checked?"true":"false";//Получаем значение флага отображения удалённых записей
        this.dgKter.datagrid({url: this.GetUrl("/Kter/list?filter=" + filter + "&showDel=" + showDel )});//Загружаем список кодов территорий
    }

    /**
     * Обработка
     */
    btnAdd_onClick(){
        let form = new KterFormEdit();//Ссоздание формы редактирования
        form.SetResultFunc((RecId)=>{ this.KterId = RecId; this.btnUpdate_onClick();});//Передача функции, которая будет вызвана по нажатию на кнопку ОК
        form.Show({AddMode: true});//Показать форму
    }
    /**
     * Проверка прав
     */
    LoadRights(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/CoreUtils/GetActRights?TaskCode=Kter.dll&ActCode=KterChange'),
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
     * Обработка изменения записи
     */
    btnChange_onClick(){
        if(this.dgKter.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для изменения");
            return false;
        }
        let selData = this.dgKter.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для изменения");
            return false;
        }
        let editMode = true;//Keys.isKeyDown(Keys.VK_Z) || Keys.isKeyDown(Keys.VK_OEM_PERIOD); //проверка нажатия на кнопки Z и . если одна из них нажата, то запись нужно попытаться открыть на редактирование
        if(editMode){
            this.sLoc.LockRecord("Kter", selData.id, this.btnContinueChange_onClick.bind(this));
        }
        else {
            this.btnContinueChange_onClick({id: selData.id, AddMode:false, editMode: editMode, lockMessage:'', lockState: false});
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
        let form = new KterFormEdit();
        form.SetResultFunc((RecId)=>{  this.KterId = RecId; this.btnUpdate_onClick();});
        form.SetCloseWindowFunction((options)=>{
            if(options!=null){
                if(options.lockState){
                    this.sLoc.FreeLockRecord("kter", options.id);
                }
            }
        });
        form.Show(options);
    }

    /**
     * Удаление записи
     */
    btnDelete_onClick(){
        if(this.dgKter.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для удаления");
            return false;
        }
        let selData = this.dgKter.datagrid("getSelected");
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
        $.messager.confirm(header, "Вы действительно хотите " + action + " выделенную территорию " + selData.name + " с кодом " + selData.code + "?"),
            function(result){
                if(result){
                    this.sLoc.StateLockRecord("kter", selData.id, this.btnContinueDelete_onClick.bind(this));
                }
            }.bind(this);
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
                url: this.GetUrl('/Kter/delete'),
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
        if(this.dgKter.datagrid("getRows").length != 0){
            let selData = this.dgKter.datagrid("getSelected");
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
     * Обработка выбора записи
     */
    btnOk_onClick(){
        if(this.dgKter.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для выбора");
            return false;
        }
        let selData = this.dgKter.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись");
            return false;
        }
        if(this.ResultFunc!=null) {
            this.ResultFunc({id: selData.id.toString()});
        }
        this.wKter.window("close");
        return false;
    }
}

/**
 * Функция встраиваемого запуска модуля
 * @param Id идентификатор
 * @constructor
 */
export function StartNestedModul(Id) {
    let form = new Kter("nested_", {});
    form.Start(Id);
}

/**
 * Вызов модуля в диалоговом окне
 * @param StartParams стартовые параметры
 * @param ResultFunc функция, которая будет вызываться по нажатию на кнопку "ОК"
 * @constructor
 */
export function StartModalModul(StartParams, ResultFunc) {
    let id = "wKter_Module_Kter_KterFormList";//идентификатор диалогового окна
    CreateModalWindow(id, "Справочник кодов территорий")//функция создания диалогового окна для модуля
    let form = new Kter("modal_", StartParams);
    form.SetResultFunc(ResultFunc);
    form.Start(id);
}