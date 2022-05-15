package org.kaznalnrprograms.Accounting.LockService.Interfaces;

public interface ILockServiceDao {
    /**
     * Проверить сосояние блокировки записи
     * @param table - имя таблицы базы данных
     * @param recId - идентификатор записи
     * @return - если запись заблокирована возвращает сообщение о том, что запись заблокирована, а иначе возвращает пустую строку
     */
    String StateLockRecord(String table, Integer recId) throws Exception;
    /**
     * Накладывает блокировку на запись
     * @param table - имя таблицы базы данных
     * @param recId - идентификатор записи
     * @return - если запись заблокирована возвращает сообщение о том, что запись заблокирована, а иначе возвращает пустую строку
     */
    String LockRecord(String table, Integer recId) throws Exception;

    /**
     * Обновляет блокировку на записи
     * @param table - имя таблицы базы данных
     * @param recId - идентификатор записи
     */
    void UpdateLock(String table, Integer recId) throws Exception;
    /**
     * Удаляет блокировку
     * @param table - имя таблицы базы данных
     * @param recId - идентификатор записи
     */
    void FreeLockRecord(String table, Integer recId) throws Exception;
}
