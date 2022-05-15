package org.kaznalnrprograms.Accounting.OrderUniversal.Models;

public class OrderUniversalUserModel {
    private int id;
    private String name;

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
}
