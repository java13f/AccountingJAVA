package org.kaznalnrprograms.Accounting.LockTable.Interfaces;
import org.kaznalnrprograms.Accounting.LockTable.Models.LockDateModel;
import org.kaznalnrprograms.Accounting.LockTable.Models.LockTableModel;
import java.util.List;
public interface ILockTableDao {
    /**
     * Получить список
     * @param Filter - фильтр по коду терртиорий
     * @return
     * @throws Exception
     */
    List<LockTableModel> list(String Filter) throws Exception;

    /**
     * получение даты блокировки
     * @param id
     * @return
     * @throws Exception
     */
    LockDateModel getDate(String id) throws Exception;

    /**
     * разблокировка
     * @param id
     * @throws Exception
     */
    void unlock(String id) throws Exception;
}
