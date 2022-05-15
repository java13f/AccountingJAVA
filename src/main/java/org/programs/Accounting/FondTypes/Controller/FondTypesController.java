package org.kaznalnrprograms.Accounting.FondTypes.Controller;

import org.kaznalnrprograms.Accounting.FondTypes.Dao.FondTypesDaoImpl;
import org.kaznalnrprograms.Accounting.FondTypes.Models.FondTypesModel;

import org.kaznalnrprograms.Accounting.FondTypes.Models.GetFondTypesModel;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class FondTypesController {
    private FondTypesDaoImpl dao;
    public FondTypesController(FondTypesDaoImpl dao){this.dao = dao;}
    /**
     * Открытие справочника
     * @param prefix
     * @param model
     * @return
     */
    @GetMapping("/FondTypes/FondTypesList")
    @PreAuthorize("GetActRight('FondTypes.dll','FondTypesView')")
    public String FondTypesList(@RequestParam(required = false, defaultValue = "") String prefix, Model model){
        model.addAttribute("prefix", prefix);
        return "FondTypes/FondTypesList :: FondTypesList";
    }
    /**
     * получение списка записей
     * @return
     * @throws Exception
     */
    @GetMapping("/FondTypes/list")
    @PreAuthorize("GetActRight('FondTypes.dll','FondTypesView')")
    public @ResponseBody
    List<FondTypesModel> list(boolean showDel) throws Exception{
        return dao.list(showDel);
    }
    /**
     * Открытие окна редактирования-добавления
     * @return
     */
    @GetMapping("/FondTypes/FondTypesEdit")
    @PreAuthorize("GetActRight('FondTypes.dll', 'FondTypesView')")
    public String ListTransEdit(){
        return "FondTypes/FondTypesEdit :: FondTypesEdit";
    }

    @GetMapping("/FondTypes/get")
    @PreAuthorize("GetActRight('FondTypes.dll','FondTypesView')")
    public @ResponseBody
    GetFondTypesModel get(int id) throws Exception{
        return dao.get(id);
    }
    @PostMapping("/FondTypes/delete")
    @PreAuthorize("GetActRight('FondTypes.dll','FondTypesChange')")
    public @ResponseBody String delete(int id) throws Exception{
        dao.delete(id);
        return "";
    }
    /**
     * Проверка на уникальность полей Код,Наименование
     * @param id
     * @param name
     * @param code
     * @return
     * @throws Exception
     */
    @GetMapping("/FondTypes/exists")
    @PreAuthorize("GetActRight('FondTypes.dll','FondTypesView')")
    public @ResponseBody boolean exists(int id, String name, String code) throws Exception{
        return dao.exists(id, name, code);
    }

    /**
     * Добавление-Изменение
     * @param obj
     * @return
     * @throws Exception
     */
    @PostMapping("/FondTypes/save")
    @PreAuthorize("GetActRight('FondTypes.dll','FondTypesChange')")
    public @ResponseBody  int save(@RequestBody FondTypesModel obj) throws Exception{
        return dao.save(obj);
    }
}
