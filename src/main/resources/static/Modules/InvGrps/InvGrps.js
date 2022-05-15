import {FormView} from "../Core/FormView.js";
import {InvGrpsAccFormEdit} from "./InvGrpsAccFormEdit.js";
import {InvGrpsFormEdit} from "./InvGrpsFormEdit.js";


class InvGrps extends FormView {
    /**
     * Конструктор
     * @param prefix - приставка для идентификаторов. Данная приставка добавится для каждого идентификатора
     * @param StartParams - стартовые параметры в формате JSON
     */
    constructor(prefix, StartParams) {
        super();

        this.InvGrpsId = 1; //id группы
        this.InvGrpsIndex = 0;//индекс в combobox группы

        this.InvGrpsAccId = 1; //id счета
        this.InvGrpsAccIndex = 0; //индекс в гриде счета

        this.prefix = prefix;
        this.StartParams = StartParams;
        this.sLoc = new LibLockService(300000);

        this.addRecId = -1;

        this.isFromGrLoad = false;
    }

    /**
     * Функция загрузки формы
     * @param id - идентификатор эелемента HTML, в который будет загружена разметка частичного представления
     * @constructor
     */
    Start(id){
        this.ModuleId = id;
        //Загружаем макет формы и выполняем  функци InitFunc в случае успеха
        LoadForm("#"+this.ModuleId, this.GetUrl("/InvGrps/InvGrpsFormList?prefix=" + this.prefix), this.InitFunc.bind(this));
    }

    /**
     * Функция инициализации пользовательского интерфейса
     * @constructor
     */
    InitFunc(){
        this.InitComponents(this.ModuleId, this.prefix); //Автоматическое получение идентификаторов формы

        AddKeyboardNavigationForGrid(this.dgInvGrps); //Добавляем в датагрид возможность навигации с помощью стрлочек

        //Эл-ты управления для грппы
        this.cbInvGrpsList.combobox({editable: false, onSelect: this.cbInvGrpsList_onSelect.bind(this)});
        this.btnGrAdd.linkbutton({onClick:this.btnGrAdd_onClick.bind(this)});
        this.btnGrChange.linkbutton({onClick:this.btnGrChange_onClick.bind(this)});
        this.btnGrDelete.linkbutton({onClick:this.btnGrDelete_onClick.bind(this)});
        this.btnGrUpdate.linkbutton({onClick: this.btnGrUpdate_onClick.bind(this)});
        this.cbGrShowDel.checkbox({onChange: this.btnGrUpdate_onClick.bind(this)});

        //Эл-ты управления для грппы
        this.dgInvGrps.datagrid({
            loadFilter:this.LoadFilter.bind(this), //LoadFilter - функция, которая находится в родительском классе. Она занимется тем что экранирует теги HTML
            onLoadError:(data)=>{ this.ShowErrorResponse(data.responseJSON); }, //ShowErrorResponse - выводит ошибку в понятном для чтения виде
            rowStyler: this.dgInvGrps_rowStyler.bind(this), //Обработка события перерисовки грида (подсветка удалённых записей)
            onLoadSuccess: this.dgInvGrps_onLoadSuccess.bind(this), //Обработка успешной загрузки данных в грид
            onSelect: this.btnAccDeleteChangeText.bind(this)
        });
        this.btnAccAdd.linkbutton({onClick:this.btnAccAdd_onClick.bind(this)});
        this.btnAccChange.linkbutton({onClick:this.btnAccChange_onClick.bind(this)});
        this.btnAccDelete.linkbutton({onClick:this.btnAccDelete_onClick.bind(this)});
        this.btnAccUpdate.linkbutton({onClick: this.btnAccUpdate_onClick.bind(this)});
        this.cbAccShowDel.checkbox({onChange: this.btnAccUpdate_onClick.bind(this)});

        this.LoadRights();

        this.btnGrUpdate_onClick();
        this.btnAccUpdate_onClick();

        if(this.prefix=="modal_"){
            this.pOkCancel.css("visibility", "visible");
            this.wInvGrps = $("#"+this.ModuleId);
            this.InitCloseEvents(this.wInvGrps, false);//Инициализация закрытия формы по нажатию на клавиши "ESC"
            this.btnCancel.linkbutton({onClick: function(){ this.wInvGrps.window("close") }.bind(this)});
            this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this) });
        }
    }

    /**
     * Проверка прав
     */
    LoadRights(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/CoreUtils/GetActRights?TaskCode=InvGrps.dll&ActCode=InvGrpsChange'),
            success: function(data){
                if(data.length == 0){
                    //this.cbInvGrLoad();

                    this.btnGrAdd.linkbutton({disabled:false});
                    this.btnGrChange.linkbutton({disabled:false});
                    this.btnGrDelete.linkbutton({disabled:false});

                    this.btnAccAdd.linkbutton({disabled:false});
                    this.btnAccChange.linkbutton({disabled:false});
                    this.btnAccDelete.linkbutton({disabled:false});
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /*---------DataGrid---------*/
    /**
     * Обработка окончания загрузки списка счетов по группам инвернтарного учета
     * @param data - информация о загруженных данных
     */
    dgInvGrps_onLoadSuccess(data){
        if(data.total>0) { //в поле total хранится общее количество строк в гриде
            if(this.InvGrpsAccId!=-1) {
                this.dgInvGrps.datagrid("selectRecord", this.InvGrpsAccId); //если сохранённы идентификатор отличается от значения по кмолчанию, то заставляем грид установить курсор на запись с данным идентификатором
            }
            else {//иначе устанавливаем курсор согласно сохранённому положению курсору
                if(this.InvGrpsAccIndex>=0&& this.InvGrpsAccIndex < data.total) {
                    this.dgInvGrps.datagrid("selectRow", this.InvGrpsAccIndex);
                }
                else if (data.total>0) {
                    this.dgInvGrps.datagrid("selectRow", data.total-1);
                }
            }
            //возвращаем значения по умолчанию
            this.InvGrpsAccId = -1;
            this.InvGrpsAccIndex = 0;
        }
        this.btnAccDeleteChangeText();
    }

    /**
     * Обработка события перерисовки грида (подсветка удалённых записей)
     * @param index - позиция записи
     * @param row - запись
     */
    dgInvGrps_rowStyler(index, row) {
        if(row.del==1) {
            return "background-color:gray;";
        }
    }
    /*--------------------------*/

    /*---------ComboBox---------*/
    /**
     * Функция загрузки групп
     * @constructor
     */
    cbInvGrLoad(showDel= false) {
        $.ajax({
            method: "get",
            url: this.GetUrl('/InvGrps/getGroupsList?showDel=' + showDel),
            success: function (data) {
                this.cbInvGrpsList.combobox({
                    valueField: 'id',
                    textField: 'name',
                    data: data
                });

                this.isFromGrLoad = true;

                if (this.addRecId !== -1) {
                    this.isFromGrLoad = false;

                    for (let i = 0; i < data.length; i++) {
                        if (data[i].id === this.addRecId) {
                            this.cbInvGrpsList.combobox("setValue", data[i].id);
                            this.addRecId = -1;
                            return;
                        }
                    }
                } else {
                    this.isFromGrLoad = false;

                    for (let i = 0; i < data.length; i++) {
                        if (data[i].id === this.InvGrpsId) {
                            this.cbInvGrpsList.combobox("setValue", data[i].id);
                            return;
                        }
                    }

                    for (let i = 0; i < data.length; i++) {
                        if (i === this.InvGrpsIndex) {
                            this.cbInvGrpsList.combobox("setValue", data[i].id);
                            return;
                        }
                    }
                }

                this.cbInvGrpsList.combobox("setValue", data[0].id);
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Обработка события выбора группы
     * @param record
     */
    checkRecursive = 0;
    cbInvGrpsList_onSelect(record) {
        if (this.checkRecursive === 0) {
            this.checkRecursive=1;

            if (!this.isFromGrLoad) {
                let data = this.cbInvGrpsList.combobox("getData");

                for (let i = 0; i < data.length; i++) {
                    if (data[i].id === record.id) {
                        this.InvGrpsIndex = i;
                        this.InvGrpsId = record.id;

                        this.cbInvGrpsList.combobox("setValue", data[this.InvGrpsIndex].id);
                        break;
                    }
                }
            }

            if (record.del === 1) {
                this.cbGrShowDel.checkbox("disable");
                this.btnGrDelete.linkbutton({iconCls:"icon-undo", text:""});
            } else {
                this.cbGrShowDel.checkbox("enable");
                this.btnGrDelete.linkbutton({iconCls:"icon-remove", text:""});
            }

            this.btnGrUpdate_onClick();
            this.btnAccUpdate_onClick();
        }
        else this.checkRecursive=0;
    }
    /*--------------------------*/


    /*=============================================================================================================*/
    /*---------Update---------*/
    /**
     * Обновление спсика групп инв. учета
     * isDel - показывать ли удал
     */
    btnGrUpdate_onClick() {
            let showDel = this.cbGrShowDel.checkbox("options").checked?"true":"false";

            if (!this.isFromGrLoad) this.cbInvGrLoad(showDel);
    }

    /*-----------Add----------*/
    /**
     * Обработка добавления группы
     */
    btnGrAdd_onClick(){
        let form = new InvGrpsFormEdit();//Ссоздание формы редактирования
        form.SetResultFunc((RecId)=>{  this.addRecId=RecId; this.btnGrUpdate_onClick();});//Передача функции, которая будет вызвана по нажатию на кнопку ОК
        form.Show({AddMode: true});//Показать форму
    }

    /*---------Change---------*/
    /**
     * Обработка изменения группы
     */
    btnGrChange_onClick(){
        if(this.cbInvGrpsList.length==0){
            this.ShowWarning("Нет записей для удаления");
            return false;
        }

        let cbVal = this.cbInvGrpsList.combobox("getValue");
        if(cbVal==null) {
            this.ShowWarning("Выберите запись для удаления");
            return false;
        }

        let data = this.cbInvGrpsList.combobox("getData");

        let editMode = true;//Keys.isKeyDown(Keys.VK_Z) || Keys.isKeyDown(Keys.VK_OEM_PERIOD); //проверка нажатия на кнопки Z и . если одна из них нажата, то запись нужно попытаться открыть на редактирование

        if(editMode){
            this.sLoc.LockRecord("inv_grps", data[this.InvGrpsIndex].id, this.btnContinueChange_onClick.bind(this));
        }
        else {
            this.btnContinueChange_onClick({id: data[this.InvGrpsIndex].id, AddMode:false, editMode: editMode, lockMessage:'', lockState: false});
        }
    }
    /*---------ContinueChange---------*/
    /*
    * Продолжение изменения группы
    * */
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

        let form = new InvGrpsFormEdit();

        form.SetResultFunc((RecId)=>{   this.btnGrUpdate_onClick();});
        form.SetCloseWindowFunction((options)=>{
            if(options!=null){
                if(options.lockState){
                    this.sLoc.FreeLockRecord("inv_grps", options.id);
                }
            }
        });

        form.Show(options);
    }

    /*---------Delete---------*/
    /**
     * Удаление группы
     */
    btnGrDelete_onClick(){
        if(this.cbInvGrpsList.length==0){
            this.ShowWarning("Нет записей для удаления");
            return false;
        }

        let cbVal = this.cbInvGrpsList.combobox("getValue");
        if(cbVal==null) {
            this.ShowWarning("Выберите запись для удаления");
            return false;
        }

        let data = this.cbInvGrpsList.combobox("getData");

        let header = "Удаление";
        let action = "удалить";

        if(data[this.InvGrpsIndex].del >= 0) {
            header = "Восстановление";
            action = "восстановить";
        }

        $.messager.confirm(header, "Вы действительно хотите " + action + " выделенную группу " + data[this.InvGrpsIndex].name + "?",
            function(result){
                if(result){
                    this.sLoc.StateLockRecord("inv_grps", data[this.InvGrpsIndex].id, this.btnContinueDelete_onClick.bind(this, data[this.InvGrpsIndex].del));
                }
            }.bind(this));
    }

    /*---------ContinueDelete---------*/
    /**
     * Продолжение процесса удаления группы
     * @param options
     */
    btnContinueDelete_onClick(isDel, options){
        if(options.data.length > 0){
            this.ShowWarning(options.data);
        }
        else
        {
            $.ajax({
                method: "POST",
                url: this.GetUrl('/InvGrps/delGroup'),
                data: {id: options.id},
                success:function(data) {
                    if(data.length) {
                        this.ShowWarning(data);
                    } else {
                        this.btnGrUpdate_onClick(isDel);
                    }
                }.bind(this),
                error:function(data){ this.ShowErrorResponse(data.responseJSON); }.bind(this)
            });
        }
    }
    /*---------DeleteChangeText---------*/
    /**
     * Изменение текста на кнопке "Удалить"
     */
    btnGrDeleteChangeText() {
        let data = this.cbInvGrpsList.combobox("getData");

        if (data.length>0) {
            if(data[this.InvGrpsIndex``].del === 1 )
                this.btnGrDelete.linkbutton({iconCls:"icon-undo", text:""});
            else
                this.btnGrDelete.linkbutton({iconCls:"icon-remove", text:""});
        }
    }
    /*=============================================================================================================*/
    /*---------Update---------*/
    /**
     * Обновление спсика счетов
     */
    btnAccUpdate_onClick(){
        let row = this.dgInvGrps.datagrid("getSelected");//получаем выбранную запись
        if(row!=null) {
            this.InvGrpsAccIndex = this.dgInvGrps.datagrid("getRowIndex", row);// получаем индекс выбранной записи
            if(this.InvGrpsAccIndex<0){this.InvGrpsAccIndex = 0;}//даже если нет выбранной записи getSelected может вернуть запись, но getRowIndex отработает корректно и вернёт -1 поэтому заместо -1 запоминаем 0
        }

        let showDel = (this.cbAccShowDel.checkbox("options").checked?"true":"false").toString();

        $.ajax({
            method:"get",
            url: this.GetUrl('/InvGrps/getGroupAccsList?&showDel=' + showDel + '&invGrpsId=' + this.InvGrpsId),
            success: function(data){
                for(let i = 0; i < data.length; i++) {
                    data[i]['perc'] = data[i]['perc'] + '%';
                }

                this.dgInvGrps.datagrid({data});
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /*-----------Add----------*/
    /*
    * Добавление счета в группу
    * */
    btnAccAdd_onClick() {
        let form = new InvGrpsAccFormEdit();//Ссоздание формы редактирования
        form.SetResultFunc((RecId)=>{ this.InvGrpsAccId = RecId; this.btnAccUpdate_onClick();});//Передача функции, которая будет вызвана по нажатию на кнопку ОК
        form.Show({invGrpsId: this.InvGrpsId, accId: this.InvGrpsAccId, AddMode: true});//Показать форму
    }

    /*---------Change---------*/
    /**
     * Обработка изменения записи
     */
    btnAccChange_onClick(){
        if(this.dgInvGrps.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для изменения");
            return false;
        }
        let selData = this.dgInvGrps.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для изменения");
            return false;
        }

        let editMode = true;//Keys.isKeyDown(Keys.VK_Z) || Keys.isKeyDown(Keys.VK_OEM_PERIOD); //проверка нажатия на кнопки Z и . если одна из них нажата, то запись нужно попытаться открыть на редактирование
        if(editMode){
            this.sLoc.LockRecord("inv_grp_accs", selData.id, this.btnAccContinueChange_onClick.bind(this));
        }
        else {
            this.btnAccContinueChange_onClick({id: selData.id, invGrpsId: this.InvGrpsId/*(this.invGrpsId.split(" = ")[1]).split(" ")[0]*/, AddMode:false, lockMessage:'', lockState: false});
        }
    }
    /*---------ContinueChange---------*/
    /*
    * Продолжение изменения
    * */
    btnAccContinueChange_onClick(options){
        if(options.lockMessage.length!=0){
            this.ShowSlide("Предупреждение", options.lockMessage)
            options.editMode = false;
        }
        else{
            if(options.editMode){
                options.lockState = true
            }
        }

        options.invGrpsId = this.InvGrpsId;

        let form = new InvGrpsAccFormEdit();
        form.SetResultFunc((RecId)=>{  this.InvGrpsAccId=RecId; this.btnAccUpdate_onClick();});
        form.SetCloseWindowFunction((options)=>{
            if(options!=null){
                if(options.lockState){
                    this.sLoc.FreeLockRecord("inv_grp_accs", options.id);
                }
            }
        });
        form.Show(options);
    }

    /*---------Delete---------*/
    /**
     * Удаление записи
     */
    btnAccDelete_onClick(){
        if(this.dgInvGrps.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для удаления");
            return false;
        }
        let selData = this.dgInvGrps.datagrid("getSelected");
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
        $.messager.confirm(header, "Вы действительно хотите " + action + " выделенный счет " + selData.name + " с кодом " + selData.code + "?",
            function(result){
                if(result){
                    this.sLoc.StateLockRecord("inv_grp_accs", selData.id, this.btnAccContinueDelete_onClick.bind(this));
                }
            }.bind(this));
    }
    /*---------ContinueDelete---------*/
    /**
     * Продолжение процесса удаления записи
     * @param options
     */
    btnAccContinueDelete_onClick(options){
        if(options.data.length > 0){
            this.ShowWarning(options.data);
        }
        else
        {
            $.ajax({
                method: "POST",
                url: this.GetUrl('/InvGrps/delAcc'),
                data: {id: options.id},
                success:function(data){
                    if(data.length) {
                        this.ShowWarning(data);
                    }
                    else{
                        this.btnAccUpdate_onClick();
                    }
                }.bind(this),
                error:function(data){ this.ShowErrorResponse(data.responseJSON); }.bind(this)
            });
        }
    }
    /*---------DeleteChangeText---------*/
    /**
     * Изменение текста на кнопке "Удалить"
     */
    btnAccDeleteChangeText(){
        if(this.dgInvGrps.datagrid("getRows").length != 0){
            let selData = this.dgInvGrps.datagrid("getSelected");
            if(selData !=null ){
                if(selData.del==1){
                    this.btnAccDelete.linkbutton({iconCls:"icon-undo", text:"Вернуть"});
                }
                else {
                    this.btnAccDelete.linkbutton({iconCls:"icon-remove", text:"Удалить"});
                }
            }
            else {
                this.btnAccDelete.linkbutton({iconCls:"icon-remove", text:"Удалить"});
            }
        }
        else {
            this.btnAccDelete.linkbutton({iconCls:"icon-remove", text:"Удалить"});
        }
    }
    /*=============================================================================================================*/

    /**
     * Обработка выбора записи
     */
    btnOk_onClick(){
        if(this.dgInvGrps.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для выбора");
            return false;
        }
        let selData = this.dgInvGrps.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись");
            return false;
        }
        if(this.ResultFunc!=null) {
            this.ResultFunc({id: selData.id.toString()});
        }
        this.wInvGrps.window("close");
        return false;
    }
}

/**
 * Функция встраиваемого запуска модуля
 * @param Id идентификатор
 * @constructor
 */
export function StartNestedModul(Id) {
    let form = new InvGrps("nested_", {});
    form.Start(Id);
}

/**
 * Вызов модуля в диалоговом окне
 * @param StartParams стартовые параметры
 * @param ResultFunc функция, которая будет вызываться по нажатию на кнопку "ОК"
 * @constructor
 */
export function StartModalModul(StartParams, ResultFunc) {
    let id = "wInvGrps_Module_InvGrps_InvGrpsFormList";//идентификатор диалогового окна

    CreateModalWindow(id, "Счета по группам инвентарного учета")//функция создания диалогового окна для модуля

    let form = new InvGrps("modal_", StartParams);

    form.SetResultFunc(ResultFunc);
    form.Start(id);
}