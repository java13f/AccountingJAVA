import {FormView} from "../Core/FormView.js";
import {AppFormSel} from "./Directories/AppFormSel.js";

export class ActFilterForm extends FormView{
    constructor() {
        super();
        this.AppId = -1;
    }
    Show(options){
        this.options = options;
        LoadForm("#ModalWindows", this.GetUrl("/AdminActs/ActFilterForm"), this.InitFunc.bind(this));
    }
    InitFunc(){
        this.InitComponents("wActFilterForm_Module_Admin", "");
        this.InitCloseEvents(this.wActFilterForm);
        this.btnCancel.linkbutton({onClick:()=>{this.wActFilterForm.window("close")}});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.txCode.textbox({onClickButton: function(){ this.txCode.textbox("setText", "") }.bind(this)});
        this.txApp.textbox({onClickButton: this.txApp_onClickButton.bind(this)});
        this.btnClearAppFilter.linkbutton({onClick: this.btnClearAppFilter_onClick.bind(this)});
        this.txName.textbox({onClickButton: function(){ this.txName.textbox("setText", "") }.bind(this)});
        this.btnClearFilter.linkbutton({onClick: this.btnClearFilter_onClick.bind(this)});

        this.txCode.textbox("setText", this.options.Code);
        this.txName.textbox("setText", this.options.Name);
        this.AppId = this.options.AppId;
        if(this.AppId!=-1){
            this.GetValueFilterApp();
        }
    }

    /**
     * Получить и установить значение фильтра действий по приложению
     * @constructor
     */
    GetValueFilterApp(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/AdminApps/GetAppSel?id='+this.AppId),
            success: function(data){
                this.txApp.textbox("setText", data);
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }
    /**
     * Выбор приложения
     */
    txApp_onClickButton(){
        let form = new AppFormSel()
        form.SetOkFunction(((RecId)=>{ this.AppId = RecId; this.GetValueFilterApp(); }).bind(this));
        form.Show();
    }

    /**
     * Очистка фильтра по приложению
     */
    btnClearAppFilter_onClick(){
        this.AppId = -1;
        this.txApp.textbox("setText", "");
    }

    /**
     * Полная очистка фильтра
     */
    btnClearFilter_onClick(){
        this.txCode.textbox("setText", "");
        this.txApp.textbox("setText", "");
        this.txName.textbox("setText", "");
        this.AppId = -1;
    }
    btnOk_onClick(){
        if(this.ResultFunc!=null){
            let Code = this.txCode.textbox("getText");
            let Name = this.txName.textbox("getText");
            this.ResultFunc({Code:Code, Name: Name, AppId: this.AppId});
        }
        this.wActFilterForm.window("close");
    }
}