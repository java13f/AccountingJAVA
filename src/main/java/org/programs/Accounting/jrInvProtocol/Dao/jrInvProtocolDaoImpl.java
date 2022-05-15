package org.kaznalnrprograms.Accounting.jrInvProtocol.Dao;

import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.kaznalnrprograms.Accounting.jrInvMainAssets.Models.jrInvMainAssetsAccModel;
import org.kaznalnrprograms.Accounting.jrInvMainAssets.Models.jrInvMainAssetsInvModel;
import org.kaznalnrprograms.Accounting.jrInvMainAssets.Models.jrInvMainAssetsKterModel;
import org.kaznalnrprograms.Accounting.jrInvProtocol.Interfaces.IjrInvProtocolDao;
import org.kaznalnrprograms.Accounting.jrInvProtocol.Models.jrInvProtocolAccModel;
import org.kaznalnrprograms.Accounting.jrInvProtocol.Models.jrInvProtocolInvModel;
import org.kaznalnrprograms.Accounting.jrInvProtocol.Models.jrInvProtocolKterModel;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.ArrayList;
import java.util.List;

@Repository
public class jrInvProtocolDaoImpl implements IjrInvProtocolDao {
    private String appName = "отчет - Протокол инвентаризационной комиссии";
    private DBUtils db;

    public jrInvProtocolDaoImpl(DBUtils db) {
        this.db = db;
    }

    @Override
    public List<jrInvProtocolKterModel> getKters() throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT id, (code || ' = ' || name) as name FROM kter WHERE id IN (SELECT id FROM getterright()) ORDER BY code";
            List<jrInvProtocolKterModel> kters = db.Query(con, sql, jrInvProtocolKterModel.class, null);
            return kters;
        } catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public List<jrInvProtocolAccModel> getAccs() throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String codes = "";
            List<jrInvProtocolAccModel> result = new ArrayList<>();
            String sql = "SELECT id, (code || ' = ' || name) as name FROM accs WHERE code <> '000'";
            result = db.Query(con, sql, jrInvProtocolAccModel.class, null);
            return result;
        } catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public jrInvProtocolInvModel getInv(int id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT name FROM invs WHERE id = " + id;
            jrInvProtocolInvModel inv = db.Query(con, sql, jrInvProtocolInvModel.class, null).get(0);
            return inv;
        } catch (Exception ex) {
            throw ex;
        }
    }
}
