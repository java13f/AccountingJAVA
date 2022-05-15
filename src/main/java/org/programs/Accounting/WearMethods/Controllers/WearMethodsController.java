package org.kaznalnrprograms.Accounting.WearMethods.Controllers;

import org.kaznalnrprograms.Accounting.WearMethods.Interfaces.IWearMethodsDao;
import org.kaznalnrprograms.Accounting.WearMethods.Models.AccViewModel;
import org.kaznalnrprograms.Accounting.WearMethods.Models.WearMethodsModel;
import org.kaznalnrprograms.Accounting.WearMethods.Models.InvGroupViewModel;
import org.kaznalnrprograms.Accounting.WearMethods.Models.WearMethodsViewModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class WearMethodsController {
    private IWearMethodsDao dao;

    public WearMethodsController(IWearMethodsDao dWearMethods) {
        this.dao = dWearMethods;
    }

    /**
     * Получить частичное представление основного окна со списком подразделений
     * @param prefix - префикс
     * @param model
     * @return
     */
    @GetMapping("/WearMethods/WearMethodsFormList")
    @PreAuthorize("GetActRight('WearMethods.dll', 'WearMethodsView')")
    public String WearMethodsFormList(@RequestParam(required = false, defaultValue = "") String prefix, Model model) {
        model.addAttribute("prefix", prefix);
        return "WearMethods/WearMethodsFormList :: WearMethodsFormList";
    }

    /**
     * Получить чистичное представление
     * @return
     */
    @GetMapping("/WearMethods/WearMethodsFormEdit")
    @PreAuthorize("GetActRight('WearMethods.dll','WearMethodsView')")
    public String WearMethodsFormEdit() {
        return "WearMethods/WearMethodsFormEdit :: WearMethodsFormEdit";
    }

    /**
     * Получить список подразделений
     * @param showDel - показывать удалённые
     * @return
     * @throws Exception
     */
    @GetMapping("/WearMethods/getWearMethodsList")
    @PreAuthorize("GetActRight('WearMethods.dll','WearMethodsView')")
    public @ResponseBody
    List<WearMethodsViewModel> getWearMethodsList(
            @RequestParam(required = false, defaultValue = "false") boolean showDel) throws Exception {
        return dao.getWearMethodsList(showDel);
    }

    /**
     * Получить подразделение
     * @param id
     * @return
     * @throws Exception
     */
    @GetMapping("WearMethods/getWearMethodById")
    @PreAuthorize("GetActRight('WearMethods.dll','WearMethodsView')")
    public @ResponseBody
    WearMethodsModel getWearMethodsList(int id) throws Exception {
        return dao.getWearMethodById(id);
    }

    /**
     * Получить подразделение
     * @param id
     * @return
     * @throws Exception
     */
    @GetMapping("WearMethods/getInvGrById")
    @PreAuthorize("GetActRight('WearMethods.dll','WearMethodsView')")
    public @ResponseBody
    InvGroupViewModel getInvGrById(int id) throws Exception {
        return dao.getInvGrById(id);
    }

    @GetMapping("/WearMethods/getInvGrList")
    @PreAuthorize("GetActRight('WearMethods.dll','WearMethodsView')")
    public @ResponseBody List<InvGroupViewModel> getInvGrList() throws Exception {
        return dao.getInvGrList();
    }
    /**
     * Получить подразделение
     * @param id
     * @return
     * @throws Exception
     */
    @GetMapping("WearMethods/getAccById")
    @PreAuthorize("GetActRight('WearMethods.dll','WearMethodsView')")
    public @ResponseBody
    AccViewModel getAccById(int id) throws Exception {
        return dao.getAccById(id);
    }

    /**
     * Проверка уникальности кода территории
     * @param id - идентификатор подраз
     * @return
     * @throws Exception
     */
    @GetMapping("/WearMethods/checkForDublicate")
    @PreAuthorize("GetActRight('WearMethods.dll','WearMethodsView')")
    public @ResponseBody
    boolean checkForDublicate(int id, int grId, int accId) throws Exception {
        return dao.checkForDublicate(id, grId, accId);
    }

    /**
     * Добавить/ Изменить подразделение
     *
     * @return
     * @throws Exception
     */
    @PostMapping("/WearMethods/save")
    @PreAuthorize("GetActRight('WearMethods.dll','WearMethodsChange')")
    public @ResponseBody
    int save(@RequestBody WearMethodsModel model) throws Exception {
        return dao.save(model);
    }

    /**
     * Удаление подразделения
     *
     * @param id - идентификатор подразделения
     * @throws Exception
     */
    @PostMapping("/WearMethods/delete")
    @PreAuthorize("GetActRight('WearMethods.dll','WearMethodsChange')")
    public @ResponseBody
    void delete(Integer id) throws Exception {
        dao.delete(id);
    }
}
