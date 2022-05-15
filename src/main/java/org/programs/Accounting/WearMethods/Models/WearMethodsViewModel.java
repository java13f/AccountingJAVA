package org.kaznalnrprograms.Accounting.WearMethods.Models;

public class WearMethodsViewModel {
    private int id;
    private String perc;
    private String grName;
    private String accCode;
    private int del;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getPerc() {
        return perc;
    }

    public void setPerc(String perc) {
        this.perc = perc;
    }

    public String getGrName() {
        return grName;
    }

    public void setGrName(String grName) {
        this.grName = grName;
    }

    public String getAccCode() {
        return accCode;
    }

    public void setAccCode(String accCode) {
        this.accCode = accCode;
    }

    public int getDel() {
        return del;
    }

    public void setDel(int del) {
        this.del = del;
    }
}
