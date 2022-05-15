package org.kaznalnrprograms.Accounting.Objs.Controllers;

import org.kaznalnrprograms.Accounting.Objs.Interfaces.IObjsDao;
import org.kaznalnrprograms.Accounting.Objs.Models.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import org.sql2o.data.Column;
import org.sql2o.data.Row;
import org.sql2o.data.Table;

import java.util.List;


@Controller
public class ObjsConrtoller {

    private IObjsDao dObjs;

    public ObjsConrtoller(IObjsDao dObjs) {
        this.dObjs = dObjs;
    }

    /**
     * Получить частичное представление основного окна объектов
     *
     * @param prefix - приставка для идентификаторов
     * @param model  - модель для передачи параметров в представление
     * @return
     */
    @GetMapping("/Objs/ObjsFormList")
    @PreAuthorize("GetActRight('Objs.dll','ObjsView')")
    public String ObjsFormList(@RequestParam(required = false, defaultValue = "") String prefix, Model model) {
        model.addAttribute("prefix", prefix);
        return "Objs/ObjsFormList :: ObjsFormList";
    }

    /**
     * Получить частичное представление окна фильтра
     *
     * @return
     */
    @GetMapping("/Objs/ObjsFormFilter")
    @PreAuthorize("GetActRight('Objs.dll', 'ObjsView')")
    public String ObjsFormFilter() {
        return "Objs/ObjsFormFilter :: ObjsFormFilter";
    }

    /**
     * Получить частичное представление окна фильтра для отоброжения в гриде записей
     *
     * @return
     */
    @GetMapping("/Objs/ObjsFormParamFilter")
    @PreAuthorize("GetActRight('Objs.dll', 'ObjsView')")
    public String ObjsFormParamFilter() {
        return "Objs/ObjsFormParamFilter :: ObjsFormParamFilter";
    }

    /**
     * Получить частичное представление окна добавления/изменения
     *
     * @return
     */
    @GetMapping("/Objs/ObjsFormEdit")
    @PreAuthorize("GetActRight('Objs.dll', 'ObjsView')")
    public String ObjsFormEdit() {
        return "Objs/ObjsFormEdit :: ObjsFormEdit";
    }

    /**
     * Получить частичное представление окна работа со сроками эксплуатации
     *
     * @return
     */
    @GetMapping("/Objs/ObjsFormExplList")
    @PreAuthorize("GetActRight('Objs.dll', 'ObjsView')")
    public String ObjsFormExplList() {
        return "Objs/ObjsFormExplList :: ObjsFormExplList";
    }

    /**
     * Получить частичное представление окна добавление/изменение сроков эксплуатации
     *
     * @return
     */
    @GetMapping("/Objs/ObjsFormExplEdit")
    @PreAuthorize("GetActRight('Objs.dll', 'ObjsView')")
    public String ObjsFormExplEdit() {
        return "Objs/ObjsFormExplEdit :: ObjsFormExplEdit";
    }

    /**
     * Получить список объектов
     *
     * @return
     * @throws Exception
     */
    @PostMapping("/Objs/list")
    @PreAuthorize("GetActRight('Objs.dll','ObjsView')")
    public @ResponseBody
    ObjsDateTableModel list(@RequestBody ObjsMainFilterModel filterMain) throws Exception {
        int totalCountClients = dObjs.countObjs(filterMain.getFilterData());
        Table objs = dObjs.list(filterMain);
        ObjsDateTableModel table = new ObjsDateTableModel();

        List<Row> rows = objs.rows();
        List<Column> columns = objs.columns();
        int countRows = rows.size();
        int countColumns = columns.size();
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (int irow = 0; irow < countRows; irow++) {
            Row row = rows.get(irow);
            sb.append("{");
            for (int icol = 0; icol < countColumns; icol++) {
                Column column = columns.get(icol);
                sb.append("\"");
                sb.append(column.getName());
                sb.append("\":");
                sb.append("\"");
                String value = row.getString(column.getIndex());
                if (value == null) {
                    sb.append("");
                    //sb.append(row.getString(column.getIndex()));

                } else {
                    sb.append(row.getString(column.getIndex()).replace("\"", "\\\""));
                }
                sb.append("\"");
                if (icol != (countColumns - 1)) {
                    sb.append(",");
                }
            }
            sb.append("}");
            if (irow != (countRows - 1)) {
                sb.append(",");
            }
        }
        sb.append("]");
        table.setTotal(totalCountClients);
        table.setJstr(sb.toString());
        return table;
    }

    /**
     * Функция получения объекта для просмотра/изменения территории
     *
     * @param id - идентификатор объекта
     * @return
     * @throws Exception
     */
    @GetMapping("/Objs/get")
    @PreAuthorize("GetActRight('Objs.dll','ObjsView')")
    public @ResponseBody
    ObjsGetModel get(int id) throws Exception {
        return dObjs.get(id);
    }

    /**
     * Получаем список всех дополнительных реквизитов для таблицы objs
     *
     * @return
     * @throws Exception
     */
    @GetMapping("/Objs/listListParams")
    @PreAuthorize("GetActRight('Objs.dll','ObjsView')")
    public @ResponseBody
    List<ObjsListParamsModel> listListParams() throws Exception {
        return dObjs.listListParams();
    }

    /**
     * Получаем значений для дополнитильного реквизитов
     *
     * @param id - идентификатор объекта
     * @return
     * @throws Exception
     */
    @GetMapping("/Objs/listListValues")
    @PreAuthorize("GetActRight('Objs.dll','ObjsView')")
    public @ResponseBody
    List<ObjsListValuesModel> listListValues(int id) throws Exception {
        return dObjs.listListValues(id);
    }


    /**
     * Получаем список всех переодических реквизитов для таблицы objs
     *
     * @return
     * @throws Exception
     */
    @GetMapping("/Objs/listPeriodParams")
    @PreAuthorize("GetActRight('Objs.dll','ObjsView')")
    public @ResponseBody
    List<ObjsPeriodParamsModel> listPeriodParams() throws Exception {
        return dObjs.listPeriodParams();
    }


    /**
     * Получаем значений для переодического реквизитов
     *
     * @param id - индентификатор объекта
     * @return
     * @throws Exception
     */
    @GetMapping("/Objs/listPeriodValues")
    @PreAuthorize("GetActRight('Objs.dll','ObjsView')")
    public @ResponseBody
    List<ObjsPeriodValuesModel> listPeriodValues(int id, String date) throws Exception {
        return dObjs.listPeriodValues(id, date);
    }

    /**
     * Запрос для получения строки в формате id = name (универсальный)
     *
     * @param table - Имя таблицы
     * @param id    - Идентификатор записи в таблице
     * @return
     * @throws Exception
     */
    @GetMapping("/Objs/universalDataAcquisition")
    @PreAuthorize("GetActRight('Objs.dll','ObjsView')")
    public @ResponseBody
    String universalDataAcquisition(String table, int id) throws Exception {
        return dObjs.universalDataAcquisition(table, id);
    }

    /**
     * Проверка на закрытие дня в Today и TodayUsers
     *
     * @param date - провреяемая дата
     * @return
     * @throws Exception
     */
    @GetMapping("/Objs/checkCloseDay")
    @PreAuthorize("GetActRight('Objs.dll','ObjsView')")
    public @ResponseBody
    int checkCloseDay(String date) throws Exception {
        return dObjs.checkCloseDay(date);
    }

    @GetMapping("/Objs/checkCloseTwoDay")
    @PreAuthorize("GetActRight('Objs.dll','ObjsView')")
    public @ResponseBody
    int checkCloseTwoDay(String dateOne, String dateTwo) throws Exception {
        return dObjs.checkCloseTwoDay(dateOne, dateTwo);
    }

    /**
     * Получаем список данных "справочник счетов" для заполнения comboBox с использованием универсальной модели
     *
     * @return
     * @throws Exception
     */
    @GetMapping("/Objs/GetAccsList")
    @PreAuthorize("GetActRight('Objs.dll','ObjsView')")
    public @ResponseBody
    List<UniversalBoxModel> GetAccsList() throws Exception {
        return dObjs.GetAccsList();
    }

    /**
     * Получаем список данных "справочник групп инвентарного учета" для заполнения comboBox с использованием универсальной модели
     *
     * @return
     * @throws Exception
     */
    @GetMapping("/Objs/GetInvGrpsList")
    @PreAuthorize("GetActRight('Objs.dll','ObjsView')")
    public @ResponseBody
    List<UniversalBoxModel> GetInvGrpsList() throws Exception {
        return dObjs.GetInvGrpsList();
    }


    /**
     * Получаем список данных "справочник единиц измерения" для заполнения comboBox с использованием универсальной модели
     *
     * @return
     * @throws Exception
     */
    @GetMapping("/Objs/GetUnitsList")
    @PreAuthorize("GetActRight('Objs.dll','ObjsView')")
    public @ResponseBody
    List<UniversalBoxModel> GetUnitsList() throws Exception {
        return dObjs.GetUnitsList();
    }


    /**
     * Получаем список данных "справочник КЭКР" для заполнения comboBox с использованием универсальной модели
     *
     * @return
     * @throws Exception
     */
    @GetMapping("/Objs/GetKekrList")
    @PreAuthorize("GetActRight('Objs.dll','ObjsView')")
    public @ResponseBody
    List<UniversalBoxModel> GetKekrList() throws Exception {
        return dObjs.GetKekrList();
    }

    /**
     * Получаем список данных "справочник типов фондов" для заполнения comboBox с использованием универсальной модели
     *
     * @return
     * @throws Exception
     */
    @GetMapping("/Objs/GetTypeFondsList")
    @PreAuthorize("GetActRight('Objs.dll','ObjsView')")
    public @ResponseBody
    List<UniversalBoxModel> GetTypeFondsList() throws Exception {
        return dObjs.GetTypeFondsList();
    }

    /**
     * Получаем Id таблицы по наименованию таблицы
     *
     * @param TableName - наименование таблицы
     * @return
     * @throws Exception
     */
    @GetMapping("/Objs/TableId")
    @PreAuthorize("GetActRight('Objs.dll','ObjsView')")
    public @ResponseBody
    String TableId(String TableName) throws Exception {
        return dObjs.TableId(TableName);
    }


    /**
     * Получаем значение из таблицы periodlock
     *
     * @param id - идентификатор  записи в таблице periodlock
     * @return
     * @throws Exception
     */
    @GetMapping("/Objs/getPeriodEdit")
    @PreAuthorize("GetActRight('Objs.dll','ObjsView')")
    public @ResponseBody
    String getPeriodEdit(int id) throws Exception {
        return dObjs.getPeriodEdit(id);
    }

    /**
     * Удаляем из таблицы ImgLock/PeriodValues все записи из сессии
     *
     * @param sesId - сессия по которой будет проходить удаление
     * @throws Exception
     */
    @PostMapping("/Objs/DeleteImgLockAndDeletePeriodLock")
    @PreAuthorize("GetActRight('Objs.dll','ObjsChange')")
    public @ResponseBody
    int DeleteImgLockAndDeletePeriodLock(String sesId) throws Exception {
        dObjs.DeleteImgLockAndDeletePeriodLock(sesId);
        return 0;
    }

    /**
     * Генерация инвентарного номера
     *
     * @param AccsId    - счет объекта
     * @param InvGrpsId - группа инвентарного счета объекта
     * @return
     * @throws Exception
     */
    @GetMapping("/Objs/genInvNo")
    @PreAuthorize("GetActRight('Objs.dll','ObjsView')")
    public @ResponseBody
    String genInvNo(int AccsId, int InvGrpsId) throws Exception {
        return dObjs.genInvNo(AccsId, InvGrpsId);
    }

    /**
     * Проверка наличия счета в группе
     *
     * @param AccsId    - счет объекта
     * @param InvGrpsId - группа инвентарного счета объекта
     * @return
     * @throws Exception
     */
    @GetMapping("/Objs/checkInvGrpAccs")
    @PreAuthorize("GetActRight('Objs.dll','ObjsView')")
    public @ResponseBody
    int checkInvGrpAccs(int AccsId, int InvGrpsId) throws Exception {
        return dObjs.checkInvGrpAccs(AccsId, InvGrpsId);
    }

    /**
     * Добавление/изменение объекта
     *
     * @param model - модель объекта
     * @return
     * @throws Exception
     */
    @PostMapping("/Objs/save")
    @PreAuthorize("GetActRight('Objs.dll','ObjsChange')")
    public @ResponseBody
    int save(@RequestBody ObjsModel model) throws Exception {
        return dObjs.save(model);
    }


    @GetMapping("/Objs/CountImgValuesObjs")
    @PreAuthorize("GetActRight('Objs.dll','ObjsView')")
    public @ResponseBody
    String CountImgValuesObjs(int objectid, int recid, String sesId) throws Exception {
        return dObjs.CountImgValuesObjs(objectid, recid, sesId);
    }

    /**
     * Проверяем была ли удалена записиь в таблице PeriodLock
     *
     * @param periodparamid - идентификатор периодического реквизита
     * @param sesId         - текущая сессия
     * @return
     * @throws Exception
     */
    @GetMapping("/Objs/FlagDelPeriodLock")
    @PreAuthorize("GetActRight('Objs.dll','ObjsView')")
    public @ResponseBody
    String FlagDelPeriodLock(int periodparamid, String sesId) throws Exception {
        return dObjs.FlagDelPeriodLock(periodparamid, sesId);
    }


    /**
     * Получаем сроки эксплуатации объекта
     *
     * @param objsId - идентификатор объекта
     * @return
     * @throws Exception
     */
    @GetMapping("/Objs/listDateObjs")
    @PreAuthorize("GetActRight('Objs.dll','ObjsView')")
    public @ResponseBody
    List<ObjsModelDate> listDateObjs(int objsId) throws Exception {
        return dObjs.listDateObjs(objsId);
    }


    /**
     * Проверяем был ли удалена каринка
     *
     * @param id - идентификатор записи в imglock
     * @return
     * @throws Exception
     */
    @GetMapping("/Objs/flagDelImg")
    @PreAuthorize("GetActRight('Objs.dll','ObjsView')")
    public @ResponseBody
    int flagDelImg(int id) throws Exception {
        return dObjs.flagDelImg(id);
    }

    /**
     * Список начиселния износа
     * @return
     * @throws Exception
     */
    @GetMapping("/Objs/ListWearMthds")
    @PreAuthorize("GetActRight('Objs.dll','ObjsView')")
    public @ResponseBody
    List<UniversalBoxModel> ListWearMthds() throws Exception {
        return dObjs.ListWearMthds();
    }

    /**
     * Получаем процент износа по счету и группе инвентарного учета объекта
     * @param accId     - идентификатор счета объекта
     * @param invGrpId  - идентификатор группы инвентарного учета
     * @return
     * @throws Exception
     */
    @GetMapping("/Objs/wearMthdsPerc")
    @PreAuthorize("GetActRight('Objs.dll','ObjsView')")
    public @ResponseBody
    String wearMthdsPerc(int accId, int invGrpId) throws Exception {
        return dObjs.wearMthdsPerc(accId,invGrpId);
    }


    @PostMapping("/Objs/delete")
    @PreAuthorize("GetActRight('Objs.dll','ObjsView')")
    public @ResponseBody
    int delete(int id) throws Exception {
        dObjs.delete(id);
        return 0;
    }

    /**
     * Проверяем права пользователя и открываем поля в соответствии с правами (для КТ) для  существующей записи
     * @return
     * @throws Exception
     */
    @GetMapping("/Objs/RightsUsersKTId")
    @PreAuthorize("GetActRight('Objs.dll','ObjsView')")
    public @ResponseBody
    String RightsUsersKTId(int objId) throws Exception {
        return dObjs.RightsUsersKTId(objId);
    }

    /**
     * Проверяем права пользователя и открываем поля в соответствии с правами (для КТ) для новой записи
     * @return
     * @throws Exception
     */
    @GetMapping("/Objs/RightsUsersKT")
    @PreAuthorize("GetActRight('Objs.dll','ObjsView')")
    public @ResponseBody
    String RightsUsersKT() throws Exception {
        return dObjs.RightsUsersKT();
    }

    /**
     * Проверяем права пользователя и открываем поля в соответствии с правами (для Бухгалтерии)
     * @return
     * @throws Exception
     */
    @GetMapping("/Objs/RightsUsersBuh")
    @PreAuthorize("GetActRight('Objs.dll','ObjsView')")
    public @ResponseBody
    String RightsUsersBuh() throws Exception {
        return dObjs.RightsUsersBuh();
    }
}
