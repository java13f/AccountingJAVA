package org.kaznalnrprograms.Accounting.jrObjectList.Interfaces;

import org.kaznalnrprograms.Accounting.jrObjectList.Models.*;

import java.util.List;

public interface IjObjectDirectoryDao {

    /**
     * Получить id, name из табл. Location
     * @return
     * @throws Exception
     */
    List<jrObjectListLocationCmb> LoadLocations(int id) throws Exception;


    /**
     * Получить id, name, code из табл. Kter
     * @return
     * @throws Exception
     */
    List<jrObjectListKterCmb> LoadKter() throws Exception;

    /**
     * Получить имя авторизированного пользователя AccountingJAVA
     * @return
     * @throws Exception
     */
    public String LoadUser() throws Exception;


}
