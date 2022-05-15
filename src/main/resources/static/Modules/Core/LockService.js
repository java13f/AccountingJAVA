class LibLockService{
    constructor(Interval) {
        this.LastTable = "";
        this.LastRecId = "";
        this.Interval = Interval;
        this.TimerId = -1;
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
    StateLockRecord(Table, Id, success_func){
        $.ajax({
            method:"get",
            url: this.GetUrl("/LockService/StateLockRecord?table=" + Table + "&recId=" + Id),
            success:(data)=>{success_func({id:Id, data:data});},
            error: (data)=>{this.ShowErrorResponse(data.responseJSON);}
        });
    }
    /**
     * Пытается заблокировать запись Id, по результату заполняет объект Options
     * @param Table
     * @param Id
     * @param Options
     * @constructor
     */
    LockRecord(Table, Id, success_func){
        var options={id: Id, AddMode: false, editMode: true, lockMessage:'', lockState: false};

        let json = JSON.stringify({'table': Table, 'recId': Id});
        this.LastTable = Table;
        this.LastRecId = Id;
        $.ajax({
            method:"post",
            data: json,
            url: this.GetUrl("/LockService/LockRecord"),
            contentType: "application/json; charset=utf-8",
            success:((data)=>{
                options.lockMessage = data;
                if(options.lockMessage.length == 0){
                    this.TimerId = setInterval((() => {this.UpdateLock();}).bind(this), this.Interval);
                }
                success_func(options);
            }).bind(this),
            error: (data)=>{this.ShowErrorResponse(data.responseJSON);}
        });
    }
    UpdateLock(){
        let json = JSON.stringify({'table': this.LastTable, 'recId': this.LastRecId});
        $.ajax({
            method:"post",
            data: json,
            url: this.GetUrl("/LockService/UpdateLock"),
            contentType: "application/json; charset=utf-8",
            success:((data)=>{}).bind(this),
            error: (data)=>{}
        });
    }
    FreeLockRecord(Table, Id){
        clearInterval(this.TimerId);
        let json = JSON.stringify({'table': this.LastTable, 'recId': this.LastRecId});
        this.LastTable = "";
        this.LastRecId = "";
        $.ajax({
            method:"post",
            data: json,
            url: this.GetUrl("/LockService/FreeLockRecord"),
            contentType: "application/json; charset=utf-8",
            success:((data)=>{}).bind(this),
            error: (data)=>{}
        });
    }
}