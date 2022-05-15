import {FormView} from "../Core/FormView.js";

/**
 * Код Base64 изображения
 * @type {string}
 */
let base64ImageFile = "";
/**
 * Флаг для поля таб. flagdel
 * @type {boolean}
 */
let flagDel = 0;
let id = -1;
class ImgWork extends FormView {
    /**
     * Конструктор
     * @param prefix - приставка для каждого id.
     * @param StartParams - стартовые параметры в формте JSON
     */
    constructor(StartParams) {
        super();//вызов конструктора родительского окна
        this.StartParams = StartParams;
    }

    Start(){
       flagDel = 0;
       LoadForm("#ModalWindows", this.GetUrl("/ImgWork/ImgWorkForm"), this.InitFunc.bind(this));
    }

    /**
     * Инициализация интерфейса пользователя
     * @constructor
     */
    InitFunc()
    {
        if($("link[href='css/imgs/imgwork/overlay.css']").length==0) {
            let elem = document.createElement('link');
            elem.rel = 'stylesheet'; elem.type = 'text/css'; elem.href = 'css/imgs/imgwork/overlay.css';
            document.head.appendChild(elem);
        }
        //Автоматическое получение идентификаторов формы
        this.InitComponents('wImgWork_Module_ImgWork_ImgWorkForm', "");
        this.InitCloseEvents(this.wImgWork);
        this.btnLoad.linkbutton({onClick: this.btnLoad_onClick.bind(this)});
        this.btnDelete.linkbutton({onClick: this.btnDelete_onClick.bind(this)});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({onClick: ()=>{this.wImgWork.window("close")}});
        if(this.StartParams.ListParamId === undefined) this.StartParams.ListParamId="-1";
        if(this.StartParams.period_lock_id === undefined || this.StartParams.period_lock_id.length==0) this.StartParams.period_lock_id="0";
        if(this.StartParams.imgLockId === undefined) this.StartParams.imgLockId="0";
        this.LoadImgWork();
    }

    /**
     * Загрузка изображения c компьютера
     */
    btnLoad_onClick(){
        let flagChange = false;
        //Позиционирование
        //https://stackoverflow.com/questions/356809/best-way-to-center-a-div-on-a-page-vertically-and-horizontally

        let fileupload = $("#inpFileUpld_Module_ImgWork");
        //эмулировали клик по Input
        fileupload.click();
        let f = fileupload.change(function () {
                        //флаг change - отработать только один раз
                        if(flagChange) return;
                        $('#divOverlay_Module_ImgWork').show();
                        $("#cnvLoad_Module_ImgWork").hide();
                        $("#divImgText_Module_ImgWork").show();
                        const maxW=980, maxH=520;
                        //получили данные выбранного файла
                        let files = fileupload.prop('files');
                        if (files.length> 0) {
                           if(files[0]['size']>10240000){//102400000 - 100 Мб
                               base64ImageFile="";
                               $('#divOverlay_Module_ImgWork').hide();
                               return this.ShowWarning("Размер файла превышает 100 Мб");
                            }
                           //Если файл изображение
                            if(files[0]['type'].indexOf("image") != -1){
                                let reader;
                                let loaded = function (evt) {
                                    let canvas = document.getElementById("cnvLoad_Module_ImgWork");
                                    let ctx = canvas.getContext("2d");
                                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                                    let imgLaod = new Image();
                                    imgLaod.onload = function(){
                                        let iwScaled, ihScaled;
                                        if(imgLaod.width>980 || imgLaod.height>520){
                                            this.ShowWarning("Вам будет показанно уменьшенное изображение, так как высота или ширина слишком велики !");
                                            let iw=imgLaod.width;
                                            let ih=imgLaod.height;
                                            let scale=Math.min((maxW/iw),(maxH/ih));
                                            iwScaled=iw*scale;
                                            ihScaled=ih*scale;
                                            canvas.width=iw*scale;
                                            canvas.height=ih*scale;
                                        }
                                        else{
                                            iwScaled = canvas.width = imgLaod.width;
                                            ihScaled = canvas.height = imgLaod.height;
                                        }
                                        ctx.drawImage(imgLaod, 0,0, iwScaled, ihScaled);
                                        $("#divImgText_Module_ImgWork").hide();
                                        $('#divOverlay_Module_ImgWork').hide();
                                        $("#cnvLoad_Module_ImgWork").css('opacity', '1').show();
                                        //начальная кодировка base64 console.log(" reader.result = ", reader.result);
                                        //получаем код base64 с изменнеными размерами в формате PNG
                                        //data:image/png;base64,
                                        let base64ImageFileTemp =  ctx.canvas.toDataURL();
                                        if(base64ImageFileTemp.includes('data:image/png;base64,')){
                                            //вырезаем 'data:image/png;base64,"
                                            base64ImageFile = base64ImageFileTemp.replace('data:image/png;base64,','');
                                        }
                                        else{
                                            base64ImageFile="";
                                        }
                                        //здесь, так как можно нажать "Отмена" и т.д.
                                        flagDel = 0;
                                    }.bind(this)
                                    imgLaod.src = evt.target.result;
                                }.bind(this);
                                let errorHandler = function () {
                                    $("#divImgText_Module_ImgWork").show();
                                    $('#divOverlay_Module_ImgWork').hide();
                                    $("#cnvLoad_Module_ImgWork").hide();
                                    base64ImageFile="";
                                    return this.ShowWarning("Ошибка при обработке изображения ! ");
                                }.bind(this);
                                let getBase = function (readFile) {
                                    reader = new FileReader();
                                    // Запускает процесс чтения данных, по завершению в result будут данные data: URL
                                    reader.readAsDataURL(readFile);
                                    reader.onload = loaded;
                                    reader.onerror = errorHandler;
                                }.bind(this);
                                getBase(files[0]);
                            }else{
                                $("#divImgText_Module_ImgWork").show();
                                $('#divOverlay_Module_ImgWork').hide();
                                $("#cnvLoad_Module_ImgWork").hide();
                                base64ImageFile="";
                                this.ShowWarning("Файл не является изображением ! ");
                            }
                        }
                        else {
                            this.ShowWarning("Изображение не выбранно ! ");
                        }
                        flagChange = true;
        }.bind(this));
    }

    /**
    * Очистить изображение
    */
    btnDelete_onClick(){
        if(isEmpty(base64ImageFile) || flagDel!=0) return 0;
            $("#cnvLoad_Module_ImgWork").animate({opacity: 0}, 500, () => {
                $("#cnvLoad_Module_ImgWork").hide(()=>{
                    $("#divImgText_Module_ImgWork").show();
                });
            });
            flagDel = 1;
    }

    /**
     * Загрузка изображения из базы при старте модуля
     * @constructor
     */
    LoadImgWork(){
        ////SesId, ObjectId и RecId, ListParamId, PeriodParamId
        $.ajax({
            method: "get",
            url: this.GetUrl('/ImgWork/get?objectId='+this.StartParams.ObjectId+'&recId='+this.StartParams.RecId+'&sesId='+this.StartParams.SesId+'&listParamId='+this.StartParams.ListParamId+'&periodParamId='+this.StartParams.PeriodParamId+'&period_lock_id='+this.StartParams.period_lock_id+'&imgLockId='+this.StartParams.imgLockId),
            beforeSend: function(){
                $('#divOverlay_Module_ImgWork').show();
                $("#cnvLoad_Module_ImgWork").hide();
                $("#divImgText_Module_ImgWork").show();
            }.bind(this),
            success: function (data) {
                if(data.flagdel == 1 || (data.id==-1 && data.img == "-1")) {
                    base64ImageFile="";
                    return $('#divOverlay_Module_ImgWork').hide();
                }
                let canvas = document.getElementById("cnvLoad_Module_ImgWork");
                let ctx = canvas.getContext("2d");
                let imgLaod = new Image();
                imgLaod.src  = 'data:;base64,'+data.img;
                imgLaod.onload = function(){
                    canvas.width = imgLaod.width;
                    canvas.height = imgLaod.height;
                    ctx.drawImage(imgLaod, 0,0, imgLaod.width, imgLaod.height);
                    $('#divOverlay_Module_ImgWork').hide();
                    $("#divImgText_Module_ImgWork").hide();
                    $("#cnvLoad_Module_ImgWork").css("opacity", "1").show();
                    base64ImageFile = data.img;
                    id = data.id;
                }
            }.bind(this),
            error: function (data) {
                $('#divOverlay_Module_ImgWork').hide();
                base64ImageFile="";
                console.log(" data = ", data)
                this.ShowWarning(data.responseJSON.message);
            }.bind(this)
        });
    }

    /**
     * Сохранение изображения в таблицу imglock
     * @param obj - модель  соотвествующая таблице
     * @constructor
     */
    Save(obj, cllbck){
        $.ajax({
            method: "POST",
            data: JSON.stringify(obj),
            url: this.GetUrl('/ImgWork/save'),
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                let self = this;
                cllbck(data, self);
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     Обработка нажатия OK
     */
    btnOk_onClick(){
        if(isEmpty(base64ImageFile)) return this.ShowError("Изображение не выбрано !");

        ////SesId, ObjectId и RecId, ListParamId, PeriodParamId
        let imgLock = {
            id: id,
            objectid: this.StartParams.ObjectId,
            recid: this.StartParams.RecId,
            flagdel: flagDel,
            flagchange: 0,
            img: base64ImageFile,
            sesid: this.StartParams.SesId,
            listparamid: this.StartParams.ListParamId,
            periodparamid: this.StartParams.PeriodParamId,
            period_lock_id: this.StartParams.period_lock_id
        };
        function cllbck(id, slf){
            if(id == -1){
                slf.ShowWarning("Файл не являеться изображением ! ");
            } else {
                if(slf.ResultFunc!=null) slf.ResultFunc({id: id.toString()});
                slf.wImgWork.window("close");
            }
        }
        return this.Save(imgLock, cllbck);
    }

}
function isEmpty(s) {
    return (!s || s.length===0)
}
/**
 * Вызов модулч в диалоговом окне
 * @param StartParams
 * @param ResultFunc
 * @constructor
 */
export function StartModalModul(StartParams, ResultFunc) {
    try {
        for (let prp in StartParams)
            if (!isEmpty(StartParams[prp]))
                StartParams[prp] = StartParams[prp].toString().trim();

        if (isEmpty(StartParams.SesId) || isEmpty(StartParams.ObjectId) || isEmpty(StartParams.RecId))
            return $.messager.alert("Ошибка", "Не все обязательные параметры переданы или они имеет неверный формат!!! ", "error");

        //SesId, ObjectId и RecId, ListParamId, PeriodParamId
        let form = new ImgWork(StartParams);
        form.SetResultFunc(ResultFunc);
        form.Start();
    }
    catch (e) {
        $.messager.alert("Ошибка !", " Ошибка при запуске модуля! "+e.message, "error");
    }
}