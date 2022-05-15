package org.kaznalnrprograms.Accounting.PeriodEdit.Controllers;

import org.kaznalnrprograms.Accounting.PeriodEdit.Interfaces.IPeriodEditDao;
import org.kaznalnrprograms.Accounting.PeriodEdit.Models.ImgLockFlagDelAll;
import org.kaznalnrprograms.Accounting.PeriodEdit.Models.PeriodLockModel;
import org.kaznalnrprograms.Accounting.PeriodParams.Models.PeriodParamsModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
public class PeriodEditController {
    private IPeriodEditDao dPeriodEdit;

    public PeriodEditController(IPeriodEditDao dPeriodEdit){
        this.dPeriodEdit = dPeriodEdit;
    }

    /**
     * Получение данных для ГРИДА
     * @param SesId
     * @param PeriodParamId
     * @param RecId
     * @param ObjectId
     * @return
     * @throws Exception
     */
    @GetMapping("/PeriodEdit/getList")
    @PreAuthorize("GetActRight('PeriodEdit.dll', 'PeriodEditView')")
    public @ResponseBody List<PeriodLockModel> getList(String SesId, int PeriodParamId, int RecId, int ObjectId, String PeriodParamData) throws Exception{
        return  dPeriodEdit.getList(SesId, PeriodParamId, RecId, ObjectId, PeriodParamData); //getList(SesId, PeriodParamId, RecId, ObjectId);
    }

    /**
     * Получение формы (html)
     * @return
     */
    @GetMapping("/PeriodEdit/PeriodEditList")
    @PreAuthorize("GetActRight('PeriodEdit.dll', 'PeriodEditView')")
    public String PeriodEditList(){
        return "PeriodEdit/PeriodEditList::PeriodEditList";
    }

    /**
     * Удаление из ImgLock (при закрытии формы (не через кнопку ОK))
     * @param SesId
     * @return
     * @throws Exception
     */
    @GetMapping("/PeriodEdit/deleteImgLock")
    @PreAuthorize("GetActRight('PeriodEdit.dll', 'PeriodEditChange')")
    public void deleteImgLock(String SesId,  int ObjectId, int PeriodParamId) throws Exception{
        dPeriodEdit.deleteImgLock(SesId,  ObjectId, PeriodParamId); //getList(SesId, PeriodParamId, RecId, ObjectId);
    }

    @PostMapping("/PeriodEdit/Save")
    @PreAuthorize("GetActRight('PeriodEdit.dll', 'PeriodEditChange')")
    public @ResponseBody  List<String> save(@RequestBody List<PeriodLockModel> model) throws Exception{
        return dPeriodEdit.save(model);
    }

    /*
        @GetMapping("/Problems/ProblemsFormEdit")
        @PreAuthorize("GetActRight('Problems.dll', 'ProblemsView')")
        public String ProblemsFormList(){
            return "Problems/ProblemsFormEdit::ProblemsFormEdit";
    }
     */
    @GetMapping("/PeriodEdit/PeriodEditForm")
    @PreAuthorize("GetActRight('PeriodEdit.dll', 'PeriodEditView')")
    public String PeriodEditForm() throws Exception{
        return "PeriodEdit/PeriodEditForm::PeriodEditForm";
    }

    /**
     * Получить данные периодического реквизита
     * @param PrdPrmId
     * @return
     * @throws Exception
     */
    @GetMapping("/PeriodEdit/getPeriodParam")
    @PreAuthorize("GetActRight('PeriodEdit.dll', 'PeriodEditView')")
    public @ResponseBody PeriodParamsModel getPeriodParam(String PrdPrmId) throws Exception {
        return  dPeriodEdit.getPeriodParam(PrdPrmId);
    }

    /**
     * Получить данные справочника
     * @param Tbl - название таблицы
     * @param Id
     * @return
     * @throws Exception
     */
    @GetMapping("/PeriodEdit/getData")
    //@PreAuthorize("GetActRight('Locations.dll', 'LocationsView')")
    //@PreAuthorize("GetActRight('Users.dll', 'UsersView')")
    @PreAuthorize("GetActRight('PeriodEdit.dll', 'PeriodEditChange')")
    public @ResponseBody String getData(String Tbl, String Id) throws Exception {
        return  dPeriodEdit.getData(Tbl, Id);
    }

    @GetMapping("/PeriodEdit/getUserId")
    @PreAuthorize("GetActRight('PeriodEdit.dll', 'PeriodEditView')")
    public @ResponseBody String getUserId() throws Exception{
        return  dPeriodEdit.getUserId();
    }

    /**
     * Получить flagDel из табл. imgwork
     * @param imgLockId
     * @return
     * @throws Exception
     */
    @GetMapping("PeriodEdit/getImgLockFlagDel")
    @PreAuthorize("GetActRight('PeriodEdit.dll', 'PeriodEditView')")
    public @ResponseBody String getImgLockFlagDel(int imgLockId) throws Exception{
        return dPeriodEdit.getImgLockFlagDel(imgLockId);
    }

    @GetMapping("PeriodEdit/getImgLockFlDlAll")
    @PreAuthorize("GetActRight('PeriodEdit.dll', 'PeriodEditView')")
    public  @ResponseBody List<ImgLockFlagDelAll> getImgLockFlDlAll(String sesid) throws Exception{
        return dPeriodEdit.getImgLockFlDlAll(sesid);
    }

    @GetMapping("PeriodEdit/OpenDayCheck")
    @PreAuthorize("GetActRight('PeriodEdit.dll', 'PeriodEditView')")
    public @ResponseBody boolean OpenDayCheck(String chckDay) throws Exception {
        return  dPeriodEdit.OpenDayCheck(chckDay);
    }

    @GetMapping("PeriodEdit/delete")
    @PreAuthorize("GetActRight('PeriodEdit.dll', 'PeriodEditChange')")
    public @ResponseBody  String delete(String Id) throws Exception {
        return  dPeriodEdit.delete(Id);
    }
}
