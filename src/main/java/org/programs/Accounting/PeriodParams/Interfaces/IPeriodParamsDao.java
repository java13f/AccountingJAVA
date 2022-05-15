package org.kaznalnrprograms.Accounting.PeriodParams.Interfaces;

import org.kaznalnrprograms.Accounting.PeriodParams.Models.PeriodParamsModel;
import org.kaznalnrprograms.Accounting.PeriodParams.Models.PeriodParamsTaskCodesModel;
import org.kaznalnrprograms.Accounting.PeriodParams.Models.PeriodParamsViewModel;

import java.util.List;

public interface IPeriodParamsDao {
    /*
    Получение списка реквизитов
     */
    List<PeriodParamsViewModel> list(boolean showDel, String filter) throws Exception;

    /*
    Получение реквизита по ИД
     */
    PeriodParamsModel get(int id) throws Exception;

    /*
    Получение списка кодов задач
     */
    List<PeriodParamsTaskCodesModel> listTaskCodes() throws Exception;

    /*
    Сохранение реквизита
     */
    int save(PeriodParamsModel model) throws Exception;

    /*
    Проверка уникальности сохраняемого реквизита
     */
    boolean checkSameCodes(int id, String paramCode, String taskCode) throws Exception;

    /*
    Удаление реквизита по ИД
     */
    void delete(int id) throws Exception;
}
