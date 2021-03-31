/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.Config;

/**
 *
 * @author Matthias
 */
public class RelationParameter {
    //"{'type': 'reference', 'collection': 'functions', 'key': 'functionId', 'value': 'name', 'foreignKey': 'functionId'}",
    
    String type;
    String collection;
    String key;
    String value;
    String foreignKey;

    public RelationParameter() {
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCollection() {
        return collection;
    }

    public void setCollection(String collection) {
        this.collection = collection;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getForeignKey() {
        return foreignKey;
    }

    public void setForeignKey(String foreignKey) {
        this.foreignKey = foreignKey;
    }

    public RelationParameter(String type, String collection, String key, String value, String foreignKey) {
        this.type = type;
        this.collection = collection;
        this.key = key;
        this.value = value;
        this.foreignKey = foreignKey;
    }
    
    
}
