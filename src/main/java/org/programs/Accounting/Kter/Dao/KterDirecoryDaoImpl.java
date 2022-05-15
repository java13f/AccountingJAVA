package org.kaznalnrprograms.Accounting.Kter.Dao;

import org.kaznalnrprograms.Accounting.Kter.Interfaces.IKterDirectoryDao;
import org.kaznalnrprograms.Accounting.Kter.Models.KokModel;
import org.kaznalnrprograms.Accounting.Kter.Models.KterModel;
import org.kaznalnrprograms.Accounting.Kter.Models.KterViewModel;
import org.kaznalnrprograms.Accounting.Kter.Models.UserModel;
import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class KterDirecoryDaoImpl implements IKterDirectoryDao {
    private String appName = "Kter - справочник кодов территорий";
    private DBUtils db;

    public KterDirecoryDaoImpl(DBUtils db){
        this.db = db;
    }
    /**
     * Получить список территорий
     * @param filter - фильтр по коду территорий
     * @param showDel - флаг отображения удалённых записей
     * @return
     * @throws Exception
     */
    @Override
    public List<KterViewModel> list(String filter, boolean showDel) throws Exception{
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            String sql = "SELECT kt.id, kt.code, kt.name, ko.name as kokName, kt.addr, kt.del FROM Kter kt" +
                    " JOIN KOK ko ON ko.Id = kt.KokId"+
                    " join getTerRight() tr on tr.id=kt.id "+
                    " WHERE 1=1";
            if(!showDel){
                sql+=" AND kt.Del = 0";
            }
            if(!filter.isEmpty()){
                sql +=" AND (kt.code ILIKE '%'||:filter||'%' OR kt.name ILIKE '%'||:filter||'%')";
                params.put("filter", filter);
            }
            sql+=" ORDER BY kt.Code";
            return db.Query(con, sql, KterViewModel.class, params);
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Функция получения территории для просмотра/изменения территории
     * @param id - идентификатор территории
     * @return
     * @throws Exception
     */
    @Override
    public KterModel get(int id) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT id, code, name, kokId, addr, COALESCE(answerUserId, -1) AS UserId, " +
                    "creator, created, changer, changed FROM Kter WHERE id = " + id;
            List<KterModel> result = db.Query(con, sql, KterModel.class, null);
            if(result.size() == 0){
                throw new Exception("Не удалось получить территорию с Id = " + id);
            }
            return result.get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Проверить существование территории
     * @param id - идентификатор территории (для новых -1)
     * @param code - код территории
     * @return
     * @throws Exception
     */
    @Override
    public boolean exists(int id, String code) throws Exception{
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            params.put("code", code);
            String sql = "SELECT COUNT(*) FROM Kter WHERE code = :code AND id <> " + id;
            return db.Query(con, sql, Integer.class, params).get(0) > 0;
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Добавить/ Изменить территорию
     * @param kter - модель территории
     * @return
     * @throws Exception
     */
    @Override
    public int save(KterModel kter) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "";
            Map<String, Object> params = new HashMap<>();
            params.put("code", kter.getCode());
            params.put("name", kter.getName());
            params.put("addr", kter.getAddr());
            String answerSQL = "NULL";
            if(kter.getUserId() != -1){
                answerSQL = Integer.toString(kter.getUserId());
            }
            if(kter.getId() == -1){
                sql = "INSERT INTO Kter (code, name, kokId, addr, answerUserId, del)"
                        +" VALUES(:code, :name, " + kter.getKokId() + ", :addr, " + answerSQL + ", 0)";
                kter.setId(db.Execute(con, sql, Integer.class, params));
            }
            else {
                db.CheckLock(con, kter.getId(), "kter");
                sql = "UPDATE Kter SET code = :code, name = :name, kokId = " + kter.getKokId() + ", addr = :addr, answerUserId = " + answerSQL + " WHERE id = " + kter.getId();
                db.Execute(con, sql, params);
            }
            return kter.getId();
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Функция проверки существования не удалённых подразделений территории
     * @param kterId - идентификатор территории
     * @return
     * @throws Exception
     */
    @Override
    public boolean existsDeps(int kterId) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT COUNT(*) FROM Deps WHERE Del = 0 AND kterId = " + kterId;
            return db.Query(con, sql, Integer.class, null).get(0) > 0;
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Удаление территории
     * @param id - идентификатор территории
     * @throws Exception
     */
    @Override
    public void delete(int id) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "UPDATE Kter SET Del = 1 - Del WHERE Id = " + id;
            db.Execute(con, sql, null);
        }
        catch(Exception ex){
            throw ex;
        }
    }
    /**
     * Пполучить список казначейств для формы редактирования записи
     * @return
     * @throws Exception
     */
    @Override
    public List<KokModel> GetKOKList() throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT id, CAST(id as VARCHAR(128)) || ' = ' || Name as Name FROM KOK WHERE Del = 0 ORDER BY Name";
            return db.Query(con, sql, KokModel.class, null);
        }
        catch(Exception ex){
            throw ex;
        }
    }
    /**
     * Получить список пользователей казначейства
     * @param kokId идентификатор казначейства
     * @return
     * @throws Exception
     */
    @Override
    public List<UserModel> GetUsers(int kokId) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT u.id, CAST(u.id as VARCHAR(128)) || ' = ' || u.Name as Name FROM Users u"
                    +" JOIN Deps d ON d.Id = u.DepId"
                    +" JOIN Kter kt ON kt.Id = d.KterId"
                    +" WHERE kt.KokId = " + kokId + " ORDER BY u.Name";
            return db.Query(con, sql, UserModel.class, null);
        }
        catch(Exception ex){
            throw ex;
        }
    }
}
