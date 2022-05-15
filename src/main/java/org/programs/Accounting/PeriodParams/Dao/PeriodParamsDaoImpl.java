package org.kaznalnrprograms.Accounting.PeriodParams.Dao;

import org.kaznalnrprograms.Accounting.PeriodParams.Interfaces.IPeriodParamsDao;
import org.kaznalnrprograms.Accounting.PeriodParams.Models.PeriodParamsModel;
import org.kaznalnrprograms.Accounting.PeriodParams.Models.PeriodParamsTaskCodesModel;
import org.kaznalnrprograms.Accounting.PeriodParams.Models.PeriodParamsViewModel;
import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class PeriodParamsDaoImpl implements IPeriodParamsDao {
    private String appName = "PeriodParams - Периодические реквизиты";
    private DBUtils db;

    public PeriodParamsDaoImpl(DBUtils db) {
        this.db = db;
    }

    /**
     * Получение списка реквизитов
     * @param showDel
     * @param filter
     * @return
     * @throws Exception
     */
    @Override
    public List<PeriodParamsViewModel> list(boolean showDel, String filter) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            String sql = "SELECT pp.id, pp.nom, pp.paramcode, pp.taskcode, pp.name, pp.del"
                    + " FROM periodparams pp "
                    + "WHERE 1 = 1 "
                    + (!showDel ? "AND pp.del = 0 " : "");

            if (!filter.isEmpty()) {
                sql += "AND LOWER(pp.taskcode) = :filter ";
                params.put("filter", filter);
            }
            sql += "ORDER BY pp.nom";
            return db.Query(con, sql, PeriodParamsViewModel.class, params);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получение реквизита по ИД
     * @param id
     * @return
     * @throws Exception
     */
    @Override
    public PeriodParamsModel get(int id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT id, paramcode, taskcode, name, nom, strict, "
                    + "reffermodul, refferfunc, reffertable, reffercode, "
                    + "creator, created, changer, changed, codejs "
                    + "FROM periodparams "
                    + "WHERE id = " + id;

            List<PeriodParamsModel> result = db.Query(con, sql, PeriodParamsModel.class, null);
            if (result.size() == 0) {
                throw new Exception("Не удалось получить запись с Id = " + id);
            }
            return result.get(0);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получение списка кодов задач
     * @return
     * @throws Exception
     */
    @Override
    public List<PeriodParamsTaskCodesModel> listTaskCodes() throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT DISTINCT LOWER(taskcode) as taskCode FROM periodparams";
            return db.Query(con, sql, PeriodParamsTaskCodesModel.class, null);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Сохранение реквизита
     * @param model
     * @return
     * @throws Exception
     */
    @Override
    public int save(PeriodParamsModel model) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("paramcode", model.getParamCode());
            params.put("taskcode", model.getTaskCode());
            params.put("name", model.getName());
            params.put("reffermodul", model.getRefferModul());
            params.put("refferfunc", model.getRefferFunc());
            params.put("reffertable", model.getRefferTable());
            params.put("reffercode", model.getRefferCode());
            params.put("codejs", model.getCodeJs());

            String sql = "";

            if (model.getId() == -1) {
                sql = "INSERT INTO periodparams (paramcode, taskcode, name, strict, reffermodul, refferfunc, reffertable, reffercode, del, nom, codejs)" +
                        "VALUES (:paramcode, :taskcode, :name, " + model.getStrict() + ", :reffermodul, :refferfunc, :reffertable, :reffercode, 0, " + model.getNom() + ", :codejs)";
                model.setId(db.Execute(con, sql, Integer.class, params));
            } else {
                db.CheckLock(con, model.getId(), "periodparams");
                sql = "UPDATE periodparams SET " +
                        "paramcode = :paramcode, " +
                        "taskcode = :taskcode ," +
                        "name = :name, " +
                        "strict = " + model.getStrict() + ", " +
                        "reffermodul = :reffermodul, " +
                        "refferfunc = :refferfunc, " +
                        "reffertable = :reffertable, " +
                        "reffercode = :reffercode, " +
                        "nom = " + model.getNom() + ", " +
                        "codejs = :codejs " +
                        "WHERE id = " + model.getId();
                db.Execute(con, sql, params);
            }
            return model.getId();
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Проверка уникальности сохраняемого реквизита
     * @param id
     * @param paramCode
     * @param taskCode
     * @return
     * @throws Exception
     */
    @Override
    public boolean checkSameCodes(int id, String paramCode, String taskCode) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("paramcode", paramCode);
            params.put("taskcode", taskCode);
            String sql = "SELECT COUNT(*) FROM periodparams " +
                    "WHERE paramcode = :paramcode AND taskcode = :taskcode AND id <>" + id;
            return db.Query(con, sql, Integer.class, params).get(0) > 0;
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Удаление реквизита по ИД
     * @param id
     * @throws Exception
     */
    @Override
    public void delete(int id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "UPDATE periodparams SET del = 1 - del WHERE id = " + id;
            db.Execute(con, sql, null);
        } catch (Exception ex) {
            throw ex;
        }
    }
}
