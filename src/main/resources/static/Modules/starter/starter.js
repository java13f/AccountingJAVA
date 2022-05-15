import {FormView} from "../Core/FormView.js";

/**
 * Функция запуска модуля на вкладке
 * @param Id
 * @constructor
 */
export function StartNestedModul(Id) {
    let modul = new starter("nested_", "");    // Создается экземпляр главного класса
    modul.Start(Id);                                          // Вызывается метод Start главного класса
}

/**
 * Функция запуска модуля модально
 * @param StartParams
 * @param ResultFunc
 * @constructor
 */
export function StartModalModul(StartParams, ResultFunc) {
    let id = "wstarter_Module_starter";                     //идентификатор диалогового окна
    CreateModalWindow(id, "Название модального окна") //функция создания диалогового окна для модуля
    let form = new starter("modal_", StartParams);
    form.SetResultFunc(ResultFunc);
    form.Start(id);
}


/**
 * Класс формы
 */
class starter extends FormView {
    constructor(prefix, StartParams) {
        super();
        this.prefix = prefix;      // префикс идентификатора
        this.filter = new LibFilter("starter");
    }

    /**
     *
     * @param Id
     * @constructor
     */
    Start(Id){
        this.ModulId=Id;         // Запоминаем Id модуля (MainApp_TaskTab_Problems)
        LoadForm("#"+Id, this.GetUrl("/starter/starterHtml?prefix=" + this.prefix),
            this.InitFunc.bind(this));
    }

    /**
     * Инициализация элементов окна
     * @constructor
     */
    InitFunc() {
        this.InitComponents(this.ModulId, this.prefix);// Инициал.компонентов, имеющих Id
        if(this.ModulId=="wstarter_Module_starter") {
            this.wstarter.window('window').attr('tabindex', 1);
            this.InitCloseEvents(this.wstarter);
        }//Инициализация закрытия формы по нажатию на клавиши "ESC" и "Enter"

        this.btnRun.linkbutton({onClick: this.btnRun_onClick.bind(this)});//зададим функцию обработки события кнопки onClick
        this.btnGo.linkbutton({onClick: this.btnGo_onClick.bind(this)});//зададим функцию обработки события кнопки onClick
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});//зададим функцию обработки события кнопки onClick
        this.btnCancel.linkbutton({onClick: this.btnCancel_onClick.bind(this)});//зададим функцию обработки события кнопки onClick
        if (this.prefix == "modal_") {
            this.pOkCancel.css("visibility", "visible");
            this.InitCloseEvents(this.wstarter, false);//Инициализация закрытия формы по нажатию на клавиши "ESC"
        }
        this.filter.LoadFilter(function(){
            this.txRun.textbox("setText", this.filter.GetValue("CodeJs", ""));
            this.txStartParams.textbox("setText", this.filter.GetValue("StartParams", "{}"));
        }.bind(this));
    }

    /**
     * Вызов модуля модально
     */
    btnRun_onClick(){
        try {
        let modulName=this.txRun.textbox("getText");
        if(modulName.length==0) {
            this.ShowError("Заполните пожалуйста поле 'Имя модуля'");
            return;
        }
        let json_str = this.txStartParams.textbox("getText");
        let json_obj = JSON.parse(json_str);
        this.filter.SetValue("CodeJs", modulName);
        this.filter.SetValue("StartParams", json_str);
        this.filter.SaveFilter();
        StartModalModulGlobal(modulName,
            json_obj,
            ((data)=>{alert(data.id);}).bind(this));
        // let windName="w"+modulName+"_Modul_"+modulName;
        // let wind=$("#"+windName);
        // alert(wind);
        }
        catch(err){
            this.ShowError(err);
        }
    }

    /**
     * Вызов модуля в окне
     */
    btnGo_onClick(){
        if(this.modulName!=undefined){
            $("#"+this.prefix+"Put").html("");
            this.modulName=undefined;
            return;
        }

        this.modulName=this.txRun.textbox("getText");
        if(this.modulName.length==0) {
            this.ShowError("Заполните пожалуйста поле 'Имя модуля'");
            return;
        }
        this.filter.SetValue("CodeJs", this.modulName);
        this.filter.SaveFilter();
        StartNestedModulGlobal(this.prefix+"Put", this.modulName);  // id("nested_Put") - идентификатор элемента родителя  AppCode(this.modulName) - имя модуля
    }

    /**
     * Кнопка Ок
     */
    btnOk_onClick(){
        if(this.ResultFunc!=null) {
            this.ResultFunc({id:"Возврат ид. записи"});
            this.wstarter.window("close");
        }
    }

    /**
     * Кнопка Cansel
     */
    btnCancel_onClick(){
            this.wstarter.window("close");
    }


}


