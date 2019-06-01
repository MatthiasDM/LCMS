/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm.GsonObjects.Core;

import mdm.pojo.annotations.MdmAnnotations;

/**
 *
 * @author matmey
 */
public class Task {

    @MdmAnnotations(
            viewRole = "ICTMANAGER",
            createRole = "SYSTEM",
            editRole = "SYSTEM",
            type = "string",
            visibleOnTable = false,
            visibleOnForm = false)
    public String taskid;
    @MdmAnnotations(
            type = "cktext",
            editRole = "TASKMANAGER",
            visibleOnTable = false)
    public String description;
    @MdmAnnotations(
            type = "select",
            multiple = false,
            reference = {"Enum", "MongoConf"},
            visibleOnTable = true,
            editRole = "TASKMANAGER")
    public String category;

    @MdmAnnotations(
            type = "select",
            reference = {"Mongo", "USERS", "userid", "username"},
            editRole = "ICTMANAGER",
            visibleOnTable = false
    )
    public String assigned_to;

    @MdmAnnotations(
            type = "date",
            visibleOnTable = true,
            visibleOnForm = false,
            editRole = "SYSTEM",
            createRole = "SYSTEM")
    public long starttime;

    @MdmAnnotations(
            type = "date",
            visibleOnTable = true,
            visibleOnForm = false,
            editRole = "SYSTEM",
            createRole = "SYSTEM")
    public long endtime;

    @MdmAnnotations(
            type = "date",
            visibleOnTable = true,
            visibleOnForm = false,
            editRole = "SYSTEM",
            createRole = "SYSTEM")
    public long created_on;
    @MdmAnnotations(
            type = "date",
            visibleOnTable = true,
            visibleOnForm = false,
            editRole = "SYSTEM",
            createRole = "SYSTEM")
    public long edited_on;

    public Task() {
    }

    public Task(String taskid, String description, String category, String assigned_to, long starttime, long endtime, long created_on, long edited_on) {
        this.taskid = taskid;
        this.description = description;
        this.category = category;
        this.assigned_to = assigned_to;
        this.starttime = starttime;
        this.endtime = endtime;
        this.created_on = created_on;
        this.edited_on = edited_on;
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
    
    

    public String getTaskid() {
        return taskid;
    }

    public void setTaskid(String taskid) {
        this.taskid = taskid;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getAssigned_to() {
        return assigned_to;
    }

    public void setAssigned_to(String assigned_to) {
        this.assigned_to = assigned_to;
    }

    public long getStarttime() {
        return starttime;
    }

    public void setStarttime(long starttime) {
        this.starttime = starttime;
    }

    public long getEndtime() {
        return endtime;
    }

    public void setEndtime(long endtime) {
        this.endtime = endtime;
    }

}
