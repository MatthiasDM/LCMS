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
public class Laboratory {

    @MdmAnnotations(type = "string", visibleOnTable = false, visibleOnForm = false)
    public String laboratoryid;
    @MdmAnnotations(
            type = "string")
    public String name;
    @MdmAnnotations(
            type = "string")
    public String description;
    @MdmAnnotations(
            type = "string")
    public String NIHII;
    @MdmAnnotations(
            type = "select",           
            reference = {"Mongo", "users", "userid", "username"},
            editRole = "ICTMANAGER"
    )
    public String head;
    @MdmAnnotations(
            type = "date",
            visibleOnTable = false,
            visibleOnForm = false,
            createRole = "SYSTEM",
            editRole = "SYSTEM")
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

    public Laboratory() {
    }

    public Laboratory(String laboratoryid, String name, String description, String NIHII, String head, long created_on, String created_by, long edited_on) {
        this.laboratoryid = laboratoryid;
        this.name = name;
        this.description = description;
        this.NIHII = NIHII;
        this.head = head;
        this.created_on = created_on;
        this.created_by = created_by;
        this.edited_on = edited_on;
    }

    public String getLaboratoryid() {
        return laboratoryid;
    }

    public void setLaboratoryid(String laboratoryid) {
        this.laboratoryid = laboratoryid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getNIHII() {
        return NIHII;
    }

    public void setNIHII(String NIHII) {
        this.NIHII = NIHII;
    }

    public String getHead() {
        return head;
    }

    public void setHead(String head) {
        this.head = head;
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
