package org.kaznalnrprograms.Accounting.OrderMov.Models;

import java.util.List;

public class SaveModel {
    private int ordertypeid;
    private String ordertypecode;
    private String no;
    private String date;
    private int inituserid;
    private int stts;
    private String info;
    private int workuserid;
    private String changer;
    private String changed;
    private String creator;
    private String created;
    private String initusername;
    private String workusername;
    private String parent;
    private String fromroom;
    private String toroom;
    private String pvdate;
    private int sttschange;
    private String giveto;

    public String getOrdertypecode() {
        return ordertypecode;
    }

    public void setOrdertypecode(String ordertypecode) {
        this.ordertypecode = ordertypecode;
    }

    public String getGiveto() {
        return giveto;
    }

    public void setGiveto(String giveto) {
        this.giveto = giveto;
    }

    private List<ObjectsModel> objlist;

    public int getSttschange() {
        return sttschange;
    }

    public void setSttschange(int sttschange) {
        this.sttschange = sttschange;
    }

    public String getPvdate() {
        return pvdate;
    }

    public void setPvdate(String pvdate) {
        this.pvdate = pvdate;
    }

    public List<ObjectsModel> getObjlist() {
        return objlist;
    }

    public void setObjlist(List<ObjectsModel> objlist) {
        this.objlist = objlist;
    }

    public String getFromroom() {
        return fromroom;
    }

    public void setFromroom(String fromroom) {
        this.fromroom = fromroom;
    }

    public String getToroom() {
        return toroom;
    }

    public void setToroom(String toroom) {
        this.toroom = toroom;
    }


    public int getOrdertypeid() {
        return ordertypeid;
    }

    public void setOrdertypeid(int ordertypeid) {
        this.ordertypeid = ordertypeid;
    }

    public String getNo() {
        return no;
    }

    public void setNo(String no) {
        this.no = no;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public int getInituserid() {
        return inituserid;
    }

    public void setInituserid(int inituserid) {
        this.inituserid = inituserid;
    }

    public int getStts() {
        return stts;
    }

    public void setStts(int stts) {
        this.stts = stts;
    }

    public String getInfo() {
        return info;
    }

    public void setInfo(String info) {
        this.info = info;
    }

    public int getWorkuserid() {
        return workuserid;
    }

    public void setWorkuserid(int workuserid) {
        this.workuserid = workuserid;
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

    public String getInitusername() {
        return initusername;
    }

    public void setInitusername(String initusername) {
        this.initusername = initusername;
    }

    public String getWorkusername() {
        return workusername;
    }

    public void setWorkusername(String workusername) {
        this.workusername = workusername;
    }

    public String getParent() {
        return parent;
    }

    public void setParent(String parent) {
        this.parent = parent;
    }

}
