package org.kaznalnrprograms.Accounting.KEKR.Dao;

import org.kaznalnrprograms.Accounting.KEKR.Models.KEKRModel;
import org.kaznalnrprograms.Accounting.KEKR.Models.KEKRViewModel;
import org.kaznalnrprograms.Accounting.KEKR.Interfaces.IKEKR;
import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class KEKRDaoImpl implements IKEKR
{
    String appName = "KEKR - справочник \"Коды экономической классификации расходов\"";
    private DBUtils db;

    public KEKRDaoImpl(DBUtils db)
    {
        this.db = db;
    }

    @Override
    public List<KEKRViewModel> getKEKRList(boolean del) throws Exception
    {
        try(Connection con = db.getConnection(appName))
        {
            String sql = "SELECT id, code, name, del FROM KEKR WHERE 1=1 ";

            if (!del)
            {
                sql += " AND del = 0";
            }

            sql += " ORDER BY code ASC";
            return db.Query(con, sql, KEKRViewModel.class, null);
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public KEKRModel getRec(int id) throws Exception
    {
        try(Connection con = db.getConnection(appName))
        {
            String sql = "SELECT id, code, name, del, creator, created, changer, changed FROM KEKR WHERE id = " + id;

            List<KEKRModel> result = db.Query(con, sql, KEKRModel.class, null);
            if(result.size() == 0){
                throw new Exception("Не удалось получить запись с Id = " + id);
            }

            return result.get(0);
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    /**
     * Добавить/ Изменить запись
     * @param model - модель счета
     * @return
     * @throws Exception
     */
    @Override
    public int save(KEKRModel model) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "";
            Map<String, Object> params = new HashMap<>();
            params.put("code", model.getCode());
            params.put("name", model.getName());
            if(model.getId() == -1){
                sql = "INSERT INTO KEKR (code, name, del)"
                        +" VALUES(:code, :name, 0)";
                model.setId(db.Execute(con, sql, Integer.class, params));
            }
            else {
                db.CheckLock(con, model.getId(), "KEKR");
                sql = "UPDATE KEKR SET code = :code, name = :name WHERE id = " + model.getId();
                db.Execute(con, sql, params);
            }
            return model.getId();
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Удалить запись
     * @param id - объекта удаления
     * @return
     * @throws Exception
     */
    @Override
    public void delete(int id) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "UPDATE KEKR SET del = 1 - del WHERE id = " + id;
            db.Execute(con, sql, null);
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Проверить существование записи
     * @param id - идентификатор записи (для новых -1)
     * @param code - код счета
     * @return
     * @throws Exception
     */
    @Override
    public boolean exists(int id, String code) throws Exception{
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            params.put("code", code);
            String sql = "SELECT COUNT(*) FROM KEKR WHERE code = :code AND id <> " + id;
            return db.Query(con, sql, Integer.class, params).get(0) > 0;
        }
        catch(Exception ex){
            throw ex;
        }
    }
}
