package org.kaznalnrprograms.Accounting.reffers.Models;

import java.util.List;

public class reffersSave {
    int id;
    String code;
    String name;
    int paramId;
    String sesId;
    List<row> rows;

    public int getId() {        return id;    }
    public void setId(int id) {        this.id = id;    }
    public String getCode() {        return code;    }
    public void setCode(String code) {        this.code = code;    }
    public String getName() {        return name;    }
    public void setName(String name) {        this.name = name;    }
    public int getParamId() {        return paramId;    }
    public void setParamId(int paramId) {        this.paramId = paramId;    }
    public List<row> getRows() {        return rows;    }
    public void setRows(List<row> rows) {        this.rows = rows;    }
    public String getSesId() {        return sesId;    }
    public void setSesId(String sesId) {        this.sesId = sesId;    }
}
