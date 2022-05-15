package org.kaznalnrprograms.Accounting.RefferParams.Models;

public class RefferParamsModel
{
    private int id;
    private String paramcode;
    private String name;
    private String codelen;
    private int iscodedigit;
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

    public String getParamcode()
    {
        return paramcode;
    }

    public void setParamcode(String paramcode)
    {
        this.paramcode = paramcode;
    }

    public String getName()
    {
        return name;
    }

    public void setName(String name)
    {
        this.name = name;
    }

    public String getCodelen()
    {
        return codelen;
    }

    public void setCodelen(String codelen)
    {
        this.codelen = codelen;
    }

    public int getIscodedigit()
    {
        return iscodedigit;
    }

    public void setIscodedigit(int iscodedigit)
    {
        this.iscodedigit = iscodedigit;
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
