package org.kaznalnrprograms.Accounting.RefferParams.Dao;

import org.kaznalnrprograms.Accounting.RefferParams.Interfaces.IRefferParamsDao;
import org.kaznalnrprograms.Accounting.RefferParams.Models.RefferParamsModel;
import org.kaznalnrprograms.Accounting.RefferParams.Models.RefferParamsViewModel;
import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class RefferParamsDaoImpl implements IRefferParamsDao
{
    private String appName = "RefferParams - справочник реквизитов";
    private DBUtils db;

    public RefferParamsDaoImpl(DBUtils db)
    {
        this.db = db;
    }

    /**
     * Получить список реквизитов
     * @param ShowDel
     * @return
     * @throws Exception
     */
    @Override
    public List<RefferParamsViewModel> list(boolean ShowDel) throws Exception
    {
        try(Connection con = db.getConnection(appName))
        {
            Map<String, Object> params = new HashMap<>();
            String sql = "SELECT id, paramcode, name, codelen, iscodedigit, del" +
                    " FROM refferparams" +
                    " WHERE 1=1";

            if(!ShowDel)
                sql += " AND del = 0";

            sql += " ORDER BY id";
            return db.Query(con, sql, RefferParamsViewModel.class, params);
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    /**
     * Удаление реквизита
     * @param id - идентификатор реквизита
     * @throws Exception
     */
    @Override
    public void delete(int id) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "UPDATE RefferParams SET Del = 1 - Del WHERE Id = " + id;
            db.Execute(con, sql, null);
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Проверить существование справочника
     * @param id - идентификатор справочника (для новых -1)
     * @param paramcode - код справочника
     * @return
     * @throws Exception
     */
    @Override
    public boolean exists(int id, String paramcode) throws Exception{
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            params.put("paramcode", paramcode);
            String sql = "SELECT COUNT(*) FROM RefferParams WHERE paramcode = :paramcode AND id <> " + id;
            return db.Query(con, sql, Integer.class, params).get(0) > 0;
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Добавить/ Изменить запись
     * @param refferparams - модель сохраняемой записи
     * @return
     * @throws Exception
     */
    @Override
    public int save(RefferParamsModel refferparams) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "";
            Map<String, Object> params = new HashMap<>();
            params.put("paramcode", refferparams.getParamcode());
            params.put("name", refferparams.getName());
            //params.put("codelen", Integer.valueOf(refferparams.getCodelen()));

            if(refferparams.getId() == -1){
                sql = "INSERT INTO RefferParams (paramcode, name, codelen, iscodedigit, del)"
                        + " VALUES(:paramcode, :name, " +  refferparams.getCodelen() + ", " +  refferparams.getIscodedigit() + ", 0)";
                refferparams.setId(db.Execute(con, sql, Integer.class, params));
            }
            else {
                db.CheckLock(con, refferparams.getId(), "refferparams");
                sql = "UPDATE RefferParams SET paramcode = :paramcode, name = :name, codelen = " + refferparams.getCodelen() + ", iscodedigit = " + refferparams.getIscodedigit() + " WHERE id = " + refferparams.getId();
                db.Execute(con, sql, params);
            }
            return refferparams.getId();
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Получить запись для просмтора/редактирования
     * @param id
     * @return
     * @throws Exception
     */
    @Override
    public RefferParamsModel get(int id) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT id, paramcode, name, codelen, iscodedigit, creator, created, changer, changed " +
                         "FROM refferparams " +
                         "WHERE id = " + id;
            List<RefferParamsModel> result = db.Query(con, sql, RefferParamsModel.class, null);
            if(result.size() == 0){
                throw new Exception("Не удалось получить реквизит с Id = " + id);
            }
            return result.get(0);
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

}
