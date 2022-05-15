package org.kaznalnrprograms.Accounting.jrWearCalc.Models;

public class JrWearCalcSaveModel
{
    private String date;
    private Integer stts;
    private Integer year;
    private Integer kterId;

    public String getDate()
    {
        return date;
    }

    public void setDate(String date)
    {
        this.date = date;
    }

    public Integer getYear()
    {
        return year;
    }

    public void setYear(Integer year)
    {
        this.year = year;
    }

    public Integer getStts()
    {
        return stts;
    }

    public void setStts(Integer stts)
    {
        this.stts = stts;
    }

    public Integer getKterId()
    {
        return kterId;
    }

    public void setKterId(Integer kterId)
    {
        this.kterId = kterId;
    }
}
