package org.kaznalnrprograms.Accounting.Locations.Models;

public class LocationsModel
{
    private int id;
    private int kterid;
    private int depid;
    private String name;
    private int del;
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

    public int getKterid() {
        return kterid;
    }

    public void setKterid(int kterid) {
        this.kterid = kterid;
    }

    public int getDepid()
    {
        return depid;
    }

    public void setDepid(int depid)
    {
        this.depid = depid;
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
