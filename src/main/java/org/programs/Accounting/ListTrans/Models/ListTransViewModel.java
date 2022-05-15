package org.kaznalnrprograms.Accounting.ListTrans.Models;

public class ListTransViewModel {
    private int id;
    private String number;
    private String data;
    private String type;
    private String inv;
    private String objname;
    private String liname;
    private String values;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getInv() {
        return inv;
    }

    public void setInv(String inv) {
        this.inv = inv;
    }

    public String getObjname() {
        return objname;
    }

    public void setObjname(String objname) {
        this.objname = objname;
    }

    public String getLiname() {
        return liname;
    }

    public void setLiname(String liname) {
        this.liname = liname;
    }

    public String getValues() {
        return values;
    }

    public void setValues(String values) {
        this.values = values;
    }
}
