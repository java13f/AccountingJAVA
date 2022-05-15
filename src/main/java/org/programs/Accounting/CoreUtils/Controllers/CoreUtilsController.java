package org.kaznalnrprograms.Accounting.CoreUtils.Controllers;

import org.kaznalnrprograms.Accounting.CoreUtils.Interfaces.ICoreUtilsDao;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.UUID;

@Controller
public class CoreUtilsController {
    private ICoreUtilsDao dCoreUtils;
    public CoreUtilsController(ICoreUtilsDao dCoreUtils){
        this.dCoreUtils = dCoreUtils;
    }
    /**
     * Проверить право на действие
     * @param TaskCode - код приложения
     * @param ActCode - код действия
     */
    @GetMapping("/CoreUtils/GetActRights")
    public @ResponseBody String GetActRights(String TaskCode, String ActCode) throws Exception {
        return dCoreUtils.GetActRights(TaskCode, ActCode);
    }

    /**
     * Функция генерации уникального идентификатора
     * @return
     */
    @GetMapping("/CoreUtils/GetUUID")
    public @ResponseBody String GetUUID(){
        return UUID.randomUUID().toString();
    }
}
