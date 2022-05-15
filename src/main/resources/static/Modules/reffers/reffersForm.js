import {FormView} from "../Core/FormView.js";
import {reffersParamForm} from "./reffersParamForm.js";

/*
Исходные данные
            // системные
            this.options.AddMode=true/false;   признаки добавления /редактирования
            this.options.editMode=false/true; - флаг открытия записи this.options.ownerId на редактирование (имеет смысл при this.options.ownerId !=-1)
            this.options.lockState            - признак заблокирована/не заблокирована
            this. options.id                  - id заблокировонной записи

            // приложения
            this.options.rightChange       - право пользователя на изменение текущего справочника
            this.options.ownerId           - id владельца
            this.options.refferId          - id справочника в таблице refferparams
            this.options.refferCode        - code справочника в таблице refferparams
            this.options.refferName        - name справочника в таблице refferparams
            this.options.refferCodeLen     - длина кода
            this.options.refferIsCodeDigit - признак цифрового кода
            this.options.returnId=null     - id вставленной записи
            this.options.sesId             id сессии
*/
export class reffersForm extends FormView{
    constructor() {
        super();
    }
    Start(options){
        this.options = options; //JSON - объект с параметрами
        this.options.sesId=null;
        LoadForm("#ModalWindows",
            this.GetUrl("/reffers/refferForm"), this.InitFunc.bind(this));
    }
    InitFunc(){
        // let elem = document.createElement( 'link' );
        // elem.rel = 'stylesheet';
        // elem.type = 'text/css';
        // document.body.appendChild( elem );
        // elem.href = 'css/imgs/problems/problem.css';
        // Окно
        this.InitComponents("wReffersForm_Module_Reffers", "");
        this.InitCloseEvents(this.wReffersForm);
        this.wReffersForm.window('resize',{width: 800,height: 494});
        this.wReffersForm.window('center');
        this.wReffersForm[0].tag=this;    // Запоминаем котекст текущего объекта в объекте this.wReffersForm для того, что бы получить к нему доступ из:
        this.wReffersForm.window({onBeforeClose : this.wReffersForm_onBeforeClose});
        // Поля Ид Код Наименование


        // Г Р И Д
        AddKeyboardNavigationForGrid(this.dgReffersParams);
        this.dgReffersParams.datagrid({
            loadFilter:this.LoadFilter.bind(this),
            onSelect        : (index,row)=> {for(let i=0;i<this.dgReffersParams.datagrid('getData').total;i++) this.dgReffersParams.datagrid('endEdit', i);},
            onLoadError     :(data)      => {this.ShowErrorResponse(data.responseJSON); },
            onDblClickCell  : this.dgReffersParams_onDblClickCell.bind(this),
            //rowStyler: (index, row)=>{ if (row.del == 1) return "background-color:gray;";},
            onLoadSuccess: this.dgReffersParams_onLoadSuccess.bind(this)
        });

        // Кнопки Изменить, Ок, Отмена
        this.btnEdit.linkbutton   ({onClick: this.btnEdit_onClick.bind(this)});
        this.btnDelete.linkbutton ({onClick: this.btnDelete_onClick.bind(this)});
        this.btnView.linkbutton   ({onClick: this.btnView_onClick.bind(this)});
        this.btnOk.linkbutton     ({onClick: this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton ({onClick: this.btnCancel_onClick.bind(this)});

     // -----------------------------------------------
     //  Заполняем поля

        this.btnOk.linkbutton({disabled : true});                            // доступность Ок

        if((this.options.editMode == true || this.options.ownerId==-1 )  // доступность Ок по блокировке
         && this.options.rightChange == true)                                // доступность Ок по правам
            this.btnOk.linkbutton({disabled : false});

         if(this.options.rightChange == false)
            this.ShowSlide("Ошибка", "Нет прав на изменение cправочника "+this.options.refferCode+" = "+this.options.refferName);


        if(this.options.refferCodeLen==null || this.options.refferCodeLen==0){
            this.pCode.css("visibility", "hidden");
        }

        this.lbReffer.html(this.options.refferName);

        $.ajax({                                       //  Запрашиваем sesId
            method:"GET",
            url: this.GetUrl('/reffers/getSesId'),
            contentType: "application/json; charset=utf-8",
            success: function(data){
                this.options.sesId=data;
                                                                                   // Заполняем поля формы
                if(this.options.ownerId==-1) {                                     // Новая запись
                    this.lbAction.html("Введите данные для новой записи");
                    this.txId.textbox("setText","-1");
                }
                else {                                                             // Существующая запись
                    this.lbAction.html("Введите данные для редактирования записи");
                    $.ajax({                                       //  Запрашиваем поля
                        method:"GET",
                        url: this.GetUrl('/reffers/getOneReffer?id='+this.options.ownerId),
                        contentType: "application/json; charset=utf-8",
                        success: function(data){
                            this.txId.textbox("setText",data.id);
                            this.txCode.textbox("setText",data.code);
                            this.txName.textbox("setText",data.name);
                            this.txCreator.textbox("setText",data.created+' '+data.creator);
                            if(data.changed!=null) this.txChanger.textbox("setText",data.changed+' '+data.changer);
                        }.bind(this),
                        error: function(data){
                            this.ShowErrorResponse(data.responseJSON);
                        }.bind(this)
                    });
                }
                                                                                    // запрашивем грид
                this.dgReffersParams.datagrid({url: this.GetUrl("/reffers/getReffersParams?refferCode="+this.options.refferCode+"&id="+this.options.ownerId+"&paramId="+this.options.refferId+"&sesId="+this.options.sesId )});
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Успешная загрузка грида
     */
    dgReffersParams_onLoadSuccess(data){
        for(let i=0; i<data.rows.length; i++){
            this.sesId=data.rows[i].guid;
            data.rows[i].imgView=(data.rows[i].imgFlag!=-1?"И":"");
            this.dgReffersParams.datagrid('beginEdit', i);  // вводим строку в режим редактирования  (для номального отображение значка И - глюк datagrid)
            this.dgReffersParams.datagrid('endEdit', i);  // выводим строку из режима редактирования

            if(data.rows[i].refferTable==null || data.rows[i].refferTable.length==0) continue;
            let val =data.rows[i].val==null || data.rows[i].val.length==0?"-1":data.rows[i].val;
            if(val==-1) {
                this.dgReffersParams.datagrid('updateRow',{index:i,row:{val:""}});
                return;
            }
            $.ajax({                                       //  Запрашиваем расшифровку
                method:"GET",
                url: this.GetUrl('/reffers/reffersOneParam?refferTable='+data.rows[i].refferTable+'&id='+val+"&ownerId="+this.options.ownerId+"&paramId="+this.options.refferId),
                contentType: "application/json; charset=utf-8",
                success: function(data2){
                    this.dgReffersParams.datagrid('updateRow',{index:i,row:{val:data2}})
                }.bind(this),
                error: function(data){
                    this.ShowErrorResponse(data.responseJSON);
                }.bind(this)
            });
        }
    }

        /**
         * Двойной клик на строке
         */
        dgReffersParams_onDblClickCell(index, field, value)
        {
            this.btnEdit_onClick();
        }

        /**
         * Кнопка Изменить
         */
        btnEdit_onClick() {
            let curRow = this.dgReffersParams.datagrid("getSelected");
            let curIndex = this.dgReffersParams.datagrid("getRowIndex", curRow);
            if (curIndex == -1) {  this.ShowWarning("Выберите запись для изменения"); return false; }

            for (let i = 0; i < this.dgReffersParams.datagrid('getData').total; i++) this.dgReffersParams.datagrid('endEdit', i); // Выводим весь грид из режима редактирования

            if (curRow.refferTable.length == 0) {                             // Это просто строка
                this.dgReffersParams.datagrid('beginEdit', curIndex);
                return;
            }

            let params = {};                                                   // Это справочник
            if (curRow.refferTable.toLowerCase() == "reffers") {
                params.refferEditCode = curRow.refferEditCode;
            }

            StartModalModulGlobal(curRow.codeJs,   params,
                ((data) => {
                    $.ajax({
                        method: "get",
                        url: this.GetUrl('/reffers/reffersOneParam?refferTable=' + curRow.refferTable + '&id=' + data.id + "&ownerId=" + this.options.ownerId + "&paramId=" + this.options.refferId),  // возвращает строку вида: 15 = значение
                        success: (data) => {
                            this.dgReffersParams.datagrid('updateRow', {index: curIndex, row: {val: data}});
                        }, // устанавливаем 15 = значение
                        error: (data) => {
                            this.ShowErrorResponse(data.responseJSON);
                        }
                    });
                })
            );

        }
    /**
     * Кнопка Отчистить
     */
    btnDelete_onClick() {
        let curRow = this.dgReffersParams.datagrid("getSelected");
        let curIndex = this.dgReffersParams.datagrid("getRowIndex", curRow);
        if (curIndex == -1) {
            this.ShowWarning("Выберите запись для отчистки.");
            return false;
        }

        this.dgReffersParams.datagrid('updateRow', {index: curIndex, row: {val: ""}});
    }

    /**
     * Работа с изображением
     */
    btnView_onClick(){
        let curRow = this.dgReffersParams.datagrid("getSelected");
        let curIndex = this.dgReffersParams.datagrid("getRowIndex", curRow);
        if (curIndex == -1) {  this.ShowWarning("Выберите запись для работы с изображением"); return false; }
        // запросить SesId, ObjectId для ListValues, ListParamId из curRow.paramCode
        // select uuid_generate_v4() as SesId, GetObject_Id('listvalues') ObjectId, id ListParamId from ListParams where paramCode='addr'
        $.ajax({
            method: "get",
            url: this.GetUrl('/reffers/imgParams?paramCode=' + curRow.paramCode+"&refferParamId="+this.options.refferId+"&sesId="+this.options.sesId+"&id="+curRow.id+"&recId="+curRow.recId), // id-id в таблице ListValues, recId-id и таблице ImgLock
            success: (data) => {
                this.options.sesId=!this.options.sesId? data.sesId: this.options.sesId;  //  запоминаем сессию если она пустая
                let imgParams={SesId: this.options.sesId , ObjectId:data.objectId, RecId:data.recId, ListParamId:data.listParamId, PeriodParamId:""};

                StartModalModulGlobal("ImgWork",   imgParams,
                    (data) => {
                        $.ajax({                          // Узаем удалена ли запись и рисуем знак И
                            method: "get",
                            url: this.GetUrl('/reffers/getImgLockDel?imgLockId='+ data.id),
                            success: (data) => {
                                curRow.imgView="И";
                                if(data==1) curRow.imgView="";
                                this.dgReffersParams.datagrid('beginEdit', curIndex);  // вводим строку в режим редактирования  (для номального отображение значка И - глюк datagrid)
                                this.dgReffersParams.datagrid('endEdit', curIndex);    // выводим строку из режима редактирования
                            },
                            error: (data) => {
                                this.ShowErrorResponse(data.responseJSON);
                            }
                        });
                }
                );
            }, // устанавливаем 15 = значение
            error: (data) => {
                this.ShowErrorResponse(data.responseJSON);
            }
        });
    }

     /**
     * Кнопка Ок
     */
    btnOk_onClick() {
         if (this.btnOk[0].disabled)
             btnCancel_onClick();


         for (let i = 0; i < this.dgReffersParams.datagrid('getData').total; i++) this.dgReffersParams.datagrid('endEdit', i);  // выводим весь грид из режима редактирования
         //-------------------------------------------
         // Проверим данные
         if (this.options.refferCodeLen != 0) {
             if (this.txCode.textbox("getText").length == 0) {
                 this.ShowError('Заполните поле "Код"');
                 return false;
             }
             if (this.txCode.textbox("getText").length != this.options.refferCodeLen) {
                 this.ShowError('Поле "Код" должно содержать ' + this.options.refferCodeLen + ' символов.');
                 return false;
             }
             if (this.options.refferIsCodeDigit == 1) {
                 if (isNaN(this.txCode.textbox("getText"))) {
                     this.ShowError('Поле "Код" должно содержать только цифры.');
                     return false;
                 }
             }
         }

         if (this.txName.textbox("getText").length == 0) {
             this.ShowError('Заполните поле "Наименование"');
             return false;
         }


         let data = this.dgReffersParams.datagrid("getData");
         let errMess = "";
         for (let i = 0; i < data.rows.length; i++) {
             if (data.rows[i].strict == 1)
                 if (data.rows[i].val == null || data.rows[i].val.length == 0)
                     errMess += 'Поле "' + data.rows[i].name + '" обязательно к заполнению. <br><br>';

             if (data.rows[i].imgView)  //  data.rows[i].imgView==true если data.rows[i].imgView не "" и не null
                 if (!data.rows[i].val) // !data.rows[i].val==true если data.rows[i].val "" или null
                     errMess += 'Поле "' + data.rows[i].name + '" не заполнено, хотя к нему привязано изображение. <br><br>';

         }
         if (errMess.length != 0) {
             this.ShowError(errMess);
             return false;
         }


         //-----------------------------------------------------
         //  Проверки пройдены

         let model = {                                    // готовим модель
             id: this.txId.textbox("getText"),
             code: this.txCode.textbox("getText"),
             name: this.txName.textbox("getText"),
             paramId: this.options.refferId,
             sesId: this.options.sesId,
             rows: []
         }
         for (let i = 0; i < data.rows.length; i++) {
             let val = data.rows[i].val == null ? "" : data.rows[i].val;
             model.rows[i] = {
                 id: data.rows[i].id,
                 val: data.rows[i].refferTable == null || data.rows[i].refferTable.length == 0 ? val : val.substring(0, val.indexOf(' = ')),
                 code: data.rows[i].refferTable,
                 ownerId: this.options.ownerId,
                 paramCode: data.rows[i].paramCode
             }
         }
         $.ajax({                                       //  Сохраняем
             method: "POST",
             data: JSON.stringify(model),
             url: this.GetUrl('/reffers/save'),
             contentType: "application/json; charset=utf-8",
             success: function (data) {
                 this.options.returnId = data;
                 this.wReffersForm.window("close");     // Закрываем
             }.bind(this),
             error: function (data) {
                 this.ShowErrorResponse(data.responseJSON);
             }.bind(this)
         });
     }

        /**
         * Кнопка Отмена
         */
    btnCancel_onClick() {
            this.wReffersForm.window("close");
        }
    wReffersForm_onBeforeClose(){
        // this - это окно wReffersForm
        // this.tag - это наш текущий объект (не знаю как называется)
         if (this.tag.options.sesId) {
              $.ajax({
                   method: "get",
                   url: this.tag.GetUrl('/reffers/delImgLock?sesId=' + this.tag.options.sesId),  // удаляет сессию из ImgLock
                   success: (data) => {return; },
                   error: (data) =>{ this.ShowErrorResponse(data.responseJSON);   }
              });
         }
    }
}
