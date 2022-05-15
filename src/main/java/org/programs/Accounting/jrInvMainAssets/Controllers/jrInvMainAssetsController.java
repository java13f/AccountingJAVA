package org.kaznalnrprograms.Accounting.jrInvMainAssets.Controllers;

import org.kaznalnrprograms.Accounting.jrInvMainAssets.Interfaces.IjrInvMainAssetsDao;
import org.kaznalnrprograms.Accounting.jrInvMainAssets.Models.jrInvMainAssetsAccModel;
import org.kaznalnrprograms.Accounting.jrInvMainAssets.Models.jrInvMainAssetsInvModel;
import org.kaznalnrprograms.Accounting.jrInvMainAssets.Models.jrInvMainAssetsKterModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
public class jrInvMainAssetsController {
    private IjrInvMainAssetsDao djrInvMainAssets;

    public jrInvMainAssetsController(IjrInvMainAssetsDao djrInvMainAssets) {
        this.djrInvMainAssets = djrInvMainAssets;
    }

    @GetMapping("/jrInvMainAssets/jrInvMainAssets")
    @PreAuthorize("GetActRight('jrInvMainAssets','jrInvMainAssetsView')")
    public String jrOSV(@RequestParam(required = false, defaultValue = "") String prefix, Model model) {
        model.addAttribute("prefix", prefix);
        return "jrInvMainAssets/jrInvMainAssets :: jrInvMainAssets";
    }

    /***
     * Получения списка территорий
     * @return
     * @throws Exception
     */
    @GetMapping("/jrInvMainAssets/getKters")
    @PreAuthorize("GetActRight('jrInvMainAssets','jrInvMainAssetsView')")
    public @ResponseBody
    List<jrInvMainAssetsKterModel> getKters() throws Exception {
        return djrInvMainAssets.getKters();
    }

    /***
     * Получение списка счетов
     * @return
     * @throws Exception
     */
    @GetMapping("/jrInvMainAssets/getAccs")
    @PreAuthorize("GetActRight('jrInvMainAssets','jrInvMainAssetsView')")
    public @ResponseBody
    List<jrInvMainAssetsAccModel> getAccs(@RequestParam(required = true) int accs) throws Exception {
        return djrInvMainAssets.getAccs(accs);
    }

    /***
     * Получение шаблона инвентаризации по Id
     * @param id
     * @return
     * @throws Exception
     */
    @GetMapping("/jrInvMainAssets/getInv")
    @PreAuthorize("GetActRight('jrInvMainAssets','jrInvMainAssetsView')")
    public @ResponseBody
    jrInvMainAssetsInvModel getInv(int id) throws Exception {
        return djrInvMainAssets.getInv(id);
    }
}