package org.kaznalnrprograms.Accounting.jrOSV;

import org.kaznalnrprograms.Accounting.jrOSV.Models.jrOSVAccModel;

import java.util.List;

public interface IjrOSVDao {

    List<jrOSVAccModel>  getAccs() throws Exception;
    String               getUser(int id) throws Exception;
}
