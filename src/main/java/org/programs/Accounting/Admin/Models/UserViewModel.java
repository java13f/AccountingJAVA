package org.kaznalnrprograms.Accounting.Admin.Models;

public class UserViewModel {
    private Integer id;
    private String code;
    private String kterName;
    private String depName;
    private String userName;
    private String deleted;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getKterName() {
        return kterName;
    }

    public void setKterName(String kterName) {
        this.kterName = kterName;
    }

    public String getDepName() {
        return depName;
    }

    public void setDepName(String depName) {
        this.depName = depName;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getDeleted() {
        return deleted;
    }

    public void setDeleted(String deleted) {
        this.deleted = deleted;
    }
}
