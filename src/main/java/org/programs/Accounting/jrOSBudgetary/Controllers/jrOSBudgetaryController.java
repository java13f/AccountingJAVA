package org.kaznalnrprograms.Accounting.jrOSBudgetary.Controllers;

import org.kaznalnrprograms.Accounting.jrOSBudgetary.Interfaces.IjrOSBudgetaryDao;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class jrOSBudgetaryController {
    private IjrOSBudgetaryDao djrOSBudgetary;

    public jrOSBudgetaryController(IjrOSBudgetaryDao djrOSBudgetary){
        this.djrOSBudgetary = djrOSBudgetary;
    }

    @GetMapping("/jrOSBudgetary/jrOSBudgetary")
    @PreAuthorize("GetActRight('jrOSBudgetary','jrOSBudgetaryView')")
    public String jrOSBudgetary(@RequestParam(required = false, defaultValue = "") String prefix, Model model) {
        model.addAttribute("prefix", prefix);
        return "jrOSBudgetary/jrOSBudgetary :: jrOSBudgetary";
    }

    /**
     * Запрос для получения строки в формате id = name (универсальный)
     * @param id - Идентификатор записи в таблице
     * @return
     * @throws Exception
     */
    @GetMapping("/jrOSBudgetary/ObjName")
    @PreAuthorize("GetActRight('jrOSBudgetary','jrOSBudgetaryView')")
    public @ResponseBody
    String ObjName(int id) throws Exception {
        return djrOSBudgetary.ObjName(id);
    }


    @GetMapping("/jrOSBudgetary/checkAccs")
    @PreAuthorize("GetActRight('jrOSBudgetary','jrOSBudgetaryView')")
    public @ResponseBody
    int checkAccs(int objId) throws Exception {
        return djrOSBudgetary.checkAccs(objId);
    }



}
