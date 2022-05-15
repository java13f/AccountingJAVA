import {FormView} from "../Core/FormView.js";
import {RepParams} from "../Jasper/RepParams.js";
import {StaticRepParams} from "../Jasper/StaticRepParams.js";

class jrGrCardOC_HMA extends FormView {
    constructor(prefix, StartParams) {
        super();
        this.name = 'List';
        this.prefix = prefix; //приставка для идентификаторов
        this.StartParams = StartParams; //параметры в формате JSON
        this.objId = null;
    }

    Start(id) {
        this.ModuleId = id;
        LoadForm("#" + this.ModuleId,
            this.GetUrl("/jrGrCardOC_HMA/jrGrCardOC_HMA?prefix=" + this.prefix),
            this.InitFunc.bind(this)
        );
    }

    InitFunc() {
        this.InitComponents(this.ModuleId, this.prefix); //Автоматическое получение идентификаторов формы
        this.wjrGrCardOC_HMA = $("#" + this.ModuleId);
        this.InitCloseEvents(this.wjrGrCardOC_HMA, false);//Инициализация закрытия формы по нажатию на клавиши "ESC"

        this.initDate(this.dtDate);//ИНИЦИАЛИЗАЦИЯ DATEBOX текущим днем
        this.btnObjs.linkbutton({onClick: this.btnObjs_OnClick.bind(this)});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({onClick: () => this.wjrGrCardOC_HMA.window("close")});

        if(StaticRepParams.dtDate) this.dtDate.datebox('setText',StaticRepParams.dtDate);
        if(StaticRepParams.objInfo) this.txtBxName.textbox("setText", StaticRepParams.objInfo);
        if(StaticRepParams.objId) this.objId = StaticRepParams.objId;
    }

    /**
     * Получение из модуля Objs, id выбранного объекта
     */
    btnObjs_OnClick() {
        StartModalModulGlobal("Objs", "",
            data => {
                this.objId = data.id;
                this.getObject();
            }
        );
    }

    /**
     * Получить информацию о объекте
     */
    getObject() {
        $.get({url: this.GetUrl('/jrGrCardOC_HMA/getObject?id=' + this.objId)}, function (data) {
            this.txtBxName.textbox("setText", data)
        }.bind(this));
    }

    /**
     * Обработка нажатия OK
     */
    btnOk_onClick() {
        if ((this.dtDate.datebox("getText")).trim().length == 0) return this.ShowToolTip("#hintAreaDtBx", "Вы не выбрали дату !", {});
        if (!this.objId || this.objId.length === 0) return this.ShowToolTip("#hintAreaTxBx", "Вы не выбрали объект !", {});

        $.get({    url: this.GetUrl('/jrGrCardOC_HMA/LoadUser')  })
            .done(  data => {
                        StaticRepParams.dtDate = this.dtDate.datebox("getText");
                        StaticRepParams.objId = this.objId;
                        StaticRepParams.objInfo = this.txtBxName.textbox("getText");

                        let jrParam = new RepParams("jrOC-9",
                                [
                                            {name: "date", type: "String", value: this.dtDate.datebox("getText")},
                                            {name: "id_obj", type: "int", value: this.objId},
                                            {name: "fio", type: "String", value: data}
                                        ]);
                            $.ajax({
                                method: "POST",
                                data: JSON.stringify(jrParam),
                                url: this.GetUrl('/Jasper/Report'),
                                contentType: "application/json; charset=utf-8",
                                success: function (data) {
                                    if(this.ResultFunc!=null){
                                        this.ResultFunc(data);
                                        this.wjrGrCardOC_HMA.window("close");
                                    }
                                }.bind(this),
                                error: function (data) {
                                    this.ShowErrorResponse(data.responseJSON);
                                }.bind(this)
                            });
            });
    }
}

/**
 * Вызов модуля в диалоговом окне
 * @param StartParams стартовые параметры
 * @param ResultFunc функция, которая будет вызываться по нажатию на кнопку "ОК"
 * @constructor
 */
export function StartModalModul(StartParams, ResultFunc) {
    let id = "wjrGrCardOC_HMA_Module_jrGrCardOC_HMA_jrGrCardOC_HMA";//идентификатор диалогового окна
    CreateModalWindow(id, "Построение отчета");//функция создания диалогового окна для модуля
    $('#'+id).window('resize',{width: 647, height: 400}).window('center');
    let form = new jrGrCardOC_HMA("modal_", StartParams);
    form.SetResultFunc(ResultFunc);
    form.Start(id);
}