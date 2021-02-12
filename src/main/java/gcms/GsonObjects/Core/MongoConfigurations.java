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
public class MongoConfigurations {

    @gcmsObject(
            type = "string",
            createRole = "SYSTEM",
            //editRole = "SYSTEM",
            visibleOnTable = false,
            visibleOnForm = false
    )
    public String mongoconfigurationsid;
    @gcmsObject(
            type = "string",
            editRole = "ICTMANAGER",
            createRole = "ICTMANAGER",
            visibleOnTable = true
    )
    public String name;
    @gcmsObject(
            type = "string",
            editRole = "ICTMANAGER",
            createRole = "ICTMANAGER",
            visibleOnTable = true
    )
    public String database;

    @gcmsObject(
            type = "string",
            editRole = "ICTMANAGER",
            createRole = "ICTMANAGER",
            visibleOnTable = true
    )
    public String collection;

    @gcmsObject(
            type = "string",
            editRole = "ICTMANAGER",
            createRole = "ICTMANAGER",
            visibleOnTable = true
    )
    public String className;

    @gcmsObject(
            type = "string",
            editRole = "ICTMANAGER",
            createRole = "ICTMANAGER",
            visibleOnTable = true
    )
    public String idName;



    public MongoConfigurations() {
    }

    public MongoConfigurations(String mongoconfigurationsid, String name, String database, String collection, String className, String idName) {
        this.mongoconfigurationsid = mongoconfigurationsid;
        this.name = name;
        this.database = database;
        this.collection = collection;
        this.className = className;
        this.idName = idName;
    }


 
    

    public String getMongoconfigurationsid() {
        return mongoconfigurationsid;
    }

    public void setMongoconfigurationsid(String mongoconfigurationsid) {
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
