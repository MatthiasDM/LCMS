/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.GsonObjects.Core;

import java.util.List;
import gcms.GsonObjects.annotations.gcmsObject;

/**
 *
 * @author Matthias
 */
public class Command {

    @gcmsObject(type = "string", visibleOnTable = false, visibleOnForm = false)
    public String commandid;
    @gcmsObject(
            type = "string",
            editRole = "ADMIN"
    )
    public String name;
    @gcmsObject(
            type = "string",
            editRole = "ADMIN"
    )
    public String command;
    @gcmsObject(
            type = "string",
            editRole = "ADMIN",
            visibleOnTable = false
    )
    public String description;

    @gcmsObject(
            type = "string",
            editRole = "ADMIN",
            visibleOnTable = false
    )
    public String parameters;

    @gcmsObject(
            editRole = "ICTMANAGER",
            type = "select",
            choices = {"guest", "user", "api"},
            multiple = true
    )
    public List<String> accessType;

    @gcmsObject(
            editRole = "ICTMANAGER",
            type = "number",
            visibleOnTable = false
    )
    public String executionLimit;

    @gcmsObject(
            editRole = "ICTMANAGER",
            type = "number",
            visibleOnTable = false
    )
    public String executionCount;

    @gcmsObject(
            editRole = "ICTMANAGER",
            type = "number",
            visibleOnTable = false
    )
    public String executionLimitInterval;

    @gcmsObject(
            type = "datetime",
            visibleOnTable = false,
            visibleOnForm = false,
            createRole = "SYSTEM",
            editRole = "SYSTEM")
    public long lastExecution;

    public Command(String commandid, String name, String command, String description, String parameters, List<String> accessType, String executionLimit, String executionCount, String executionLimitInterval, long lastExecution) {
        this.commandid = commandid;
        this.name = name;
        this.command = command;
        this.description = description;
        this.parameters = parameters;
        this.accessType = accessType;
        this.executionLimit = executionLimit;
        this.executionCount = executionCount;
        this.executionLimitInterval = executionLimitInterval;
        this.lastExecution = lastExecution;
    }



    public String getExecutionCount() {
        return executionCount != null ? executionCount : "0";
    }

    public void setExecutionCount(String executionCount) {
        this.executionCount = executionCount;
    }

    public String getExecutionLimitInterval() {

        return executionLimitInterval != null ? executionLimitInterval : "0";
    }

    public void setExecutionLimitInterval(String executionLimitInterval) {
        this.executionLimitInterval = executionLimitInterval;
    }

    public List<String> getAccessType() {
        return accessType;
    }

    public void setAccessType(List<String> accessType) {
        this.accessType = accessType;
    }
 

    public String getExecutionLimit() {
        return executionLimit != null ? executionLimit : "0";
    }

    public void setExecutionLimit(String executionLimit) {
        this.executionLimit = executionLimit;
    }

    public long getLastExecution() {
        return lastExecution;
    }

    public void setLastExecution(long lastExecution) {
        this.lastExecution = lastExecution;
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
