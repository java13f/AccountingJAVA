package org.kaznalnrprograms.Accounting.PeriodParams.Controllers;

import org.kaznalnrprograms.Accounting.PeriodParams.Interfaces.IPeriodParamsDao;
import org.kaznalnrprograms.Accounting.PeriodParams.Models.PeriodParamsModel;
import org.kaznalnrprograms.Accounting.PeriodParams.Models.PeriodParamsTaskCodesModel;
import org.kaznalnrprograms.Accounting.PeriodParams.Models.PeriodParamsViewModel;
import org.springframework.stereotype.Controller;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class PeriodParamsController {
    private IPeriodParamsDao dPP;

    /**
     * Конструктор класса
     * @param dPP
     */
    public PeriodParamsController(IPeriodParamsDao dPP) {
        this.dPP = dPP;
    }

    /**
     * Получение частичного представления основной формы
     * @param prefix
     * @param model
     * @return
     */
    @GetMapping("PeriodParams/PeriodParamsFormList")
    @PreAuthorize("GetActRight('PeriodParams.dll','PeriodParamsView')")
    public String PeriodParamsFormList(
            @RequestParam(required = false, defaultValue = "") String prefix,
            Model model) {
        model.addAttribute("prefix", prefix);
        return "PeriodParams/PeriodParamsFormList :: PeriodParamsFormList";
    }

    /**
     * Получение частичного представления формы добавления/редактирования
     * @return
     */
    @GetMapping("PeriodParams/PeriodParamsFormEdit")
    @PreAuthorize("GetActRight('PeriodParams.dll','PeriodParamsView')")
    public String PeriodParamsFormEdit() {
        return "PeriodParams/PeriodParamsFormEdit :: PeriodParamsFormEdit";
    }

    /**
     * Получение списка реквизитов
     * @param showDel
     * @param filter
     * @return
     * @throws Exception
     */
    @GetMapping("PeriodParams/list")
    @PreAuthorize("GetActRight('PeriodParams.dll','PeriodParamsView')")
    public @ResponseBody
    List<PeriodParamsViewModel> list(
            @RequestParam(required = false, defaultValue = "false") boolean showDel,
            @RequestParam(required = false, defaultValue = "") String filter
    ) throws Exception {
        return dPP.list(showDel, filter);
    }

    /**
     * Получение записи по ИД
     * @param id
     * @return
     * @throws Exception
     */
    @GetMapping("PeriodParams/get")
    @PreAuthorize("GetActRight('PeriodParams.dll','PeriodParamsView')")
    public @ResponseBody
    PeriodParamsModel get(int id) throws Exception {
        return dPP.get(id);
    }

    /**
     * Проверка добавляемой записи на уникальность
     * @param id
     * @param paramCode
     * @param taskCode
     * @return
     * @throws Exception
     */
    @GetMapping("PeriodParams/checkSameCode")
    @PreAuthorize("GetActRight('PeriodParams.dll','PeriodParamsChange')")
    public @ResponseBody
    boolean checkSameCode(int id, String paramCode, String taskCode) throws Exception {
        return dPP.checkSameCodes(id, paramCode, taskCode);
    }

    /**
     * Сохранение записи
     * @param model
     * @return
     * @throws Exception
     */
    @PostMapping("PeriodParams/save")
    @PreAuthorize("GetActRight('PeriodParams.dll','PeriodParamsChange')")
    public @ResponseBody
    int save(@RequestBody PeriodParamsModel model) throws Exception {
        return dPP.save(model);
    }

    /**
     * Удаление записи по ИД
     * @param id
     * @throws Exception
     */
    @PostMapping("PeriodParams/delete")
    @PreAuthorize("GetActRight('PeriodParams.dll','PeriodParamsChange')")
    public @ResponseBody
    void delete(int id) throws Exception {
        dPP.delete(id);
    }

    /**
     * Получение списка кодов задач
     * @return
     * @throws Exception
     */
    @GetMapping("PeriodParams/listTaskCodes")
    @PreAuthorize("GetActRight('PeriodParams.dll','PeriodParamsView')")
    public @ResponseBody
    List<PeriodParamsTaskCodesModel> listTaskCodes() throws Exception {
        return dPP.listTaskCodes();
    }
}
