import {FormView} from "../Core/FormView.js";

export class PeriodEditForm extends FormView{
    constructor() {
             // this.options = {AddMode: true, editMode: true};
             super();
    }

    /**
     * Показать форму добавления/редактирования периодического реквизита
     * @param options
     * @constructor
     */
    Show(options, gridDt, index, setDataFrm){
        //console.log(" PeriodEditForm, options = ", options);
        this.options = options;
        this.gridDt = gridDt;
        this.index = index;
        this.setDataFrm = setDataFrm;
        this.obj = {id: '-1', editMode: options.editMode};
        LoadForm("#ModalWindows", this.GetUrl("/PeriodEdit/PeriodEditForm"), this.InitFunc.bind(this));
    }

    InitFunc(){
        this.InitComponents ("wPeriodEditForm_Module_PeriodEdit", "");
        //console.log("PeriodEditForm InitFunc, this =", this);
        this.InitCloseEvents(this.wPeriodEditForm);
        this.btnSelectList.linkbutton({onClick: this.btnSelectList_onClick.bind(this)});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({onClick: ()=>{this.wPeriodEditForm.window("close")}});

        this.lAction.text(this.options.text);

        if(this.isEmpty(this.options.refferModulPrdEdt)){
            this.wInpVal.textbox({readonly: false });
            this.btnSelectList.linkbutton("disable");
        }
        else{
            this.wInpVal.textbox({readonly: true });
            this.btnSelectList.linkbutton("enable");
        }
        //this.wDateVal.datetimebox.validate();
        this.wDateVal.datetimebox({
            formatter: date=>{ return this.frmtDt(date); },
            value: this.getDfltDate(this.options.editMode),
            //setValue: this.getDfltDate(this.options.editMode),
            parser: s=>{
               //console.log(" parser ", s);
                if (!s){return new Date();}
                let dt = s.split(' ');
                let dtFr = dt[0].split('-');
                let tmFr = dt[1].split(':');
                let date = new Date(dtFr[2], dtFr[1]-1, dtFr[0]);
                if (dt.length>1 && this.options.cntRws>0){
                    date.setHours(tmFr[0]);
                    date.setMinutes(tmFr[1]);
                    date.setSeconds(tmFr[2]);
                }
                return date;
            },

        });
        //console.log(" this.options = ", this.options)
        this.txId.textbox({value: this.options.id})
        this.wInpVal.textbox({value: this.options.valueFrmEdt})
        this.wCreated.textbox({width: 142, value: this.parserDtForEdit(this.options.created)})
        this.wCreator.textbox({value: this.options.creator})
        this.wChanger.textbox({value: this.options.changer})
        this.wChanged.textbox({width: 142, value: this.parserDtForEdit(this.options.changed)})
        //console.log("PeriodEditForm, InitFunc this.options.dtDrd= ", this.options.dtDrd)
        //console.log("PeriodEditForm, InitFunc this.parserDtForEdit(this.options.dtDrd)= ", this.parserDtForEdit(this.options.dtDrd))
        //если редактирование проверяем день на открытость
        if (! this.options.editMode) return;
        this.wPeriodEditForm.window({title: "Редатирование записи"});
        $.when(this.OpenDayCheck(this.parserDtForEdit(this.options.dtDrd)))
            .then(data=>{
                //console.log("PeriodEditForm, InitFunc, $.when, then data= ", data)
                if(!data) {
                    this.wDateVal.datetimebox('disable');
                    this.btnSelectList.linkbutton('disable');
                    this.btnOk.linkbutton('disable');
                    this.ShowWarning("Редактирование невозможно, выбранный день не является открытым !");
                    //this.ShowToolTip('#wDateVal_Module_PeriodEdit + span',"Редактирование невозможно, выбранный день не является открытым !", {position: 'top'});
                }
            });
        //$(this.wInpVal).textbox({readonly: true });
    }

    parserDtForEdit(s){
        if (this.isEmpty(s)) return " ";
        //console.log(' dtFr : s = ', s)
        let dt = s.split(' ');
        let dtFr = dt[0].split('-');
        let tmFr = dt[1].split(':');
        let date1 = [dtFr[0], dtFr[1], dtFr[2]].join('-');
        let time1 = [tmFr[0], tmFr[1], tmFr[2].substr(0,2)].join(':');

        return date1 + ' ' + time1;
    }
    /**
     * Получить текущтю дату
     * @returns {string}
     */
    getDfltDate (flag){
    //console.log("getDfltDate, flag = ", flag)
    if(flag) return  this.parserDtForEdit(this.options.dtDrd);
    let date = new Date();
    return this.frmtDt(date);
}

    /**
     * Получить дату в нужном формате
     * @param date
     * @returns {string}
     */
    frmtDt(date){
        //console.log(" frmtDt date = ", date);
    let d = date.getMonth() + 1;
    let s1 = [date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate(),
        (d ) < 10 ? ('0' + d) : (d),
        date.getFullYear()].join('-');
    let s2 = [date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours(),
        date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes(),
        date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds()].join(':');
    //console.log("getToday, s1 +    + s2  = ", s1 + ' ' + s2);
    return s1 + ' ' + s2;
}
    /**
     * Проверка даты
     * @param s
     * @returns {boolean|boolean}
     */
    validatorDateTime(s) {
        let dt = s.split(' ');
        let dtFr = dt[0].split('-');
        let tmFr = dt[1].split(':');
        let m = parseInt(dtFr[2],10);
        let d = parseInt(dtFr[1],10);
        let y = parseInt(dtFr[0],10);

        let ss = parseInt(tmFr[2],10);
        let mm = parseInt(tmFr[1],10);
        let hh = parseInt(tmFr[0],10);

        return !isNaN(m) && !isNaN(d) && !isNaN(y) && !isNaN(ss) && !isNaN(mm) && !isNaN(hh);
    }
    /**
     * Проверка дня (даты) на открытость
     * @constructor
     */
    OpenDayCheck(chckDay){
        //console.log("Start OpenDayCheck ");
        return $.get({url: this.GetUrl('/PeriodEdit/OpenDayCheck?chckDay='+chckDay)});
    }

    /**
     * Добавить новый периодический реквизит
     */
    btnOk_onClick() {
        //console.log("PeriodEditForm, btnOk_onClick", "this.wDateVal.datetimebox = ", this.wDateVal.datetimebox);
        //if(this.wDateVal.val().trim().length<1) return this.ShowWarning("Поле \"Дата начало действия не заполнены\"");
        if(this.wDateVal.val().trim().length<1) return this.ShowToolTip('#wDateVal_Module_PeriodEdit + span',"Поле \"Дата начало действия\" не заполнены", {position: 'top'});
        if(!this.validatorDateTime(this.wDateVal.val().trim())) return this.ShowToolTip( '#wDateVal_Module_PeriodEdit + span',"Поле \"Дата начало действия\" имеет неверный формат", {position: 'top'});

        if(this.isEmpty(this.obj.dt)) {
            //console.log(" btnOk_onClick isEmpty, this = ", this)
           if(this.wInpVal.textbox('getText').includes(' = ')) {
               this.obj.id = this.wInpVal.textbox('getText').split(' = ')[0].trim();
               this.obj.dt= this.wInpVal.textbox('getText').split(' = ')[1].trim();
           }
            else this.obj.dt = this.wInpVal.textbox('getText');
        }
        if(this.isEmpty(this.obj.dt)) return this.ShowToolTip('#wInpVal_Module_PeriodEdit + span>input', "Поле \"Значение не заполнено\"", {delay: 3000});

        if(!this.isEmpty(this.obj.dt))
            if(this.obj.dt=='null' || this.obj.dt==null || this.obj.dt.length<2) return this.ShowToolTip('#wInpVal_Module_PeriodEdit + span>input', "Поле \"Значение не заполнено\"", {delay: 3000});
                //console.log(" btnOk_onClick this.options = " , this.options)


        $.when(this.OpenDayCheck(this.wDateVal.val().trim())) //Проверяем открыт ли день
            .then(data=>{
                //console.log(" btnOk_onClick -> $.when (OpenDayCheck) -> then, data = ", data);
                if(!data) return this.ShowToolTip( '#wDateVal_Module_PeriodEdit + span',"День не является открытым !", {position: 'top'});
                this.obj.dateTime = this.wDateVal.val().trim();
                //console.log("this.obj = ", this.obj, " this.options = ", this.options);
                //console.log("this = ", this);
                if(this.gridDt !== undefined){
                    let identicalData = false, i = 0;
                    if(this.options.AddMode && !this.options.editMode)
                        this.gridDt.forEach( v => { if(v.flagDel==0 && this.setDataFrm(v.fdate) == this.setDataFrm(this.obj.dateTime)) identicalData = true; });
                    else
                        this.gridDt.forEach( v => { if(v.flagDel==0 && this.setDataFrm(v.fdate) == this.setDataFrm(this.obj.dateTime) && i!=this.index) identicalData = true; i++;});
                    if(identicalData) return this.ShowWarning("Периодический реквизит с такой датой и временем существует !");
                }
                if(this.ResultFunc != null) this.ResultFunc(this.obj);
                this.wPeriodEditForm.window("close");
            });
    }

    /**
     * Вызов справчника для заполнения поля "Значение"
     */
    btnSelectList_onClick(){
        //console.log(" PeriodEditForm, btnSelectList this.options = ", this.options );
        let refferModul = this.options.refferModulPrdEdt.split('.')[0];
        //console.log(" refferModul = ", refferModul );
            StartModalModulGlobal(
                 refferModul,
                {},
                data => {
                            //console.log(" data = ", data);
                            this.obj.id = data.id;
                            //console.log(" refferModul = ", refferModul, " data.id = ", data.id);
                            let id = data.id;
                            $.ajax({
                               method: "get", // url: this.GetUrl('/PeriodEdit/deleteImgLock?SesId='+this.StartParams.SesId),
                               url: this.GetUrl('/PeriodEdit/getData?Tbl='+this.options.PeriodParamId+'&Id='+data.id),
                               success: data=>{
                                   //console.log("btnSelectList_onClick ->ajax->success, data = ", data, " this = ", this);
                                   this.obj.dt = data.trim();
                                   $(this.wInpVal).textbox({
                                       value: id +" = "+ data,
                                       //readonly: true
                                   })
                               },
                               error: data=>{
                                   //console.log("btnSelectList_onClick ->ajax->error");
                                   this.ShowErrorResponse(data.responseJSON);
                               }
                           });
                           //console.log("StartModalModulGlobal btnSelectList data = ", data);//data.id
                }
             );
        }

    isEmpty(s) {
        return (!s || s.length===0)
    }
}