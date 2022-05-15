package org.kaznalnrprograms.Accounting.Deps.Models;

public class DepsViewModel {
    private int id;
    private String maindep;
    private String code;
    private String name;
    private String bossUserName;
    private String kterName;
    private int del;

    public String getMaindep() {
        return maindep;
    }

    public void setMaindep(String maindep) {
        this.maindep = maindep;
    }

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

    public String getBossUserName() {
        return bossUserName;
    }

    public void setBossUserName(String bossUserName) {
        this.bossUserName = bossUserName;
    }

    public String getKterName() {
        return kterName;
    }

    public void setKterName(String kterName) {
        this.kterName = kterName;
    }

    public int getDel() {
        return del;
    }

    public void setDel(int del) {
        this.del = del;
    }
}
