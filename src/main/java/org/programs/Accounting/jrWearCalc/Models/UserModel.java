package org.kaznalnrprograms.Accounting.jrWearCalc.Models;

public class UserModel
{
    private int userid;
    private String depcode;
    private String username;
    private String depname;
    private int groupid;
    private String groupcode;
    private String usercode;
    private int del;
    private int depid;


    public int getUserid()
    {
        return userid;
    }

    public void setUserid(int userid)
    {
        this.userid = userid;
    }

    public String getUsercode()
    {
        return usercode;
    }

    public void setUsercode(String usercode)
    {
        this.usercode = usercode;
    }

    public int getDel()
    {
        return del;
    }

    public void setDel(int del)
    {
        this.del = del;
    }

    public int getDepid()
    {
        return depid;
    }

    public void setDepid(int depid)
    {
        this.depid = depid;
    }

    public int getGroupid()
    {
        return groupid;
    }

    public void setGroupid(int groupid)
    {
        this.groupid = groupid;
    }

    public String getGroupcode()
    {
        return groupcode;
    }

    public void setGroupcode(String groupcode)
    {
        this.groupcode = groupcode;
    }

    public int getId()
    {
        return userid;
    }

    public void setId(int id)
    {
        this.userid = id;
    }

    public String getDepcode()
    {
        return depcode;
    }

    public void setDepcode(String depcode)
    {
        this.depcode = depcode;
    }

    public String getUsername()
    {
        return username;
    }

    public void setUsername(String username)
    {
        this.username = username;
    }

    public String getDepname()
    {
        return depname;
    }

    public void setDepname(String depname)
    {
        this.depname = depname;
    }
}
