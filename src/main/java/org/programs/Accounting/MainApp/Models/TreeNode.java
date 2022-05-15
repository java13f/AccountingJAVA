package org.kaznalnrprograms.Accounting.MainApp.Models;

import java.util.Collection;

public class TreeNode {
    private String id;
    private String text;
    private String iconCls;
    private String state;
    private Collection<TreeNode> children;
    private AppAttributes attributes;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getIconCls() {
        return iconCls;
    }

    public void setIconCls(String iconCls) {
        this.iconCls = iconCls;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public Collection<TreeNode> getChildren() {
        return children;
    }

    public void setChildren(Collection<TreeNode> children) {
        this.children = children;
    }

    public AppAttributes getAttributes() {
        return attributes;
    }

    public void setAttributes(AppAttributes attributes) {
        this.attributes = attributes;
    }
}
