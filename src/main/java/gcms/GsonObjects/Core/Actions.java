/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.GsonObjects.Core;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import gcms.GsonObjects.annotations.gcmsObject;

/**
 *
 * @author Matthias
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class Actions {

    @gcmsObject(
            type = "string",
            createRole = "SYSTEM",
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
            fk = "{\"collection\": \"mongoconfigurations\", \"pk\": \"mongoconfigurationsid\", \"display\": \"name\", \"type\": \"ManyToOne\"}",            
            reference = {"Mongo", "mongoconfigurations", "mongoconfigurationsid", "name"},            
            editRole = "ADMIN"
    )
    public String mongoconfiguration;

}
