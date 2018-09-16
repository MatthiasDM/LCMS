/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm.GsonObjects.Lab;

import mdm.pojo.annotations.MdmAnnotations;

/**
 *
 * @author Matthias
 */
public class Department {

    @MdmAnnotations(type = "string", visibleOnTable = false, visibleOnForm = false)
    public String departmentid;
    @MdmAnnotations(
            type = "string")
    public String name;
    @MdmAnnotations(
            type = "string")
    public String description;
    @MdmAnnotations(
            type = "date",
            visibleOnTable = false,
            visibleOnForm = false,
            createRole = "SYSTEM",
            editRole = "SYSTEM")
    public long created_on;
    @MdmAnnotations(
            type = "ref",
            visibleOnTable = false,
            visibleOnForm = false,
            viewRole = "SYSTEM",
            createRole = "SYSTEM",
            editRole = "SYSTEM")
    public String created_by;
    @MdmAnnotations(
            type = "date",
            visibleOnTable = false,
            visibleOnForm = false,
            createRole = "SYSTEM",
            editRole = "SYSTEM")
    public long edited_on;

    public Department() {
    }

    public Department(String departmentid, String name, String description, long created_on, String created_by, long edited_on) {
        this.departmentid = departmentid;
        this.name = name;
        this.description = description;
        this.created_on = created_on;
        this.created_by = created_by;
        this.edited_on = edited_on;
    }

    public String getDepartmentid() {
        return departmentid;
    }

    public void setDepartmentid(String departmentid) {
        this.departmentid = departmentid;
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

    public long getCreated_on() {
        return created_on;
    }

    public void setCreated_on(long created_on) {
        this.created_on = created_on;
    }

    public String getCreated_by() {
        return created_by;
    }

    public void setCreated_by(String created_by) {
        this.created_by = created_by;
    }

    public long getEdited_on() {
        return edited_on;
    }

    public void setEdited_on(long edited_on) {
        this.edited_on = edited_on;
    }
    
    
}
