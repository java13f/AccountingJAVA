package org.kaznalnrprograms.Accounting.Orders.Models;

public class OrdersParamsValuesModel {
    private int paramid;
    private String paramcode;
    private String paramname;
    private String valueval;
    private String valuename;

    public String getParamcode() {
        return paramcode;
    }

    public void setParamcode(String paramcode) {
        this.paramcode = paramcode;
    }

    public int getParamid() {
        return paramid;
    }

    public void setParamid(int paramid) {
        this.paramid = paramid;
    }

    public String getParamname() {
        return paramname;
    }

    public void setParamname(String paramname) {
        this.paramname = paramname;
    }

    public String getValueval() {
        return valueval;
    }

    public void setValueval(String valueval) {
        this.valueval = valueval;
    }

    public String getValuename() {
        return valuename;
    }

    public void setValuename(String valuename) {
        this.valuename = valuename;
    }

    public String getValueDisplay() {
        if (valuename != null)
        {
            return valueval + " = " + valuename;
        }
        else
        {
            return valueval;
        }
    }
}
