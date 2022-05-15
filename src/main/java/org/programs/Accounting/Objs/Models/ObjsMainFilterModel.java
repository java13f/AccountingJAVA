package org.kaznalnrprograms.Accounting.Objs.Models;

import java.util.List;

public class ObjsMainFilterModel {
    private ObjsFilterModel filterData;
    private List<ObjsFilterDgvModel> filterDgv;

    public ObjsFilterModel getFilterData() {
        return filterData;
    }

    public void setFilterData(ObjsFilterModel filterData) {
        this.filterData = filterData;
    }

    public List<ObjsFilterDgvModel> getFilterDgv() {
        return filterDgv;
    }

    public void setFilterDgv(List<ObjsFilterDgvModel> filterDgv) {
        this.filterDgv = filterDgv;
    }
}
