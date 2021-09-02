/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.GsonObjects.Core;

import java.util.List;
import gcms.GsonObjects.annotations.gcmsObject;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import gcms.Config.PrivilegeType;
import java.util.ArrayList;

/**
 *
 * @author Matthias
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class Rights {

    @gcmsObject(
            viewRole = "ADMIN",
            createRole = "SYSTEM",
            //editRole = "ADMIN",
            type = "string",
            visibleOnTable = false,
            visibleOnForm = false)
    public String rightsid;
    @gcmsObject(
            type = "select",
            multiple = false,
            reference = {"Mongo", "mongoconfigurations", "name", "name"},
            visibleOnTable = true,
            editRole = "ADMIN")
    public String table;
    @gcmsObject(
            type = "string",
            editRole = "ADMIN",
            visibleOnTable = true
    )
    public String field;
    @gcmsObject(
            type = "select",
            reference = {"Mongo", "roles", "role", "role"},
            visibleOnTable = true,
            editRole = "ADMIN")
    public List<String> viewRole;

    @gcmsObject(
            type = "select",
            reference = {"Mongo", "roles", "role", "role"},
            visibleOnTable = true,
            editRole = "ADMIN")
    public List<String> editRole;

    @gcmsObject(
            type = "select",
            reference = {"Mongo", "roles", "role", "role"},
            visibleOnTable = true,
            editRole = "ADMIN")
    public List<String> createRole;

    @gcmsObject(
            type = "boolean",
            visibleOnTable = true,
            editRole = "ADMIN")
    public boolean visibleOnTable;

    @gcmsObject(
            type = "boolean",
            visibleOnTable = true,
            editRole = "ADMIN")
    public boolean visibleOnForm;

    @gcmsObject(
            type = "boolean",
            visibleOnTable = true,
            editRole = "ADMIN")
    public boolean editable;

    public Rights(String rightsid, String table, String field, List<String> viewRole, List<String> editRole, List<String> createRole, boolean visibleOnTable, boolean visibleOnForm, boolean editable) {
        this.rightsid = rightsid;
        this.table = table;
        this.field = field;
        this.viewRole = viewRole;
        this.editRole = editRole;
        this.createRole = createRole;
        this.visibleOnTable = visibleOnTable;
        this.visibleOnForm = visibleOnForm;
        this.editable = editable;
    }

    public boolean isVisibleOnTable() {
        return visibleOnTable;
    }

    public void setVisibleOnTable(boolean visibleOnTable) {
        this.visibleOnTable = visibleOnTable;
    }

    public boolean isVisibleOnForm() {
        return visibleOnForm;
    }

    public void setVisibleOnForm(boolean visibleOnForm) {
        this.visibleOnForm = visibleOnForm;
    }

    public boolean isEditable() {
        return editable;
    }

    public void setEditable(boolean editable) {
        this.editable = editable;
    }

  
  



    public Rights() {
    }

    public String getRightsid() {
        return rightsid;
    }

    public void setRightsid(String rightsid) {
        this.rightsid = rightsid;
    }

    public String getTable() {
        return table;
    }

    public void setTable(String table) {
        this.table = table;
    }

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }

    public List<String> getViewRole() {
        return viewRole;
    }

    public void setViewRole(List<String> viewRole) {
        this.viewRole = viewRole;
    }

    public List<String> getEditRole() {
        return editRole;
    }

    public void setEditRole(List<String> editRole) {
        this.editRole = editRole;
    }

    public List<String> getCreateRole() {
        return createRole;
    }

    public void setCreateRole(List<String> createRole) {
        this.createRole = createRole;
    }

    public List<String> getRolesFromPrivilege(PrivilegeType privelegeType) {
        if (privelegeType.equals(PrivilegeType.viewRole) && viewRole != null) {
            return viewRole;
        }
        if (privelegeType.equals(PrivilegeType.editRole) && editRole != null) {
            return editRole;
        }
        if (privelegeType.equals(PrivilegeType.createRole) && createRole != null) {
            return createRole;
        }
        return new ArrayList<>();
    }

}
