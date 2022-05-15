package org.kaznalnrprograms.Accounting.Invs.Controllers;
import org.kaznalnrprograms.Accounting.Invs.Dao.InvsDaoImpl;
import org.kaznalnrprograms.Accounting.Invs.Models.InvsCommisModelSave;
import org.kaznalnrprograms.Accounting.Invs.Models.InvsModel;
import org.kaznalnrprograms.Accounting.Invs.Models.InvsModelCommis;

import org.kaznalnrprograms.Accounting.Invs.Models.InvsModelSave;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class InvsController{
    private InvsDaoImpl dao;
    public InvsController(InvsDaoImpl dao) {this.dao = dao;}


    /**
     * загрузка основной формы invs
     * @param prefix
     * @param model
     * @return
     */
    @GetMapping("/Invs/InvsFormList")
    @PreAuthorize("GetActRight('Invs.dll','InvsView')")
    public String InvsFormList(@RequestParam(required = false, defaultValue = "")String prefix, Model model)
    {
        model.addAttribute("prefix", prefix);
        return "Invs/InvsFormList :: InvsFormList";
    }

    /**
     * Загрузка формы редактирования
     * @return
     */
    @GetMapping("/Invs/InvsFormEdit")
    @PreAuthorize("GetActRight('Invs.dll', 'InvsChange')")
    public String InvsFormEdit(){
        return "Invs/InvsFormEdit :: InvsFormEdit";
    }

    @GetMapping("/Invs/InvsCommisFormEdit")
    @PreAuthorize("GetActRight('Invs.dll', 'InvsChange')")
    public String InvsCommisFormEdit(){
        return "Invs/InvsCommisFormEdit :: InvsCommisFormEdit";
    }



    /**
     * заполнение верхнего грида
     * @return
     * @throws Exception
     */
    @GetMapping("/Invs/List")
    @PreAuthorize("GetActRight('Invs.dll','InvsView')")
    public @ResponseBody List<InvsModel> List() throws Exception{
        return dao.List();
    }

    /**
     *заполнение нижнего грида
     * @param id
     * @return
     * @throws Exception
     */
    @GetMapping("/Invs/getInvsCommisList")
    @PreAuthorize("GetActRight('Invs.dll','InvsView')")
    public @ResponseBody
    List<InvsModelCommis> getInvsCommisList(int id) throws Exception{
        return dao.getInvsCommisList(id);
    }


    @GetMapping("/Invs/GetFio")
    @PreAuthorize("GetActRight('Invs.dll','InvsView')")
    public @ResponseBody String GetFio(int Id) throws Exception{
        return dao.GetFio(Id);
    }
    @GetMapping("/Invs/exists")
    @PreAuthorize("GetActRight('Invs.dll','InvsView')")
    public @ResponseBody boolean exists(int id,String name,  String order_numb) throws Exception{
        return dao.exists(id, name, order_numb);
    }
    @GetMapping("/Invs/exists_commis")
    @PreAuthorize("GetActRight('Invs.dll','InvsView')")
    public @ResponseBody boolean exists_commis(int id, int user_id , int invs_id) throws Exception{
        return dao.exists_commis(id, user_id,invs_id);
    }
    /**
     * добавление-редактирование
     * @param obj
     * @return
     * @throws Exception
     */
    @PostMapping("/Invs/save")
    @PreAuthorize("GetActRight('Invs.dll','InvsChange')")
    public @ResponseBody int save(@RequestBody InvsModelSave obj) throws Exception{
        return dao.save(obj);
    }

    @PostMapping("/Invs/save_commis")
    @PreAuthorize("GetActRight('Invs.dll','InvsChange')")
    public @ResponseBody int save_commis(@RequestBody InvsCommisModelSave obj) throws Exception{
        return dao.save_commis(obj);
    }

    @GetMapping("/Invs/get")
    @PreAuthorize("GetActRight('Invs.dll','InvsView')")
    public @ResponseBody
    InvsModelSave get(int id) throws Exception{
        return dao.get(id);
    }
    @GetMapping("/Invs/GetNameFio")
    @PreAuthorize("GetActRight('Invs.dll','InvsView')")
    public @ResponseBody String GetNameFio(int id) throws Exception{
        return dao.GetNameFio(id);
    }
    @PostMapping("/Invs/delete")
    @PreAuthorize("GetActRight('Invs.dll','InvsView')")
    public @ResponseBody String delete(int id) throws Exception{
        dao.delete(id);
        return "";
    }
    @PostMapping("/Invs/delete_commis")
    @PreAuthorize("GetActRight('Invs.dll','InvsView')")
    public @ResponseBody String delete_commis(int id) throws Exception{
        dao.delete_commis(id);
        return "";
    }
    @GetMapping("/Invs/get_commis")
    @PreAuthorize("GetActRight('Invs.dll','InvsChange')")
    public @ResponseBody
    InvsCommisModelSave get_commis(int id) throws Exception{
        return dao.get_commis(id);
    }
}