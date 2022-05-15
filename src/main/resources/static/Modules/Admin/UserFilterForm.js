import {FormView} from "../Core/FormView.js";

export class UserFilterForm extends FormView{
    constructor() {
        super();
        this.KterId = -1;
    }
    Show(options){
        this.options = options;
        LoadForm("#ModalWindows", this.GetUrl("/AdminUsers/UserFilterForm"), this.InitFunc.bind(this));
    }
    InitFunc(){
        this.InitComponents("wUserFilterForm_Module_Admin", "");
        this.InitCloseEvents(this.wUserFilterForm);
        this.btnCancel.linkbutton({onClick:()=>{this.wUserFilterForm.window("close")}});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.txCode.textbox({onClickButton: function(){ this.txCode.textbox("setText", "") }.bind(this)});
        this.txName.textbox({onClickButton: function(){ this.txName.textbox("setText", "") }.bind(this)});
        this.txKter.textbox({onClickButton: this.txKter_onClickButton.bind(this)});
        this.btnClearKterFilter.linkbutton({onClick: this.btnClearKterFilter_onClick.bind(this)});
        this.btnClearFilter.linkbutton({onClick: this.btnClearFilter_onClick.bind(this)});

        this.txCode.textbox("setText", this.options.Code);
        this.txName.textbox("setText", this.options.Name);
        this.KterId = this.options.KterId;
        if(this.KterId!=-1){
            this.GetValueFilterKterUserGroups();
        }
    }

    /**
     * Получить и установить значение фильтра пользователей группы по территории
     * @constructor
     */
    GetValueFilterKterUserGroups(){
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
     * Выбор территории
     */
    txKter_onClickButton(){
        StartModalModulGlobal("Kter", {}, ((data) =>{
            this.KterId = data.id;
            this.GetValueFilterKterUserGroups()
        }).bind(this));
    }

    /**
     * Очистка фильтра по территории
     */
    btnClearKterFilter_onClick(){
        this.KterId = -1;
        this.txKter.textbox("setText", "");
    }

    /**
     * Полная очистка фильтра
     */
    btnClearFilter_onClick(){
        this.txCode.textbox("setText", "");
        this.txName.textbox("setText", "");
        this.txKter.textbox("setText", "");
        this.KterId = -1;
    }
    btnOk_onClick(){
        if(this.ResultFunc!=null){
            let Code = this.txCode.textbox("getText");
            let Name = this.txName.textbox("getText");
            this.ResultFunc({Code:Code, Name: Name, KterId: this.KterId});
        }
        this.wUserFilterForm.window("close");
    }
}