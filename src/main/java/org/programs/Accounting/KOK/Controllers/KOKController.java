package org.kaznalnrprograms.Accounting.KOK.Controllers;

import org.kaznalnrprograms.Accounting.KOK.Interfaces.IKOKDao;
import org.kaznalnrprograms.Accounting.KOK.Models.KOKModel;
import org.kaznalnrprograms.Accounting.KOK.Models.KOKViewModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class KOKController {
    private IKOKDao dKok;
    public KOKController(IKOKDao dKok){
        this.dKok = dKok;
    }
    @GetMapping("/KOK/KOKFormList")
    @PreAuthorize("GetActRight('KOK.dll','KOKView')")
    public String KOKFormList(@RequestParam(required = false, defaultValue = "") String prefix, Model model){
        model.addAttribute("prefix", prefix);
        return "KOK/KOKFormList :: KOKFormList";
    }

    @GetMapping("/KOK/KOKFormEdit")
    @PreAuthorize("GetActRight('KOK.dll','KOKChange')")
    public String KOKFormEdit(){
        return "KOK/KOKFormEdit :: KOKFormEdit";
    }
    /**
     * Получить список казначейств
     */
    @GetMapping("/KOK/List")
    @PreAuthorize("GetActRight('KOK.dll','KOKView')")
    public @ResponseBody List<KOKViewModel> List(@RequestParam(required = false, defaultValue = "false") boolean showDel) throws Exception {
        return dKok.List(showDel);
    }
    /**
     * Получить код органа казначейства
     * @param id - идентификатор кода органа казначейства
     */
    @GetMapping("/KOK/Get")
    @PreAuthorize("GetActRight('KOK.dll','KOKView')")
    public @ResponseBody KOKModel Get(int id) throws Exception {
        return dKok.Get(id);
    }
    /**
     * Проверить существование казначейства в базе данных
     * @param id - идентификатор казначейства (для новых -1)
     * @param code - код органа казначейства
     */
    @GetMapping("/KOK/Exists")
    @PreAuthorize("GetActRight('KOK.dll','KOKView')")
    public @ResponseBody boolean Exists(int id, String code) throws Exception {
        return dKok.Exists(id, code);
    }

    /**
     * Добавить/Изменить орган казначейства
     * @param kok - модуль кода органа казначейства
     */
    @PostMapping("/KOK/Save")
    @PreAuthorize("GetActRight('KOK.dll','KOKChange')")
    public @ResponseBody int Save(@RequestBody KOKModel kok) throws Exception {
        return dKok.Save(kok);
    }

    /**
     * Удалить код органа казначейства
     * @param id - идентификатор кода органа казначейства
     */
    @PostMapping("/KOK/Delete")
    @PreAuthorize("GetActRight('KOK.dll','KOKChange')")
    public @ResponseBody String Delete(Integer id) throws Exception {
        return dKok.Delete(id);
    }
}
