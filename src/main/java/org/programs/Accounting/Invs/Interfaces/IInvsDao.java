package org.kaznalnrprograms.Accounting.Invs.Interfaces;

import org.kaznalnrprograms.Accounting.Invs.Models.InvsCommisModelSave;
import org.kaznalnrprograms.Accounting.Invs.Models.InvsModel;
import org.kaznalnrprograms.Accounting.Invs.Models.InvsModelCommis;
import org.kaznalnrprograms.Accounting.Invs.Models.InvsModelSave;
import org.kaznalnrprograms.Accounting.ListTrans.Models.GetListTransModel;
import org.kaznalnrprograms.Accounting.ListTrans.Models.ListTransModel;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface IInvsDao {
    /**
     * Получение списка в верхний грид
     * @return
     * @throws Exception
     */
    List<InvsModel> List() throws Exception;

    /**
     * Получение списка в нижний грид
     * @return
     * @throws Exception
     */
    List<InvsModelCommis> getInvsCommisList(int id) throws Exception;

    String GetFio(int Id) throws Exception;
    boolean exists(int id,String name, String order_numb) throws Exception;
    /**
     * добавление-редактирование
     * @param obj
     * @return
     * @throws Exception
     */
    int save(@RequestBody InvsModelSave obj) throws Exception;
    InvsModelSave get(int id) throws Exception;
    String GetNameFio(int id) throws Exception;
    void delete(int id) throws Exception;
    void delete_commis(int id) throws Exception;
    int save_commis(@RequestBody InvsCommisModelSave obj) throws Exception;
    boolean exists_commis(int id, int user_id , int invs_id) throws Exception;
    InvsCommisModelSave get_commis(int id) throws Exception;
}
