/**
 * Параметр отчета
 */
export class RepBean {
    /** @param bean - параметр отчета
    */
    constructor(bean) {
        this.name=bean.name;   // Имя парамтра
        this.type=bean.type;   // Тип параметра: int, date("dd.MM.yyyy"), double, string
        this.value=bean.value; // Значение параметра
    }
}

