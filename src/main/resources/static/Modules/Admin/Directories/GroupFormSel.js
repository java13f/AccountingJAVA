export class GroupFormSel{
    constructor() {
        this.GroupIndex = 0;
        this.GroupId = -1;
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
     * Показать форму выбора группы
     */
    Show(){
        LoadForm("#ModalWindows", this.GetUrl("/AdminGroups/GroupFormSel"), this.InitFunc.bind(this));
    }
    /**
     * Функция инициализации пользовательского интерфейса
     */
    InitFunc(){
        this.wGroupFormSel = $("#wGroupFormSel_Module_Admin");
        this.dgGroups = $("#dgGroups_Module_Admin_GroupFormSel");
        this.btnOk = $("#btnOk_Module_Admin_GroupFormSel");
        this.btnCancel = $("#btnCancel_Module_Admin_GroupFormSel");
        this.btnUpdate = $("#btnUpdate_Module_Admin_GroupFormSel");
        this.txGroupFilter = $("#txGroupFilter_Module_Admin_GroupFormSel");
        this.wGroupFormSel.window({onClose:()=>{
                this.wGroupFormSel.window("destroy");
            }});
        this.wGroupFormSel.window('window').attr('tabindex',1).focus().bind('keyup', function(e){
            if (e.keyCode == Keys.VK_ESCAPE){
                this.wGroupFormSel.window('close');
            }
        }.bind(this))
        this.dgGroups.datagrid({
            loadFilter:this.LoadFilter.bind(this),
            onLoadError:(data)=>{ this.ShowErrorResponse(data.responseJSON); },
            onLoadSuccess: this.dgGroups_onLoadSuccess.bind(this),
        });
        AddKeyboardNavigationForGrid(this.dgGroups);
        this.btnOk.attr("href", "javascript:void(0)");
        this.btnCancel.attr("href", "javascript:void(0)");
        this.btnUpdate.attr("href", "javascript:void(0)");
        this.btnCancel.linkbutton({
            onClick:()=>{
                this.wGroupFormSel.window("close");
            }});
        this.btnUpdate.linkbutton({
            onClick:this.btnUpdateGroups_onClick.bind(this)
        });
        this.txGroupFilter.textbox({
            onChange: this.txGroupFilter_onChange.bind(this)
        });
        this.btnOk.linkbutton({
            onClick: this.btnOk_onClick.bind(this)
        });
        this.dgGroups.datagrid({url:this.GetUrl("/AdminGroups/GroupsList")});
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
     * Обработка успешного окончания загрузки групп
     * @param data - информаци о загруженных данных
     */
    dgGroups_onLoadSuccess(data) {
        if(data.total>0)
        {
            if(this.GroupId!=-1)
            {
                this.dgGroups.datagrid("selectRecord", this.GroupId);
            }
            else
            {
                if(this.GroupIndex>=0&& this.GroupIndex < data.total)
                {
                    this.dgGroups.datagrid("selectRow", this.GroupIndex);
                }
                else if (data.total>0)
                {
                    this.dgGroups.datagrid("selectRow", data.total-1);
                }
            }
            this.GroupId = -1;
            this.GroupIndex = 0;
        }
    }
    /**
     * Обработка обновления списка групп
     */
    btnUpdateGroups_onClick() {
        let row = this.dgGroups.datagrid("getSelected");
        if(row!=null)
        {
            this.GroupIndex = this.dgGroups.datagrid("getRowIndex", row);
        }
        let filter = this.txGroupFilter.textbox("getText");
        filter = encodeURIComponent(filter);
        this.dgGroups.datagrid({url:this.GetUrl("/AdminGroups/GroupsList?filter="+filter)});
    }
    /**
     * Обработка фильтра по имени и коду группы
     */
    txGroupFilter_onChange() {
        this.btnUpdateGroups_onClick();
    }

    /**
     * Обработка выбора записи
     */
    btnOk_onClick(){
        if(this.dgGroups.datagrid("getRows").length == 0)
        {
            this.ShowWarning("Нет записей для выбора");
            return false;
        }
        let selData = this.dgGroups.datagrid("getSelected");
        if(selData==null)
        {
            this.ShowWarning("Выберите запись");
            return false;
        }
        if(this.OkFunc!=null)
        {
            this.OkFunc(selData.id);
        }
        this.wGroupFormSel.window("close");
        return false;
    }
}