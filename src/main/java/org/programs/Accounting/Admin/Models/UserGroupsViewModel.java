package org.kaznalnrprograms.Accounting.Admin.Models;

public class UserGroupsViewModel {
    private Integer id;
    public String userName;
    public String kterName;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getKterName() {
        return kterName;
    }

    public void setKterName(String kterName) {
        this.kterName = kterName;
    }
}
