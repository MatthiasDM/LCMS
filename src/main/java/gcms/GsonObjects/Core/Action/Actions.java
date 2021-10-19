/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.GsonObjects.Core.Action;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import gcms.GsonObjects.annotations.gcmsObject;

/**
 *
 * @author Matthias
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class Actions {

    @gcmsObject(
            type = "pk",
            createRole = "SYSTEM",
            pk = "{\"relations\": [{\"collection\": \"actionPriveleges\", \"type\": \"OneToMany\", \"fk\": \"actions\"}]}",
            //editRole = "SYSTEM",
            visibleOnTable = false,
            visibleOnForm = false
    )
    public String actionsid;
    @gcmsObject(
            type = "string",
            editRole = "ADMIN",
            createRole = "ADMIN",
            visibleOnTable = true
    )
    public String name;

    @gcmsObject(
            type = "fk",
            formatterName = "reference",
            fk = "{\"collection\": \"mongoconfigurations\", \"pk\": \"mongoconfigurationsid\", \"display\": \"name\", \"type\": \"ManyToOne\"}"
    )
    public String mongoconfiguration;

    public Actions() {
    }

    public Actions(String actionsid, String name, String mongoconfiguration) {
        this.actionsid = actionsid;
        this.name = name;
        this.mongoconfiguration = mongoconfiguration;
    }

    public String getActionsid() {
        return actionsid;
    }

    public void setActionsid(String actionsid) {
        this.actionsid = actionsid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMongoconfiguration() {
        return mongoconfiguration;
    }

    public void setMongoconfiguration(String mongoconfiguration) {
        this.mongoconfiguration = mongoconfiguration;
    }

    
}
