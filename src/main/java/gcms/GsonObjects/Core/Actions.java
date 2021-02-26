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
            editRole = "ICTMANAGER",
            createRole = "ICTMANAGER",
            visibleOnTable = true
    )
    public String name;

    @gcmsObject(
            type = "select",
            reference = {"Mongo", "mongoconfigurations", "mongoconfigurationsid", "name"},            
            editRole = "ICTMANAGER"
    )
    public String mongoconfiguration;

}
