package org.kaznalnrprograms.Accounting.Orders.Controllers;

import org.kaznalnrprograms.Accounting.Orders.Interfaces.IOrdersDao;
import org.kaznalnrprograms.Accounting.Orders.Models.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
public class OrdersController {
    private IOrdersDao dOrders = null;

    public OrdersController(IOrdersDao dOrders) {
        this.dOrders = dOrders;
    }

    @GetMapping("Orders/OrdersFormList")
    @PreAuthorize("GetActRight('Orders.dll','ViewOrders')")
    public String OrdersFormList(@RequestParam(required = false, defaultValue = "") String prefix, Model model) {
        model.addAttribute("prefix", prefix);
        return "Orders/OrdersFormList :: OrdersFormList";
    }

    @GetMapping("Orders/OrdersFormFilter")
    @PreAuthorize("GetActRight('Orders.dll','ViewOrders')")
    public String OrdersFormFilter() {
        return "Orders/OrdersFormFilter :: OrdersFormFilter";
    }

    @GetMapping("Orders/OrdersFormFilterParams")
    @PreAuthorize("GetActRight('Orders.dll','ViewOrders')")
    public String OrdersFormFilterParams() {
        return "Orders/OrdersFormFilterParams :: OrdersFormFilterParams";
    }

    @GetMapping("Orders/OrdersFormTypesList")
    @PreAuthorize("GetActRight('Orders.dll','ViewOrders')")
    public String OrdersFormTypesList() {
        return "Orders/OrdersFormTypesList :: OrdersFormTypesList";
    }

    @PostMapping("Orders/list")
    @PreAuthorize("GetActRight('Orders.dll','ViewOrders')")
    public @ResponseBody
    List<OrdersViewModel> list(@RequestBody OrdersFilterModel bothFilters
    ) throws Exception {
        return dOrders.list(bothFilters);
    }

    @GetMapping("Orders/listOrderTypes")
    @PreAuthorize("GetActRight('Orders.dll','ViewOrders')")
    public @ResponseBody
    List<OrdersTypesModel> listOrderTypes() throws Exception {
        return dOrders.listOrderTypes();
    }

    @GetMapping("Orders/listPeriodAndListParams")
    @PreAuthorize("GetActRight('Orders.dll','ViewOrders')")
    public @ResponseBody
    List<OrdersParamsModel> listPeriodAndListParams() throws Exception {
        return dOrders.listPeriodAndListParams();
    }

    @GetMapping("Orders/getDataFromTableById")
    @PreAuthorize("GetActRight('Orders.dll','ViewOrders')")
    public @ResponseBody
    String getDataFromTableById(String table, int id) throws Exception {
        return dOrders.getDataFromTableById(table, id);
    }

    @PostMapping("Orders/deleteOrder")
    @PreAuthorize("GetActRight('Orders.dll','ChangeOrders')")
    public @ResponseBody void deleteOrder(int id) throws Exception{
         dOrders.deleteOrder(id);
    }
}
