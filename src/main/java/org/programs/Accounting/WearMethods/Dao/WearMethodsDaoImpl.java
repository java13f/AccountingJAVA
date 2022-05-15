package org.kaznalnrprograms.Accounting.WearMethods.Dao;

import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.kaznalnrprograms.Accounting.WearMethods.Interfaces.IWearMethodsDao;
import org.kaznalnrprograms.Accounting.WearMethods.Models.AccViewModel;
import org.kaznalnrprograms.Accounting.WearMethods.Models.WearMethodsModel;
import org.kaznalnrprograms.Accounting.WearMethods.Models.InvGroupViewModel;
import org.kaznalnrprograms.Accounting.WearMethods.Models.WearMethodsViewModel;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class WearMethodsDaoImpl implements IWearMethodsDao {
    private String appName = "Методы начисления";
    private DBUtils db;

    public WearMethodsDaoImpl(DBUtils db) {
        this.db = db;
    }

    /**
     * Получение списка записей методов начисления износа
     * @param showDel
     * @return
     * @throws Exception
     */
    @Override
    public List<WearMethodsViewModel> getWearMethodsList(boolean showDel) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "select wm.id, ac.code as accCode, ig.name as grName, wm.perc::decimal || '%' as perc, wm.del " +
                    "from wear_mthds wm " +
                    "join inv_grps ig on ig.id = wm.inv_grp_id " +
                    "join accs ac on ac.id = wm.acc_id " +
                    "WHERE 1=1 ";
                    if(!showDel){
                        sql+="AND wm.Del = 0 ";
                    }
                    sql+="order by wm.code";
            return db.Query(con, sql, WearMethodsViewModel.class, null);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Функция получения метода начисления износа для просмотра/изменения
     *
     * @param id - идентификатор метода начисления износа
     * @return
     * @throws Exception
     */
    @Override
    public WearMethodsModel getWearMethodById(int id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "select wm.id, ac.id as accId, ig.id as grId, ac.id || ' = ' || ac.code || '-' || ac.Name as accName, ig.id || ' = ' || ig.name as grName, wm.perc::decimal, wm.creator, wm.created, wm.changer, wm.changer, wm.changed " +
                    "from wear_mthds wm " +
                    "join inv_grps ig on ig.id = wm.inv_grp_id " +
                    "join accs ac on ac.id = wm.acc_id " +
                    "where wm.id="+id;

            List<WearMethodsModel> result = db.Query(con, sql, WearMethodsModel.class, null);

            if (result.size() == 0) {
                throw new Exception("Не удалось получить запись с Id = " + id);
            }
            return result.get(0);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Функция получения метода начисления износа для просмотра/изменения
     *
     * @param id - идентификатор метода начисления износа
     * @return
     * @throws Exception
     */
    @Override
    public InvGroupViewModel getInvGrById(int id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "select id, id || ' = ' || name as name from inv_grps where id="+id;

            List<InvGroupViewModel> result = db.Query(con, sql, InvGroupViewModel.class, null);

            if (result.size() == 0) {
                throw new Exception("Не удалось получить запись с Id = " + id);
            }
            return result.get(0);
        } catch (Exception ex) {
            throw ex;
        }
    }


    @Override
    public List<InvGroupViewModel> getInvGrList() throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "select id, id || ' = ' || code || '-' || name as name from inv_grps where del=0 order by id";

            return db.Query(con, sql, InvGroupViewModel.class, null);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Функция получения метода начисления износа для просмотра/изменения
     *
     * @param id - идентификатор метода начисления износа
     * @return
     * @throws Exception
     */
    @Override
    public AccViewModel getAccById(int id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "select id, id || ' = ' || code || '-' || name as name from accs where id="+id;

            List<AccViewModel> result = db.Query(con, sql, AccViewModel.class, null);

            if (result.size() == 0) {
                throw new Exception("Не удалось получить запись с Id = " + id);
            }
            return result.get(0);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Проверка уникальности сохраняемой записи по территории и коду подразделения
     * @param id
     * @return
     * @throws Exception
     */
    @Override
    public boolean checkForDublicate(int id, int grId, int accId) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "select count(*) as cnt from wear_mthds where id <> " + id + " and inv_grp_id = " + grId + " and acc_id = " + accId;
            return db.Query(con, sql, Integer.class, null).get(0) > 0;
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Сохранение записи в базу данных
     * @return
     * @throws Exception
     */
    @Override
    public int save(WearMethodsModel model) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "";
            Map<String, Object> params = new HashMap<>();
            params.put("perc", new BigDecimal(model.getPerc()));

            if (model.getId() == -1) {
                sql = "INSERT INTO wear_mthds (perc, inv_grp_id, acc_id, del) "
                        + "VALUES(:perc," + model.getGrId() + "," + model.getAccId() + "," + "0)";
                model.setId(db.Execute(con, sql, Integer.class, params));
            } else {
                db.CheckLock(con, model.getId(), "wear_mthds");
                sql = "UPDATE wear_mthds SET " +
                        "perc = :perc, " +
                        "inv_grp_id = " + model.getGrId() + ", " +
                        "acc_id = " + model.getAccId() +
                        " WHERE id = " + model.getId();
                db.Execute(con, sql, params);
            }
            return model.getId();
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Удаление записи по ИД
     * @param id
     * @throws Exception
     */
    @Override
    public void delete(int id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "UPDATE wear_mthds SET del = 1 - del WHERE id = " + id;
            db.Execute(con, sql, null);
        } catch (Exception ex) {
            throw ex;
        }
    }
}
