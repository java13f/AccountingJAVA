package org.kaznalnrprograms.Accounting.Admin.Interfaces;

import org.kaznalnrprograms.Accounting.Admin.Models.KterViewModel;

import java.util.List;

public interface IKterDao {
    /**
     * Получить список территорий
     */
    List<KterViewModel> List() throws Exception;

    /**
     * Получить территорию
     * @param KterId - идентификатор территории
     */
    String GetKterSel(int KterId) throws Exception;
}
