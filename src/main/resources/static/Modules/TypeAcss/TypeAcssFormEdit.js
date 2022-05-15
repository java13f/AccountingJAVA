import {FormView} from "../Core/FormView.js";


export class TypeAcssFormEdit extends FormView{
    constructor() {
        super();
    }

    /**
     * Показать html-окно добавления/редактирования записей
     * @param options
     * @constructor
     */
    Show(options){
        //console.log("TypeAcssFormEdit, Show, options = ", options);
        this.options = options;
        LoadForm('#ModalWindows', this.GetUrl('/TypeAcss/TypeAcssFormEdit'),
            this.InitFunc.bind(this));
    }
    InitFunc(){
        //console.log("TypeAcss InitFunc this  =", this);
        this.InitComponents('wTypeAcssFormEdit_Module_TypeAcss','');
        this.InitCloseEvents(this.wTypeAcssFormEdit);
        if(this.options.AddMode){
              this.pbEditMode.attr("class", "icon-addmode");
              this.wTypeAcssFormEdit.window({title: "Добавление записи"});
              this.lAction.html("Введите данные для добавления новой записи");
              //this.txCode.textbox("setText", data.code);
              this.txId.textbox("setText", "-1");
              this.LoadGrpAndNm(false);
        }else{
              this.pbEditMode.attr("class", "icon-editmode");
              this.wTypeAcssFormEdit.window({title: "Редактирование записи"});
              this.lAction.html("Введите данные для редактирования текущей записи");
              this.txId.textbox("setText", this.options.id);
              //this.cbCodeTypeAcss.combobox({onSelect: this.cbCodeTypeAcss_onSelect.bind(this)});
              //this.cbNameTypeAcss.combobox({onSelect: this.cbNameTypeAcss_onSelect.bind(this)});
              this.LoadGrpAndNm(true);
              if(!this.options.editMode){
                  this.cbCodeTypeAcss.combobox({disabled: true});
                  this.cbNameTypeAcss.combobox({disabled: true});
                  this.btnOk.linkbutton({disabled: true});
              }
          }
        //if(this.options.editMode) this.btnOk.linkbutton({disabled: false});
        //else this.btnOk.linkbutton({disabled: true});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({onClick: () => this.wTypeAcssFormEdit.window("close")});
    }
    /**
     * Получить название группы и вида объектов
     * @returns {*}
     * @constructor
     */
    LoadGrpAndNm(flag){
        $.when(
            $.ajax({url: this.GetUrl('/TypeAcss/LoadGroup')}),
            $.ajax({url: this.GetUrl('/TypeAcss/LoadName')}),
            flag?$.ajax({url: this.GetUrl('/TypeAcss/get?id='+this.options.id)}):0
        ).then((data1, data2, data3)=>{
            this.cbCodeTypeAcss.combobox({
                        data: data1[0],
                        valueField: 'id',
                        textField: 'idName',
                        onLoadSuccess:()=>{
                            if((this.options.editMode || (!this.options.editMode && !this.options.AddMode)) && data1[0].length>0)
                                if(this.options.group_id>0)
                                    this.cbCodeTypeAcss.combobox('select', this.options.group_id)
                                else//Все объекты
                                    this.cbCodeTypeAcss.combobox('select', -1)
                        }
                    });
            this.cbNameTypeAcss.combobox({
                        data: data2[0],
                        valueField: 'id',
                        textField: 'idName',
                        onLoadSuccess:()=>{
                            if((this.options.editMode || (!this.options.editMode && !this.options.AddMode))  && data2[0].length>0)
                                if(this.options.obj_type_id>0)
                                    this.cbNameTypeAcss.combobox('select', this.options.obj_type_id)
                                else//Все объекты
                                    this.cbNameTypeAcss.combobox('select', -1)
                        }
                    });
            if(flag) {
                this.txCreator.textbox("setText", data3[0].creator);
                this.txCreated.textbox("setText", data3[0].created);
                this.txChanger.textbox("setText", data3[0].changer);
                this.txChanged.textbox("setText", data3[0].changed);
            }
        }).fail((err)=>{
             this.ShowWarning("Ошибка при получении данных "+JSON.stringify(err.responseJSON));
        });
    }

    /**
     * Обработка нажатия на кнопку "OK"
     */
    btnOk_onClick(){
        console.log(" btnOk_onClick ")
        let id = this.txId.textbox("getText");
        let group = this.cbCodeTypeAcss.combobox("getValue");
        let name = this.cbNameTypeAcss.combobox("getValue");
        if(group.length == 0) return this.ShowToolTip('#cbCodeTypeAcss_Module_TypeAcss_TypeAcssFormEdit + span', "Поле \"Код не заполнено\"", {delay: 3500, position: 'top'});
        if(name.length == 0) return this.ShowToolTip('#cbNameTypeAcss_Module_TypeAcss_TypeAcssFormEdit + span', "Поле \"Наименование не заполнено\"", {delay: 3500});
        //let obj = {id: id, groupId: group, objTypeId: name};
        this.save({id: id, group_id: group, obj_type_id: name});
    }

/*    cbCodeTypeAcss_onSelect(items){
        console.log(" cbCodeTypeAcss_onSelect, items = ", items);
        //return 0;
    }

    cbNameTypeAcss_onSelect(){
        return 0;
    }*/

    /**
     * Сохранение доступа к объектам в зависимости от их типов
     * @param obj
     */
    save(obj) {
        //console.log("save obj = ", obj)
        return $.ajax({
            method: 'POST',
            data: JSON.stringify(obj),
            contentType: "application/json; charset=utf-8",
            url: this.GetUrl('/TypeAcss/save'),
            success: function (data) {
                if(this.ResultFunc(data) !=null)
                    this.ResultFunc(data);
                this.wTypeAcssFormEdit.window("close");
            }.bind(this),
            error: function (data) {
                this.ShowWarning(JSON.stringify(data.responseJSON))
            }.bind(this)
        });
    }

}