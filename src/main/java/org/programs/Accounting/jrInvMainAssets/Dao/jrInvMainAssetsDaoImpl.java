package org.kaznalnrprograms.Accounting.jrInvMainAssets.Dao;

import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.kaznalnrprograms.Accounting.jrInvMainAssets.Interfaces.IjrInvMainAssetsDao;
import org.kaznalnrprograms.Accounting.jrInvMainAssets.Models.jrInvMainAssetsAccModel;
import org.kaznalnrprograms.Accounting.jrInvMainAssets.Models.jrInvMainAssetsInvModel;
import org.kaznalnrprograms.Accounting.jrInvMainAssets.Models.jrInvMainAssetsKterModel;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class jrInvMainAssetsDaoImpl implements IjrInvMainAssetsDao {
    private String appName = "отчет - Инвентарная опись основных средств";
    private DBUtils db;

    public jrInvMainAssetsDaoImpl(DBUtils db) {
        this.db = db;
    }

    /***
     * Получения списка территорий
     * @return
     * @throws Exception
     */
    @Override
    public List<jrInvMainAssetsKterModel> getKters() throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT id, (code || ' = ' || name) as name FROM kter WHERE id IN (SELECT id FROM getterright()) ORDER BY code";
            List<jrInvMainAssetsKterModel> kters = db.Query(con, sql, jrInvMainAssetsKterModel.class, null);
            return kters;
        } catch (Exception ex) {
            throw ex;
        }
    }

    /***
     * Получение списка счетов
     * @return
     * @throws Exception
     */
    @Override
    public List<jrInvMainAssetsAccModel> getAccs(int accs) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String codes = "";
            List<jrInvMainAssetsAccModel> result = new ArrayList<>();
            if (accs == 1 || accs == 2) { // 103-106
                codes = "'103', '104', '105', '106'";
            } else if (accs == 3 || accs == 4) { // 113
                codes = "'113'";
            } else {
                return result;
            }
            String sql = "SELECT id, (code || ' = ' || name) as name FROM accs WHERE code IN(" + codes + ")";
            result = db.Query(con, sql, jrInvMainAssetsAccModel.class, null);
            return result;
        } catch (Exception ex) {
            throw ex;
        }
    }

    /***
     * Получение шаблона инвентаризации по Id
     * @param id
     * @return
     * @throws Exception
     */
    @Override
    public jrInvMainAssetsInvModel getInv(int id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT name FROM invs WHERE id = " + id;
            jrInvMainAssetsInvModel inv = db.Query(con, sql, jrInvMainAssetsInvModel.class, null).get(0);
            return inv;
        } catch (Exception ex) {
            throw ex;
        }
    }

    //    @Override
//    public jrInvMainAssetsInvModel getInv(int id) throws Exception {
//        try (Connection con = db.getConnection(appName)) {
//            Map<String, Object> params = new HashMap<>();
//            String sql = "SELECT " +
//                    "id, " +
//                    "name, " +
//                    "matres_post_1, " +
//                    "matres_fio_1, " +
//                    "CASE WHEN matres_post_2 IS NULL THEN '' ELSE matres_post_2 END matres_post_2, " +
//                    "CASE WHEN matres_fio_2 IS NULL THEN '' ELSE matres_fio_2 END matres_fio_2, " +
//                    "CASE WHEN matres_post_3 IS NULL THEN '' ELSE matres_post_3 END matres_post_3, " +
//                    "CASE WHEN matres_fio_3 IS NULL THEN '' ELSE matres_fio_3 END matres_fio_3, " +
//                    "order_numb, " +
//                    "date_prep, " +
//                    "date_ord, " +
//                    "date_as_of, " +
//                    "date_begin, " +
//                    "date_end, " +
//                    "commis_ch_post, " +
//                    "commis_ch_fio, " +
//                    "check_post, " +
//                    "check_fio " +
//                    "FROM invs " +
//                    "WHERE id = " + id;
//            jrInvMainAssetsInvModel inv = db.Query(con, sql, jrInvMainAssetsInvModel.class, params).get(0);
//            return inv;
//        } catch (Exception ex) {
//            throw ex;
//        }
//    }
}
