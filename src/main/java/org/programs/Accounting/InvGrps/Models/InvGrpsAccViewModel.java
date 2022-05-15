package org.kaznalnrprograms.Accounting.InvGrps.Models;

public class InvGrpsAccViewModel {
    private int id;
    private String name;
    private String code;
    private String perc;
    private String tag;
    private int del;

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

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public int getDel() {
        return del;
    }

    public void setDel(int del) {
        this.del = del;
    }

    public String getPerc() {
        return perc;
    }

    public void setPerc(String perc) {
        this.perc = perc;
    }
}
