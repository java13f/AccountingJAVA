package org.kaznalnrprograms.Accounting.Admin.Models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;

public class AppViewModel {
    private int id;
    private String name;
    private String code;
    private String codejs;
    private String typeApp;
    @JsonIgnore
    private Integer parentId;
    private List<AppViewModel> children;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getCodejs() {
        return codejs;
    }

    public void setCodejs(String codejs) {
        this.codejs = codejs;
    }

    public String getTypeApp() {
        return typeApp;
    }

    public void setTypeApp(String typeApp) {
        this.typeApp = typeApp;
    }

    public Integer getParentId() {
        return parentId;
    }

    public void setParentId(Integer parentId) {
        this.parentId = parentId;
    }

    public List<AppViewModel> getChildren() {
        return children;
    }

    public void setChildren(List<AppViewModel> children) {
        this.children = children;
    }
}
