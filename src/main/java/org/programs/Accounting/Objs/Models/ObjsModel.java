package org.kaznalnrprograms.Accounting.Objs.Models;

import java.util.List;

public class ObjsModel {

    private int id;
    private int accs;
    private int invGrps;
    private String invNo;
    private String invSer;
    private int objType;
    private String name;
    private String descr;
    private int typeFonds;
    private int kekr;
    private String strtAmount;
    private String dateBuy;
    private int units;
    private String info;
    private String creator;
    private String created;
    private String changer;
    private String changed;
    private String sesid;
    private int img;
    private int countObjs;

    private List<ObjsPeriodValuesModel> pvmodel;
    private List<ObjsListValuesModel> lvmodel;
    private List<ObjsModelDate> explmodel;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getAccs() {
        return accs;
    }

    public void setAccs(int accs) {
        this.accs = accs;
    }

    public int getInvGrps() {
        return invGrps;
    }

    public void setInvGrps(int invGrps) {
        this.invGrps = invGrps;
    }

    public String getInvNo() {
        return invNo;
    }

    public void setInvNo(String invNo) {
        this.invNo = invNo;
    }

    public String getInvSer() {
        return invSer;
    }

    public void setInvSer(String invSer) {
        this.invSer = invSer;
    }

    public int getObjType() {
        return objType;
    }

    public void setObjType(int objType) {
        this.objType = objType;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescr() {
        return descr;
    }

    public void setDescr(String descr) {
        this.descr = descr;
    }

    public int getTypeFonds() {
        return typeFonds;
    }

    public void setTypeFonds(int typeFonds) {
        this.typeFonds = typeFonds;
    }

    public int getKekr() {
        return kekr;
    }

    public void setKekr(int kekr) {
        this.kekr = kekr;
    }

    public String getStrtAmount() {
        return strtAmount;
    }

    public void setStrtAmount(String strtAmount) {
        this.strtAmount = strtAmount;
    }

    public String getDateBuy() {
        return dateBuy;
    }

    public void setDateBuy(String dateBuy) {
        this.dateBuy = dateBuy;
    }

    public int getUnits() {
        return units;
    }

    public void setUnits(int units) {
        this.units = units;
    }

    public String getInfo() {
        return info;
    }

    public void setInfo(String info) {
        this.info = info;
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

    public List<ObjsPeriodValuesModel> getPvmodel() {
        return pvmodel;
    }

    public void setPvmodel(List<ObjsPeriodValuesModel> pvmodel) {
        this.pvmodel = pvmodel;
    }

    public List<ObjsListValuesModel> getLvmodel() {
        return lvmodel;
    }

    public void setLvmodel(List<ObjsListValuesModel> lvmodel) {
        this.lvmodel = lvmodel;
    }

    public List<ObjsModelDate> getExplmodel() {
        return explmodel;
    }

    public void setExplmodel(List<ObjsModelDate> explmodel) {
        this.explmodel = explmodel;
    }

    public int getImg() {
        return img;
    }

    public void setImg(int img) {
        this.img = img;
    }

    public int getCountObjs() {
        return countObjs;
    }

    public void setCountObjs(int countObjs) {
        this.countObjs = countObjs;
    }
}
