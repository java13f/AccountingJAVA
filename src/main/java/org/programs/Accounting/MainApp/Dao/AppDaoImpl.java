package org.kaznalnrprograms.Accounting.MainApp.Dao;

import org.kaznalnrprograms.Accounting.MainApp.Interfaces.IAppsDao;
import org.kaznalnrprograms.Accounting.MainApp.Models.AppModel;
import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Repository
public class AppDaoImpl implements IAppsDao {
    private String appName = "MainApp - основное приложение";
    private DBUtils db;

    public AppDaoImpl(DBUtils db) {
        this.db = db;
    }
    private List<AppModel> getChildApps(Connection con, List<AppModel> allApps, Integer id) {
        List<AppModel> apps = allApps.stream().filter((a)->a.getParentid()==id).collect(Collectors.toList());
        for (AppModel app: apps) {
            app.setApps(getChildApps(con, allApps, app.getId()));
        }
        return apps;
    }

    @Override
    public List<AppModel> getApps() throws Exception {
        try(Connection con = db.getConnection(appName))
        {
            String sql = "SELECT Id, CodeJs as Code, code as codedll, Name, Report, ParentId FROM Apps WHERE getapprights(code)=1 ORDER BY CASE WHEN Report = 3 THEN 3 ELSE 0 END DESC, SortCode, Id";
            List<AppModel> allApps = db.Query(con, sql, AppModel.class, null);
            List<AppModel> rootApps = allApps.stream().filter((a)->a.getParentid()==null).collect(Collectors.toList());
            for(AppModel app:rootApps){
                app.setApps(getChildApps(con, allApps, app.getId()));
            }
            return rootApps;
        }
        catch(Exception ex)
        {
            throw ex;
        }
    }
}
