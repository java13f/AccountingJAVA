package org.kaznalnrprograms.Accounting.Invs.Dao;

import org.kaznalnrprograms.Accounting.Invs.Interfaces.IInvsDao;
import org.kaznalnrprograms.Accounting.Invs.Models.InvsCommisModelSave;
import org.kaznalnrprograms.Accounting.Invs.Models.InvsModel;
import org.kaznalnrprograms.Accounting.Invs.Models.InvsModelCommis;
import org.kaznalnrprograms.Accounting.Invs.Models.InvsModelSave;
import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;

@Repository
public class InvsDaoImpl implements IInvsDao {
    private String appName = "Invs - Список инвентаризаций";
    private DBUtils db;

    public InvsDaoImpl(DBUtils db) {
        this.db = db;
    }


    @Override
    public List<InvsModel> List() throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "Select id, name, order_numb, to_char( DATE_TRUNC('second', date_begin), 'DD.MM.YYYY') as  date_begin" +
                    " , to_char( DATE_TRUNC('second', date_end), 'DD.MM.YYYY') as  date_end from invs order by id";
            return db.Query(con, sql, InvsModel.class, null);
        } catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public List<InvsModelCommis> getInvsCommisList(int id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new Hashtable<>();
            params.put("id", id);
            String sql = " Select ic.id as id, ic.nom as nom,  ic.post as post, u.name as name from invs_commis ic \n" +
                    "join users u on u.id = ic.user_id\n" +
                    "where ic.invs_id = :id order by ic.nom";

            return db.Query(con, sql, InvsModelCommis.class, params);
        } catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public String GetFio(int Id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "select name from users where id =" + Id;
            List<String> result = db.Query(con, sql, String.class, null);
            if (result.size() == 0) {
                throw new Exception("Не удалось получить реквизит с Id = " + Id);
            }
            return result.get(0);

        } catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public boolean exists(int id, String name, String order_numb) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> param = new HashMap<>();
            param.put("name", name);
            param.put("order_numb", order_numb);
            String sql = " SELECT COUNT(*) FROM Invs WHERE " +
                        " name = :name  and  order_numb = :order_numb " +
                        " and id <> " + id;
            return db.Query(con, sql, Integer.class, param).get(0) > 0;
        } catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public int save(InvsModelSave obj) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "";
            Map<String, Object> params = new HashMap<>();
            params.put("name", obj.getName());
            params.put("matres_post_1", obj.getMatres_post_1());
            params.put("matres_post_2", obj.getMatres_post_2());
            params.put("matres_post_3", obj.getMatres_post_3());
            params.put("matres_fio_user_id_1", obj.getMatres_fio_user_id_1());
            params.put("order_numb", obj.getOrder_numb());
            params.put("date_ord", obj.getDate_ord());
            params.put("date_prep", obj.getDate_prep());
            params.put("date_begin", obj.getDate_begin());
            params.put("date_as_of", obj.getDate_as_of());
            params.put("date_end", obj.getDate_end());
            params.put("commis_ch_post", obj.getCommis_ch_post());
            params.put("check_post", obj.getCheck_post());
            params.put("commis_ch_fio", obj.getCommis_ch_fio());
            params.put("check_fio", obj.getCheck_fio());

            if (obj.getId() == -1) {
            sql = " INSERT INTO Invs ( name, matres_post_1, matres_post_2, matres_post_3, matres_fio_user_id_1 " ;

                if (obj.getMatres_fio_user_id_2() != 0 ){
                    params.put("matres_fio_user_id_2", obj.getMatres_fio_user_id_2());
                    sql+=", matres_fio_user_id_2";
                }

                if (obj.getMatres_fio_user_id_3()!= 0 ){
                    params.put("matres_fio_user_id_3", obj.getMatres_fio_user_id_3());
                    sql+=", matres_fio_user_id_3";
                }
                sql+=   " ,order_numb ,date_ord, date_prep , date_begin , date_as_of , date_end ,"+
                        " commis_ch_post , check_post , commis_ch_fio_user_id , check_fio_user_id) " +
                  " values (:name, :matres_post_1 , :matres_post_2 , :matres_post_3  " +
                        " ,:matres_fio_user_id_1  " ;

                if (obj.getMatres_fio_user_id_2() != 0 ){
                    sql+=", :matres_fio_user_id_2";
                }

                if (obj.getMatres_fio_user_id_3() != 0 ){

                    sql+=", :matres_fio_user_id_3";
                }
                 sql+=  " ,:order_numb, " +
                        " cast(  :date_ord AS timestamp without time zone) , " +
                        " cast(  :date_prep AS timestamp without time zone) , " +
                        " cast(  :date_begin  AS timestamp without time zone) , " +
                        " cast(  :date_as_of  AS timestamp without time zone) , " +
                        " cast(  :date_end  AS timestamp without time zone) , " +
                        " :commis_ch_post , :check_post , :commis_ch_fio , :check_fio )";
                obj.setId(db.Execute(con, sql, Integer.class, params));
            } else {
                db.CheckLock(con, obj.getId(), "invs");
                sql =   " update Invs set " +
                        " name = :name, " +
                        " matres_post_1 = :matres_post_1," +
                        " matres_post_2 = :matres_post_2, " +
                        " matres_post_3 = :matres_post_3, " +
                        " order_numb = :order_numb, " +
                        " date_ord = cast(  :date_ord AS timestamp without time zone) , " +
                        " date_prep =cast(  :date_prep AS timestamp without time zone) ," +
                        " date_begin = cast(  :date_begin AS timestamp without time zone) ," +
                        " date_as_of = cast(  :date_as_of AS timestamp without time zone) ," +
                        " date_end = cast(  :date_end AS timestamp without time zone) , " +
                        " matres_fio_user_id_1 = :matres_fio_user_id_1 , " ;
                if (obj.getMatres_fio_user_id_2() != 0 ){
                    params.put("matres_fio_user_id_2", obj.getMatres_fio_user_id_2());
                    sql+="matres_fio_user_id_2 = :matres_fio_user_id_2 ,";
                }
                else {
                    sql+="matres_fio_user_id_2 = null,";
                }
                if (obj.getMatres_fio_user_id_3()!= 0 ){
                    params.put("matres_fio_user_id_3", obj.getMatres_fio_user_id_3());
                    sql+="matres_fio_user_id_3 = :matres_fio_user_id_3 ,";
                }
                else {
                    sql+="matres_fio_user_id_3 = null,";
                }
                  sql+= " commis_ch_post = :commis_ch_post , " +
                        " check_post = :check_post , " +
                        " commis_ch_fio_user_id = :commis_ch_fio , " +
                        " check_fio_user_id = :check_fio " +
                        " where id =  " + obj.getId();
                db.Execute(con, sql, params);
            }
            return obj.getId();
        } catch (Exception ex) {
            throw ex;
        }

    }

    @Override
    public InvsModelSave get(int id) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = " select id, " +
                         " name, " +
                         " matres_post_1, " +
                         " matres_post_2, " +
                         " matres_post_3, " +
                         " matres_fio_user_id_1, " +
                         " matres_fio_user_id_2, " +
                         " matres_fio_user_id_3, " +
                         " order_numb, " +
                         " to_char( DATE_TRUNC('second', date_ord), 'DD.MM.YYYY') as  date_ord, " +
                         " to_char( DATE_TRUNC('second',  date_prep), 'DD.MM.YYYY') as   date_prep, " +
                         " to_char( DATE_TRUNC('second',  date_begin), 'DD.MM.YYYY') as   date_begin , " +
                         " to_char( DATE_TRUNC('second',  date_as_of), 'DD.MM.YYYY') as   date_as_of , " +
                         " to_char( DATE_TRUNC('second',  date_end), 'DD.MM.YYYY') as   date_end , " +
                         " commis_ch_post, " +
                         " check_post,"+
                         " commis_ch_fio_user_id as commis_ch_fio,"+
                         " check_fio_user_id as check_fio," +
                         " creator, " +
                         " created, " +
                         " changer, " +
                         " changed " +
                         " from invs " +
                         " where id = " + id;
            List<InvsModelSave> result = db.Query(con, sql, InvsModelSave.class, null);
            if(result.size() == 0){
                throw new Exception("Не удалось получить запись с Id = " + id);
            }
            return result.get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }
    @Override
    public String GetNameFio(int id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "select name from users where id =" + id;
            List<String> result = db.Query(con, sql, String.class, null);
            if (result.size() == 0) {
                throw new Exception("Не удалось получить реквизит с Id = " + id);
            }
            return result.get(0);

        } catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public void delete(int id) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "Delete from Invs WHERE Id = " + id;
            delete_and_commis(id);
            db.Execute(con, sql, null);
        }
        catch(Exception ex){
            throw ex;
        }
    }

    public void delete_and_commis(int id) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "Delete from Invs_commis WHERE Invs_Id = " + id;
            db.Execute(con, sql, null);
        }
        catch(Exception ex){
            throw ex;
        }
    }
    @Override
    public void delete_commis(int id) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "Delete from Invs_commis WHERE Id = " + id;
            db.Execute(con, sql, null);
        }
        catch(Exception ex){
            throw ex;
        }
    }
    @Override
    public boolean exists_commis(int id, int user_id , int invs_id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> param = new HashMap<>();
            param.put("user_id", user_id);
            param.put("invs_id", invs_id);

            String sql = " SELECT COUNT(*) FROM Invs_commis WHERE " +
                    " user_id = :user_id and" +
                    " invs_id = :invs_id " +
                    " and id <> " + id;
            return db.Query(con, sql, Integer.class, param).get(0) > 0;
        } catch (Exception ex) {
            throw ex;
        }
    }
    @Override
    public int save_commis(InvsCommisModelSave obj) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "";
            Map<String, Object> params = new HashMap<>();
            params.put("nom", obj.getNom());
            params.put("post", obj.getPost());
            params.put("user_id", obj.getUser_id());
            params.put("invs_id", obj.getInvs_id());
            if(obj.getId() == -1){
                sql = " INSERT INTO Invs_commis (nom , post , user_id , invs_id) values (:nom, :post , :user_id , :invs_id) ";
                obj.setId(db.Execute(con, sql, Integer.class, params));
            }
            else {
                db.CheckLock(con, obj.getId(), "invs_commis");
                sql = "update Invs_commis set  nom = :nom,  post = :post, user_id = :user_id , invs_id = :invs_id where id =  " + obj.getId();
                db.Execute(con, sql, params);
            }

            return obj.getId();
        }
        catch(Exception ex){
            throw ex;
        }
    }
    @Override
    public InvsCommisModelSave get_commis(int id) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = " select id, " +
                    " nom, " +
                    " post, " +
                    " user_id ," +
                    " invs_id, " +
                    " creator, " +
                    " created, " +
                    " changer, " +
                    " changed " +
                    " from Invs_commis " +
                    " where id = " + id;
            List<InvsCommisModelSave> result = db.Query(con, sql, InvsCommisModelSave.class, null);
            if(result.size() == 0){
                throw new Exception("Не удалось получить запись с Id = " + id);
            }
            return result.get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }
}


