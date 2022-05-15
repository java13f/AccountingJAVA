import {FormView}        from "../Core/FormView.js";
import {RepParams}       from "../Jasper/RepParams.js";
import {StaticRepParams} from "../Jasper/StaticRepParams.js";

/**
 * Основной класс модуля
 */
class jrObjectList extends FormView {
    constructor(prefix, StartParams) {
        super();//вызов конструктора родителя
        this.name='List';
        this.prefix = prefix; //приставка для идентификаторов
        this.StartParams = StartParams; //параметры в формате JSON
    }

    Start(id){
        this.ModuleId = id;
        LoadForm("#"+this.ModuleId,
                    this.GetUrl("/jrObjectList/jrObjectList?prefix=" + this.prefix),
                    this.InitFunc.bind(this)
        );
    }

    InitFunc(){
        this.InitComponents(this.ModuleId, this.prefix); //Автоматическое получение идентификаторов формы
        this.wjrObjectList = $("#"+this.ModuleId);
        this.cbNum.combobox({disabled: true});
        this.InitCloseEvents(this.wjrObjectList, false);//Инициализация закрытия формы по нажатию на клавиши "ESC"

        this.LoadCmbKter();

        this.initDate(this.dtDateBeg);
        this.cbArea.combobox({onSelect: this.cbArea_onSelect.bind(this)});
        this.cbNum.combobox({onSelect: this.cbNum_onSelect.bind(this)});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this) });
        this.btnCancel.linkbutton({onClick: function(){ this.wjrObjectList.window("close") }.bind(this)});

        if(StaticRepParams.dtDateBeg) this.dtDateBeg.datebox('setText',StaticRepParams.dtDateBeg);
    }

    /**
     * Обработка выбранного казначейства
     * @param record объект с выбранным казначейством
     */
    cbNum_onSelect(record){     this.LocationId = record.id;    }

    /***
     * При выборе в сmbox раойна
     * @param record
     */
    cbArea_onSelect(record){
        if(record.id!=StaticRepParams.kterId) StaticRepParams.dtDateBeg=StaticRepParams.LocationId=StaticRepParams.kterId="";
        this.LoadCmbLoc(record.id);
        this.kterId = record.id;
    }

    LoadCmbKter(){
        $.ajax({
            url: this.GetUrl('/jrObjectList/LoadKter'),
            success: function (data) {
                this.cbArea.combobox({
                    data: data,
                    valueField: 'id',
                    textField: 'name',
                    onLoadSuccess: ()=>{
                        if(StaticRepParams.kterId) this.cbArea.combobox('select', StaticRepParams.kterId);
                    }
                })
            }.bind(this)
        })
    }
    /**
     * Загрузка данных для cmbx районы
     * @constructor
     */
    LoadCmbLoc(id){
        $.ajax({
            url: this.GetUrl('/jrObjectList/LoadLocations?id='+id),
            success: function (data) {
                this.cbNum.combobox({
                    data: data,
                    valueField: 'id',
                    textField: 'name',
                    disabled: false,
                    onLoadSuccess: ()=>{
                        if(StaticRepParams.LocationId) this.cbNum.combobox('select', StaticRepParams.LocationId);
                    }
                })
            }.bind(this)
        })
    }

    btnOk_onClick(){
           if((this.dtDateBeg.datebox("getText")).trim().length==0) return this.ShowToolTip("#div_dtDateBeg_jrL", "Вы не выбрали дату !", {});
           if(this.cbArea.combobox("getText").length==0) return this.ShowToolTip("#"+this.prefix+"divcbArea_Module_jrObjectList", "Вы не выбрали район !", {});
           if(this.cbNum.combobox("getText").length==0) return this.ShowToolTip("#"+this.prefix+"divcbNum_Module_jrObjectList", "Вы не выбрали номер комнаты !", {});

            $.ajax({    url: this.GetUrl('/jrObjectList/LoadUser')  })
                .done(data => {
                    StaticRepParams.dtDateBeg = this.dtDateBeg.textbox("getText");
                    StaticRepParams.LocationId = this.LocationId;
                    StaticRepParams.kterId = this.kterId;

                    let jrParam = new RepParams('jrObjectList',
                        [
                            {name: "date", type: "String", value: StaticRepParams.dtDateBeg},
                            {name: "kterId", type: "int",  value: Number(StaticRepParams.kterId)},
                            {name: "LocationId", type: "int", value: Number(StaticRepParams.LocationId)},
                            {name: "usr", type: "String", value: data}
                        ]);

                    $.ajax({
                        method: "POST",
                        data: JSON.stringify(jrParam),
                        url: this.GetUrl('/Jasper/Report'),
                        contentType: "application/json; charset=utf-8",
                        success: function (data) {
                            if(this.ResultFunc!=null){
                                this.ResultFunc(data);
                                this.wjrObjectList.window("close");
                            }
                        }.bind(this),
                        error: function (data) {
                            this.ShowErrorResponse(data.responseJSON);
                        }.bind(this)
                    });
            })
           return false;
    }
}

/**
 * Вызов модуля в диалоговом окне
 * @param StartParams стартовые параметры
 * @param ResultFunc функция, которая будет вызываться по нажатию на кнопку "ОК"
 * @constructor
 */
export function StartModalModul(StartParams, ResultFunc) {
    let id = "wjrObjectList_Module_jrObjectList_jrObjectList";//идентификатор диалогового окна
    CreateModalWindow(id, "Построение отчета")//функция создания диалогового окна для модуля
    $('#'+id).window('resize',{width: 647, height: 400});
    $('#'+id).window('center');
    let form = new jrObjectList("modal_", StartParams);
    form.SetResultFunc(ResultFunc);
    form.Start(id);
}