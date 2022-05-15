import {UserFilterForm} from "../UserFilterForm.js";

export class UserFormSel{
    constructor() {
        this.UserIndex = 0;
        this.UserId = -1;
        this.FilterLogin = "";
        this.FilterUserName = "";
        this.FilterKterUsersId = -1;
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
     * Показать форму выбора полбзователей
     */
    Show(){
        LoadForm("#ModalWindows", this.GetUrl("/AdminGroups/UserFormSel"), this.InitFunc.bind(this));
    }
    /**
     * Функция инициализации пользовательского интерфейса
     */
    InitFunc(){
        this.wUserFormSel = $("#wUserFormSel_Module_Admin");
        this.dgUsers = $("#dgUsers_Module_Admin_UserFormSel");
        this.btnOk = $("#btnOk_Module_Admin_UserFormSel");
        this.btnCancel = $("#btnCancel_Module_Admin_UserFormSel");
        this.btnUpdate = $("#btnUpdate_Module_Admin_UserFormSel");
        this.btnShowFilter = $("#btnShowFilter_Module_Admin_UserFormSel");
        this.wUserFormSel.window({onClose:()=>{
                this.wUserFormSel.window("destroy");
            }});
        this.wUserFormSel.window('window').attr('tabindex',1).focus().bind('keyup', function(e){
            if (e.keyCode == Keys.VK_ESCAPE){
                this.wUserFormSel.window('close');
            }
        }.bind(this))
        this.dgUsers.datagrid({
            loadFilter:this.LoadFilter.bind(this),
            onLoadError:(data)=>{ this.ShowErrorResponse(data.responseJSON); },
            onLoadSuccess: this.dgUsers_onLoadSuccess.bind(this),
        });
        AddKeyboardNavigationForGrid(this.dgUsers);
        this.btnOk.attr("href", "javascript:void(0)");
        this.btnCancel.attr("href", "javascript:void(0)");
        this.btnUpdate.attr("href", "javascript:void(0)");
        this.btnShowFilter.attr("href", "javascript:void(0)");
        this.btnCancel.linkbutton({
            onClick:()=>{
                this.wUserFormSel.window("close");
            }});
        this.btnUpdate.linkbutton({
            onClick:this.btnUpdateUsers_onClick.bind(this)
        });
        this.btnOk.linkbutton({
            onClick: this.btnOk_onClick.bind(this)
        });
        this.btnShowFilter.linkbutton({
            onClick: this.btnShowFilter_onClick.bind(this)
        });
        this.dgUsers.datagrid({url:this.GetUrl("/AdminUsers/List")});
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
     * Обработка успешного окончания загрузки пользхователей
     * @param data - информаци о загруженных данных
     */
    dgUsers_onLoadSuccess(data) {
        if(data.total>0)
        {
            if(this.UserId!=-1)
            {
                this.dgUsers.datagrid("selectRecord", this.UserId);
            }
            else
            {
                if(this.UserIndex>=0&& this.UserIndex < data.total)
                {
                    this.dgUsers.datagrid("selectRow", this.UserIndex);
                }
                else if (data.total>0)
                {
                    this.dgUsers.datagrid("selectRow", data.total-1);
                }
            }
            this.UserId = -1;
            this.UserIndex = 0;
        }
    }
    /**
     * Обработка обновления списка пользователей
     */
    btnUpdateUsers_onClick() {
        let row = this.dgUsers.datagrid("getSelected");
        if(row!=null)
        {
            this.UserIndex = this.dgUsers.datagrid("getRowIndex", row);
        }
        let code = encodeURIComponent(this.FilterLogin);
        let name = encodeURIComponent(this.FilterUserName);
        let kterId = this.FilterKterUsersId
        this.dgUsers.datagrid({url:this.GetUrl("/AdminUsers/List?"
                +"code=" + code
                +"&name=" + name
                +"&kterId="+kterId.toString())});
    }

    /**
     * Обработка выбора записи
     */
    btnOk_onClick(){
        if(this.dgUsers.datagrid("getRows").length == 0)
        {
            this.ShowWarning("Нет записей для выбора");
            return false;
        }
        let selData = this.dgUsers.datagrid("getSelected");
        if(selData==null)
        {
            this.ShowWarning("Выберите запись");
            return false;
        }
        if(this.OkFunc!=null)
        {
            this.OkFunc(selData.id);
        }
        this.wUserFormSel.window("close");
        return false;
    }

    /**
     * Показать настройки фильтра по пользователям
     */
    btnShowFilter_onClick(){
        let form = new UserFilterForm();
        form.SetResultFunc(function(data){
            this.FilterLogin = data.Code;
            this.FilterUserName = data.Name;
            this.FilterKterUsersId = data.KterId;
            this.btnUpdateUsers_onClick();
        }.bind(this));
        form.Show({AddMode: true, Code: this.FilterLogin, Name: this.FilterUserName, KterId: this.FilterKterUsersId});
    }
}