package org.kaznalnrprograms.Accounting.OrderListTypePermits.Models;

public class OrderListTypePermitsViewModel {
    private Integer id;
    private String listParamId;
    private String orderTypeId;
    private String visible;

    private String creator;
    private String created;
    private String changer;
    private String changed;

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

    public String getOrderTypeId() {
        return orderTypeId;
    }

    public void setOrderTypeId(String orderTypeId) {
        this.orderTypeId = orderTypeId;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getListParamId() {
        return listParamId;
    }

    public void setListParamId(String listParamId) {
        this.listParamId = listParamId;
    }

    public String getVisible() {
        return visible;
    }

    public void setVisible(String visible) {
        this.visible = visible;
    }
}
