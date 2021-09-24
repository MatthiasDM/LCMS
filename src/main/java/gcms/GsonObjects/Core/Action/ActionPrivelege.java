/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.GsonObjects.Core.Action;

import gcms.GsonObjects.annotations.gcmsObject;
import java.util.List;

/**
 *
 * @author Matthias
 */
public class ActionPrivelege {

    @gcmsObject(
            type = "pk",
            key = true,
            visibleOnTable = false,
            visibleOnForm = false)
    public String actionPrivelegeId;

    @gcmsObject(
            type = "select",
            reference = {"Mongo", "roles", "role", "role"},
            visibleOnTable = true,
            multiple = true,
            editRole = "ADMIN")
    public List<String> executionRoles;

    @gcmsObject(
            type = "select",
            reference = {"Mongo", "users", "userid", "username"},
            visibleOnTable = true,
            multiple = true,
            editRole = "ADMIN")
    public List<String> executionUsers;

    @gcmsObject(
            type = "boolean")
    public String session;

    @gcmsObject(
            type = "fk",
            formatterName = "reference",
            fk = "{\"collection\": \"actions\", \"pk\": \"actionsid\", \"display\": \"name\", \"type\": \"ManyToOne\"}",
            editRole = "ADMIN"
    )
    public String action;

    @gcmsObject(
            type = "datetime",
            visibleOnTable = false,
            visibleOnForm = true,
            createRole = "SYSTEM",
            editRole = "SYSTEM")
    public long edited_on;

    @gcmsObject(
            type = "datetime",
            visibleOnTable = false,
            visibleOnForm = true,
            createRole = "SYSTEM",
            editRole = "SYSTEM")
    public long created_on;
}
