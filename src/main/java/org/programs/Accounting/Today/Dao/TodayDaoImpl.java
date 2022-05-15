package org.kaznalnrprograms.Accounting.Today.Dao;

import org.kaznalnrprograms.Accounting.Today.Interfaces.IToday;
import org.kaznalnrprograms.Accounting.Today.Models.Today;
import org.kaznalnrprograms.Accounting.Today.Models.TodayOpenClose;
import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.*;

@Repository
public class TodayDaoImpl implements IToday {
    private String appName = "Today - Точка актуальность";
    private DBUtils db;

    public TodayDaoImpl(DBUtils db) {
        this.db = db;
    }

    /**
     * Получить список дней
     *
     * @return
     * @throws Exception
     */
    @Override
    public List<Today> getTodayList() throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT t.id, to_char(DATE_TRUNC('second', t.date), 'DD.MM.YYYY') date, CASE WHEN t.openmode = 0 THEN 'Закрыт' ELSE 'Открыт' END openmode," +
                    " t.created, t.creator, t.changer, t.changed, COUNT(tu.todayid) cntusers" +
                    " FROM Today t LEFT JOIN TodayUsers tu ON t.id = tu.todayid" +
                    " GROUP BY t.id" +
                    " ORDER BY t.date";
            return db.Query(con, sql, Today.class, null);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получить день
     *
     * @param id - идентификатор дня
     * @return
     * @throws Exception
     */
    @Override
    public Today getTodayRecord(int id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT id, to_char(DATE_TRUNC('second', date), 'DD.MM.YYYY') date, openmode, creator, created, changer, changed FROM Today WHERE id = " + id;
            List<Today> result = db.Query(con, sql, Today.class, null);

            if (result.isEmpty()) {
                throw new Exception("Не удалось получить территорию с Id = " + id);
            }

            return result.get(0);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Удалить день
     *
     * @param todayid
     * @throws Exception
     */
    @Override
    public String deleteToday(int todayid) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT COUNT(*) FROM TodayUsers WHERE todayid = " + todayid + " AND del = 0";
            Integer result = db.Query(con, sql, Integer.class, null).get(0);
            if (result > 0)
                return "Невозможно удалить день. У дня есть пользователи.";
            else {
                db.Execute(con, "DELETE FROM TodayUsers WHERE TodayId = " + todayid, null);
                db.Execute(con, "DELETE FROM Today WHERE id = " + todayid, null);
            }
            return "";
        } catch (Exception ex) {
            throw ex;
        }
    }


    /**
     * Сохранить день
     *
     * @param today - модель дня
     * @return
     * @throws Exception
     */
    @Override
    public int saveToday(Today today) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "";
            Map<String, Object> params = new HashMap<>();
            params.put("date", today.getDate());
            params.put("openmode", Integer.parseInt(today.getOpenmode()));
            if (today.getId() == -1) {
                sql = "INSERT INTO Today (date, openmode, recalcflag)"
                        + " VALUES(cast(:date AS timestamp without time zone), :openmode, 0)";
                today.setId(db.Execute(con, sql, Integer.class, params));
            } else {
                db.CheckLock(con, today.getId(), "today");
                sql = "UPDATE Today SET date = cast(:date AS timestamp without time zone), openmode = :openmode, recalcflag = 0 WHERE id = " + today.getId();
                db.Execute(con, sql, params);
            }
            return today.getId();
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Проверить пере сохранением существует ли уже такой день
     *
     * @param id   - идентификатор дня
     * @param date - сохраняемоя дата
     * @return
     * @throws Exception
     */
    @Override
    public boolean existsDay(int id, String date) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("date", date);
            String sql = "SELECT COUNT(*) FROM Today WHERE date = cast(:date AS timestamp without time zone) AND id <> " + id;
            return db.Query(con, sql, Integer.class, params).get(0) > 0;
        } catch (Exception ex) {
            throw ex;
        }
    }


    @Override
    public void addDays(TodayOpenClose toc) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> param = new HashMap<>();
            param.put("year", toc.getYear());
            param.put("mode", toc.getMode());
            String sql = "select open_close_year(:year,:mode) ";
            db.Query(con, sql, param);
        } catch (Exception ex) {
            throw ex;
        }
    }




}
