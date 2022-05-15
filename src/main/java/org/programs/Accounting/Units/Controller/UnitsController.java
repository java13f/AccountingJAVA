package org.kaznalnrprograms.Accounting.Units.Controller;

import org.kaznalnrprograms.Accounting.Units.Dao.UnitsDaoImpl;
import org.kaznalnrprograms.Accounting.Units.Models.GetUnitsModels;
import org.kaznalnrprograms.Accounting.Units.Models.UnitsModels;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.ui.Model;

import java.util.List;


@Controller
public class UnitsController {
    private UnitsDaoImpl dao;

    public UnitsController(UnitsDaoImpl dao){this.dao = dao;}

    /**
     * Открытие справочника
     * @param prefix
     * @param model
     * @return
     */
    @GetMapping("/Units/UnitsList")
    @PreAuthorize("GetActRight('Units.dll','UnitsView')")
    public String UnitsList(@RequestParam(required = false, defaultValue = "") String prefix, Model model){
        model.addAttribute("prefix", prefix);
        return "Units/UnitsList :: UnitsList";
    }


    /**
     * получение списка записей
     * @return
     * @throws Exception
     */
    @GetMapping("/Units/list")
    @PreAuthorize("GetActRight('Units.dll','UnitsView')")
    public @ResponseBody
    List<UnitsModels> list(boolean showDel) throws Exception{
        return dao.list(showDel);
    }

    /**
     * Открытие окна редактирования-добавления
     * @return
     */
    @GetMapping("/Units/UnitsFormEdit")
    @PreAuthorize("GetActRight('Units.dll', 'UnitsView')")
    public String ListTransEdit(){
        return "Units/UnitsFormEdit :: UnitsFormEdit";
    }

    /**
     * Проверка на уникальность полей Код,Наименование
     * @param id
     * @param name
     * @param code
     * @return
     * @throws Exception
     */
    @GetMapping("/Units/exists")
    @PreAuthorize("GetActRight('Units.dll','UnitsView')")
    public @ResponseBody boolean exists(int id, String name, String code) throws Exception{
        return dao.exists(id, name, code);
    }

    /**
     * Добавление-Изменение
     * @param obj
     * @return
     * @throws Exception
     */
    @PostMapping("/Units/save")
    @PreAuthorize("GetActRight('Units.dll','UnitsChange')")
    public @ResponseBody  int save(@RequestBody UnitsModels obj) throws Exception{
        return dao.save(obj);
    }
    /**
     * получение списка значекний при открытии на редактирование
     * @param id
     * @return
     * @throws Exception
     */
    @GetMapping("/Units/get")
    @PreAuthorize("GetActRight('Units.dll','UnitsView')")
    public @ResponseBody
    GetUnitsModels get(int id) throws Exception{
        return dao.get(id);
    }

    /**
     * Удаление
     * @param id
     * @return
     * @throws Exception
     */
    @PostMapping("/Units/delete")
    @PreAuthorize("GetActRight('Units.dll','UnitsChange')")
    public @ResponseBody String delete(int id) throws Exception{
        dao.delete(id);
        return "";
    }
}
