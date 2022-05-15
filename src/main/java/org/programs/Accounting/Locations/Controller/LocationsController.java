package org.kaznalnrprograms.Accounting.Locations.Controller;

import org.kaznalnrprograms.Accounting.Locations.Interfaces.ILocations;
import org.kaznalnrprograms.Accounting.Locations.Models.DepModel;
import org.kaznalnrprograms.Accounting.Locations.Models.KterModel;
import org.kaznalnrprograms.Accounting.Locations.Models.LocationsModel;
import org.kaznalnrprograms.Accounting.Locations.Models.LocationsViewModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class LocationsController
{
    private ILocations dao;

    public LocationsController(ILocations dao)
    {
        this.dao = dao;
    }

    @GetMapping("/Locations/list")
    @PreAuthorize("GetActRight('Locations.dll','LocationsView')")
    public @ResponseBody List<LocationsViewModel> list(@RequestParam(required = false, defaultValue = "")String name, @RequestParam(required = false, defaultValue = "-1")int depid,
                                                       @RequestParam(required = false, defaultValue = "-1")int kterid, @RequestParam(required = false, defaultValue = "false")boolean del) throws Exception
    {
        return dao.getList(name, depid, kterid, del);
    }

    @GetMapping("/Locations/LocationsFormList")
    @PreAuthorize("GetActRight('Locations.dll','LocationsView')")
    public String LocationsFormList(@RequestParam(required = false, defaultValue = "")String prefix, Model model)
    {
        model.addAttribute("prefix", prefix);
        return "Locations/LocationsFormList :: LocationsFormList";
    }

    @GetMapping("/Locations/LocationsFormFilter")
    @PreAuthorize("GetActRight('Locations.dll','LocationsView')")
    public String LocationsFormFilter()
    {
        return "Locations/LocationsFormFilter :: LocationsFormFilter";
    }

    @GetMapping("/Locations/LocationsFormEdit")
    @PreAuthorize("GetActRight('Locations.dll','LocationsView')")
    public String LocationsFormEdit()
    {
        return "Locations/LocationsFormEdit :: LocationsFormEdit";
    }

    @GetMapping("/Locations/GetKter")
    @PreAuthorize("GetActRight('Locations.dll','LocationsView')")
    public @ResponseBody String GetKter(int KterId) throws Exception{
        return dao.getKter(KterId);
    }

    @GetMapping("/Locations/GetKterObj")
    @PreAuthorize("GetActRight('Locations.dll','LocationsView')")
    public @ResponseBody KterModel GetKterObj(int KterId) throws Exception{
        return dao.getKterObj(KterId);
    }
    @GetMapping("/Locations/GetDep")
    @PreAuthorize("GetActRight('Locations.dll','LocationsView')")
    public @ResponseBody DepModel GetDep(int DepId) throws Exception{
        return dao.getDep(DepId);
    }

    @PostMapping("/Locations/Save")
    @PreAuthorize("GetActRight('Locations.dll','LocationsChange')")
    public @ResponseBody int Save(@RequestBody LocationsModel model) throws Exception{
        return dao.save(model);
    }

    @GetMapping("/Locations/GetLocation")
    @PreAuthorize("GetActRight('Locations.dll','LocationsView')")
    public @ResponseBody LocationsModel GetLocation(int id) throws Exception{
        return dao.getLocation(id);
    }

    @PostMapping("/Locations/Delete")
    @PreAuthorize("GetActRight('Locations.dll','LocationsChange')")
    public @ResponseBody String Delete(int id) throws Exception{
        dao.delete(id);
        return "";
    }
}
