package org.kaznalnrprograms.Accounting.jrWearCalc.Controllers;

import org.kaznalnrprograms.Accounting.jrWearCalc.Models.UserModel;
import org.kaznalnrprograms.Accounting.jrWearCalc.Interfaces.IjrWearCalcDao;
import org.kaznalnrprograms.Accounting.jrWearCalc.Models.JrKterModel;
import org.kaznalnrprograms.Accounting.jrWearCalc.Models.JrWearCalcSaveModel;
import org.kaznalnrprograms.Accounting.jrWearCalc.Models.JrWearCalcViewModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class JrWearCalcController
{
    private IjrWearCalcDao dao;
    public JrWearCalcController(IjrWearCalcDao dao){
        this.dao = dao;
    }


    @GetMapping("/jrWearCalc/jrWearCalc")
    @PreAuthorize("GetActRight('jrWearCalc','jrWearCalcView')")
    public String jrWearCalc(@RequestParam(required = false, defaultValue = "") String prefix, Model model){
        model.addAttribute("prefix", prefix);
        return "jrWearCalc/jrWearCalc :: jrWearCalc";
    }


    /**
     * Получить список объектов
     */
    @GetMapping("/jrWearCalc/GetRecords")
    @PreAuthorize("GetActRight('jrWearCalc','jrWearCalcView')")
    public @ResponseBody List<JrWearCalcViewModel> GetRecords(Integer kterId) throws Exception {
        return dao.GetRecords(kterId);
    }

    /**
     * Получить список территорий
     */
    @GetMapping("/jrWearCalc/GetKters")
    @PreAuthorize("GetActRight('jrWearCalc','jrWearCalcView')")
    public @ResponseBody
    List<JrKterModel> GetKters() throws Exception {
        return dao.GetKters();
    }

    /**
     * Получить список территорий
     */
    @GetMapping("/jrWearCalc/IsDayOpen")
    @PreAuthorize("GetActRight('jrWearCalc','jrWearCalcView')")
    public @ResponseBody
    Integer IsDayOpen(String date) throws Exception {
        return dao.IsDayOpen(date);
    }

    /**
     * Проверить все заявки в рамках текущего года, исключая дату которая была установлена
     * @param selectedDate
     * @param kterId
     * @return
     * @throws Exception
     */
    @GetMapping("/jrWearCalc/WearUntilSelectedDate")
    @PreAuthorize("GetActRight('jrWearCalc','jrWearCalcView')")
    public @ResponseBody Integer WearUntilSelectedDate(String selectedDate, Integer kterId, Integer stts, Integer year) throws Exception {
        return dao.WearUntilSelectedDate(selectedDate, kterId, stts, year);
    }

    /**
     * Проверить был ли посчитан износ на выбранную дату
     * @param selectedDate
     * @param kterId
     * @return
     * @throws Exception
     */
    @GetMapping("/jrWearCalc/WearOnSelectedDate")
    @PreAuthorize("GetActRight('jrWearCalc','jrWearCalcView')")
    public @ResponseBody Integer WearOnSelectedDate(String selectedDate, Integer kterId, Integer stts) throws Exception {
        return dao.WearOnSelectedDate(selectedDate, kterId, stts);
    }

    /**
     * Проверить был ли посчитан износ на выбранную дату
     * @param model
     * @return
     * @throws Exception
     */
    @PostMapping("/jrWearCalc/Calc")
    @PreAuthorize("GetActRight('jrWearCalc','jrWearCalcRun')")
    public @ResponseBody int Calc(@RequestBody JrWearCalcSaveModel model) throws Exception {
        return dao.Calc(model);
    }

    /**
     * Получить пользователя
     * @return
     * @throws Exception
     */
    @GetMapping("/jrWearCalc/GetUser")
    @PreAuthorize("GetActRight('jrWearCalc','jrWearCalcView')")
    public @ResponseBody
    UserModel GetUser() throws Exception
    {
        return dao.getUser();
    }

    /**
     * Получить последнюю добавленнную запись
     * @return
     * @throws Exception
     */
    @GetMapping("/jrWearCalc/GetLastAddedRec")
    @PreAuthorize("GetActRight('jrWearCalc','jrWearCalcView')")
    public @ResponseBody
    Integer GetLastAddedRec(String date, Integer stts) throws Exception
    {
        return dao.getLastAddedRec(date, stts);
    }

    @GetMapping("/jrWearCalc/GetActRight")
    @PreAuthorize("GetActRight('jrWearCalc','jrWearCalcView')")
    public @ResponseBody
    String GetActRight() throws Exception
    {
        return dao.getActRight();
    }
}
