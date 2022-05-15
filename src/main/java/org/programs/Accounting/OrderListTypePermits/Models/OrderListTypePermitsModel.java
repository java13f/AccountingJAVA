package org.kaznalnrprograms.Accounting.OrderListTypePermits.Models;

public class OrderListTypePermitsModel {
    private int id;
    private int orderTypeId;
    private int listParamId;
    private int visible;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getOrderTypeId() {
        return orderTypeId;
    }

    public void setOrderTypeId(int orderTypeId) {
        this.orderTypeId = orderTypeId;
    }

    public int getListParamId() {
        return listParamId;
    }

    public void setListParamId(int listParamId) {
        this.listParamId = listParamId;
    }

    public int getVisible() {
        return visible;
    }

    public void setVisible(int visible) {
        this.visible = visible;
    }
}
