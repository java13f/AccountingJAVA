package org.kaznalnrprograms.Accounting.ListTrans.Interfaces;
import org.kaznalnrprograms.Accounting.ListTrans.Models.GetListTransModel;
import org.kaznalnrprograms.Accounting.ListTrans.Models.ListParamsModels;
import org.kaznalnrprograms.Accounting.ListTrans.Models.ListTransModel;
import org.kaznalnrprograms.Accounting.ListTrans.Models.ListTransViewModel;

import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface IListTransDao {
    /**
     * получение списка записей
     * @return
     * @throws Exception
     */
    List<ListTransViewModel> list() throws Exception;

    /**
     * загрузка ComboBox
     * @return
     * @throws Exception
     */
    List<ListParamsModels> GetListParams() throws Exception;

    /**
     * обработка значений в Combobox
     * @param id
     * @return
     * @throws Exception
     */
    String GetReffers(int id) throws Exception;

    /**
     * добавление-редактирование
     * @param obj
     * @return
     * @throws Exception
     */
    int save(@RequestBody ListTransModel obj) throws Exception;

    /**
     * получение значения заявки
     * @param id
     * @return
     * @throws Exception
     */
    String getOrders(String id) throws Exception;

    /**
     * получение списка значекний при открытии на редактирование
     * @param id
     * @return
     * @throws Exception
     */
    GetListTransModel get(int id) throws Exception;

    /**
     * проверка на уникальность
     * @param id
     * @param order
     * @param params
     * @return
     * @throws Exception
     */
    boolean exists(int id, int order,String params) throws Exception;

    /**
     * удаление
     * @param id
     * @throws Exception
     */
    void delete(int id) throws Exception;

    /**
     * получение значения
     * @param id
     * @param name
     * @return
     * @throws Exception
     */
    String getValuesText(int id , String name) throws Exception;
  

}
