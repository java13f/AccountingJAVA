package org.kaznalnrprograms.Accounting.Locations.Dao;

import org.kaznalnrprograms.Accounting.Locations.Interfaces.ILocations;
import org.kaznalnrprograms.Accounting.Locations.Models.DepModel;
import org.kaznalnrprograms.Accounting.Locations.Models.KterModel;
import org.kaznalnrprograms.Accounting.Locations.Models.LocationsModel;
import org.kaznalnrprograms.Accounting.Locations.Models.LocationsViewModel;
import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class LocationsDaoImpl implements ILocations
{
    String appName = "Locations - справочник месторасположений";
    DBUtils db;

    public LocationsDaoImpl(DBUtils db)
    {
        this.db = db;
    }

    /**
     * Получить список месторасположений
     * @param name - наименование
     * @param depid - департамент
     * @param kterid - территория
     * @param del - признак существования
     * @return
     * @throws Exception
     */
    @Override
    public List<LocationsViewModel> getList(String name, int depid, int kterid, boolean del) throws Exception
    {
        try(Connection con = db.getConnection(appName))
        {
            Map<String, Object> params = new HashMap<>();
            String sql = "SELECT l.id, d.name AS depname, k.name AS ktername, l.name, l.del FROM locations l JOIN deps d on l.depid = d.id JOIN kter k ON d.kterid = k.id " +
                    " WHERE 1=1";
            if(!name.isEmpty())
            {
                sql += " AND l.name ILIKE '%'||:name||'%' OR d.name ILIKE '%'||:name||'%'";
                params.put("name", name);
            }

            if(!del)
            {
                sql += " AND l.del = 0";
            }

            if(depid != -1)
            {
                sql += " AND d.id = :depid";
                params.put("depid", depid);
            }

            if(kterid != - 1)
            {
                sql += " AND k.id = :kterid";
                params.put("kterid", kterid);
            }


            sql += " ORDER BY l.name";
            return db.Query(con, sql, LocationsViewModel.class, params);
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    /**
     * Удалить месторасположение
     * @param id - объекта удаления
     * @return
     * @throws Exception
     */
    @Override
    public void delete(int id) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "UPDATE Locations SET Del = 1 - Del WHERE id = " + id;
            db.Execute(con, sql, null);
        }
        catch(Exception ex){
            throw ex;
        }
    }


    /**
     * Получить территорию для фильтра
     * @param KterId
     * @return
     * @throws Exception
     */
    @Override
    public String getKter(int KterId) throws Exception {
        try(Connection con = db.getConnection(appName))
        {
            String sql = "SELECT LTRIM(RTRIM(CAST(Id AS VARCHAR(128)))) || ' = ' || code || ' : ' || name FROM Kter WHERE Id = " + KterId;
            List<String> result =  db.Query(con, sql, String.class, null);
            if(result.size() == 0){
                throw new Exception("Не удалось получить территорию с Id = " + KterId);
            }
            return result.get(0);

        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    /**
     * Получить модель территории
     * @param KterId идентификтор территории
     * @return
     * @throws Exception
     */
    @Override
    public KterModel getKterObj(int KterId) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT kt.id, COALESCE(kt.id ||' = '||kt.code||' : '|| kt.name, '') as name, COALESCE(d.id, -1) as depId, \n" +
                    "COALESCE(d.id ||' = '||d.code||' : '|| d.name, '') as depName\n" +
                    "FROM kter kt\n" +
                    "LEFT JOIN Deps d ON d.KterId = kt.id AND d.main_dep = 1\n" +
                    "WHERE kt.id = " + KterId;
            List<KterModel> kters = db.Query(con, sql, KterModel.class, null);
            if(kters.size()==0){
                throw new Exception("Не найдена территория с ID = " + KterId);
            }
            return kters.get(0);
        }
    }

    /**
     * Добавить/ Изменить месторасположение
     * @param model - модель месторасположение
     * @return
     * @throws Exception
     */
    @Override
    public int save(LocationsModel model) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "";
            Map<String, Object> params = new HashMap<>();
            params.put("name", model.getName());
            if(model.getId() == -1){
                sql = "INSERT INTO Locations (name, depId, del)"
                        +" VALUES(:name, " + model.getDepid() + ", 0)";
                model.setId(db.Execute(con, sql, Integer.class, params));
            }
            else {
                db.CheckLock(con, model.getId(), "locations");
                sql = "UPDATE Locations SET name = :name, depId = " + model.getDepid() + " WHERE id = " + model.getId();
                db.Execute(con, sql, params);
            }
            return model.getId();
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Получить месторасположение
     * @param id - объекта месторасположения
     * @return
     * @throws Exception
     */
    @Override
    public LocationsModel getLocation(int id) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT l.id, d.kterId, l.depId, l.name,l.del,\n" +
                    "l.creator, l.created, l.changer, l.changed\n" +
                    "FROM locations l\n" +
                    "JOIN Deps d ON d.id = l.DepId WHERE l.id = " + id;
            List <LocationsModel> list = db.Query(con, sql, LocationsModel.class, null);
            if(list.size() == 0){
                throw new Exception("Не удалось получить месторасположение с Id = " + id);
            }
            return list.get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Получить подразделение
     * @param depId идентификатор подразделения
     * @return
     * @throws Exception
     */
    public DepModel getDep(int depId) throws Exception{
        try (Connection con = db.getConnection(appName) ){
            String sql = "SELECT id, code, id||' = '||code||' : '||name as name from Deps WHERE id = "+depId;
            List<DepModel> deps = db.Query(con, sql, DepModel.class, null);
            DepModel dep = null;
            if(deps.size() == 0){
                dep = new DepModel();
                dep.setId(-1);
            }
            else {
                dep = deps.get(0);
            }
            return dep;
        }
    }
}
