package org.kaznalnrprograms.Accounting.Admin.Models;

public class AppModel {
    private int id;
    private int parentId;
    private String code;
    private String codeJs;
    private String Func;
    private int managedModule;
    private int report;
    private String name;
    private String appName;
    private String sortCode;
    private String creator;
    private String created;
    private String changer;
    private String changed;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getParentId() {
        return parentId;
    }

    public void setParentId(int parentId) {
        this.parentId = parentId;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getCodeJs() {
        return codeJs;
    }

    public void setCodeJs(String codeJs) {
        this.codeJs = codeJs;
    }

    public String getFunc() {
        return Func;
    }

    public void setFunc(String func) {
        Func = func;
    }

    public int getManagedModule() {
        return managedModule;
    }

    public void setManagedModule(int managedModule) {
        this.managedModule = managedModule;
    }

    public int getReport() {
        return report;
    }

    public void setReport(int report) {
        this.report = report;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }

    public String getSortCode() {
        return sortCode;
    }

    public void setSortCode(String sortCode) {
        this.sortCode = sortCode;
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
}
