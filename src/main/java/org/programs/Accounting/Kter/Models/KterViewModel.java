package org.kaznalnrprograms.Accounting.Kter.Models;

public class KterViewModel {
    private int id;
    private String code;
    private String name;
    private String kokName;
    private String addr;
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

    public String getKokName() {
        return kokName;
    }

    public void setKokName(String kokName) {
        this.kokName = kokName;
    }

    public String getAddr() {
        return addr;
    }

    public void setAddr(String addr) {
        this.addr = addr;
    }

    public int getDel() {
        return del;
    }

    public void setDel(int del) {
        this.del = del;
    }
}
