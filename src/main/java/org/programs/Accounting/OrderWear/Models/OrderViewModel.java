package org.kaznalnrprograms.Accounting.OrderWear.Models;

import java.util.List;

public class OrderViewModel {
    private int id;
    private String no;
    private String date;
    private int initUserId;
    private int stts;
    private String create;
    private String change;
    private List<ObjsViewModel> objsList;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
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

    public int getInitUserId() {
        return initUserId;
    }

    public void setInitUserId(int initUserId) {
        this.initUserId = initUserId;
    }

    public int getStts() {
        return stts;
    }

    public void setStts(int stts) {
        this.stts = stts;
    }

    public List<ObjsViewModel> getObjsList() {
        return objsList;
    }

    public void setObjsList(List<ObjsViewModel> objsList) {
        this.objsList = objsList;
    }

    public String getCreate() {
        return create;
    }

    public void setCreate(String create) {
        this.create = create;
    }

    public String getChange() {
        return change;
    }

    public void setChange(String change) {
        this.change = change;
    }
}
