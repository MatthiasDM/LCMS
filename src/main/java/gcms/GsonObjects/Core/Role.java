/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.GsonObjects.Core;

import java.util.List;
import gcms.GsonObjects.annotations.MdmAnnotations;

/**
 *
 * @author Matthias
 */
public class Role {

    @MdmAnnotations(
            viewRole = "ICTMANAGER",
            createRole = "SYSTEM",
            //editRole = "ICTMANAGER",
            type = "string",
            visibleOnTable = false,
            visibleOnForm = false)
    public String roleid;
    @MdmAnnotations(
            type = "string",
            editRole = "ICTMANAGER",
            visibleOnTable = true
    )
    public String role;

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

    public Role(String roleid, String role) {
        this.roleid = roleid;
        this.role = role;
    }
      

  
    

}
