package org.kaznalnrprograms.Accounting.jrInvCard;


import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.kaznalnrprograms.Accounting.jrInvCard.Models.jrInvCardModel;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.Map;

@Repository
public class jrInvCardImpl implements IjrInvCardDao {
    private String appName = "отчет - Инвентарная карточка НМА";
    private DBUtils db;

    public jrInvCardImpl(DBUtils db){
        this.db = db;
    }

    /**
     * Получить обьект по id
     * @param id - id обьекта
     * @return - строка с данными обьекта
     * @throws Exception
     */
    public jrInvCardModel getObj(int id) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("id",id);

            String sql = "select o.id, o.id || ' = ' || o.invno || ' : ' || o.name as name, a.code as accCode \n" +
                    "from objs o\n" +
                    "join inv_grp_accs iga on iga.id=o.inv_grp_acc_id\n" +
                    "join accs a on a.id=iga.acc_id\n" +
                    "where o.id=:id";

            return db.Query(con, sql, jrInvCardModel.class, params).get(0);
        }
        catch(Exception ex) {
            throw ex;
        }
    }
}
