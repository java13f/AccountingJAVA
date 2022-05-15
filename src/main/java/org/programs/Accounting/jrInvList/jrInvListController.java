package org.kaznalnrprograms.Accounting.jrInvList;


import org.kaznalnrprograms.Accounting.jrInvList.Models.jrInvListModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;


@Controller
public class jrInvListController {
    private IjrInvListDao djrInvList;

    public jrInvListController(IjrInvListDao djrInvList)
    {
        this.djrInvList = djrInvList;
    }

    @GetMapping("/jrInvList/jrInvList")
    @PreAuthorize("GetActRight('jrInvList','jrInvListView')")
    public String jrInvList(@RequestParam(required = false, defaultValue = "") String prefix, Model model) {
        model.addAttribute("prefix", prefix);
        return "jrInvList/jrInvList :: jrInvList";
    }

    /**
     * Получить территорию по id
     * @param id - id территория
     * @return - строка с данными территории
     * @throws Exception
     */
    @GetMapping("/jrInvList/getKter")
    @PreAuthorize("GetActRight('jrInvList','jrInvListView')")
    public @ResponseBody  String getKter(int id) throws Exception {
        return djrInvList.getKter(id);
    }

    /**
     * Получить список подразделений по выбранной территории
     * @param kterId - id территория
     * @return - список подразделений по выбранной территории
     * @throws Exception
     */
    @GetMapping("/jrInvList/getDep")
    @PreAuthorize("GetActRight('jrInvList','jrInvListView')")
    public @ResponseBody  List<jrInvListModel>  getDep(int kterId) throws Exception {
        return djrInvList.getDepsList(kterId);
    }

    /**
     * Получить список счетов
     * @return
     * @throws Exception
     */
    @GetMapping("/jrInvList/getAccCode")
    @PreAuthorize("GetActRight('jrInvList','jrInvListView')")
    public @ResponseBody List<jrInvListModel> jrInvListgetInvGrp() throws Exception {
        return djrInvList.getAccCode();
    }
}



