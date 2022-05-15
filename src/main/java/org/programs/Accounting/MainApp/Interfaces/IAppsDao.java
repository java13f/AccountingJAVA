package org.kaznalnrprograms.Accounting.MainApp.Interfaces;

import org.kaznalnrprograms.Accounting.MainApp.Models.AppModel;


import java.sql.SQLException;
import java.util.List;

public interface IAppsDao {
    List<AppModel> getApps() throws Exception;
}
