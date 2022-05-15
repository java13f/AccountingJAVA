package org.kaznalnrprograms.Accounting.starter.Conrtollers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class starterController {

    @GetMapping("/starter/starterHtml")
    public String starterHtml(@RequestParam(required = false, defaultValue = "") String prefix, Model model) throws Exception {
        model.addAttribute("prefix", prefix);
        return "starter/starter :: starter";
    }
}
