package org.kaznalnrprograms.Accounting.Utils;

import org.springframework.stereotype.Component;
import org.sql2o.Connection;
import org.sql2o.Query;
import org.sql2o.Sql2o;
import org.sql2o.data.Table;

import javax.servlet.http.HttpServletRequest;
import javax.sql.DataSource;
import java.security.Principal;
import java.sql.Timestamp;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class DBUtils {
    private DataSource source;
    private HttpServletRequest req;
    private String appName;

    public DBUtils(DataSource source, HttpServletRequest req)
    {
        this.source = source;
        this.req = req;
    }
    public String getUserCode() {
        Principal pr = req.getUserPrincipal();
        return pr==null?"postgres":pr.getName();
    }
    /**
     * Получить и привязяать соединение к пользователю без транзакции
     * @param appName - код приложения
     */
    public Connection getConnection(String appName) throws Exception {
        this.appName = appName;
        Sql2o sql2o = new Sql2o(source);
        Connection con = sql2o.open();
        String userCode = getUserCode();
        try {
            BindConnectionToUser(con, userCode);
        }
        catch (Exception ex) {
            con.close();
            throw ex;
        }
        return con;
    }
    /**
     * Получить и привязяать соединение к пользователю с транзакции
     * @param appName - код приложения
     */
    public Connection getConnectionWithTran(String appName) throws Exception {
        this.appName = appName;
        Sql2o sql2o = new Sql2o(source);
        Connection con = sql2o.beginTransaction();
        String userCode = getUserCode();
        try {
            BindConnectionToUser(con, userCode);
        }
        catch (Exception ex) {
            con.close();
            throw ex;
        }
        return con;
    }
    /**
     * Присоеденить соединение к пользователю
     * @param con - соединение с базой данных
     * @param userCode - логин пользователя
     */
    private void BindConnectionToUser(Connection con, String userCode) throws Exception {
        String sql = "DELETE FROM UserConnections WHERE pid = pg_backend_pid()";
        con.createQuery(sql).executeUpdate();
        sql = "SELECT Id FROM Users WHERE Deleted=0 AND Code = :Code";
        List<Integer> Ids = con.createQuery(sql).addParameter("Code", userCode).executeAndFetch(Integer.class);
        if(Ids.size()==0) {
            throw new Exception("В базе данных не найден пользователь с логином "+userCode);
        }
        sql = "INSERT INTO UserConnections (Id, UserId, pId, Login_Time) VALUES(uuid_generate_v4(),"+Ids.get(0)+", pg_backend_pid(), (SELECT backend_start FROM pg_stat_activity WHERE pid = pg_backend_pid()))";
        con.createQuery(sql).executeUpdate();
    }

    /**
     * Добавить запись в протокол работы программы
     * @param sql - код запроса к базеданных
     * @param result - результат выполнения запрос (если нет ошибок то будет пустое поле)
     * @param appName - имя приложения
     * @param elapsed - время выполнения запроса
     * @param params - параметры запроса
     */
    private void AddRequestToLog(String sql, String result, String appName, String elapsed, Map<String, Object> params) {
        Sql2o sql2o = new Sql2o(source);
        try(Connection con = sql2o.open()){
            String userCode = getUserCode();
            appName = "java - "+appName;
            StringBuffer params_str = new StringBuffer();
            if(params!=null){
                for (String key : params.keySet()) {
                    Object value = params.get(key);
                    params_str.append(key);
                    params_str.append(" = ");
                    params_str.append(value.toString());
                    params_str.append(";;;");
                }
            }
            String sql_log = "INSERT INTO TransLog(Date, UserName, sql, result, AppName, Time, Params) VALUES(:Date, :UserName, :sql, :result, :AppName, :time, :Params)";
            con.createQuery(sql_log)
                    .addParameter("Date", new Timestamp(new Date().getTime()))
                    .addParameter("UserName", userCode)
                    .addParameter("sql", sql)
                    .addParameter("result", result)
                    .addParameter("AppName", appName)
                    .addParameter("time", elapsed)
                    .addParameter("Params", params_str.toString())
                    .executeUpdate();
        }
        catch(Exception ex){

        }
    }

    /**
     * Перевод времени в читаемое
     * @param time - время в милисекундах
     */
    private String MillisecondsToReadableTime(long time) {
        long miliseconds = time % 1000L;
        long tempSeconds = (time / 1000);
        long seconds = tempSeconds % 60;
        long minutes = (tempSeconds/60) % 60;
        long hours = (tempSeconds/(60*60)) % 24;
        StringBuffer elapsed_str = new StringBuffer();
        if(hours<10) {
            elapsed_str.append("0"+hours);
        }
        else {
            elapsed_str.append(hours);
        }
        elapsed_str.append(":");
        if(minutes<10){
            elapsed_str.append("0"+minutes);
        }
        else{
            elapsed_str.append(minutes);
        }
        elapsed_str.append(":");
        if(seconds<10) {
            elapsed_str.append("0"+seconds);
        }
        else {
            elapsed_str.append(seconds);
        }
        elapsed_str.append(":");
        if(miliseconds<10){
            elapsed_str.append("00"+miliseconds);
        }
        else if(miliseconds>=10&&miliseconds<100) {
            elapsed_str.append("0"+miliseconds);
        }
        else {
            elapsed_str.append(miliseconds);
        }
        return elapsed_str.toString();
    }
    /**
     * Выполнить запрос и получить результат
     * @param con - соединение с базой данных
     * @param sql - запрос к базе данных
     * @param fethObj - объект для маппинга
     * @param params - параметры запроса
     */
    public <T> List<T> Query(Connection con, String sql, Class<T> fethObj, Map<String, Object> params) {
        long startTime = System.currentTimeMillis();
        String result = "";
        try {
            Query query = con.createQuery(sql);
            if (params != null) {
                for (String key : params.keySet()) {
                    Object value = params.get(key);
                    query.addParameter(key, value);
                }
            }
            return query.executeAndFetch(fethObj);
        }
        catch(Exception ex) {
            result = ex.getMessage();
            throw ex;
        }
        finally {
            long elapsed = (System.currentTimeMillis()-startTime);
            String elapsed_str = MillisecondsToReadableTime(elapsed);
            AddRequestToLog(sql, result, appName, elapsed_str, params);
        }
    }

    /**
     * Выполнить запрос и получить результат в виде таблицы
     * @param con соединение с базой данных
     * @param sql запрос
     * @param params параметры
     * @return
     */
    public Table Query(Connection con, String sql, Map<String, Object> params){
        long startTime = System.currentTimeMillis();
        String result = "";
        try {
            Query query = con.createQuery(sql);
            if (params != null) {
                for (String key : params.keySet()) {
                    Object value = params.get(key);
                    query.addParameter(key, value);
                }
            }
            return query.executeAndFetchTable();
        }
        catch(Exception ex){
            result = ex.getMessage();
            throw ex;
        }
        finally {
            long elapsed = (System.currentTimeMillis()-startTime);
            String elapsed_str = MillisecondsToReadableTime(elapsed);
            AddRequestToLog(sql, result, appName, elapsed_str, params);
        }
    }
    /**
     * Выполнить запрос к базе данных, кторый ничего не возвращает
     * @param con - соединение с базой данных
     * @param sql - запрос к базе данных
     * @param params - параметры заапроса
     */
    public void Execute(Connection con, String sql, Map<String, Object> params) {
        long startTime = System.currentTimeMillis();
        String result = "";
        try {
            Query query = con.createQuery(sql);
            if (params != null) {
                for (String key : params.keySet()) {
                    Object value = params.get(key);
                    query.addParameter(key, value);
                }
            }
            query.executeUpdate();
        }
        catch(Exception ex){
            result = ex.getMessage();
            throw ex;
        }
        finally {
            long elapsed = (System.currentTimeMillis()-startTime);
            String elapsed_str = MillisecondsToReadableTime(elapsed);
            AddRequestToLog(sql, result, appName, elapsed_str, params);
        }
    }
    /**
     * Выполнить запрос к базе данных, кторый ничего не возвращает (с возвратом вставленного ID)
     * @param con - соединение с базой данных
     * @param sql - запрос к базе данных
     * @param fethObj - класс типа, в котором необходимо вернуть результат
     * @param params - параметры заапроса
     */
    public <T> T Execute(Connection con, String sql, Class<T> fethObj, Map<String, Object> params) {
        long startTime = System.currentTimeMillis();
        String result = "";
        try {
            Query query = con.createQuery(sql);
            if (params != null) {
                for (String key : params.keySet()) {
                    Object value = params.get(key);
                    query.addParameter(key, value);
                }
            }
            return query.executeUpdate().getKey(fethObj);
        }
        catch(Exception ex){
            result = ex.getMessage();
            throw ex;
        }
        finally {
            long elapsed = (System.currentTimeMillis()-startTime);
            String elapsed_str = MillisecondsToReadableTime(elapsed);
            AddRequestToLog(sql, result, appName, elapsed_str, params);
        }
    }

    /**
     * ПРоверка блокировки
     * @param con - соединение с базой данных
     * @param id - идентификатор записи
     * @param tableName - имя таблицы
     */
    public void CheckLock(Connection con, int id, String tableName) throws Exception {
        String sql = "SELECT COUNT(*) as cnt FROM LockTable lt " +
        " JOIN Users u ON u.Id = lt.UserId" +
        " WHERE lt.ObjectId = GetObject_Id(:tableName) AND lt.RecId = " + id + " AND u.Code = :userCode";
        Map<String, Object> params = new HashMap<>();
        params.put("tableName", tableName);
        params.put("userCode", getUserCode());
        int count = Query(con, sql, Integer.class, params).get(0);
        if(count == 0){
            throw new Exception("Перед сохранением записи её необходимо заблокировать.");
        }
    }
}
