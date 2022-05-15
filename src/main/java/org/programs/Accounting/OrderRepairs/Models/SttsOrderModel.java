package org.kaznalnrprograms.Accounting.OrderRepairs.Models;

public class SttsOrderModel
{
    private Integer id;
    private Integer groupid;
    private Integer orderfieldid;
    private String orderfieldname;
    private String orderfieldcode;
    private Integer orderstts;
    private Integer isenable;
    private Integer isvisible;
    private Integer ordertypeid;

    public Integer getId()
    {
        return id;
    }

    public String getOrderfieldcode()
    {
        return orderfieldcode;
    }

    public void setOrderfieldcode(String orderfieldcode)
    {
        this.orderfieldcode = orderfieldcode;
    }

    public void setId(Integer id)
    {
        this.id = id;
    }

    public Integer getGroupid()
    {
        return groupid;
    }

    public void setGroupid(Integer groupid)
    {
        this.groupid = groupid;
    }

    public Integer getOrderfieldid()
    {
        return orderfieldid;
    }

    public void setOrderfieldid(Integer orderfieldid)
    {
        this.orderfieldid = orderfieldid;
    }

    public String getOrderfieldname()
    {
        return orderfieldname;
    }

    public void setOrderfieldname(String orderfieldname)
    {
        this.orderfieldname = orderfieldname;
    }

    public Integer getOrderstts()
    {
        return orderstts;
    }

    public void setOrderstts(Integer orderstts)
    {
        this.orderstts = orderstts;
    }

    public Integer getIsenable()
    {
        return isenable;
    }

    public void setIsenable(Integer isenable)
    {
        this.isenable = isenable;
    }

    public Integer getIsvisible()
    {
        return isvisible;
    }

    public void setIsvisible(Integer isvisible)
    {
        this.isvisible = isvisible;
    }

    public Integer getOrdertypeid()
    {
        return ordertypeid;
    }

    public void setOrdertypeid(Integer ordertypeid)
    {
        this.ordertypeid = ordertypeid;
    }
}
