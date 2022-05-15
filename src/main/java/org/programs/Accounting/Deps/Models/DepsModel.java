package org.kaznalnrprograms.Accounting.Deps.Models;

public class DepsModel {
    private int id;
    private String code;
    private int main_dep;
    private String name;
    private int bossUserId;
    private int kterId;
    private String parentName;
    private String creator;
    private String created;
    private String changer;
    private String changed;

    public int getMain_dep() {
        return main_dep;
    }

    public void setMain_dep(int main_dep) {
        this.main_dep = main_dep;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getBossUserId() {
        return bossUserId;
    }

    public void setBossUserId(int bossUserId) {
        this.bossUserId = bossUserId;
    }

    public int getKterId() {
        return kterId;
    }

    public void setKterId(int kterId) {
        this.kterId = kterId;
    }

    public String getParentName() {
        return parentName;
    }

    public void setParentName(String parentName) {
        this.parentName = parentName;
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
