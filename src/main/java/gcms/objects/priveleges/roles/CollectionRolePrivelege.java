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
public class CollectionRolePrivelege {

    @gcmsObject(
            type = "pk"
    )
    public String collectionRolePrivelegeId;

    @gcmsObject(
            type = "string"
    )
    public String name;

    @gcmsObject(
            type = "fk",
            formatterName = "reference",
            fk = "{\"collection\": \"collectionGroups\", \"pk\": \"collectionGroupId\", \"display\": \"name\", \"type\": \"ManyToOne\"}"
    )
    public String collectionGroup;

    @gcmsObject(
            type = "fk",
            formatterName = "reference",
            fk = "{\"collection\": \"roles\", \"pk\": \"roleid\", \"display\": \"role\", \"type\": \"ManyToOne\"}"
    )
    public String role;

    @gcmsObject(
            type = "fk",
            formatterName = "reference",
            fk = "{\"collection\": \"methods\", \"pk\": \"methodId\", \"display\": \"method\", \"type\": \"ManyToOne\"}"
    )
    public String method;

    public CollectionRolePrivelege() {
    }

    public CollectionRolePrivelege(String collectionRolePrivelegeId, String name, String collectionGroup, String role, String method) {
        this.collectionRolePrivelegeId = collectionRolePrivelegeId;
        this.name = name;
        this.collectionGroup = collectionGroup;
        this.role = role;
        this.method = method;
    }

    
    
    public String getCollectionRolePrivelegeId() {
        return collectionRolePrivelegeId;
    }

    public void setCollectionRolePrivelegeId(String collectionRolePrivelegeId) {
        this.collectionRolePrivelegeId = collectionRolePrivelegeId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCollectionGroup() {
        return collectionGroup;
    }

    public void setCollectionGroup(String collectionGroup) {
        this.collectionGroup = collectionGroup;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }
    
    
}
