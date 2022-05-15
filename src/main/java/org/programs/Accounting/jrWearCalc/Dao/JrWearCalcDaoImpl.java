package org.kaznalnrprograms.Accounting.jrWearCalc.Dao;

import org.kaznalnrprograms.Accounting.jrWearCalc.Models.UserModel;
import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.kaznalnrprograms.Accounting.jrWearCalc.Interfaces.IjrWearCalcDao;
import org.kaznalnrprograms.Accounting.jrWearCalc.Models.JrKterModel;
import org.kaznalnrprograms.Accounting.jrWearCalc.Models.JrWearCalcSaveModel;
import org.kaznalnrprograms.Accounting.jrWearCalc.Models.JrWearCalcViewModel;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class JrWearCalcDaoImpl implements IjrWearCalcDao
{
    private String appName = "WearCalc - расчёт износа";
    private DBUtils db;

    public JrWearCalcDaoImpl(DBUtils db)
    {
        this.db = db;
    }

    /**
     * Получить список записей
     *
     * @param kterId - территория
     */
    @Override
    public List<JrWearCalcViewModel> GetRecords(Integer kterId) throws Exception
    {
        try (Connection con = db.getConnection(appName))
        {
            Map<String, Object> params = new HashMap<>();
            params.put("kterId", kterId);
            String sql = "SELECT o.id, to_char(DATE_TRUNC('second', o.date), 'DD.MM.YYYY') date, " + "SUBSTRING(CAST(o.amount + o2.amount AS character varying), 0, LENGTH(CAST(o.amount + o2.amount AS character varying)) - 1) amount," + "CASE WHEN o.stts = 0 THEN 'Новая' WHEN o.stts = 3 THEN 'Исполнена' ELSE 'Неизвестен' END stts, " + "o.stts idStts, k.name terr " + "FROM orders o " + "JOIN (SELECT o2.parentid, SUM(o2.amount) amount FROM orders o " + "LEFT JOIN orders o2 ON o.id = o2.parentid " + "WHERE o.ordertypeid = 50 AND o.parentid IS NULL " + "GROUP BY o2.parentid " + "ORDER BY o2.parentid) o2 ON o.id = o2.parentid " + "JOIN objs ob ON o.objid = ob.id " + "JOIN periodvalues pv ON o.objid = pv.ownerid " + "JOIN periodparams pp ON pp.id = pv.paramid " + "JOIN locations l ON l.id = pv.val :: integer " + "JOIN deps d ON d.id = l.depid " + "JOIN kter k ON k.id = d.kterid " + "WHERE pp.taskcode = 'objs' AND pp.paramcode = 'location' AND o.ordertypeid = 50 AND k.id = :kterId " + "ORDER BY o.date ASC";
            return db.Query(con, sql, JrWearCalcViewModel.class, params);
        } catch (Exception ex)
        {
            throw ex;
        }
    }

    /**
     * Получить список территорий
     *
     * @return
     * @throws Exception
     */
    @Override
    public List<JrKterModel> GetKters() throws Exception
    {
        try (Connection con = db.getConnection(appName))
        {
            String sql = "SELECT gtr.id, gtr.code, gtr.name FROM getterright() gtr ORDER BY gtr.code";
            return db.Query(con, sql, JrKterModel.class, null);
        } catch (Exception ex)
        {
            throw ex;
        }
    }

    /**
     * Проверка открытости дня
     *
     * @param date
     * @return
     * @throws Exception
     */
    @Override
    public Integer IsDayOpen(String date) throws Exception
    {
        try (Connection con = db.getConnection(appName))
        {
            Map<String, Object> params = new HashMap<>();
            params.put("date", date);
            String sql = "SELECT COUNT(*) cnt FROM todayusers tu" +
                    " JOIN users u ON u.id = tu.userid" +
                    " JOIN today t ON t.id = tu.todayid" +
                    " WHERE u.code = '" + db.getUserCode() + "' AND tu.del = 0";
            List<String> result = db.Query(con, sql, String.class, null);
            if (Integer.parseInt(result.get(0)) > 0) {
                throw new Exception("Не нравится пользователь");
            } else {
                sql = "SELECT COUNT(*) cnt FROM today WHERE Date = CAST(:date as timestamp without time zone) AND OpenMode = 1";
                List<String> result1 = db.Query(con, sql, String.class, params);
                return Integer.parseInt(result1.get(0));
            }
        } catch (Exception ex)
        {
            throw ex;
        }
    }

    /**
     * Проверка расчёта износа в года за исключением текущей даты
     *
     * @param selectedDate
     * @param kterId
     * @param stts
     * @param year
     * @return
     * @throws Exception
     */
    @Override
    public Integer WearUntilSelectedDate(String selectedDate, Integer kterId, Integer stts, Integer year) throws Exception
    {
        try (Connection con = db.getConnection(appName))
        {
            Map<String, Object> params = new HashMap<>();
            params.put("selectedDate", selectedDate);
            params.put("kterId", kterId);
            params.put("stts", stts);
            params.put("year", year);
            String sql = "SELECT COUNT(*)\n " + "FROM orders o\n " + "JOIN (select * from perval_list_by_date('location', :selectedDate::date)) ob ON o.objid = ob.obj_id " + "JOIN locations l ON l.id = ob.val :: integer\n " + "JOIN deps d ON d.id = l.depid\n " + "JOIN kter k ON k.id = d.kterid \n " + "WHERE o.ordertypeid = 50 AND k.id = :kterId " + "AND o.date BETWEEN CAST('01/01/' || :year AS timestamp without time zone) AND CAST('31/12/' || :year AS timestamp without time zone) " + "AND o.date <> CAST(:selectedDate AS timestamp without time zone) " + "AND o.stts = :stts";
            List<Integer> result = db.Query(con, sql, Integer.class, params);

            if (result.size() == 0)
            {
                throw new Exception("Не удалось совершить проверку всех заявок в рамках текущего года");
            }

            return result.get(0);
        } catch (Exception ex)
        {
            throw ex;
        }
    }

    /**
     * Проверка расчёта износа на выбранную дату
     *
     * @param selectedDate
     * @param kterId
     * @param stts
     * @return
     * @throws Exception
     */
    @Override
    public Integer WearOnSelectedDate(String selectedDate, Integer kterId, Integer stts) throws Exception
    {
        try (Connection con = db.getConnection(appName))
        {
            Map<String, Object> params = new HashMap<>();
            params.put("selectedDate", selectedDate);
            params.put("kterId", kterId);
            params.put("stts", stts);
            String sql = "SELECT COUNT(*)\n" + "FROM orders o \n" + "JOIN objs ob ON o.objid = ob.id\n" + "JOIN periodvalues pv ON o.objid = pv.ownerid\n" + "JOIN periodparams pp ON pp.id = pv.paramid\n" + "JOIN locations l ON l.id = pv.val :: integer\n" + "JOIN deps d ON d.id = l.depid\n" + "JOIN kter k ON k.id = d.kterid \n" + "WHERE pp.taskcode = 'objs' AND pp.paramcode = 'location' AND o.ordertypeid = 50 AND k.id = :kterId " + "AND o.date = CAST(:selectedDate AS timestamp without time zone) AND o.stts = :stts";
            List<Integer> result = db.Query(con, sql, Integer.class, params);

            if (result.size() == 0)
            {
                throw new Exception("Не удалось совершить проверку всех заявок в рамках текущего года");
            }

            return result.get(0);
        } catch (Exception ex)
        {
            throw ex;
        }
    }

    /**
     * Расчитать износ
     *
     * @param model
     * @return
     * @throws Exception
     */
    @Override
    public Integer Calc(JrWearCalcSaveModel model) throws Exception
    {
        try (Connection con = db.getConnectionWithTran(appName))
        {
            Map<String, Object> params = new HashMap<>();
            params.put("date", model.getDate());
            params.put("kterId", model.getKterId());
            params.put("stts", model.getStts());
            params.put("year", model.getYear());
            String sql = "SELECT wear_calc(:date::date, :stts, :year, :kterId)";

            List<Integer> result = db.Query(con, sql, Integer.class, params);

            con.commit();
            return result.get(0);
        } catch (Exception ex)
        {
            throw ex;
        }
    }

    /**
     * Получить пользователя
     *
     * @return
     * @throws Exception
     */
    @Override
    public UserModel getUser() throws Exception
    {
        try (Connection con = db.getConnection(appName))
        {
            String sql = "SELECT u.id userid, u.code usercode, u.name username, u.deleted del, u.depid, ug.groupid, g.code groupcode, d.code depcode, d.name depname " + "FROM users u JOIN usergroups ug ON u.id = ug.userid JOIN groups g ON ug.groupid = g.id JOIN deps d ON u.depid = d.id WHERE u.code = getusername()" + " AND EXISTS (SELECT 1 FROM get_user_deps('jrWearCalc', 'jrWearCalcView') AS dep WHERE d.kterid = dep.kterid)";

            List<UserModel> result = db.Query(con, sql, UserModel.class, null);

            if (result.size() == 0)
            {
                throw new Exception("Не удалось получить пользователя с Code = ");
            }

            return result.get(0);
        } catch (Exception ex)
        {
            throw ex;
        }
    }

    /**
     * Получить последнюю запись по которой производился расчёт
     *
     * @return
     * @throws Exception
     */
    @Override
    public Integer getLastAddedRec(String date, Integer stts) throws Exception
    {
        try (Connection con = db.getConnection(appName))
        {
            Map<String, Object> params = new HashMap<>();
            params.put("date", date);
            params.put("stts", stts);
            String sql = "SELECT o.id FROM orders o WHERE o.ordertypeid = 50 AND o.date = :date::date AND o.stts = :stts AND o.parentid IS NULL";

            List<Integer> result = db.Query(con, sql, Integer.class, params);

            if (result.size() == 0)
            {
                throw new Exception("Не удалось получить Id последней добавленной записи");
            }

            return result.get(0);
        } catch (Exception ex)
        {
            throw ex;
        }
    }

    @Override
    public String getActRight() throws Exception
    {
        try (Connection con = db.getConnection(appName))
        {
            String sql = "SELECT getactrights('jrWearCalc', 'jrWearCalcRun')";
            List<String> result = db.Query(con, sql, String.class, null);
            return result.get(0);
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }
}
