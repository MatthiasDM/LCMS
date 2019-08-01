/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm.GsonObjects.Core;

import mdm.pojo.annotations.MdmAnnotations;

/**
 *
 * @author Matthias
 */
public class MongoConfigurations {

    @MdmAnnotations(
            type = "string",
            createRole = "SYSTEM",
            //editRole = "SYSTEM",
            visibleOnTable = false,
            visibleOnForm = false
    )
    public String mongoconfigurationsid;
    @MdmAnnotations(
            type = "string",
            editRole = "ICTMANAGER",
            createRole = "ICTMANAGER",
            visibleOnTable = true
    )
    public String name;
    @MdmAnnotations(
            type = "string",
            editRole = "ICTMANAGER",
            createRole = "ICTMANAGER",
            visibleOnTable = true
    )
    public String database;

    @MdmAnnotations(
            type = "string",
            editRole = "ICTMANAGER",
            createRole = "ICTMANAGER",
            visibleOnTable = true
    )
    public String collection;

    @MdmAnnotations(
            type = "string",
            editRole = "ICTMANAGER",
            createRole = "ICTMANAGER",
            visibleOnTable = true
    )
    public String className;

    @MdmAnnotations(
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
