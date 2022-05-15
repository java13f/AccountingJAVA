package org.kaznalnrprograms.Accounting.OrderRepairs.Models;

public class DateOpenModel
{
    private String date;
    private int openmode;
    private int todayid;
    private int userid;

    public String getDate()
    {
        return date;
    }

    public void setDate(String date)
    {
        this.date = date;
    }

    public int getOpenmode()
    {
        return openmode;
    }

    public void setOpenmode(int openmode)
    {
        this.openmode = openmode;
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
}
