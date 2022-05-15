package org.kaznalnrprograms.Accounting.jrTurnoverBalanceSheet;

import java.util.List;

public interface IjrTurnoverBalanceSheetDao {
    List<jrTurnoverBalanceSheetAccModel> getAccs() throws Exception;
}
