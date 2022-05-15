import {FormView}        from "../Core/FormView.js";

/**
 * Основной класс модуля
 */
class Jasper extends FormView {
    /**
     * Конструктор
     * @param prefix - приставка для идентификаторов. Данная приставка добавится для каждого идентификатора
     * @param StartParams - стартовые параметры в формате JSON
     */
    constructor(prefix, StartParams) {
        super();//Вызов контруктора у родительского класса
        this.allowReport="Нет прав для выполнения отчета";
        this.prefix = prefix; //Приставка для идентификаторов
        this.StartParams = StartParams; //Стартовые параметры в формате JSON
        this.pdfFilePostfix="";
        this.ModuleName = StartParams;
        this.reportName="";
    }

    /**
     * Функция загрузки формы
     * @param id - идентификатор эелемента HTML, в который будет загружена разметка частичного представления
     * @constructor
     */
    Start(id){
        this.ModuleId = id;
        //Загружаем макет формы и выполняем  функци InitFunc в случае успеха
        LoadForm("#"+this.ModuleId, this.GetUrl("/Jasper/Jasper?prefix=" + this.prefix), this.InitFunc.bind(this));
    }

    /**
     * Функция инициализации пользовательского интерфейса
     * @constructor
     */
    InitFunc(){
        this.InitComponents(this.ModuleId, this.prefix);                         //Автоматическое получение идентификаторов формы
        this.btnUpdate.linkbutton({onClick: this.btnUpdate_onClick.bind(this)}); //зададим функцию обработки события кнопки onClick
        this.btnPrint.linkbutton({onClick: this.btnPrint_onClick.bind(this)});   //зададим функцию обработки события кнопки onClick
        this.btnWord.linkbutton({onClick: this.btnWord_onClick.bind(this)});   //зададим функцию обработки события кнопки onClick
        this.btnExcel.linkbutton({onClick: this.btnExcel_onClick.bind(this)});   //зададим функцию обработки события кнопки onClick


        // $("#nested_mm_Module_JasperView").menu({onClick: function(item) {
        //         if(item.text=="Word")                this.btnWord_onClick.bind(this);
        //         if(item.text=="Excel")               this.btnExcel_onClick.bind(this);
        //     }
        //     })

        // $('#mm').menu({ onClick:function(item){
        //         if(item.text=="Word")  btnWord_onClick().bind(this);
        //         else                   this.btnExcel_onClick();
        //     }
        // });


        this.btnUpdate_onClick();                                                //вызовем окно запроса параметров
    }




    /**
     * Обновление отчета
     */
    btnUpdate_onClick() {
        this.allowReport = "Нет прав для выполнения отчета";
        $(this.divArea).html('<table width="100%" height="100%"><tr><td style="text-align:center"><img src="css/themes/default/images/loading.gif"></td></tr></table>');

        StartModalModulGlobal(this.ModuleName, {},
            ((data) => {
                this.reportName=(data.substr(0,4)=="<!--"? data.substr(4,data.indexOf("-->")-4)  :"");
                this.StartParams=(this.reportName==""?this.StartParams:this.reportName)
                $(this.divArea).html(data);

                if (this.pdfFilePostfix.length > 0) {             // удаляем старый pdf файл (если он есть)
                    $.ajax({
                        method: "POST",
                        data: JSON.stringify({postFix:this.StartParams+this.pdfFilePostfix}),
                        url: this.GetUrl('/Jasper/deletePDF'),
                        contentType: "application/json; charset=utf-8",
                        success: function (data) {
                            let rnd=parseInt(Math.random() * 100000).toString();
                            rnd="0".repeat(5-rnd.length)+rnd;
                            this.pdfFilePostfix = rnd; // Имя для pdf файл (если потребуется)
                        }.bind(this),
                        error: function (data) {
                            this.ShowErrorResponse(data.responseJSON);
                        }.bind(this)
                    });
                }
                else {
                    let rnd=parseInt(Math.random() * 100000).toString();
                    rnd="0".repeat(5-rnd.length)+rnd;
                    this.pdfFilePostfix = rnd; // Имя для pdf файл (если потребуется)
                }
            })
        );
    }

    /**
     * Формирование pdf файла и его отбражение для печати
     */
    btnPrint_onClick(){
    $.ajax({
        method:"POST",
        data: JSON.stringify({jrxml:this.StartParams, postFix:this.pdfFilePostfix}),
        url: this.GetUrl('/Jasper/createPDF'),
        contentType: "application/json; charset=utf-8",
        success: function(data){
            // Путь к pdf файлу на сервере
            let filePath=window.location.href.substr(0,window.location.href.length-window.location.pathname.length);
            if(!(filePath.substr(filePath.length-1,1)=="\\" || filePath.substr(filePath.length-1,1)=="/")) filePath+="/";
            $.ajax({
                url: filePath+data,
                success:function(){
                    window.open(filePath+data, 'PRINT').focus();
                },
                error:function(){
                    window.open(filePath+"Accounting/pdf/no_report.pdf", 'PRINT').focus();
                }
            });
        }.bind(this),
        error: function(data){
            this.ShowErrorResponse(data.responseJSON);
        }.bind(this)
    });
    }

    /**
     * Конвертация в word
     */
    btnWord_onClick(){
        $.ajax({
            method:"POST",
            data: JSON.stringify({jrxml:this.StartParams, postFix:this.pdfFilePostfix}),
            url: this.GetUrl('/Jasper/createWord'),
            contentType: "application/json; charset=utf-8",
            success: function(data){
                // Путь к excel файлу на сервере
                let filePath=window.location.href.substr(0,window.location.href.length-window.location.pathname.length);
                if(!(filePath.substr(filePath.length-1,1)=="\\" || filePath.substr(filePath.length-1,1)=="/")) filePath+="/";

                var link = document.createElement('a');
                link.setAttribute('href',filePath+data);
                link.setAttribute('download',this.StartParams+'.docx');
                link.click();
                link.remove();


            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });

    }

    /**
     * Конвертация в excel
     */
    btnExcel_onClick(){
        $.ajax({
            method:"POST",
            data: JSON.stringify({jrxml:this.StartParams, postFix:this.pdfFilePostfix}),
            url: this.GetUrl('/Jasper/createExcel'),
            contentType: "application/json; charset=utf-8",
            success: function(data){
                // Путь к excel файлу на сервере
                let filePath=window.location.href.substr(0,window.location.href.length-window.location.pathname.length);
                if(!(filePath.substr(filePath.length-1,1)=="\\" || filePath.substr(filePath.length-1,1)=="/")) filePath+="/";

                var link = document.createElement('a');
                link.setAttribute('href',filePath+data);
                link.setAttribute('download',this.StartParams+'.xls');
                link.click();
                link.remove();


            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });

    }

}

/**
 * Функция встраиваемого запуска модуля
 * @param Id идентификатор
 * @constructor
 */
export function StartNestedModul(Id, Param) {
    let form = new Jasper("nested_", Param);
    form.Start(Id);
}

/**
 * Вызов модуля в диалоговом окне
 * @param StartParams стартовые параметры
 * @param ResultFunc функция, которая будет вызываться по нажатию на кнопку "ОК"
 * @constructor
 */
export function StartModalModul(StartParams, ResultFunc) {
    let id = "wJasper_Module_Jasper";//идентификатор диалогового окна
    CreateModalWindow(id, "Справочник кодов территорий")//функция создания диалогового окна для модуля
    let form = new Jasper("modal_", StartParams);
    form.SetResultFunc(ResultFunc);
    form.Start(id);
}