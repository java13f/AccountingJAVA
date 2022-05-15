package org.kaznalnrprograms.Accounting.reffers.Controllers;

import org.kaznalnrprograms.Accounting.Core.IUserSysDao;
import org.kaznalnrprograms.Accounting.reffers.Interfaces.IReffersDao;
import org.kaznalnrprograms.Accounting.reffers.Models.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller                        // признак того, что метод является контроллером
public class reffersController {

    private IReffersDao dReffers;


    public reffersController(IReffersDao dReffers){
        this.dReffers=dReffers;
    }
    /**
     * Получение формы списка в виде html
     * @param prefix
     * @param model
     */
    @GetMapping("/reffers/reffersHtml")  // адрес формы
    //@PreAuthorize("GetActRight('Reffers.dll','ReffersView')")  права на форму не проверяем
    public String refferHtml(@RequestParam(required = false, defaultValue = "") String prefix, Model model) throws Exception {
        model.addAttribute("prefix", prefix); // эта строка нужна в контроллере формы вкладки
        return "reffers/reffers :: reffers";           // Test/Test - путь к модулю Test.html
    }                                         // Test–это отсюда <div th:fragment="Test" ...

    /**
     * Получение данных для выпадающего списка справочников
     */
    @GetMapping("/reffers/reffersAll")  // адрес формы
    // @PreAuthorize("GetActRight('Reffers.dll','ReffersView')")  права не проверяем, даем возможность всем видеть список справочников
    public @ResponseBody List<ReffersAll> getReffersAll() throws Exception {
        List<ReffersAll> r = dReffers.getReffersAll();
        return r;
    }

    /**
     * Получение данных для грида
     */
    @GetMapping("/reffers/reffersList")  // адрес формы
    // @PreAuthorize("GetActRight('Reffers.dll','ReffersView')")   права проверим в модуле reffersDao
    public @ResponseBody dataTable getReffers(int paramId, boolean showDel, int page, int rows) throws Exception {
        dataTable r = dReffers.getReffers(paramId, showDel, page, rows);
        return r;
    }
    /**
     * Получение формы элемента в виде html
     */
    @GetMapping("/reffers/refferForm")  // адрес формы
    //@PreAuthorize("GetActRight('Reffers.dll','ReffersChange')")   права на форму не проверяем
    public String refferFormHtml() throws Exception {
        return "reffers/reffersForm :: reffersForm";
    }


    /**
     * Получение данных для грида, отображающего допреки
     */
    @GetMapping("/reffers/getReffersParams")  // адрес формы
    //@PreAuthorize("GetActRight('Reffers.dll','ReffersChange')")  права проверим в модуле reffersDao
    public @ResponseBody List<ReffersParams> getReffersParams(String refferCode, int id, int paramId, String sesId) throws Exception {
        List<ReffersParams> r = dReffers.getReffersParams(refferCode, id, paramId, sesId);
        return r;
    }

//    /**
//     *  Получение формы редактирования параметров в виде Html
//     */
//    @GetMapping("/reffers/reffersParamFormHtml")  // адрес формы
//    @PreAuthorize("GetActRight('Reffers.dll','ReffersChange')")
//    public String refferParamFormsHtml() throws Exception {
//        return "reffers/reffersParamForm :: reffersParamForm";
//    }
    /**
     * Получение данных для строки грида, отображающего допреки (12 = Значение)
     */
    @GetMapping("/reffers/reffersOneParam")  // адрес формы
    //@PreAuthorize("GetActRight('Reffers.dll','ReffersChange')")  права проверим в модуле reffersDao
    public @ResponseBody String getOneParam(String refferTable,int id, int ownerId, int paramId) throws Exception {
        String r = dReffers.getOneParam(refferTable, id, ownerId, paramId);
        return r;
    }
    /**
     * Сохранение данных из модели
     */
    @PostMapping("/reffers/save")  // адрес формы
    //@PreAuthorize("GetActRight('Reffers.dll','ReffersChange')")  права проверим в модуле reffersDao
    public @ResponseBody int save(@RequestBody reffersSave model) throws Exception {
        int r = dReffers.save(model);
        return r;
    }

    /**
     * Получение одной записи
     */
    @GetMapping("/reffers/getOneReffer")  // адрес формы
    // @PreAuthorize("GetActRight('Reffers.dll','ReffersChange')")   права проверим в модуле reffersDao
    public @ResponseBody  oneReffer getOneReffer(int id) throws Exception {
        oneReffer r = dReffers.getOneReffer(id);
        return r;
    }


    /**
     * удаление записи
     */
    @PostMapping("/reffers/delete")  // адрес формы
    //@PreAuthorize("GetActRight('Reffers.dll','ReffersChange')")  права проверим в модуле reffersDao
    public @ResponseBody int delete(int id) throws Exception {
        dReffers.delete(id);
        return 0;
    }
    /**
     * Получение данных для работы с изображением
     */
    @GetMapping("/reffers/imgParams")  // адрес формы
    // @PreAuthorize("GetActRight('Reffers.dll','ReffersChange')")   права проверим в модуле reffersDao
    public @ResponseBody  imgParams getImgParams(String paramCode, int refferParamId, String sesId, int id, int recId) throws Exception {
        imgParams r = dReffers.getImgParams(paramCode, refferParamId, sesId, id, recId);
        return r;
    }
    /**
     * Удаление дсессии из ImgLock
     */
    @GetMapping("/reffers/delImgLock")  // адрес формы
    @PreAuthorize("GetActRight('Reffers.dll','ReffersView')")
    public @ResponseBody  int delImgLock(String sesId) throws Exception {
        dReffers.delImgLock(sesId);
        return 0;
    }

    /**
     * Получение sesId
     */
    @GetMapping("/reffers/getSesId")  // адрес формы
    @PreAuthorize("GetActRight('Reffers.dll','ReffersView')")
    public @ResponseBody String getSesId() throws Exception {
        String r = dReffers.getSesId();
        return r;
    }

    /**
     * получение флаг imgLock.delFlag
     */
    @GetMapping("/reffers/getImgLockDel")  // адрес формы
    @PreAuthorize("GetActRight('Reffers.dll','ReffersView')")
    public @ResponseBody String getImgLockDel(int imgLockId) throws Exception {
        String r = dReffers.getImgLockDel(imgLockId);
        return r;
    }

}

