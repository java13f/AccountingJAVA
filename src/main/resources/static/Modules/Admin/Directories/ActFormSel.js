import {ActFilterForm} from "../ActFilterForm.js";

export class ActFormSel{
    constructor() {
        this.ActIndex = 0
        this.FilterActsAppId = -1;
        this.FilterActsCode = "";
        this.FilterActsName = "";
    }
    /**
     * Задать функцию, которая вызовется при на жатию на кнопку ОК
     * @param OkFunc - функция родительского модуля
     */
    SetOkFunction(OkFunc) {
        this.OkFunc = OkFunc;
    }
    /**
     * Получить url-адрес с учетом контекста
     * @param url - url-адрес без учета контекста
     */
    GetUrl(url) {
        return contextPath + url;
    }

    /**
     * Показать форму выбора действия
     */
    Show(){
        LoadForm("#ModalWindows", this.GetUrl("/AdminActs/ActFormSel"), this.InitFunc.bind(this));
    }
    /**
     * Функция инициализации пользовательского интерфейса
     */
    InitFunc(){
        this.wActFormSel = $("#wActFormSel_Module_Admin");
        this.dgActs = $("#dgActs_Module_Admin_ActFormSel");
        this.btnOk = $("#btnOk_Module_Admin_ActFormSel");
        this.btnCancel = $("#btnCancel_Module_Admin_ActFormSel");
        this.btnUpdate = $("#btnUpdate_Module_Admin_ActFormSel");
        this.btnShowFilter = $("#btnShowFilter_Module_Admin_ActFormSel");
        this.wActFormSel.window({onClose:()=>{
                this.wActFormSel.window("destroy");
            }});
        this.wActFormSel.window('window').attr('tabindex',1).focus().bind('keyup', function(e){
            if (e.keyCode == Keys.VK_ESCAPE){
                this.wActFormSel.window('close');
            }
        }.bind(this))
        this.dgActs.datagrid({
            loadFilter:this.LoadFilter.bind(this),
            onLoadError:(data)=>{ this.ShowErrorResponse(data.responseJSON); },
            onLoadSuccess:this.dgActs_onLoadSuccess.bind(this)
        });
        this.btnOk.attr("href", "javascript:void(0)");
        this.btnCancel.attr("href", "javascript:void(0)");
        this.btnUpdate.attr("href", "javascript:void(0)");
        this.btnShowFilter.attr("href", "javascript:void(0)");
        this.btnCancel.linkbutton({
            onClick:()=>{
                this.wActFormSel.window("close");
            }});
        this.btnUpdate.linkbutton({
            onClick:this.btnActsUpdate_onClick.bind(this)
        });
        this.btnOk.linkbutton({
            onClick: this.btnOk_onClick.bind(this)
        });
        this.btnShowFilter.linkbutton({
            onClick: this.btnShowFilter_onClick.bind(this)
        });
        this.dgActs.datagrid({url:this.GetUrl("/AdminActs/List")});
    }
    /**
     * Фильтрация получаемых данных с сервера приложений
     * @param data - данные, которые необходимо профильтровать
     */
    LoadFilter(data) {
        return EscapeSpecialHTMLCharacters(data);
    }
    /**
     * Показать ошибку, которую возвращает сервер
     * @param responseJSON - объект ошибки
     */
    ShowErrorResponse(responseJSON) {
        let error = "message: " + responseJSON.message + "<br/>"
            +"error: " + responseJSON.error + "<br/>"
            +"status: " + responseJSON.status + "<br/>"
            +"path: " + responseJSON.path;
        this.ShowError(error);
    }

    /**
     * Показать предупреждение
     * @param text - текст предупреждения
     */
    ShowWarning(text) {
        $.messager.alert("Предупреждение", text, "warning");
    }

    /**
     * Показать ошибку
     * @param text - тескт ошибки
     */
    ShowError(text) {
        $.messager.alert("Ошибка", text, "error");
    }
    /**
     * Обработка обновления списка действий
     */
    btnActsUpdate_onClick() {
        let row = this.dgActs.datagrid("getSelected");
        if(row!=null)
        {
            this.ActIndex = this.dgActs.datagrid("getRowIndex", row);
        }
        let code = encodeURIComponent(this.FilterActsCode);
        let name = encodeURIComponent(this.FilterActsName);
        let appId = this.FilterActsAppId
        this.dgActs.datagrid({url:this.GetUrl("/AdminActs/List?code=" + code
                + "&appId=" + appId
                + "&name=" + name)});
    }

    /**
     * Обработка выбора записи
     */
    btnOk_onClick(){
        if(this.dgActs.datagrid("getRows").length == 0)
        {
            this.ShowWarning("Нет записей для выбора");
            return false;
        }
        let selData = this.dgActs.datagrid("getSelected");
        if(selData==null)
        {
            this.ShowWarning("Выберите запись");
            return false;
        }
        if(this.OkFunc!=null)
        {
            this.OkFunc(selData.appId, selData.id);
        }
        this.wActFormSel.window("close");
        return false;
    }
    /**
     * Обработка окончания загрузки списка действий
     * @param data - информация о загруженных данных
     */
    dgActs_onLoadSuccess(data){
        if(data.total>0)
        {
            if(this.ActIndex>=0&& this.ActIndex < data.total) {
                this.dgActs.datagrid("selectRow", this.ActIndex);
            }
            else if (data.total>0) {
                this.dgActs.datagrid("selectRow", data.total-1);
            }
            this.ActIndex = 0;
        }
    }

    /**
     * Покзать фильтр
     */
    btnShowFilter_onClick(){
        let form = new ActFilterForm();
        form.SetResultFunc(function(data){
            this.FilterActsCode = data.Code;
            this.FilterActsAppId = data.AppId;
            this.FilterActsName = data.Name;
            this.btnActsUpdate_onClick();
        }.bind(this));
        form.Show({AddMode: true, Code: this.FilterActsCode, Name: this.FilterActsName, AppId: this.FilterActsAppId});
    }
}