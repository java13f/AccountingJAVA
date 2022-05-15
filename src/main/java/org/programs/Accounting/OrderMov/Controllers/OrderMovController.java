package org.kaznalnrprograms.Accounting.OrderMov.Controllers;

import org.kaznalnrprograms.Accounting.OrderMov.Interfaces.IOrderMovDao;
import org.kaznalnrprograms.Accounting.OrderMov.Models.ObjectsModel;
import org.kaznalnrprograms.Accounting.OrderMov.Models.OrderMovDetailsModel;
import org.kaznalnrprograms.Accounting.OrderMov.Models.OrderMovGridModel;
import org.kaznalnrprograms.Accounting.OrderMov.Models.SaveModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class OrderMovController {
    private IOrderMovDao dOrderMov;

    public OrderMovController(IOrderMovDao dOrderMov) {
        this.dOrderMov = dOrderMov;
    }
//    List<FieldsPermits> PermitsList;

    /**
     * Получить частичное представление основного окна справочника кодов казначейства
     *
     * @param prefix - приставка для идентификаторов
     * @param model  - модель для передачи параметров в представление
     * @return
     */
    @GetMapping("/OrderMov/OrderMovFormList")
    @PreAuthorize("GetActRight('OrderMov.dll','OrderMovView')")
    public String OrderMovFormList(@RequestParam(required = false, defaultValue = "") String prefix, Model model) {
        //model.addAttribute("prefix", prefix);
        return "OrderMov/OrderMovFormList :: OrderMovFormList";
    }

    /**
     * загрузить данные для грида
     *
     * @param orderid - id записи для редактирования
     * @return
     * @throws Exception
     */
    @GetMapping("/OrderMov/GetData")
    @PreAuthorize("GetActRight('OrderMov.dll','OrderMovView')")
    public @ResponseBody
    List<ObjectsModel> gridload(int orderid, String date) throws Exception {
        return dOrderMov.gridload(orderid, date);
    }

    /**
     * проверка номера документа
     *
     * @param orderno
     * @param date
     * @return
     * @throws Exception
     */
    @GetMapping("/OrderMov/checkno")
    @PreAuthorize("GetActRight('OrderMov.dll','OrderMovView')")
    public @ResponseBody
    String checkno(String orderno, String date) throws Exception {
        return dOrderMov.checkno(orderno, date);
    }

    /**
     * загрузка данных для отображения деталей заявки
     *
     * @param
     * @return
     * @throws Exception
     */
    @GetMapping("/OrderMov/getdetails")
    @PreAuthorize("GetActRight('OrderMov.dll','OrderMovView')")
    public @ResponseBody
    OrderMovDetailsModel getdetails(int orderid,String ordertypecode) throws Exception {
        return dOrderMov.getdetails(orderid,ordertypecode);
    }


    /**
     * получить имя пользователя
     *
     * @return
     * @throws Exception
     */
    @GetMapping("/OrderMov/getusername")
    @PreAuthorize("GetActRight('OrderMov.dll','OrderMovView')")
    public @ResponseBody
    String getusername() throws Exception {
        return dOrderMov.getusername();
    }

    /**
     * ПОЛУЧИТЬ НОМЕР ДЛЯ ЗАЯВКИ АВТОМАТИЧЕСКИ
     *
     * @param date
     * @return
     * @throws Exception
     */
    @GetMapping("/OrderMov/getNo")
    @PreAuthorize("GetActRight('OrderMov.dll','OrderMovView')")
    public @ResponseBody
    String getno(String date) throws Exception {
        return dOrderMov.getno(date);
    }

    /**
     * проверяет имеет ли пользователь право использовать выбранного инициатора
     */
    @GetMapping("/OrderMov/checkInit")
    @PreAuthorize("GetActRight('OrderMov.dll','OrderMovView')")
    public @ResponseBody
    String checkinit(int uid) throws Exception {
        return dOrderMov.checkinit(uid);
    }

    /**
     * проверка не выведен ли предмет из эксплуатации
     *
     * @param smodel
     * @return
     * @throws Exception
     */
    @PostMapping("/OrderMov/checkobjdate")
    @PreAuthorize("GetActRight('OrderMov.dll','OrderMovView')")
    public @ResponseBody
    String checkobjdate(@RequestBody SaveModel smodel) throws Exception {
        return dOrderMov.checkobjdate(smodel);
    }

    /**
     * сохранение заявок
     *
     * @param datas
     * @return
     * @throws Exception
     */
    @PostMapping("/OrderMov/saveupdate")
    @PreAuthorize("GetActRight('OrderMov.dll','OrderMovChange')")
    public @ResponseBody
    int saveupdate(@RequestBody SaveModel datas) throws Exception {
        return dOrderMov.saveupdate(datas);
    }

    /**
     * проверка местоположения объекта
     *
     * @param datas
     * @return
     * @throws Exception
     */
    @PostMapping("/OrderMov/checklocat")
    @PreAuthorize("GetActRight('OrderMov.dll','OrderMovView')")
    public @ResponseBody
    String checklocat(@RequestBody SaveModel datas) throws Exception {
        return dOrderMov.checklocat(datas);
    }


    @PostMapping("/OrderMov/checkobjowner")
    @PreAuthorize("GetActRight('OrderMov.dll','OrderMovView')")
    public @ResponseBody
    boolean checkobjowner(@RequestBody List<ObjectsModel> objects) throws Exception {
        return dOrderMov.checkobjowner(objects);
    }

    @GetMapping("/OrderMov/getobj")
    @PreAuthorize("GetActRight('OrderMov.dll','OrderMovView')")
    public @ResponseBody
    ObjectsModel getobj(String objid, String date) throws Exception {
        return dOrderMov.getobj(objid, date);
    }

    @GetMapping("/OrderMov/checkdate")
    @PreAuthorize("GetActRight('OrderMov.dll','OrderMovView')")
    public @ResponseBody
    String checkdate(String date, String dateonstart) throws Exception {
        return dOrderMov.checkdate(date, dateonstart);
    }

    /**
     * Запрос для получения строки в формате id = name (универсальный)
     *
     * @param table - Имя таблицы
     * @param id    - Идентификатор записи в таблице
     * @return
     * @throws Exception
     */
    @GetMapping("/OrderMov/universalDataAcquisition")
    @PreAuthorize("GetActRight('OrderMov.dll','OrderMovView')")
    public @ResponseBody
    String universalDataAcquisition(String table, int id) throws Exception {
        return dOrderMov.universalDataAcquisition(table, id);
    }
}


