package org.kaznalnrprograms.Accounting.Orders.Models;

public class OrdersParamsModel {
    private int id;
    private String paramcode;
    private String paramname;
    private String tablename;
    private String reffermodul;
    private String refferfunc;
    private String reffertable;
    private String taskcode;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getParamcode() {
        return paramcode;
    }

    public void setParamcode(String paramcode) {
        this.paramcode = paramcode;
    }

    public String getParamname() {
        return paramname;
    }

    public void setParamname(String paramname) {
        this.paramname = paramname;
    }

    public String getTablename() {
        return tablename;
    }

    public void setTablename(String tablename) {
        this.tablename = tablename;
    }

    public String getReffermodul() {
        return reffermodul;
    }

    public void setReffermodul(String reffermodul) {
        this.reffermodul = reffermodul;
    }

    public String getRefferfunc() {
        return refferfunc;
    }

    public void setRefferfunc(String refferfunc) {
        this.refferfunc = refferfunc;
    }

    public String getReffertable() {
        return reffertable;
    }

    public void setReffertable(String reffertable) {
        this.reffertable = reffertable;
    }

    public String getTaskcode() {
        return taskcode;
    }

    public void setTaskcode(String taskcode) {
        this.taskcode = taskcode;
    }
}
