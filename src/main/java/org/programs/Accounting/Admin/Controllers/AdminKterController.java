package org.kaznalnrprograms.Accounting.Admin.Controllers;

import org.kaznalnrprograms.Accounting.Admin.Interfaces.IKterDao;
import org.kaznalnrprograms.Accounting.Admin.Models.KterViewModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
public class AdminKterController {
    private IKterDao dKter;
    public AdminKterController(IKterDao dKter){
        this.dKter = dKter;
    }
    /**
     * Получить список территорий
     */
    @GetMapping("/AdminKter/List")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody List<KterViewModel> List() throws Exception {
        return dKter.List();
    }

    /**
     * Получить территорию
     * @param KterId - идентификатор территории
     */
    @GetMapping("/AdminKter/GetKterSel")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody String GetKterSel(int KterId) throws Exception {
        return dKter.GetKterSel(KterId);
    }
}
