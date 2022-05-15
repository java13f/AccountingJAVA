import {FormView} from "../Core/FormView.js";
import {KOKFormEdit} from "./KOKFormEdit.js";

class KOK extends  FormView {

    constructor(prefix, StartParams) {
        super();
        this.KOKId = -1;
        this.KOKIndex = 0;
        this.prefix = prefix;
        this.ResultFunc = null;
        this.StartParams = StartParams;
        this.sLoc = new LibLockService(300000);
    }

    /**
     * Получить url-адрес с учетом контекста
     * @param url - url-адрес без учета контекста
     */

    Start(id) {
        this.ModuleId = id;
        LoadForm("#"+this.ModuleId, this.GetUrl("/KOK/KOKFormList?prefix=" + this.prefix), this.InitFunc.bind(this));

    }
    InitFunc(){
        this.InitComponents(this.ModuleId, this.prefix);
        AddKeyboardNavigationForGrid(this.dgKok);
        this.dgKok.datagrid({
            loadFilter:this.LoadFilter.bind(this),
            onLoadError:(data)=>{ this.ShowErrorResponse(data.responseJSON); },
            onLoadSuccess: this.dgKOK_onLoadSuccess.bind(this),
            rowStyler: this.dgKOK_rowStyler.bind(this),
            onSelect: this.btnDeleteChangeText.bind(this)
        });
        this.cbShowDel.checkbox({onChange: this.btnUpdate_onClick.bind(this)});
        this.btnAdd.linkbutton({onClick:this.btnAdd_onClick.bind(this)});
        this.btnChange.linkbutton({onClick:this.btnChange_onClick.bind(this)});
        this.btnDelete.linkbutton({onClick:this.btnDelete_onClick.bind(this)});
        this.btnUpdate.linkbutton({onClick:this.btnUpdate_onClick.bind(this)});
        this.btnUpdate_onClick();
        this.LoadRights();
        if(this.prefix=="modal_"){
            this.pOkCancel.css("visibility", "visible");
            this.wUnits = $("#"+this.ModuleId);
            this.InitCloseEvents(this.wUnits, false);//Инициализация закрытия формы по нажатию на клавиши "ESC"
            this.btnCancel.linkbutton({onClick: function(){ this.wUnits.window("close") }.bind(this)});
            this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this) });
        }
    }
    btnDeleteChangeText(){
        if(this.dgKok.datagrid("getRows").length != 0){
            let selData = this.dgKok.datagrid("getSelected");
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
     * Показать ошибку, которую возвращает сервер
     * @param responseJSON - объект ошибки
     */


    /**
     * Фильтрация получаемых данных с сервера приложений
     * @param data - данные, которые необходимо профильтровать
     */
    LoadFilter(data) {
        return EscapeSpecialHTMLCharacters(data);
    }
    dgKOK_rowStyler(index, row)
    {
        if(row.del==1) {
            return "background-color:gray;";
        }
    }
    /**
     * Обработка окончания загрузки списка кодов органов казначейств
     * @param data - информация о загруженных данных
     */
    dgKOK_onLoadSuccess(data){
        if(data.total>0)
        {
            if(this.KOKId!=-1) {
                this.dgKok.datagrid("selectRecord", this.KOKId);
            }
            else
            {
                if(this.KOKIndex>=0&& this.KOKIndex < data.total)
                {
                    this.dgKok.datagrid("selectRow", this.KOKIndex);
                }
                else if (data.total>0)
                {
                    this.dgKok.datagrid("selectRow", data.total-1);
                }
            }
            this.KOKId = -1;
            this.KOKIndex = 0;
        }
    }

    /**
     * Обновить список казначейств
     */
    btnUpdate_onClick(){
        let row = this.dgKok.datagrid("getSelected");
        if(row!=null) {
            this.KOKIndex = this.dgKok.datagrid("getRowIndex", row);
            if(this.KOKIndex<0){this.KOKIndex = 0;}
        }
        let showDel = this.cbShowDel.checkbox("options").checked?"true":"false";
        this.dgKok.datagrid({url: this.GetUrl("/KOK/List?showDel="+showDel)});
    }

    /**
     * Проверка прав
     */
    LoadRights(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/CoreUtils/GetActRights?TaskCode=KOK.dll&ActCode=KOKChange'),
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
     * Обработка нового казначейства
     */
    btnAdd_onClick(){
        let form = new KOKFormEdit();
        form.SetResultFunc((RecId)=>{  this.KOKId = RecId; this.btnUpdate_onClick();});
        form.Show({AddMode: true});
    }
    /**
     * Обработка изменения кода органа казначейства
     */
    btnChange_onClick(){
        if(this.dgKok.datagrid("getRows").length == 0)
        {
            this.ShowWarning("Нет записей для редактирования");
            return false;
        }
        let selData = this.dgKok.datagrid("getSelected");
        if(selData==null)
        {
            this.ShowWarning("Выберите запись для редактирования");
            return false;
        }

            this.sLoc.LockRecord("kok", selData.id, this.btnContinueChange_onClik.bind(this));

    }

    /**
     * Продолжение открытия кода органа казначейства для изменения
     * @param options - настройки открытия кода органа казначейства
     */
    btnContinueChange_onClik(options){
        if(options.lockMessage.length!=0){
            this.ShowSlide("Предупреждение", options.lockMessage);
            options.editMode = false;
        }
        else{
            if(options.editMode){
                options.lockState = true
            }
        }
        let form = new KOKFormEdit();
        form.SetResultFunc((RecId)=>{  this.KOKId = RecId; this.btnUpdate_onClick();});
        form.SetCloseWindowFunction((options)=>{
            if(options!=null){
                if(options.lockState){
                    this.sLoc.FreeLockRecord("kok", options.id);
                }
            }
        });
        let i = this.editMode;
        form.Show(options,i);
    }
    /**
     * Удаление кода органа казначейства
     */
    btnDelete_onClick(){
        if(this.dgKok.datagrid("getRows").length == 0)
        {
            this.ShowWarning("Нет записей для удаления");
            return false;
        }
        let selData = this.dgKok.datagrid("getSelected");
        if(selData==null)
        {
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
        $.messager.confirm(header, "Вы действительно хотите " + action + " код органов казначейства с кодом " + selData.code + "?",
            function(result){
                if(result){
                    this.sLoc.StateLockRecord("kok", selData.id, this.btnContinueDelete_onClick.bind(this));
                }
            }.bind(this));
    }

    /**
     * Продолжение удаления кода органа казначейства
     * @param options - настройки удаления кода органа казначейства
     */
    btnContinueDelete_onClick(options){
        if(options.data.length > 0){
            this.ShowWarning(options.data);
        }
        else{
        $.ajax({
            method: "POST",
            url: this.GetUrl('/KOK/Delete'),
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
     * Обработка выбора кода органа казначейства
     */
    btnOk_onClick() {
        if(this.dgKok.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для выбора");
            return false;
        }
        let selData = this.dgKok.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись");
            return false;
        }
        if(this.ResultFunc!=null) {
            this.ResultFunc({id: selData.id.toString()});
        }
        this.wKok.window("close");
        return false;
    }
}

export function StartNestedModul(id) {
    let form = new KOK("nested_", "");
    form.Start(id);
}

export function StartModalModul(StartParams, ResultFunc) {
    let id = "wKok_Module_KOK_ListForm";//идентификатор диалогового окна
    CreateModalWindow(id, "Справочник кодов органов казначейств")//функция создания диалогового окна для модуля
    let form = new KOK("modal_", StartParams);

    form.SetResultFunc(ResultFunc);
    form.Start(id);
}