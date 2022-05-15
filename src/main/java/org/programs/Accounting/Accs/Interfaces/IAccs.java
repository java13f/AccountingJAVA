package org.kaznalnrprograms.Accounting.Accs.Interfaces;

import org.kaznalnrprograms.Accounting.Accs.Models.*;

import java.util.List;

public interface IAccs
{
    List<AccsViewModel> getAccsList(boolean del) throws Exception;

    AccsModel getAcc(int id) throws Exception;

    int save(AccsModel model) throws Exception;

    void delete(int id) throws Exception;

    boolean exists(int id, String code) throws Exception;
}
