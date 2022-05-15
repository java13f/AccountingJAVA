import {FormView} from "../Core/FormView.js";
import {StaticRepParams} from "../Jasper/StaticRepParams.js";
import {RepParams} from "../Jasper/RepParams.js";

class jrOSX extends FormView{
    constructor(prefix, StartParams) {
        super();
        this.name='List';
        this.accsid = -1;
        this.kterid = -1;
        this.checkLP= [];
        this.prefix = prefix;
        this.StartParams = StartParams;
        this.dgv = "";
        this.userId = -1;
    }
    Start(id){
        this.ModuleId = id;
        LoadForm("#"+this.ModuleId, this.GetUrl("/jrOSX/jrOSXList?prefix=" + this.prefix), this.InitFunc.bind(this)
        );
    }

    InitFunc(){
       this.InitComponents("wjrOSX_Module_jrOSX" ,"");
       this.wjrOSX = $("#"+this.ModuleId);
       this.InitCloseEvents(this.wjrOSX, false);
       this.btnKter.linkbutton({onClick: this.btn_Open_Kter_onClick.bind(this)});
       this.btnOk.linkbutton({onClick: ()=> { this.btnOkClock()}});
       this.btnCancel.linkbutton({onClick:()=>{this.wjrOSX.window("close")}});
       this.txDateBuy.datebox({formatter: this.formatter.bind(this), parser: this.parser.bind(this)});
       this.txDateEx.datebox({formatter: this.formatter.bind(this), parser: this.parser.bind(this)});
       this.jrAccsList();
       if ( StaticRepParams.kter_name)this.txKter.textbox('setText',StaticRepParams.kter_name);
        if ( StaticRepParams.kter_id)this.kterid = StaticRepParams.kter_id;  // Восстанавливаем ранее введенные параметры
      // if (StaticRepParams.acc)this.dgv = StaticRepParams.acc;
        this.initDate(this.txDateBuy);
        this.initDate(this.txDateEx);
        if (StaticRepParams.dateBuy)this.txDateBuy.datebox('setText', StaticRepParams.dateBuy);
        if (StaticRepParams.dateBuy)this.txDateEx.datebox('setText', StaticRepParams.dateEx);
        if (StaticRepParams.check_group)this.chGroup.checkbox('check', StaticRepParams.check_group);
        // this.txDateEx.datebox('setText', StaticRepParams.dateEx);
        if (StaticRepParams.checkLP)this.checkLP = StaticRepParams.checkLP;
        //if (StaticRepParams.check_group)

    }
    /**
     * Загрузка списка счетов
     * @constructor
     */
    jrAccsList(){
        $.ajax({
            method: "get",
            url: this.GetUrl('/jrOSX/ListAccs'),
            success: function (data) {

                    this.lpList.datalist({
                        data: data,
                        valueField: "id",
                        textField: "name",
                        checkbox: true,
                        singleSelect: false,
                        lines: true
                    });

    let allRows = this.lpList.datalist('getRows');

                for(let i = 0; i < allRows.length; ++i ){
                let mas = StaticRepParams.checkLP;
                                for (let b = 0; b < mas.length; ++b){

                                    if (allRows[i].id ===mas[b].id){
                                        this.lpList.datalist("selectRow",i);
                                }
                            }

                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }
    /**
     * Открытие территорий
     * @constructor
     */
    btn_Open_Kter_onClick(){
        StartModalModulGlobal("Kter", {}, ((data) =>{

            this.kterid = data.id;
            this.GetKter();
        }).bind(this));
    }



    /**
     * Получение территории
     * @constructor
     */
    GetKter() {
        $.ajax({
            method: "get",
            url: this.GetUrl('/jrOSX/GetKter?Id=' + this.kterid),
            success: function (data) {
                StaticRepParams.kter_name = data;
                this.txKter.textbox("setText", data);
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }
    /**
     * Формирование даты
     * @param date
     * @returns {string}
     */
    formatter(date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        return (d < 10 ? ('0' + d) : d) + '.'
            + (m < 10 ? ('0' + m) : m) + '.'
            + y.toString();
    };

    /**
     * Привод даты в необходимый вид
     * @param s
     * @returns {Date}
     */
    parser(s) {
        if (!s) return new Date();
        var ss = (s.split('.'));
        var y = parseInt(ss[2], 10);
        var m = parseInt(ss[1], 10);
        var d = parseInt(ss[0], 10);
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
            return new Date(y, m - 1, d);
        } else {
            return new Date();
        }
    };




    /**
     * нажатие на кнопку ОК
     */
    btnOkClock(){
            this.checkLP = this.lpList.datalist("getSelections");

    let date_b = this.txDateBuy.datebox("getText");
    let date_e = this.txDateEx.datebox("getText");
    let check_group = this.chGroup.checkbox("options").checked ? true : false;


    for (let index = 0; index < this.checkLP.length; ++index) {
        if(this.dgv.length > 0) this.dgv += ", ";

        this.dgv += this.checkLP[index].id;
    }

    if(this.kterid===-1){
        this.ShowToolTip("#divKter_Module_jrOSX","Выберите пожалуйста территорию.",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
        //this.ShowError("Выберите пожалуйста территорию.");
        return;
    }

    if(date_b === ""){
            this.ShowToolTip("#divtbDateBuy_Module_jrOSX","Выберите пожалуйста дату начала.",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            //this.ShowError("Выберите пожалуйста дату начала.");
            return;
        }
        if(date_b.length > 10){
            this.ShowToolTip("#divtbDateBuy_Module_jrOSX","Выберите пожалуйста дату начала.",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            //this.ShowError("Выберите пожалуйста дату начала.");
            return;
        }

    if(date_e === ""){
        this.ShowToolTip("#divtbDateEx_Module_jrOSX","Выберите пожалуйста дату окончания.",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
        //this.ShowError("Выберите пожалуйста дату окончания.");
        return;
    }
        if(date_e.length > 10){
            this.ShowToolTip("#divtbDateEx_Module_jrOSX","Выберите пожалуйста дату окончания.",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
            //this.ShowError("Выберите пожалуйста дату окончания.");
            return;
        }
    if(this.dgv===""){
        this.ShowToolTip("#rjrOSX_Module_jrOSX","Выберите пожалуйста счет.",{icon:'icon-no', title:'Ошибка', position:'bottom', delay:5000});
        return;
    }
    StaticRepParams.acc=this.dgv;
    StaticRepParams.kter_id=this.kterid;
    StaticRepParams.dateBuy=date_b;
    StaticRepParams.dateEx=date_e;
    StaticRepParams.checkLP = this.checkLP;
    StaticRepParams.check_group = check_group;



if (check_group){
    let jrParam= new RepParams("jrOSX_group",
        [{name:"accs_ids", type:"String", value: this.dgv},
            {name:"kter_id", type:"int", value: this.kterid},
            {name:"date_buy",   type:"String",    value: this.txDateBuy.datebox("getText")},
            {name:"date_exp",   type:"String",    value: this.txDateEx.datebox("getText")}

        ]);

    $.ajax({
        method:"POST",
        data: JSON.stringify(jrParam),
        url: this.GetUrl('/Jasper/Report'),
        contentType: "application/json; charset=utf-8",
        success: function(data){
            if(this.ResultFunc!=null) {
                this.ResultFunc(data);
                this.wjrOSX.window("close");
            }
        }.bind(this),
        error: function(data){
            this.ShowErrorResponse(data.responseJSON);
        }.bind(this)
    });
}
else{
    let jrParam=new RepParams("jrOSX",
        [{name:"accs_ids", type:"String", value: this.dgv},
            {name:"kter_id", type:"int", value: this.kterid},
            {name:"date_buy",   type:"String",    value: this.txDateBuy.datebox("getText")},
            {name:"date_exp",   type:"String",    value: this.txDateEx.datebox("getText")},

        ]);

    $.ajax({
        method:"POST",
        data: JSON.stringify(jrParam),
        url: this.GetUrl('/Jasper/Report'),
        contentType: "application/json; charset=utf-8",
        success: function(data){
            if(this.ResultFunc!=null) {
                this.ResultFunc(data);
                this.wjrOSX.window("close");
            }
        }.bind(this),
        error: function(data){
            this.ShowErrorResponse(data.responseJSON);
        }.bind(this)
    });
}

}


}
export function StartModalModul(StartParams, ResultFunc) {
    let id = "wjrOSX_Module_jrOSX";//идентификатор диалогового окна
        let form = new jrOSX("modal_", StartParams);
        CreateModalWindow(id, "Построение отчета");//функция создания диалогового окна для модуля
        $('#'+id).window('resize',{width: 740, height: 390});
        $('#'+id).window('center');
    form.SetResultFunc(ResultFunc);
    form.Start(id);
}
