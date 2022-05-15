package org.kaznalnrprograms.Accounting.Problems.Models;

public class ProblemsViewModel {

    private int id;
    private String name;
    private String obtypename;
    private  int del;

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

    public int getDel() {
        return del;
    }

    public void setDel(int del) {
        this.del = del;
    }

    public String getObtypename() { return obtypename; }

    public void setObtypename(String obtypename) { this.obtypename = obtypename; }
}
