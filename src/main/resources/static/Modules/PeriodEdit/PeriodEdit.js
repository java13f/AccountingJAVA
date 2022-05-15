import {FormView} from "../Core/FormView.js";
import {PeriodEditForm} from "./PeriodEditForm.js";

/**
 * Флаг закрытия формы, для отличия OK( от ESC и Cancel и т.д.)
 * @type {boolean}
 */
let flClsFrm = false;
/**
 * Для данных из БД часть которых отображаеться в ГРИДЕ
 * @type {{}}
 */
let dataPrdRcv = {};
class PeriodEdit extends FormView {
    constructor(StartParams) {
        super();
        this.options = {  refferModulPrdEdt: '' };
        this.PerioEditId = -1; //Для последней добавленной/измененной записи
        this.PerioEditIndex = 0; //Позиция курсора. Применяеться для восстановления позиции курсора при обновлении записи
        this.StartParams = StartParams;
        this.sLoc = new LibLockService(300000);//Создадим объект работы с блокировками
        if(this.StartParams.PeriodParamId.length<1) this.StartParams.PeriodParamId=-1;
    }

    Start(){
        flClsFrm = false;
        LoadForm("#ModalWindows", this.GetUrl("/PeriodEdit/PeriodEditList"), this.InitFunc.bind(this));
    }

    InitFunc(){
        this.InitComponents('wPeriodEditList_Module_PeriodEdit',"");
        this.InitCloseEvents(this.wPeriodEditList, false);
        AddKeyboardNavigationForGrid(this.dgPeriodEdit);
        this.dgPeriodEdit.datagrid({
            onLoadError: data => { this.ShowErrorResponse(data.responseJSON)},
            rowStyler: this.dgPeriodEdit_rowStyler.bind(this),
            onLoadSuccess: this.dgPeriodEdit_onLoadSuccess.bind(this),
            onSelect: this.btnDeleteChangeText.bind(this),
            onClickCell: this.dgPeriodEdit_ClickCell.bind(this),
        });

        this.btnAdd.linkbutton({onClick: this.btnAdd_onClick.bind(this)});
        this.btnChange.linkbutton({onClick: this.btnChange_onClick.bind(this)});
        this.btnDelete.linkbutton({onClick: this.btnDelete_onClick.bind(this)});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({onClick: function () {return this.wPeriodEditList.window("close");}.bind(this)});
        //this.cbShowDel.checkbox({onChange: this.btnUpdate_onClick.bind(this)});

        //проверка прав на просмотор
        $.when(this.LoadRight("PeriodEditView"))
            .then(data => {//callback, после завершения проверки прав на просмотор, если есть права то загрузаем пер. реквкзиты
                if(data.length==0) return this.LoadDataFrGrd();
                else return this.ShowWarning(JSON.stringify(data));//return this.ShowSlide("Периодические реквизиты",JSON.stringify(data));
                })
            .then(() => {
                //получаем название Пер. рек.
                this.GetPeriodParam(this.StartParams.PeriodParamId);
                //сортировка даты
                this.dgPeriodEdit.datagrid('getColumnOption', 'fdate').sorter=(a,b)=>this.setDataFrm(a)<this.setDataFrm(b)?1:-1;
            });
        //При закрытии формы НЕ кнопой "Отмена"
        this.wPeriodEditList.window({onBeforeClose:()=>{
           if(flClsFrm) return;
           return this.DeleteFrmImgLock();
        }});
    }

    /**
     * Клик по ячейке ВИД
     * @param index
     * @param field
     * @param value
     */
    dgPeriodEdit_ClickCell(index,field,value){
        //console.log('dgPeriodEdit_ClickCell')
        if(field != 'view') return;
        //$.when(this.OpenDayCheck(this.dgPeriodEdit.datagrid('getData').rows[index].fdate))
            //.then(data=>{
                //if(!data) return  this.ShowWarning("Невозможно изменить или добавить изображение, выбранный день не является открытым !");
                let imgParams = {
                    SesId: this.StartParams.SesId,
                    ObjectId: this.StartParams.ObjectId,
                    RecId: dataPrdRcv.rows[index].recId,
                    ListParamId: "",
                    PeriodParamId: this.StartParams.PeriodParamId,
                    imgLockId: this.dgPeriodEdit.datagrid('getData').rows[index].imgLockId
                    //period_lock_id: typeof this.StartParams.period_lock_id  === 'undefined'?'':this.StartParams.period_lock_id
                };
                //если сохранили запись в periodlock id>-1
                if(this.dgPeriodEdit.datagrid('getData').rows[index].id>-1){
                    imgParams.period_lock_id = this.dgPeriodEdit.datagrid('getData').rows[index].id;
                }else{
                    //еще не сохранили в в periodlock
                    if(this.dgPeriodEdit.datagrid('getData').rows[index].tocen === undefined) {
                        let t = Date.now(), r = Math.random();
                        this.dgPeriodEdit.datagrid('getData').rows[index].tocen = imgParams.period_lock_id = r.toString().substr(-4, 4) + t.toString().substr(-5, 5);
                    }else{
                        imgParams.period_lock_id = this.dgPeriodEdit.datagrid('getData').rows[index].tocen;
                    }
                }

                StartModalModulGlobal("ImgWork",   imgParams,
                    data => {
                        let curRow = this.dgPeriodEdit.datagrid("getSelected");
                        if(data.id>0){
                            $.ajax({// Узаем удалена ли запись и рисуем знак И
                                method: "get",
                                url: this.GetUrl('/PeriodEdit/getImgLockFlagDel?imgLockId='+ data.id),
                                success: (dataFlDel) => {
                                    if (dataFlDel==0 ) { curRow.view = '&nbsp;&nbsp;И'; dataPrdRcv.rows[index].imgLockId = data.id;}
                                    else if(dataFlDel==1) { curRow.view = ""; dataPrdRcv.rows[index].imgLockId = 0;}
                                    this.dgPeriodEdit.datagrid('beginEdit', index);
                                    this.dgPeriodEdit.datagrid('endEdit', index);
                                },
                                error: (dataFlDel) => {
                                    this.ShowErrorResponse(dataFlDel.responseJSON);
                                }
                            });
                        }
                        else if(data.id<0){
                            curRow.view = "";
                            curRow.imgLockId = 0;
                            this.dgPeriodEdit.datagrid('beginEdit', index);
                            this.dgPeriodEdit.datagrid('endEdit', index);
                        }
                    }
                );
            //});
    }

    /**
     * Обработка события перерисовки грида (подсветка удалённых записей)
     * @param index
     * @param row
     * @returns {string}
     */
    dgPeriodEdit_rowStyler(index, row){
        if (row.flagDel == 1) return "background-color:gray;";
    }

    /**
     * Обработка окончания загрузки списка периодических реквизитов
     * @param data
     */
    dgPeriodEdit_onLoadSuccess(data) {
        dataPrdRcv = data;
        //console.log(" data = ", data);
        for( let i=0, len = data.rows.length; i<len; i++ ){
            if(data.rows[i].flagPreImg){
                data.rows[i].view = '&nbsp;&nbsp;И';
                this.dgPeriodEdit.datagrid('beginEdit', i);
                this.dgPeriodEdit.datagrid('endEdit', i);
            }
        }
        $.ajax({
            method: "get",
            url: this.GetUrl('/PeriodEdit/getImgLockFlDlAll?sesid='+this.StartParams.SesId),
            success: dt => {
                //console.log(" dt = ", dt);
                for( let i=0, len = data.rows.length; i<len; i++ ){
                    if(data.rows[i].imgLockId>0 && dt.find(value => value.id == data.rows[i].imgLockId).flagDel==0){
                        data.rows[i].view = '&nbsp;&nbsp;И';
                        this.dgPeriodEdit.datagrid('beginEdit', i);
                        this.dgPeriodEdit.datagrid('endEdit', i);
                    }
                }
                if (data.total > 0) {//в поле total хранится общее количество строк в гриде
                    if (this.PerioEditId != -1) {
                        this.dgPeriodEdit.datagrid("selectRecord", this.PerioEditId);
                        //если сохранённы идентификатор отличается от значения по умолчанию, то заставляем грид установить курсор на запись с данным идентификатором
                    } else {//иначе устанавливаем курсор согласно сохранённому положению курсору
                        if (this.PerioEditIndex >= 0 && this.PerioEditId < data.total) {
                            this.dgPeriodEdit.datagrid("selectRow", this.PerioEditIndex);
                        } else if (data.total > 0) {
                            this.dgPeriodEdit.datagrid("selectRow", data.total - 1);
                        }
                    }
                    //возвращаем значение по умолчанию
                    this.PerioEditId = -1;
                    this.PerioEditIndex = 0;
                }
                    let txMssDt="";
                    if (this.StartParams.PeriodParamData.length==0) {
                        let d = new Date();
                        txMssDt = " За дату " + (d.getDate()<10?'0'+d.getDate():d.getDate())+"."+(d.getMonth()<10?'0'+(d.getMonth()+1):(d.getMonth()+1))+"."+d.getFullYear();
                    }
                    else{
                        txMssDt = " За дату " + this.StartParams.PeriodParamData;
                    }
                    this.wPeriodEditData.text(txMssDt);
            },
            error: data=>{
                this.ShowErrorResponse(data.responseJSON);
            }

        })

    }


    /**
     * Загрузка списка периодиеских реквизитов
     */
    LoadDataFrGrd(){
     return this.dgPeriodEdit.datagrid({url: this.GetUrl('/PeriodEdit/getList?SesId='+this.StartParams.SesId+'&ObjectId='+this.StartParams.ObjectId+'&RecId='+this.StartParams.RecId+'&PeriodParamId='+this.StartParams.PeriodParamId+'&PeriodParamData='+this.StartParams.PeriodParamData)});
    }

    /**
     * Получить Id пользователя
     */
    getUserId(){
      return  $.ajax({
            url: this.GetUrl('/PeriodEdit/getUserId'),
            //data: {id: options.id},
            success: function (data) {//console.log(" data = ", data);
                 }.bind(this),
            error: function (data) {this.ShowErrorResponse(data.responseJSON);}.bind(this)
        });
    };



    btnAdd_onClick() {
        $.when(this.LoadRight('PeriodEditChange'), this.getUserId())
            .then((data, res)=>{
                if(data[0].length == 0){
                        let getRows = this.dgPeriodEdit.datagrid("getRows");
                        let cntRws = 0;
                        for(let i=0; i<getRows.length; i++)
                            if(getRows[i].flagDel!=1) {
                                cntRws++;
                                break;
                            }

                        let form = new PeriodEditForm();
                        form.Show({
                            AddMode: true,
                            editMode: false,
                            refferModulPrdEdt: this.options.refferModulPrdEdt,
                            text: "Добавление записи",
                            PeriodParamId:  this.StartParams.PeriodParamId,
                            cntRws: cntRws
                        },getRows, -1, this.setDataFrm);
                        this.StartParams.userId = res[0];
                        form.SetResultFunc(options => {
                                //console.log(" SetResultFunc, options :  ", options, " this.StartParams : ", this.StartParams, " dataPrdRcv ", dataPrdRcv);
                                let dt =options.dateTime.split(" ")[0].split("-");
                                let tm = options.dateTime.split(" ")[1].split(":");
                                this.dgPeriodEdit.datagrid( 'sort',  {
                                    sortName: 'fdate',
                                    sortOrder: 'asc'
                                });
                                //Определяем порядок сортировки
                                let inxInsert = 0;
                                //let getRows = this.dgPeriodEdit.datagrid("getRows");
                                //ищем позицию для вставки ( по дате)
                                let len = getRows.length;
                                if (len > 0) {
                                    //проверка на наличие такой же даты времени
                                   //let identicalData = false;
                                    //getRows.forEach( v => { if(v.flagDel==0 && this.setDataFrm(v.fdate) == this.setDataFrm(options.dateTime)) identicalData = true; });
                                    //if(identicalData) return this.ShowWarning("Периодический реквизит с такой датой и временем существует !");
                                    let maxData = "0";
                                    getRows.forEach(v => { if(this.setDataFrm(v.fdate)>maxData) maxData = this.setDataFrm(v.fdate);} );
                                    let indexMAX = getRows.findIndex( key => this.setDataFrm(key.fdate) == maxData );
                                    let newDataGrid = this.setDataFrm(options.dateTime);
                                    if (len > 1) {
                                        let flagDt = true;
                                        for (let i = 0; i < len; i++) {
                                            //если сортировка по убыванию (indexMAX == 0) находим первый индекс меньшей дыты, по возрастанию (indexMAX>0) наоборот
                                            if ((indexMAX == 0 && newDataGrid > this.setDataFrm(getRows[i].fdate)) || (indexMAX > 0 && newDataGrid < this.setDataFrm(getRows[i].fdate))) {
                                                flagDt = false;
                                                inxInsert = i;
                                                break;
                                            }
                                        }
                                        if (flagDt) inxInsert = len;
                                    } else {
                                        if (newDataGrid > this.setDataFrm(getRows[0].fdate)) inxInsert = 0;
                                        else inxInsert = 1
                                    }
                                }

                            let resDtTm =
                                 dt[0] +
                                 '-' + dt[1] +
                                 '-' + dt[2] +
                                 ' ' + tm[0] +
                                 ':' + tm[1] +
                                 ':' + tm[2] ;

                            this.dgPeriodEdit.datagrid(
                                'insertRow', { index: inxInsert,
                                                row: {
                                                changed: null,
                                                changer: null,
                                                created: null,
                                                creator: null,
                                                fdate: resDtTm,
                                                flagChange: 0,
                                                flagDel: 0,
                                                id: -1, //options.id
                                                imgLockId: 0,
                                                name: options.dt,
                                                objectId: this.StartParams.ObjectId,
                                                periodParamId: this.StartParams.PeriodParamId,
                                                recId: -1,
                                                sesId: this.StartParams.SesId,
                                                userId: res[0],
                                                val: options.id,
                                                view: ''
                                            }
                                });
                            let countRows = this.dgPeriodEdit.datagrid("getData").rows.length;
                            if ( countRows > 0) {
                                this.dgPeriodEdit.datagrid("selectRow", inxInsert);
                                //возвращаем значение по умолчанию
                                //this.PerioEditId = -1;
                                this.PerioEditIndex = inxInsert==0?0:inxInsert;
                            }
                        });
                }else{
                    this.ShowSlide("Добавление периодического реквизита",JSON.stringify(data));
                }
        });
    }

    /**
     * Обработка изменеия записи
     */
    btnChange_onClick() {
        if (this.dgPeriodEdit.datagrid("getRows").length == 0) return this.ShowWarning("Нет записей для изменения");
        let selData = this.dgPeriodEdit.datagrid("getSelected");
        //console.log(" selData = ", selData)
        if (selData == null) return this.ShowWarning("Выберите запись для изменения");
        let selections = this.dgPeriodEdit.datagrid('getSelections');
        // Выбрать можно только одну строку - поэтому selections[0]
        let index = this.dgPeriodEdit.datagrid('getRowIndex', selections[0]);
      $.when(this.LoadRight('PeriodEditChange')/*, this.getUserId()*/)
           .then((data/*, res*/)=>{
               if(data.length==0){
                   let getRows = this.dgPeriodEdit.datagrid("getRows");
                   let valueFrmEdt;
                   if(selData.val!=-1 && selData.val!='') valueFrmEdt = selData.val+ ' = ' + selData.name;
                   else valueFrmEdt = selData.name;

                   let form = new PeriodEditForm();
                   form.Show({
                       id: selData.id,
                       AddMode: false,
                       editMode: true,
                       refferModulPrdEdt: this.options.refferModulPrdEdt,
                       PeriodParamId:  this.StartParams.PeriodParamId,
                       text: "Редактирование записи",
                       dtDrd: selData.fdate,
                       valueFrmEdt: valueFrmEdt,
                       creator: selData.creator,
                       created: selData.created,
                       changer: selData.changer,
                       changed: selData.changed,
                       cntRws: 1
                   }, getRows, index, this.setDataFrm);
                   form.SetResultFunc(options => {
                                //обновить строку в гриде
                                 this.dgPeriodEdit.datagrid('updateRow', {
                                     index: index,
                                     row: {
                                         fdate: options.dateTime,
                                         name: options.dt,
                                         val: selData.val==''?'':options.id,//если пер. реквизиит не привязан к справочниук о val==''
                                         flagChange: 1,
                                     }
                                 });
                    });
               }
               else {
                   this.ShowSlide("Редактирование периодического реквизита",JSON.stringify(data));
               }
           });
    }
    /**
     * Удаление записи
     */

    btnDelete_onClick() {
        if (this.dgPeriodEdit.datagrid("getRows").length == 0) return this.ShowWarning("Нет записей на удаление");
        let selData = this.dgPeriodEdit.datagrid("getSelected");
        if (selData == null) return this.ShowWarning("Выберите запись для удаления");
        //index - row
        let index = this.dgPeriodEdit.datagrid("getRowIndex", selData);
        $.when(this.OpenDayCheck(selData.fdate))
            .then(fl=>{
                if(!fl) return this.ShowWarning("День не является открытым !");
                return $.when(this.LoadRight('PeriodEditChange'))
            })
            .then(data=>{
                //если день закрыт
                if (data == undefined) return 0;
                if(data.length==0) {
                    let del = selData.flagDel;
                    let header = "Удаление";
                    let action = "удалить";
                    if (del == 1) {
                        header = "Восстановить";
                        action = "восстановить";
                    }
               let txMssg = '&nbsp;&quot;<strong>'+this.options.periodParamName+'</strong>&quot;&nbsp';
               if(this.options.periodParamName==undefined) txMssg="";

                $.messager.confirm({
                    title: header,
                    msg: 'Вы действительно хотите ' + action + ' периодический реквизит<br /> '+txMssg + selData.name + '?',
                    fn: function (result) {
                        if (result) {
                            if(selData.id>0 && selData.recId>0){  //если данные  есть в таблице PeriodLock и запись не новая (recId!=-1)
                                this.sLoc.StateLockRecord("periodvalues",
                                    selData.recId, // selData.recId == periodvalues.id
                                    options=>{
                                        if (options.data.length > 0) return this.ShowWarning(options.data);

                                        if(del==1){//если вернуть проверить если такая дата
                                            let getRows = this.dgPeriodEdit.datagrid("getRows");
                                            let identicalData = false, i=0;
                                            getRows.forEach( v => { if(v.flagDel==0 && this.setDataFrm(v.fdate) == this.setDataFrm(selData.fdate) && index!=i) identicalData = true; i++;});
                                            if (identicalData) return this.ShowWarning("Нельзя вернуть выбранный периодический реквизит, так как с такой датой и временем есть другой периодический реквизит !");
                                        }
                                        if  (del == 0) this.btnDelete.linkbutton({'text':'Вернуть', 'iconCls': 'icon-undo'})
                                        else  this.btnDelete.linkbutton({'text':'Удалить', 'iconCls': 'icon-remove'})

                                        /*if(del==0){//если вернуть проверить если такая дата
                                            let identicalData = false;
                                            this.dgPeriodEdit.datagrid("getRows").forEach( v => { if(v.flagDel==0 && this.setDataFrm(v.fdate) == this.setDataFrm(selData.fdate)) identicalData = true; });
                                            return this.ShowWarning("Нельзя вернуть выбранный периодический реквизит, так как с такой датой и временем есть другой периодический реквизит !");
                                        }*/
                                        this.dgPeriodEdit.datagrid('updateRow', {
                                            index: index,
                                            row: {flagDel: del==0?1:0}
                                        });
                                    }
                                );
                            }
                            else {//данные только в GRIDE
                                if(del==1){//если вернуть проверить если такая дата
                                    let getRows = this.dgPeriodEdit.datagrid("getRows");
                                    let identicalData = false, i=0;
                                    getRows.forEach( v => { if(v.flagDel==0 && this.setDataFrm(v.fdate) == this.setDataFrm(selData.fdate) && index!=i) identicalData = true; i++;});
                                    if (identicalData) return this.ShowWarning("Нельзя вернуть выбранный периодический реквизит, так как с такой датой и временем есть другой периодический реквизит !");
                                }
                                if  (del == 0) this.btnDelete.linkbutton({'text':'Вернуть', 'iconCls': 'icon-undo'})
                                else  this.btnDelete.linkbutton({'text':'Удалить', 'iconCls': 'icon-remove'})


                                this.dgPeriodEdit.datagrid('updateRow', {
                                    index: index,
                                    row: {flagDel: del==0?1:0}
                                });
                            }
                        }
                    }.bind(this)
                });
            } else {
                    this.ShowSlide("Удаление периодического реквизита",JSON.stringify(data));
                 }
        });
    }

    /**
     * Продолжение процесса удаления записи
     * @param options
     */
    /*
    btnContinueDelete_onClick(options) {
        console.log("btnContinueDelete_onClick, options = ", options)
        if (options.data.length > 0) {
            this.ShowWarning(options.data);
        } else {
            $.ajax({
                method: "GET",
                url: this.GetUrl('/PeriodEdit/delete?id='+options.id),
                //data: {id: options.id},
                success: function (data) {
                    //console.log(" btnContinueDelete_onClick -> $.ajax - success, data = ", data)
                    if (data.length)
                        this.ShowWarning(data);
                    else
                        this.LoadDataFrGrd();
                }.bind(this),
                error: function (data) {
                    this.ShowErrorResponse(data.responseJSON);
                }.bind(this)
            });
        }

    }*/

    /**
     * Изменение текста на кнопке "Удалить"
     */
    btnDeleteChangeText(){
        if(this.dgPeriodEdit.datagrid("getRows").length != 0){
            let selData = this.dgPeriodEdit.datagrid("getSelected");
            if(selData !=null ){
                if(selData.flagDel==1){
                    this.btnDelete.linkbutton({iconCls:"icon-undo", text:"Вернуть"});
                }
                else {
                    this.btnDelete.linkbutton({iconCls:"icon-remove", text:"Удалить"});
                }
            }
            else {
                this.btnDelete.linkbutton({iconCls:"icon-remove", text:"Удалить"});
            }
        }
        else {
            this.btnDelete.linkbutton({iconCls:"icon-remove", text:"Удалить"});
        }
    }

    /**
     * Обработка выбора записи
     */
    btnOk_onClick() {
        flClsFrm = true;
        if (this.dgPeriodEdit.datagrid("getRows").length == 0) return this.ShowWarning("Нет записей для выбора");
        let mdl = this.dgPeriodEdit.datagrid('getData').rows;
        $.ajax({
            method: "POST",
            data: JSON.stringify(mdl),
            url: this.GetUrl('/PeriodEdit/Save'),
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if(this.ResultFunc != null && data[0]!==undefined) this.ResultFunc({id: data[0].toString()});
                return this.wPeriodEditList.window("close");
            }.bind(this),
            error: function (data) { this.ShowErrorResponse(data.responseJSON);}.bind(this)
        });
    }

    /**
     * Проверка права на редактирование периодического реквизита
     * @constructor
     */
    LoadRight(NameRight){//PeriodParamsView, PeriodEditChange
        return $.ajax({
                method: "get",
                url: this.GetUrl('/CoreUtils/GetActRights?TaskCode=PeriodEdit.dll&ActCode='+NameRight),
                success: function (data) {
                    if (data.length == 0) {
                        this.btnAdd.linkbutton({disabled: false});
                        this.btnChange.linkbutton({disabled: false});
                        this.btnDelete.linkbutton({disabled: false});
                        this.btnOk.linkbutton({disabled: false});
                        //this.editMode = true;
                    }
                }.bind(this),
                error: function (data) {
                    this.ShowErrorResponse(data.responseJSON);
                }.bind(this)
            });
        }

    /**
     * Удаляем при нажатти на Отмену из "временной" таблицы ImgLock
      * @returns {jQuery|{getAllResponseHeaders: (function(): *), abort: (function(*=): jqXHR), setRequestHeader: (function(*=, *): jqXHR), readyState: number, getResponseHeader: (function(*): *), overrideMimeType: (function(*): jqXHR), statusCode: (function(*=): jqXHR)}|$|(function(*=, *=, *=, *=): void)|(function(*=, *=): *)|(function(*=, *=): *)|*}
     * @constructor
     */
     DeleteFrmImgLock(){
        return $.get({url: this.GetUrl('/PeriodEdit/deleteImgLock?SesId='+this.StartParams.SesId+'&ObjectId='+this.StartParams.ObjectId+'&PeriodParamId='+this.StartParams.PeriodParamId)});
     }

    /**
     * Получить периодические реквизиты
     * @param PrdPrmId
     * @constructor
     */
    GetPeriodParam( PrdPrmId ){
        $.ajax({
            method: "GET",
            url: this.GetUrl('/PeriodEdit/getPeriodParam?PrdPrmId='+PrdPrmId),
            dataType: 'json',
            success: data => {
                if(!isEmpty(data.refferModul)) {
                    this.options.refferModulPrdEdt = data.refferModul;
                    this.options.periodParamName = data.name;
                    $('#wPeriodEditPrdVls_Module_PeriodEdit').append(' ' + '\"'+data.name+'\"');
                }
                else{
                    $('#wPeriodEditPrdVls_Module_PeriodEdit').append(' не привязан в к справочнику ');
                }
            },
            /*error: (data) => {
                //console.log("GetPeriodParam ->ajax->error, data:", data);
            }*/
        });
    }

    /**
     * Проверка дня (даты) на открытость
     * @constructor
     */
    OpenDayCheck(chckDay){
        return $.get({ url: this.GetUrl('/PeriodEdit/OpenDayCheck?chckDay='+chckDay)});
    }

    /**
     * Перевод даты в формат YYYYMMDD
     * @param a - дата в формате DDMMYYYY HH:MM:SS
     * @returns {string}
     */
    setDataFrm(a){
        return a.substr(6,4)+a.substr(3,2)+a.substr(0,2)+a.substr(11,8);
    }
}

function isEmpty(s) { return (!s || s.length===0) }
export function StartModalModul(StartParams, ResultFunc) {
    try {
        for (let prp in StartParams)
            if (!isEmpty(StartParams[prp]))
                StartParams[prp] = StartParams[prp].toString().trim();

        if (isEmpty(StartParams.SesId)) return $.messager.alert("Ошибка", "Параметр \"SesId\" не передан или имеет неверный формат!", "error");
        if (isEmpty(StartParams.ObjectId)) return  $.messager.alert("Ошибка", "Параметр \"ObjectId\" не передан или имеет неверный формат!", "error");
        if (isEmpty(StartParams.RecId)) return  $.messager.alert("Ошибка", "Параметр \"RecId\" не передан или имеет неверный формат!", "error");
        if (isEmpty(StartParams.PeriodParamId)) return  $.messager.alert("Ошибка", "Параметр \"PeriodParamId\" не передан или имеет неверный формат!", "error");
        if (isEmpty(StartParams.PeriodParamData) || typeof StartParams.PeriodParamData === "undefined" ) StartParams.PeriodParamData='';

        let form = new PeriodEdit(StartParams);
        form.SetResultFunc(ResultFunc);
        form.Start();
    }
    catch (e) {
        $.messager.alert("Ошибка !", " Ошибка при запуске модуля! "+e.message, "error");
    }
} 