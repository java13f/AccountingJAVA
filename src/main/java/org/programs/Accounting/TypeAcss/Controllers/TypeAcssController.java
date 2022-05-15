package org.kaznalnrprograms.Accounting.TypeAcss.Controllers;

import org.kaznalnrprograms.Accounting.TypeAcss.Interfaces.ITypeAcssDirectoryDao;
import org.kaznalnrprograms.Accounting.TypeAcss.Models.TypeAcssCmb;
import org.kaznalnrprograms.Accounting.TypeAcss.Models.TypeAcssModel;
import org.kaznalnrprograms.Accounting.TypeAcss.Models.TypeAcssViewModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class TypeAcssController {
    private ITypeAcssDirectoryDao dTypeAcss;

    public TypeAcssController( ITypeAcssDirectoryDao dTypeAcss ){
        this.dTypeAcss = dTypeAcss;
    }

    /**
     * Получение данных для грида
     * @param filter - текст для поиска
     * @return
     * @throws Exception
     */
    @GetMapping("/TypeAcss/list")
    @PreAuthorize("GetActRight('TypeAcss.dll', 'TypeAcssView')")
    public @ResponseBody List<TypeAcssViewModel> list (String filter) throws Exception {
        return dTypeAcss.list(filter);
    }

    /**
     * Получение html страницы
     * @param prefix
     * @param model
     * @return
     */
    @GetMapping("/TypeAcss/TypeAcssList")
    @PreAuthorize("GetActRight('TypeAcss.dll', 'TypeAcssView')")
    public String TypeAcssList(@RequestParam(required = false, defaultValue = "") String prefix, Model model) {
        model.addAttribute("prefix", prefix);
        return "TypeAcss/TypeAcssList::TypeAcssList";
    }

    @GetMapping("/TypeAcss/TypeAcssFormEdit")
    //@PreAuthorize("GetActRight('TypeAcss.dll', 'TypeAcssChange')")
    public String TypeAcssFormEdit() { return "TypeAcss/TypeAcssFormEdit::TypeAcssFormEdit";}

    @GetMapping("/TypeAcss/LoadGroup")
    //@PreAuthorize("GetActRight('TypeAcss.dll', 'TypeAcssChange')")
    public @ResponseBody List<TypeAcssCmb> LoadGroup() throws Exception{
        return dTypeAcss.LoadGroup();
    }

    @GetMapping("/TypeAcss/LoadName")
    //@PreAuthorize("GetActRight('TypeAcss.dll', 'TypeAcssChange')")
    public @ResponseBody List<TypeAcssCmb> LoadName() throws Exception{
        return dTypeAcss.LoadName();
    }


    @PostMapping("TypeAcss/save")
    @PreAuthorize("GetActRight('TypeAcss.dll','TypeAcssChange')")
    public @ResponseBody int save(@RequestBody TypeAcssModel tpAsMd) throws Exception{
        return dTypeAcss.save(tpAsMd);
    }

    @GetMapping("/TypeAcss/get")
    //@PreAuthorize("GetActRight('TypeAcss.dll','TypeAcssChange')")
    public @ResponseBody TypeAcssModel get(int id ) throws Exception{
        return dTypeAcss.get(id);
    }


    @PostMapping("/TypeAcss/delete")
    @PreAuthorize("GetActRight('TypeAcss.dll','TypeAcssChange')")
    public @ResponseBody void delete(Integer id) throws Exception{
        dTypeAcss.delete(id);
    }

    @GetMapping("/TypeAcss/AddAllObj")
    @PreAuthorize("GetActRight('TypeAcss.dll','TypeAcssChange')")
    public @ResponseBody void AddAllObj(Integer group) throws Exception{
        dTypeAcss.AddAllObj(group);
    }

}
