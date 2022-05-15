package org.kaznalnrprograms.Accounting.Filters.Interfaces;

import org.kaznalnrprograms.Accounting.Filters.Models.FilterParamModel;

import java.util.List;

public interface IFiltersDao {
    /**
     * Получить значения фильтра
     * @param code код фильтра
     * @return
     * @throws Exception
     */
    List<FilterParamModel> GetValues(String code) throws Exception;

    /**
     * Сохранение настроек фильтра
     * @param code код фильтра
     * @param values значения параметров фильтра, которые необходимо создать или изменить
     * @throws Exception
     */
    void SetValues(String code, List<FilterParamModel> values) throws Exception;

    /**
     * Уудалить фильтр
     * @param code код фильтра
     * @throws Exception
     */
    void DeleteFilter(String code) throws Exception;

    /**
     * Удаление параметров фильтра
     * @param code код фильтра
     * @param keys параметры фильтра
     * @throws Exception
     */
    void DeleteParamsInFilter(String code, List<String> keys) throws Exception;
}
