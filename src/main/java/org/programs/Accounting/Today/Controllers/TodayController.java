package org.kaznalnrprograms.Accounting.Today.Controllers;

import org.kaznalnrprograms.Accounting.Today.Dao.TodayDaoImpl;
import org.kaznalnrprograms.Accounting.Today.Models.Today;
import org.kaznalnrprograms.Accounting.Today.Models.TodayOpenClose;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class TodayController
{
    private TodayDaoImpl dao;

    public TodayController(TodayDaoImpl dao)
    {
        this.dao = dao;
    }

    @GetMapping("/Today/getTodayList")
    @PreAuthorize("GetActRight('Today.dll','TodayView')")
    public @ResponseBody
    List<Today> getTodayList() throws Exception
    {
        return dao.getTodayList();
    }

    @GetMapping("/Today/TodayFormList")
    @PreAuthorize("GetActRight('Today.dll','TodayView')")
    public String TodayFormList(@RequestParam(required = false, defaultValue = "")String prefix, Model model)
    {
        model.addAttribute("prefix", prefix);
        return "Today/TodayFormList :: TodayFormList";
    }

    @GetMapping("/Today/TodayFormEdit")
    @PreAuthorize("GetActRight('Today.dll','TodayView')")
    public String TodayFormEdit()
    {
        return "Today/TodayFormEdit :: TodayFormEdit";
    }

    @GetMapping("/Today/TodayFormOpenClose")
    @PreAuthorize("GetActRight('Today.dll','TodayView')")
    public String TodayFormOpenClose()
    {
        return "Today/TodayFormOpenClose :: TodayFormOpenClose";
    }


    @GetMapping("/Today/getTodayRecord")
    @PreAuthorize("GetActRight('Today.dll','TodayView')")
    public @ResponseBody
    Today getTodayRecord(int id) throws Exception
    {
        return dao.getTodayRecord(id);
    }

    @PostMapping("/Today/deleteToday")
    @PreAuthorize("GetActRight('Today.dll','TodayChange')")
    public @ResponseBody
    String deleteToday(int id) throws Exception
    {
        return dao.deleteToday(id);
    }

    @PostMapping("/Today/saveToday")
    @PreAuthorize("GetActRight('Today.dll','TodayChange')")
    public @ResponseBody
    int saveToday(@RequestBody Today today) throws Exception
    {
        return dao.saveToday(today);
    }


    @PostMapping("/Today/addDays")
    @PreAuthorize("GetActRight('Today.dll','TodayChange')")
    public @ResponseBody
    void addDays(@RequestBody TodayOpenClose toc) throws Exception
    {
       dao.addDays(toc);
    }

    @GetMapping("/Today/existsDay")
    @PreAuthorize("GetActRight('Today.dll','TodayView')")
    public @ResponseBody
    boolean existsDay(int id, String date) throws Exception
    {
        return dao.existsDay(id, date);
    }


}
