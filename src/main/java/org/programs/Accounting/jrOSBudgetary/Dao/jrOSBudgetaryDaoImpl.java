package org.kaznalnrprograms.Accounting.jrOSBudgetary.Dao;

import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.kaznalnrprograms.Accounting.jrOSBudgetary.Interfaces.IjrOSBudgetaryDao;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class jrOSBudgetaryDaoImpl implements IjrOSBudgetaryDao {

    private String appName = "jrOSBudgetary - карточка объекта(форма ОС-6)";
    private DBUtils db;

    public jrOSBudgetaryDaoImpl(DBUtils db) {
        this.db = db;
    }



    /**
     * Запрос для получения строки в формате id = name (универсальный)
     * @param id    - Идентификатор записи в таблице
     * @return
     * @throws Exception
     */
    @Override
    public String ObjName(int id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql =  "SELECT CASE WHEN  r.getobject_id IS NULL THEN -1 ELSE 1 END TableId FROM \n"+
                    "(SELECT getobject_id('objs')) r";
            List<String> result = db.Query(con, sql, String.class, null);
            if (Integer.parseInt(result.get(0)) != 1) {
                throw new Exception("Таблица с именем 'objs' не найдена");
            } else {
                String sql1 = "SELECT (ob.id || ' = ' || (CASE WHEN ob.invser ISNULL OR ob.invser = '' THEN ob.invno ELSE ob.invno || ' - ' || ob.invser END) || ' : ' || ob.name) as name\n"+
                        "FROM objs ob WHERE ob.id =  " + id;
                List<String> result1 = db.Query(con, sql1, String.class, null);
                if (result1.size() == 0) {
                    throw new Exception("Не найден тип объекта с ID = " + id);
                }
                return result1.get(0);
            }
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Проврека выбранного объекта на соответсвие счета
     * @param objId - Индентификатор объекта
     * @return
     * @throws Exception
     */
    @Override
    public int checkAccs(int objId) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT CASE WHEN ac.code = '113' THEN 0 ELSE 1 END res\n" +
                        " FROM objs o\n" +
                        " JOIN inv_grp_accs iga ON iga.id = o.inv_grp_acc_id\n" +
                        " JOIN accs ac ON ac.id = iga.acc_id\n" +
                        " WHERE o.id = " + objId;
            List<String> result = db.Query(con, sql, String.class, null);
            return Integer.parseInt(result.get(0));
        } catch (Exception ex) {
            throw ex;
        }
    }
}
