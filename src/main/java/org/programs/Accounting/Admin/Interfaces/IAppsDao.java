package org.kaznalnrprograms.Accounting.Admin.Interfaces;

import org.kaznalnrprograms.Accounting.Admin.Models.AppModel;
import org.kaznalnrprograms.Accounting.Admin.Models.AppViewModel;

import java.util.List;

public interface IAppsDao {
    /**
     * Получить список приложений
     */
    List<AppViewModel> List() throws Exception;

    /**
     * Получить наименование приложения
     * @param id идентификатор приложения
     */
    String GetAppSel(int id) throws Exception;

    /**
     * Получить приложение
     * @param id - идентификатор приложения
     */
    AppModel Get(int id) throws Exception;

    /**
     * Проверить существование приложения
     * @param id - идентификатор приложения (для новых -1)
     * @param code - код приложения
     * @param func - функция приложения
     */
    boolean Exists(int id, String code, String func) throws Exception;

    /**
     * Добавить/Изменить приложение
     * @param app - модель приложения
     */
    int Save(AppModel app) throws Exception;

    /**
     * Удалить приложение
     * @param id - идентификатор приложения
     */
    String Delete(int id) throws Exception;
}
