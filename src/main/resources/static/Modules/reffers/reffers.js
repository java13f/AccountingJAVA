import {FormView} from "../Core/FormView.js";
import {reffersForm} from "./reffersForm.js";
/*
Начальный параметр
 refferEditCode - код справочника, который нужно показать (deps)

глобальные переменные
   this.options.returnId - id записи, на которую нужно установить курсор после загрузки данных в dg. Default -1 - оставить как есть
   this.options.rightChange=false;   права на изменение - проверяются и устанавливаются в переменную
                                     при Удалении и Обновлении. Права на просмотр, определяются контроллером.
                                     Передается в reffersForm.

*/

/**
 * Функция запуска модуля на вкладке
 * @param Id
 * @constructor
 */
export function StartNestedModul(Id) {
    let modul = new reffers("nested_", "");    // Создается экземпляр главного класса
    modul.Start(Id);                                          // Вызывается метод Start главного класса
}

/**
 * Функция запуска модуля модально
 * @param StartParams
 * @param ResultFunc
 * @constructor
 */
export function StartModalModul(StartParams, ResultFunc) {
    let id = "wreffers_Module_reffers";                     //идентификатор диалогового окна
    CreateModalWindow(id, "Работа с несколькими справочниками") //функция создания диалогового окна для модуля
    // $('#'+id).window('resize',{width: 647, height: 400});
    // $('#'+id).window('center');

    let form = new reffers("modal_", StartParams);
    form.SetResultFunc(ResultFunc);
    form.Start(id);
}
class reffers extends FormView {
    constructor(prefix, StartParams) {
        super();
        this.StartParams = StartParams;
        this.options ={AddMode: true, editMode: false};
        this.prefix = prefix;      // префикс идентификатора
        this.sLoc = new LibLockService(300000);//Создадим объект работы с блокировками
        this.options.rightChange=false;
        this.refferId=-1;
    }
    Start(Id) {
        this.ModulId = Id;         // Запоминаем Id модуля (MainApp_TaskTab_Problems)
        LoadForm("#" + Id, this.GetUrl("/reffers/reffersHtml?prefix=" + this.prefix),
            this.InitFunc.bind(this));
    }
    InitFunc() {
        this.InitComponents(this.ModulId, this.prefix);// Инициал.компонентов, имеющих Id

        // Комбобокс - выбор справочника
        this.cbReffers.combobox({onChange: this.cbReffers_onChange.bind(this)});
        this.cbReffers.combobox({onSelect: (record)=> {
            this.cbReffers.curId = record.id;
            this.cbReffers.curCode = record.name.substring(0, record.name.indexOf(" = "));
            this.cbReffers.curName = record.name.substring(record.name.indexOf(" = ") + 3);
            this.cbReffers.curCodeLen = record.codeLen;
            this.cbReffers.curIsCodeDigit = record.isCodeDigit;
        }
        });

        // Г Р И Д
        AddKeyboardNavigationForGrid(this.dgReffers);
        this.dgReffers.datagrid({
            loadFilter:this.LoadFilter.bind(this), //LoadFilter - функция, которая находится в родительском классе. Она занимется тем что экранирует теги HTML
            onLoadError:   (data)=>{
                this.ShowErrorResponse(data.responseJSON);
                let rowCount = this.dgReffers.datagrid('getData').total;  // отчистка грида
                for (let i = 0; i < rowCount; i++) this.dgReffers.datagrid('deleteRow', 0);
            },
            rowStyler: (index, row)=>{ if (row.del == 1) return "background-color:gray;";},
            onLoadSuccess: ()=>{
                if(this.options.returnId!=-1)   this.dgReffers.datagrid("selectRecord", this.options.returnId);    // Установка на нужную запись
                this.options.returnId=-1;
                this.setIconBtnDelete();
            },
            onSelect:(index,row)=>{ this.setIconBtnDelete(); }
        });

        // Кнопки Добавить Изменить, Удалить, Oбновить, птичка Показ удаленных
        this.btnAdd.linkbutton({onClick: this.btnAdd_onClick.bind(this)});
        this.btnEdit.linkbutton({onClick: this.btnEdit_onClick.bind(this)});
        this.btnDelete.linkbutton({onClick: this.btnDelete_onClick.bind(this)});
        this.btnUpdate.linkbutton({onClick: this.btnUpdate_onClick.bind(this)});
        this.chShowDel.checkbox({onChange: this.btnUpdate_onClick.bind(this)});

        // Кнопки Ок и Отмена
        this.pOkCancel.css("visibility", "hidden");   // Видимость Ок и Отмена и доступность кнопок Добавить Изменить Удалить
        if (this.prefix == "modal_") {
            $("#" + this.ModulId).window('window').attr('tabindex', 1);
            this.btnAdd.linkbutton   ({disabled:true});
            this.btnEdit.linkbutton  ({disabled:true});
            this.btnDelete.linkbutton({disabled:true});
            this.pOkCancel.css("visibility", "visible");
            this.InitCloseEvents($("#" + this.ModulId), true);
        }
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});//зададим функцию обработки события кнопки onClick
        this.btnCancel.linkbutton({onClick: this.btnCancel_onClick.bind(this)});//зададим функцию обработки события кнопки onClick

        //-----------------------------------------------------------
        // Грузим данные в комбобокс выбора справочников
        $.ajax({
            method: "get",
            url: this.GetUrl('/reffers/reffersAll'),
            success: function (data) {
                this.cbReffers.combobox({    // грузим Combobox
                    valueField: 'id',
                    textField: 'name',
                    data: data
                });

                if(this.StartParams.refferEditCode==null) {
                    this.cbReffers.combobox("setValue", data[0].id);  // устанавливем первую запись в выпадающем списке
                    this.cbReffers.curCodeLen=data[0].codeLen;        // запоминаем настройки справочника
                    this.cbReffers.curIsCodeDigit=data[0].isCodeDigit;
                    return;
                }
                for(let i=0;i<this.cbReffers.combobox('getData').length; i++){ // ищем запись с кодом this.StartParams.refferEditCode
                    if(this.StartParams.refferEditCode.toLowerCase()==data[i].name.substring(0,data[i].name.indexOf(' = ')).toLowerCase()) {
                        this.cbReffers.combobox({disabled:true});
                        this.cbReffers.combobox("setValue", data[i].id);
                        this.cbReffers.curCodeLen=data[i].codeLen;        // запоминаем настройки справочника
                        this.cbReffers.curIsCodeDigit=data[i].isCodeDigit;
                        return;
                    }
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Изменился пункт в выпадающем списке
     * @param newValue
     * @param oldValue
     */
    cbReffers_onChange(newValue,oldValue){
        this.paramId=newValue;
        let refferCode=this.cbReffers.combobox("getText");
        refferCode=refferCode.substring(0,refferCode.indexOf(" = "));

       // проверка прав для справочника refferCode
        this.btnUpdate_onClick();
    }

    /**
     * Иконка на кнопке Удалить
     */
    setIconBtnDelete(){
        this.btnDelete.linkbutton({iconCls:"icon-remove", text:"Удалить"});
        if(this.dgReffers.datagrid("getRows").length != 0){
            let selData = this.dgReffers.datagrid("getSelected");
            if(selData !=null )    if(selData.del==1)   this.btnDelete.linkbutton({iconCls: "icon-undo", text: "Вернуть"});
        }
    }
    /**
     *  Кнопка Добавить
     */
    btnAdd_onClick(){
        let form = new reffersForm();
        //form.SetResultFunc(this.btnUpdate_onClick());   // функция по закрытию окна
        form.SetCloseWindowFunction((options)=> {
            if (options != null && options.returnId!=null) {
                this.options.returnId=options.returnId;  // взводим поиск нужной записи
                this.btnUpdate_onClick();
            }
        });
        form.Start({
            ownerId:-1,
            refferId          :this.cbReffers.curId,
            refferCode        :this.cbReffers.curCode,
            refferName        :this.cbReffers.curName,
            refferCodeLen     : this.cbReffers.curCodeLen,
            refferIsCodeDigit : this.cbReffers.curIsCodeDigit,
            returnId          : null,
            rightChange       : this.options.rightChange
    });
    }
    /**
     * Кнопка Редактировать
     */
    btnEdit_onClick(){
        let row = this.dgReffers.datagrid("getSelected");
        if (this.dgReffers.datagrid("getRowIndex",row)==-1)     { this.ShowWarning("Выберите запись для изменения"); return false; }

        this.sLoc.LockRecord("reffers", row.id, (options)=>{

            if(options.lockMessage.length!=0){  this.ShowSlide("Предупреждение", options.lockMessage);  options.editMode = false;  }
            else                             {  if(options.editMode)        options.lockState = true;    }

            let form = new reffersForm();
            form.SetCloseWindowFunction((options)=> {
                if (options != null) {
                    if (options.returnId != null)   // обновление
                        this.btnUpdate_onClick();
                    if (options.lockState) {        // разблокировка
                        this.sLoc.FreeLockRecord("reffers", options.id);
                    }
                }
            });

            options.ownerId           =row.id;
            options.refferId          = this.cbReffers.curId;
            options.refferCode        = this.cbReffers.curCode;
            options.refferName        = this.cbReffers.curName;
            options.refferCodeLen     = this.cbReffers.curCodeLen;
            options.refferIsCodeDigit = this.cbReffers.curIsCodeDigit;
            options.returnId          = null;                           // для однообразности с режимом добавления
            options.rightChange       = this.options.rightChange;

            form.Start(options);
        });
    }

    /**
     * Кнопка Удалить
     */
    btnDelete_onClick(){
        let row = this.dgReffers.datagrid("getSelected");
        if (this.dgReffers.datagrid("getRowIndex",row)==-1)     { this.ShowWarning("Выберите запись для удаления"); return false; }

        // проверим право на изменение записи
        this.options.rightChange=false;
        $.ajax({
            method: "get",
            url: this.GetUrl('/CoreUtils/GetActRights?TaskCode=Reffers.dll&ActCode=Reffers.' + this.cbReffers.curCode + '.Change'),
            success: function (data) {
                this.options.rightChange = false;
                if (data.length != 0) {
                    this.ShowError(data);
                    return;
                }   // Сообщение
                this.options.rightChange = true;

                $.messager.confirm("", "Вы действительно хотите " + this.btnDelete[0].text + " выделенную запись " + row.name + "?", (result) => {
                    if (result) {
                        this.sLoc.StateLockRecord("reffers", row.id, (options) => {
                            if (options.data.length > 0) {
                                this.ShowWarning(options.data);
                                return;
                            }
                            $.ajax({
                                method: "POST", url: this.GetUrl('/reffers/delete'),  data: {id: row.id},
                                success: function (data) {
                                    if (data.length) {
                                        this.ShowWarning(data);
                                        return;
                                    }  // сообщение

                                    this.btnUpdate_onClick();

                                }.bind(this),
                                error: function (data) { this.ShowErrorResponse(data.responseJSON); }.bind(this)
                            });

                        });
                    }
                });
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });

    }

    /**
     *  Кнопка Обновить
     */
    btnUpdate_onClick() {
        let showDel = this.chShowDel.checkbox("options").checked;
        this.dgReffers.datagrid({url: this.GetUrl("/reffers/reffersList?paramId=" + this.paramId + "&showDel=" + showDel)})

        // Вычислим в переменную this.options.rightChange право на изменение (оно понадобится потом)
        this.options.rightChange=false;
        $.ajax({
            method:"get",
            url: this.GetUrl('/CoreUtils/GetActRights?TaskCode=Reffers.dll&ActCode=Reffers.'+this.cbReffers.curCode+'.Change'),
            success: function(data){
                if(data.length == 0) this.options.rightChange=true;
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    /**
     * Кнопка Ок
     */
    btnOk_onClick(){
        if (this.btnOk[0].disabled) return;

        if(this.dgReffers.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для выбора");
            return false;
        }
        let selData = this.dgReffers.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись");
            return false;
        }
        if(this.ResultFunc!=null) {
            this.ResultFunc({id: selData.id.toString()});
        }
        this.wreffers.window("close");
        return false;
    }
    /**
     * Кнопка Cancel
     */
    btnCancel_onClick(){
        this.wreffers.window("close");
    }
}