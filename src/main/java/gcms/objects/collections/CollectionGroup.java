/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.objects.collections;

import gcms.GsonObjects.annotations.gcmsObject;
import java.util.List;

/**
 *
 * @author Matthias
 */
public class CollectionGroup {

    @gcmsObject(
            type = "pk"
    )
    public String collectionGroupId;
    
    @gcmsObject(
            type = "string"
    )
    public String name;

    @gcmsObject(
            type = "select",
            multiple = true,
            reference = {"Mongo", "collections", "collectionId", "collection"},
            visibleOnTable = true,
            editRole = "ADMIN")
    public List<String> collections;
}
