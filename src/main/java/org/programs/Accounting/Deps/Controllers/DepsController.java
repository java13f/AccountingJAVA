package org.kaznalnrprograms.Accounting.Deps.Controllers;

import org.kaznalnrprograms.Accounting.Deps.Interfaces.IDepsDao;
import org.kaznalnrprograms.Accounting.Deps.Models.DepsKterModel;
import org.kaznalnrprograms.Accounting.Deps.Models.DepsModel;
import org.kaznalnrprograms.Accounting.Deps.Models.DepsUserModel;
import org.kaznalnrprograms.Accounting.Deps.Models.DepsViewModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class DepsController {
    private IDepsDao dDeps;

    public DepsController(IDepsDao dDeps) {
        this.dDeps = dDeps;
    }

    /**
     * Получить частичное представление основного окна со списком подразделений
     * @param prefix - префикс
     * @param model
     * @return
     */
    @GetMapping("/Deps/DepsFormList")
    @PreAuthorize("GetActRight('Deps.dll', 'DepsView')")
    public String DepsFormList(@RequestParam(required = false, defaultValue = "") String prefix, Model model) {
        model.addAttribute("prefix", prefix);
        return "Deps/DepsFormList :: DepsFormList";
    }

    /**
     * Получить чистичное представление
     * @return
     */
    @GetMapping("/Deps/DepsFormEdit")
    @PreAuthorize("GetActRight('Deps.dll','DepsView')")
    public String DepsFormEdit() {
        return "Deps/DepsFormEdit :: DepsFormEdit";
    }

    /**
     * Проверяем есть ли уже на територии подразделения главное
     * @return
     */
    @GetMapping("/Deps/CheckMainDep")
    @PreAuthorize("GetActRight('Deps.dll','DepsView')")
    public @ResponseBody
    List<DepsModel> CheckMainDep(int id) throws Exception {
        return dDeps.CheckMainDep(id);
    }

    /**
     * Получить список подразделений
     * @param showDel - показывать удалённые
     * @return
     * @throws Exception
     */
    @GetMapping("/Deps/list")
    @PreAuthorize("GetActRight('Deps.dll','DepsView')")
    public @ResponseBody
    List<DepsViewModel> list(
            @RequestParam(required = false, defaultValue = "false") boolean showDel) throws Exception {
        return dDeps.list(showDel);
    }

    /**
     * Получить подразделение
     * @param id
     * @return
     * @throws Exception
     */
    @GetMapping("Deps/get")
    @PreAuthorize("GetActRight('Deps.dll','DepsView')")
    public @ResponseBody
    DepsModel get(int id) throws Exception {
        return dDeps.get(id);
    }

    /**
     * Получить территорию
     * @param id - ид. территории
     * @return
     * @throws Exception
     */
    @GetMapping("Deps/getKter")
    @PreAuthorize("GetActRight('Deps.dll','DepsView')")
    public @ResponseBody DepsKterModel getKter(int id) throws Exception {
        return dDeps.getKter(id);
    }

    /**
     * Получить пользователя
     * @param id - ид. пользователя
     * @return
     * @throws Exception
     */
    @GetMapping("Deps/getBossUser")
    @PreAuthorize("GetActRight('Deps.dll','DepsView')")
    public @ResponseBody DepsUserModel getBossUser(int id) throws Exception {
        return dDeps.getBossUser(id);
    }

    /**
     * Получить пользователей
     */
    @GetMapping("Deps/getUsers")
    @PreAuthorize("GetActRight('Deps.dll','DepsView')")
    public @ResponseBody List<DepsUserModel> getUsers() throws Exception {
        return dDeps.getUsers();
    }

    /**
     * Проверка уникальности кода территории
     * @param id - идентификатор подраз
     * @param kterId - идентификатор территории
     * @param code - код подразделения
     * @return
     * @throws Exception
     */
    @GetMapping("/Deps/checkSameCode")
    @PreAuthorize("GetActRight('Deps.dll','DepsView')")
    public @ResponseBody
    boolean checkSameCode(int id, int kterId, String code) throws Exception {
        return dDeps.checkSameCode(id, kterId, code);
    }

    /**
     * Добавить/ Изменить подразделение
     *
     * @param deps - модель подразделения
     * @return
     * @throws Exception
     */
    @PostMapping("/Deps/save")
    @PreAuthorize("GetActRight('Deps.dll','DepsChange')")
    public @ResponseBody
    int save(@RequestBody DepsModel deps) throws Exception {
        return dDeps.save(deps);
    }

    /**
     * Удаление подразделения
     *
     * @param id - идентификатор подразделения
     * @throws Exception
     */
    @PostMapping("/Deps/delete")
    @PreAuthorize("GetActRight('Deps.dll','DepsChange')")
    public @ResponseBody
    void delete(Integer id) throws Exception {
        dDeps.delete(id);
    }
}
