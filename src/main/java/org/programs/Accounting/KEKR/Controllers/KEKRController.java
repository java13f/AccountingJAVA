package org.kaznalnrprograms.Accounting.KEKR.Controllers;

import org.kaznalnrprograms.Accounting.KEKR.Models.*;
import org.kaznalnrprograms.Accounting.KEKR.Interfaces.IKEKR;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@Controller
public class KEKRController
{
    private IKEKR dao;

    public KEKRController(IKEKR dao)
    {
        this.dao = dao;
    }

    @GetMapping("/KEKR/list")
    @PreAuthorize("GetActRight('KEKR.dll','KEKRView')")
    public @ResponseBody
    List<KEKRViewModel> list(@RequestParam(required = false, defaultValue = "false")boolean del) throws Exception
    {
        return dao.getKEKRList(del);
    }

    @GetMapping("/KEKR/KEKRFormList")
    @PreAuthorize("GetActRight('KEKR.dll','KEKRView')")
    public String KEKRFormList(@RequestParam(required = false, defaultValue = "")String prefix, Model model)
    {
        model.addAttribute("prefix", prefix);
        return "KEKR/KEKRFormList :: KEKRFormList";
    }

    @GetMapping("/KEKR/KEKRFormEdit")
    @PreAuthorize("GetActRight('KEKR.dll','KEKRView')")
    public String KEKRFormEdit()
    {
        return "KEKR/KEKRFormEdit :: KEKRFormEdit";
    }

    @GetMapping("/KEKR/GetRec")
    @PreAuthorize("GetActRight('KEKR.dll','KEKRView')")
    public @ResponseBody
    KEKRModel GetRec(int id) throws Exception{
        return dao.getRec(id);
    }

    @PostMapping("/KEKR/Delete")
    @PreAuthorize("GetActRight('KEKR.dll','KEKRChange')")
    public @ResponseBody String Delete(int id) throws Exception{
        dao.delete(id);
        return "";
    }

    @PostMapping("/KEKR/Save")
    @PreAuthorize("GetActRight('KEKR.dll','KEKRChange')")
    public @ResponseBody int Save(@RequestBody KEKRModel model) throws Exception{
        return dao.save(model);
    }

    @GetMapping("/KEKR/Exists")
    @PreAuthorize("GetActRight('KEKR.dll','KEKRView')")
    public @ResponseBody boolean exists(int id, String code) throws Exception{
        return dao.exists(id, code);
    }
}
