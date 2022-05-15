package org.kaznalnrprograms.Accounting.Today.Dao;

import org.kaznalnrprograms.Accounting.Today.Interfaces.ITodayUsers;
import org.kaznalnrprograms.Accounting.Today.Models.TodayUsers;
import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class TodayUsersDaoImpl implements ITodayUsers
{
    private String appName = "Today - Точка актуальности";
    private DBUtils db;

    public TodayUsersDaoImpl(DBUtils db)
    {
        this.db = db;
    }

    /**
     * Получить список пользователей дня
     * @param todayid
     * @return
     * @throws Exception
     */
    public List<TodayUsers> getTodayUsersList(int todayid) throws Exception
    {
        try(Connection con = db.getConnection(appName))
        {
            String sql = "SELECT tu.id, tu.todayid, u.name username, tu.del, tu.created, tu.creator, tu.changer, tu.changed" +
                    " FROM TodayUsers tu JOIN Today t ON tu.todayid = t.id JOIN Users u ON tu.userid = u.id" +
                    " WHERE tu.todayid = " + todayid;
            return db.Query(con, sql, TodayUsers.class, null);
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    /**
     * Удалить пользователя (не физически)
     * @param id
     * @throws Exception
     */
    @Override
    public void deleteTodayUsers(int id) throws Exception
    {
        try(Connection con = db.getConnection(appName))
        {
            String sql = "UPDATE TodayUsers SET del = 1 - del WHERE id = " + id;
            db.Execute(con, sql, null);
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    /**
     * Добавить пользователя
     * @param todayusers
     * @return
     * @throws Exception
     */
    @Override
    public int saveTodayUsers(TodayUsers todayusers) throws Exception
    {
        try(Connection con = db.getConnection(appName))
        {
            String sql = "";
            Map<String, Object> params = new HashMap<>();
            params.put("todayid", todayusers.getTodayid());
            params.put("userid", todayusers.getUserid());

            sql = "INSERT INTO TodayUsers (todayid, userid, del)" + " VALUES(:todayid, :userid, 0)";
            todayusers.setId(db.Execute(con, sql, Integer.class, params));

            return todayusers.getId();
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    /**
     * Перед добавлением проверить не существует ли такого пользователя уже в базе
     * @param todayid
     * @param userid
     * @return
     * @throws Exception
     */
    @Override
    public boolean existsUserInDay(int todayid, int userid) throws Exception
    {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            params.put("todayid", todayid);
            params.put("userid", userid);
            String sql = "select COUNT(*) FROM TodayUsers WHERE todayid = :todayid AND userid = :userid";
            return db.Query(con, sql, Integer.class, params).get(0) > 0;
        }
        catch(Exception ex){
            throw ex;
        }
    }

}
