/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.objects.priveleges.users;

import gcms.GsonObjects.annotations.gcmsObject;
import gcms.objects.priveleges.roles.*;

/**
 *
 * @author Matthias
 */
public class FieldUserPrivelege {

    @gcmsObject(
            type = "pk"
    )
    public String fieldUserPrivelegeId;

    @gcmsObject(
            type = "fk",
            formatterName = "reference",
            fk = "{\"collection\": \"collections\", \"pk\": \"collectionId\", \"display\": \"name\", \"type\": \"ManyToOne\"}"
    )
    public String collection;

    @gcmsObject(
            type = "string"
    )
    public String field;

    @gcmsObject(
            type = "fk",
            formatterName = "reference",
            fk = "{\"collection\": \"users\", \"pk\": \"userid\", \"display\": \"username\", \"type\": \"ManyToOne\"}"
    )
    public String user;

    @gcmsObject(
            type = "fk",
            formatterName = "reference",
            fk = "{\"collection\": \"methods\", \"pk\": \"methodId\", \"display\": \"method\", \"type\": \"ManyToOne\"}"
    )
    public String method;
}
