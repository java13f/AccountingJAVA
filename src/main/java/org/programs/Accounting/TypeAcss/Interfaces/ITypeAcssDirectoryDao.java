package org.kaznalnrprograms.Accounting.TypeAcss.Interfaces;

import org.kaznalnrprograms.Accounting.TypeAcss.Models.TypeAcssCmb;
import org.kaznalnrprograms.Accounting.TypeAcss.Models.TypeAcssModel;
import org.kaznalnrprograms.Accounting.TypeAcss.Models.TypeAcssViewModel;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

public interface ITypeAcssDirectoryDao {
    /**
     *
     * @param showDel - флаг видимости
     * @return
     * @throws Exception
     */
    List<TypeAcssViewModel> list (String filter) throws Exception;
    /**
     *
     * @param id - идентификатор таблицы type_acss
     * @return
     * @throws Exception
     */
    TypeAcssModel get(int id ) throws Exception;
    /**
     * Получить Id и название группы
     * @return
     * @throws Exception
     */
    List<TypeAcssCmb> LoadGroup() throws Exception;
    /***
     * Получить название группы объектов
     * @return
     * @throws Exception
     */
    List<TypeAcssCmb> LoadName() throws Exception;

    /**
     * Добавить изменить доступ к объектам в зависимости от их типов
     * @param tpAsMd
     * @return
     * @throws Exception
     */
    int save(TypeAcssModel tpAsMd) throws Exception;

    /**
     * Удалить запись
     * @param id
     * @return
     * @throws Exception
     */
    void delete(Integer id) throws Exception;


    /**
     * Добавить все типы объектов для данной группы
     * @param group
     * @throws Exception
     */
    void AddAllObj(Integer group) throws Exception;
}
