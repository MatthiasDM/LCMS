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
public class TaskType {

    @gcmsObject(
            type = "pk",
            visibleOnTable = false,
            visibleOnForm = false)
    public String taskTypeId;

    @gcmsObject(
            type = "string",
            editRole = "ADMIN",
            visibleOnTable = true
    )
    public String name;    
    
    @gcmsObject(
            type = "text",      
            editRole = "ADMIN",
            formatterName = "goedkeuringsTaak",
            visibleOnTable = true,
            visibleOnForm = true
    )
    public String taskForm;

    public TaskType() {
    }

    

    public String getTaskTypeId() {
        return taskTypeId;
    }

    public void setTaskTypeId(String taskTypeId) {
        this.taskTypeId = taskTypeId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public TaskType(String taskTypeId, String name, String taskForm) {
        this.taskTypeId = taskTypeId;
        this.name = name;
        this.taskForm = taskForm;
    }

    public String getTaskForm() {
        return taskForm;
    }

    public void setTaskForm(String taskForm) {
        this.taskForm = taskForm;
    }

    
    
}
