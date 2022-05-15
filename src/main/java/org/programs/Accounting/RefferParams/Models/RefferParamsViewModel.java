package org.kaznalnrprograms.Accounting.RefferParams.Models;

public class RefferParamsViewModel
{
    private int id;
    private String paramcode;
    private String name;
    private String codelen;
    private int iscodedigit;
    private int del;

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
}
