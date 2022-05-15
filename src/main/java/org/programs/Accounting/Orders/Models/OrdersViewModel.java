package org.kaznalnrprograms.Accounting.Orders.Models;

import java.util.ArrayList;
import java.util.List;

public class OrdersViewModel {
    private int id;
    private String date;
    private String no;
    private int ordertypeid;
    private String ordertypecode;
    private String ordertype;
    private String invno;
    private String name;
    private String initusername;
    private String workusername;
    private String stts;
    private String codejs;

    private List<OrdersParamsValuesModel> listValues;
    private List<OrdersParamsValuesModel> periodValues;

    private int lparamid = -1;
    private String lparamcode;
    private String lparamname;
    private String lvalueval;
    private String lvaluename;

    private int pparamid = -1;
    private String pparamcode;
    private String pparamname;
    private String pvalueval;
    private String pvaluename;

    public String getCodejs() {
        return codejs;
    }

    public void setCodejs(String codejs) {
        this.codejs = codejs;
    }

    public int getOrdertypeid() {
        return ordertypeid;
    }

    public void setOrdertypeid(int ordertypeid) {
        this.ordertypeid = ordertypeid;
    }

    public String getOrdertypecode() {
        return ordertypecode;
    }

    public void setOrdertypecode(String ordertypecode) {
        this.ordertypecode = ordertypecode;
    }

    public int getLparamid() {
        return lparamid;
    }

    public void setLparamid(int lparamid) {
        this.lparamid = lparamid;
    }

    public String getLparamcode() {
        return lparamcode;
    }

    public void setLparamcode(String lparamcode) {
        this.lparamcode = lparamcode;
    }

    public String getLparamname() {
        return lparamname;
    }

    public void setLparamname(String lparamname) {
        this.lparamname = lparamname;
    }

    public String getLvalueval() {
        return lvalueval;
    }

    public void setLvalueval(String lvalueval) {
        this.lvalueval = lvalueval;
    }

    public String getLvaluename() {
        return lvaluename;
    }

    public void setLvaluename(String lvaluename) {
        this.lvaluename = lvaluename;
    }

    public int getPparamid() {
        return pparamid;
    }

    public void setPparamid(int pparamid) {
        this.pparamid = pparamid;
    }

    public String getPparamcode() {
        return pparamcode;
    }

    public void setPparamcode(String pparamcode) {
        this.pparamcode = pparamcode;
    }

    public String getPparamname() {
        return pparamname;
    }

    public void setPparamname(String pparamname) {
        this.pparamname = pparamname;
    }

    public String getPvalueval() {
        return pvalueval;
    }

    public void setPvalueval(String pvalueval) {
        this.pvalueval = pvalueval;
    }

    public String getPvaluename() {
        return pvaluename;
    }

    public void setPvaluename(String pvaluename) {
        this.pvaluename = pvaluename;
    }

    public List<OrdersParamsValuesModel> getListValues() {
        return listValues;
    }

    public void setListValues(List<OrdersParamsValuesModel> listValues) {
        this.listValues = listValues;
    }

    public void addToListValues(OrdersParamsValuesModel model) {
        if (this.listValues == null) {
            this.listValues = new ArrayList<>();
        }
        this.listValues.add(model);
    }

    public List<OrdersParamsValuesModel> getPeriodValues() {
        return periodValues;
    }

    public void setPeriodValues(List<OrdersParamsValuesModel> periodValues) {
        this.periodValues = periodValues;
    }

    public void addToPeriodValues(OrdersParamsValuesModel model) {
        if (this.periodValues == null) {
            this.periodValues = new ArrayList<>();
        }
        this.periodValues.add(model);
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getNo() {
        return no;
    }

    public void setNo(String no) {
        this.no = no;
    }

    public String getOrdertype() {
        return ordertype;
    }

    public void setOrdertype(String ordertype) {
        this.ordertype = ordertype;
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

    public String getInitusername() {
        return initusername;
    }

    public void setInitusername(String initusername) {
        this.initusername = initusername;
    }

    public String getWorkusername() {
        return workusername;
    }

    public void setWorkusername(String workusername) {
        this.workusername = workusername;
    }

    public String getStts() {
        return stts;
    }

    public void setStts(String stts) {
        this.stts = stts;
    }
}
