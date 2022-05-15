package org.kaznalnrprograms.Accounting.OrderUniversal.Models;

import java.util.List;

public class OrderUniversalModel {
    private int id;
    private int ordertypeid;
    private String ordertypename;
    private String no;
    private String date;
    private int objid;
    private String objname;
    private int inituserid;
    private String initusername;
    private Integer workuserid;
    private String workusername;
    private String amount;
    private Integer problemid;
    private String problemname;
    private String probleminfo;
    private String workinfo;
    private String info;
    private int isdtclose;
    private String dateclose;
    private int stts;
    private Integer parentid;
    private List<OrderUniversalValueModel> listvalues;
    private List<OrderUniversalValueModel> periodvalues;
    private String creator;
    private String created;
    private String changer;
    private String changed;
    private String sesid;

    public OrderUniversalModel() {
        id = -1;
        ordertypeid = -1;
        objid = -1;
        inituserid = -1;
        date = "";
        amount = "0";
        stts = 0;
    }

    public int getIsdtclose() {
        return isdtclose;
    }

    public void setIsdtclose(int isdtclose) {
        this.isdtclose = isdtclose;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getOrdertypeid() {
        return ordertypeid;
    }

    public void setOrdertypeid(int ordertypeid) {
        this.ordertypeid = ordertypeid;
    }

    public String getOrdertypename() {
        return ordertypename;
    }

    public void setOrdertypename(String ordertypename) {
        this.ordertypename = ordertypename;
    }

    public String getNo() {
        return no;
    }

    public void setNo(String no) {
        this.no = no;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public int getObjid() {
        return objid;
    }

    public void setObjid(int objid) {
        this.objid = objid;
    }

    public String getObjname() {
        return objname;
    }

    public void setObjname(String objname) {
        this.objname = objname;
    }

    public int getInituserid() {
        return inituserid;
    }

    public void setInituserid(int inituserid) {
        this.inituserid = inituserid;
    }

    public String getInitusername() {
        return initusername;
    }

    public void setInitusername(String initusername) {
        this.initusername = initusername;
    }

    public Integer getWorkuserid() {
        return workuserid;
    }

    public void setWorkuserid(Integer workuserid) {
        this.workuserid = workuserid;
    }

    public String getWorkusername() {
        return workusername;
    }

    public void setWorkusername(String workusername) {
        this.workusername = workusername;
    }

    public String getAmount() {
        return amount;
    }

    public Integer getProblemid() {
        return problemid;
    }

    public void setProblemid(Integer problemid) {
        this.problemid = problemid;
    }

    public String getProblemname() {
        return problemname;
    }

    public void setProblemname(String problemname) {
        this.problemname = problemname;
    }

    public String getProbleminfo() {
        return probleminfo;
    }

    public void setProbleminfo(String probleminfo) {
        this.probleminfo = probleminfo;
    }

    public String getWorkinfo() {
        return workinfo;
    }

    public void setWorkinfo(String workinfo) {
        this.workinfo = workinfo;
    }

    public String getInfo() {
        return info;
    }

    public void setInfo(String info) {
        this.info = info;
    }

    public String getDateclose() {
        return dateclose;
    }

    public void setDateclose(String dateclose) {
        this.dateclose = dateclose;
    }

    public int getStts() {
        return stts;
    }

    public void setStts(int stts) {
        this.stts = stts;
    }

    public Integer getParentid() {
        return parentid;
    }

    public void setParentid(Integer parentid) {
        this.parentid = parentid;
    }

    public List<OrderUniversalValueModel> getListvalues() {
        return listvalues;
    }

    public void setListvalues(List<OrderUniversalValueModel> listvalues) {
        this.listvalues = listvalues;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

    public List<OrderUniversalValueModel> getPeriodvalues() {
        return periodvalues;
    }

    public void setPeriodvalues(List<OrderUniversalValueModel> periodvalues) {
        this.periodvalues = periodvalues;
    }

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

    public String getSesid() {
        return sesid;
    }

    public void setSesid(String sesid) {
        this.sesid = sesid;
    }
}
