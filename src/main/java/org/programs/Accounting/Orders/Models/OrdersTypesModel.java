package org.kaznalnrprograms.Accounting.Orders.Models;

public class OrdersTypesModel {
    private int id;
    private String name;
    private String code;
    private String codejs;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCodejs() {
        return codejs;
    }

    public void setCodejs(String codejs) {
        this.codejs = codejs;
    }
}
