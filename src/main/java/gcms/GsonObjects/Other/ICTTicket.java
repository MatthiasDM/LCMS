/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.GsonObjects.Other;

import java.util.HashMap;
import java.util.List;
import gcms.GsonObjects.annotations.gcmsObject;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
/**
 *
 * @author Matthias
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class ICTTicket {

    @gcmsObject(
            //viewRole = "ICTMANAGER",
            createRole = "SYSTEM",
            //editRole = "SYSTEM",
            type = "string",
            key = true,
            visibleOnTable = false,
            visibleOnForm = false)
    public String ticketid;
    @gcmsObject(
            viewRole = "SYSTEM",
            createRole = "SYSTEM",
            editRole = "SYSTEM",
            type = "string")
    public String number;
    @gcmsObject(
            editRole = "ICTMANAGER",
            createRole = "LABASSISTANT",
            type = "string")
    public String subject;
    @gcmsObject(
            editRole = "ICTMANAGER",
            //viewRole = "ICTMANAGER",
            type = "select",
            createRole = "LABASSISTANT",
            choices = {"Glims", "Cyberlab", "Sharepoint", "Hardware", ""}
    )
    public String category;
    @gcmsObject(
            editRole = "ICTMANAGER",
            //viewRole = "ICTMANAGER",
            type = "string",
            createRole = "ICTMANAGER"
    )
    public String discriminator;
    @gcmsObject(
            type = "cktext",
            editRole = "ICTMANAGER",
            createRole = "LABASSISTANT",
            visibleOnTable = false)
    public String overview;
    @gcmsObject(
            editRole = "ICTMANAGER",
            createRole = "ICTMANAGER",
            type = "cktext",
            visibleOnTable = false)
    public String followup;
    @gcmsObject(
            editRole = "ICTMANAGER",
            createRole = "LABASSISTANT",
            //viewRole = "ICTMANAGER",
            type = "select",
            choices = {"Gemeld", "Analyse", "Validatie", "Voltooid"}
    )
    public String status;
    @gcmsObject(
            editRole = "ICTMANAGER",
            viewRole = "ICTMANAGER",
            createRole = "ICTMANAGER",
            type = "select",
            multiple = true,
            reference = {"Mongo", "users", "userid", "username"},
            visibleOnTable = false
    )
    public List<String> involved_persons;
    @gcmsObject(
            type = "select",
            viewRole = "ICTMANAGER",
            reference = {"Mongo", "users", "userid", "username"},
            editRole = "ICTMANAGER",
            createRole = "ICTMANAGER",
            visibleOnTable = false
    )
    public String approver;
    @gcmsObject(
            type = "boolean",
            visibleOnTable = false,
            editRole = "@approver",
            viewRole = "@approver"
    )
    public boolean approved;
    @gcmsObject(
            type = "datetime",
            visibleOnTable = false,
            visibleOnForm = false,
            viewRole = "ICTMANAGER",
            createRole = "SYSTEM",
            editRole = "SYSTEM")
    public long approved_on;
    @gcmsObject(
            type = "datetime",
            visibleOnTable = true,
            visibleOnForm = false,
            editRole = "ICTMANAGER",
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
            type = "datetime",
            visibleOnTable = false,
            visibleOnForm = true,
            createRole = "SYSTEM",
            editRole = "SYSTEM")
    public long edited_on;
    @gcmsObject(
            type = "json",
            visibleOnTable = false,
            visibleOnForm = true,
            viewRole = "ICTMANAGER",
            createRole = "ICTMANAGER",
            editRole = "ICTMANAGER")
    public HashMap<String, List<String>> events;

    public ICTTicket() {
    }

    public ICTTicket(String ticketid, String number, String subject, String category, String discriminator, String overview, String followup, String status, List<String> involved_persons, String approver, boolean approved, long approved_on, long created_on, String created_by, long edited_on) {
        this.ticketid = ticketid;
        this.number = number;
        this.subject = subject;
        this.category = category;
        this.discriminator = discriminator;
        this.overview = overview;
        this.followup = followup;
        this.status = status;
        this.involved_persons = involved_persons;
        this.approver = approver;
        this.approved = approved;
        this.approved_on = approved_on;
        this.created_on = created_on;
        this.created_by = created_by;
        this.edited_on = edited_on;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDiscriminator() {
        return discriminator;
    }

    public void setDiscriminator(String discriminator) {
        this.discriminator = discriminator;
    }

    public boolean isApproved() {
        return approved;
    }

    public void setApproved(boolean approved) {
        this.approved = approved;
    }

    public String getTicketid() {
        return ticketid;
    }

    public void setTicketid(String ticketid) {
        this.ticketid = ticketid;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getOverview() {
        return overview;
    }

    public void setOverview(String overview) {
        this.overview = overview;
    }

    public String getFollowup() {
        return followup;
    }

    public void setFollowup(String followup) {
        this.followup = followup;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<String> getInvolved_persons() {
        return involved_persons;
    }

    public void setInvolved_persons(List<String> involved_persons) {
        this.involved_persons = involved_persons;
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
