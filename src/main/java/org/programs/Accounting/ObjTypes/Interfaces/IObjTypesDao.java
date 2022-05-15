package org.kaznalnrprograms.Accounting.ObjTypes.Interfaces;
import org.kaznalnrprograms.Accounting.ObjTypes.Models.ObjTypesModel;
import org.kaznalnrprograms.Accounting.ObjTypes.Models.ObjTypesViewModel;

import java.util.List;

public interface IObjTypesDao {
    /**
     * Получить список
     * @param showDel - флаг отображения удалёных записей
     * @return
     * @throws Exception
     */
    List<ObjTypesViewModel> list(boolean showDel) throws Exception;
    /**
     * Функция получения записи для просмотра/изменения
     * @param id - идентификатор
     * @return
     * @throws Exception
     */
    ObjTypesModel get(int id) throws Exception;
    /**
     * Проверить существование наименования
     * @param id - идентификатьор  (для новых -1)
     * @param name - наименование
     * @return
     * @throws Exception
     */
    boolean exists(int id, String name) throws Exception;
    /**
     * Добавить/ Изменить
     * @param objtypes - модель
     * @return
     * @throws Exception
     */
    int save(ObjTypesModel objtypes) throws Exception;
    /**
     * Удаление
     * @param id - идентификатор
     * @throws Exception
     */
    void delete(int id) throws Exception;
}
