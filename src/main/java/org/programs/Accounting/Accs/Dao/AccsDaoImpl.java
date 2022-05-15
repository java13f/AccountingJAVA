package org.kaznalnrprograms.Accounting.Accs.Dao;

import org.kaznalnrprograms.Accounting.Accs.Interfaces.IAccs;
import org.kaznalnrprograms.Accounting.Accs.Models.*;
import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class AccsDaoImpl implements IAccs
{
    String appName = "Accs - справочник счетов";
    private DBUtils db;

    public AccsDaoImpl (DBUtils db)
    {
        this.db = db;
    }

    @Override
    public List<AccsViewModel> getAccsList(boolean del) throws Exception
    {
        try(Connection con = db.getConnection(appName))
        {
            String sql = "SELECT id, code, name, tag, del FROM Accs WHERE 1=1 ";

            if (!del)
            {
                sql += " AND del = 0";
            }

            sql += " ORDER BY code";
            return db.Query(con, sql, AccsViewModel.class, null);
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public AccsModel getAcc(int id) throws Exception
    {
        try(Connection con = db.getConnection(appName))
        {
            String sql = "SELECT id, code, name, tag, del, creator, created, changer, changed FROM Accs WHERE id = " + id;

            List<AccsModel> result = db.Query(con, sql, AccsModel.class, null);
            if(result.size() == 0){
                throw new Exception("Не удалось получить территорию с Id = " + id);
            }

            return result.get(0);
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    /**
     * Добавить/ Изменить запись счета
     * @param model - модель счета
     * @return
     * @throws Exception
     */
    @Override
    public int save(AccsModel model) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "";
            Map<String, Object> params = new HashMap<>();
            params.put("code", model.getCode());
            params.put("name", model.getName());
            params.put("tag", model.getTag());
            if(model.getId() == -1){
                sql = "INSERT INTO accs (code, name, tag, del)"
                        +" VALUES(:code, :name, :tag , 0)";
                model.setId(db.Execute(con, sql, Integer.class, params));
            }
            else {
                db.CheckLock(con, model.getId(), "accs");
                sql = "UPDATE accs SET code = :code, name = :name, tag = :tag WHERE id = " + model.getId();
                db.Execute(con, sql, params);
            }
            return model.getId();
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Удалить счет
     * @param id - объекта удаления
     * @return
     * @throws Exception
     */
    @Override
    public void delete(int id) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "UPDATE accs SET del = 1 - del WHERE id = " + id;
            db.Execute(con, sql, null);
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Проверить существование счета
     * @param id - идентификатор счета (для новых -1)
     * @param code - код счета
     * @return
     * @throws Exception
     */
    @Override
    public boolean exists(int id, String code) throws Exception{
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            params.put("code", code);
            String sql = "SELECT COUNT(*) FROM accs WHERE code = :code AND id <> " + id;
            return db.Query(con, sql, Integer.class, params).get(0) > 0;
        }
        catch(Exception ex){
            throw ex;
        }
    }
}
