package org.kaznalnrprograms.Accounting.ListTrans.Controllers;

import org.kaznalnrprograms.Accounting.ListTrans.Dao.ListTransDaoImpl;
import org.kaznalnrprograms.Accounting.ListTrans.Models.GetListTransModel;
import org.kaznalnrprograms.Accounting.ListTrans.Models.ListParamsModels;
import org.kaznalnrprograms.Accounting.ListTrans.Models.ListTransModel;
import org.kaznalnrprograms.Accounting.ListTrans.Models.ListTransViewModel;

import org.kaznalnrprograms.Accounting.ObjTypes.Models.ObjTypesModel;
import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import java.util.List;

@Controller
public class ListTransController {
    private ListTransDaoImpl dao;

    public ListTransController(ListTransDaoImpl dao){this.dao = dao;}

    @GetMapping("/ListTrans/ListTransList")
    @PreAuthorize("GetActRight('ListTrans.dll','ListTransView')")
    public String ListTransList(){
        return "ListTrans/ListTransList :: ListTransList";
    }
    /**
     * получение списка записей
     * @return
     * @throws Exception
     */
    @GetMapping("/ListTrans/list")
    @PreAuthorize("GetActRight('ListTrans.dll','ListTransView')")
    public @ResponseBody List<ListTransViewModel> list() throws Exception{
        return dao.list();
    }

    @GetMapping("/ListTrans/ListTransEdit")
    @PreAuthorize("GetActRight('ListTrans.dll', 'ListTransView')")
    public String ListTransEdit(){
        return "ListTrans/ListTransEdit :: ListTransEdit";
    }
    /**
     * загрузка ComboBox
     * @return
     * @throws Exception
     */
    @GetMapping("/ListTrans/GetListParams")
    @PreAuthorize("GetActRight('ListTrans.dll','ListTransView')")
    public @ResponseBody List<ListParamsModels> GetListParams() throws Exception{
        return dao.GetListParams();
    }
    /**
     * получение значения заявки
     * @param id
     * @return
     * @throws Exception
     */
    @GetMapping("/ListTrans/getOrders")
    @PreAuthorize("GetActRight('ListTrans.dll','ListTransView')")
    public @ResponseBody String getOrders(String id) throws Exception{
        return dao.getOrders(id);
    }
    /**
     * получение значения
     * @param id
     * @param name
     * @return
     * @throws Exception
     */
    @GetMapping("/ListTrans/getValuesText")
    @PreAuthorize("GetActRight('ListTrans.dll','ListTransView')")
    public @ResponseBody String getValuesText(int id, String name) throws Exception{
        return dao.getValuesText(id,name);
    }

    /**
     * обработка значений в Combobox
     * @param id
     * @return
     * @throws Exception
     */
    @GetMapping("/ListTrans/GetReffers")
    @PreAuthorize("GetActRight('ListTrans.dll','ListTransView')")
    public @ResponseBody String GetReffers(int id) throws Exception{
        return dao.GetReffers(id);
    }
    /**
     * добавление-редактирование
     * @param obj
     * @return
     * @throws Exception
     */
    @PostMapping("/ListTrans/save")
    @PreAuthorize("GetActRight('ListTrans.dll','ListTransView')")
    public @ResponseBody int save(@RequestBody ListTransModel obj) throws Exception{
        return dao.save(obj);
    }
    /**
     * получение списка значекний при открытии на редактирование
     * @param id
     * @return
     * @throws Exception
     */
    @GetMapping("/ListTrans/get")
    @PreAuthorize("GetActRight('ListTrans.dll','ListTransView')")
    public @ResponseBody GetListTransModel get(int id) throws Exception{
        return dao.get(id);
    }
    /**
     * проверка на уникальность
     * @param id
     * @param order
     * @param params
     * @return
     * @throws Exception
     */
    @GetMapping("/ListTrans/exists")
    @PreAuthorize("GetActRight('ListTrans.dll','ListTransView')")
    public @ResponseBody boolean exists(int id, int order,String params) throws Exception{
        return dao.exists(id, order, params);
    }
    /**
     * удаление
     * @param id
     * @throws Exception
     */
    @PostMapping("/ListTrans/delete")
    @PreAuthorize("GetActRight('ListTrans.dll','ListTransView')")
    public @ResponseBody String delete(int id) throws Exception{
        dao.delete(id);
        return "";
    }
}


