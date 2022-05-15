package org.kaznalnrprograms.Accounting.Problems.Controllers;

import org.kaznalnrprograms.Accounting.Problems.Interfaces.IProblemsDirectoryDao;
import org.kaznalnrprograms.Accounting.Problems.Models.ProblemsModel;
import org.kaznalnrprograms.Accounting.Problems.Models.ProblemsViewModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class ProblemsController {
    private IProblemsDirectoryDao dProb;

    public  ProblemsController(IProblemsDirectoryDao dProb){
        this.dProb = dProb;
    }


    /**
     * Получить список проблем
     * @para showDel
     * @return
     * @throws Exception
     */
    @GetMapping("/Problems/list")
    @PreAuthorize("GetActRight('Problems.dll','ProblemsView')")
    public  @ResponseBody
    List<ProblemsViewModel> list ( @RequestParam(required = false, defaultValue = "false") boolean showDel, int obj_type_id ) throws Exception{
        return dProb.list(showDel, obj_type_id);
    }

    /**
     * Получить территорию для просмтора/изменения
     * @param id
     * @return
     * @throws Exception
     */
    @GetMapping("/Problems/get")
    @PreAuthorize("GetActRight('Problems.dll','ProblemsView')")
    public  @ResponseBody
    ProblemsModel get(int id) throws Exception{
        return dProb.get(id);
    }

    /**
     * Добавить/Изменить проблему
     * @param prob
     * @return
     * @throws Exception
     */
    @PostMapping("/Problems/save")
    @PreAuthorize("GetActRight('Problems.dll','ProblemsChange')")
    public @ResponseBody int save(@RequestBody ProblemsModel prob) throws Exception{
        return dProb.save(prob);
    }


    @PostMapping("/Problems/delete")
    @PreAuthorize("GetActRight('Problems.dll','ProblemsChange')")
    public  @ResponseBody String delete(Integer id) throws Exception{
        dProb.delete(id);
        return "";
    }

    @GetMapping("/Problems/ProblemsFormList")
    @PreAuthorize("GetActRight('Problems.dll','ProblemsView')")
    public String ProblemsFormList(@RequestParam(required = false, defaultValue = "")
                                   String prefix, Model model){
        model.addAttribute("prefix", prefix);
        return "Problems/ProblemsFormList :: ProblemsFormList";
    }

    @GetMapping("/Problems/ProblemsFormEdit")
    @PreAuthorize("GetActRight('Problems.dll', 'ProblemsView')")
    public String ProblemsFormList(){
        return "Problems/ProblemsFormEdit::ProblemsFormEdit";
    }

    @GetMapping("/Problems/getObjectType")
    @PreAuthorize("GetActRight('ObjTypes.dll','ObjTypesView')")
    public  @ResponseBody  String getObjectType(Integer id) throws Exception{
        return  dProb.getObjectType(id);
    }

}
