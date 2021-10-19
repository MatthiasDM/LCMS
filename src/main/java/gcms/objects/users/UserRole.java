/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.objects.users;

import gcms.GsonObjects.annotations.gcmsObject;

/**
 *
 * @author Matthias
 */
public class UserRole {

    @gcmsObject(
            type = "pk",
            createRole = "SYSTEM",
            visibleOnTable = false,
            visibleOnForm = false
    )
    public String userRoleId;

    @gcmsObject(
            type = "fk",
            formatterName = "reference",
            fk = "{\"collection\": \"roles\", \"pk\": \"roleid\", \"display\": \"role\", \"type\": \"ManyToOne\"}"
    )
    public String role;

    @gcmsObject(
            type = "fk",
            formatterName = "reference",
            fk = "{\"collection\": \"users\", \"pk\": \"userid\", \"display\": \"username\", \"type\": \"ManyToOne\"}"
    )
    public String user;

}
