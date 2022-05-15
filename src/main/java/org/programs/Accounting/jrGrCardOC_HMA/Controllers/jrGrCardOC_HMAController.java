package org.kaznalnrprograms.Accounting.jrGrCardOC_HMA.Controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.kaznalnrprograms.Accounting.jrGrCardOC_HMA.Interfaces.IjrGrCardOC_HMADao;
import  org.kaznalnrprograms.Accounting.jrObjectList.Dao.jrObjectDirectoryDaoImpl;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import org.springframework.web.bind.annotation.*;

@Controller
public class jrGrCardOC_HMAController {
    private IjrGrCardOC_HMADao djrGrCardOC_HMA;

    public jrGrCardOC_HMAController(IjrGrCardOC_HMADao djrGrCardOC_HMA){
        this.djrGrCardOC_HMA = djrGrCardOC_HMA;
    }

    @GetMapping("/jrGrCardOC_HMA/jrGrCardOC_HMA")
    @PreAuthorize("GetActRight('jrGrCardOC_HMA', 'jrGrCardOC_HMA')")
    public String jrGrCardOC_HMA(@RequestParam(required = false, defaultValue = "") String prefix, Model model) {
        model.addAttribute("prefix", prefix);
        return "jrGrCardOC_HMA/jrGrCardOC_HMA::jrGrCardOC_HMA";
    }

    @GetMapping("/jrGrCardOC_HMA/LoadUser")
    public @ResponseBody
    String LoadUser() throws Exception {
        return djrGrCardOC_HMA.LoadUser();
    }

@GetMapping("/jrGrCardOC_HMA/getObject")
@PreAuthorize("GetActRight('jrGrCardOC_HMA', 'jrGrCardOC_HMA')")
    public @ResponseBody String getObject(int id) throws Exception {
        return djrGrCardOC_HMA.getObject(id);
    }

}
