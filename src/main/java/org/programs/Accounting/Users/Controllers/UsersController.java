package org.kaznalnrprograms.Accounting.Users.Controllers;

import org.kaznalnrprograms.Accounting.Users.Interfaces.IUsersDao;
import org.kaznalnrprograms.Accounting.Users.Models.UsersViewModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class UsersController {
    private IUsersDao dao;
    public UsersController(IUsersDao dao){
        this.dao = dao;
    }

    @GetMapping("/Users/UsersFormList")
    @PreAuthorize("GetActRight('Users.dll','UsersView')")
    public String UsersFormList(@RequestParam(required = false, defaultValue = "") String prefix, Model model){
        model.addAttribute("prefix", prefix);
        return "Users/UsersFormList :: UsersFormList";
    }

    /**
     * Получить список казначейств
     */
    @GetMapping("/Users/List")
    @PreAuthorize("GetActRight('Users.dll','UsersView')")
    public @ResponseBody List<UsersViewModel> List(@RequestParam(required = false, defaultValue = "false") boolean showDel,
                                                   @RequestParam(required = false, defaultValue = "") String filter) throws Exception {
        List<UsersViewModel> list = dao.List(showDel, filter);
        return list;
    }
}
