package org.kaznalnrprograms.Accounting.OrderTypes.Controllers;

import org.kaznalnrprograms.Accounting.OrderTypes.Interfaces.IOrderTypesDao;
import org.kaznalnrprograms.Accounting.OrderTypes.Models.OrderTypesModel;
import org.kaznalnrprograms.Accounting.OrderTypes.Models.OrderTypesViewModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class OrderTypesController
{
    private IOrderTypesDao dao;

    public OrderTypesController(IOrderTypesDao dao)
    {
        this.dao = dao;
    }

    /**
     * Получить список типов заявок
     * @param showDel
     * @return
     * @throws Exception
     */
    @GetMapping("/OrderTypes/list")
    @PreAuthorize("GetActRight('OrderTypes.dll', 'OrderTypesView')")
    public @ResponseBody
    List<OrderTypesViewModel> viewList(@RequestParam(required = false, defaultValue = "false") boolean showDel) throws Exception
    {
        return dao.viewList(showDel);
    }

    @GetMapping("/OrderTypes/OrderTypesFormList")
    @PreAuthorize("GetActRight('OrderTypes.dll', 'OrderTypesView')")
    public String OrderTypesFormList(@RequestParam(required = false, defaultValue = "") String prefix, Model model)
    {
        model.addAttribute("prefix", prefix);
        return "OrderTypes/OrderTypesFormList :: OrderTypesFormList";
    }

    /**
     * Проверить существование территории
     * @param id - идентификатор типа заявки (для новых -1)
     * @param code - код типа заявки
     * @return
     * @throws Exception
     */
    @GetMapping("/OrderTypes/exists")
    @PreAuthorize("GetActRight('OrderTypes.dll','OrderTypesView')")
    public @ResponseBody boolean exists(int id, String code) throws Exception{
        return dao.exists(id, code);
    }

    /**
     * Добавить / Изменить тип заявки
     * @param ordertypes - модель типа заявки
     * @return
     * @throws Exception
     */
    @PostMapping("/OrderTypes/save")
    @PreAuthorize("GetActRight('OrderTypes.dll','OrderTypesChange')")
    public @ResponseBody  int save(@RequestBody OrderTypesModel ordertypes) throws Exception{
        return dao.save(ordertypes);
    }

    /**
     * Получить частичное представление окна добавления/изменения записи
     * @return
     */
    @GetMapping("/OrderTypes/OrderTypesFormEdit")
    @PreAuthorize("GetActRight('OrderTypes.dll', 'OrderTypesView')")
    public String OrderTypesFormEdit(){
        return "OrderTypes/OrderTypesFormEdit :: OrderTypesFormEdit";
    }

    /**
     * Функция получения типа заявки для просмотра/изменения
     * @param id - идентификатор типа заявки
     * @return
     * @throws Exception
     */
    @GetMapping("/OrderTypes/get")
    @PreAuthorize("GetActRight('OrderTypes.dll','OrderTypesView')")
    public @ResponseBody
    OrderTypesModel get(int id) throws Exception {
        return dao.get(id);
    }

    /**
     * Удаление типа заявок
     * @param id - идентификатор типа заявки
     * @throws Exception
     */
    @PostMapping("/OrderTypes/delete")
    @PreAuthorize("GetActRight('OrderTypes.dll','OrderTypesChange')")
    public @ResponseBody String delete(Integer id) throws Exception{

        dao.delete(id);
        return "";
    }

}
