class LibFilter{
    constructor(code) {
        this.code = code;
        this.filterObj = {}
    }
    GetUrl(url){
        return contextPath + url;
    }
    ShowErrorResponse(responseJSON) {
        let error = "message: " + responseJSON.message + "<br/>"
            +"error: " + responseJSON.error + "<br/>"
            +"status: " + responseJSON.status + "<br/>"
            +"path: " + responseJSON.path;
        this.ShowError(error);
    }
    ShowError(text) {
        $.messager.alert("Ошибка", text, "error");
    }
    /**
     * Загрузка фильтра
     * @param options параметры для функции
     * @constructor
     */
    LoadFilter(success_func = null, options = null){
        let code = encodeURIComponent(this.code);
        $.ajax({
            method: "get",
            url: this.GetUrl("/Filters/GetValues?code=" + code),
            success: function(data){
                this.filterObj = {}
                for(let ip = 0; ip < data.length; ip++){
                    let param = data[ip];
                    this.filterObj[param.paramCode] = param.val;
                }
                if(success_func !=null){
                    if(options != null){
                        success_func(options);
                    }
                    else {
                        success_func();
                    }
                }
            }.bind(this),
            error: function(data){this.ShowErrorResponse(data.responseJSON);}.bind(this)
        })
    }

    /**
     * Получить значение параметра фильтра
     * @param paramCode код параметра фильтра
     * @param defaultValue значение по умолчанию
     * @constructor
     */
    GetValue(paramCode, defaultValue){
        if(paramCode in this.filterObj){
            return this.filterObj[paramCode];
        }
        else {
            return defaultValue;
        }
    }

    /**
     * Задать значение параметра фильтра
     * @param paramCode код параметра фильтра
     * @param val значение параметра фильтра
     * @constructor
     */
    SetValue(paramCode, val){
        this.filterObj[paramCode] = val;
    }

    /**
     * Сохранить фильтр в базе данных
     * @param success_func функция кокторая будет вызвана при успешном сохранении фильтра
     * @param options параметры которые передадутся в функцию
     * @constructor
     */
    SaveFilter(success_func = null, options = null){
        let listParams = [];
        for(let key in  this.filterObj){
            listParams.push({code: this.code, paramCode: key, val: this.filterObj[key]});
        }
        $.ajax({
            method:"post",
            data: JSON.stringify(listParams),
            url: this.GetUrl("/Filters/SetValues"),
            contentType: "application/json; charset=utf-8",
            success: function(data) {
                if(success_func!=null) {
                    if (options == null) {
                        success_func();
                    } else {
                        success_func(options);
                    }
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Удаление фильтра
     * @param success_func функция которая будет вызвана в случае успешного удаления фильтра
     * @param options настройки которые будут переданы в функцию
     * @constructor
     */
    DeleteFilter(success_func = null, options = null){
        $.ajax({
            method: "post",
            data: this.code,
            url: this.GetUrl("/Filters/DeleteFilter"),
            contentType: "application/json; charset=utf-8",
            success: function(data) {
                if(success_func!=null) {
                    if (options == null) {
                        success_func();
                    } else {
                        success_func(options);
                    }
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Удаление прамаетров из фильтра
     * @param keys коды параметров
     * @param success_func функция, которая будет вызвана после успешного удаления фильтра
     * @param options настройки, которые будут переданы в функцию
     * @constructor
     */
    DeleteParamsInFilter(keys, success_func = null, options = null){
        let listParams = [];
        for (let key in keys){
            listParams.push({code: this.code, paramCode: keys[key],  val: ""});
        }
        $.ajax({
            method:"post",
            data: JSON.stringify(listParams),
            contentType: "application/json; charset=utf-8",
            url: this.GetUrl("/Filters/DeleteParamsInFilter"),
            success: function(data){
                for (let key in keys){
                    delete this.filterObj[key];
                }
                if(success_func!=null) {
                    if (options == null) {
                        success_func();
                    } else {
                        success_func(options);
                    }
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Получить объект фильтра
     * @returns {{}}
     * @constructor
     */
    GetFilterObject(){
        return this.filterObj
    }
}