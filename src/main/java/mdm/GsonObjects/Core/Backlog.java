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
 * @author matmey
 */
public class Backlog {

    @MdmAnnotations(type = "string", visibleOnTable = false, visibleOnForm = false)
    public String backlogid;
    @MdmAnnotations(type = "string", visibleOnTable = false, visibleOnForm = false)
    public String object_type;
    @MdmAnnotations(type = "string", visibleOnTable = false, visibleOnForm = false)
    public String object_id;
    @MdmAnnotations(type = "string", visibleOnTable = false, visibleOnForm = true)
    public String changes;

    @MdmAnnotations(
            type = "date",
            visibleOnTable = true,
            visibleOnForm = false,
            editRole = "ICTMANAGER",
            createRole = "SYSTEM")
    public long created_on;
    @MdmAnnotations(
            type = "ref",
            visibleOnTable = false,
            visibleOnForm = false,
            viewRole = "ICTMANAGER",
            createRole = "SYSTEM",
            editRole = "ICTMANAGER")
    public String created_by;
        
    public Backlog() {
    }

    public Backlog(String backlogid, String object_type, String object_id, String changes, long created_on, String created_by) {
        this.backlogid = backlogid;
        this.object_type = object_type;
        this.object_id = object_id;
        this.changes = changes;
        this.created_on = created_on;
        this.created_by = created_by;
    }

    
    
    public String getBacklogid() {
        return backlogid;
    }

    public void setBacklogid(String backlogid) {
        this.backlogid = backlogid;
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

    public String getChanges() {
        return changes;
    }

    public void setChanges(String changes) {
        this.changes = changes;
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

    
    
    
}
