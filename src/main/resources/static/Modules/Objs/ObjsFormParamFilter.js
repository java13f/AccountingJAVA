import {FormView} from "../Core/FormView.js";

export class ObjsFormParamFilter extends FormView {

    constructor() {
        super();
        this.filter = new LibFilter("objsDGV");
        this.checkLP= [];
        this.checkPP= [];

        this.filterModel= [];
    }

    /**
     * Показать форму фильтра для отображения данных в гриде
     * @param options
     * @constructor
     */
    Show(options){
        this.options = options;
        LoadForm("#ModalWindows", this.GetUrl("/Objs/ObjsFormParamFilter"), this.InitFunc.bind(this));
    }
    /**
     * Инциализация интерфейса пользователя
     * @constructor
     */
    InitFunc() {
        this.InitComponents("wObjsFormParamFilter_Module_Objs", "");
        this.InitCloseEvents(this.wObjsFormParamFilter);

        //Кнопки управления формой
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({onClick:()=>{this.wObjsFormParamFilter.window("close")}});

        // Заполняем списки с реквизитами
        this.LoadListParams();
        this.LoadPeriodParams();

        //Выбор всех данных в checkBoxList
        this.btnSelAllLP.linkbutton({onClick: this.btnSelAllLP_onClick.bind(this)});
        this.btnSelAllPP.linkbutton({onClick: this.btnSelAllPP_onClick.bind(this)});

        //Снятие всех выбранных данных в checkBoxList
        this.btnDelAllLP.linkbutton({onClick: this.btnDelAllLP_onClick.bind(this)});
        this.btnDelAllPP.linkbutton({onClick: this.btnDelAllPP_onClick.bind(this)});
    }

    /**
     * Загружаем в checkBoxlist список дополнительных реквизитов
     * @constructor
     */
    LoadListParams(){
        $.ajax({
            method: "get",
            url: this.GetUrl('/Objs/listListParams'),
            success: function (data) {
                this.lpList.datalist({
                    data: data,
                    valueField: "id",
                    textField: "name",
                    checkbox: true,
                    singleSelect: false,
                    lines: true
                });
                // for (let [key, value] of Object.entries(this.filterParams.filterObj))
                // {
                //     alert ('key: ' + key + " value: " + value);
                // }
                let allRows = this.lpList.datalist('getRows');
                    for(let i = 0; i < allRows.length; ++i){
                        this.filter.LoadFilter(function(){
                            if(this.filter.GetValue('L=='+allRows[i].paramcode, "").length >0){
                                this.lpList.datalist("selectRow",i);
                            }
                        }.bind(this));
                    }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });

    }

    /**
     * Загружаем в checkBoxlist список переодических реквизитов
     * @constructor
     */
    LoadPeriodParams(){
        $.ajax({
            method: "get",
            url: this.GetUrl('/Objs/listPeriodParams'),
            success: function (data) {
                this.ppList.datalist({
                    data: data,
                    valueField: "id",
                    textField: "name",
                    checkbox: true,
                    singleSelect: false,
                    lines: true
                });
                let allRows = this.ppList.datalist('getRows');
                for(let i = 0; i < allRows.length; ++i){
                    this.filter.LoadFilter(function(){
                        if(this.filter.GetValue('P=='+allRows[i].paramcode, "").length >0){
                            this.ppList.datalist("selectRow",i);
                        }
                    }.bind(this));
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Отметить все параметры у дополнительных реквизитов
     */
    btnSelAllLP_onClick(){
        this.lpList.datalist("selectAll");
    }

    /**
     * Снять отментки со всех дополнительных реквизитов
     */
    btnDelAllLP_onClick(){
        this.lpList.datalist("unselectAll");
    }

    /**
     * Отметить все параметры у переодических реквизитов
     */
    btnSelAllPP_onClick(){
        this.ppList.datalist("selectAll");
    }

    /**
     * Снять отментки со всех переодических реквизитов
     */
    btnDelAllPP_onClick(){
        this.ppList.datalist("unselectAll");
    }

    /**
     * Обработка события нажатия кнопки OK
     */
    btnOk_onClick(){
         this.filter = new LibFilter("objsDGV");

        this.filter.DeleteFilter(function () {
            this.checkLP = this.lpList.datalist("getSelections");
            this.checkPP = this.ppList.datalist("getSelections");
            // Сохраянем выбрынные дополнительные реквизиты
            for (let index = 0; index < this.checkLP.length; ++index) {
                let dgv = {}
                dgv.paramcode = 'L=='+this.checkLP[index].paramcode;
                dgv.paramname = this.checkLP[index].name;
                dgv.reffertable = this.checkLP[index].reffertable;
                this.filterModel.push(dgv);
                let val = "";
                if(this.checkLP[index].reffertable.length > 0){
                    val = this.checkLP[index].reffertable + " = " + this.checkLP[index].name;
                }
                else {
                    val = "* = " + this.checkLP[index].name;
                }
                this.filter.SetValue('L==' + this.checkLP[index].paramcode, val);
            }
            for (let index = 0; index < this.checkPP.length; ++index) {
                let dgv = {}
                dgv.paramcode = 'P=='+this.checkPP[index].paramcode;
                dgv.paramname = this.checkPP[index].name;
                dgv.reffertable = this.checkPP[index].reffertable;
                this.filterModel.push(dgv);
                let val = "";
                if(this.checkPP[index].reffertable.length > 0){
                    val = this.checkPP[index].reffertable + " = " + this.checkPP[index].name;
                }
                else {
                    val = "* = " + this.checkPP[index].name;
                }
                this.filter.SetValue('P=='+ this.checkPP[index].paramcode, val);
            }

            this.filter.SaveFilter(function () {
                this.ResultFunc(this.filterModel);
                this.wObjsFormParamFilter.window("close");
            }.bind(this));
        }.bind(this));

    }
}