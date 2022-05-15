package org.kaznalnrprograms.Accounting.jrInvCard;


import org.kaznalnrprograms.Accounting.jrInvCard.Models.jrInvCardModel;

public interface IjrInvCardDao {
    /**
     * Получить обьект по id
     * @param id - id обьекта
     * @return - строка с данными обьекта
     * @throws Exception
     */
    jrInvCardModel getObj(int id) throws Exception;
}
