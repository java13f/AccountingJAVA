package org.kaznalnrprograms.Accounting.Today.Models;

public class TodayUsers
{
    private int id;
    private int todayid;
    private int userid;
    private int del;
    private String username;
    private String creator;
    private String created;
    private String changer;
    private String changed;

    public int getId()
    {
        return id;
    }

    public void setId(int id)
    {
        this.id = id;
    }

    public int getTodayid()
    {
        return todayid;
    }

    public void setTodayid(int todayid)
    {
        this.todayid = todayid;
    }

    public int getUserid()
    {
        return userid;
    }

    public void setUserid(int userid)
    {
        this.userid = userid;
    }

    public int getDel()
    {
        return del;
    }

    public void setDel(int del)
    {
        this.del = del;
    }

    public String getUsername()
    {
        return username;
    }

    public void setUsername(String username)
    {
        this.username = username;
    }

    public String getCreator()
    {
        return creator;
    }

    public void setCreator(String creator)
    {
        this.creator = creator;
    }

    public String getCreated()
    {
        return created;
    }

    public void setCreated(String created)
    {
        this.created = created;
    }

    public String getChanger()
    {
        return changer;
    }

    public void setChanger(String changer)
    {
        this.changer = changer;
    }

    public String getChanged()
    {
        return changed;
    }

    public void setChanged(String changed)
    {
        this.changed = changed;
    }
}
