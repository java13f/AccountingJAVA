package org.kaznalnrprograms.Accounting.Today.Interfaces;

import org.kaznalnrprograms.Accounting.Today.Models.Today;
import org.kaznalnrprograms.Accounting.Today.Models.TodayOpenClose;

import java.util.List;

public interface IToday
{
    /**
     * Получить список дней
     * @return
     * @throws Exception
     */
    List<Today> getTodayList() throws Exception;

    /**
     * Получить день
     * @param id - идентификатор дня
     * @return
     * @throws Exception
     */
    Today getTodayRecord(int id) throws Exception;

    /**
     * Удалить день
     * @param todayid
     * @throws Exception
     */
    String deleteToday(int todayid) throws Exception;

    /**
     * Сохранить день
     * @param today - модель дня
     * @return
     * @throws Exception
     */
    int saveToday(Today today) throws Exception;

    void addDays(TodayOpenClose toc) throws Exception;

    /**
     * Проверить пере сохранением существует ли уже такой день
     * @param id - идентификатор дня
     * @param date - сохраняемоя дата
     * @return
     * @throws Exception
     */
    boolean existsDay(int id, String date) throws Exception;

}
