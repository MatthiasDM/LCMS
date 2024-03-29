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
public class PageDependency {

    @gcmsObject(
            type = "pk",
            createRole = "SYSTEM",
            visibleOnTable = false,
            visibleOnForm = false
    )
    public String pageDependencyId;

    @gcmsObject(
            type = "fk",
            formatterName = "reference",
            fk = "{\"collection\": \"pages\", \"pk\": \"editablepageid\", \"display\": \"title\", \"type\": \"ManyToOne\"}",
            editRole = "ADMIN"
    )
    public String page;
    @gcmsObject(
            type = "fk",
            formatterName = "reference",
            fk = "{\"collection\": \"dependencies\", \"pk\": \"dependencyId\", \"display\": \"dependencyFieldName\", \"type\": \"ManyToOne\"}",
            editRole = "ADMIN"
    )
    public String dependency;

    @gcmsObject(
            type = "boolean",
            visibleOnTable = true,
            visibleOnForm = true
    )
    public boolean archived;

    @gcmsObject(
            type = "datetime",
            visibleOnTable = false,
            visibleOnForm = false,
            editRole = "SYSTEM",
            createRole = "SYSTEM")
    public long created_on;

}
