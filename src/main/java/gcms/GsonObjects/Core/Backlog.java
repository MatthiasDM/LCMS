/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.GsonObjects.Core;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import gcms.GsonObjects.annotations.gcmsObject;

/**
 *
 * @author matmey
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class Backlog {

    @gcmsObject(type = "string", visibleOnTable = false, visibleOnForm = false)
    public String backlogid;
    @gcmsObject(type = "string", visibleOnTable = false, visibleOnForm = false)
    public String object_type;
    @gcmsObject(type = "string", visibleOnTable = false, visibleOnForm = false)
    public String object_id;
    @gcmsObject(type = "string", visibleOnTable = false, visibleOnForm = true)
    public String changes;
    @gcmsObject(type = "string", visibleOnTable = false, visibleOnForm = false)
    public String checksum;

    @gcmsObject(
            type = "datetime",
            visibleOnTable = true,
            visibleOnForm = false,
            editRole = "ADMIN",
            createRole = "SYSTEM")
    public long created_on;
    @gcmsObject(
            type = "ref",
            visibleOnTable = false,
            visibleOnForm = false,
            viewRole = "ADMIN",
            createRole = "SYSTEM",
            editRole = "ADMIN")
    public String created_by;

    public Backlog() {
    }

    public Backlog(String backlogid, String object_type, String object_id, String changes, String checksum, long created_on, String created_by) {
        this.backlogid = backlogid;
        this.object_type = object_type;
        this.object_id = object_id;
        this.changes = changes;
        this.checksum = checksum;
        this.created_on = created_on;
        this.created_by = created_by;
    }

    public String getChecksum() {
        return checksum;
    }

    public void setChecksum(String checksum) {
        this.checksum = checksum;
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
