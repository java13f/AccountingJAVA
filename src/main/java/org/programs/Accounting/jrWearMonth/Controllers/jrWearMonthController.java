package org.kaznalnrprograms.Accounting.jrWearMonth.Controllers;

import org.kaznalnrprograms.Accounting.jrWearMonth.Interfaces.IjrWearMonthDao;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class jrWearMonthController {

    private IjrWearMonthDao djrWearMonth;

    public jrWearMonthController(IjrWearMonthDao djrWearMonth){
        this.djrWearMonth = djrWearMonth;
    }

    @GetMapping("/jrWearMonth/jrWearMonth")
    @PreAuthorize("GetActRight('jrWearMonth','jrWearMonthView')")
    public String jrOSBudgetary(@RequestParam(required = false, defaultValue = "") String prefix, Model model) {
        model.addAttribute("prefix", prefix);
        return "jrWearMonth/jrWearMonth :: jrWearMonth";
    }

    @GetMapping("/jrWearMonth/KterName")
    @PreAuthorize("GetActRight('jrWearMonth','jrWearMonthView')")
    public @ResponseBody
    String KterName(int id) throws Exception {
        return djrWearMonth.KterName(id);
    }
}
