package org.kaznalnrprograms.Accounting.jrTurnoverBalanceSheet;

import org.kaznalnrprograms.Accounting.jrOSV.Models.jrOSVAccModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
@Controller
public class jrTurnoverBalanceSheetContrtoller {
    private IjrTurnoverBalanceSheetDao djrTurnoverBalanceSheet;
    public jrTurnoverBalanceSheetContrtoller(IjrTurnoverBalanceSheetDao djrTurnoverBalanceSheet){
        this.djrTurnoverBalanceSheet = djrTurnoverBalanceSheet;
    }

    @GetMapping("/jrTurnoverBalanceSheet/jrTurnoverBalanceSheet")
    @PreAuthorize("GetActRight('jrTurnoverBalanceSheet','jrTurnoverBalanceSheetView')")
    public String jrTurnoverBalanceSheet(@RequestParam(required = false, defaultValue = "") String prefix, Model model){
        model.addAttribute("prefix", prefix);
        return "jrTurnoverBalanceSheet/jrTurnoverBalanceSheet :: jrTurnoverBalanceSheet";
    }


    @GetMapping("/jrTurnoverBalanceSheet/getAccs")
    @PreAuthorize("GetActRight('jrTurnoverBalanceSheet','jrTurnoverBalanceSheetView')")
    public @ResponseBody  List<jrTurnoverBalanceSheetAccModel> jrTurnoverBalanceSheetgetAccs() throws Exception {
        List<jrTurnoverBalanceSheetAccModel> r=djrTurnoverBalanceSheet.getAccs();
        return r;
    }


}
