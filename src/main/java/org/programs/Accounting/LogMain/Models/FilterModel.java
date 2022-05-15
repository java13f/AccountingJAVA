package org.kaznalnrprograms.Accounting.LogMain.Models;

//Модель фильтра для получения данных из таблицы TransLog.
public class FilterModel {
    //Дата запроса
    private String dateQuery;
    //Имя пользователя
    private String user;
    //Флаг - только ошибки
    private boolean onlyError;
    //Образец
    private String pttrn;
    //Имя приложения
    private String appName;
    //Флаг исключения системных приложений
    private boolean exceptSystem;

    private int page;
    private int rows;

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getRows() {
        return rows;
    }

    public void setRows(int rows) {
        this.rows = rows;
    }

    public String getDateQuery() {
        return dateQuery;
    }

    public void setDateQuery(String dateQuery) {
        this.dateQuery = dateQuery;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public boolean getOnlyError() {
        return onlyError;
    }

    public void setOnlyError(boolean onlyError) {
        this.onlyError = onlyError;
    }

    public String getPttrn() {
        return pttrn;
    }

    public void setPttrn(String pttrn) {
        this.pttrn = pttrn;
    }

    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }

    public boolean getExceptSystem() {
        return exceptSystem;
    }

    public void setExceptSystem(boolean exceptSystem) {
        this.exceptSystem = exceptSystem;
    }
}
