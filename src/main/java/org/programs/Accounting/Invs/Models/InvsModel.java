package org.kaznalnrprograms.Accounting.Invs.Models;

public class InvsModel {
    private int id;
    private String name;
    private String order_numb;
    private String date_begin;
    private String date_end;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOrder_numb() {
        return order_numb;
    }

    public void setOrder_numb(String order_numb) {
        this.order_numb = order_numb;
    }

    public String getDate_begin() {
        return date_begin;
    }

    public void setDate_begin(String date_begin) {
        this.date_begin = date_begin;
    }

    public String getDate_end() {
        return date_end;
    }

    public void setDate_end(String date_end) {
        this.date_end = date_end;
    }
}
