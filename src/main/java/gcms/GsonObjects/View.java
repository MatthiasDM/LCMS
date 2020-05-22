/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.GsonObjects;

/**
 *
 * @author matmey
 */
public class View {
    private String user; //reference
    private String object; 
    private String view;
    private Boolean isPrivate;

    public View() {
    }

    public View(String user, String object, String view, Boolean isPrivate) {
        this.user = user;
        this.object = object;
        this.view = view;
        this.isPrivate = isPrivate;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getObject() {
        return object;
    }

    public void setObject(String object) {
        this.object = object;
    }

    public String getView() {
        return view;
    }

    public void setView(String view) {
        this.view = view;
    }

    public Boolean getIsPrivate() {
        return isPrivate;
    }

    public void setIsPrivate(Boolean isPrivate) {
        this.isPrivate = isPrivate;
    }
    
    
}
