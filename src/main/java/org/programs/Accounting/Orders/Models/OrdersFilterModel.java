package org.kaznalnrprograms.Accounting.Orders.Models;

import java.sql.Timestamp;

public class OrdersFilterModel {
    private int isDtStart;
    private int isDtEnd;
    private String dtStart;
    private String dtEnd;
    private String no;
    private String invNo;
    private int type = -1;
    private String name;
    private String initUser;
    private String workUser;
    private int sttsNew;
    private int sttsPaused;
    private int sttsWork;
    private int sttsCompleted;
    private int sttsRejects;
    private int listParamId = -1;
    private String listParamVal;
    private String listParamValId;
    private String listParamValName;
    private int periodParamId = -1;
    private String periodParamVal;
    private String periodParamValId;
    private String periodParamValName;

    public String getListParamValDisplay() {
        if (this.listParamValName.isEmpty()) {
            return this.listParamVal;
        }
        else {
            return this.listParamValId + " = " + this.listParamValName;
        }
    }

    public String getPeriodParamValDisplay() {
        if (this.periodParamValName.isEmpty()) {
            return this.periodParamVal;
        }
        else {
            return this.periodParamValId + " = " + this.periodParamValName;
        }
    }


    public String getDtStart() {
        return dtStart;
    }

    public void setDtStart(String dtStart) {
        this.dtStart = dtStart;
    }

    public String getDtEnd() {
        return dtEnd;
    }

    public void setDtEnd(String dtEnd) {
        this.dtEnd = dtEnd;
    }

    public String getNo() {
        return no;
    }

    public void setNo(String no) {
        this.no = no;
    }

    public String getInvNo() {
        return invNo;
    }

    public void setInvNo(String invNo) {
        this.invNo = invNo;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getInitUser() {
        return initUser;
    }

    public void setInitUser(String initUser) {
        this.initUser = initUser;
    }

    public String getWorkUser() {
        return workUser;
    }

    public void setWorkUser(String workUser) {
        this.workUser = workUser;
    }

    public int getSttsNew() {
        return sttsNew;
    }

    public void setSttsNew(int sttsNew) {
        this.sttsNew = sttsNew;
    }

    public int getSttsPaused() {
        return sttsPaused;
    }

    public void setSttsPaused(int sttsPaused) {
        this.sttsPaused = sttsPaused;
    }

    public int getSttsWork() {
        return sttsWork;
    }

    public void setSttsWork(int sttsWork) {
        this.sttsWork = sttsWork;
    }

    public int getSttsCompleted() {
        return sttsCompleted;
    }

    public void setSttsCompleted(int sttsCompleted) {
        this.sttsCompleted = sttsCompleted;
    }

    public int getSttsRejects() {
        return sttsRejects;
    }

    public void setSttsRejects(int sttsRejects) {
        this.sttsRejects = sttsRejects;
    }

    public int getListParamId() {
        return listParamId;
    }

    public void setListParamId(int listParamId) {
        this.listParamId = listParamId;
    }

    public String getListParamVal() {
        return listParamVal;
    }

    public void setListParamVal(String listParamVal) {
        this.listParamVal = listParamVal;
    }

    public int getPeriodParamId() {
        return periodParamId;
    }

    public void setPeriodParamId(int periodParamId) {
        this.periodParamId = periodParamId;
    }

    public String getPeriodParamVal() {
        return periodParamVal;
    }

    public void setPeriodParamVal(String periodParamVal) {
        this.periodParamVal = periodParamVal;
    }

    public int getIsDtStart() {
        return isDtStart;
    }

    public void setIsDtStart(int isDtStart) {
        this.isDtStart = isDtStart;
    }

    public int getIsDtEnd() {
        return isDtEnd;
    }

    public void setIsDtEnd(int isDtEnd) {
        this.isDtEnd = isDtEnd;
    }

    public String getListParamValId() {
        return listParamValId;
    }

    public void setListParamValId(String listParamValId) {
        this.listParamValId = listParamValId;
    }

    public String getListParamValName() {
        return listParamValName;
    }

    public void setListParamValName(String listParamValName) {
        this.listParamValName = listParamValName;
    }

    public String getPeriodParamValId() {
        return periodParamValId;
    }

    public void setPeriodParamValId(String periodParamValId) {
        this.periodParamValId = periodParamValId;
    }

    public String getPeriodParamValName() {
        return periodParamValName;
    }

    public void setPeriodParamValName(String periodParamValName) {
        this.periodParamValName = periodParamValName;
    }
}
