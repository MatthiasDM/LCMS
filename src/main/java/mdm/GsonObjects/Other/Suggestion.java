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
 * @author Matthias
 */
public class Suggestion {

    @MdmAnnotations(type = "string", visibleOnTable = false, visibleOnForm = false, editRole = "SYSTEM")
    public String suggestionid;
    @MdmAnnotations(
            type = "string",
            editRole = "SYSTEM"
    )
    public String subject;
    @MdmAnnotations(
            type = "cktext",
            editRole = "SYSTEM",
            visibleOnTable = false
            )
    
    public String description;
    @MdmAnnotations(
            type = "select",
            choices = {"Personeelsorganisatie", "Werking labo", "Andere"},
            editRole = "ADMIN",
            visibleOnTable = true
    )
    public String category;

    public Suggestion() {
    }

    public Suggestion(String suggestionid, String subject, String description, String category) {
        this.suggestionid = suggestionid;
        this.subject = subject;
        this.description = description;
        this.category = category;
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
    
    

   

    

   

}
