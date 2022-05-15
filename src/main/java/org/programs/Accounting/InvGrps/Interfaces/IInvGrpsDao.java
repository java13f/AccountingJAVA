package org.kaznalnrprograms.Accounting.InvGrps.Interfaces;

import org.kaznalnrprograms.Accounting.InvGrps.Models.*;

import java.util.List;

public interface IInvGrpsDao {
    /**
     * Получить список групп инв-го учета
     */
    List<InvGrpsAccViewModel> getGroupAccsList(boolean showDel, int invGrpsId) throws Exception; //list
    /**
     * Получить список счетов по группам
     */
    List<InvGrpsViewModel> getGroupsList(boolean showDel) throws Exception; //invGrpsList
    /**
     * Получить группу по id
     */
    InvGrpsModel getGroupById(int id) throws Exception;//getInvGrpsById
    /**
     * Получить счет по id
     */
    InvGrpsAccModel getGroupAccById(int id) throws Exception;//invGrpsAccById
    /**
     * Получить счет по коду и тэгу
     */
    InvGrpsAccModel getGroupAccByCodeAndTag(String code, String tag) throws Exception;//invGrpsAccByCodeAndTag
    /**
     * Удалить группу
     */
    void delGroup(int id) throws Exception;//delete
    /**
     * Удалить счет
     */
    void delAcc(int id) throws Exception;//deleteAcc
    /**
     * Сохранить счет
     */
    int saveGroupAcc(InvGrpsAccModel model) throws Exception;//save
    /**
     * Сохранить группу
     */
    int saveGroup(InvGrpsModel model) throws Exception;//saveInvGrps
    /**
     * Проверка на добавление существующей группы
     */
    boolean existsGroup(int id, String code) throws Exception;//exists
    /**
     * Проверка на добавление существующего счета в группе
     */
    boolean existsGroupAcc(int id, int accId, int invGrpId) throws Exception;//existsAcc
    /**
     * Получить счет по id
     */
    AccModelView getAccById(int id) throws Exception;//accById
}
