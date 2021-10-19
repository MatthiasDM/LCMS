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
            editRole = "ADMIN"
    )
    public String mongoconfiguration;
 
    @gcmsObject(
            type = "fk",
            formatterName = "reference",
            fk = "{\"collection\": \"methods\", \"pk\": \"methodId\", \"display\": \"method\", \"type\": \"ManyToOne\"}"
    )
    public String trigger;
        
    @gcmsObject(
            type = "select",
            reference = {"Mongo", "commands", "commandid", "name"},
            editRole = "ADMIN"
    )
    public String command;
    
    @gcmsObject(
            type = "string",
            editRole = "ADMIN",
            visibleOnTable = false
    )
    public String parameters;

    public String getWorkflowid() {
        return workflowid;
    }

    public void setWorkflowid(String workflowid) {
        this.workflowid = workflowid;
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

    public String getTrigger() {
        return trigger;
    }

    public void setTrigger(String trigger) {
        this.trigger = trigger;
    }

    public String getCommand() {
        return command;
    }

    public void setCommand(String command) {
        this.command = command;
    }

    public String getParameters() {
        return parameters;
    }

    public void setParameters(String parameters) {
        this.parameters = parameters;
    }

    public Workflow(String workflowid, String name, String mongoconfiguration, String trigger, String command, String parameters) {
        this.workflowid = workflowid;
        this.name = name;
        this.mongoconfiguration = mongoconfiguration;
        this.trigger = trigger;
        this.command = command;
        this.parameters = parameters;
    }

    
    
    public Workflow() {
    }


    
    
    
}
