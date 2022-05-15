import {FormView} from "../Core/FormView.js";
import {ProblemsFormEdit} from "./ProblemsFormEdit.js";


/**
 * Основной класс модуля
 */
class Problems extends FormView {
    /**
     * Конструктор
     * @param prefix - приставка для каждого id.
     * @param StartParams - стартовые параметры в формте JSON
     */
    constructor(prefix, StartParams) {
        super();//вызов конструктора у родительского класса
        this.ProblemsId = -1; //Для последней добавленной/измененной записи
        this.ProblemsIndex = 0; //Позиция курсора. Применяеться для восстановления позиции курсора при обновлении записи
        this.prefix = prefix; //Приставка для идентификаторов
        this.StartParams = StartParams; //Стартовые параметры в формате JSON
        this.sLoc = new LibLockService(300000);//Создадим объект работы с блокировками

    }

    /**
     * Функция загузки формы
     * @param id - элемента HTML, в который будет загружена разметка частичного представления
     * @constructor
     */
    Start(id) {
        this.ModuleId = id;
        //Загружаем макет формы и выполняем функции InitFunc в случае успехя
        LoadForm("#" + this.ModuleId, this.GetUrl("/Problems/ProblemsFormList?prefix=" + this.prefix), this.InitFunc.bind(this));
    }


    InitFunc() {
        if($("link[href='css/imgs/problem/problem.css']").length==0) {
            let elem = document.createElement('link');
            elem.rel = 'stylesheet'; elem.type = 'text/css'; elem.href = 'css/imgs/problem/problem.css';
            document.head.appendChild(elem);
        }
        //Автоматическое получение идентификаторов формы
        this.InitComponents(this.ModuleId, this.prefix);
        //Добавляем в датагрид возможность навигации с помощью стрлочек
        AddKeyboardNavigationForGrid(this.dgProblems);

        this.dgProblems.datagrid({
            onLoadError: (data) => {
                this.ShowErrorResponse(data.responseJSON);
            },
            rowStyler: this.dgProblems_rowStyler.bind(this),
            onLoadSuccess: this.dgProblems_onLoadSuccess.bind(this),
            onSelect: this.btnDeleteChangeText.bind(this)
        });//Задаём url - датагриду для загрузки данных
        this.btnAdd.linkbutton({onClick: this.btnAdd_onClick.bind(this)});
        this.btnChange.linkbutton({onClick: this.btnChange_onClick.bind(this)});
        this.btnDelete.linkbutton({onClick: this.btnDelete_onClick.bind(this)});
        this.cbShowDel.checkbox({onChange: this.btnUpdate_onClick.bind(this)});

        this.btnUpdate.linkbutton({onClick: this.btnUpdate_onClick.bind(this)});

        this.btnUpdate_onClick();
        this.LoadRights();

       if(this.prefix == "modal_") {
           this.pOkCancel.css("visibility", "visible");
           this.wProblems = $("#" + this.ModuleId);
           this.InitCloseEvents(this.wProblems, false);
           this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
           this.btnCancel.linkbutton({
               onClick: function () {
                   this.wProblems.window("close");
               }.bind(this)
           });
       }
    }

    /**
     * Обработка события перерисовки грида (подсветка удалённых записей)
     * @param index
     * @param row
     * @returns {string}
     */
    dgProblems_rowStyler(index, row){
        if (row.del == 1) return "background-color:gray;";
    }

    /**
     * Обработка окончания загрузки списка кодов территорий
     * @param data
     */
    dgProblems_onLoadSuccess(data) {
        if (data.total > 0) {//в поле total хранится общее количество строк в гриде
            if (this.ProblemsId != -1) {
                this.dgProblems.datagrid("selectRecord", this.ProblemsId);
                //если сохранённы идентификатор отличается от значения по кмолчанию, то заставляем грид установить курсор на запись с данным идентификатором
            } else {//иначе устанавливаем курсор согласно сохранённому положению курсору
                if (this.ProblemsIndex >= 0 && this.ProblemsId < data.total) {
                    this.dgProblems.datagrid("selectRow", this.ProblemsIndex);
                } else if (data.total > 0) {
                    this.dgProblems.datagrid("selectRow", data.total - 1);
                }
            }
            //возвращаем значение по умолчанию
            this.ProblemsId = -1;
            this.ProblemsIndex = 0;
        }
        this.btnDeleteChangeText();
    }

    /**
     * Обновление списка кодов территорий
     */
    btnUpdate_onClick() {
        //получаем выбранную запись
        let row = this.dgProblems.datagrid("getSelected");

        if (row != null) {
            //получаем индекс выбранной записи
            this.ProblemsIndex = this.dgProblems.datagrid("getRowIndex", row);

            if (this.ProblemsIndex < 0) {
                this.ProblemsIndex = 0
            }
        }
        let showDel = this.cbShowDel.checkbox("options").checked ? "true" : "false";
        let prm;
        if(typeof this.StartParams.obj_type_id === 'undefined' ) prm = "-1";
        else prm = this.StartParams.obj_type_id
        this.dgProblems.datagrid({url: this.GetUrl("/Problems/list?showDel=" + showDel+"&obj_type_id=" + prm)});
    }

    /**
     * Проверка прав
     * @constructor
     */
    LoadRights() {
        $.ajax({
            method: "get",
            url: this.GetUrl('/CoreUtils/GetActRights?TaskCode=Problems.dll&ActCode=ProblemsChange'),
            success: function (data) {
                if (data.length == 0) {
                    this.btnAdd.linkbutton({disabled: false});
                    this.btnChange.linkbutton({disabled: false});
                    this.btnDelete.linkbutton({disabled: false});
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }

    btnAdd_onClick() {
        let form = new ProblemsFormEdit();
        form.SetResultFunc((RecId) => {
            this.ProblemsId = RecId;
            this.btnUpdate_onClick();
        });
        form.Show({AddMode: true});//Показать форму
    }

    /**
     * Обработка изменеия записи
     */
    btnChange_onClick() {
        if (this.dgProblems.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для изменения");
            return false;
        }
        let selData = this.dgProblems.datagrid("getSelected");
        if (selData == null) {
            this.ShowWarning("Выберите запись для изменения");
            return false;
        }

        //let editMode = Keys.isKeyDown(Keys.VK_Z ) || Keys.isKeyDown(Keys.VK_OEM_PERIOD);
        //if (editMode) {
        //Блокируем запись в таблице( если она уже заблокированна - выводим сообщение)
            this.sLoc.LockRecord("Problems",
                selData.id,
                this.btnContinueChange_onClick.bind(this)
            );
        //}
      /*  else {
            this.btnContinueChange_onClick({
                id: selData.id,
                AddModel: false, //! нет в инструкции
                editMode: editMode,
                lockMessage: '',
                lockState: false
            });
        }*/
    }

    btnContinueChange_onClick(options) {
        if (options.lockMessage.length != 0) {
            this.ShowSlide("Предупреждение", options.lockMessage);
            options.editMode = false;
        } else {
            if (options.editMode)
                options.lockState = true;
        }

        let form = new ProblemsFormEdit();
        form.SetResultFunc((RecId) => {
            this.ProblemsId = RecId;
            this.btnUpdate_onClick();
        });
        form.SetCloseWindowFunction((options) => {
            if (options != null) {
                if (options.lockState) {
                    this.sLoc.FreeLockRecord("problems", options.id);
                }
            }
        });
        form.Show(options);
    }

    /**
     * Удаление записи
     */
    btnDelete_onClick() {
        if (this.dgProblems.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей на удаление");
            return false;
        }

        let selData = this.dgProblems.datagrid("getSelected");

        if (selData == null) {
            this.ShowWarning("Выберите запись для удаления");
            return false;
        }

        let del = selData.del;
        let header = "Удаление";
        let action = "удалить";
        if (del == 1) {
            header = "Восстановить";
            action = "восстановить";
        }

            $.messager.confirm({
            title: header,
            msg: 'Вы действительно хотите ' + action + ' выделенный код проблемы ' + selData.name + ' ?',
            fn: function (result) {
                if (result) {
                    this.sLoc.StateLockRecord("problems", selData.id,
                        this.btnContinueDelete_onClick.bind(this));
                }
            }.bind(this)
        });
    }
    /**
     * Продолжение процесса удаления записи
     * @param options
     */
    btnContinueDelete_onClick(options) {
        if (options.data.length > 0) {
            this.ShowWarning(options.data);
        } else {
            $.ajax({
                method: "POST",
                url: this.GetUrl('/Problems/delete'),
                data: {id: options.id},
                success: function (data) {
                    if (data.length)
                        this.ShowWarning(data);
                    else
                        this.btnUpdate_onClick();
                }.bind(this),
                error: function (data) {
                    this.ShowErrorResponse(data.responseJSON);
                }.bind(this)
            });
        }

    }

    /**
     * Изенение текста на кнопке "Удалить"
     */
    btnDeleteChangeText() {
        if (this.dgProblems.datagrid("getRows").length != 0) {
            let sDt = this.dgProblems.datagrid("getSelected");
            if (sDt != null) {
                if (sDt.del == 1) {
                    this.btnDelete.linkbutton({iconCls: "icon-undo", text: "Вернуть"});
                } else {
                    this.btnDelete.linkbutton({iconCls: "icon-remove", text: "Удалить"});
                }
            } else {
                this.btnDelete.linkbutton({iconCls: "icon-remove", text: "Удалить"});
            }
        } else {
            this.btnDelete.linkbutton({iconCls: "icon-remove", text: "Удалить"});
        }
    }

    /**
     * Обработка выбора записи
     */
    btnOk_onClick(){
        if (this.dgProblems.datagrid("getRows").length == 0){
            this.ShowWarning("Нет записей для выбоа");
            return false;
        }
        let selData = this.dgProblems.datagrid("getSelected");
        if(selData == null){
            this.ShowWarning('Выберите запись');
            return  false;
        }
        if(this.ResultFunc!=null){
            this.ResultFunc({id: selData.id.toString()});
        }
        this.wProblems.window("close");
        return false;

    }

}

/**
 * Функция встраиваемого запуска модуля
 * @param Id идентификатор
 * @constructor
 */

export function StartNestedModul(Id) {
    let form = new Problems("nested_", "");
    form.Start(Id);
}

/**
 * Вызов модулч в диалоговом окне
 * @param StartParams
 * @param ResultFunc
 * @constructor
 */
export function StartModalModul(StartParams, ResultFunc) {
    let id = "wProblems_Module_Problems_ProblemsFormList";//идентификатор диалогового окна
    CreateModalWindow(id, "Справочник кодов проблем")//функция создания диалогового окна для модуля
    let form = new Problems("modal_", StartParams);
    form.SetResultFunc(ResultFunc);
    form.Start(id);
}