package org.kaznalnrprograms.Accounting.Objs.Interfaces;

import org.kaznalnrprograms.Accounting.ListParams.Models.ListParamsModel;
import org.kaznalnrprograms.Accounting.Objs.Models.*;
import org.sql2o.data.Table;
import java.util.Date;
import java.util.List;

public interface IObjsDao {

    /**
     * Получить количество объектов
     * @return
     * @throws Exception
     */
    int countObjs(ObjsFilterModel filter) throws Exception;

    /**
     * Получаем список объектов с учетом фильтра
     * @return
     */
    Table list(ObjsMainFilterModel filterMain) throws Exception;

    /**
     * Получаем объект по указаному идентификатору
     * @param id - Идентификатор записи
     * @return
     * @throws Exception
     */
    ObjsGetModel get(int id) throws Exception;

    /**
     * Получаем список всех дополнительных реквизитов для таблицы objs
     * @return
     * @throws Exception
     */
    List<ObjsListParamsModel> listListParams() throws Exception;

    /**
     * Получаем список значений для дполнителных реквизитов
     * @param id - идентификатор объекта
     * @return
     * @throws Exception
     */
    List<ObjsListValuesModel> listListValues(int id) throws Exception;

    /**
     * Получаем список всех переодических реквизитов для таблицы objs
     * @return
     * @throws Exception
     */
    List<ObjsPeriodParamsModel> listPeriodParams() throws Exception;

    /**
     * Получаем список значений для переодических реквизитов
     * @param id - индентификатор объекта
     * @return
     * @throws Exception
     */
    List<ObjsPeriodValuesModel> listPeriodValues(int id, String date) throws Exception;

    /**
     * Запрос для получения строки в формате id = name (универсальный)
     * @param table - Имя таблицы
     * @param id - Идентификатор записи в таблице
     * @return
     * @throws Exception
     */
    String universalDataAcquisition(String table, int id) throws Exception;

    /**
     * Проверка на закрытие дня в Today и TodayUsers
     * @param date - провреяемая дата
     * @return
     * @throws Exception
     */
    int checkCloseDay(String date) throws Exception;

    /**
     * Проверка двух дат на закрытие дня в Today и TodayUsers
     * @param dateOne - первая проверяемая дата
     * @param dateTwo - вторая проверяемая дата
     * @return
     * @throws Exception
     */
    int checkCloseTwoDay(String dateOne, String dateTwo) throws Exception;

    /**
     * Получаем список данных "справочник счетов" для заполнения comboBox с использованием универсальной модели
     * @return
     * @throws Exception
     */
    List<UniversalBoxModel> GetAccsList() throws Exception;

     /**
     * Получаем список данных "справочник групп инвентарного учета" для заполнения comboBox с использованием универсальной модели
     * @return
     * @throws Exception
     */
    List<UniversalBoxModel> GetInvGrpsList() throws Exception;

    /**
     * Получаем список данных "справочник единиц измерения" для заполнения comboBox с использованием универсальной модели
     * @return
     * @throws Exception
     */
    List<UniversalBoxModel> GetUnitsList() throws Exception;

    /**
     * Получаем список данных "справочник КЭКР" для заполнения comboBox с использованием универсальной модели
     * @return
     * @throws Exception
     */
    List<UniversalBoxModel> GetKekrList() throws Exception;

    /**
     * Получаем список данных "справочник типов фондов" для заполнения comboBox с использованием универсальной модели
     * @return
     * @throws Exception
     */
    List<UniversalBoxModel> GetTypeFondsList() throws Exception;

    /**
     * Получаем Id таблицы по наименованию таблицы
     * @param TableName - наименование таблицы
     * @return
     * @throws Exception
     */
    String TableId(String TableName) throws Exception;

    /**
     * Получаем значение из таблицы periodlock
     * @param id - идентификатор  записи в таблице periodlock
     * @return
     * @throws Exception
     */
    String getPeriodEdit(int id) throws Exception;

    /**
     * Удаляем из таблицы ImgLock/PeriodValues все записи из сессии
     * @param sesId - сессия по которой будет проходить удаление
     * @throws Exception
     */
    void DeleteImgLockAndDeletePeriodLock(String sesId) throws Exception;

    /**
     * Генерация инвентарного номера
     * @param AccsId - счет объекта
     * @param InvGrpsId - группа инвентарного счета объекта
     * @return
     * @throws Exception
     */
    String genInvNo(int AccsId, int InvGrpsId) throws Exception;

    /**
     * Проверка наличия счета в группе
     * @param AccsId - счет объекта
     * @param InvGrpsId - группа инвентарного счета объекта
     * @return
     * @throws Exception
     */
    int checkInvGrpAccs(int AccsId, int InvGrpsId) throws Exception;

    /**
     * Добавление/изменение объекта
     * @param model - модель объекта
     * @return
     * @throws Exception
     */
    int save(ObjsModel model) throws Exception;

    /**
     * Проверяем существует ли картинка на объекте (Objs)
     * @param tableId
     * @param recid
     * @param sesId - текущая сессия
     * @return
     */
    String CountImgValuesObjs(int tableId, int recid, String sesId) throws Exception;

    /**
     * Проверяем была ли удалена записиь в таблице PeriodLock
     * @param periodparamid - идентификатор периодического реквизита
     * @param sesId         - текущая сессия
     * @return
     * @throws Exception
     */
    String FlagDelPeriodLock(int periodparamid, String sesId) throws Exception;

    /**
     * Получаем сроки эксплуатации объекта
     * @param objsId - идентификатор объекта
     * @return
     * @throws Exception
     */
    List<ObjsModelDate> listDateObjs(int objsId) throws Exception;

    /**
     * Проверяем был ли удалена каринка
     * @param id - идентификатор записи в imglock
     * @return
     * @throws Exception
     */
    int flagDelImg(int id) throws Exception;

    /**
     * Список начиселния износа
     * @return
     * @throws Exception
     */
    List<UniversalBoxModel> ListWearMthds() throws Exception;

    /**
     * Получаем процент износа по счету и группе инвентарного учета объекта
     * @param accId     - идентификатор счета объекта
     * @param invGrpId  - идентификатор группы инвентарного учета
     * @return
     * @throws Exception
     */
    String wearMthdsPerc(int accId, int invGrpId) throws Exception;


    /**
     * Удаление объекта
     * @param id - идентификатор объекта
     * @throws Exception
     */
    void delete(int id) throws Exception;

    /**
     *
     * Проверяем права пользователя и открываем поля в соответствии с правами (для КТ) для  существующей записи
     * @return
     * @throws Exception
     */
    String RightsUsersKTId(int objId) throws Exception;

    /**
     * Проверяем права пользователя и открываем поля в соответствии с правами (для КТ) для новой записи
     * @return
     * @throws Exception
     */
    String RightsUsersKT() throws Exception;

    /**
     * Проверяем права пользователя и открываем поля в соответствии с правами (для Бухгалтерии)
     * @return
     * @throws Exception
     */
    String RightsUsersBuh() throws Exception;


}
