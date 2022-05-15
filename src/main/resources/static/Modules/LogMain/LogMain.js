//Класс формы с часто используемыми функциями
import {FormView} from "../Core/FormView.js";
import {LogMainFormEdit} from "./LogMainFormEdit.js";


class LogMain extends FormView {
    /**
     * Конструктор
     * @param prefix - приставка для идентификаторов. Данная приставка добавится для каждого идентификатора
     * @param StartParams - стартовые параметры в формате JSON
     */
    constructor(prefix, StartParams) {
        super();
        this.prefix = prefix;

        this.LogMainIndex = 0;

        this.activeUser = ""; // Переменная для пользователя под которым зашли 'KAZNA\\Name'
        this.firstLoad = true;

        this.User = ""; //Пользователь выбранный в combobox
    }

    /**
     * Функция загрузки формы
     * @param id - идентификатор эелемента HTML, в который будет загружена разметка частичного представления
     * @constructor
     */
    Start(id) {
        this.ModuleId = id;
        //Загружаем макет формы и выполняем функции InitFunc в случае успеха
        LoadForm("#" + this.ModuleId,
            this.GetUrl("/LogMain/LogMainFormList"),
            this.InitFunc.bind(this));
    }



    /**
     * Функция инициализации пользовательского интерфейса
     * @constructor
     */
    InitFunc() {

        this.InitComponents(this.ModuleId, "");
        AddKeyboardNavigationForGrid(this.dgLogMain);

        this.dgLogMain.datagrid({
            loadFilter: this.LoadFilter.bind(this),
            onLoadError: (data) => {
                this.ShowErrorResponse(data.responseJSON);
            },
            rowStyler: this.dgLogMain_rowStyler.bind(this), //Обработка события перерисовки грида (подсветка удаленных записей)
            onLoadSuccess: this.dgLogMain_onLoadSuccess.bind(this),
            onDblClickRow: this.btnView_onClick.bind(this)
        });

        this.LoadRights();

        this.dtDateQuery.datebox({onChange: this.dtDateQuery_onChange.bind(this) });

        this.cbError.checkbox({onChange: this.btnUpdate_onClick.bind(this)}); //Обработка события изменения значения чекбокса
        this.cbSystemApp.checkbox({onChange: this.btnUpdate_onClick.bind(this)});
        this.cbUser.combobox({onSelect: this.cbUser_onSelect.bind(this)});

        this.txApp.textbox({onChange: this.btnUpdate_onClick.bind(this)}); //Обработаем событие изменения текста в фильтре по коду
        this.txSample.textbox({onChange: this.btnUpdate_onClick.bind(this)});

        this.btnUpdate.linkbutton({onClick: this.btnUpdate_onClick.bind(this)});

        this.btnUser.linkbutton({onClick: this.btnUser_onClick.bind(this)});
        this.btnClearUser.linkbutton({onClick: this.btnClearUser_onClick.bind(this)});
        this.btnApp.linkbutton({onClick: this.btnApp_onClick.bind(this)});
        this.btnClearApp.linkbutton({onClick: this.btnClearApp_onClick.bind(this)});
        this.btnSample.linkbutton({onClick: this.btnSample_onClick.bind(this)});
        this.btnClearSample.linkbutton({onClick: this.btnClearSample_onClick.bind(this)});
        //
        this.btnView.linkbutton({onClick:this.btnView_onClick.bind(this)});
        if (this.prefix == "modal_") {
            this.pOkCancel.css("visibility", "visible");
            this.wLogMain = $("#" + this.ModuleId);
            this.InitCloseEvents(this.wLogMain, false); //Инициализация закрытия формы по нажатию на клавишу "ESC"
            this.btnCancel.linkbutton({
                onClick: function () {
                    this.wLogMain.window("close")
                }.bind(this)
            });
            this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        }


        this.dtDateQuery.datebox({
            formatter: function (date) {
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                var d = date.getDate();
                return (d < 10 ? ('0' + d) : d) + '.'
                    + (m < 10 ? ('0' + m) : m) + '.'
                    + y.toString();
            },
            parser: function (s) {
                if (!s) return new Date();
                var ss = (s.split('.'));
                var y = parseInt(ss[2], 10);
                var m = parseInt(ss[1], 10);
                var d = parseInt(ss[0], 10);
                if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
                    return new Date(y, m - 1, d);
                } else {
                    return new Date();
                }
            }
        });

        this.getActiveUser();
        this.setCurrentDate();
        this.LoadUsers();
    }


    /**
     * Обработка окончания загрузки списка кодов территорий
     * @param data - информация о загруженных данных
     */
    dgLogMain_onLoadSuccess(data){
        if(this.LogMainIndex == 0) {
            this.dgLogMain.datagrid("selectRow", this.LogMainIndex);
        }
    }


    /**
     * Функция загрузки списка пользователей из таблицы translog
     * @constructor
     */
    LoadUsers(){
        //alert("LoadUsers()");
        $.ajax({
            method: "get",
            url: this.GetUrl('/LogMain/getUsers?date='+this.getDateForQuery()),
            success: function (data) {
                this.cbUser.combobox({
                    valueField: 'name',
                    textField: 'name',
                    data: data
                });

                if (this.firstLoad) {
                    //При первой загрузке становимся на пользователя под которым вошли
                    this.firstLoad = false;

                    for (let iUser=0; iUser < data.length; iUser++){
                        let user = data[iUser];

                        if (user.name == this.activeUser){
                            this.cbUser.combobox("setValue", this.activeUser);
                        }
                    }
                }
                else {
                    for (let iUser=0; iUser < data.length; iUser++){
                        let user = data[iUser];
                        if (user.name == this.User){
                            this.cbUser.combobox("setValue", this.User);
                        }
                    }
                }

                this.btnUpdate_onClick();

            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }



    /**
     * Кнопка обновления списка логов
     */
    btnUpdate_onClick(){
        let row = this.dgLogMain.datagrid("getSelected");
        if(row != null){
            this.LogMainIndex = this.dgLogMain.datagrid("getRowIndex", row);
            if(this.LogMainIndex < 0) { this.LogMainIndex = 0; }
        }

        let date = this.getDateForQuery(); //Получаем значение фильтра: Дата
        date = encodeURIComponent(date);

        let onlyError = this.cbError.checkbox("options").checked?"true":"false"; //Получаем значение флага: Только ошибки

        let app = this.txApp.textbox("getText"); //Получаем значение фильтра: Приложение
        app = encodeURIComponent(app);

        let user = this.User;
        user = encodeURIComponent(user);

        let sample = this.txSample.textbox("getText"); //Получаем значение фильтра: Образец
        sample = encodeURIComponent(sample);

        let systemApp = this.cbSystemApp.checkbox("options").checked?"true":"false";

        //Загружаем список логов
        this.dgLogMain.datagrid({url: this.GetUrl("/LogMain/list?date="+date+"&onlyError="+onlyError+"&user="+user+"&app="+app+"&sample="+sample+"&systemApp="+systemApp)});
    }


    /**
     * Обработчик события при выборе пользователя
     * @param record объект с выбранным пользователем
     */
    cbUser_onSelect(record){
        this.User = record.name;

        this.btnUpdate_onClick();
    }


    /**
     * Получение пользователя под которым вошли
     */
    getActiveUser(){
        $.ajax({
           method: "get",
           url: this.GetUrl('/LogMain/getActiveUser'),
           success: function (data) {
                this.activeUser = data;
           }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }


    /**
     * Очистка выбранного пользователя
     */
    btnClearUser_onClick(){
        this.cbUser.combobox("setValue", "");
        this.User = "";

        this.btnUpdate_onClick();
    }

    /**
     * Выбор пользователя из датагрида
     */
    btnUser_onClick(){
        if (this.dgLogMain.datagrid("getRows").length == 0){
            this.ShowWarning("Нет записей для выбора");
            return false;
        }

        let selData = this.dgLogMain.datagrid("getSelected");
        if (selData == null){
            this.ShowWarning("Выберите запись");
            return false;
        }
        this.cbUser.combobox("setValue", selData.userName);

        this.btnUpdate_onClick();
    }


    /**
     * Очистка поля Приложение
     */
    btnClearApp_onClick(){
        this.txApp.textbox("setValue", "");

        this.btnUpdate_onClick();
    }

    /**
     * Выбор приложения из датагрида
     */
    btnApp_onClick(){
        if (this.dgLogMain.datagrid("getRows").length == 0){
            this.ShowWarning("Нет записей для выбора");
            return false;
        }

        let selData = this.dgLogMain.datagrid("getSelected");
        if (selData == null){
            this.ShowWarning("Выберите запись");
            return false;
        }
        this.txApp.textbox("setText", selData.appName);

        this.btnUpdate_onClick();
    }


    /**
     * Выбор Образца из датагрид
     */
    btnSample_onClick(){
        if (this.dgLogMain.datagrid("getRows").length == 0){
            this.ShowWarning("Нет записей для выбора");
            return false;
        }

        let selData = this.dgLogMain.datagrid("getSelected");
        if (selData == null){
            this.ShowWarning("Выберите запись");
            return false;
        }

        let pttrn = selData.sql;
        if (pttrn.length > 20)
        {
            pttrn = pttrn.substring(0, 20);
        }
        this.txSample.textbox("setText", pttrn);

        this.btnUpdate_onClick();
    }


    /**
     * Очистка поля Образец
     */
    btnClearSample_onClick(){
        this.txSample.textbox("setText", "");

        this.btnUpdate_onClick();
    }



    /**
     * Изменение даты
     */
    dtDateQuery_onChange(){

        if (this.firstLoad) { return; }

        this.LoadUsers();
    }



    /**
     * Получить строку-дату для запроса
     */
    getDateForQuery(){
        let inputDate = this.dtDateQuery.datebox("getValue"); //Получаем введенную дату: 21.04.2020

        let dateArray = inputDate.split("."); //получаем массив, разбиваем по точке

        let dateInQuery = "";
        //Введена нормальная дата
        if (dateArray.length == 3 && dateArray[0].length==2 &&
            dateArray[1].length == 2 && dateArray[2].length==4 &&
            !isNaN(dateArray[0]) && !isNaN(dateArray[1]) && !isNaN(dateArray[2])
        ){
            //формируем дату для запроса: 20200420
            dateInQuery = dateArray[2] + dateArray[1] + dateArray[0];
        }
        else { //введена кривая дата
            let currentDate = new Date();

            let year = currentDate.getFullYear(); // 2020
            let month = currentDate. getMonth() + 1; // 0-11
            let day = currentDate.getDate(); // 1-31

            if (day < 10){
                day = '0' + day;
            }

            if (month < 10 ) {
                month = '0' + month;
            }

            dateInQuery = year +""+ month +""+ day;
        }

        return dateInQuery;
    }


    /**
     * Установить текущую дату
     */
    setCurrentDate(){
        let currentDate = new Date();

        let year = currentDate.getFullYear(); // 2020
        let month = currentDate. getMonth() + 1; // 0-11
        let day = currentDate.getDate(); // 1-31

        let fullDate = day+'.'+month+'.'+year;
        this.dtDateQuery.datebox("setValue", fullDate);
    }




    /**
     /* Обработка события перерисовки грида (подсветка удалённых записей)
     * @param index - позиция записи
     * @param row - запись
     */
    dgLogMain_rowStyler(index, row) {
        if (row.color == 1) {
            return "background:green;"; //Красим в зеленый цвет (insert update)
        } else if (row.color == 2) {
            return "background:dimgrey;"; //Красим в темно серый цвет (delete)
        } else if (row.color == 3) {
            return "background:mediumpurple;"; //Красим в фиолетовый  цвет (exec)
        } else if (row.color == 4) {
            return "background:red;"; //Красим в красный цвет (ошибка)
        }
    }




    /**
     * Проверка прав
     */
    LoadRights(){
        $.ajax({
            method: "get",
            url: this.GetUrl('/CoreUtils/GetActRights?TaskCode=LogMain.dll&ActCode=LogMainChange'),
            success: function (data) {
                if (data.length == 0){
                    this.btnUpdate.linkbutton({disabled:false});
                    this.btnView.linkbutton({disabled: false});
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }


    /**
     * Обработка просмотра записи
     */
    btnView_onClick(){
        if(this.dgLogMain.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для просмотра");
            return false;
        }
        let selData = this.dgLogMain.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для просмотра");
            return false;
        }

        let form = new LogMainFormEdit();
        form.Show(selData.id);
    }
}



/**
 * Функция встраиваемого запуска модуля
 * @param Id идентификатор
 * @constructor
 */
export function StartNestedModul(Id){
    let form = new LogMain("nested_", "");
    form.Start(Id);
}


