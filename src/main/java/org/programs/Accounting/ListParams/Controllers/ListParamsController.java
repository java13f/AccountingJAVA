package org.kaznalnrprograms.Accounting.ListParams.Controllers;

import org.kaznalnrprograms.Accounting.ListParams.Interfaces.IListParamsDirectoryDao;
import org.kaznalnrprograms.Accounting.ListParams.Models.ListParamsModel;
import org.kaznalnrprograms.Accounting.ListParams.Models.ListParamsViewModel;
import org.kaznalnrprograms.Accounting.ListParams.Models.TaskCodeModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.swing.*;
import java.util.List;

@Controller
public class ListParamsController {
    private IListParamsDirectoryDao dListParams;

    public ListParamsController(IListParamsDirectoryDao dListParams){
        this.dListParams = dListParams;
    }

    /**
     * Получить частичное представление основного окна справочника кодов казначейства
     * @param prefix - приставка для идентификаторов
     * @param model - модель для передачи параметров в представление
     * @return
     */
    @GetMapping("/ListParams/ListParamsFormList")
    @PreAuthorize("GetActRight('ListParams.dll','ListParamsView')")
    public String ListParamsFormList(@RequestParam(required = false, defaultValue = "") String prefix, Model model){
        model.addAttribute("prefix", prefix);
        return "ListParams/ListParamsFormList :: ListParamsFormList";
    }

    /**
     * Получить частичное представление окна добавления/изменения записи
     * @return
     */
    @GetMapping("/ListParams/ListParamsFormEdit")
    @PreAuthorize("GetActRight('ListParams.dll', 'ListParamsView')")
    public String ListParamsFormList(){
        return "ListParams/ListParamsFormEdit :: ListParamsFormEdit";
    }


    /**
     * Получить список дополнительных реквизитов
     * @param taskcode - код задачи (таблицы)
     * @param showDel - флаг отображения удалёных записей
     * @return
     * @throws Exception
     */
    @GetMapping("/ListParams/list")
    @PreAuthorize("GetActRight('ListParams.dll','ListParamsView')")
    public @ResponseBody List<ListParamsViewModel> list(@RequestParam(required = false, defaultValue = "") String taskcode,
                                   @RequestParam(required = false, defaultValue = "false") boolean showDel) throws Exception{
        return dListParams.list(taskcode, showDel);
    }

    /**
     * Функция получения территории для просмотра/изменения территории
     * @param id - идентификатор дополнительного реквизита
     * @return
     * @throws Exception
     */
    @GetMapping("/ListParams/get")
    @PreAuthorize("GetActRight('ListParams.dll','ListParamsView')")
    public @ResponseBody ListParamsModel get(int id) throws Exception {
        return dListParams.get(id);
    }

    /**
     * Добавление/изменение реквизита
     * @param model - модель дополнительного реквизита
     * @return
     * @throws Exception
     */
    @PostMapping("/ListParams/save")
    @PreAuthorize("GetActRight('ListParams.dll','ListParamsChange')")
    public @ResponseBody int save(@RequestBody ListParamsModel model) throws Exception {
        return dListParams.save(model);
    }

    /**
     * Удаление реквизита
     * @param id - идентификатор дополнительного реквизита
     * @throws Exception
     */
    @PostMapping("/ListParams/delete")
    @PreAuthorize("GetActRight('ListParams.dll','ListParamsChange')")
    public @ResponseBody String delete(Integer id) throws Exception{
        dListParams.delete(id);
        return "";
    }

    /**
     * Получить список таблиц (TaskCode)
     * @return
     * @throws Exception
     */
    @GetMapping("/ListParams/GetTaskCodeList")
    @PreAuthorize("GetActRight('ListParams.dll','ListParamsView')")
    public @ResponseBody List<TaskCodeModel> GetTaskCodeList() throws Exception {
        return dListParams.GetTaskCodeList();
    }

    /**
     * Проверям существуют ли дубликаты по уникальным полям
     * @param taskcode - код задачи (таблицы)
     * @param nom - номер параметра
     * @param id - идентификатор записи
     * @return
     * @throws Exception
     */
    @GetMapping("/ListParams/duplicateTaskCodeAndNom")
    @PreAuthorize("GetActRight('ListParams.dll','ListParamsView')")
    public @ResponseBody boolean duplicateTaskCodeAndNom(String taskcode, int nom, int id) throws Exception{
        return dListParams.duplicateTaskCodeAndNom(taskcode, nom, id);
    }

    /**
     * Проверям существуют ли дубликаты по уникальным полям
     * @param taskcode - код задачи (таблицы)
     * @param paramcode - код параметра
     * @param id - идентификатор записи
     * @return
     * @throws Exception
     */
    @GetMapping("/ListParams/duplicateTaskCodeAndParamCode")
    @PreAuthorize("GetActRight('ListParams.dll','ListParamsView')")
    public @ResponseBody boolean duplicateTaskCodeAndParamCode(String taskcode, String paramcode, int id) throws Exception{
        return dListParams.duplicateTaskCodeAndParamCode(taskcode, paramcode, id);
    }

    /**
     * Проверяем существует ли такой код в справочнике RefferParams
     * @param reffercode - Код справочника в таблице RefferParams (ParamCode)
     * @return
     * @throws Exception
     */
    @GetMapping("/ListParams/exsistRefferParams")
    @PreAuthorize("GetActRight('ListParams.dll','ListParamsView')")
    public @ResponseBody boolean exsistRefferParams(String reffercode) throws Exception{
        return dListParams.exsistRefferParams(reffercode);
    }

}
