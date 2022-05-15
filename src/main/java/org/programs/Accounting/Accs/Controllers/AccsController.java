package org.kaznalnrprograms.Accounting.Accs.Controllers;

import org.kaznalnrprograms.Accounting.Accs.Interfaces.IAccs;
import org.kaznalnrprograms.Accounting.Accs.Models.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@Controller
public class AccsController
{
    private IAccs dao;

    public AccsController(IAccs dao)
    {
        this.dao = dao;
    }

    @GetMapping("/Accs/list")
    @PreAuthorize("GetActRight('Accs.dll','AccsView')")
    public @ResponseBody
    List<AccsViewModel> list(@RequestParam(required = false, defaultValue = "false")boolean del) throws Exception
    {
        return dao.getAccsList(del);
    }

    @GetMapping("/Accs/AccsFormList")
    @PreAuthorize("GetActRight('Accs.dll','AccsView')")
    public String AccsFormList(@RequestParam(required = false, defaultValue = "")String prefix, Model model)
    {
        model.addAttribute("prefix", prefix);
        return "Accs/AccsFormList :: AccsFormList";
    }

    @GetMapping("/Accs/AccsFormEdit")
    @PreAuthorize("GetActRight('Accs.dll','AccsView')")
    public String AccsFormEdit()
    {
        return "Accs/AccsFormEdit :: AccsFormEdit";
    }

    @GetMapping("/Accs/GetAcc")
    @PreAuthorize("GetActRight('Accs.dll','AccsView')")
    public @ResponseBody
    AccsModel GetAcc(int id) throws Exception{
        return dao.getAcc(id);
    }

    @PostMapping("/Accs/Delete")
    @PreAuthorize("GetActRight('Accs.dll','AccsChange')")
    public @ResponseBody String Delete(int id) throws Exception{
        dao.delete(id);
        return "";
    }

    @PostMapping("/Accs/Save")
    @PreAuthorize("GetActRight('Accs.dll','AccsChange')")
    public @ResponseBody int Save(@RequestBody AccsModel model) throws Exception{
        return dao.save(model);
    }

    @GetMapping("/Accs/Exists")
    @PreAuthorize("GetActRight('Accs.dll','AccsView')")
    public @ResponseBody boolean exists(int id, String code) throws Exception{
        return dao.exists(id, code);
    }
}
