/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.GsonObjects.Core;

import gcms.GsonObjects.annotations.MdmAnnotations;

/**
 *
 * @author Matthias
 */
public class Command {

    @MdmAnnotations(type = "string", visibleOnTable = false, visibleOnForm = false)
    public String commandid;
    @MdmAnnotations(
            type = "string",
            editRole = "ADMIN"
    )
    public String name;
        @MdmAnnotations(
            type = "string",
            editRole = "ADMIN"
    )
    public String command;
    @MdmAnnotations(
            type = "string",
            editRole = "ADMIN",
            visibleOnTable = false
    )
    public String description;

    @MdmAnnotations(
            type = "string",
            editRole = "ADMIN",
            visibleOnTable = false
    )
    public String parameters;

    public Command(String commandid, String name, String command, String description, String parameters) {
        this.commandid = commandid;
        this.name = name;
        this.command = command;
        this.description = description;
        this.parameters = parameters;
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

   

    public Command() {
    }

    public String getCommandid() {
        return commandid;
    }

    public void setCommandid(String commandid) {
        this.commandid = commandid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

}
