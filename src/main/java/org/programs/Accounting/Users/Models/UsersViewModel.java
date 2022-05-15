package org.kaznalnrprograms.Accounting.Users.Models;

public class UsersViewModel {
    private int id;
    private String code;
    private String name;
    private String kterName;
    private int del;

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
