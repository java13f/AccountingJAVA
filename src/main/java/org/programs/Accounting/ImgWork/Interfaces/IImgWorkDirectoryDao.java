package org.kaznalnrprograms.Accounting.ImgWork.Interfaces;

import org.kaznalnrprograms.Accounting.ImgWork.Models.ImgDelModel;
import org.kaznalnrprograms.Accounting.ImgWork.Models.ImgLockModel;
import org.kaznalnrprograms.Accounting.ImgWork.Models.ImgWorkModel;

public interface IImgWorkDirectoryDao {

    /**
     * Получить изображение по нажатию на кнопку вид
     * @param objectId - id. таблицы, к которой относится изображение
     * @param recId - id записи, к которой относится изображение
     * @return
     * @throws Exception
     */
    ImgWorkModel get(int objectId, int recId, String sesId, String listParamId, String periodParamId, String period_lock_id, String imgLockId) throws Exception;

    /**
     * Добавить изображение
     * @param imgLck
     * @return
     * @throws Exception
     */
    int save (ImgLockModel imgLck) throws Exception;


    /**
     * Получить изображение из временной таблицы
     * @param tmpimgLck
     * @return
     * @throws Exception
     */
    ImgLockModel getimglock(ImgLockModel tmpimgLck) throws Exception;

    /**
     * Получить изображение из таблицы imgvalue, если нет -1
     * @param  objectid
     * @param  recid
     * @return
     * @throws Exception
     */
    ImgWorkModel getimgvalue(int objectid, int recid) throws Exception;


    /**
     * Удалить изображение из временной таблицы
     * @param imgDelModel
     * @return
     * @throws Exception
     */
    String delete(ImgLockModel imgDelModel) throws Exception;


}


