package org.kaznalnrprograms.Accounting.TypeAcss.Dao;

import org.kaznalnrprograms.Accounting.TypeAcss.Interfaces.ITypeAcssDirectoryDao;
import org.kaznalnrprograms.Accounting.TypeAcss.Models.TypeAcssCmb;
import org.kaznalnrprograms.Accounting.TypeAcss.Models.TypeAcssModel;
import org.kaznalnrprograms.Accounting.TypeAcss.Models.TypeAcssViewModel;
import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

//import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class TypeAcssDirectoryDaoImpl implements ITypeAcssDirectoryDao {
    private String appName = "TypeAcss - доступ к объектам в зависимости от их типов";
    private DBUtils db;

    public TypeAcssDirectoryDaoImpl(DBUtils db){
        this.db = db;
    }

    @Override
    public List<TypeAcssViewModel> list(String filter) throws Exception{
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            String sql = "SELECT DISTINCT tpa.id, grp.name nameGroup, obj.name nameTypeObject, tpa.group_id, tpa.obj_type_id" +
                    " FROM type_acss tpa" +
                    " INNER JOIN groups grp ON tpa.group_id = grp.id" +
                    " LEFT JOIN objtypes obj ON tpa.obj_type_id = obj.id " +
                    " WHERE grp.deleted = 0 AND (obj.del = 0 OR obj.del IS NULL)";
            if(!filter.isEmpty()) {
                sql += " AND (grp.name ILIKE '%'||:filter||'%' OR obj.name ILIKE '%'||:filter||'%')";
                params.put("filter", filter);
            }
            sql+=" ORDER BY nameGroup, nameTypeObject, tpa.id DESC";
            return db.Query(con, sql, TypeAcssViewModel.class, params);
        }catch (Exception ex){
            throw ex;
        }
    }

    @Override
    public TypeAcssModel get(int id) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("id", id);
            String sql = "SELECT * FROM type_acss tpa WHERE id = :id";
            return db.Query(con, sql, TypeAcssModel.class, params).get(0);
        } catch (Exception ex){
            throw ex;
        }
    }

    @Override
    public List<TypeAcssCmb> LoadGroup() throws Exception{
            try(Connection con = db.getConnection(appName)){
                String sql = "SELECT DISTINCT grp.id AS id, CAST(grp.id AS VARCHAR(128)) || ' = ' || grp.name AS idName, grp.name FROM groups grp WHERE grp.deleted=0 ORDER by grp.name";
                return db.Query(con, sql, TypeAcssCmb.class, null);
            }catch (Exception ex){
                throw ex;
            }
    }

    @Override
    public  List<TypeAcssCmb> LoadName() throws Exception{
        try (Connection con = db.getConnection(appName)){
            String sql = "SELECT DISTINCT obj.id AS id, CAST(obj.id as varchar(128)) || ' = ' || obj.name AS idName, obj.name FROM objtypes obj WHERE obj.del=0 ORDER BY obj.name, id";

            List<TypeAcssCmb> tpAcsCm =  db.Query(con, sql, TypeAcssCmb.class, null);
            TypeAcssCmb t = new TypeAcssCmb();
            t.setId(-1); t.setIdName(" null = Все объекты ");
            tpAcsCm.add(0, t);
            return tpAcsCm;
        }
        catch (Exception ex){
            throw ex;
        }
    }

    /**
     * обавить изменить доступ к объектам в зависимости от их типов
     * @param tpAsMd
     * @return
     * @throws Exception
     */
    @Override
    public int save(TypeAcssModel tpAsMd) throws Exception{
        try(Connection con = db.getConnection(appName)) {
            String sql="";
            Map<String, Object> params = new HashMap<>();
            params.put("groupId", tpAsMd.getGroup_id());
            if(tpAsMd.getId() == -1){
                if(tpAsMd.getObj_type_id()==-1){
                    sql = "INSERT INTO type_acss(group_id) VALUES (:groupId)";
                }
                else{
                    params.put("objTypeId", tpAsMd.getObj_type_id());
                    sql = "INSERT INTO type_acss(group_id, obj_type_id) VALUES (:groupId, :objTypeId)";
                }
                tpAsMd.setId(db.Execute(con, sql, Integer.class, params));
            } else {
                db.CheckLock(con, tpAsMd.getId(), "type_acss");
                if(tpAsMd.getObj_type_id()==-1){
                    sql = "UPDATE type_acss SET group_id = :groupId, obj_type_id = NULL WHERE id = "+tpAsMd.getId();
                }else{
                    params.put("objTypeId", tpAsMd.getObj_type_id());
                    sql = "UPDATE type_acss SET group_id = :groupId, obj_type_id = :objTypeId WHERE id = "+tpAsMd.getId();
                }
                db.Execute(con, sql, params);
            }
            return tpAsMd.getId();
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Удаление записи
     * @param id
     * @throws Exception
     */
    @Override
    public void delete(Integer id) throws Exception{
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("id", id);
            String sql = "DELETE FROM type_acss WHERE id = :id";
            db.Execute(con, sql, params);
        }catch (Exception ex){
            throw ex;
        }

    }

    /**
     * Добавить все типы объектов для данной группы
     * @param group
     * @throws Exception
     */
    @Override
    public void AddAllObj (Integer group) throws Exception{
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            params.put("group", group);
            String sql = "SELECT COUNT(*) FROM type_acss WHERE group_id = :group";
            int count = db.Query(con, sql, Integer.class, params).get(0);
            if(count>0){
                sql = "SELECT COUNT(*) FROM objtypes WHERE objtypes.del = 0";
                int countObjtypes = db.Query(con, sql, Integer.class, null).get(0);
                if (count == countObjtypes) throw new Exception("Для выбранной группы все виды объектов уже добавленны!");
            }
            sql = "DELETE FROM type_acss WHERE group_id = :group";
            db.Execute(con, sql, params);
            sql = " INSERT INTO type_acss ( group_id, obj_type_id ) " +
                    " SELECT :group, objtypes.id" +
                    " FROM objtypes " +
                    " WHERE objtypes.del = 0";
            db.Execute(con, sql, params);
        }catch (Exception ex){
            throw ex;
        }
    }
}
