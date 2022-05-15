import {GroupFormSel} from "./Directories/GroupFormSel.js";

export class KterGroupsEditForm{
    constructor() {
        this.GroupId = -1;
        this.KterId = -1;
    }
    /**
     * Получить url-адрес с учетом контекста
     * @param url - url-адрес без учета контекста
     */
    GetUrl(url) {
        return contextPath + url;
    }
    Show(options){
        this.options = options;
        if(this.options.AddMode){
            this.GroupId = this.options.GroupId;
            this.KterId = this.options.KterId;
        }
        LoadForm("#ModalWindows", this.GetUrl("/AdminGroups/KterGroupsEditForm"), this.InitFunc.bind(this));
    }
    /**
     * Задать функцию, которая вызовется при на жатию на кнопку ОК
     * @param OkFunc - функция родительского модуля
     */
    SetOkFunction(OkFunc) {
        this.OkFunc = OkFunc;
    }

    /**
     * Задать функцию, которая вызовется при на жатию на кнопку Отмена
     * @param CancelFunc - функция родительского модуля
     */
    SetCloseWindowFunction(CloseWindowFunc){
        this.CloseWindowFunc = CloseWindowFunc
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
        this.ShowErrorAlert(error);
    }
    /**
     * Показать ошибку в диалоговом окне
     * @param text - текст ошибки
     */
    ShowErrorAlert(text) {
        $.messager.alert('Ошибка',text,'error');
    }
    /**
     * Функция инициализации пользовательского интерфейса
     */
    InitFunc(){
        this.wKterGroupsEdit = $("#wKterGroupsEdit_Module_Admin");
        this.wKterGroupsEdit.window({onClose:()=>{
                if(this.CloseWindowFunc!=null){
                    this.CloseWindowFunc(this.options);
                }
                this.wKterGroupsEdit.window("destroy");
            }});
        this.wKterGroupsEdit.window('window').attr('tabindex',1).focus().bind('keyup', function(e){
            if (e.keyCode == Keys.VK_ESCAPE){
                this.wKterGroupsEdit.window('close');
            }
            if(e.keyCode == Keys.VK_RETURN){
                if(!this.options.AddMode) {
                    if (this.options.editMode) {
                        this.btnOk_onClick();
                    }
                }
                else{
                    this.btnOk_onClick();
                }
            }
        }.bind(this))
        this.pbEditMode = $("#pbEditMode_Module_Admin_KterGroupsEdit");
        this.lAction = $("#lAction_Module_Admin_KterGroupsEdit");
        this.txId = $("#txId_Module_Admin_KterGroupsEdit");
        this.txGroup = $("#txGroup_Module_Admin_KterGroupsEdit");
        this.txKter = $("#txKter_Module_Admin_KterGroupsEdit");
        this.txCreator = $("#txCreator_Module_Admin_KterGroupsEdit");
        this.txCreated = $("#txCreated_Module_Admin_KterGroupsEdit");
        this.txChanger = $("#txChanger_Module_Admin_KterGroupsEdit");
        this.txChanged = $("#txChanged_Module_Admin_KterGroupsEdit");
        this.btnOk = $("#btnOk_Module_Admin_KterGroupsEdit");
        this.btnCancel = $("#btnCancel_Module_Admin_KterGroupsEdit");
        this.btnOk.attr("href", "javascript:void(0)");
        this.btnCancel.attr("href", "javascript:void(0)");
        this.btnOk.linkbutton({
            onClick:this.btnOk_onClick.bind(this)
        });
        this.btnCancel.linkbutton({onClick:()=>{
                this.wKterGroupsEdit.window("close");
            }});
        this.txGroup.textbox({
            onClickButton:this.txGroup_onClickButton.bind(this)
        });
        this.txKter.textbox({
            onClickButton: this.txKter_onClickButton.bind(this)
        });
        if(this.options.AddMode){
            this.pbEditMode.attr("class", "icon-addmode");
            this.wKterGroupsEdit.window({title:"Добавление новой записи"});
            this.lAction.html("Введите данные для новой записи");
            this.LoadGroup();
            this.LoadKter();
        }
        else{
            this.pbEditMode.attr("class", "icon-editmode");
            this.wKterGroupsEdit.window({title:"Редатирование записи"});
            this.lAction.html("Введите данные для редактирования текущей записи");
            if(this.options.editMode){
                this.btnOk.linkbutton({disabled: false});
            }
            else{
                this.btnOk.linkbutton({disabled: true});
            }
            this.LoadKterGroups();
        }
    }

    /**
     * Загрузка привязки территории к группе
     */
    LoadKterGroups(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/AdminGroups/GetKterGroups?id='+this.options.id),
            success: function(data){
                this.GroupId = data.groupId;
                this.KterId = data.kterId;
                this.txId.textbox("setText", data.id);
                this.txCreator.textbox("setText", data.creator);
                this.txCreated.textbox("setText", data.created);
                this.txChanger.textbox("setText", data.changer);
                this.txChanged.textbox("setText", data.changed);
                this.LoadGroup();
                this.LoadKter();
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Загрузка группы
     */
    LoadGroup(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/AdminGroups/GetGroupSel?id='+this.GroupId),
            success: function(data){
                this.txGroup.textbox("setText", data);
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Загрузка территории
     */
    LoadKter(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/AdminKter/GetKterSel?KterId='+this.KterId),
            success: function(data){
                this.txKter.textbox("setText", data);
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }
    /**
     * Обработка сохранения записи
     */
    btnOk_onClick(){
        let Id = this.txId.textbox("getText");

        if(Id.length == 0){
            Id = "-1";
        }
        let json = {id: Id, groupId: this.GroupId, kterId: this.KterId};
        this.ExistKterGroups(json);
        return false;
    }

    /**
     * Проверка существование территории в группе
     * @param json - модель привязки территории к группе
     */
    ExistKterGroups(json){
        $.ajax({
            method:"get",
            url: this.GetUrl('/AdminGroups/ExistsKterInGroup?id=' + json.id.toString()
                +"&groupId=" + json.groupId.toString() + "&kterId=" + json.kterId.toString()),
            success: function(data){
                if(data){
                    this.ShowErrorAlert("Данный пользователь уже существует в данной группе")
                }
                else {
                    this.Save(json);
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }
    /**
     * Продолжение сохранения территории в группе
     * @param object - модель привязки терртории к группе
     */
    Save(object){
        $.ajax({
            method:"POST",
            data: JSON.stringify(object),
            url: this.GetUrl('/AdminGroups/SaveKterGroups'),
            contentType: "application/json; charset=utf-8",
            success: function(data){
                if(this.OkFunc!=null)
                {
                    this.OkFunc(data);
                    this.wKterGroupsEdit.window("close");
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Открыть форму выбора группы
     */
    txGroup_onClickButton(){
        let form = new GroupFormSel()
        form.SetOkFunction(((RecId)=>{ this.GroupId = RecId; this.LoadGroup(); }).bind(this));
        form.Show();
    }
    /**
     * Открыть форму выбора территории
     */
    txKter_onClickButton(){
        StartModalModulGlobal("Kter", {}, ((data)=>{
            this.KterId = data.id;
            this.LoadKter()
        }).bind(this));
    }
}