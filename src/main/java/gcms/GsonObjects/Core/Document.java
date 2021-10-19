/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.GsonObjects.Core;

import gcms.GsonObjects.annotations.gcmsObject;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 *
 * @author Matthias
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class Document {

    @gcmsObject(type = "string", visibleOnTable = false, visibleOnForm = false)
    public String documentid;
    @gcmsObject(type = "string", visibleOnTable = true, visibleOnForm = true)
    public String title;
    @gcmsObject(type = "string", visibleOnTable = true, visibleOnForm = false)
    public String prefix;
    @gcmsObject(type = "cktext", visibleOnTable = false, visibleOnForm = false)
    public String contents;
    @gcmsObject(
            type = "select",
            viewRole = "GUEST",
            reference = {"Mongo", "users", "userid", "username"},
            editRole = "ADMIN",
            visibleOnTable = false
    )
    public String approver;
    @gcmsObject(
            editRole = "ADMIN",
            type = "select",
            choices = {"Algemeen", "Glims", "Nomenclatuur", "Labo", "Software", "Gearchiveerd"}
    )
    public String category;
    @gcmsObject(
            type = "date",
            visibleOnTable = false,
            visibleOnForm = false,
            viewRole = "ADMIN",
            createRole = "SYSTEM",
            editRole = "SYSTEM")
    public long approved_on;

    @gcmsObject(
            type = "ref",
            visibleOnTable = false,
            visibleOnForm = false,
            viewRole = "ADMIN",
            createRole = "SYSTEM",
            editRole = "ADMIN")
    public String created_by;
    @gcmsObject(
            type = "date",
            visibleOnTable = false,
            visibleOnForm = false,
            createRole = "SYSTEM",
            editRole = "SYSTEM")
    public long edited_on;
    @gcmsObject(
            type = "date",
            visibleOnTable = true,
            visibleOnForm = false,
            viewRole = "GUEST",
            editRole = "ADMIN",
            createRole = "SYSTEM")
    public long created_on;

    public Document() {
    }

    public Document(String documentid, String title, String prefix, String contents, String approver, String category, long approved_on, long created_on, String created_by, long edited_on) {
        this.documentid = documentid;
        this.title = title;
        this.prefix = prefix;
        this.contents = contents;
        this.approver = approver;
        this.category = category;
        this.approved_on = approved_on;
        this.created_on = created_on;
        this.created_by = created_by;
        this.edited_on = edited_on;
    }

    public String getPrefix() {
        return prefix;
    }

    public void setPrefix(String prefix) {
        this.prefix = prefix;
    }

    public String getValidationid() {
        return documentid;
    }

    public void setValidationid(String validationid) {
        this.documentid = validationid;
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
