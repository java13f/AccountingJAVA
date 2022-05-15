package org.kaznalnrprograms.Accounting.Today.Controllers;

import org.kaznalnrprograms.Accounting.Today.Dao.TodayUsersDaoImpl;
import org.kaznalnrprograms.Accounting.Today.Models.TodayUsers;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
public class TodayUsersController
{
    private TodayUsersDaoImpl dao;

    public TodayUsersController(TodayUsersDaoImpl dao)
    {
        this.dao = dao;
    }

    @GetMapping("/TodayUsers/getTodayUsersList")
    @PreAuthorize("GetActRight('Today.dll','TodayView')")
    public @ResponseBody
    List<TodayUsers> getTodayUsersList(int todayid) throws Exception
    {
        return dao.getTodayUsersList(todayid);
    }

    @PostMapping("/TodayUsers/deleteTodayUsers")
    @PreAuthorize("GetActRight('Today.dll','TodayChange')")
    public @ResponseBody
    String deleteTodayUsers(int id) throws Exception
    {
        dao.deleteTodayUsers(id);
        return "";
    }

    @PostMapping("/TodayUsers/saveTodayUsers")
    @PreAuthorize("GetActRight('Today.dll','TodayChange')")
    public @ResponseBody
    int saveTodayUsers(@RequestBody TodayUsers todayusers) throws Exception
    {
        return dao.saveTodayUsers(todayusers);
    }

    @GetMapping("/TodayUsers/existsUserInDay")
    @PreAuthorize("GetActRight('Today.dll','TodayView')")
    public @ResponseBody
    boolean existsUserInDay(int todayid, int userid) throws Exception
    {
        return dao.existsUserInDay(todayid, userid);
    }

}
