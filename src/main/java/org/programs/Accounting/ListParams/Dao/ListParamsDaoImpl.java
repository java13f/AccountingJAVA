package org.kaznalnrprograms.Accounting.ListParams.Dao;

import org.kaznalnrprograms.Accounting.ListParams.Interfaces.IListParamsDirectoryDao;
import org.kaznalnrprograms.Accounting.ListParams.Models.ListParamsModel;
import org.kaznalnrprograms.Accounting.ListParams.Models.ListParamsViewModel;
import org.kaznalnrprograms.Accounting.ListParams.Models.TaskCodeModel;
import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class ListParamsDaoImpl implements IListParamsDirectoryDao  {
    private String appName = "ListParams - справочник дополнительных реквизитов";
    private DBUtils db;

    public ListParamsDaoImpl(DBUtils db){
        this.db = db;
    }

    /**
     * Получить список дополнительных реквизитов
     * @param taskcode - код задачи (таблицы)
     * @param showDel - признак удаления
     * @return
     * @throws Exception
     */
    @Override
    public List<ListParamsViewModel> list(String taskcode, boolean showDel) throws Exception{
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            String sql = " SELECT id, nom, paramcode, name, del, taskcode, reffercode, del" +
                         " FROM listparams" +
                         " WHERE 1=1";
            if(!showDel){
                sql+=" AND del=0";
            }
            if(!taskcode.isEmpty()){
                sql +=" AND taskcode = :taskcode";
                params.put("taskcode", taskcode);
            }
            sql+=" ORDER BY nom,reffercode";
            return db.Query(con, sql, ListParamsViewModel.class, params);
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Функция получения реквизита для просмотра/изменения
     * @param id - идентификатор дополнительного реквизита
     * @return
     * @throws Exception
     */
    @Override
    public ListParamsModel get(int id) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT id, paramcode, taskcode, name, strict, nom, reffermodul, refferfunc, reffertable, " +
                    " reffercode, reffereditcode, codejs, creator, created, changer, changed FROM listparams WHERE id = " + id;
            List<ListParamsModel> result = db.Query(con, sql, ListParamsModel.class, null);
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
     * Добавление/изменение реквизита
     * @param model - модель дополнительного реквизита
     * @return
     * @throws Exception
     */
    @Override
    public int save(ListParamsModel model) throws Exception{
        try(Connection con = db.getConnection(appName)) {
            String sql = "";
            Map<String, Object> params = new HashMap<>();
            params.put("paramcode", model.getParamcode());
            params.put("taskcode", model.getTaskcode());
            params.put("name", model.getName());
            params.put("nom", model.getNom());
            params.put("strict", model.getStrict());
            params.put("reffermodul", model.getReffermodul());
            params.put("refferfunc", model.getRefferfunc());
            params.put("codejs", model.getCodejs());
            params.put("reffertable", model.getReffertable());
            params.put("reffercode", model.getReffercode());
            params.put("reffereditcode", model.getReffereditcode());

            String reffercode = "__-999__";
            String reffereditcode = "__-999__";
            if (model.getReffercode() == "") {
                model.setReffercode(reffercode);
            }
            if(model.getReffereditcode() == ""){
                model.setReffereditcode(reffereditcode);
            }
            if(model.getId() == -1){
                sql = " INSERT INTO listparams (paramcode, taskcode, name, nom, strict, reffermodul, refferfunc, reffertable, reffercode, reffereditcode, codejs, del) "
                + " VALUES (:paramcode, :taskcode, :name, :nom, :strict, :reffermodul, :refferfunc, :reffertable,"
                + " CASE WHEN :reffercode = '' THEN  null ELSE :reffercode END, CASE WHEN :reffereditcode = '' THEN  null ELSE :reffereditcode END, :codejs, 0)  RETURNING id";
                model.setId(db.Execute(con, sql, Integer.class, params));
            }
            else {
                db.CheckLock(con, model.getId(), "listparams");
                sql = "UPDATE listparams SET"
                        + "  paramcode = :paramcode"
                        + ", taskcode = :taskcode"
                        + ", name = :name"
                        + ", nom = :nom"
                        +" , strict = :strict"
                        + ", reffermodul = :reffermodul"
                        + ", refferfunc = :refferfunc"
                        + ", reffertable = :reffertable"
                        + ", reffercode = CASE WHEN :reffercode = '' THEN  null ELSE :reffercode END "
                        + ", reffereditcode = CASE WHEN  :reffereditcode = '' THEN  null ELSE :reffereditcode END "
                        + ", codejs = :codejs"
                        + ", del = 0 WHERE id = " + model.getId();
                db.Execute(con, sql, params);
            }
            return model.getId();
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Удаление реквизита
     * @param id - идентификатор дополнительного реквизита
     * @throws Exception
     */
    @Override
    public void delete(int id) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "UPDATE listparams SET Del = 1 - Del WHERE Id = " + id;
            db.Execute(con, sql, null);
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Получаем список таблиц из ListParams
     * @return
     * @throws Exception
     */
    @Override
    public List<TaskCodeModel> GetTaskCodeList() throws Exception{
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            String sql = " SELECT DISTINCT taskcode FROM listparams ORDER BY taskcode";
            return db.Query(con, sql, TaskCodeModel.class, params);
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Проверям существуют ли дубликаты по уникальным полям
     * @param taskcode - код задачи (таблицы)
     * @param nom - номер параметра
     * @param id - идентификатор записи
     * @return
     * @throws Exception
     */
    @Override
    public boolean duplicateTaskCodeAndNom(String taskcode, int nom, int id) throws Exception {
        try (Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            params.put("taskcode", taskcode);
            String sql = "SELECT" +
                    " COUNT(*) " +
                    " FROM listparams" +
                    " WHERE taskcode = :taskcode" +
                    " AND nom = " + nom +
                    " AND id <>" + id;
            return db.Query(con, sql, Integer.class, params).get(0) > 0;
        }
        catch (Exception ex){
            throw  ex;
        }
    }

    /**
     * Проверям существуют ли дубликаты по уникальным полям
     * @param taskcode - код задачи (таблицы)
     * @param paramcode - код параметра
     * @param id - идентификатор записи
     * @return
     * @throws Exception
     */
    @Override
    public boolean duplicateTaskCodeAndParamCode(String taskcode, String paramcode, int id) throws Exception{
        try (Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            params.put("taskcode", taskcode);
            params.put("paramcode", paramcode);
            String sql = "SELECT" +
                    " COUNT(*) " +
                    " FROM listparams" +
                    " WHERE taskcode = :taskcode" +
                    " AND paramcode = :paramcode" +
                    " AND id <>" + id;
            return db.Query(con, sql, Integer.class, params).get(0) > 0;
        }
        catch (Exception ex){
            throw  ex;
        }
    }

    /**
     * Проверяем существует ли такой код в справочнике RefferParams
     * @param reffercode - Код справочника в таблице RefferParams (ParamCode)
     * @return
     * @throws Exception
     */
    @Override
    public boolean exsistRefferParams(String reffercode) throws Exception {
        try (Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            params.put("reffercode", reffercode);
            String sql = "SELECT COUNT(*) FROM refferparams WHERE paramcode = :reffercode";
            return db.Query(con, sql, Integer.class, params).get(0) > 0;
        }
        catch (Exception ex){
            throw  ex;
        }
    }
}
