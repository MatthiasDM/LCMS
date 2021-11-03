/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package sdm.gcms.GsonObjects.Core;

import sdm.gcms.shared.database.filters.annotation.gcmsObject;


/**
 *
 * @author Matthias
 */
public class Dependency {

    @gcmsObject(
            type = "pk",
            pk = "{\"relations\": [{\"collection\": \"pageDependencies\", \"type\": \"OneToMany\", \"fk\": \"dependency\"}]}",
            createRole = "SYSTEM",
            visibleOnTable = false,
            visibleOnForm = false
    )
    public String dependencyId;
    @gcmsObject(
            type = "string",
            editRole = "ADMIN",
            createRole = "ADMIN",
            visibleOnTable = true
    )
    public String dependencyFieldName;
    @gcmsObject(
            type = "select",
            editRole = "ADMIN",
            choices = {"Script", "Stylesheet", "HTML", "Mixed"}
    )
    public String dependencyType;
    @gcmsObject(
            type = "cktext_code",
            editRole = "ADMIN",
            createRole = "ADMIN",
            visibleOnTable = false
    )
    public String dependencyValue;

}
