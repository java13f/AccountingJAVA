package org.kaznalnrprograms.Accounting.Deps.Dao;

import org.kaznalnrprograms.Accounting.Deps.Interfaces.IDepsDao;
import org.kaznalnrprograms.Accounting.Deps.Models.DepsKterModel;
import org.kaznalnrprograms.Accounting.Deps.Models.DepsModel;
import org.kaznalnrprograms.Accounting.Deps.Models.DepsUserModel;
import org.kaznalnrprograms.Accounting.Deps.Models.DepsViewModel;
import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class DepsDaoImpl implements IDepsDao {
    private String appName = "Справочник подразделений";
    private DBUtils db;

    public DepsDaoImpl(DBUtils db) {
        this.db = db;
    }

    /**
     * Получение списка записей
     * @param showDel
     * @return
     * @throws Exception
     */
    @Override
    public List<DepsViewModel> list(boolean showDel) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT d.id,(case when d.main_dep=1 then (select '*') else (select '') end) as maindep ,"
                    +"d.code, d.name, u.name as bossUserName, kt.name as kterName, d.del"
                    + " FROM deps d "
                    + "LEFT JOIN kter kt ON d.kterid = kt.id "
                    + "LEFT JOIN users u ON d.bossuserid = u.id "
                    + "WHERE kt.id IN (SELECT id FROM getterright()) "
                    + (!showDel ? " AND d.del = 0" : "")
                    + "ORDER BY kt.id, d.code";
            return db.Query(con, sql, DepsViewModel.class, null);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Проверяем есть ли уже главное подразделение на территории
     * @param id
     * @return
     * @throws Exception
     */
    @Override
    public List<DepsModel> CheckMainDep(int id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "select code,name from Deps where main_dep=1 and kterid="+id;
            return db.Query(con, sql, DepsModel.class, null);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Функция получения подразделения для просмотра/изменения
     *
     * @param id - идентификатор подразделения
     * @return
     * @throws Exception
     */
    @Override
    public DepsModel get(int id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT d.id, d.code , d.name, CASE WHEN u.id is NULL THEN -1 else u.id END as bossUserId, k.Id as kterId, " +
                    "d.creator, d.created, d.changer, d.changed " +
                    ",(select name from deps ds where d.parent_id=ds.id) parentName " +
                    "FROM Deps d " +
                    "LEFT JOIN Users u ON d.bossUserId = u.id " +
                    "JOIN Kter k ON d.kterId = k.id " +
                    "WHERE d.Id = " + id + " and k.Id in (select id from getterright()) ";

            List<DepsModel> result = db.Query(con, sql, DepsModel.class, null);

            if (result.size() == 0) {
                throw new Exception("Не удалось получить подразделение с Id = " + id);
            }
            return result.get(0);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Сохранение записи в базу данных
     * @param deps
     * @return
     * @throws Exception
     */
    @Override
    public int save(DepsModel deps) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "";
            Map<String, Object> params = new HashMap<>();
            params.put("code", deps.getCode());
            params.put("name", deps.getName());
            params.put("main_dep",deps.getMain_dep());
            String bossUserId = "NULL";
            if (deps.getBossUserId() != -1) {
                bossUserId = Integer.toString(deps.getBossUserId());
            }
            if (deps.getId() == -1) {
                sql = "INSERT INTO deps (code, name, kterId, bossUserId, del,main_dep) "
                        + "VALUES(:code, :name, " + deps.getKterId() + ", " + bossUserId + ", 0,:main_dep)";
                deps.setId(db.Execute(con, sql, Integer.class, params));
            } else {
                db.CheckLock(con, deps.getId(), "deps");
                sql = "UPDATE deps SET " +
                        "code = :code, " +
                        "name = :name, " +
                        "kterId = " + deps.getKterId() + ", " +
                        "bossUserId = " + bossUserId + ", " +
                        "main_dep = :main_dep"+
                        " WHERE id = " + deps.getId();
                db.Execute(con, sql, params);
            }
            return deps.getId();
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
            String sql = "UPDATE deps SET del = 1 - del WHERE id = " + id;
            db.Execute(con, sql, null);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Проверка уникальности сохраняемой записи по территории и коду подразделения
     * @param id
     * @param kterId
     * @param code
     * @return
     * @throws Exception
     */
    @Override
    public boolean checkSameCode(int id, int kterId, String code) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("code", code);
            String sql = "SELECT COUNT(*) as cnt from Deps where Code = :code AND kterId = " + kterId + " AND id <>" + id;
            return db.Query(con, sql, Integer.class, params).get(0) > 0;
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получение территории по ИД
     * @param id
     * @return
     * @throws Exception
     */
    @Override
    public DepsKterModel getKter(int id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT id, CAST(id as VARCHAR(128)) || ' = ' || Name as Name FROM kter WHERE id = " + id;
            return db.Query(con, sql, DepsKterModel.class, null).get(0);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получение пользователя по ИД
     * @param id
     * @return
     * @throws Exception
     */
    @Override
    public DepsUserModel getBossUser(int id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT id, CAST(id as VARCHAR(128)) || ' = ' || Name as Name FROM users WHERE id = " + id;
            return db.Query(con, sql, DepsUserModel.class, null).get(0);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получение всех доступных для территории пользователей
     * @return
     * @throws Exception
     */
    @Override
    public List<DepsUserModel> getUsers() throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT id, CAST(id as VARCHAR(128)) || ' = ' || Name as Name FROM users " +
                    "WHERE id IN (SELECT id FROM getterright()) " +
                    "ORDER BY users.name";
            return db.Query(con, sql, DepsUserModel.class, null);
        } catch (Exception ex) {
            throw ex;
        }
    }
}
