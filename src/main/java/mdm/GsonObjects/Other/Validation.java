/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm.GsonObjects.Other;

import mdm.GsonObjects.Lab.*;
import mdm.pojo.annotations.MdmAnnotations;

/**
 *
 * @author matmey
 */
public class Validation {

    @MdmAnnotations(type = "string", visibleOnTable = false, visibleOnForm = false)
    public String validationid;
    @MdmAnnotations(type = "string", visibleOnTable = true, visibleOnForm = true)
    public String title;
    @MdmAnnotations(type = "string", visibleOnTable = false, visibleOnForm = false)
    public String contents;

    @MdmAnnotations(
            type = "select",
            reference = {"Mongo", "USERS", "userid", "username"},
            editRole = "ICTMANAGER",
            visibleOnTable = false
    )
    public String approver;
    @MdmAnnotations(
            type = "date",
            visibleOnTable = false,
            visibleOnForm = false,
            viewRole = "ICTMANAGER",
            createRole = "SYSTEM",
            editRole = "SYSTEM")
    public long approved_on;
    @MdmAnnotations(
            type = "date",
            visibleOnTable = false,
            visibleOnForm = false,
            editRole = "ICTMANAGER",
            createRole = "SYSTEM")
    public long created_on;
    @MdmAnnotations(
            type = "ref",
            visibleOnTable = false,
            visibleOnForm = false,
            viewRole = "ICTMANAGER",
            createRole = "SYSTEM",
            editRole = "ICTMANAGER")
    public String created_by;
    @MdmAnnotations(
            type = "date",
            visibleOnTable = false,
            visibleOnForm = false,
            createRole = "SYSTEM",
            editRole = "SYSTEM")
    public long edited_on;

    public Validation() {
    }

    public Validation(String validationid, String contents, String approver, long approved_on, long created_on, String created_by, long edited_on) {
        this.validationid = validationid;
        this.contents = contents;
        this.approver = approver;
        this.approved_on = approved_on;
        this.created_on = created_on;
        this.created_by = created_by;
        this.edited_on = edited_on;
    }

    public String getValidationid() {
        return validationid;
    }

    public void setValidationid(String validationid) {
        this.validationid = validationid;
    }

    public String getContents() {
        return contents;
    }

    public void setContents(String contents) {
        this.contents = contents;
    }

    public String getApprover() {
        return approver;
    }

    public void setApprover(String approver) {
        this.approver = approver;
    }

    public long getApproved_on() {
        return approved_on;
    }

    public void setApproved_on(long approved_on) {
        this.approved_on = approved_on;
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
