package org.kaznalnrprograms.Accounting.LockTable.Dao;
import org.kaznalnrprograms.Accounting.LockTable.Interfaces.ILockTableDao;
import org.kaznalnrprograms.Accounting.LockTable.Models.LockDateModel;
import org.kaznalnrprograms.Accounting.LockTable.Models.LockTableModel;
import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.*;

@Repository


    public class LockTableDaoImpl implements ILockTableDao {
    private String appName = "LockTable - Справочник заблокированых записей";
    private DBUtils db;

    public LockTableDaoImpl(DBUtils db) {this.db = db;}

    /**
     * Функция вывода списка заблокированых записей
     * @param Filter
     * @return
     * @throws Exception
     */
    @Override
    public List<LockTableModel> list(String Filter) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            String sql = "select lt.Id, GetObject_Name(cast(ObjectId as int)) as tablename," +
                    "  recid, to_char( DATE_TRUNC('second', Date), 'DD.MM.YYYY HH24:MI:SS') as date," +
                    " u.Name as username, ko.Name as kokname  ,to_char( DATE_TRUNC('second'," +
                    " current_timestamp - Date), 'HH24:MI:SS') as minutes " +
                    "  from LockTable lt  " +
                    "  join users u on lt.UserId = u.id" +
                    "  join Deps d on d.Id=u.DepId" +
                    "  join Kter kt on d.KterId = kt.id " +
                    "  join KOK ko on kt.KokId = ko.id " +
                    "  Where 1=1";
            if(!Filter.isEmpty()){
                sql +=" AND (u.Name iLIKE '%' || :Filter || '%' OR GetObject_Name(cast(ObjectId as int)) iLIKE '%' || :Filter || '%'  )";
                params.put("Filter", Filter);
            }
            sql+=" order by u.Name";
            return db.Query(con, sql, LockTableModel.class, params);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получение даты блокировки
     * @param id
     * @return
     * @throws Exception
     */
    @Override
    public LockDateModel getDate(String id) throws  Exception{
        Map<String, Object> params = new Hashtable<>();
        params.put("id", UUID.fromString(id));
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT to_char( DATE_TRUNC('second', current_timestamp - Date), 'MI') as min," +
                    " to_char( DATE_TRUNC('second', current_timestamp - Date), 'HH24') as hour," +
                    " to_char( DATE_TRUNC('second', current_timestamp - Date), 'SS') as seconds " +
                    "FROM LockTable where id = :id";
            List<LockDateModel> result = db.Query(con, sql, LockDateModel.class, params);
            if(result.size() == 0){
                throw new Exception("Не удалось получить дату блокировки!\nВозможно запись уже разблокирована.");
            }
            return result.get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }
    /**
     * разблокировка
     * @param id
     * @throws Exception
     */
    @Override
    public void unlock(String id) throws Exception{
            try(Connection con = db.getConnection(appName)) {
                Map<String, Object> params = new Hashtable<>();
                params.put("id", UUID.fromString(id));
                String sql = "DELETE FROM LockTable WHERE id =  :id  ";
                db.Execute(con, sql,  params);
            }
            catch(Exception ex){
                throw ex;
            }
        }
}
