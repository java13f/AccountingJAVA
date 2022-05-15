package org.kaznalnrprograms.Accounting.LogMain.Dao;

import org.kaznalnrprograms.Accounting.Kter.Models.UserModel;
import org.kaznalnrprograms.Accounting.LogMain.Interfaces.ILogMainDao;
import org.kaznalnrprograms.Accounting.LogMain.Models.FilterModel;
import org.kaznalnrprograms.Accounting.LogMain.Models.LogMainModel;
import org.kaznalnrprograms.Accounting.LogMain.Models.LogMainViewModel;
import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class LogMainDaoImpl implements ILogMainDao {

    private String appName = "LogMain - протокол работы программы";
    private DBUtils db;

    public LogMainDaoImpl(DBUtils db){
        this.db = db;
    }

    /**
     * Получение данных из таблицы TransLog.
     * @param filter - модель mFilter
     * @return
     * @throws Exception
     */
    @Override
    public List<LogMainViewModel> list(FilterModel filter) throws Exception {

        try (Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();

            int offset = (filter.getPage() -1 ) * filter.getRows();

            String sql="select id, CAST(date as character varying) as date, username, sql, " +
                    "result, appname, CAST(time as character varying) as time, params, " +
                    "CASE " +
                    "    WHEN LENGTH(COALESCE(Result,''))>2  THEN '4' " +
                    "    WHEN POSITION('INSERT ' IN Upper(Ltrim(SQL)))=1 or POSITION('UPDATE ' IN Upper(SQL))=1 THEN 1 " +
                    "WHEN POSITION('DELETE ' IN Upper(Ltrim(SQL)))=1 THEN 2 " +
                    "WHEN POSITION('EXEC '   IN Upper(Ltrim(SQL)))=1 THEN 3 " +
                    "ELSE 0 " +
                    "END Color " +
                    "from translog " +
                    "where date >= to_date(:date, 'YYYYMMDD') " +
                    "and date < to_date(:date, 'YYYYMMDD') + interval '1 day' ";

            params.put("date", filter.getDateQuery()); //:date = '20200421'


            if (filter.getOnlyError()){
                sql += " and LENGTH(COALESCE(Result,'')) >= 2 ";
            }

            if ( !filter.getUser().isEmpty() ){
                //Дописать запрос с учетом пользователя
                sql += " and UserName = :user ";
                params.put("user", filter.getUser());
            }

            if (!filter.getAppName().isEmpty()) {
                sql += " and Upper(AppName) = Upper(:app) ";
                params.put("app", filter.getAppName().trim());
            }

            if (!filter.getPttrn().isEmpty()){
                sql += " and (sql ilike :pttrn or Params ilike :pttrn) ";
                String pttrn = "%"+filter.getPttrn().trim()+"%";
                params.put("pttrn", pttrn);
            }

            if (filter.getExceptSystem()){
                sql += " and AppName not in ('.NET - System', '.NET - SignServer', '.NET - ReportHRT', '.NET - Протокол работы программы.') ";
            }

            sql += " Order By Id desc ";

            sql+=" OFFSET "+offset;
            sql+=" LIMIT "+filter.getRows();

            return db.Query(con, sql, LogMainViewModel.class, params);
        }
        catch (Exception ex){
            throw ex;
        }
    }


    /**
     * Получить список пользователей из таблицы Translog
     * @param date - дата запроса
     * @return
     * @throws Exception
     */
    @Override
    public List<UserModel> getUsers(String date) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();

            String sql = "SELECT distinct username as name " +
                    "FROM translog " +
                    "WHERE date >= to_date(:date, 'YYYYMMDD') " +
                    "and date < to_date(:date,'YYYYMMDD') + interval '1 day' " +
                    "ORDER BY username";

            params.put("date", date);
            return db.Query(con, sql, UserModel.class, params);
        }
        catch(Exception ex){
            throw ex;
        }
    }


    /**
     * Получить имя пользователя под которым вошли в систему
     * @return
     * @throws Exception
     */
    @Override
    public String getActiveUser() throws Exception {
        try(Connection con = db.getConnection(appName)) {
            return db.getUserCode();
        }
        catch (Exception ex){
            throw ex;
        }
    }


    /**
     * Получить количество записей в таблице translog
     * @param filter
     * @return
     * @throws Exception
     */
    @Override
    public int getTotalLogs(FilterModel filter) throws Exception {
        try(Connection con = db.getConnection(appName)){

            Map<String, Object> params = new HashMap<>();

            String sql="select count(*) " +
                    "from translog " +
                    "where date >= to_date(:date, 'YYYYMMDD') " +
                    "and date < to_date(:date, 'YYYYMMDD') + interval '1 day' ";

            params.put("date", filter.getDateQuery()); //:date = '20200421'


            if (filter.getOnlyError()){
                sql += " and LENGTH(COALESCE(Result,'')) >= 2 ";
            }

            if ( !filter.getUser().isEmpty() ){
                //Дописать запрос с учетом пользователя
                sql += " and UserName = :user ";
                params.put("user", filter.getUser());
            }

            if (!filter.getAppName().isEmpty()) {
                sql += " and Upper(AppName) = Upper(:app) ";
                params.put("app", filter.getAppName().trim());
            }

            if (!filter.getPttrn().isEmpty()){
                sql += " and (sql ilike :pttrn or Params ilike :pttrn) ";
                String pttrn = "%"+filter.getPttrn().trim()+"%";
                params.put("pttrn", pttrn);
            }

            if (filter.getExceptSystem()){
                sql += " and AppName not in ('.NET - System', '.NET - SignServer', '.NET - ReportHRT', '.NET - Протокол работы программы.') ";
            }

            return db.Query(con, sql, Integer.class, params).get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Функция получения лога для просмотра
     * @param id - идентификатор таблицы Translog
     * @return
     * @throws Exception
     */
    @Override
    public LogMainModel get(int id) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT id, CAST(date as character varying) as date, username, sql, " +
            " result, appname, CAST(time as character varying) as time, params " +
            " FROM translog WHERE id = " + id;

            List<LogMainModel> result = db.Query(con, sql, LogMainModel.class, null);
            if(result.size() == 0){
                throw new Exception("Не удалось получить лог с Id = " + id);
            }
            return result.get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }


}
