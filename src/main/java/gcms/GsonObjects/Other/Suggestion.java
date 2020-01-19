/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.GsonObjects.Other;

import gcms.GsonObjects.annotations.MdmAnnotations;

/**
 *
 * @author Matthias
 */
public class Suggestion {

    @MdmAnnotations(type = "string", visibleOnTable = false, visibleOnForm = false)
    public String suggestionid;
    @MdmAnnotations(
            type = "string",
            editRole = "ADMIN"
    )
    public String subject;
    @MdmAnnotations(
            type = "cktext",
            editRole = "ADMIN",
            visibleOnTable = false
    )

    public String description;
    @MdmAnnotations(
            type = "cktext",
            editRole = "ADMIN",
            visibleOnTable = false
    )

    public String followup;
    @MdmAnnotations(
            type = "select",
            choices = {"Personeelsorganisatie", "Werking labo", "Andere"},
            editRole = "ADMIN",
            visibleOnTable = true
    )
    public String category;
 @MdmAnnotations(
            type = "select",
            choices = {"Niet besproken", "Besproken"},     
            editRole = "ADMIN",
            visibleOnTable = true
    )
    public String status;

    public Suggestion() {
    }

    public Suggestion(String suggestionid, String subject, String description, String followup, String category, String status) {
        this.suggestionid = suggestionid;
        this.subject = subject;
        this.description = description;
        this.followup = followup;
        this.category = category;
        this.status = status;
    }

    public String isStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

  

    public String getSuggestionid() {
        return suggestionid;
    }

    public void setSuggestionid(String suggestionid) {
        this.suggestionid = suggestionid;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getFollowup() {
        return followup;
    }

    public void setFollowup(String followup) {
        this.followup = followup;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

   

    

}
