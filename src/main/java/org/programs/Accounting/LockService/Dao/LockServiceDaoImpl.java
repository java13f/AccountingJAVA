package org.kaznalnrprograms.Accounting.LockService.Dao;

import org.kaznalnrprograms.Accounting.LockService.Interfaces.ILockServiceDao;
import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.Hashtable;
import java.util.List;
import java.util.Map;

@Repository
public class LockServiceDaoImpl implements ILockServiceDao {
    private String appName = "LockService - сервис блокировки";
    private DBUtils db;
    public LockServiceDaoImpl(DBUtils db){
        this.db = db;
    }

    /**
     * Проверить сосояние блокировки записи
     * @param table - имя таблицы базы данных
     * @param recId - идентификатор записи
     * @return - если запись заблокирована возвращает сообщение о том, что запись заблокирована, а иначе возвращает пустую строку
     */
    @Override
    public String StateLockRecord(String table, Integer recId) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT u.Name FROM LockTable lt"
                    +" JOIN Users u ON u.Id = lt.UserId"
                    +" WHERE lt.recId = " + recId + " AND lt.ObjectId = GetObject_Id(:table)";
            Map<String, Object> params = new Hashtable<>();
            params.put("table", table);
            List<String> result = db.Query(con, sql, String.class, params);
            if(result.size() > 0) {
                String userName = result.get(0);
                return "Запись редактируется пользователем " + userName;
            }
            return "";
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Накладывает блокировку на запись
     * @param table - имя таблицы базы данных
     * @param recId - идентификатор записи
     * @return - если запись заблокирована возвращает сообщение о том, что запись заблокирована, а иначе возвращает пустую строку
     */
    @Override
    public String LockRecord(String table, Integer recId) throws Exception {
        String state = StateLockRecord(table, recId);
        if(!state.isEmpty()){
            return state;
        }
        try(Connection con = db.getConnection(appName)){
            String userCode = db.getUserCode();
            String sql = "INSERT INTO LockTable (Id, ObjectId, RecId, Date, UserId) VALUES(uuid_generate_v4(), GetObject_Id(:table), " + recId
                    +", current_timestamp, (SELECT Id FROM Users WHERE Code = :userCode))";
            Map<String, Object> params = new Hashtable<>();
            params.put("userCode", userCode);
            params.put("table", table);
            db.Execute(con, sql, params);
            return "";
        }
        catch(Exception ex){
            throw ex;
        }
    }
    /**
     * Обновляет блокировку на записи
     * @param table - имя таблицы базы данных
     * @param recId - идентификатор записи
     */
    @Override
    public void UpdateLock(String table, Integer recId) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new Hashtable<>();
            String userCode = db.getUserCode();
            params.put("userCode", userCode);
            String sql = "SELECT Id FROM Users WHERE Code = :userCode";
            int UserId = db.Query(con, sql, Integer.class, params).get(0);
            sql = "UPDATE LockTable SET Date = current_timestamp WHERE ObjectId = GetObject_Id(:table)"
            +" AND RecId = " + recId + " AND UserId = " + UserId;
            params.clear();
            params.put("table", table);
            db.Execute(con, sql, params);
        }
        catch(Exception ex){
            throw ex;
        }
    }
    /**
     * Удаляет блокировку
     * @param table - имя таблицы базы данных
     * @param recId - идентификатор записи
     */
    @Override
    public void FreeLockRecord(String table, Integer recId) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new Hashtable<>();
            String userCode = db.getUserCode();
            params.put("userCode", userCode);
            String sql = "SELECT Id FROM Users WHERE Code = :userCode";
            int UserId = db.Query(con, sql, Integer.class, params).get(0);
            sql = "DELETE FROM LockTable WHERE ObjectId = GetObject_Id(:table)"
                    +" AND RecId = " + recId + " AND UserId = " + UserId;
            params.clear();
            params.put("table", table);
            db.Execute(con, sql, params);
        }
        catch(Exception ex){
            throw ex;
        }
    }
}
