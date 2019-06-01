/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm.GsonObjects.Core;

import java.util.List;
import mdm.pojo.annotations.MdmAnnotations;

/**
 *
 * @author Matthias
 */
public class Rights {

    @MdmAnnotations(
            viewRole = "ICTMANAGER",
            createRole = "SYSTEM",
            editRole = "ICTMANAGER",
            type = "string",
            visibleOnTable = false,
            visibleOnForm = false)
    public String rightsid;
    @MdmAnnotations(
            type = "select",
            multiple = false,
            reference = {"Enum", "MongoConf"},
            visibleOnTable = true,
            editRole = "ICTMANAGER")
    public String table;

    @MdmAnnotations(
            type = "string",
            editRole = "ICTMANAGER",
            visibleOnTable = true
    )
    public String field;

    @MdmAnnotations(
            type = "select",
            reference = {"Enum", "Roles"},
            visibleOnTable = true,
            editRole = "ICTMANAGER")
    public List<String> viewRole;

    @MdmAnnotations(
            type = "select",
            reference = {"Enum", "Roles"},
            visibleOnTable = true,
            editRole = "ICTMANAGER")
    public List<String> editRole;

    @MdmAnnotations(
            type = "select",
            reference = {"Enum", "Roles"},
            visibleOnTable = true,
            editRole = "ICTMANAGER")
    public List<String> createRole;

    public Rights(String rightsid, String table, String field, List<String> viewRole, List<String> editRole, List<String> createRole) {
        this.rightsid = rightsid;
        this.table = table;
        this.field = field;
        this.viewRole = viewRole;
        this.editRole = editRole;
        this.createRole = createRole;
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

    

}
