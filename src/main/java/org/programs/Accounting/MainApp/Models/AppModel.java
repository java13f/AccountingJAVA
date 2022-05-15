package org.kaznalnrprograms.Accounting.MainApp.Models;

import java.util.Collection;

public class AppModel {
    private Integer Id;
    private String code;
    private String codedll;
    private String name;
    private Integer report;
    private Integer parentid;
    private Collection<AppModel> Apps;

    public Integer getId() {
        return Id;
    }

    public void setId(Integer id) {
        Id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getCodedll() {
        return codedll;
    }

    public void setCodedll(String codedll) {
        this.codedll = codedll;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getReport() {
        return report;
    }

    public void setReport(Integer report) {
        this.report = report;
    }

    public Integer getParentid() {
        return parentid;
    }

    public void setParentid(Integer parentid) {
        this.parentid = parentid;
    }

    public Collection<AppModel> getApps() {
        return Apps;
    }

    public void setApps(Collection<AppModel> apps) {
        Apps = apps;
    }
}