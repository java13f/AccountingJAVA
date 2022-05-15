package org.kaznalnrprograms.Accounting.CoreUtils.Interfaces;

public interface ICoreUtilsDao {
    /**
     * Проверить право на действие
     * @param TaskCode - код приложения
     * @param ActCode - код действия
     */
    String GetActRights(String TaskCode, String ActCode) throws Exception;
}
