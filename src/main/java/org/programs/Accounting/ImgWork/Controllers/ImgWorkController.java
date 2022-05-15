package org.kaznalnrprograms.Accounting.ImgWork.Controllers;

import org.kaznalnrprograms.Accounting.ImgWork.Interfaces.IImgWorkDirectoryDao;
import org.kaznalnrprograms.Accounting.ImgWork.Models.ImgDelModel;
import org.kaznalnrprograms.Accounting.ImgWork.Models.ImgLockModel;
import org.kaznalnrprograms.Accounting.ImgWork.Models.ImgWorkModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class ImgWorkController {
    private IImgWorkDirectoryDao dImgwork;

    public ImgWorkController(IImgWorkDirectoryDao dImgwork){
        this.dImgwork = dImgwork;
    }

    /**
     * функция получения изображения для редактирование
     * @param objectId
     * @param recId
     * @return
     * @throws Exception
     */
    @GetMapping("/ImgWork/get")
    //@PreAuthorize("GetActRigth('ImgWork.dll', 'ImgWorkView')")
    public @ResponseBody ImgWorkModel get(int objectId, int recId, String sesId, String listParamId, String periodParamId, String period_lock_id, String imgLockId) throws Exception{
        return dImgwork.get(objectId, recId, sesId, listParamId, periodParamId, period_lock_id, imgLockId);
    }

    /**
     * Получить частичное представление окна добавления/изменения записи
     * @return
     */
    @GetMapping("/ImgWork/ImgWorkForm")
   // @PreAuthorize("GetActRight('ImgWork.dll', 'ImgWork')")
    public String ImgWorkFormList(){
        return "ImgWork/ImgWorkForm::ImgWorkForm";
    }

    /**
     * Добавить изображение
     * @param imgLck - модель таблицы imglock
     * @return
     * @throws Exception
     */
   @PostMapping("/ImgWork/save")
   //@PreAuthorize("GetActRight('ImgWork.dll', 'ImgWork')")
   public @ResponseBody int save(@RequestBody ImgLockModel imgLck) throws Exception{
        return dImgwork.save(imgLck);
   }

    /**
     * Удаление изображения из временной таблицы
     * @param imgdl
     * @return
     * @throws Exception
     */
   @PostMapping("/ImgWork/delete")
    public @ResponseBody String delete(@RequestBody ImgLockModel imgdl) throws Exception{
       return dImgwork.delete(imgdl);
   }

 /*  @PostMapping("/ImgWork/getimglock")
    public @ResponseBody ImgLockModel getimglock(@RequestBody ImgLockModel tmpimgLck) throws Exception{
       return dImgwork.getimglock(tmpimgLck);
   }*/

}
