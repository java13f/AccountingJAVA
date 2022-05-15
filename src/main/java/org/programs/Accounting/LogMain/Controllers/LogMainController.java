package org.kaznalnrprograms.Accounting.LogMain.Controllers;

import org.kaznalnrprograms.Accounting.Kter.Models.UserModel;
import org.kaznalnrprograms.Accounting.LogMain.Interfaces.ILogMainDao;
import org.kaznalnrprograms.Accounting.LogMain.Models.DataTable;
import org.kaznalnrprograms.Accounting.LogMain.Models.FilterModel;
import org.kaznalnrprograms.Accounting.LogMain.Models.LogMainModel;
import org.kaznalnrprograms.Accounting.LogMain.Models.LogMainViewModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;

@Controller
public class LogMainController {
    private ILogMainDao dLogMain;

    public LogMainController(ILogMainDao dLogMain) {
        this.dLogMain = dLogMain;
    }


    /**
     * Получить частичное представление основного окна просмотра протокола
     * @return
     */
    @GetMapping("/LogMain/LogMainFormList")
    @PreAuthorize("GetActRight('LogMain.dll','LogMainView')")
    public String LogMainFormList( ) { //@RequestParam(required = false, defaultValue = "") String prefix,Model model

        return "LogMain/LogMainFormList :: LogMainFormList";
    }


    /**
     * Получить частичное представление окна просмотра записи
     * @return
     */
    @GetMapping("/LogMain/LogMainFormEdit")
    @PreAuthorize("GetActRight('LogMain.dll', 'LogMainView')")
    public String LogMainFormEdit(){
        return "LogMain/LogMainFormEdit :: LogMainFormEdit";
    }

    /**
     * Получение данных из таблицы TransLog по фильтру.
     * @param date
     * @param onlyError
     * @param user
     * @param app
     * @param sample
     * @param systemApp
     * @param rows
     * @param page
     * @return
     * @throws Exception
     */
    @GetMapping("/LogMain/list")
    @PreAuthorize("GetActRight('LogMain.dll', 'LogMainView')")
    public @ResponseBody DataTable list(
            @RequestParam(required = false, defaultValue = "") String date,
            @RequestParam(required = false, defaultValue = "false") boolean onlyError,
            @RequestParam(required = false, defaultValue = "") String user,
            @RequestParam(required = false, defaultValue = "") String app,
            @RequestParam(required = false, defaultValue = "") String sample,
            @RequestParam(required = false, defaultValue = "true") boolean systemApp,
            int rows, int page

    ) throws Exception {

        FilterModel filter = new FilterModel();
        filter.setDateQuery(date);
        filter.setOnlyError(onlyError);
        filter.setUser(user);
        filter.setAppName(app);
        filter.setPttrn(sample);
        filter.setExceptSystem(systemApp);
        filter.setRows(rows);
        filter.setPage(page);

        int totalCountClients = dLogMain.getTotalLogs(filter);
        List<LogMainViewModel> logs = dLogMain.list(filter);

        DataTable table = new DataTable();
        table.setTotal(totalCountClients);
        List<Object> rowsObjs = new ArrayList<>();
        for(LogMainViewModel log : logs){
            rowsObjs.add(log);
        }
        table.setRows(rowsObjs);
        return table;
    }

    /**
     * Получить список пользователей из таблицы Translog
     *
     * @param date - дата
     * @return
     * @throws Exception
     */
    @GetMapping("/LogMain/getUsers")
    @PreAuthorize("GetActRight('LogMain.dll','LogMainView')")
    public @ResponseBody
    List<UserModel> getUsers(String date) throws Exception {

        return dLogMain.getUsers(date);
    }

    /**
     * Получить имя пользователя под которым вошли в систему
     * @return
     * @throws Exception
     */
    @GetMapping("/LogMain/getActiveUser")
    @PreAuthorize("GetActRight('LogMain.dll','LogMainView')")
    public @ResponseBody
    String getActiveUser() throws Exception {
        return dLogMain.getActiveUser();
    }



    /**
     * Функция получения лога для просмотра
     * @param id - идентификатор из таблицы Translog
     * @return
     * @throws Exception
     */
    @GetMapping("/LogMain/get")
    @PreAuthorize("GetActRight('LogMain.dll','LogMainView')")
    public @ResponseBody
    LogMainModel get(int id) throws Exception {
        return dLogMain.get(id);
    }



}




