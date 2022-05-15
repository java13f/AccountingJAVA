package org.kaznalnrprograms.Accounting.OrderFields.Interfaces;
import org.kaznalnrprograms.Accounting.OrderFields.Models.*;

import java.util.List;

public interface IOrderFieldsDao {
    /**
     *Получить список полей заявки
     * @param filter
     * @param showDel
     * @return
     * @throws Exception
     */
    List<OrderFieldsViewModel> list (String filter, boolean showDel) throws Exception;

    /**
     * Получить поле заявки для просмотра/редактирования поля
     * @param id
     * @return
     * @throws Exception
     */
    OrderFieldsModel get (int id) throws Exception;

    /**
     * Проверить существование поля заявки
     * @param id
     * @param code
     * @return
     * @throws Exception
     */
    boolean exists (int id, String code ) throws Exception;

    /**
     * Добавить/изменить поле заявки
     * @param ofields
     * @return
     * @throws Exception
     */
    int save (OrderFieldsModel ofields) throws Exception;

    /**
     * Удаление поля заявки
     * @param id
     * @throws Exception
     */
    void delete (int id) throws Exception;

}
