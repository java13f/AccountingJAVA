package org.kaznalnrprograms.Accounting.RefferParams.Controllers;

import org.kaznalnrprograms.Accounting.RefferParams.Interfaces.IRefferParamsDao;
import org.kaznalnrprograms.Accounting.RefferParams.Models.RefferParamsModel;
import org.kaznalnrprograms.Accounting.RefferParams.Models.RefferParamsViewModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class RefferParamsController
{
    private IRefferParamsDao dao;

    public RefferParamsController(IRefferParamsDao dao)
    {
        this.dao = dao;
    }


    /**
     * Получить список реквизитов
     * @param showDel
     * @return
     * @throws Exception
     */
    @GetMapping("/RefferParams/list")
    @PreAuthorize("GetActRight('RefferParams.dll', 'RefferParamsView')")
    public @ResponseBody
    List<RefferParamsViewModel> list(@RequestParam(required = false, defaultValue = "false") boolean showDel) throws Exception
    {
        return dao.list(showDel);
    }

    @GetMapping("/RefferParams/RefferParamsFormList")
    @PreAuthorize("GetActRight('RefferParams.dll', 'RefferParamsView')")
    public String RefferParamsFormList(@RequestParam(required = false, defaultValue = "") String prefix, Model model)
    {
        model.addAttribute("prefix", prefix);
        return "RefferParams/RefferParamsFormList :: RefferParamsFormList";
    }

    /**
     * Удаление реквизита
     * @param id - идентификатор реквизита
     * @throws Exception
     */
    @PostMapping("/RefferParams/delete")
    @PreAuthorize("GetActRight('RefferParams.dll','RefferParamsChange')")
    public @ResponseBody String delete(Integer id) throws Exception{

        dao.delete(id);
        return "";
    }

    /**
     * Получить частичное представление окна добавления/изменения записи
     * @return
     */
    @GetMapping("/RefferParams/RefferParamsFormEdit")
    @PreAuthorize("GetActRight('RefferParams.dll', 'RefferParamsView')")
    public String RefferParamsFormEdit(){
        return "RefferParams/RefferParamsFormEdit :: RefferParamsFormEdit";
    }

    /**
     * Проверить существование справочника
     * @param id - идентификатор справочника (для новых -1)
     * @param paramcode - код справочника
     * @return
     * @throws Exception
     */
    @GetMapping("/RefferParams/exists")
    @PreAuthorize("GetActRight('RefferParams.dll','RefferParamsView')")
    public @ResponseBody boolean exists(int id, String paramcode) throws Exception{
        return dao.exists(id, paramcode);
    }

    /**
     * Добавить / Изменить запись
     * @param refferparams - модель типа заявки
     * @return
     * @throws Exception
     */
    @PostMapping("/RefferParams/save")
    @PreAuthorize("GetActRight('RefferParams.dll','RefferParamsChange')")
    public @ResponseBody int save(@RequestBody RefferParamsModel refferparams) throws Exception{
        return dao.save(refferparams);
    }

    /**
     * Получить запись
     * @param id
     * @return
     * @throws Exception
     */
    @GetMapping("/RefferParams/get")
    @PreAuthorize("GetActRight('RefferParams.dll', 'RefferParamsChange')")
    public @ResponseBody RefferParamsModel get(Integer id) throws Exception{
        return dao.get(id);
    }

}
