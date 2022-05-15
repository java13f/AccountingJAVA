package org.kaznalnrprograms.Accounting.OrderMov.Models;

public class OrderMovGridModel {
    private int objid;
    private String invno;
    private String name;
    private int orderid;

    public String getInvno() {
        return invno;
    }

    public void setInvno(String invno) {
        this.invno = invno;
    }

    public int getObjid() {
        return objid;
    }

    public void setObjid(int objid) {
        this.objid = objid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getOrderid() {
        return orderid;
    }

    public void setOrderid(int orderid) {
        this.orderid = orderid;
    }
}
