package org.kaznalnrprograms.Accounting.OrderUniversal.Controllers;

import org.kaznalnrprograms.Accounting.OrderUniversal.Interfaces.IOrderUniversalDao;
import org.kaznalnrprograms.Accounting.OrderUniversal.Models.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class OrderUniversalController {
    private IOrderUniversalDao dOrd;

    public OrderUniversalController(IOrderUniversalDao dOrd) {
        this.dOrd = dOrd;
    }

    @GetMapping("OrderUniversal/OrderUniversalForm")
    @PreAuthorize("GetActRight('Orders.dll','ViewOrders')")
    public String OrderUniversalForm() {
        return "OrderUniversal/OrderUniversalForm :: OrderUniversalForm";
    }

    @GetMapping("OrderUniversal/getOrder")
    @PreAuthorize("GetActRight('Orders.dll','ViewOrders')")
    public @ResponseBody
    OrderUniversalModel getOrder(int id) throws Exception {
        return dOrd.getOrder(id);
    }

    @GetMapping("OrderUniversal/getObj")
    @PreAuthorize("GetActRight('Orders.dll','ViewOrders')")
    public @ResponseBody
    OrderUniversalObjModel getObj(int id) throws Exception {
        return dOrd.getObj(id);
    }

    @GetMapping("OrderUniversal/getUser")
    @PreAuthorize("GetActRight('Orders.dll','ChangeOrders')")
    public @ResponseBody
    OrderUniversalUserModel getUser(@RequestParam(required = true, defaultValue = "-1") int id) throws Exception {
        return dOrd.getUser(id);
    }

    @GetMapping("OrderUniversal/getOrderType")
    @PreAuthorize("GetActRight('Orders.dll','ChangeOrders')")
    public @ResponseBody
    OrderUniversalOrderTypeModel getOrderType(int id) throws Exception {
        return dOrd.getOrderType(id);
    }

    @GetMapping("OrderUniversal/getProblem")
    @PreAuthorize("GetActRight('Orders.dll','ChangeOrders')")
    public @ResponseBody
    OrderUniversalProblemModel getProblem(int id) throws Exception {
        return dOrd.getProblem(id);
    }

    @GetMapping("OrderUniversal/getImgLockById")
    @PreAuthorize("GetActRight('Orders.dll','ChangeOrders')")
    public @ResponseBody
    OrderUniversalImgLockModel getImgLockById(int id) throws Exception {
        return dOrd.getImgLockById(id);
    }

    @PostMapping("OrderUniversal/getImgLockByModel")
    @PreAuthorize("GetActRight('Orders.dll','ChangeOrders')")
    public @ResponseBody
    OrderUniversalImgLockModel getImgLockByModel(OrderUniversalImgLockModel model) throws Exception {
        return dOrd.getImgLockByModel(model);
    }

    @GetMapping("OrderUniversal/getListValues")
    @PreAuthorize("GetActRight('Orders.dll','ViewOrders')")
    public @ResponseBody
    List<OrderUniversalValueModel> getListValues(@RequestParam(required = true) int orderid, int ordertype) throws Exception {
        return dOrd.getListValues(orderid, ordertype);
    }

    @GetMapping("OrderUniversal/getPeriodValues")
    @PreAuthorize("GetActRight('Orders.dll','ViewOrders')")
    public @ResponseBody
    List<OrderUniversalValueModel> getPeriodValues(@RequestParam(required = true) int orderid, int ordertype, int objid, String date) throws Exception {
        return dOrd.getPeriodValues(orderid, ordertype, objid, date);
    }

    @GetMapping("OrderUniversal/getOrderPermits")
    @PreAuthorize("GetActRight('Orders.dll','ViewOrders')")
    public @ResponseBody
    List<OrderUniversalSttsPermitsModel> getOrderPermits(@RequestParam int ordertype) throws Exception {
        return dOrd.getOrderPermits(ordertype);
    }

    @GetMapping("OrderUniversal/checkDay")
    @PreAuthorize("GetActRight('Orders.dll','ChangeOrders')")
    public @ResponseBody
    boolean checkDay(@RequestParam(required = true) String date) throws Exception {
        return dOrd.checkDay(date);
    }

    @GetMapping("OrderUniversal/checkOrderNo")
    @PreAuthorize("GetActRight('Orders.dll','ChangeOrders')")
    public @ResponseBody
    String checkOrderNo(@RequestParam(required = true) String no, String date) throws Exception {
        return dOrd.checkOrderNo(no, date);
    }

    @GetMapping("OrderUniversal/getOrderNo")
    @PreAuthorize("GetActRight('Orders.dll','ChangeOrders')")
    public @ResponseBody
    String getOrderNo(@RequestParam(required = true) String date) throws Exception {
        return dOrd.getOrderNo(date);
    }

    @GetMapping("OrderUniversal/getDataFromTable")
    @PreAuthorize("GetActRight('Orders.dll','ChangeOrders')")
    public @ResponseBody
    String getDataFromTable(@RequestParam(required = true) String tablename, int id) throws Exception {
        return dOrd.getDataFromTable(tablename, id);
    }

    @GetMapping("OrderUniversal/checkObjectDates")
    @PreAuthorize("GetActRight('Orders.dll','ChangeOrders')")
    public @ResponseBody
    String checkObjectDates(int objid, String date) throws Exception {
        return dOrd.checkObjectDates(objid, date);
    }

    @PostMapping("OrderUniversal/save")
    @PreAuthorize("GetActRight('Orders.dll','ChangeOrders')")
    public @ResponseBody
    int save(@RequestBody OrderUniversalModel model) throws Exception {
        return dOrd.save(model);
    }

    @GetMapping("OrderUniversal/clearLocks")
    @PreAuthorize("GetActRight('Orders.dll','ChangeOrders')")
    public String clearLocks(@RequestParam(required = true) String sesid) throws Exception {
        return dOrd.ClearLocks(sesid);
    }

}
