/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.objects.tasks;

import gcms.GsonObjects.annotations.gcmsObject;

/**
 *
 * @author Matthias
 */
public class Task {

    @gcmsObject(
            type = "pk",
            visibleOnTable = false,
            visibleOnForm = false)
    public String taskId;
    @gcmsObject(
            type = "string",
            visibleOnTable = false,
            visibleOnForm = false
    )
    public String object_type;
    @gcmsObject(
            type = "string",
            visibleOnTable = false,
            visibleOnForm = false
    )
    public String object_id;

    @gcmsObject(
            type = "String",
            createRole = "ADMIN"
    )
    public String description;

    @gcmsObject(
            type = "boolean",
            editRole = "ADMIN",
            createRole = "ADMIN",
            visibleOnTable = true
    )
    public boolean approved;
    @gcmsObject(
            type = "fk",
            fk = "{\"collection\": \"taskTypes\", \"pk\": \"taskTypeId\", \"display\": \"name\", \"type\": \"ManyToOne\"}",
            multiple = false,
            formatterName = "reference"
    )
    public String taskType;

    @gcmsObject(
            type = "datetime",
            visibleOnTable = true,
            visibleOnForm = false,
            editRole = "ADMIN",
            createRole = "SYSTEM")
    public long created_on;
    @gcmsObject(
            type = "datetime",
            visibleOnTable = false,
            visibleOnForm = true,
            createRole = "SYSTEM",
            editRole = "SYSTEM")
    public long edited_on;

    public Task() {
    }

    public Task(String taskId, String object_type, String object_id, String description, boolean approved, String taskType, long created_on, long edited_on) {
        this.taskId = taskId;
        this.object_type = object_type;
        this.object_id = object_id;
        this.description = description;
        this.approved = approved;
        this.taskType = taskType;
        this.created_on = created_on;
        this.edited_on = edited_on;
    }

    public String getTaskId() {
        return taskId;
    }

    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }

    public String getObject_type() {
        return object_type;
    }

    public void setObject_type(String object_type) {
        this.object_type = object_type;
    }

    public String getObject_id() {
        return object_id;
    }

    public void setObject_id(String object_id) {
        this.object_id = object_id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isApproved() {
        return approved;
    }

    public void setApproved(boolean approved) {
        this.approved = approved;
    }

    public String getTaskType() {
        return taskType;
    }

    public void setTaskType(String taskType) {
        this.taskType = taskType;
    }

    public long getCreated_on() {
        return created_on;
    }

    public void setCreated_on(long created_on) {
        this.created_on = created_on;
    }

    public long getEdited_on() {
        return edited_on;
    }

    public void setEdited_on(long edited_on) {
        this.edited_on = edited_on;
    }
    
    
}
