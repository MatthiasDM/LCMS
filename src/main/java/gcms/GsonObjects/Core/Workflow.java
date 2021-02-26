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
public class Workflow {

    @gcmsObject(type = "string", visibleOnTable = false, visibleOnForm = false)
    public String workflowid;
    @gcmsObject(
            type = "string",
            editRole = "ADMIN"
    )
    public String name;
    @gcmsObject(
            type = "select",
            reference = {"Mongo", "mongoconfigurations", "mongoconfigurationsid", "collection"},
            editRole = "ICTMANAGER"
    )
    public String mongoconfiguration;
        @gcmsObject(
            editRole = "ICTMANAGER",
            //viewRole = "ICTMANAGER",
            type = "select",
            choices = {"onedit", "oncreate"}
    )
    public String trigger;
    
}
