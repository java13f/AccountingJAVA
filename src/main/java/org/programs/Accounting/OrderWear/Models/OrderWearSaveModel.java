package org.kaznalnrprograms.Accounting.OrderWear.Models;

public class OrderWearSaveModel {
    private  int orderId;
    private  int objId;
    private  int del;
    private  String date;
    private  int stts;
    private  int initUserId;
    private  String no;
    private  int orderParentId;
    private String amount;
    private  int orderTypeId;

    public int getOrderId() {
        return orderId;
    }

    public void setOrderId(int orderId) {
        this.orderId = orderId;
    }

    public int getObjId() {
        return objId;
    }

    public void setObjId(int objId) {
        this.objId = objId;
    }

    public int getDel() {
        return del;
    }

    public void setDel(int del) {
        this.del = del;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public int getStts() {
        return stts;
    }

    public void setStts(int stts) {
        this.stts = stts;
    }

    public int getInitUserId() {
        return initUserId;
    }

    public void setInitUserId(int initUserId) {
        this.initUserId = initUserId;
    }

    public String getNo() {
        return no;
    }

    public void setNo(String no) {
        this.no = no;
    }

    public int getOrderParentId() {
        return orderParentId;
    }

    public void setOrderParentId(int orderParentId) {
        this.orderParentId = orderParentId;
    }

    public String getAmount() {
        return amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

    public int getOrderTypeId() {
        return orderTypeId;
    }

    public void setOrderTypeId(int orderTypeId) {
        this.orderTypeId = orderTypeId;
    }
}
