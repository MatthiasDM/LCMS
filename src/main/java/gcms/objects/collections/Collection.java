/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.objects.collections;

import gcms.GsonObjects.Core.*;
import gcms.GsonObjects.annotations.gcmsObject;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 *
 * @author Matthias
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class Collection {

    @gcmsObject(
            type = "pk",
            createRole = "SYSTEM",
            pk = "{\"relations\": ["
            + " {\"collection\": \"mobCalculatedFields\", \"type\": \"OneToMany\", \"fk\": \"mob\"},"
            + "{\"collection\": \"actions\", \"type\": \"OneToMany\", \"fk\": \"collection\"}"
            + "]}",
            visibleOnTable = false,
            visibleOnForm = false
    )
    public String collectionId;
    @gcmsObject(
            type = "string"
    )
    public String name;
    @gcmsObject(
            type = "string"
    )
    public String database;
    @gcmsObject(
            type = "string"
    )
    public String collection;

    @gcmsObject(
            type = "string"
    )
    public String className;

    @gcmsObject(
            type = "string"
    )
    public String idName;

    @gcmsObject(
            type = "string"
    )
    public String pluginName;

    public Collection() {

    }

    public Collection(String collectionId, String name, String database, String collection, String className, String idName, String pluginName) {
        this.collectionId = collectionId;
        this.name = name;
        this.database = database;
        this.collection = collection;
        this.className = className;
        this.idName = idName;
        this.pluginName = pluginName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPluginName() {
        return pluginName;
    }

    public void setPluginName(String pluginName) {
        this.pluginName = pluginName;
    }

    public String getCollectionId() {
        return collectionId;
    }

    public void setCollectionId(String collectionId) {
        this.collectionId = collectionId;
    }

    public void setDatabase(String database) {
        this.database = database;
    }

    public String getCollection() {
        return collection;
    }

    public void setCollection(String collection) {
        this.collection = collection;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public String getIdName() {
        return idName;
    }

    public void setIdName(String idName) {
        this.idName = idName;
    }

}
