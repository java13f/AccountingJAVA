package org.kaznalnrprograms.Accounting.jrWearCalc.Interfaces;

import org.kaznalnrprograms.Accounting.jrWearCalc.Models.UserModel;
import org.kaznalnrprograms.Accounting.jrWearCalc.Models.JrKterModel;
import org.kaznalnrprograms.Accounting.jrWearCalc.Models.JrWearCalcSaveModel;
import org.kaznalnrprograms.Accounting.jrWearCalc.Models.JrWearCalcViewModel;

import java.util.List;

public interface IjrWearCalcDao
{
    List<JrWearCalcViewModel> GetRecords(Integer kterId) throws Exception;

    List<JrKterModel> GetKters() throws Exception;

    Integer IsDayOpen(String date) throws Exception;

    Integer WearUntilSelectedDate(String selectedDate, Integer kterId, Integer stts, Integer year) throws Exception;

    Integer WearOnSelectedDate(String selectedDate, Integer kterId, Integer stts) throws Exception;

    Integer Calc(JrWearCalcSaveModel model) throws Exception;

    UserModel getUser() throws Exception;

    Integer getLastAddedRec(String date, Integer stts) throws Exception;

    String getActRight() throws Exception;
}
