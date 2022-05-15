/**
 * Объект, который передается построителю отчетов
 */
export class RepParams {
    /**
     * @param jrxml - имя отчета (без расширения)
     * @param beans - массив парамтров
     */
    constructor(jrxml, params) {
        this.jrxml=jrxml;
        this.params=params;
    }
}
