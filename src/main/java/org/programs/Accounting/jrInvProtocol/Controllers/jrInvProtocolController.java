package org.kaznalnrprograms.Accounting.jrInvProtocol.Controllers;


import org.kaznalnrprograms.Accounting.jrInvMainAssets.Models.jrInvMainAssetsAccModel;
import org.kaznalnrprograms.Accounting.jrInvMainAssets.Models.jrInvMainAssetsInvModel;
import org.kaznalnrprograms.Accounting.jrInvMainAssets.Models.jrInvMainAssetsKterModel;
import org.kaznalnrprograms.Accounting.jrInvProtocol.Interfaces.IjrInvProtocolDao;
import org.kaznalnrprograms.Accounting.jrInvProtocol.Models.jrInvProtocolAccModel;
import org.kaznalnrprograms.Accounting.jrInvProtocol.Models.jrInvProtocolInvModel;
import org.kaznalnrprograms.Accounting.jrInvProtocol.Models.jrInvProtocolKterModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
public class jrInvProtocolController {
    private IjrInvProtocolDao djrInvProtocol;

    public jrInvProtocolController(IjrInvProtocolDao djrInvProtocol) {
        this.djrInvProtocol = djrInvProtocol;
    }

    @GetMapping("/jrInvProtocol/jrInvProtocol")
    @PreAuthorize("GetActRight('jrInvProtocol','jrInvProtocolView')")
    public String jrOSV(@RequestParam(required = false, defaultValue = "") String prefix, Model model) {
        model.addAttribute("prefix", prefix);
        return "jrInvProtocol/jrInvProtocol :: jrInvProtocol";
    }

    /***
     * Получения списка территорий
     * @return
     * @throws Exception
     */
    @GetMapping("/jrInvProtocol/getKters")
    @PreAuthorize("GetActRight('jrInvProtocol','jrInvProtocolView')")
    public @ResponseBody
    List<jrInvProtocolKterModel> getKters() throws Exception {
        return djrInvProtocol.getKters();
    }

    /***
     * Получение списка счетов
     * @return
     * @throws Exception
     */
        @GetMapping("/jrInvProtocol/getAccs")
    @PreAuthorize("GetActRight('jrInvProtocol','jrInvProtocolView')")
    public @ResponseBody
    List<jrInvProtocolAccModel> getAccs() throws Exception {
        return djrInvProtocol.getAccs();
    }

    /***
     * Получение шаблона инвентаризации по Id
     * @param id
     * @return
     * @throws Exception
     */
    @GetMapping("/jrInvProtocol/getInv")
    @PreAuthorize("GetActRight('jrInvProtocol','jrInvProtocolView')")
    public @ResponseBody
    jrInvProtocolInvModel getInv(int id) throws Exception {
        return djrInvProtocol.getInv(id);
    }
}
