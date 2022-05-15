package org.kaznalnrprograms.Accounting.InvGrps.Controllers;

import org.kaznalnrprograms.Accounting.InvGrps.Interfaces.IInvGrpsDao;
import org.kaznalnrprograms.Accounting.InvGrps.Models.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class InvGrpsController {
    private IInvGrpsDao dao;

    public InvGrpsController(IInvGrpsDao dao) {
        this.dao = dao;
    }

    /**
     * Получить частичное представление основного окна справочника
     * @param prefix - приставка для идентификаторов
     * @param model - модель для передачи параметров в представление
     * @return
     */
    @GetMapping("/InvGrps/InvGrpsFormList")
    @PreAuthorize("GetActRight('InvGrps.dll','InvGrpsView')")
    public String InvGrpsFormList(@RequestParam(required = false, defaultValue = "") String prefix, Model model){
        model.addAttribute("prefix", prefix);
        return "InvGrps/InvGrpsFormList :: InvGrpsFormList";
    }

    @GetMapping("/InvGrps/InvGrpsAccFormEdit")
    @PreAuthorize("GetActRight('InvGrps.dll','InvGrpsView')")
    public String InvGrpsAccFormEdit(@RequestParam(required = false, defaultValue = "") String prefix, Model model){
        model.addAttribute("prefix", prefix);
        return "InvGrps/InvGrpsAccFormEdit :: InvGrpsAccFormEdit";
    }

    @GetMapping("/InvGrps/InvGrpsFormEdit")
    @PreAuthorize("GetActRight('InvGrps.dll','InvGrpsView')")
    public String InvGrpsFormEdit(@RequestParam(required = false, defaultValue = "") String prefix, Model model){
        model.addAttribute("prefix", prefix);
        return "InvGrps/InvGrpsFormEdit :: InvGrpsFormEdit";
    }

    /**
     * Получить список групп инв-го учета
     */
    @GetMapping("/InvGrps/getGroupAccsList")
    @PreAuthorize("GetActRight('InvGrps.dll','InvGrpsView')")
    public @ResponseBody
    List<InvGrpsAccViewModel> getGroupAccsList(@RequestParam(required = false, defaultValue = "false") boolean showDel,
                                   @RequestParam(required = false, defaultValue = "") int invGrpsId) throws Exception{
        return dao.getGroupAccsList(showDel, invGrpsId); //list
    }

    /**
     * Получить список счетов по группам
     */
    @GetMapping("/InvGrps/getGroupsList")
    @PreAuthorize("GetActRight('InvGrps.dll','InvGrpsView')")
    public @ResponseBody
    List<InvGrpsViewModel> getGroupsList(@RequestParam(required = false, defaultValue = "false") boolean showDel) throws Exception{
        return dao.getGroupsList(showDel);//invGrpsList
    }

    /**
     * Получить группу по id
     */
    @GetMapping("/InvGrps/getGroupById")
    @PreAuthorize("GetActRight('InvGrps.dll','InvGrpsChange')")
    public @ResponseBody
    InvGrpsModel getGroupById(int id) throws Exception{
        return dao.getGroupById(id);//getInvGrpsById
    }

    /**
     * Получить счет по id
     */
    @GetMapping("/InvGrps/getGroupAccById")
    @PreAuthorize("GetActRight('InvGrps.dll','InvGrpsChange')")
    public @ResponseBody
    InvGrpsAccModel getGroupAccById(int id) throws Exception{
        return dao.getGroupAccById(id);//invGrpsAccById
    }

    /**
     * Получить счет по коду и тэгу
     */
    @GetMapping("/InvGrps/getGroupAccByCodeAndTag")
    @PreAuthorize("GetActRight('InvGrps.dll','InvGrpsChange')")
    public @ResponseBody
    InvGrpsAccModel getGroupAccByCodeAndTag(String code, String tag) throws Exception{
        return dao.getGroupAccByCodeAndTag(code, tag);//invGrpsAccByCodeAndTag
    }

    /**
     * Удалить группу
     */
    @PostMapping("/InvGrps/delGroup")
    @PreAuthorize("GetActRight('InvGrps.dll','InvGrpsChange')")
    public @ResponseBody String delGroup(int id) throws Exception{
        dao.delGroup(id); //delete
        return "";
    }

    /**
     * Удалить группу
     */
    @PostMapping("/InvGrps/delAcc")
    @PreAuthorize("GetActRight('InvGrps.dll','InvGrpsChange')")
    public @ResponseBody String delAcc(int id) throws Exception{
        dao.delAcc(id);//deleteAcc
        return "";
    }

    /**
     * Сохранить счет
     */
    @PostMapping("InvGrps/saveGroupAcc")
    @PreAuthorize("GetActRight('InvGrps.dll','InvGrpsChange')")
    public @ResponseBody int saveGroupAcc (@RequestBody InvGrpsAccModel ofModel) throws Exception{
        return dao.saveGroupAcc(ofModel);//save
    }

    /**
     * Сохранить группу
     */
    @PostMapping("InvGrps/saveGroup")
    @PreAuthorize("GetActRight('InvGrps.dll','InvGrpsChange')")
    public @ResponseBody int saveGroup (@RequestBody InvGrpsModel ofModel) throws Exception{
        return dao.saveGroup(ofModel);//saveInvGrps
    }

    /**
     * Проверка на добавление существующей группы
     */
    @GetMapping("/InvGrps/existsGroup")
    @PreAuthorize("GetActRight('InvGrps.dll','InvGrpsView')")
    public @ResponseBody boolean existsGroup(int id, String code) throws Exception{
        return dao.existsGroup(id, code);//exists
    }

    /**
     * Проверка на добавление существующего счета в группе
     */
    @GetMapping("/InvGrps/existsGroupAcc")
    @PreAuthorize("GetActRight('InvGrps.dll','InvGrpsView')")
    public @ResponseBody boolean existsGroupAcc(int id, int accId, int invGrpId) throws Exception{
        return dao.existsGroupAcc(id, accId, invGrpId);//existsAcc
    }

    /**
     * Получить счет по id
     */
    @GetMapping("/InvGrps/getAccById")
    @PreAuthorize("GetActRight('InvGrps.dll','InvGrpsView')")
    public @ResponseBody
    AccModelView getAccById(@RequestParam(required = false, defaultValue = "") int id) throws Exception{
        return dao.getAccById(id);//accById
    }
}
