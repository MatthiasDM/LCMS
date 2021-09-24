/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.objects.priveleges.roles;

import gcms.GsonObjects.annotations.gcmsObject;

/**
 *
 * @author Matthias
 */
public class DocumentRolePrivelege {

    @gcmsObject(
            type = "pk"
    )
    public String documentRolePrivelegeId;

    @gcmsObject(
            type = "fk",
            formatterName = "reference",
            fk = "{\"collection\": \"collections\", \"pk\": \"collectionId\", \"display\": \"name\", \"type\": \"ManyToOne\"}"
    )
    public String collection;

    @gcmsObject(
            type = "string"
    )
    public String document;

    @gcmsObject(
            type = "fk",
            formatterName = "reference",
            fk = "{\"collection\": \"roles\", \"pk\": \"roleId\", \"display\": \"role\", \"type\": \"ManyToOne\"}"
    )
    public String role;

    @gcmsObject(
            type = "fk",
            formatterName = "reference",
            fk = "{\"collection\": \"methods\", \"pk\": \"methodId\", \"display\": \"method\", \"type\": \"ManyToOne\"}"
    )
    public String method;

}
