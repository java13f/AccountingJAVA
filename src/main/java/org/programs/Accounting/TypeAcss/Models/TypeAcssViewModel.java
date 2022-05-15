package org.kaznalnrprograms.Accounting.TypeAcss.Models;

public class TypeAcssViewModel {
    private int id;
    private String nameGroup;
    private String nameTypeObject;
    private int group_id;
    private int obj_type_id;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNameGroup() {
        return nameGroup;
    }

    public void setNameGroup(String nameGroup) {
        this.nameGroup = nameGroup;
    }

    public String getNameTypeObject() {
        return nameTypeObject;
    }

    public void setNameTypeObject(String nameTypeObject) {
        this.nameTypeObject = nameTypeObject;
    }

    public int getGroup_id() {
        return group_id;
    }

    public void setGroup_id(int group_id) {
        this.group_id = group_id;
    }

    public int getObj_type_id() {
        return obj_type_id;
    }

    public void setObj_type_id(int obj_type_id) {
        this.obj_type_id = obj_type_id;
    }
}
