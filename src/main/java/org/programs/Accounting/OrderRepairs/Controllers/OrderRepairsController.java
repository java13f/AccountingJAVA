package org.kaznalnrprograms.Accounting.OrderRepairs.Controllers;

import org.kaznalnrprograms.Accounting.OrderRepairs.Interfaces.IOrderRepairs;
import org.kaznalnrprograms.Accounting.OrderRepairs.Models.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@Controller
public class OrderRepairsController
{
    private IOrderRepairs dao;

    public OrderRepairsController(IOrderRepairs dao)
    {
        this.dao = dao;
    }

    /**
     * Сохранение/Обновление заявки на ремонт
     * @param model
     * @return
     * @throws Exception
     */
    @PostMapping("/OrderRepairs/Save")
    @PreAuthorize("GetActRight('Orders.dll','ChangeOrders')")
    public @ResponseBody int Save(@RequestBody OrderRepairs model) throws Exception{
        return dao.save(model);
    }

    /**
     * Получить следующий номер заявки
     * @param Date
     * @return
     * @throws Exception
     */
    @GetMapping("/OrderRepairs/GetMaxOrderNumber")
    @PreAuthorize("GetActRight('Orders.dll','ViewOrders')")
    public @ResponseBody String getMaxOrderNumber(String Date) throws Exception
    {
        return dao.getMaxOrderNumber(Date);
    }

    /**
     * Получить доп. реквизит (телефон)
      * @param ParamCode
     * @param TaskCode
     * @return
     * @throws Exception
     */
    @GetMapping("/OrderRepairs/GetIdListparams")
    @PreAuthorize("GetActRight('Orders.dll','ViewOrders')")
    public @ResponseBody String getIdListparams(String ParamCode, String TaskCode) throws Exception
    {
        return dao.getIdListparams(ParamCode, TaskCode);
    }

    /**
     * Получить флаг обязательности доп. реквезита
     * @param ParamCode
     * @param TaskCode
     * @return
     * @throws Exception
     */
    @GetMapping("/OrderRepairs/CheckPropsAdditional")
    @PreAuthorize("GetActRight('Orders.dll','ViewOrders')")
    public @ResponseBody ListparamsModel checkPropsAdditional(String ParamCode, String TaskCode) throws Exception
    {
        return dao.checkPropsAdditional(ParamCode, TaskCode);
    }

    /**
     * Проверка даты на открытость
     * @param Date
     * @return
     * @throws Exception
     */
    @GetMapping("/OrderRepairs/CheckDate")
    @PreAuthorize("GetActRight('Orders.dll','ViewOrders')")
    public @ResponseBody List<DateOpenModel> checkDate(String Date) throws Exception
    {
        return dao.checkDate(Date);
    }

    /**
     * Получить пользователя и его подразделение
     * @param Id
     * @return
     * @throws Exception
     */
    @GetMapping("/OrderRepairs/GetUserDepName")
    @PreAuthorize("GetActRight('Orders.dll','ViewOrders')")
    public @ResponseBody
    UserModel getUserDepName(int Id) throws Exception
    {
        return dao.getUserDepName(Id);
    }

    /**
     * Получить имя объекта и инв.номер
     * @param Id
     * @return
     * @throws Exception
     */
    @GetMapping("/OrderRepairs/GetObject")
    @PreAuthorize("GetActRight('Orders.dll','ViewOrders')")
    public @ResponseBody ObjsModel getObject(int Id) throws Exception
    {
        return dao.getObject(Id);
    }

    @GetMapping("/OrderRepairs/OrderRepairsForm")
    @PreAuthorize("GetActRight('Orders.dll','ViewOrders')")
    public String OrderRepairsForm()
    {
        return "OrderRepairs/OrderRepairsForm :: OrderRepairsForm";
    }

    /**
     * Получить данные заявки по Id
     * @param OrderId
     * @return
     * @throws Exception
     */
    @GetMapping("/OrderRepairs/GetRec")
    @PreAuthorize("GetActRight('Orders.dll','ViewOrders')")
    public @ResponseBody OrderRepairs GetRec(int OrderId) throws Exception
    {
        return dao.getRec(OrderId);
    }

    /**
     * Получить список проблем
     * @return
     * @throws Exception
     */
    @GetMapping("/OrderRepairs/GetListProblems")
    @PreAuthorize("GetActRight('Orders.dll','ViewOrders')")
    public @ResponseBody
    List<ProblemsModel> GetListProblems() throws Exception
    {
        return dao.getListProblems();
    }

    /**
     * Получить список доступности полей заявок
     * @param OrderTypeId
     * @return
     * @throws Exception
     */
    @GetMapping("/OrderRepairs/GetListSttsOrder")
    @PreAuthorize("GetActRight('Orders.dll','ViewOrders')")
    public @ResponseBody
    List<SttsOrderModel> GetListSttsOrder(int OrderTypeId, int Stts) throws Exception
    {
        return dao.getListSttsOrder(OrderTypeId, Stts);
    }

    /**
     * Получить пользователя
     * @return
     * @throws Exception
     */
    @GetMapping("/OrderRepairs/GetUser")
    @PreAuthorize("GetActRight('Orders.dll','ViewOrders')")
    public @ResponseBody
    UserModel GetUser() throws Exception
    {
        return dao.getUser();
    }


    /**
     * Получить пользователя
     * @return
     * @throws Exception
     */
    @GetMapping("/OrderRepairs/GetProblem")
    @PreAuthorize("GetActRight('Orders.dll','ViewOrders')")
    public @ResponseBody
    String GetProblem(int id) throws Exception
    {
        return dao.getProblem(id);
    }
}