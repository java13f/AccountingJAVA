package org.kaznalnrprograms.Accounting.Admin.Dao;

import org.kaznalnrprograms.Accounting.Admin.Interfaces.IKterDao;
import org.kaznalnrprograms.Accounting.Admin.Models.KterViewModel;
import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.List;

@Repository
public class KterDaoImpl implements IKterDao {
    private String appName = "Admin - модуль администрирования";
    private DBUtils db;
    public KterDaoImpl(DBUtils db) {
        this.db = db;
    }
    /**
     * Получить список территорий
     */
    @Override
    public List<KterViewModel> List() throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT kt.Id, kt.Name, ko.Name as KokName FROM Kter kt, KOK ko WHERE kt.KokId = ko.Id ORDER BY kt.Code";
            return db.Query(con, sql, KterViewModel.class, null);
        }
        catch(Exception ex){
            throw ex;
        }
    }
    /**
     * Получить территорию
     * @param KterId - идентификатор территории
     */
    @Override
    public String GetKterSel(int KterId) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT LTRIM(RTRIM(CAST(Id AS VARCHAR(128)))) || ' = ' || Name FROM Kter WHERE Id = " + KterId;
            List<String> result =  db.Query(con, sql, String.class, null);
            if(result.size() == 0){
                throw new Exception("Не удалось получить территорию с Id = " + KterId);
            }
            return result.get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }
}
