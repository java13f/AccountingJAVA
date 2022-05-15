package org.kaznalnrprograms.Accounting.SttsOrder.Models;

public class SttsOrderTransferModel {
    private boolean isEmpty;
    private int groupFromId;
    private int groupToId;
    private int orderTypeFromId;
    private int orderTypeToId;

    public boolean isEmpty() {
        return isEmpty;
    }

    public void setEmpty(boolean empty) {
        isEmpty = empty;
    }

    public int getGroupFromId() {
        return groupFromId;
    }

    public void setGroupFromId(int groupFromId) {
        this.groupFromId = groupFromId;
    }

    public int getGroupToId() {
        return groupToId;
    }

    public void setGroupToId(int groupToId) {
        this.groupToId = groupToId;
    }

    public int getOrderTypeFromId() {
        return orderTypeFromId;
    }

    public void setOrderTypeFromId(int orderTypeFromId) {
        this.orderTypeFromId = orderTypeFromId;
    }

    public int getOrderTypeToId() {
        return orderTypeToId;
    }

    public void setOrderTypeToId(int orderTypeToId) {
        this.orderTypeToId = orderTypeToId;
    }
}
