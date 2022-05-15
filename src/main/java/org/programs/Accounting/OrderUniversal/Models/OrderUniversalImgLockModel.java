package org.kaznalnrprograms.Accounting.OrderUniversal.Models;

public class OrderUniversalImgLockModel {
    private int id;
    private int objectid;
    private int recid;
    private int flagdel;
    private int flagchange;
    private int userid;
    private String sesid;
    private int listparamid;
    private int periodparamid;

    public OrderUniversalImgLockModel()
    {
        id = -1;
        objectid = -1;
        recid = -1;
        flagchange = -1;
        flagdel = -1;
        userid = -1;
        listparamid = -1;
        periodparamid = -1;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getObjectid() {
        return objectid;
    }

    public void setObjectid(int objectid) {
        this.objectid = objectid;
    }

    public int getRecid() {
        return recid;
    }

    public void setRecid(int recid) {
        this.recid = recid;
    }

    public int getFlagdel() {
        return flagdel;
    }

    public void setFlagdel(int flagdel) {
        this.flagdel = flagdel;
    }

    public int getFlagchange() {
        return flagchange;
    }

    public void setFlagchange(int flagchange) {
        this.flagchange = flagchange;
    }

    public int getUserid() {
        return userid;
    }

    public void setUserid(int userid) {
        this.userid = userid;
    }

    public String getSesid() {
        return sesid;
    }

    public void setSesid(String sesid) {
        this.sesid = sesid;
    }

    public int getListparamid() {
        return listparamid;
    }

    public void setListparamid(int listparamid) {
        this.listparamid = listparamid;
    }

    public int getPeriodparamid() {
        return periodparamid;
    }

    public void setPeriodparamid(int periodparamid) {
        this.periodparamid = periodparamid;
    }
}
