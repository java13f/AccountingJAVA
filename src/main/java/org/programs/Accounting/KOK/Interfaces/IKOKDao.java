package org.kaznalnrprograms.Accounting.KOK.Interfaces;

import org.kaznalnrprograms.Accounting.KOK.Models.KOKModel;
import org.kaznalnrprograms.Accounting.KOK.Models.KOKViewModel;

import java.util.List;

public interface IKOKDao {
    /**
     * Получить список казначейств
     * @param showDel - флаг отображения удалённых записей
     */
    List<KOKViewModel> List(boolean showDel) throws Exception;

    /**
     * Получить код органа казначейства
     * @param id - идентификатор кода органа казначейства
     */
    KOKModel Get(int id) throws Exception;

    /**
     * Проверить существование казначейства в базе данных
     * @param id - идентификатор казначейства (для новых -1)
     * @param code - код органа казначейства
     */
    boolean Exists(int id, String code) throws Exception;

    /**
     * Добавить/Изменить орган казначейства
     * @param kok - модуль кода органа казначейства
     */
    int Save(KOKModel kok) throws Exception;

    /**
     * Удалить код органа казначейства
     * @param id - идентификатор кода органа казначейства
     */
    String Delete(int id) throws Exception;
}
