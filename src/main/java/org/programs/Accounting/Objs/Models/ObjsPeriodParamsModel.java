package org.kaznalnrprograms.Accounting.Objs.Models;

public class ObjsPeriodParamsModel {
    private int id;
    private String paramcode;
    private String name;
    private String strict;
    private String refferfunc;
    private String reffertable;
    private String val;

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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStrict() {
        return strict;
    }

    public void setStrict(String strict) {
        this.strict = strict;
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

    public String getVal() {
        return val;
    }

    public void setVal(String val) {
        this.val = val;
    }
}
