package org.kaznalnrprograms.Accounting.OrderUniversal.Models;

public class OrderUniversalOrderTypeModel {
    private int id;
    private String name;
    private String codejs;

    public String Display() {
        return id + " = " + name;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
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
