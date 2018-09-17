/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm.GsonObjects.Other;

import java.util.List;
import mdm.pojo.annotations.MdmAnnotations;
import org.apache.commons.lang3.builder.DiffBuilder;
import org.apache.commons.lang3.builder.DiffResult;
import org.apache.commons.lang3.builder.Diffable;
import org.apache.commons.lang3.builder.ToStringStyle;

/**
 *
 * @author matmey
 */
public class ICTTicket {

    @MdmAnnotations(
            viewRole = "ICTMANAGER",
            createRole = "SYSTEM",
            editRole = "SYSTEM",
            type = "string",
            visibleOnTable = false,
            visibleOnForm = false)
    public String ticketid;
    @MdmAnnotations(
            viewRole = "SYSTEM",
            createRole = "SYSTEM",
            editRole = "SYSTEM",
            type = "string")
    public String number;
    @MdmAnnotations(
            editRole = "ICTMANAGER",
            type = "string")
    public String subject;
    @MdmAnnotations(
<<<<<<< HEAD
            editRole = "ICTMANAGER",
            type = "select",
            choices = {"Glims", "Cyberlab", "Sharepoint", "Hardware", ""}
    )
    public String category;
    @MdmAnnotations(
            type = "cktext",
            editRole = "ICTMANAGER",
            visibleOnTable = false)
    public String overview;
    @MdmAnnotations(
            editRole = "ICTMANAGER",
            type = "cktext",
            visibleOnTable = false)
    public String followup;
    @MdmAnnotations(
            editRole = "ICTMANAGER",
            type = "select",
            choices = {"Gemeld", "Analyse", "Validatie", "Voltooid"}
    )
    public String status;
    @MdmAnnotations(
            editRole = "ICTMANAGER",
            type = "select",
            multiple = true,
            reference = {"Mongo", "USERS", "userid", "username"},
            visibleOnTable = false
    )
    public List<String> involved_persons;
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
            visibleOnTable = true,
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
=======
            type = "cktext",
            editRole = "ICTMANAGER",
            visibleOnTable = false)
    public String overview;
    @MdmAnnotations(            
            editRole = "ICTMANAGER",
            type = "cktext",
            visibleOnTable = false)
    public String followup;
    @MdmAnnotations(
            editRole = "ICTMANAGER",            
            type = "select",
            choices = {"Gemeld", "Analyse", "Validatie", "Voltooid"}
    )
    public String status;
    @MdmAnnotations(
            editRole = "ICTMANAGER",
            type = "select",
            multiple = true,
            reference = {"Mongo","USERS","userid","username"},
            visibleOnTable = false
    )
    public List<String> involved_persons;
    @MdmAnnotations(
            type = "select",
            reference = {"Mongo","USERS","userid","username"},
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
            visibleOnTable = true,
            visibleOnForm = false,
            editRole = "SYSTEM",
            createRole = "SYSTEM")
    public long created_on;
    @MdmAnnotations(
            type = "ref",
            visibleOnTable = false,
            visibleOnForm = false,
            viewRole = "ICTMANAGER",
            createRole = "SYSTEM",
            editRole = "SYSTEM")
>>>>>>> origin/master
    public String created_by;
    @MdmAnnotations(
            type = "date",
            visibleOnTable = false,
            visibleOnForm = false,
            createRole = "SYSTEM",
            editRole = "SYSTEM")
    public long edited_on;

    public ICTTicket() {
    }

    public ICTTicket(String ticketid, String number, String subject, String overview, String followup, String status, List<String> involved_persons, String approver, long approved_on, long created_on, String created_by, long edited_on) {
        this.ticketid = ticketid;
        this.number = number;
        this.subject = subject;
        this.overview = overview;
        this.followup = followup;
        this.status = status;
        this.involved_persons = involved_persons;
        this.approver = approver;
        this.approved_on = approved_on;
        this.created_on = created_on;
        this.created_by = created_by;
        this.edited_on = edited_on;
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
