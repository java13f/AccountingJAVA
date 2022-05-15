package org.kaznalnrprograms.Accounting.Admin.Controllers;

import org.kaznalnrprograms.Accounting.Admin.Interfaces.IActsDao;
import org.kaznalnrprograms.Accounting.Admin.Models.ActModel;
import org.kaznalnrprograms.Accounting.Admin.Models.ActViewModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class AdminActsController {
    private IActsDao dActs;
    public AdminActsController(IActsDao dActs){
        this.dActs = dActs;
    }

    @GetMapping("/AdminActs/GetActEditForm")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public String GetActEditForm(){
        return "Admin/ActEditForm :: ActEditForm";
    }
    @GetMapping("/AdminActs/ActFormSel")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public String ActFormSel(){
        return "Admin/Directories/ActFormSel :: ActFormSel";
    }
    @GetMapping("/AdminActs/ActFilterForm")
    @PreAuthorize("GetActRight('Admin4.dll', 'AdminView')")
    public String ActFilterForm(){
        return "Admin/ActFilterForm :: ActFilterForm";
    }
    /**
     * Получить список действий
     * @param appId - идентификатор приложения
     * @param code - код действия
     * @param name - наименование действия
     */
    @GetMapping("/AdminActs/List")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody List<ActViewModel> List(@RequestParam(required = false, defaultValue = "-1") int appId,
                                 @RequestParam(required = false, defaultValue = "") String code,
                                 @RequestParam(required = false, defaultValue = "") String name) throws Exception {
        return dActs.List(appId, code, name);
    }
    /**
     * Получить действие
     * @param id - идентификатор действия
     */
    @GetMapping("/AdminActs/Get")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody ActModel Get(int id) throws Exception {
        return dActs.Get(id);
    }
    /**
     * Проверить существование действия в базе данных
     * @param id - идентификатор действия (для новых -1)
     * @param code - код действия
     */
    @GetMapping("/AdminActs/Exists")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody boolean Exists(int id, String code) throws Exception {
        return dActs.Exists(id, code);
    }
    /**
     * Добавить/Изменить действие
     * @param act - модель действия
     */
    @PostMapping("/AdminActs/Save")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody int Save(@RequestBody ActModel act) throws Exception {
        return dActs.Save(act);
    }
    /**
     * Удалить действие
     * @param id - идентификатор действия
     */
    @PostMapping("/AdminActs/Delete")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody String Delete(Integer id) throws Exception {
        return dActs.Delete(id);
    }
    /**
     * Получить данные выбранного действия
     * @param id - Идентифиатор действия
     */
    @GetMapping("/AdminActs/GetActSel")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody String GetActSel(int id) throws Exception {
        return dActs.GetActSel(id);
    }
}
