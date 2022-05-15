package org.kaznalnrprograms.Accounting.OrderPeriodTypePermits.Controllers;


import org.kaznalnrprograms.Accounting.OrderPeriodTypePermits.Dao.OrderPeriodTypePermitsDaoImpl;
import org.kaznalnrprograms.Accounting.OrderPeriodTypePermits.Models.ModulePeriodParamsModel;
import org.kaznalnrprograms.Accounting.OrderPeriodTypePermits.Models.OrderPeriodTypePermitsModel;
import org.kaznalnrprograms.Accounting.OrderPeriodTypePermits.Models.OrderPeriodTypePermitsViewModel;
import org.kaznalnrprograms.Accounting.OrderPeriodTypePermits.Models.OrderListModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class OrderPeriodTypePermitsController {
    private OrderPeriodTypePermitsDaoImpl dao;

    public OrderPeriodTypePermitsController(OrderPeriodTypePermitsDaoImpl dao){this.dao = dao;}

    /**
     *Запуск модуля
     * @return
     */
    @GetMapping("/OrderPeriodTypePermits/OrderPeriodTypePermitsList")
    @PreAuthorize("GetActRight('OrderPeriodTypePermits.dll','OrderPeriodTypePermitsView')")
    public String OrderPeriodTypePermitsList(){
        return "OrderPeriodTypePermits/OrderPeriodTypePermitsList :: OrderPeriodTypePermitsList";
    }

    /**
     * запуск окна редактирования
     * @return
     */
    @GetMapping("/OrderPeriodTypePermits/OrderPeriodTypePermitsEdit")
    @PreAuthorize("GetActRight('OrderPeriodTypePermits.dll', 'OrderPeriodTypePermitsChange')")
    public String OrderPeriodTypePermitsEdit(){
        return "OrderPeriodTypePermits/OrderPeriodTypePermitsEdit :: OrderPeriodTypePermitsEdit";
    }

    /**
     * запуск окна выбора переодических реквезитов
     * @return
     */
    @GetMapping("/OrderPeriodTypePermits/OrderPeriodTypePermitsOpenModule")
    @PreAuthorize("GetActRight('OrderPeriodTypePermits.dll', 'OrderPeriodTypePermitsChange')")
    public String OrderPeriodTypePermitsOpenModule(){
        return "OrderPeriodTypePermits/OrderPeriodTypePermitsOpenModule :: OrderPeriodTypePermitsOpenModule";
    }

    /**
     * полученеи списка переодических реквезитов
     * @return
     * @throws Exception
     */
    @GetMapping("/OrderPeriodTypePermits/GetListPeriodParams")
    @PreAuthorize("GetActRight('OrderPeriodTypePermits.dll','OrderPeriodTypePermitsView')")
    public @ResponseBody List<ModulePeriodParamsModel> GetListPeriodParams() throws Exception{
        return dao.GetListPeriodParams();
    }

    /**
     * заполнение верхнего грида
     * @return
     * @throws Exception
     */
    @GetMapping("/OrderPeriodTypePermits/ListOrder")
    @PreAuthorize("GetActRight('OrderPeriodTypePermits.dll','OrderPeriodTypePermitsView')")
    public @ResponseBody List<OrderListModel> ListOrder() throws Exception{
        return dao.ListOrder();
    }

    /**
     *заполнение нижнего грида
     * @param id
     * @param filter
     * @return
     * @throws Exception
     */
    @GetMapping("/OrderPeriodTypePermits/ListPeriod")
    @PreAuthorize("GetActRight('OrderPeriodTypePermits.dll','OrderPeriodTypePermitsView')")
    public @ResponseBody List<OrderPeriodTypePermitsViewModel> ListPeriod(int id, @RequestParam(required = false, defaultValue = "") String filter) throws Exception{
        return dao.ListPeriod(id,filter);
    }

    @GetMapping("/OrderPeriodTypePermits/GetProperty")
    @PreAuthorize("GetActRight('OrderPeriodTypePermits.dll','OrderPeriodTypePermitsView')")
    public @ResponseBody String GetProperty(int id) throws Exception {
        return dao.GetProperty(id);
    }

    @GetMapping("/OrderPeriodTypePermits/get")
    @PreAuthorize("GetActRight('OrderPeriodTypePermits.dll','OrderPeriodTypePermitsView')")
    public @ResponseBody OrderPeriodTypePermitsViewModel get(int id) throws Exception {
        return dao.get(id);
    }
    @GetMapping("/OrderPeriodTypePermits/exists")
    @PreAuthorize("GetActRight('OrderPeriodTypePermits.dll','OrderPeriodTypePermitsView')")
    public @ResponseBody boolean exists(int id, int type, int name) throws Exception{
        return dao.exists(id, type, name);
    }

    @PostMapping("/OrderPeriodTypePermits/save")
    @PreAuthorize("GetActRight('OrderPeriodTypePermits.dll','OrderPeriodTypePermitsChange')")
    public @ResponseBody  int save(@RequestBody OrderPeriodTypePermitsModel model) throws Exception{
        return dao.save(model);
    }
    @PostMapping("/OrderPeriodTypePermits/delete")
    @PreAuthorize("GetActRight('OrderPeriodTypePermits.dll','OrderPeriodTypePermitsChange')")
    public @ResponseBody String delete(Integer id) throws Exception{
               dao.delete(id);
        return "";
    }
}
