package org.kaznalnrprograms.Accounting.OrderTypes.Models;

public class OrderTypesViewModel
{
    private int id;
    private String code;
    private String name;
    private int mode;
    private String func;
    private String modul;
    private String codejs;
    private int del;

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

    public int getDel()
    {
        return del;
    }

    public void setDel(int del)
    {
        this.del = del;
    }
}
