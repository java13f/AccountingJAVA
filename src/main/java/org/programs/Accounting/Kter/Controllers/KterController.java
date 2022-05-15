package org.kaznalnrprograms.Accounting.Kter.Controllers;

import org.kaznalnrprograms.Accounting.Kter.Interfaces.IKterDirectoryDao;
import org.kaznalnrprograms.Accounting.Kter.Models.KokModel;
import org.kaznalnrprograms.Accounting.Kter.Models.KterModel;
import org.kaznalnrprograms.Accounting.Kter.Models.KterViewModel;
import org.kaznalnrprograms.Accounting.Kter.Models.UserModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class KterController {
    private IKterDirectoryDao dKter;

    public KterController(IKterDirectoryDao dKter){
        this.dKter = dKter;
    }

    /**
     * Получить частичное представление основного окна справочника кодов казначейства
     * @param prefix - приставка для идентификаторов
     * @param model - модель для передачи параметров в представление
     * @return
     */
    @GetMapping("/Kter/KterFormList")
    @PreAuthorize("GetActRight('Kter.dll','KterView')")
    public String KterFormList(@RequestParam(required = false, defaultValue = "") String prefix, Model model){
        model.addAttribute("prefix", prefix);
        return "Kter/KterFormList :: KterFormList";
    }

    /**
     * Получить частичное представление окна добавления/изменения записи
     * @return
     */
    @GetMapping("/Kter/KterFormEdit")
    @PreAuthorize("GetActRight('Kter.dll', 'KterChange')")
    public String KterFormList(){
        return "Kter/KterFormEdit :: KterFormEdit";
    }
    /**
     * Получить список территорий
     * @param filter - фильтр по коду терртиорий
     * @param showDel - флаг отображения удалёных записей
     * @return
     * @throws Exception
     */
    @GetMapping("/Kter/list")
    @PreAuthorize("GetActRight('Kter.dll','KterView')")
    public @ResponseBody List<KterViewModel> list(@RequestParam(required = false, defaultValue = "") String filter,
                             @RequestParam(required = false, defaultValue = "false") boolean showDel) throws Exception{
        return dKter.list(filter, showDel);
    }

    /**
     * Функция получения территории для просмотра/изменения территории
     * @param id - идентификатор территории
     * @return
     * @throws Exception
     */
    @GetMapping("/Kter/get")
    @PreAuthorize("GetActRight('Kter.dll','KterView')")
    public @ResponseBody KterModel get(int id) throws Exception {
        return dKter.get(id);
    }

    /**
     * Проверить существование территории
     * @param id - идентификатьор территории (для новых -1)
     * @param code - код территории
     * @return
     * @throws Exception
     */
    @GetMapping("/Kter/exists")
    @PreAuthorize("GetActRight('Kter.dll','KterView')")
    public @ResponseBody boolean exists(int id, String code) throws Exception{
        return dKter.exists(id, code);
    }

    /**
     * Добавить/ Изменить территорию
     * @param kter - модель территории
     * @return
     * @throws Exception
     */
    @PostMapping("/Kter/save")
    @PreAuthorize("GetActRight('Kter.dll','KterChange')")
    public @ResponseBody  int save(@RequestBody KterModel kter) throws Exception{
        return dKter.save(kter);
    }

    /**
     * Удаление территории
     * @param id - идентификатор территории
     * @throws Exception
     */
    @PostMapping("/Kter/delete")
    @PreAuthorize("GetActRight('Kter.dll','KterChange')")
    public @ResponseBody String delete(Integer id) throws Exception{
        boolean existsDeps = dKter.existsDeps(id);
        if(existsDeps){
            return "Для удаления данной территории сперва необходимо удалить все входящие в него подразделения";
        }
        dKter.delete(id);
        return "";
    }
    /**
     * Пполучить список казначейств для формы редактирования записи
     * @return
     * @throws Exception
     */
    @GetMapping("/Kter/GetKOKList")
    @PreAuthorize("GetActRight('Kter.dll','KterChange')")
    public @ResponseBody List<KokModel> GetKOKList() throws Exception {
        return dKter.GetKOKList();
    }
    /**
     * Получить список пользователей казначейства
     * @param kokId идентификатор казначейства
     * @return
     * @throws Exception
     */
    @GetMapping("/Kter/GetUsers")
    @PreAuthorize("GetActRight('Kter.dll','KterChange')")
    public @ResponseBody List<UserModel> GetUsers(int kokId) throws Exception {
        return dKter.GetUsers(kokId);
    }
}
