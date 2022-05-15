package org.kaznalnrprograms.Accounting.Problems.Dao;

import org.kaznalnrprograms.Accounting.Problems.Interfaces.IProblemsDirectoryDao;
import org.kaznalnrprograms.Accounting.Problems.Models.ProblemsModel;
import org.kaznalnrprograms.Accounting.Problems.Models.ProblemsViewModel;
import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

//import java.sql.Connection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class ProblemsDirectoryDaoImpl implements IProblemsDirectoryDao {

    private String appName = "Problems - справочник кодов проблем";
    private DBUtils db;

    public ProblemsDirectoryDaoImpl(DBUtils db){
        this.db = db;
    }

    /**
     * Получить список проблем
     * @param showDel - флаг отображения удаленных записей
     * @return
     * @throws Exception
     */
    @Override
    public List<ProblemsViewModel> list(boolean showDel, int obj_type_id) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            params.put("obj_type_id", obj_type_id);
            String sql = "SELECT prb.id, obj.name obtypename, prb.name, prb.del FROM problems prb JOIN objtypes obj ON prb.obj_type_id = obj.id";
            if(obj_type_id > -1 ) sql += " WHERE prb.obj_type_id = :obj_type_id";
            else sql += " WHERE prb.obj_type_id <> :obj_type_id";
            if(!showDel){ sql += " AND prb.Del = 0"; }
            sql+=" ORDER BY prb.name";
            return db.Query(con, sql, ProblemsViewModel.class, params);
        }
    }

    /**
     * Получить проблему для ее просмотра/изенения
     * @param id - идентификатор проблемы (для новых -1)
     * @return
     * @throws Exception
     */
    @Override
    public ProblemsModel get(int id) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            params.put("id", id);
            String sql = "SELECT prb.id, prb.name, prb.creator, prb.created, prb.changer, prb.changed, obj.id ||' = ' || obj.name as tp_ob FROM Problems prb JOIN objtypes obj ON prb.obj_type_id = obj.id WHERE prb.id = :id";
            List<ProblemsModel> result = db.Query(con, sql, ProblemsModel.class, params);
            if(result.size()==0){
                throw new Exception("Не удалось получить проблему с Id = "+id);
            }
            return result.get(0);

            }
            catch (Exception ex){
                throw ex;
        }
    }

    /**
     * Добавить/изменить проблему
     * @param problem - модель проблемы
     * @return
     * @throws Exception
     */
    @Override
    public int save(ProblemsModel problem) throws Exception {
        try (Connection con = db.getConnection(appName)){
            String sql="";
            Map<String, Object> params = new HashMap<>();
            params.put("name", problem.getName());
            params.put("tp_ob", problem.getTp_ob());
            if(problem.getId()==-1){
                sql = "INSERT INTO Problems(name, del, obj_type_id)"
                        +" VALUES(:name, 0, :tp_ob::int)";
                problem.setId(db.Execute(con, sql, Integer.class,params));
            }else{
                db.CheckLock(con, problem.getId(), "problems");
               sql="UPDATE problems SET name=:name,  obj_type_id= :tp_ob::int WHERE id = "+problem.getId();
               db.Execute(con, sql, params);
            }
            return problem.getId();
        }
        catch (Exception ex){
            throw ex;
        }
    }

    /**
     * Удаление проблемы
     * @param id - проблемы
     * @throws Exception
     */
    @Override
    public void delete(int id) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "UPDATE Problems SET Del = 1 - Del WHERE Id = "+id;
            db.Execute(con, sql, null);
        }
        catch (Exception ex){
            throw ex;
        }

    }


    /**
     * Получить тип объекта
     * @param id
     * @return
     * @throws Exception
     */
    @Override
    public String getObjectType(int id) throws Exception{
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("id", id);
            String sql = "SELECT o.id ||' =  '|| o.name as name FROM objtypes o  where o.id = :id";
            return db.Query(con, sql, String.class, params).get(0);
        }
        catch (Exception ex){
            throw ex;
        }

    }

}
