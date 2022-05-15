package org.kaznalnrprograms.Accounting.Today.Models;

public class Today
{
    private int id;
    private String date;
    private String openmode;
    private int cntusers;
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

    public String getDate()
    {
        return date;
    }

    public void setDate(String date)
    {
        this.date = date;
    }

    public String getOpenmode()
    {
        return openmode;
    }

    public void setOpenmode(String openmode)
    {
        this.openmode = openmode;
    }

    public int getCntusers()
    {
        return cntusers;
    }

    public void setCntusers(int cntusers)
    {
        this.cntusers = cntusers;
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
