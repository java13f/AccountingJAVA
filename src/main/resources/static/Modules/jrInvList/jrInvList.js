import {FormView}        from "../Core/FormView.js";
import {RepParams}       from "../Jasper/RepParams.js";
import {StaticRepParams} from "../Jasper/StaticRepParams.js";

/**
 * Основной класс модуля
 */
class jrInvList extends FormView {
    /**
     * Конструктор
     * @param prefix - приставка для идентификаторов. Данная приставка добавится для каждого идентификатора
     * @param StartParams - стартовые параметры в формате JSON
     */
    constructor(prefix, StartParams) {
        super();//Вызов контруктора у родительского класса
        this.name='List';
        this.prefix = prefix; //Приставка для идентификаторов
        this.StartParams = StartParams; //Стартовые параметры в формате JSON

        this.kterId = -1;
        this.depId = -1;
        this.accId = -1;

        this.isChangedKter = false; // сброс значения комбобокса департамента, если изменили территорию.
    }

    /**
     * Функция загрузки формы
     * @param id - идентификатор эелемента HTML, в который будет загружена разметка частичного представления
     * @constructor
     */
    Start(id) {
        this.ModuleId = id;
        //Загружаем макет формы и выполняем  функци InitFunc в случае успеха
        LoadForm("#"+this.ModuleId, this.GetUrl("/jrInvList/jrInvList?prefix=" + this.prefix), this.InitFunc.bind(this));
    }

    /**
     * Функция инициализации пользовательского интерфейса
     * @constructor
     */
    InitFunc() {
        this.InitComponents(this.ModuleId, this.prefix); //Автоматическое получение идентификаторов формы
        this.wjrInvList = $("#"+this.ModuleId);
        this.InitCloseEvents(this.wjrInvList, false);//Инициализация закрытия формы по нажатию на клавиши "ESC"

        this.btnCancel.linkbutton({onClick: function(){ this.wjrInvList.window("close") }.bind(this)});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this) });

        this.btnKterId.linkbutton({onClick: this.btnKterId_onClick.bind(this) });
        this.cbDepId.combobox({onSelect: this.cbDepId_onSelect.bind(this)});
        this.cbAccCodeId.combobox({onSelect: this.cbAccCodeId_onSelect.bind(this)});
        this.cbIsGroup.checkbox({onChange: this.cbIsGroup_onClick.bind(this)});

        this.initDate(this.dtDate);

        $.ajax({
            method:"get",
            url: this.GetUrl('/jrInvList/getAccCode'),
            success: function(data){
                this.cbAccCodeId.combobox({ valueField: 'id', textField: 'name',  data: data   });
                this.cbAccCodeId.textbox('setText', StaticRepParams.accName);

                this.txKterId.textbox('setText', StaticRepParams.kterName);
                this.cbDepId.textbox('setText',StaticRepParams.depName);

                if (StaticRepParams.isGroup) {
                    this.cbIsGroup.checkbox("check");
                } else {
                    this.cbIsGroup.checkbox("uncheck");
                }

                if (StaticRepParams.kterId)
                    this.loadDeps();

                if(StaticRepParams.date)
                    this.dtDate.datebox('setText',StaticRepParams.date);

                this.accId = StaticRepParams.accId;
                this.depId = StaticRepParams.depId;
                this.kterId = StaticRepParams.kterId;
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });

        if (this.kterId != -1) {
            this.loadDeps();
        }
    }

    /**
     * Нажали на кнопку выбора территории
     */
    btnKterId_onClick() {
        try {
            StartModalModulGlobal("Kter", "",
                (async (data) => {
                    this.isChangedKter = StaticRepParams.kterId == data.id ? false : true;
                    StaticRepParams.kterId = data.id
                    this.kterId = StaticRepParams.kterId;
                    this.getKter();
                }).bind(this));
        } catch (e) {
            this.ShowError(e);
        }
    }
    cbIsGroup_onClick() {}
    /**
     * Загрузка территорий
     */
    getKter() {
            $.ajax({    // Загрузка списка территорий
                method: "get",
                url: this.GetUrl('/jrInvList/getKter?id=' + this.kterId),
                success: function (data) {
                    this.txKterId.textbox("setText", data);

                    this.loadDeps();
                }.bind(this),
                error: function (data) {
                    reject(data);
                }.bind(this)
            });
       // });
    }

    /**
     * Загрузка подразделений
     */
    loadDeps() {
        $.ajax({
            method:"get",
            url: this.GetUrl('/jrInvList/getDep?kterId=' + StaticRepParams.kterId),
            success: function(data){
                this.cbDepId.combobox({ valueField: 'id', textField: 'name',  data: data   });
                this.cbDepId.textbox('setText', !this.isChangedKter ? StaticRepParams.depName : "");

                this.depId = StaticRepParams.depId;
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Обработка выбранного счета
     * @param record объект с выбранным счетом
     */
    cbAccCodeId_onSelect(record){
        this.accId = record.id;
    }

    /**
     * Обработка выбранного подразделения
     * @param record объект с выбранным подразделением
     */
    cbDepId_onSelect(record) {
        this.depId = record.id;
    }

    /**
     * Обработка нажатия Ok
     */
    btnOk_onClick(){
        if(this.txKterId.textbox("getText").length==0){
            this.ShowToolTip("#"+this.prefix+"divTxKterId_Module_jrInvList","Выберите пожалуйста территорию.",{});
            return;
        }

        if(this.cbDepId.combobox("getText").length==0) {
            this.ShowToolTip("#"+this.prefix+"divCbDepId_Module_jrInvList","Выберите пожалуйста подразделение.",{});
            return;
        }

        if(this.cbAccCodeId.combobox("getText").length==0) {
            this.ShowToolTip("#"+this.prefix+"divCbAccCodeId_Module_jrInvList","Выберите пожалуйста счет.",{});
            return;
        }

        StaticRepParams.kterName = this.kterId;
        StaticRepParams.kterName = this.txKterId.combobox("getText");

        StaticRepParams.accId = this.accId;
        StaticRepParams.accName = this.cbAccCodeId.combobox("getText");

        StaticRepParams.depId = this.depId;
        StaticRepParams.depName = this.cbDepId.textbox("getText");

        StaticRepParams.isGroup = this.cbIsGroup.checkbox("options").checked ? true : false;

        StaticRepParams.date = this.dtDate.datebox("getText");

        let isGroupRep = this.cbIsGroup.checkbox("options").checked ? "jrInvListGr" : "jrInvList";

        // Создание списка параметров
        let jrParam=new RepParams(isGroupRep,
            [   {name:"kterId",   type:"int",    value:this.kterId},
                {name:"depId",   type:"int",    value:this.depId},
                {name:"date",   type:"String",    value: this.dtDate.datebox("getText")},
                {name:"accId",   type:"int",    value:this.accId}
            ]);
        $.ajax({
            method:"POST",
            data: JSON.stringify(jrParam),
            url: this.GetUrl('/Jasper/Report'),
            contentType: "application/json; charset=utf-8",
            success: function(data){
                if(this.ResultFunc!=null) {
                    this.ResultFunc(data);
                    this.wjrInvList.window("close");
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
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
    let id = "wjrInvList_Module_jrInvList_jrInvList";//идентификатор диалогового окна
    CreateModalWindow(id, "Построение отчета")//функция создания диалогового окна для модуля
    $('#'+id).window('resize',{width: 647, height: 400});
    $('#'+id).window('center');
    let form = new jrInvList("modal_", StartParams);
    form.SetResultFunc(ResultFunc);
    form.Start(id);
}