package org.kaznalnrprograms.Accounting.ImgWork.Models;

public class ImgLockModel {
    private int id;
    private int objectid;
    private int recid;
    private int flagdel;
    private int flagchange;
    private String img;
    private int userid;
    private String creator;
    private String created;
    private String changer;
    private String changed;
    private String sesid;
    private int listparamid;
    private int periodparamid;

    private int period_lock_id;
    public int getPeriod_lock_id() {
        return period_lock_id;
    }

    public void setPeriod_lock_id(int period_lock_id) {
        this.period_lock_id = period_lock_id;
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

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }

    public int getUserid() {
        return userid;
    }

    public void setUserid(int userid) {
        this.userid = userid;
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
