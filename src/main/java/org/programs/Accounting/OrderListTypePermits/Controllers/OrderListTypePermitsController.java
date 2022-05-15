package org.kaznalnrprograms.Accounting.OrderListTypePermits.Controllers;

import org.kaznalnrprograms.Accounting.OrderListTypePermits.Dao.OrderListTypePermitsDaoImpl;
import org.kaznalnrprograms.Accounting.OrderListTypePermits.Models.ModuleListParamsModel;
import org.kaznalnrprograms.Accounting.OrderListTypePermits.Models.OrderListTypePermitsModel;
import org.kaznalnrprograms.Accounting.OrderListTypePermits.Models.OrderListTypePermitsViewModel;
import org.kaznalnrprograms.Accounting.OrderListTypePermits.Models.OrderTypeModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class OrderListTypePermitsController {
    private OrderListTypePermitsDaoImpl dao;

    public OrderListTypePermitsController(OrderListTypePermitsDaoImpl dao){this.dao = dao;}

    @GetMapping("/OrderListTypePermits/OrderListTypePermitsList")
    @PreAuthorize("GetActRight('OrderListTypePermits.dll','OrderListTypePermitsView')")
    public String OrderListTypePermitsList(){
        return "OrderListTypePermits/OrderListTypePermitsList :: OrderListTypePermitsList";
    }

    /**
     * Запуск окна редактирования
     * @return
     */
    @GetMapping("/OrderListTypePermits/OrderListTypePermitsEdit")
    @PreAuthorize("GetActRight('OrderListTypePermits.dll', 'OrderListTypePermitsChange')")
    public String OrderListTypePermitsEdit(){
        return "OrderListTypePermits/OrderListTypePermitsEdit :: OrderListTypePermitsEdit";
    }

    /**
     * Запуск окна выбора переодических реквезитов
     * @return
     */
    @GetMapping("/OrderListTypePermits/OrderListTypePermitsOpenModule")
    @PreAuthorize("GetActRight('OrderListTypePermits.dll', 'OrderListTypePermitsChange')")
    public String OrderListTypePermitsOpenModule(){
        return "OrderListTypePermits/OrderListTypePermitsOpenModule :: OrderListTypePermitsOpenModule";
    }

    /**
     * Заполнение верхнего грида (получение типов заявок)
     * @return
     * @throws Exception
     */
    @GetMapping("/OrderListTypePermits/getOrderTypeList")
    @PreAuthorize("GetActRight('OrderListTypePermits.dll','OrderListTypePermitsView')")
    public @ResponseBody List<OrderTypeModel> getOrderTypeList() throws Exception{
        return dao.getOrderTypeList();
    }

    /**
     * Заполнение нижнего грида
     * @param id
     * @param filter
     * @return
     * @throws Exception
     */
    @GetMapping("/OrderListTypePermits/getOrderListTypePerList")
    @PreAuthorize("GetActRight('OrderListTypePermits.dll','OrderListTypePermitsView')")
    public @ResponseBody List<OrderListTypePermitsViewModel> getOrderListTypePerList(int id, @RequestParam(required = false, defaultValue = "") String filter) throws Exception{
        return dao.getOrderListTypePerList(id,filter);
    }

    /**
     * Получени дополнительных реквизитов
     * @return
     * @throws Exception
     */
    @GetMapping("/OrderListTypePermits/getListParamsList")
    @PreAuthorize("GetActRight('OrderListTypePermits.dll','OrderListTypePermitsView')")
    public @ResponseBody List<ModuleListParamsModel> getListParamsList() throws Exception{
        return dao.getListParamsList();
    }

    /**
     * Получение реквизита
     * @param id
     * @return
     * @throws Exception
     */
    @GetMapping("/OrderListTypePermits/getListParamById")
    @PreAuthorize("GetActRight('OrderListTypePermits.dll','OrderListTypePermitsView')")
    public @ResponseBody String getListParamById(int id) throws Exception {
        return dao.getListParamById(id);
    }

    /**
     * Получение записи
     * @param id
     * @return
     * @throws Exception
     */
    @GetMapping("/OrderListTypePermits/getOrderListTypePerById")
    @PreAuthorize("GetActRight('OrderListTypePermits.dll','OrderListTypePermitsView')")
    public @ResponseBody OrderListTypePermitsViewModel getOrderListTypePerById(int id) throws Exception {
        return dao.getOrderListTypePerById(id);
    }

    /**
     * Проверка на уникальность
     * @param id
     * @return
     * @throws Exception
     */
    @GetMapping("/OrderListTypePermits/exists")
    @PreAuthorize("GetActRight('OrderListTypePermits.dll','OrderListTypePermitsView')")
    public @ResponseBody boolean exists(int id, int orderTypeId, int listParamId) throws Exception {
        return dao.exists(id, orderTypeId, listParamId);
    }

    /**
     * сохранение
     * @param model
     * @return
     * @throws Exception
     */
    @PostMapping("/OrderListTypePermits/save")
    @PreAuthorize("GetActRight('OrderListTypePermits.dll','OrderListTypePermitsChange')")
    public @ResponseBody int save(@RequestBody OrderListTypePermitsModel model) throws Exception {
        return dao.save(model);
    }

    /**
     * Удаление
     * @param id
     * @throws Exception
     */
    @PostMapping("/OrderListTypePermits/delete")
    @PreAuthorize("GetActRight('OrderListTypePermits.dll','OrderListTypePermitsChange')")
    public @ResponseBody String delete(Integer id) throws Exception {
        dao.delete(id);
        return "";
    }
}
