package org.kaznalnrprograms.Accounting.ImgWork.Dao;

//import jdk.internal.util.xml.impl.Input;
import org.kaznalnrprograms.Accounting.ImgWork.Interfaces.IImgWorkDirectoryDao;
import org.kaznalnrprograms.Accounting.ImgWork.Models.ImgLockModel;
import org.kaznalnrprograms.Accounting.ImgWork.Models.ImgWorkModel;
import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

//import java.sql.Connection;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.net.URLConnection;
import java.util.*;


@Repository
public class ImgWorkDirectoryDaoImpl implements IImgWorkDirectoryDao {
    private String appName = "ImgWork - работа с изображениями";
    private DBUtils db;
    /**
     * 0 - картинки нет ни в imgvalue ни в imglock, 1 - картинка есть в в imgvalue, 2 - картинка есть в в imglock,
     */
    private byte flagImg = 0;
    private String imgFrmImgValue = "";
    public ImgWorkDirectoryDaoImpl(DBUtils db){
        this.db = db;
    }
    /**
     * Функция получения изображения для просмотра/изменения
     * @param objectId - id таблицы, к которой относится изображение
     * @param recId - id записи, к которой относится изображение
     * @return
     * @throws Exception
     */
    @Override
    public ImgWorkModel get(int objectId, int recId, String sesId, String listParamId, String periodParamId, String period_lock_id, String imgLockId) throws Exception{
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("objectId", objectId);
            params.put("recId", recId);
            String sql ="SELECT * FROM imgvalues  WHERE objectid = :objectId AND recid = :recId";
            List<ImgWorkModel> result = db.Query(con, sql, ImgWorkModel.class, params);
            this.imgFrmImgValue = "";
            if(result.size()!=0) this.imgFrmImgValue =  result.get(0).getImg();
            params.put("sesId", sesId);
            String prm = "";
            if (!listParamId.equals("null") && listParamId != null && listParamId.length()!=0 && listParamId!="-1"){
                    params.put("listparamid", listParamId);
                    prm = prm + " AND listparamid = CAST ( :listparamid AS integer)";
                }
            if(!periodParamId.equals("null")  && periodParamId !=null && periodParamId.length()!=0){
                    params.put("periodparamid", periodParamId);
                    prm = prm + " AND periodparamid = CAST (:periodparamid AS integer)";
                }
            params.put("period_lock_id", period_lock_id);
            params.put("imgLockId", imgLockId);
            String sql2 ="SELECT id, objectid, recid, img, flagdel, flagchange FROM imglock  WHERE (CAST(:imgLockId AS Integer)>0 AND id = (CAST(:imgLockId AS Integer))) OR ((CAST(:imgLockId AS Integer)=0) AND (objectid = :objectId AND ((recid = :recId AND :recId<>-1) OR (:recId=-1 AND period_lock_id=CAST(:period_lock_id AS integer))) AND sesid = CAST ( :sesId AS uuid ))) "+prm;
            List<ImgWorkModel> result2 = db.Query(con, sql2, ImgWorkModel.class, params);
            if(result2.size()!=0) return  result2.get(0);
            else if(result.size()!=0) return result.get(0);
            else{
                ImgWorkModel tmpImWr = new ImgWorkModel();
                tmpImWr.setId(-1); tmpImWr.setImg("-1");
                result.add(tmpImWr);
                return result.get(0);
            }
        }
        catch (Exception ex){
            throw ex;
        }
    }

    /**
     * Получить изображение из таблицы imglock, если изображения нет то вернуть id = -1
     * @param tmpimgLck
     * @return
     * @throws Exception
     */
    public  ImgLockModel getimglock(ImgLockModel tmpimgLck) throws Exception{
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("objectid", tmpimgLck.getObjectid());
            params.put("recid", tmpimgLck.getRecid());
            params.put("sesid", tmpimgLck.getSesid());
            String prm = "";
            if (tmpimgLck.getListparamid() != 0){
                params.put("listparamid", tmpimgLck.getListparamid());
                prm = prm + " AND listparamid = :listparamid ";
            }
            if(tmpimgLck.getPeriodparamid()!=0) {
                params.put("periodparamid", tmpimgLck.getPeriodparamid());
                prm = prm + " AND periodparamid = :periodparamid ";
            }
            params.put("period_lock_id", tmpimgLck.getPeriod_lock_id());
            String sql = "SELECT * FROM imglock WHERE objectid = :objectid AND ((recid =:recid AND :recid <>-1) OR (:recid = -1 AND period_lock_id = CAST(:period_lock_id AS integer))) AND sesid = CAST ( :sesid AS uuid ) "+prm;
            List<ImgLockModel> result = db.Query(con, sql, ImgLockModel.class, params);
            if(result.size()==0){
                ImgLockModel tempimgLck = new ImgLockModel();
                tempimgLck.setId(-1);
                return tempimgLck;
            }
            else{
                return result.get(0);
            }
        }
        catch (Exception ex){
            throw ex;
        }
    }

    /**
     * Проверка наличия кода изображения
     * @param objectid - id таблицы
     * @param recid - id строки
     * @param img - код картинки
     * @return
     * @throws Exception
     */
   public boolean checkImgValue(int objectid, int recid, String img) throws Exception{
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("objectid", objectid);
            params.put("recid", recid);
            params.put("img", img);
            String sql = "SELECT * FROM imgvalues WHERE objectid = :objectid AND recid = :recid AND img = :img";
            List<ImgWorkModel> result = db.Query(con, sql,ImgWorkModel.class, params);
            if(result.size()==0) return false;
            else return true;
        }
        catch (Exception ex){
            throw ex;
        }
    }

    /**
     * Добавить изображение в таблицу imglock
     * @param imgLck
     * @return
     * @throws Exception
     */
    public int save(ImgLockModel imgLck) throws Exception{
        try (Connection con = db.getConnection(appName)){

            ImgLockModel oldImgLck = this.getimglock(imgLck);

            // проверка являеться ли код Base64 изображением png
            byte[] encodedBytes = Base64.getDecoder().decode(imgLck.getImg());
            InputStream is = new ByteArrayInputStream(encodedBytes);
            String mimeType = URLConnection.guessContentTypeFromStream(is);
            is.close();

            if(mimeType != "image/png") return -1;
            String sql = "";
            Map <String, Object> params = new HashMap<>();
            params.put("objectid", imgLck.getObjectid());
            params.put("recid", imgLck.getRecid());
            params.put("flagdel", imgLck.getFlagdel());
            params.put("flagchange", 1);
            params.put("img", imgLck.getImg());
            params.put("sesid", imgLck.getSesid());
            if(imgLck.getListparamid()==0) params.put("listparamid", null);
            else params.put("listparamid", imgLck.getListparamid());
            if(imgLck.getPeriodparamid()==0) params.put("periodparamid", null);
            else params.put("periodparamid", imgLck.getPeriodparamid());

            params.put("period_lock_id", imgLck.getPeriod_lock_id());
            //если нет картинки в таб. imglock
            if(oldImgLck.getId()==-1) {
                sql = "INSERT INTO imglock (objectid, recid, flagdel, flagchange, img, userid, sesid, \"listparamid\", \"periodparamid\", period_lock_id)"
                        + " VALUES( :objectid, :recid, :flagdel, :flagchange, :img," + "(SELECT id FROM users WHERE code=(select getusername())), CAST( :sesid AS uuid), :listparamid, :periodparamid, CAST(:period_lock_id AS integer)) RETURNING id";
                imgLck.setId(db.Execute(con, sql, Integer.class, params));
                return imgLck.getId();
            }
            else {
                params.put("id", oldImgLck.getId());
                sql = "UPDATE imglock SET objectid=:objectid, recid=:recid, flagdel=:flagdel, flagchange=:flagchange, img=:img, userid=(SELECT id FROM users WHERE code=(select getusername())), sesid = CAST( :sesid AS uuid), listparamid = :listparamid, periodparamid = :periodparamid, period_lock_id = CAST(:period_lock_id AS integer) WHERE id= :id";
                db.Execute(con, sql, params);
                return oldImgLck.getId();
            }

        }
        catch (Exception ex){
            throw ex;
        }
    }

    /**
     * Получить изображение из imgvalue, если нет -1
     * @param objectid
     * @param recid
     * @return
     * @throws Exception
     */
    public ImgWorkModel getimgvalue(int objectid, int recid) throws Exception{
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            params.put("objectid", objectid);
            params.put("recid", recid);
            String sql = "SELECT * FROM imgvalues WHERE objectid = :objectid AND recid = :recid";
            List<ImgWorkModel> result = db.Query(con, sql, ImgWorkModel.class, params);
            if(result.size()==0){
                ImgWorkModel tempimgWork = new ImgWorkModel();
                tempimgWork.setId(-1);
                return tempimgWork;
            }
            else
            {
                return result.get(0);
            }

        }catch (Exception ex){
            throw ex;
        }
    }

    /**
    * Удаление изображения из временной таблицы
     */
    public String delete (ImgLockModel imgdl) throws Exception{
        try(Connection con = db.getConnection(appName)) {
                Map<String, Object> params = new HashMap<>();
                params.put("id", imgdl.getId());
                //Так как есть ограничение внешнего ключа periodlock-->imglock
                String sq = "SELECT COUNT(*) cnt FROM periodlock WHERE imglockid = :id";
                if(db.Query(con, sq, Integer.class, params).get(0) > 0 ){
                    sq = "UPDATE periodlock SET imglockid=NULL WHERE imglockid = :id";
                    db.Execute(con, sq, params);
                }
                params.put("sesid", imgdl.getSesid());
                String sql = "DELETE FROM imglock WHERE id=:id AND sesid = CAST( :sesid AS uuid )";
                db.Execute(con, sql, params);
                return "";
        }
        catch (Exception ex){
            throw ex;
        }
    }
}