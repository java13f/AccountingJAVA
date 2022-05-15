package org.kaznalnrprograms.Accounting.OrderFields.Controllers;

import org.kaznalnrprograms.Accounting.OrderFields.Dao.OrderFieldsDaoImpl;
import org.kaznalnrprograms.Accounting.OrderFields.Interfaces.*;
import org.kaznalnrprograms.Accounting.OrderFields.Models.OrderFieldsModel;
import org.kaznalnrprograms.Accounting.OrderFields.Models.OrderFieldsViewModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@Controller
public class OrderFieldsController {
    private IOrderFieldsDao  daoOrderFields;

    public OrderFieldsController (IOrderFieldsDao daoOrderFields){
        this.daoOrderFields = daoOrderFields;
    }

    /**
     * Получить частичное представление основного окна справочника кодов заявок
     * @param prefix - приставка для идентификаторов
     * @param model - модель для передачи параметров в представление
     * @return
     */
    @GetMapping("/OrderFields/OrderFieldsFormList")
    @PreAuthorize("GetActRight('OrderFields.dll','OrderFieldsView')")
    public String OrderFieldsFormList(@RequestParam(required = false, defaultValue = "") String prefix, Model model){
        model.addAttribute("prefix", prefix);
        return "OrderFields/OrderFieldsFormList :: OrderFieldsFormList";
    }
    /**
     * Получить частичное представление окна добавления/изменения записи
     * @return
     */
    @GetMapping("/OrderFields/OrderFieldsFormEdit")
    @PreAuthorize("GetActRight('OrderFields.dll', 'OrderFieldsView')")
    public String OrderFieldsFormList(){
        return "OrderFields/OrderFieldsFormEdit :: OrderFieldsFormEdit";
    }



    /**
     * Получение списка полей заявки
     * @param filter
     * @param showDel
     * @return
     * @throws Exception
     */
    @GetMapping("/OrderFields/list")
    @PreAuthorize("GetActRight('OrderFields.dll','OrderFieldsView')")
    public @ResponseBody List<OrderFieldsViewModel> list(
                    @RequestParam(required=false, defaultValue="") String filter,
                    @RequestParam(required=false, defaultValue="false") boolean showDel
        ) throws Exception{  return daoOrderFields.list(filter, showDel); }

    /**
     *Получение записи для просмотра/редактирования
     * @param id
     * @return
     * @throws Exception
     */
    @GetMapping("OrderFields/get")
    @PreAuthorize("GetActRight('OrderFields.dll','OrderFieldsView')")
    public @ResponseBody OrderFieldsModel get( int id)throws Exception {
        return daoOrderFields.get(id);
    }

    /**
     * Проверка существования записи
     * @param id
     * @param code
     * @return
     * @throws Exception
     */
    @GetMapping("OrderFields/exists")
    @PreAuthorize("GetActRight('OrderFields.dll','OrderFieldsView')")
    public @ResponseBody boolean exists (int id, String code) throws Exception{
        return daoOrderFields.exists(id,code);
    }

    /**
     * Добавить /изменить запись
     * @param ofModel
     * @return
     * @throws Exception
     */
    @PostMapping("OrderFields/save")
    @PreAuthorize("GetActRight('OrderFields.dll','OrderFieldsChange')")
    public @ResponseBody int save (@RequestBody OrderFieldsModel ofModel) throws Exception{
        return daoOrderFields.save(ofModel);
    }

    /**
     * Удаление записи
     * @param id
     * @return
     * @throws Exception
     */
    @PostMapping("OrderFields/delete")
    @PreAuthorize("GetActRight('OrderFields.dll','OrderFieldsChange')")
    public @ResponseBody String delete (Integer id) throws Exception{
        daoOrderFields.delete(id);
        return "";
    }



}
