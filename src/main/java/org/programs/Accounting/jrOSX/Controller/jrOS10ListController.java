package org.kaznalnrprograms.Accounting.jrOSX.Controller;

import org.kaznalnrprograms.Accounting.jrOSX.Intefaces.IjrOS10DirectoryDao;
import org.kaznalnrprograms.Accounting.jrOSX.Models.jrOS10Models;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
public class jrOS10ListController {
    public IjrOS10DirectoryDao dao;
    public jrOS10ListController(IjrOS10DirectoryDao dao){
        this.dao = dao;
    }

    @GetMapping("/jrOSX/jrOSXList")
    @PreAuthorize("GetActRight('jrOSX', 'jrOSXView')")
    public String jrOSXList(@RequestParam(required = false, defaultValue = "") String prefix, Model model) {
        model.addAttribute("prefix", prefix);
        return "jrOSX/jrOSXList::jrOSXList";
    }

    @GetMapping("/jrOSX/ListAccs")
    @PreAuthorize("GetActRight('jrOSX','jrOSXView')")
    public @ResponseBody
    List<jrOS10Models> ListAccs() throws Exception {
        return dao.ListAccs();
    }

    @GetMapping("/jrOSX/GetKter")
    @PreAuthorize("GetActRight('jrOSX','jrOSXView')")
    public @ResponseBody String GetKter(int Id) throws Exception{
        return dao.GetKter(Id);
    }


}
