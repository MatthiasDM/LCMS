/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.objects.collections;

import java.util.List;
import gcms.GsonObjects.annotations.gcmsObject;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import gcms.Config.Methods;
import java.util.ArrayList;

/**
 *
 * @author Matthias
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class Attribute {

    @gcmsObject(
            viewRole = "ADMIN",
            createRole = "SYSTEM",
            type = "pk",
            visibleOnTable = false,
            visibleOnForm = false)
    public String attributeId;
    @gcmsObject(
            type = "fk",
            formatterName = "reference",
            fk = "{\"collection\": \"mongoconfigurations\", \"pk\": \"mongoconfigurationsid\", \"display\": \"name\", \"type\": \"ManyToOne\"}"
    )
    public String collection;
    @gcmsObject(
            type = "string",
            editRole = "ADMIN",
            visibleOnTable = true
    )
    public String attribute;
    @gcmsObject(
            type = "select",
            reference = {"Mongo", "roles", "role", "role"},
            visibleOnTable = true,
            multiple = true,
            editRole = "ADMIN")
    public List<String> viewRole;

    @gcmsObject(
            type = "select",
            reference = {"Mongo", "roles", "role", "role"},
            visibleOnTable = true,
            multiple = true,
            editRole = "ADMIN")
    public List<String> editRole;

    @gcmsObject(
            type = "select",
            reference = {"Mongo", "roles", "role", "role"},
            visibleOnTable = true,
            multiple = true,
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

    public String getCollection() {
        return collection;
    }

    public void setCollection(String collection) {
        this.collection = collection;
    }

    public Attribute(String attributeId, String collection, String attribute, List<String> viewRole, List<String> editRole, List<String> createRole, boolean visibleOnTable, boolean visibleOnForm, boolean editable) {
        this.attributeId = attributeId;
        this.collection = collection;
        this.attribute = attribute;
        this.viewRole = viewRole;
        this.editRole = editRole;
        this.createRole = createRole;
        this.visibleOnTable = visibleOnTable;
        this.visibleOnForm = visibleOnForm;
        this.editable = editable;
    }

    public String getAttributeId() {
        return attributeId;
    }

    public void setAttributeId(String attributeId) {
        this.attributeId = attributeId;
    }

    public String getAttribute() {
        return attribute;
    }

    public void setAttribute(String attribute) {
        this.attribute = attribute;
    }

  
  



    public Attribute() {
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

    public List<String> getRolesFromPrivilege(Methods _method) {
        if (_method.equals(Methods.get) && viewRole != null) {
            return viewRole;
        }
        if (_method.equals(Methods.put) && editRole != null) {
            return editRole;
        }
        if (_method.equals(Methods.post) && createRole != null) {
            return createRole;
        }
        return new ArrayList<>();
    }

}
