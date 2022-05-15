package org.kaznalnrprograms.Accounting.reffers.Interfaces;

import org.kaznalnrprograms.Accounting.reffers.Models.*;

import java.util.List;

public interface IReffersDao {
    /**
     * Получить данные в выпадающий список справочников
      * @return
     * @throws Exception
     */
    List<ReffersAll> getReffersAll()  throws Exception;

    /**
     * Получить данные для грида
     * @return
     * @throws Exception
     */
    dataTable          getReffers(int paramId, boolean showDel, int page, int rows)                            throws Exception;
    List<ReffersParams>    getReffersParams(String refferCode, int id, int paramId, String sesId)              throws Exception;
    String                 getOneParam(String refferTable, int id,int ownerId, int paramId)                    throws Exception;
    int                    save(reffersSave model)                                                             throws Exception;
    oneReffer              getOneReffer(int id)                                                                throws Exception;
    void                   delete(int id)                                                                      throws Exception;
    imgParams              getImgParams(String paramCode, int refferParamId, String sesId, int id, int recId)  throws Exception;
    void                   delImgLock(String sesId)                                                            throws Exception;
    String                 getSesId()                                                                          throws Exception;
    String                 getImgLockDel(int imgLockId)                                                        throws Exception;

}
