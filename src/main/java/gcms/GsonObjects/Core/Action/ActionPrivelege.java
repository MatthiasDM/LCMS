/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.GsonObjects.Core.Action;

import gcms.GsonObjects.annotations.gcmsObject;
import java.util.List;

/**
 *
 * @author Matthias
 */
public class ActionPrivelege {

    @gcmsObject(
            type = "pk",
            key = true,
            visibleOnTable = false,
            visibleOnForm = false)
    public String actionPrivelegeId;

    @gcmsObject(
            type = "select",
            reference = {"Mongo", "roles", "role", "role"},
            visibleOnTable = true,
            multiple = true,
            editRole = "ADMIN")
    public List<String> executionRoles;

    @gcmsObject(
            type = "select",
            reference = {"Mongo", "users", "userid", "username"},
            visibleOnTable = true,
            multiple = true,
            editRole = "ADMIN")
    public List<String> executionUsers;

    @gcmsObject(
            type = "boolean",
            editRole = "ADMIN")
    public boolean session;

    @gcmsObject(
            type = "fk",
            formatterName = "reference",
            fk = "{\"collection\": \"actions\", \"pk\": \"actionsid\", \"display\": \"name\", \"type\": \"ManyToOne\"}",
            editRole = "ADMIN"
    )
    public String actions;

    @gcmsObject(
            type = "datetime",
            visibleOnTable = false,
            visibleOnForm = true,
            createRole = "SYSTEM",
            editRole = "SYSTEM")
    public long edited_on;

    @gcmsObject(
            type = "datetime",
            visibleOnTable = false,
            visibleOnForm = true,
            createRole = "SYSTEM",
            editRole = "SYSTEM")
    public long created_on;

    public ActionPrivelege() {
    }

    public ActionPrivelege(String actionPrivelegeId, List<String> executionRoles, List<String> executionUsers, Boolean session, String actions, long edited_on, long created_on) {
        this.actionPrivelegeId = actionPrivelegeId;
        this.executionRoles = executionRoles;
        this.executionUsers = executionUsers;
        this.session = session;
        this.actions = actions;
        this.edited_on = edited_on;
        this.created_on = created_on;
    }

 

    public String getActionPrivelegeId() {
        return actionPrivelegeId;
    }

    public void setActionPrivelegeId(String actionPrivelegeId) {
        this.actionPrivelegeId = actionPrivelegeId;
    }

    public List<String> getExecutionRoles() {
        return executionRoles;
    }

    public void setExecutionRoles(List<String> executionRoles) {
        this.executionRoles = executionRoles;
    }

    public List<String> getExecutionUsers() {
        return executionUsers;
    }

    public void setExecutionUsers(List<String> executionUsers) {
        this.executionUsers = executionUsers;
    }

    public String getActions() {
        return actions;
    }

    public void setActions(String action) {
        this.actions = action;
    }

    public long getEdited_on() {
        return edited_on;
    }

    public void setEdited_on(long edited_on) {
        this.edited_on = edited_on;
    }

    public long getCreated_on() {
        return created_on;
    }

    public void setCreated_on(long created_on) {
        this.created_on = created_on;
    }

    public Boolean getSession() {
        return session;
    }

    public void setSession(Boolean session) {
        this.session = session;
    }
    
    
    
}
