package org.kaznalnrprograms.Accounting.LockTable.Controllers;


import org.kaznalnrprograms.Accounting.LockTable.Interfaces.ILockTableDao;
import org.kaznalnrprograms.Accounting.LockTable.Models.LockDateModel;
import org.kaznalnrprograms.Accounting.LockTable.Models.LockTableModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
public class LockTableControllers {
    private ILockTableDao dLockTable;

    public LockTableControllers(ILockTableDao dLockTable) {this.dLockTable = dLockTable;}

    @GetMapping("/LockTable/LockTableFormList")
    @PreAuthorize("GetActRight('LockTable.dll','LockTableView')")
    public String LockTableFormList(){
                return "LockTable/LockTableFormList :: LockTableFormList";
    }
    /**
     * Получить список
     * @param Filter - фильтр
     * @return
     */
    @GetMapping("/LockTable/list")
    @PreAuthorize("GetActRight('LockTable.dll','LockTableView')")
    public @ResponseBody List<LockTableModel> list(@RequestParam(required = false, defaultValue = "") String Filter) throws Exception{
        return dLockTable.list(Filter);
    }

    /**
     * получние время блокировки записи
     * @param id - идентификатор территории
     * @return
     * @throws Exception
     */
    @GetMapping("/LockTable/getDate")
    @PreAuthorize("GetActRight('LockTable.dll','LockTableView')")
    public @ResponseBody
    LockDateModel getDate(String id) throws Exception {
        return dLockTable.getDate(id);
    }
    @PostMapping("/LockTable/unlock")
    @PreAuthorize("GetActRight('LockTable.dll','LockTableChange')")
    public @ResponseBody String unlock(String id) throws Exception{
        dLockTable.unlock(id);
        return "";
    }
}
