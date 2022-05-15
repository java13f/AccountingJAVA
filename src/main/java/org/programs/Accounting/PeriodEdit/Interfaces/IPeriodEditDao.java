package org.kaznalnrprograms.Accounting.PeriodEdit.Interfaces;

import org.kaznalnrprograms.Accounting.PeriodEdit.Models.ImgLockFlagDelAll;
import org.kaznalnrprograms.Accounting.PeriodEdit.Models.PeriodLockModel;
import org.kaznalnrprograms.Accounting.PeriodParams.Models.PeriodParamsModel;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

public interface IPeriodEditDao {

    /**
     *  Получение периодических реквезитов
     * @param SesId
     * @param PeriodParamId
     * @return
     */
    List<PeriodLockModel> getList (String SesId, int PeriodParamId, int RecId, int ObjectId, String PeriodParamData) throws Exception;

    /**
     * Наличие записей
     * @param SesId
     * @param PeriodParamId
     * @return
     */
    int CheckPrdLck(String SesId, int PeriodParamId) throws Exception;


    /**
     * Удаляем запись с ImgLock
     * @param SesId
     * // @param RecId
     * // @param ObjectId
     * @return
     * @throws Exception
     */
    void deleteImgLock(String SesId,int ObjectId, int PeriodParamId) throws Exception;

    /**
     * Сохранит или изменить данные временной таблицы PeriodLock
     * @param model
     * @return
     * @throws Exception
     */
    List<String> save(List<PeriodLockModel> model) throws Exception;


    /**
     * Получить данные о периодическом реквизите
     * @param PrdPrmId
     * @return
     * @throws Exception
     */
    PeriodParamsModel getPeriodParam(String PrdPrmId) throws Exception;

    /**
     * Получить данные из справочника
     * @param Tbl - таблица
     * @param Id - Ид. строки справочника
     * @return
     * @throws Exception
     */
    String getData(String Tbl, String Id) throws Exception;


    /**
     * Получить Id пользователя
     * @return
     * @throws Exception
     */
    String getUserId() throws Exception;

    /**
     * Получить flagDel таблицы ImgLock
     * @param imgLockId
     * @return
     * @throws Exception
     */
    String getImgLockFlagDel(int imgLockId) throws Exception;

    List<ImgLockFlagDelAll> getImgLockFlDlAll(String sesid) throws Exception;

    /**
     * Проверить окрыт ли проверяемый день
     * @param chckDay - проверяемый день (дата)
     * @return
     * @throws Exception
     */
    boolean OpenDayCheck(String chckDay) throws Exception;

    /**
     * Удаление периодического реквизита
     * @param Id
     * @return
     * @throws Exception
     */
    String delete(String Id) throws Exception;
}
