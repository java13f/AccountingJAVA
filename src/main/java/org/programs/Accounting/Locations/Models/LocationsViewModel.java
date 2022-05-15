package org.kaznalnrprograms.Accounting.Locations.Models;

public class LocationsViewModel
{
    private int id;
    private String depname;
    private String ktername;
    private String name;
    private int del;

    public int getId()
    {
        return id;
    }

    public void setId(int id)
    {
        this.id = id;
    }

    public String getDepname()
    {
        return depname;
    }

    public void setDepname(String depname)
    {
        this.depname = depname;
    }

    public String getKtername()
    {
        return ktername;
    }

    public void setKtername(String ktername)
    {
        this.ktername = ktername;
    }

    public String getName()
    {
        return name;
    }

    public void setName(String name)
    {
        this.name = name;
    }

    public int getDel()
    {
        return del;
    }

    public void setDel(int del)
    {
        this.del = del;
    }
}
