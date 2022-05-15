package org.kaznalnrprograms.Accounting.SttsOrder.Controllers;

import org.kaznalnrprograms.Accounting.SttsOrder.Interfaces.ISttsOrderDao;
import org.kaznalnrprograms.Accounting.SttsOrder.Models.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class SttsOrderController {
    private ISttsOrderDao dao;
    public SttsOrderController(ISttsOrderDao dao){
        this.dao = dao;
    }

    @GetMapping("/SttsOrder/SttsOrderFormList")
    @PreAuthorize("GetActRight('SttsOrder.dll','SttsOrderView')")
    public String SttsOrderFormList(@RequestParam(required = false, defaultValue = "") String prefix, Model model){
        model.addAttribute("prefix", prefix);
        return "SttsOrder/SttsOrderFormList :: SttsOrderFormList";
    }

    @GetMapping("/SttsOrder/SttsOrderTransfer")
    @PreAuthorize("GetActRight('SttsOrder.dll','SttsOrderView')")
    public String SttsOrderTransfer(@RequestParam(required = false, defaultValue = "") String prefix, Model model){
        model.addAttribute("prefix", prefix);
        return "SttsOrder/SttsOrderTransfer :: SttsOrderTransfer";
    }

    @GetMapping("/SttsOrder/SttsOrderTransferConfirm")
    @PreAuthorize("GetActRight('SttsOrder.dll','SttsOrderView')")
    public String SttsOrderTransferConfirm(@RequestParam(required = false, defaultValue = "") String prefix, Model model){
        model.addAttribute("prefix", prefix);
        return "SttsOrder/SttsOrderTransferConfirm :: SttsOrderTransferConfirm";
    }

    /**
     * Получить список
     */
    @GetMapping("SttsOrder/list")
    @PreAuthorize("GetActRight('SttsOrder.dll','SttsOrderView')")
    public @ResponseBody
    List<SttsOrderViewModel> list(
            @RequestParam(required = false, defaultValue = "") int groupId,
            @RequestParam(required = false, defaultValue = "") int orderTypeId
    ) throws Exception {
        return dao.list(groupId,orderTypeId);
    }

    /**
     * Получить список групп
     */
    @GetMapping("SttsOrder/groupsList")
    @PreAuthorize("GetActRight('SttsOrder.dll','SttsOrderView')")
    public @ResponseBody
    List<GroupsModel> groupsList() throws Exception {
        return dao.groupsList();
    }

    /**
     * Получить список типов заявок
     */
    @GetMapping("SttsOrder/orderTypesList")
    @PreAuthorize("GetActRight('SttsOrder.dll','SttsOrderView')")
    public @ResponseBody
    List<OrderTypesModel> orderTypesList() throws Exception {
        return dao.orderTypesList();
    }

    /**
     * Сохранение
     * @param model
     * @throws Exception
     */
    @PostMapping("SttsOrder/save")
    @PreAuthorize("GetActRight('SttsOrder.dll','SttsOrderChange')")
    public @ResponseBody
    int save(@RequestBody SttsOrderViewModel model) throws Exception {
        return dao.save(model);
    }

    /**
     * Получить список групп
     */
    @GetMapping("SttsOrder/sttsOrderGr")
    @PreAuthorize("GetActRight('SttsOrder.dll','SttsOrderView')")
    public @ResponseBody
    List<GroupsModel> sttsOrderGr() throws Exception {
        return dao.groupsList();
    }

    /**
     * Получить список полей
     */
    @GetMapping("SttsOrder/sttsOrderField")
    @PreAuthorize("GetActRight('SttsOrder.dll','SttsOrderView')")
    public @ResponseBody
    List<OrderFieldModel> sttsOrderField() throws Exception {
        return dao.fieldsList();
    }

    /*
     * Есть ли статусы в указанной группе и типе заявки (нужен для проверки перед переносом)
     * */
    @GetMapping("SttsOrder/checkForEmptyGr")
    @PreAuthorize("GetActRight('SttsOrder.dll','SttsOrderView')")
    public @ResponseBody
    boolean checkForEmptyGr( @RequestParam(required = false, defaultValue = "") int groupId,
                             @RequestParam(required = false, defaultValue = "") int orderTypeId) throws Exception {
        return dao.checkForEmpty(groupId, orderTypeId);
    }

    /*
     * Перенос статусов из одногой группы и типа заявки в др.
     * */
    @PostMapping("/SttsOrder/saveTransfer")
    @PreAuthorize("GetActRight('SttsOrder.dll','SttsOrderChange')")
    public @ResponseBody
    int saveTransfer(@RequestBody SttsOrderTransferModel obj) throws Exception {
        return dao.saveTransfer(obj);
    }
}