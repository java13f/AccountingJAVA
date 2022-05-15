package org.kaznalnrprograms.Accounting.WearMethods.Models;

public class WearMethodsModel {
    private int id;

    private int grId;
    private int accId;

    private String perc;
    private String grName;
    private String accName;

    private int del;

    private String creator;
    private String created;
    private String changer;
    private String changed;

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

    public int getGrId() {
        return grId;
    }

    public void setGrId(int grId) {
        this.grId = grId;
    }

    public int getAccId() {
        return accId;
    }

    public void setAccId(int accId) {
        this.accId = accId;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public String getCreated() {
        return created;
    }

    public void setCreated(String created) {
        this.created = created;
    }

    public String getChanger() {
        return changer;
    }

    public void setChanger(String changer) {
        this.changer = changer;
    }

    public String getChanged() {
        return changed;
    }

    public void setChanged(String changed) {
        this.changed = changed;
    }

    public String getGrName() {
        return grName;
    }

    public void setGrName(String grName) {
        this.grName = grName;
    }

    public String getAccName() {
        return accName;
    }

    public void setAccName(String accName) {
        this.accName = accName;
    }

    public int getDel() {
        return del;
    }

    public void setDel(int del) {
        this.del = del;
    }
}
