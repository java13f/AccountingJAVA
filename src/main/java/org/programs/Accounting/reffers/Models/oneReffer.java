package org.kaznalnrprograms.Accounting.reffers.Models;

public class oneReffer {
    public int id;
    public String code;
    public String Name;
    public String Created;
    public String Creator;
    public String Changed;
    public String Changer;

    public int getId() {        return id;    }
    public void setId(int id) {        this.id = id;    }
    public String getCode() {        return code;    }
    public void setCode(String code) {        this.code = code;    }
    public String getName() {        return Name;    }
    public void setName(String name) {        Name = name;    }
    public String getCreated() {        return Created;    }
    public void setCreated(String created) {        Created = created;    }
    public String getCreator() {        return Creator;    }
    public void setCreator(String creator) {        Creator = creator;    }
    public String getChanged() {        return Changed;    }
    public void setChanged(String changed) {        Changed = changed;    }
    public String getChanger() {        return Changer;    }
    public void setChanger(String changer) {        Changer = changer;    }
}
