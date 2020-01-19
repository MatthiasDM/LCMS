/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.GsonObjects.Lab;

import gcms.GsonObjects.annotations.MdmAnnotations;

/**
 *
 * @author Matthias
 */
public class LabItem {

    @MdmAnnotations(type = "string", visibleOnTable = false, visibleOnForm = false)
    public String labitemid;
    @MdmAnnotations(
            type = "string")
    public String name;
    @MdmAnnotations(
            type = "string")
    public String description;
    @MdmAnnotations(
            type = "string")
    public String identifier;
    @MdmAnnotations(
            type = "select",
            reference = {"Mongo", "STORAGE", "storageid", "description"},
            editRole = "ICTMANAGER",
            visibleOnTable = true
    )
    public String storage;
    @MdmAnnotations(
            type = "date",
            visibleOnTable = false,
            visibleOnForm = false,
            viewRole = "SYSTEM",
            editRole = "SYSTEM",
            createRole = "SYSTEM")
    public long created_on;
    @MdmAnnotations(
            type = "ref",
            visibleOnTable = false,
            visibleOnForm = false,
            viewRole = "SYSTEM",
            createRole = "SYSTEM",
            editRole = "SYSTEM")
    public String created_by;
    @MdmAnnotations(
            type = "date",
            visibleOnTable = false,
            visibleOnForm = false,
            createRole = "SYSTEM",
            editRole = "SYSTEM")
    public long edited_on;

    public LabItem() {
    }

    public LabItem(String labitemid, String name, String identifier, long created_on, String created_by, long edited_on) {
        this.labitemid = labitemid;
        this.name = name;
        this.identifier = identifier;
        this.created_on = created_on;
        this.created_by = created_by;
        this.edited_on = edited_on;
    }

    public String getLabitemid() {
        return labitemid;
    }

    public void setLabitemid(String labitemid) {
        this.labitemid = labitemid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public long getCreated_on() {
        return created_on;
    }

    public void setCreated_on(long created_on) {
        this.created_on = created_on;
    }

    public String getCreated_by() {
        return created_by;
    }

    public void setCreated_by(String created_by) {
        this.created_by = created_by;
    }

    public long getEdited_on() {
        return edited_on;
    }

    public void setEdited_on(long edited_on) {
        this.edited_on = edited_on;
    }

}
