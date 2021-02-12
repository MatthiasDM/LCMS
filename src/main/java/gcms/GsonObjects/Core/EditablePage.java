/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.GsonObjects.Core;

import gcms.GsonObjects.annotations.gcmsObject;

/**
 *
 * @author matmey
 */
public class EditablePage {

    @gcmsObject(type = "string", visibleOnTable = false, visibleOnForm = false)
    public String editablepageid;
    @gcmsObject(type = "string", visibleOnTable = true, visibleOnForm = true)
    public String title;
    @gcmsObject(
            editRole = "ICTMANAGER",
            viewRole = "LABASSISTANT",
            type = "string",
            visibleOnTable = false,
            visibleOnForm = true,
            DMP = true
    )
    public String contents;
    @gcmsObject(type = "string", visibleOnTable = false, visibleOnForm = false)
    public String template;
    @gcmsObject(
            type = "select",
            reference = {"Mongo", "users", "userid", "username"},
            editRole = "ICTMANAGER",
            visibleOnTable = false
    )
    public String approver;
    @gcmsObject(
            editRole = "ICTMANAGER",
            type = "select",
            choices = {"Algemeen", "Glims", "Nomenclatuur", "Labo", "Software"}
    )
    public String category;

    @gcmsObject(
            editRole = "ICTMANAGER",
            viewRole = "LABASSISTANT",
            type = "select",
            choices = {"public", "private", "partial"}
    )
    public String accessType;

    @gcmsObject(
            type = "date",
            visibleOnTable = false,
            visibleOnForm = false,
            viewRole = "ICTMANAGER",
            createRole = "SYSTEM",
            editRole = "SYSTEM")
    public long approved_on;
    @gcmsObject(
            type = "datetime",
            visibleOnTable = false,
            visibleOnForm = false,
            editRole = "SYSTEM",
            createRole = "SYSTEM")
    public long created_on;
    @gcmsObject(
            type = "ref",
            visibleOnTable = false,
            visibleOnForm = false,
            viewRole = "ICTMANAGER",
            createRole = "SYSTEM",
            editRole = "ICTMANAGER")
    public String created_by;
    @gcmsObject(
            type = "date",
            visibleOnTable = false,
            visibleOnForm = false,
            createRole = "SYSTEM",
            editRole = "SYSTEM")
    public long edited_on;

    public EditablePage() {
    }

    public EditablePage(String editablepageid, String title, String contents, String template, String approver, String category, String accessType, long approved_on, long created_on, String created_by, long edited_on) {
        this.editablepageid = editablepageid;
        this.title = title;
        this.contents = contents;
        this.template = template;
        this.approver = approver;
        this.category = category;
        this.accessType = accessType;
        this.approved_on = approved_on;
        this.created_on = created_on;
        this.created_by = created_by;
        this.edited_on = edited_on;
    }

    public String getAccessType() {
        return accessType;
    }

    public void setAccessType(String accessType) {
        this.accessType = accessType;
    }



    public String getEditablepageid() {
        return editablepageid;
    }

    public void setEditablepageid(String validationid) {
        this.editablepageid = validationid;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
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
