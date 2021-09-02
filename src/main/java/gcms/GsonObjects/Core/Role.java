/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.GsonObjects.Core;

import java.util.List;
import gcms.GsonObjects.annotations.gcmsObject;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 *
 * @author Matthias
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class Role {

    @gcmsObject(
            viewRole = "ADMIN",
            createRole = "SYSTEM",
            //editRole = "ADMIN",
            type = "string",
            visibleOnTable = false,
            visibleOnForm = false)
    public String roleid;
    @gcmsObject(
            type = "string",
            editRole = "ADMIN",
            visibleOnTable = true
    )
    public String role;

    @gcmsObject(
            type = "string",
            visibleOnTable = true
    )
    public int levelCode;

    public String getRoleid() {
        return roleid;
    }

    public void setRoleid(String roleid) {
        this.roleid = roleid;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Role() {
    }

    public int getLevelCode() {
        return levelCode;
    }

    public void setLevelCode(int levelCode) {
        this.levelCode = levelCode;
    }

    public Role(String roleid, String role, int levelCode) {
        this.roleid = roleid;
        this.role = role;
        this.levelCode = levelCode;
    }



}
