package org.kaznalnrprograms.Accounting.OrderTypes.Models;

public class OrderTypesModel
{
    private int id;
    private String code;
    private String name;
    private int mode;
    private String func;
    private String modul;
    private String codejs;

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

    public String getCode()
    {
        return code;
    }

    public void setCode(String code)
    {
        this.code = code;
    }

    public String getName()
    {
        return name;
    }

    public void setName(String name)
    {
        this.name = name;
    }

    public int getMode()
    {
        return mode;
    }

    public void setMode(int mode)
    {
        this.mode = mode;
    }

    public String getFunc()
    {
        return func;
    }

    public void setFunc(String func)
    {
        this.func = func;
    }

    public String getModul()
    {
        return modul;
    }

    public void setModul(String modul)
    {
        this.modul = modul;
    }

    public String getCodejs()
    {
        return codejs;
    }

    public void setCodejs(String codejs)
    {
        this.codejs = codejs;
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
