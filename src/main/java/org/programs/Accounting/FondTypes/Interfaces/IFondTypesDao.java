package org.kaznalnrprograms.Accounting.FondTypes.Interfaces;

import org.kaznalnrprograms.Accounting.FondTypes.Models.FondTypesModel;
import org.kaznalnrprograms.Accounting.FondTypes.Models.GetFondTypesModel;
import org.kaznalnrprograms.Accounting.Units.Models.UnitsModels;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface IFondTypesDao {
    List<FondTypesModel> list(boolean showDel) throws Exception;
    GetFondTypesModel get(int id) throws Exception;
    void delete(int id) throws Exception;
    boolean exists(int id, String name, String code) throws Exception;
    int save(@RequestBody FondTypesModel obj) throws Exception;
}
