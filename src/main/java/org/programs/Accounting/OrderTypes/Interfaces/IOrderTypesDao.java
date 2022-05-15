package org.kaznalnrprograms.Accounting.OrderTypes.Interfaces;

import org.kaznalnrprograms.Accounting.OrderTypes.Models.OrderTypesModel;
import org.kaznalnrprograms.Accounting.OrderTypes.Models.OrderTypesViewModel;

import java.util.List;


public interface IOrderTypesDao
{
    /**
     * Получить список типов заявок
     * @param showDel - флаг отображения удаленных записей
     * @return
     * @throws Exception
     */
    List<OrderTypesViewModel> viewList(boolean showDel) throws Exception;

    /**
     * Проверка на существование одинаковых записей с кодом типа заявки в базе данных
     * @param id
     * @param code
     * @return
     * @throws Exception
     */
    boolean exists(int id, String code) throws Exception;

    /**
     * Сохранение типа заявки
     * @param ordertypes - тип заявки
     * @return
     * @throws Exception
     */
    int save(OrderTypesModel ordertypes) throws Exception;

    /**
     * Функция получения типа заявки для просмотра/изменения
     * @param id - идентификатор типа заявки
     * @return
     * @throws Exception
     */
    OrderTypesModel get(int id) throws Exception;


    /**
     * Удаление типа заявки
     * @param id - идентификатор типа заявки
     * @throws Exception
     */
    void delete(int id) throws Exception;
}
