package org.kaznalnrprograms.Accounting.SttsOrder.Models;

public class SttsOrderViewModel {
    private int id;
    private String name;
    private String code;

    /**/
    //----СТАТУСЫ----------//--------коды-------//
    // -1-->отклонена------//  0-->невид.недост.//
    //  0-->новая----------//  1-->вид.недост.--//
    //  2-->в работе-------//  2-->вид.дост.----//
    //  1-->приостановлена-//
    //  3-->выполнена------//
    /**/

    //флаг видимости и доступности статусов(0-не вид. не дост.|1-вид. не дост.|2-вид. дост.) таблица SttsOrder
    /// <summary>
    /// новый
    /// </summary>
    private String newStts;
    /// <summary>
    /// в работе
    /// </summary>
    private String inProgressStts;
    /// <summary>
    /// приостановлен
    /// </summary>
    private String pauseStts;
    /// <summary>
    /// отклонен
    /// </summary>
    private String rejectedStts;
    /// <summary>
    /// выполнен
    /// </summary>
    private String doneStts;

    //флаг видимости и доступности статусов(0-не вид. не дост.|1-вид. не дост.|2-вид. дост.) таблица SttsOrder
    /// <summary>
    /// новый
    /// </summary>
    private String newSttsId;
    /// <summary>
    /// в работе
    /// </summary>
    private String inProgressSttsId;
    /// <summary>
    /// приостановлен
    /// </summary>
    private String pauseSttsId;
    /// <summary>
    /// отклонен
    /// </summary>
    private String rejectedSttsId;
    /// <summary>
    /// выполнен
    /// </summary>
    private String doneSttsId;

    private int sttsOrderId;
    private int groupId;
    private int orderfieldid;
    private int orderstts;
    private int isenable;
    private int isvisible;
    private int orderTypeId;

    private int saveId;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNewStts() {
        return newStts;
    }

    public void setNewStts(String newStts) {
        this.newStts = newStts;
    }

    public String getInProgressStts() {
        return inProgressStts;
    }

    public void setInProgressStts(String inProgressStts) {
        this.inProgressStts = inProgressStts;
    }

    public String getPauseStts() {
        return pauseStts;
    }

    public void setPauseStts(String pauseStts) {
        this.pauseStts = pauseStts;
    }

    public String getRejectedStts() {
        return rejectedStts;
    }

    public void setRejectedStts(String rejectedStts) {
        this.rejectedStts = rejectedStts;
    }

    public String getDoneStts() {
        return doneStts;
    }

    public void setDoneStts(String doneStts) {
        this.doneStts = doneStts;
    }

    public String getNewSttsId() {
        return newSttsId;
    }

    public void setNewSttsId(String newSttsId) {
        this.newSttsId = newSttsId;
    }

    public String getInProgressSttsId() {
        return inProgressSttsId;
    }

    public void setInProgressSttsId(String inProgressSttsId) {
        this.inProgressSttsId = inProgressSttsId;
    }

    public String getPauseSttsId() {
        return pauseSttsId;
    }

    public void setPauseSttsId(String pauseSttsId) {
        this.pauseSttsId = pauseSttsId;
    }

    public String getRejectedSttsId() {
        return rejectedSttsId;
    }

    public void setRejectedSttsId(String rejectedSttsId) {
        this.rejectedSttsId = rejectedSttsId;
    }

    public String getDoneSttsId() {
        return doneSttsId;
    }

    public void setDoneSttsId(String doneSttsId) {
        this.doneSttsId = doneSttsId;
    }

    public int getSttsOrderId() {
        return sttsOrderId;
    }

    public void setSttsOrderId(int sttsOrderId) {
        this.sttsOrderId = sttsOrderId;
    }

    public int getGroupId() {
        return groupId;
    }

    public void setGroupId(int groupId) {
        this.groupId = groupId;
    }

    public int getOrderfieldid() {
        return orderfieldid;
    }

    public void setOrderfieldid(int orderfieldid) {
        this.orderfieldid = orderfieldid;
    }

    public int getOrderstts() {
        return orderstts;
    }

    public void setOrderstts(int orderstts) {
        this.orderstts = orderstts;
    }

    public int getIsenable() {
        return isenable;
    }

    public void setIsenable(int isenable) {
        this.isenable = isenable;
    }

    public int getIsvisible() {
        return isvisible;
    }

    public void setIsvisible(int isvisible) {
        this.isvisible = isvisible;
    }

    public int getOrderTypeId() {
        return orderTypeId;
    }

    public void setOrderTypeId(int orderTypeId) {
        this.orderTypeId = orderTypeId;
    }

    public int getSaveId() {
        return saveId;
    }

    public void setSaveId(int saveId) {
        this.saveId = saveId;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
