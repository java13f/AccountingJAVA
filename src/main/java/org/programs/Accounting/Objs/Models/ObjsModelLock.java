package org.kaznalnrprograms.Accounting.Objs.Models;

public class ObjsModelLock {

    private int fd;
    private int fc;
    private int rd;
    private String val;
    private String date;
    private int periodparamid;

    public int getFd() {
        return fd;
    }

    public void setFd(int fd) {
        this.fd = fd;
    }

    public int getFc() {
        return fc;
    }

    public void setFc(int fc) {
        this.fc = fc;
    }

    public int getRd() {
        return rd;
    }

    public void setRd(int rd) {
        this.rd = rd;
    }

    public String getVal() {
        return val;
    }

    public void setVal(String val) {
        this.val = val;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public int getPeriodparamid() {
        return periodparamid;
    }

    public void setPeriodparamid(int periodparamid) {
        this.periodparamid = periodparamid;
    }
}
