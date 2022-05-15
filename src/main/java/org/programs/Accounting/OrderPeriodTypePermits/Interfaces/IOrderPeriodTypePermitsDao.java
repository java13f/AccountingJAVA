package org.kaznalnrprograms.Accounting.OrderPeriodTypePermits.Interfaces;
import org.kaznalnrprograms.Accounting.Kter.Models.KterModel;
import org.kaznalnrprograms.Accounting.OrderPeriodTypePermits.Models.ModulePeriodParamsModel;
import org.kaznalnrprograms.Accounting.OrderPeriodTypePermits.Models.OrderPeriodTypePermitsModel;
import org.kaznalnrprograms.Accounting.OrderPeriodTypePermits.Models.OrderPeriodTypePermitsViewModel;
import org.kaznalnrprograms.Accounting.OrderPeriodTypePermits.Models.OrderListModel;

import java.util.List;

public interface IOrderPeriodTypePermitsDao {


    /**
     * получение списка в верхний грид
     * @return
     * @throws Exception
     */
    List<OrderListModel> ListOrder() throws Exception;

    /**
     * получение списка в нижний грид
     * @param id
     * @param filter
     * @return
     * @throws Exception
     */
    List<OrderPeriodTypePermitsViewModel> ListPeriod(int id,String filter) throws Exception;

    /**
     * получение списка переодических реквизитов
     * @return
     * @throws Exception
     */
    List<ModulePeriodParamsModel> GetListPeriodParams() throws Exception;

    String GetProperty(int id) throws Exception;


    OrderPeriodTypePermitsViewModel get(int id) throws Exception;

    boolean exists(int id, int type,int name) throws Exception;
    int save(OrderPeriodTypePermitsModel model) throws Exception;
    void delete(int id) throws Exception;
}
