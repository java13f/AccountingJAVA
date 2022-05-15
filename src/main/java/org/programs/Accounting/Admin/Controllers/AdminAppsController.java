package org.kaznalnrprograms.Accounting.Admin.Controllers;

import org.kaznalnrprograms.Accounting.Admin.Interfaces.IAppsDao;
import org.kaznalnrprograms.Accounting.Admin.Models.AppModel;
import org.kaznalnrprograms.Accounting.Admin.Models.AppViewModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
public class AdminAppsController {
    private IAppsDao dApps;
    public AdminAppsController(IAppsDao dApps){
        this.dApps = dApps;
    }
    @GetMapping("/AdminApps/AppEditForm")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public String AppEditForm(){
        return "Admin/AppEditForm :: AppEditForm";
    }
    @GetMapping("/AdminApps/AppFormSel")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public String AppFormSel(){
        return "Admin/Directories/AppFormSel :: AppFormSel";
    }
    @GetMapping("/AdminApps/List")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody List<AppViewModel> List() throws Exception {
        return dApps.List();
    }
    /**
     * Получить наименование приложения
     * @param id идентификатор приложения
     */
    @GetMapping("/AdminApps/GetAppSel")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody String GetAppSel(int id) throws Exception {
        return dApps.GetAppSel(id);
    }
    /**
     * Получить приложение
     * @param id - идентификатор приложения
     */
    @GetMapping("/AdminApps/Get")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody AppModel Get(int id) throws Exception {
        return dApps.Get(id);
    }
    /**
     * Проверить существование приложения
     * @param id - идентификатор приложения (для новых -1)
     * @param code - код приложения
     * @param func - функция приложения
     */
    @GetMapping("/AdminApps/Exists")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody boolean Exists(int id, String code, String func) throws Exception{
        return dApps.Exists(id, code, func);
    }
    /**
     * Добавить/Изменить приложение
     * @param app - модель приложения
     */
    @PostMapping("/AdminApps/Save")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody int Save(@RequestBody AppModel app) throws Exception {
        return dApps.Save(app);
    }
    /**
     * Удалить приложение
     * @param id - идентификатор приложения
     */
    @PostMapping("/AdminApps/Delete")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody String Delete(Integer id) throws Exception {
        return dApps.Delete(id);
    }
}
