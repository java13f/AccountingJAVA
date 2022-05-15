package org.kaznalnrprograms.Accounting.Orders.Interfaces;

import org.kaznalnrprograms.Accounting.Orders.Models.*;

import java.util.List;
import java.util.Map;

public interface IOrdersDao {
    List<OrdersViewModel> list(OrdersFilterModel bothFilters) throws Exception;

    List<OrdersTypesModel> listOrderTypes() throws Exception;

    List<OrdersParamsModel> listPeriodAndListParams() throws Exception;

    String getDataFromTableById(String table, int id) throws Exception;

    void deleteOrder(int id) throws Exception;
}
