package org.kaznalnrprograms.Accounting.KOK.Dao;

import org.kaznalnrprograms.Accounting.KOK.Interfaces.IKOKDao;
import org.kaznalnrprograms.Accounting.KOK.Models.KOKModel;
import org.kaznalnrprograms.Accounting.KOK.Models.KOKViewModel;
import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class KOKDaoImpl implements IKOKDao {
    private String appName = "KOK - справочник кодов органов казначейств";
    private DBUtils db;
    public KOKDaoImpl(DBUtils db){
        this.db = db;
    }
    /**
     * Получить список казначейств
     * @param showDel - флаг отображения удалённых записей
     */
    @Override
    public List<KOKViewModel> List(boolean showDel) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT Id, Code, Name, Director, Accountant, state_code, Del FROM KOK WHERE 1=1";
            if(!showDel){
                sql += " AND Del = 0";
            }
            sql += " ORDER BY Code";
            return db.Query(con, sql, KOKViewModel.class, null);
        }
        catch(Exception ex){
            throw ex;
        }
    }
    /**
     * Получить код органа казначейства
     * @param id - идентификатор кода органа казначейства
     */
    @Override
    public KOKModel Get(int id) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT k.id, k.code, k.name, k.director, k.accountant, k.state_code, " +
                    "k.creator, k.created, k.changer, k.changed FROM KOK k WHERE k.id = " + id;
            List<KOKModel> koks =  db.Query(con, sql, KOKModel.class, null);
            if(koks.size() == 0){
                throw new Exception("Не удалось получить код органа казначейства с Id = " + id);
            }
            return koks.get(0);
        }
        catch (Exception ex){
            throw ex;
        }
    }
    /**
     * Проверить существование казначейства в базе данных
     * @param id - идентификатор казначейства (для новых -1)
     * @param code - код органа казначейства
     */
    @Override
    public boolean Exists(int id, String code) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT COUNT(*) FROM KOK WHERE Code = :code AND id <> " + id;
            Map<String, Object> params = new HashMap<>();
            params.put("code", code);
            return db.Query(con, sql, Integer.class, params).get(0) > 0;
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Добавить/Изменить орган казначейства
     * @param kok - модуль кода органа казначейства
     */
    @Override
    public int Save(KOKModel kok) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "";
            Map<String, Object> params = new HashMap<>();
            params.put("code", kok.getCode());
            params.put("name", kok.getName());
            params.put("director", kok.getDirector());
            params.put("state_code", kok.getState_code());
            params.put("accountant", kok.getAccountant());
            if(kok.getId() == -1){
                sql = "INSERT INTO KOK (code, name, director, accountant, state_code, del) VALUES(:code, :name, :director, :accountant, :state_code, 0)";
                kok.setId(db.Execute(con, sql, Integer.class, params));
            }
            else {
                sql = "UPDATE KOK SET Code = :code, Name = :name, Director = :director, Accountant = :accountant, state_code = :state_code WHERE id = " + kok.getId();
                db.Execute(con, sql, params);
            }
            return kok.getId();
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Удалить код органа казначейства
     * @param id - идентификатор кода органа казначейства
     */
    @Override
    public String Delete(int id) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT k.del FROM KOK k WHERE k.Id = " + id;
            List<Integer> lDel = db.Query(con, sql, Integer.class, null);
            if(lDel.size() == 0){
                throw new Exception("Невозможно удалить или восстановить код органа казначейства с Id = " + id + ". Запись была или удалена из базы данных или у вас нет к ней доступа");
            }
            int del = lDel.get(0);
            sql = "SELECT COUNT(*) FROM Kter WHERE Del=0 AND KokId="+id;
            int count = db.Query(con, sql, Integer.class, null).get(0);
            if(del == 0 && count != 0){
                return "Невозможно удалить казначейство с Id = " + id + ", так как к нему есть привязанные не удалённые территории";
            }
            sql = "UPDATE KOK SET Del = 1 - Del WHERE Id = " + id;
            db.Execute(con, sql, null);
            return "";
        }
        catch(Exception ex){
            throw ex;
        }
    }
}
