/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm.GsonObjects.Core;

import mdm.GsonObjects.Lab.*;
import mdm.pojo.annotations.MdmAnnotations;

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
            editRole = "ADMIN",
            visibleOnTable = false
    )
    public String description;

    public Command(String commandid, String name, String description) {
        this.commandid = commandid;
        this.name = name;
        this.description = description;
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
