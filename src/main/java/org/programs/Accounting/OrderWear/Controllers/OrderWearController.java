package org.kaznalnrprograms.Accounting.OrderWear.Controllers;

import org.kaznalnrprograms.Accounting.OrderWear.Interfaces.IOrderWearDao;
import org.kaznalnrprograms.Accounting.OrderWear.Models.OrderViewModel;
import org.kaznalnrprograms.Accounting.OrderWear.Models.OrderWearObjModel;
import org.kaznalnrprograms.Accounting.OrderWear.Models.OrderWearSaveModel;
import org.kaznalnrprograms.Accounting.OrderWear.Models.UserModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class OrderWearController {
    private IOrderWearDao dOrderWear;

    public OrderWearController(IOrderWearDao dOrderWear){ this.dOrderWear = dOrderWear;}

    @GetMapping("OrderWear/OrderWearForm")
    @PreAuthorize("GetActRight('Orders.dll','ViewOrders')")
    public String OrderWearForm() {
        return "OrderWear/OrderWearForm :: OrderWearForm";
    }

    @GetMapping("OrderWear/OrderWearChangeForm")
    @PreAuthorize("GetActRight('Orders.dll','ViewOrders')")
    public String OrderWearChangeForm() {
        return "OrderWear/OrderWearChangeForm :: OrderWearChangeForm";
    }

    @GetMapping("OrderWear/getObj")
    @PreAuthorize("GetActRight('Orders.dll','ViewOrders')")
    public @ResponseBody
    OrderWearObjModel getObj(int id) throws Exception {
        return dOrderWear.getObj(id);
    }

    @GetMapping("OrderWear/getNextNo")
    @PreAuthorize("GetActRight('Orders.dll','ViewOrders')")
    public @ResponseBody
    String getNextNo(String date) throws Exception {
        return dOrderWear.getNextNo(date);
    }

    @GetMapping("OrderWear/chkNo")
    @PreAuthorize("GetActRight('Orders.dll','ViewOrders')")
    public @ResponseBody
    String chkNo(String no, String date) throws Exception {
        return dOrderWear.chkNo(no, date);
    }

    @GetMapping("OrderWear/getUserFromId")
    @PreAuthorize("GetActRight('Orders.dll','ViewOrders')")
    public @ResponseBody
    UserModel getUserFromId(int id) throws Exception {
        return dOrderWear.getUserFromId(id);
    }

    @GetMapping("OrderWear/getOrderFromId")
    @PreAuthorize("GetActRight('Orders.dll','ViewOrders')")
    public @ResponseBody
    OrderViewModel getOrderFromId(int id) throws Exception {
        return dOrderWear.getOrderFromId(id);
    }

    @GetMapping("OrderWear/checkDay")
    @PreAuthorize("GetActRight('Orders.dll','ChangeOrders')")
    public @ResponseBody
    boolean checkDay(@RequestParam(required = true) String date) throws Exception {
        return dOrderWear.checkDay(date);
    }

    @GetMapping("OrderWear/checkInitUser")
    @PreAuthorize("GetActRight('Orders.dll','ChangeOrders')")
    public @ResponseBody
    String checkInitUser(int userid) throws Exception {
        return dOrderWear.checkInitUser(userid);
    }

    @GetMapping("OrderWear/checkExpObjs")
    @PreAuthorize("GetActRight('Orders.dll','ChangeOrders')")
    public @ResponseBody
    String checkExpObjs(int objid, String date) throws Exception {
        return dOrderWear.checkExpObjs(objid, date);
    }

    @GetMapping("OrderWear/checkExpObjsArray")
    @PreAuthorize("GetActRight('Orders.dll','ChangeOrders')")
    public @ResponseBody
    String checkExpObjsArray(int[] objid, String date) throws Exception {
        return dOrderWear.checkExpObjsArray(objid, date);
    }

    @PostMapping("OrderWear/save")
    @PreAuthorize("GetActRight('Orders.dll','ChangeOrders')")
    public @ResponseBody
    int save(@RequestBody List<OrderWearSaveModel> model) throws Exception {
        return dOrderWear.save(model);
    }
}
