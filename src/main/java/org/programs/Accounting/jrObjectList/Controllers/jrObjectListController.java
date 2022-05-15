package org.kaznalnrprograms.Accounting.jrObjectList.Controllers;

import org.kaznalnrprograms.Accounting.jrObjectList.Models.jrObjectListLocationCmb;
import org.kaznalnrprograms.Accounting.jrObjectList.Models.jrObjectListKterCmb;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.kaznalnrprograms.Accounting.jrObjectList.Interfaces.IjObjectDirectoryDao;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class jrObjectListController {
    private IjObjectDirectoryDao djrObjectList;

    public jrObjectListController(IjObjectDirectoryDao djrObjectList){
        this.djrObjectList = djrObjectList;
    }


    @GetMapping("/jrObjectList/jrObjectList")
    @PreAuthorize("GetActRight('jrObjectList.dll', 'jrObjectListView')")
    public String jrObjectList(@RequestParam(required = false, defaultValue = "") String prefix, Model model) {
        model.addAttribute("prefix", prefix);
        return "jrObjectList/jrObjectList::jrObjectList";
    }

    @GetMapping("/jrObjectList/LoadLocations")
    public @ResponseBody List<jrObjectListLocationCmb> LoadLocations(int id) throws Exception{
        return djrObjectList.LoadLocations(id);
    }

    @GetMapping("/jrObjectList/LoadKter")
    public @ResponseBody List<jrObjectListKterCmb> LoadKter() throws Exception {
        return djrObjectList.LoadKter();
    }

    @GetMapping("/jrObjectList/LoadUser")
    public @ResponseBody String LoadUser() throws Exception {
        return djrObjectList.LoadUser();
    }

}
