package org.kaznalnrprograms.Accounting.Admin.Interfaces;

import org.kaznalnrprograms.Accounting.Admin.Models.ActModel;
import org.kaznalnrprograms.Accounting.Admin.Models.ActViewModel;

import java.util.List;

public interface IActsDao {
    /**
     * Получить список действий
     * @param appId - идентификатор приложения
     * @param code - код действия
     * @param name - наименование действия
     */
    List<ActViewModel> List(int appId, String code, String name) throws Exception;

    /**
     * Получить действие
     * @param id - идентификатор действия
     */
    ActModel Get(int id) throws Exception;

    /**
     * Проверить существование действия в базе данных
     * @param id - идентификатор действия (для новых -1)
     * @param code - код действия
     */
    boolean Exists(int id, String code) throws Exception;

    /**
     * Добавить/Изменить действие
     * @param act - модель действия
     */
    int Save(ActModel act) throws Exception;

    /**
     * Удалить действие
     * @param id - идентификатор действия
     */
    String Delete(int id) throws Exception;

    /**
     * Получить данные выбранного действия
     * @param id - Идентифиатор действия
     */
    String GetActSel(int id) throws Exception;
}
