package org.kaznalnrprograms.Accounting.KEKR.Interfaces;

import org.kaznalnrprograms.Accounting.KEKR.Models.KEKRModel;
import org.kaznalnrprograms.Accounting.KEKR.Models.KEKRViewModel;

import java.util.List;

public interface IKEKR
{
    List<KEKRViewModel> getKEKRList(boolean del) throws Exception;

    KEKRModel getRec(int id) throws Exception;

    int save(KEKRModel model) throws Exception;

    void delete(int id) throws Exception;

    boolean exists(int id, String code) throws Exception;
}
