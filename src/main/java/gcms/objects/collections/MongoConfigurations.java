/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.objects.collections;

import gcms.GsonObjects.annotations.gcmsObject;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 *
 * @author Matthias
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class MongoConfigurations {

    @gcmsObject(
            type = "pk",
            createRole = "SYSTEM",
            pk = "{\"relations\": [{\"collection\": \"actions\", \"type\": \"OneToMany\", \"fk\": \"mongoconfiguration\"}, {\"collection\": \"mobCalculatedFields\", \"type\": \"OneToMany\", \"fk\": \"mob\"},"
            + "{\"collection\": \"attributes\", \"type\": \"OneToMany\", \"fk\": \"collection\"}"
            + "]}",
            //editRole = "SYSTEM",
            visibleOnTable = false,
            visibleOnForm = false
    )
    public String mongoconfigurationsid;
    @gcmsObject(
            type = "string",
            editRole = "ADMIN",
            createRole = "ADMIN",
            visibleOnTable = true
    )
    public String name;
    @gcmsObject(
            type = "string",
            editRole = "ADMIN",
            createRole = "ADMIN",
            visibleOnTable = true
    )
    public String database;

    @gcmsObject(
            type = "string",
            editRole = "ADMIN",
            createRole = "ADMIN",
            visibleOnTable = true
    )
    public String collection;

    @gcmsObject(
            type = "string",
            editRole = "ADMIN",
            createRole = "ADMIN",
            visibleOnTable = true
    )
    public String className;

    @gcmsObject(
            type = "string",
            editRole = "ADMIN",
            createRole = "ADMIN",
            visibleOnTable = true
    )
    public String idName;

    @gcmsObject(
            type = "string",
            editRole = "ADMIN",
            createRole = "ADMIN",
            visibleOnTable = true
    )
    public String pluginName;

    public MongoConfigurations() {

    }

    public MongoConfigurations(String mongoconfigurationsid, String name, String database, String collection, String className, String idName, String pluginName) {
        this.mongoconfigurationsid = mongoconfigurationsid;
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
        return mongoconfigurationsid;
    }

    public void setCollectionId(String mongoconfigurationsid) {
        this.mongoconfigurationsid = mongoconfigurationsid;
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
