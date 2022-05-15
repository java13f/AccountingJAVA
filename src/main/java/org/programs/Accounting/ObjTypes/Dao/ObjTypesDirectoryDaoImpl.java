package org.kaznalnrprograms.Accounting.ObjTypes.Dao;
import org.kaznalnrprograms.Accounting.ObjTypes.Interfaces.IObjTypesDao;
import org.kaznalnrprograms.Accounting.ObjTypes.Models.ObjTypesModel;
import org.kaznalnrprograms.Accounting.ObjTypes.Models.ObjTypesViewModel;
import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@Repository
public class ObjTypesDirectoryDaoImpl implements IObjTypesDao {
    private String appName = "ObjTypes - Типы Объектов";
    private DBUtils db;
    public ObjTypesDirectoryDaoImpl (DBUtils db) {this.db = db;}
    /**
     * Получить список
     * @param showDel - флаг отображения удалённых записей
     * @return
     * @throws Exception
     */

    @Override
    public List<ObjTypesViewModel> list(boolean showDel) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            String sql = " select obj.id as id, obj.name as name, obj.del from objtypes obj\n" +
                    " join  obj_types_id_by_user() objt on objt.obj_type_id = obj.id  where 1 = 1";
            if (!showDel){
                sql += "and del=0";
            }
            sql+=" ORDER BY name";
            return db.Query(con, sql, ObjTypesViewModel.class, params);
        }
        catch (Exception ex){
            throw ex;
        }
    }
    /**
     * Функция получения записи для просмотра/изменения
     * @param id - идентификатор
     * @return
     * @throws Exception
     */
    @Override
    public ObjTypesModel get(int id) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT id, name, creator, created, changer, changed FROM ObjTypes WHERE id = " + id;
            List<ObjTypesModel> result = db.Query(con, sql, ObjTypesModel.class, null);
            if(result.size() == 0){
                throw new Exception("Не удалось получить объект с Id = " + id);
            }
            return result.get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }
    /**
     * Проверить существование объекта
     * @param id - идентификатор  (для новых -1)
     * @param name - код территории
     * @return
     * @throws Exception
     */
    @Override
    public boolean exists(int id, String name) throws Exception{
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            params.put("name", name);
            String sql = "SELECT COUNT(*) FROM ObjTypes WHERE name = :name AND id <> " + id;
            return db.Query(con, sql, Integer.class, params).get(0) > 0;
        }
        catch(Exception ex){
            throw ex;
        }
    }
    /**
     * Добавить/ Изменить
     * @param  - модель
     * @return
     * @throws Exception
     */
    @Override
    public int save(ObjTypesModel objtypes) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "";
            Map<String, Object> params = new HashMap<>();
            params.put("name", objtypes.getName());
            if(objtypes.getId() == -1){
                sql = "INSERT INTO ObjTypes ( name, del) " +
                      "VALUES( :name, 0) returning id";
                objtypes.setId(db.Execute(con, sql, Integer.class, params));
            }

            else {
                db.CheckLock(con, objtypes.getId(), "objtypes");
                sql = "UPDATE ObjTypes SET  name = :name WHERE id = " + objtypes.getId();
                db.Execute(con, sql, params);
            }
               return objtypes.getId();
        }
        catch(Exception ex){
            throw ex;
        }
    }
    /**
     * Удаление
     * @param id - идентификатор
     * @throws Exception
     */
    @Override
    public void delete(int id) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "UPDATE ObjTypes SET Del = 1 - Del WHERE Id = " + id;
            db.Execute(con, sql, null);
        }
        catch(Exception ex){
            throw ex;
        }
    }
}
