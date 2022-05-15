package org.kaznalnrprograms.Accounting.reffers.Models;

public class ReffersParams {
    int id;
    String name;
    String val;
    String refferTable;
    String codeJs;
    String refferEditCode;
    int strict;
    String paramCode;
    int RecId;
    int imgFlag;    // -1 - изображения нет; 0 - изображение не сохранено в БД; imgValues.id - ид. изображения

    public String getRefferEditCode() {        return refferEditCode;    }
    public void setRefferEditCode(String refferEditCode) {        this.refferEditCode = refferEditCode;    }
    public String getCodeJs()            {return codeJs;}
    public void setCodeJs(String codeJs) {this.codeJs = codeJs;}
    public int getId() { return id;    }
    public void setId(int id) {        this.id = id;    }
    public String getName() {        return name;    }
    public void setName(String name) {        this.name = name;    }
    public String getVal() {        return val;    }
    public void setVal(String val) {        this.val = val;    }
    public String getRefferTable() {        return refferTable;    }
    public void setRefferTable(String refferTable) {        this.refferTable = refferTable;    }
    public int getStrict() {        return strict;    }
    public void setStrict(int strict) {        this.strict = strict;    }
    public String getParamCode() {        return paramCode;    }
    public void setParamCode(String paramCode) {        this.paramCode = paramCode;    }
    public int getRecId() {        return RecId;    }
    public void setRecId(int recId) {        RecId = recId;    }
    public int getImgFlag() {        return imgFlag;    }
    public void setImgFlag(int imgFlag) {        this.imgFlag = imgFlag;    }
}
