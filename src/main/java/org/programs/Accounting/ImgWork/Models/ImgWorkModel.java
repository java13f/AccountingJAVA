package org.kaznalnrprograms.Accounting.ImgWork.Models;

public class ImgWorkModel {

    private int id;
    private int objectid;
    private int recid;
    private int flagdel;
    private int flagchange;
    private String img;
    private String  creator;
    private String  created;
    private String  changer;
    private String  changed;

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
}
