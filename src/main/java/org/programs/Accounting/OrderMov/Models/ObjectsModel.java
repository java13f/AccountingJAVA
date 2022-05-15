package org.kaznalnrprograms.Accounting.OrderMov.Models;

public class ObjectsModel {
    private int objid;
    private String invno;
    private String name;
    private int orderid;
    private int changed;
    private int del;
    private int parent;
    private int lvidfrom;
    private int lvidto;
    private int lvowner;
    private String owner;

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public int getLvowner() {
        return lvowner;
    }

    public void setLvowner(int lvowner) {
        this.lvowner = lvowner;
    }

    public int getLvidfrom() {
        return lvidfrom;
    }

    public void setLvidfrom(int lvidfrom) {
        this.lvidfrom = lvidfrom;
    }

    public int getLvidto() {
        return lvidto;
    }

    public void setLvidto(int lvidto) {
        this.lvidto = lvidto;
    }

    public int getParent() {
        return parent;
    }

    public void setParent(int parent) {
        this.parent = parent;
    }

    public int getChanged() {
        return changed;
    }

    public void setChanged(int changed) {
        this.changed = changed;
    }

    public int getDel() {
        return del;
    }

    public void setDel(int del) {
        this.del = del;
    }

    public int getOrderid() {
        return orderid;
    }

    public void setOrderid(int orderid) {
        this.orderid = orderid;
    }

    public int getObjid() {
        return objid;
    }

    public void setObjid(int objid) {
        this.objid = objid;
    }

    public String getInvno() {
        return invno;
    }

    public void setInvno(String invno) {
        this.invno = invno;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
