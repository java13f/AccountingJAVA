export class AppFormSel{
    constructor() {
        this.AppsId = -1;
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
     * Показать форму выбора приложения
     */
    Show(){
        LoadForm("#ModalWindows", this.GetUrl("/AdminApps/AppFormSel"), this.InitFunc.bind(this));
    }
    /**
     * Функция инициализации пользовательского интерфейса
     */
    InitFunc(){
        this.wAppFormSel = $("#wAppFormSel_Module_Admin");
        this.dgApps = $("#dgApps_Module_Admin_AppFormSel");
        this.btnOk = $("#btnOk_Module_Admin_AppFormSel");
        this.btnCancel = $("#btnCancel_Module_Admin_AppFormSel");
        this.btnUpdate = $("#btnUpdate_Module_Admin_AppFormSel");
        this.wAppFormSel.window({onClose:()=>{
                this.wAppFormSel.window("destroy");
            }});
        this.wAppFormSel.window('window').attr('tabindex',1).focus().bind('keyup', function(e){
            if (e.keyCode == Keys.VK_ESCAPE){
                this.wAppFormSel.window('close');
            }
        }.bind(this))
        this.dgApps.treegrid({
            loadFilter:this.LoadFilter.bind(this),
            onLoadError:(data)=>{ this.ShowErrorResponse(data.responseJSON); },
            onLoadSuccess:this.dgApps_onLoadSuccess.bind(this)
        });
        this.btnOk.attr("href", "javascript:void(0)");
        this.btnCancel.attr("href", "javascript:void(0)");
        this.btnUpdate.attr("href", "javascript:void(0)");
        this.btnCancel.linkbutton({
            onClick:()=>{
                this.wAppFormSel.window("close");
            }});
        this.btnUpdate.linkbutton({
            onClick:this.btnAppsUpdate_onClick.bind(this)
        });
        this.btnOk.linkbutton({
            onClick: this.btnOk_onClick.bind(this)
        });
        this.dgApps.treegrid({url:this.GetUrl("/AdminApps/List")});
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
     * Обработка обновления списка приложений
     */
    btnAppsUpdate_onClick() {
        if(this.AppsId == -1){
            let selData = this.dgApps.treegrid("getSelected");
            if(selData!=null) {
                this.AppsId = selData.id;
            }
        }
        this.dgApps.treegrid({url:this.GetUrl("/AdminApps/List")});
    }

    /**
     * Обработка выбора записи
     */
    btnOk_onClick(){
        let selData = this.dgApps.datagrid("getSelected");
        if(selData==null)
        {
            this.ShowWarning("Выберите запись");
            return false;
        }
        if(this.OkFunc!=null)
        {
            this.OkFunc(selData.id);
        }
        this.wAppFormSel.window("close");
        return false;
    }
    /**
     * Обработка окончания загрузки списка приложений
     * @param data - информация о загруженных данных
     */
    dgApps_onLoadSuccess(row, data){
        if(data.length>0) {
            if(this.AppsId!=-1) {
                this.dgApps.treegrid("select", this.AppsId);
            }
            else
            {
                this.dgApps.treegrid("select", data[0].id);
            }
            this.AppsId = -1;
        }
    }
}