package org.kaznalnrprograms.Accounting.Today.Interfaces;

import org.kaznalnrprograms.Accounting.Today.Models.TodayUsers;

import java.util.List;

public interface ITodayUsers
{
    /**
     * Получить список пользователей дня
     * @param todayid
     * @return
     * @throws Exception
     */
    List<TodayUsers> getTodayUsersList(int todayid) throws Exception;

    /**
     * Удалить пользователя (не физически)
     * @param id
     * @throws Exception
     */
    void deleteTodayUsers(int id) throws Exception;

    /**
     * Добавить пользователя
     * @param todayusers
     * @return
     * @throws Exception
     */
    int saveTodayUsers(TodayUsers todayusers) throws Exception;

    /**
     * Перед добавлением проверить не существует ли такого пользователя уже в базе
     * @param todayid
     * @param userid
     * @return
     * @throws Exception
     */
    boolean existsUserInDay(int todayid, int userid) throws Exception;
}
