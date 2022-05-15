import {FormView} from "../Core/FormView.js"

export class LocationsFilterForm extends FormView {

    constructor() {
        super();
        this.DepId = -1;
        this.KterId = -1;
    }

    Show(options){
        this.options = options;
        LoadForm("#ModalWindows", this.GetUrl("/Locations/LocationsFormFilter"), this.InitFunc.bind(this));
    }

    InitFunc(){
        this.InitComponents("wLocationsFormFilter_Module_Locations", "");
        this.InitCloseEvents(this.wLocationsFormFilter);
        this.btnCancel.linkbutton({onClick:()=>{this.wLocationsFormFilter.window("close")}});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});

        this.txKter.textbox({onClickButton: this.txKter_onClickButton.bind(this)});
        this.txDeps.textbox({onClickButton: this.txDeps_onClickButton.bind(this)});
        this.btnCleanKter.linkbutton({onClick: this.btnCleanKter_onClick.bind(this)});
        this.btnCleanDeps.linkbutton({onClick: this.btnCleanDeps_onClick.bind(this)});
        this.btnCleanFilter.linkbutton({onClick: this.btnCleanFilter_onClick.bind(this)});

        this.cbShowDel.checkbox("uncheck");
        if(this.options.del == 'true') {
            this.cbShowDel.checkbox("check");
        }

        this.DepId = this.options.depid;
        if(this.DepId != -1){
            this.GetValueFilterDeps();
        }

        this.KterId = this.options.kterid;
        if(this.KterId != -1){
            this.GetValueFilterKter();
        }
    }

    btnCleanFilter_onClick(){
        this.KterId = -1;
        this.txKter.textbox("setText", "");

        this.DepId = -1;
        this.txDeps.textbox("setText", "");

        this.cbShowDel.checkbox("uncheck");
    }

    /**
     * Очистка фильтра по территории
     */
    btnCleanKter_onClick(){
        this.KterId = -1;
        this.txKter.textbox("setText", "");
    }

    /**
     * Очистка фильтра по подразделениям
     */
    btnCleanDeps_onClick(){
        this.DepId = -1;
        this.txDeps.textbox("setText", "");
    }

    /**
     * Получить и установить значение фильтра пользователей группы по территории
     * @constructor
     */
    GetValueFilterKter(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/Locations/GetKter?KterId='+this.KterId),
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
            this.GetValueFilterKter()
        }).bind(this));
    }

    /**
     * Получить и установить значение фильтра пользователей группы по территории
     * @constructor
     */
    GetValueFilterDeps(){
        $.ajax({
            method:"get",
            url: this.GetUrl('/Locations/GetDep?DepId=' + this.DepId),
            success: function(data){
                if(data.id == -1){
                    this.DepId = -1;
                    this.txDeps.textbox("setText", "");
                }
                else{
                    this.txDeps.textbox("setText", data.name);
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }
    /**
     * Выбор подразделения
     */
    txDeps_onClickButton(){
        StartModalModulGlobal("Deps", {}, ((data) =>{
            this.DepId = data.id;
            this.GetValueFilterDeps()
        }).bind(this));
    }

    btnOk_onClick(){
        if(this.ResultFunc!=null){
            let del = this.cbShowDel.checkbox("options").checked?"true":"false";
            this.ResultFunc({depid:this.DepId, kterid: this.KterId, del:del});
        }
        this.wLocationsFormFilter.window("close");
    }

}