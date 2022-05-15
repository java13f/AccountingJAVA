package org.kaznalnrprograms.Accounting.reffers.Models;

public class row {
    int id;
    String val;
    String code;
    int ownerId;
    String paramCode;

    public int getId() {        return id;    }
    public void setId(int id) {        this.id = id;    }
    public String getVal() {        return val;    }
    public void setVal(String val) {        this.val = val;    }
    public String getCode() {        return code;    }
    public void setCode(String code) {        this.code = code;    }
    public int getOwnerId() {        return ownerId;    }
    public void setOwnerId(int ownerId) {        this.ownerId = ownerId;    }
    public String getParamCode() {        return paramCode;    }
    public void setParamCode(String paramCode) {        this.paramCode = paramCode;    }
}
