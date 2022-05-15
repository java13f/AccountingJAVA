package org.kaznalnrprograms.Accounting.Units.Interfaces;

import org.kaznalnrprograms.Accounting.Units.Models.GetUnitsModels;
import org.kaznalnrprograms.Accounting.Units.Models.UnitsModels;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface IUnitsDao {
    List<UnitsModels> list(boolean showDel) throws Exception;
    /**
     * проверка на уникальность
     * @param id
     * @param name
     * @param code
     * @return
     * @throws Exception
     */
    boolean exists(int id, String name, String code) throws Exception;
    int save(@RequestBody UnitsModels obj) throws Exception;
    /**
     * получение списка значекний при открытии на редактирование
     * @param id
     * @return
     * @throws Exception
     */
    GetUnitsModels get(int id) throws Exception;
    void delete(int id) throws Exception;

}
