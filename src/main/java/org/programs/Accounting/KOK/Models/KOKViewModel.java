package org.kaznalnrprograms.Accounting.KOK.Models;

public class KOKViewModel {
    private int id;
    private String code;
    private String name;
    private String director;
    private String accountant;
    private String state_code;
    private int del;

    public String getState_code() {
        return state_code;
    }

    public void setState_code(String state_code) {
        this.state_code = state_code;
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

    public String getDirector() {
        return director;
    }

    public void setDirector(String director) {
        this.director = director;
    }

    public String getAccountant() {
        return accountant;
    }

    public void setAccountant(String accountant) {
        this.accountant = accountant;
    }

    public int getDel() {
        return del;
    }

    public void setDel(int del) {
        this.del = del;
    }
}
