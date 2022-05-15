package org.kaznalnrprograms.Accounting.InvGrps.Models;

public class InvGrpsAccModel {
    private int id;
    private String name;
    private String code;
    private String perc;
    private String tag;

    private int accId;
    private int invGrpId;

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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public int getDel() {
        return del;
    }

    public void setDel(int del) {
        this.del = del;
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

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public int getAccId() {
        return accId;
    }

    public void setAccId(int accId) {
        this.accId = accId;
    }

    public int getInvGrpId() {
        return invGrpId;
    }

    public void setInvGrpId(int invGrpId) {
        this.invGrpId = invGrpId;
    }

    public String getPerc() {
        return perc;
    }

    public void setPerc(String perc) {
        this.perc = perc;
    }
}
