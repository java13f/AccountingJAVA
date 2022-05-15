package org.kaznalnrprograms.Accounting.LogMain.Models;

import java.util.List;

public class DataTable {
    private int total;
    private List<Object> rows;

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public List<Object> getRows() {
        return rows;
    }

    public void setRows(List<Object> rows) {
        this.rows = rows;
    }
}
