package org.kaznalnrprograms.Accounting.jrOSV;

import org.kaznalnrprograms.Accounting.jrOSV.Models.jrOSVAccModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
public class jrOSVController {
    private IjrOSVDao djrOSV;
    public jrOSVController(IjrOSVDao djrOSV){
        this.djrOSV = djrOSV;
    }

    @GetMapping("/jrOSV/jrOSV")
    @PreAuthorize("GetActRight('jrOSV','jrOSVView')")
    public String jrOSV(@RequestParam(required = false, defaultValue = "") String prefix, Model model){
        model.addAttribute("prefix", prefix);
        return "jrOSV/jrOSV :: jrOSV";
    }

    /**
     * Получить список счетов
     * @return
     * @throws Exception
     */
    @GetMapping("/jrOSV/getAccs")
    @PreAuthorize("GetActRight('jrOSV','jrOSVView')")
    public @ResponseBody  List<jrOSVAccModel> jrOSVgetAccs() throws Exception {
        List<jrOSVAccModel> r=djrOSV.getAccs();
        return r;
    }

    /**
     * Получить пользователя в виде 1 = Иванов
     * @param id
     * @return
     * @throws Exception
     */
    @GetMapping("/jrOSV/getUser")
    @PreAuthorize("GetActRight('jrOSV','jrOSVView')")
    public @ResponseBody  String jrOSVgetUser(int id) throws Exception {
        String r=djrOSV.getUser(id);
        return r;
    }




}



