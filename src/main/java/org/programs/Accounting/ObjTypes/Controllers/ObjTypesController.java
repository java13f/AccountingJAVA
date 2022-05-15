package org.kaznalnrprograms.Accounting.ObjTypes.Controllers;

import org.kaznalnrprograms.Accounting.ObjTypes.Interfaces.IObjTypesDao;
import org.kaznalnrprograms.Accounting.ObjTypes.Models.ObjTypesModel;
import org.kaznalnrprograms.Accounting.ObjTypes.Models.ObjTypesViewModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class ObjTypesController {
    private IObjTypesDao dObjTypes;

    public ObjTypesController(IObjTypesDao dObjTypes) {this.dObjTypes = dObjTypes; }
    /**
     * Получить список

     * @param showDel - флаг отображения удалёных записей
     * @return
     * @throws Exception
     */
    @GetMapping("/ObjTypes/list")
    @PreAuthorize("GetActRight('ObjTypes.dll','ObjTypesView')")
    public @ResponseBody
    List<ObjTypesViewModel> list(@RequestParam(required = false, defaultValue = "false") boolean showDel) throws Exception{
        return dObjTypes.list(showDel);
    }
    /**
     * Получить частичное представление основного окна справочника
     * @param prefix - приставка для идентификаторов
     * @param model - модель для передачи параметров в представление
     * @return
     */
    @GetMapping("/ObjTypes/ObjTypesFormList")
    @PreAuthorize("GetActRight('ObjTypes.dll','ObjTypesView')")
    public String ObjTypesFormList(@RequestParam(required = false, defaultValue = "") String prefix, Model model){
        model.addAttribute("prefix", prefix);
        return "ObjTypes/ObjTypesFormList :: ObjTypesFormList";
    }
    /**
     * Функция получения записи для просмотра/изменения
     * @param id - идентификатор
     * @throws Exception
     */
    @GetMapping("/ObjTypes/get")
    @PreAuthorize("GetActRight('ObjTypes.dll','ObjTypesView')")
    public @ResponseBody
    ObjTypesModel get(int id) throws Exception {
        return dObjTypes.get(id);
    }
    /**
     * Проверить существование объекта
     * @param id - идентификатьор т (для новых -1)
     * @param name - наименование
     * @return
     * @throws Exception
     */
    @GetMapping("/ObjTypes/exists")
    @PreAuthorize("GetActRight('ObjTypes.dll','ObjTypesView')")
    public @ResponseBody boolean exists(int id, String name) throws Exception{
        return dObjTypes.exists(id, name);
    }
    /**
     * Добавить/ Изменить
     * @param objtypes - модель
     * @return
     * @throws Exception
     */
    @PostMapping("/ObjTypes/save")
    @PreAuthorize("GetActRight('ObjTypes.dll','ObjTypesChange')")
    public @ResponseBody  int save(@RequestBody ObjTypesModel objtypes) throws Exception{
        return dObjTypes.save(objtypes);
    }
    /**
     * Удаление
     *
     * @throws Exception
     */
    @PostMapping("/ObjTypes/delete")
    @PreAuthorize("GetActRight('ObjTypes.dll','ObjTypesChange')")
    public @ResponseBody String delete(Integer id) throws Exception{
        dObjTypes.delete(id);
        return "";
    }
    /**
     * Получить частичное представление окна добавления/изменения записи
     * @return
     */
    @GetMapping("/ObjTypes/ObjTypesFormEdit")
    @PreAuthorize("GetActRight('ObjTypes.dll', 'ObjTypesView')")
    public String ObjTypesFormList(){
        return "ObjTypes/ObjTypesFormEdit :: ObjTypesFormEdit";
    }
}
