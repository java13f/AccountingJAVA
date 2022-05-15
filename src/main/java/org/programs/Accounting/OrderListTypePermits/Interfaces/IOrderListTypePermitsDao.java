package org.kaznalnrprograms.Accounting.OrderListTypePermits.Interfaces;
import org.kaznalnrprograms.Accounting.OrderListTypePermits.Models.ModuleListParamsModel;
import org.kaznalnrprograms.Accounting.OrderListTypePermits.Models.OrderTypeModel;
import org.kaznalnrprograms.Accounting.OrderListTypePermits.Models.OrderListTypePermitsModel;
import org.kaznalnrprograms.Accounting.OrderListTypePermits.Models.OrderListTypePermitsViewModel;

import java.util.List;

public interface IOrderListTypePermitsDao {
    /**
     * Получение типов заявок
     * @return
     * @throws Exception
     */
    List<OrderTypeModel> getOrderTypeList() throws Exception;

    /**
     * Получение списка дополнительных реквизитов в заявках
     * @param orderTypeId
     * @param filter
     * @return
     * @throws Exception
     */
    List<OrderListTypePermitsViewModel> getOrderListTypePerList(int orderTypeId, String filter) throws Exception;

    /**
     * Получени дополнительных реквизитов
     * @return
     * @throws Exception
     */
    List<ModuleListParamsModel> getListParamsList() throws Exception;

    /**
     * Получение реквизита
     * @param id
     * @return
     * @throws Exception
     */
    String getListParamById(int id) throws Exception;

    /**
     * Получение записи
     * @param id
     * @return
     * @throws Exception
     */
    OrderListTypePermitsViewModel getOrderListTypePerById(int id) throws Exception;

    /**
     * Проверка на уникальность
     * @param id
     * @return
     * @throws Exception
     */
    boolean exists(int id, int orderTypeId, int listParamId) throws Exception;

    /**
     * сохранение
     * @param model
     * @return
     * @throws Exception
     */
    int save(OrderListTypePermitsModel model) throws Exception;

    /**
     * Удаление
     * @param id
     * @throws Exception
     */
    void delete(int id) throws Exception;
}
