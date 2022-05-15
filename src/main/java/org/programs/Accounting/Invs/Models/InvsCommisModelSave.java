package org.kaznalnrprograms.Accounting.Invs.Models;

public class InvsCommisModelSave {
    private int id;
    private int nom;
    private String post;
    private int user_id;
    private int invs_id;
    private String creator;
    private String created;
    private String changer;
    private String changed;

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public String getCreated() {
        return created;
    }

    public void setCreated(String created) {
        this.created = created;
    }

    public String getChanger() {
        return changer;
    }

    public void setChanger(String changer) {
        this.changer = changer;
    }

    public String getChanged() {
        return changed;
    }

    public void setChanged(String changed) {
        this.changed = changed;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getNom() {
        return nom;
    }

    public void setNom(int nom) {
        this.nom = nom;
    }

    public String getPost() {
        return post;
    }

    public void setPost(String post) {
        this.post = post;
    }

    public int getUser_id() {
        return user_id;
    }

    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }

    public int getInvs_id() {
        return invs_id;
    }

    public void setInvs_id(int invs_id) {
        this.invs_id = invs_id;
    }
}
