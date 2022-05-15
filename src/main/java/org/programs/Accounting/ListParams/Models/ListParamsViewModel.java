package org.kaznalnrprograms.Accounting.ListParams.Models;

public class ListParamsViewModel {
    private int id;
    private int nom;
    private String taskcode;
    private String paramcode;
    private String name;
    private String reffercode;
    private int del;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getNom() {
        return nom;
    }

    public void setNom(int nom) {
        this.nom = nom;
    }

    public String getTaskcode() {
        return taskcode;
    }

    public void setTaskcode(String taskcode) {
        this.taskcode = taskcode;
    }

    public String getParamcode() {
        return paramcode;
    }

    public void setParamcode(String paramcode) {
        this.paramcode = paramcode;
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

    public String getReffercode() {
        return reffercode;
    }

    public void setReffercode(String reffercode) {
        this.reffercode = reffercode;
    }
}
