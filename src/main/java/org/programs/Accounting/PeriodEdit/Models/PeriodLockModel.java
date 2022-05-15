package org.kaznalnrprograms.Accounting.PeriodEdit.Models;

public class PeriodLockModel {
    private int Id;
    private String SesId;
    private int ObjectId;
    private int RecId;
    private String Fdate;
    private String Val;
    private String Name;
    private int FlagDel;
    private int FlagChange;
    private int UserId;
    private int ImgLockId;
    private int PeriodParamId;
    private String Creator;
    private String Created;
    private String Changer;
    private String Changed;
    private boolean flagPreImg;

    public boolean isFlagPreImg() {
        return flagPreImg;
    }

    public void setFlagPreImg(boolean flagPreImg) {
        this.flagPreImg = flagPreImg;
    }

    public int getId() {
        return Id;
    }

    public void setId(int id) {
        Id = id;
    }

    public String getSesId() {
        return SesId;
    }

    public void setSesId(String sesId) {
        SesId = sesId;
    }

    public int getObjectId() {
        return ObjectId;
    }

    public void setObjectId(int objectId) {
        ObjectId = objectId;
    }

    public int getRecId() {
        return RecId;
    }

    public void setRecId(int recId) {
        RecId = recId;
    }

    public String getFdate() {
        return Fdate;
    }

    public void setFdate(String fdate) {
        Fdate = fdate;
    }

    public String getVal() {
        return Val;
    }

    public void setVal(String val) {
        Val = val;
    }

    public String getName() {
        return Name;
    }

    public void setName(String name) {
        Name = name;
    }

    public int getFlagDel() {
        return FlagDel;
    }

    public void setFlagDel(int flagDel) {
        FlagDel = flagDel;
    }

    public int getFlagChange() {
        return FlagChange;
    }

    public void setFlagChange(int flagChange) {
        FlagChange = flagChange;
    }

    public int getUserId() {
        return UserId;
    }

    public void setUserId(int userId) {
        UserId = userId;
    }

    public int getImgLockId() {
        return ImgLockId;
    }

    public void setImgLockId(int imgLockId) {
        ImgLockId = imgLockId;
    }

    public int getPeriodParamId() {
        return PeriodParamId;
    }

    public void setPeriodParamId(int periodParamId) {
        PeriodParamId = periodParamId;
    }

    public String getCreator() {
        return Creator;
    }

    public void setCreator(String creator) {
        Creator = creator;
    }

    public String getCreated() {
        return Created;
    }

    public void setCreated(String created) {
        Created = created;
    }

    public String getChanger() {
        return Changer;
    }

    public void setChanger(String changer) {
        Changer = changer;
    }

    public String getChanged() {
        return Changed;
    }

    public void setChanged(String changed) {
        Changed = changed;
    }
}
