package org.kaznalnrprograms.Accounting.LockTable.Models;

import javax.xml.crypto.Data;

public class LockTableModel {
   private String id;
   private String tablename;
   private String recid;
   private String date;
   private String username;
   private String kokname;
   private String minutes;

    public String getMinutes() {
        return minutes;
    }

    public void setMinutes(String minutes) {
        this.minutes = minutes;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTablename() {
        return tablename;
    }

    public void setTablename(String tablename) {
        this.tablename = tablename;
    }

    public String getRecid() {
        return recid;
    }

    public void setRecid(String recid) {
        this.recid = recid;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getKokname() {
        return kokname;
    }

    public void setKokname(String kokname) {
        this.kokname = kokname;
    }
}
