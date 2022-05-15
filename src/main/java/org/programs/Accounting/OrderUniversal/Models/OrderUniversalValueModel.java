package org.kaznalnrprograms.Accounting.OrderUniversal.Models;

public class OrderUniversalValueModel {
    private int objectid;
    private int paramid;
    private String paramcode;
    private String taskcode;
    private String paramname;
    private int paramnom;
    private int paramstrict;
    private String paramreffermodul;
    private String paramrefferfunc;
    private String paramreffertable;
    private String paramreffercode;
    private Integer valueid;
    private Integer valueownerid;
    private String valueval;
    private String valuename;
    private OrderUniversalImgLockModel imglock;
    private String imgvalueid;
    private String dateval;
    private String codejs;

    public OrderUniversalValueModel() {
        imgvalueid = "";
    }

    public String getCodejs() {
        return codejs;
    }

    public void setCodejs(String codejs) {
        this.codejs = codejs;
    }

    public int getObjectid() {
        return objectid;
    }

    public void setObjectid(int objectid) {
        this.objectid = objectid;
    }

    public int getParamid() {
        return paramid;
    }

    public void setParamid(int paramid) {
        this.paramid = paramid;
    }

    public String getParamcode() {
        return paramcode;
    }

    public void setParamcode(String paramcode) {
        this.paramcode = paramcode;
    }

    public String getTaskcode() {
        return taskcode;
    }

    public void setTaskcode(String taskcode) {
        this.taskcode = taskcode;
    }

    public String getParamname() {
        return paramname;
    }

    public void setParamname(String paramname) {
        this.paramname = paramname;
    }

    public int getParamnom() {
        return paramnom;
    }

    public void setParamnom(int paramnom) {
        this.paramnom = paramnom;
    }

    public int getParamstrict() {
        return paramstrict;
    }

    public void setParamstrict(int paramstrict) {
        this.paramstrict = paramstrict;
    }

    public String getParamreffermodul() {
        return paramreffermodul;
    }

    public void setParamreffermodul(String paramreffermodul) {
        this.paramreffermodul = paramreffermodul;
    }

    public String getParamrefferfunc() {
        return paramrefferfunc;
    }

    public void setParamrefferfunc(String paramrefferfunc) {
        this.paramrefferfunc = paramrefferfunc;
    }

    public String getParamreffertable() {
        return paramreffertable;
    }

    public void setParamreffertable(String paramreffertable) {
        this.paramreffertable = paramreffertable;
    }

    public String getParamreffercode() {
        return paramreffercode;
    }

    public void setParamreffercode(String paramreffercode) {
        this.paramreffercode = paramreffercode;
    }

    public Integer getValueid() {
        return valueid;
    }

    public void setValueid(Integer valueid) {
        this.valueid = valueid;
    }

    public Integer getValueownerid() {
        return valueownerid;
    }

    public void setValueownerid(Integer valueownerid) {
        this.valueownerid = valueownerid;
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

    public OrderUniversalImgLockModel getImglock() {
        return imglock;
    }

    public void setImglock(OrderUniversalImgLockModel imglock) {
        this.imglock = imglock;
    }

    public String getImgvalueid() {
        return imgvalueid;
    }

    public void setImgvalueid(String imgvalueid) {
        this.imgvalueid = imgvalueid;
    }

    public String getDateval() {
        return dateval;
    }

    public void setDateval(String dateval) {
        this.dateval = dateval;
    }
}
