package org.kaznalnrprograms.Accounting.jrWearCalc.Models;

public class JrWearCalcViewModel
{
    private int id;
    private String date;
    private String amount;
    private String stts;
    private String terr;
    private int idStts;

    public int getId()
    {
        return id;
    }

    public void setId(int id)
    {
        this.id = id;
    }

    public String getAmount()
    {
        return amount;
    }

    public void setAmount(String amount)
    {
        this.amount = amount;
    }

    public String getDate()
    {
        return date;
    }

    public void setDate(String date)
    {
        this.date = date;
    }

    public String getStts()
    {
        return stts;
    }

    public void setStts(String stts)
    {
        this.stts = stts;
    }

    public int getIdStts()
    {
        return idStts;
    }

    public void setIdStts(int idStts)
    {
        this.idStts = idStts;
    }

    public String getTerr()
    {
        return terr;
    }

    public void setTerr(String terr)
    {
        this.terr = terr;
    }
}

