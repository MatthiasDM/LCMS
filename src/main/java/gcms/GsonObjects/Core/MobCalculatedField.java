/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.GsonObjects.Core;

import gcms.GsonObjects.annotations.gcmsObject;

/**
 *
 * @author Matthias
 */
public class MobCalculatedField {

    @gcmsObject(
            type = "pk",
            createRole = "SYSTEM",
            visibleOnTable = false,
            visibleOnForm = false
    )
    public String mobCalculatedFieldId;

    @gcmsObject(
            type = "fk",
            formatterName = "reference",
            fk = "{\"collection\": \"calculatedFields\", \"pk\": \"calculatedFieldId\", \"display\": \"calculatedFieldFieldName\", \"type\": \"ManyToOne\"}",
            editRole = "ADMIN"
    )
    public String calculatedField;

    @gcmsObject(
            type = "fk",
            formatterName = "reference",
            fk = "{\"collection\": \"mongoconfigurations\", \"pk\": \"mongoconfigurationsid\", \"display\": \"name\", \"type\": \"ManyToOne\"}",
            editRole = "ADMIN"
    )
    public String mob;

    @gcmsObject(
            type = "boolean",
            visibleOnTable = true,
            visibleOnForm = true
    )
    public String archived;

    @gcmsObject(
            type = "datetime",
            visibleOnTable = false,
            visibleOnForm = false,
            editRole = "SYSTEM",
            createRole = "SYSTEM")
    public long created_on;
}
