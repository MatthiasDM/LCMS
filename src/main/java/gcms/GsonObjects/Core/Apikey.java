/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.GsonObjects.Core;

import java.util.List;
import gcms.GsonObjects.annotations.gcmsObject;

/**
 *
 * @author Matthias
 */
public class Apikey {

    @gcmsObject(type = "string", visibleOnTable = false, visibleOnForm = false)
    public String apikeyid;
    @gcmsObject(
            type = "string",
            editRole = "ADMIN"
    )
    public String name;
    @gcmsObject(
            type = "string",
            editRole = "ICTMANAGER",
            viewRole = "ICTMANAGER"
    )
    public String keyprefix;
    @gcmsObject(
            type = "encrypted",
            editRole = "ICTMANAGER",
            viewRole = "ICTMANAGER"
    )
    public String apiKey;
    @gcmsObject(
            type = "boolean",
            editRole = "ICTMANAGER",
            viewRole = "LABASSISTANT"
    )
    public String apiKeyLock;
    @gcmsObject(
            type = "string",
            editRole = "ICTMANAGER"
    )
    public String url;
    @gcmsObject(
            type = "select",
            editRole = "ICTMANAGER",
            choices = {"Incoming", "Outgoing"}
    )
    public String connection;

    @gcmsObject(
            type = "string",
            editRole = "ICTMANAGER"
    )

    public String port;
    @gcmsObject(
            type = "select",
            multiple = true,
            reference = {"Mongo", "commands", "commandid", "name"},
            visibleOnTable = true,
            editRole = "ICTMANAGER")
    public List<String> scope;

    @gcmsObject(type = "boolean", visibleOnTable = true)
    public boolean valid;

    @gcmsObject(
            type = "datetime",
            visibleOnTable = true,
            visibleOnForm = false,
            editRole = "ICTMANAGER",
            createRole = "SYSTEM")
    public long created_on;
    @gcmsObject(
            type = "ref",
            visibleOnTable = false,
            visibleOnForm = false,
            viewRole = "ICTMANAGER",
            createRole = "SYSTEM",
            editRole = "ICTMANAGER")
    public String created_by;

    public Apikey() {
    }

   

    public String getConnection() {
        return connection;
    }

    public void setConnection(String connection) {
        this.connection = connection;
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

  

    public String getApikeyid() {
        return apikeyid;
    }

    public void setApikeyid(String apikeyid) {
        this.apikeyid = apikeyid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getKeyprefix() {
        return keyprefix;
    }

    public void setKeyprefix(String keyprefix) {
        this.keyprefix = keyprefix;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getPort() {
        return port;
    }

    public void setPort(String port) {
        this.port = port;
    }

    public long getCreated_on() {
        return created_on;
    }

    public void setCreated_on(long created_on) {
        this.created_on = created_on;
    }

    public String getCreated_by() {
        return created_by;
    }

    public void setCreated_by(String created_by) {
        this.created_by = created_by;
    }

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public String getApiKeyLock() {
        return apiKeyLock;
    }

    public void setApiKeyLock(String apiKeyLock) {
        this.apiKeyLock = apiKeyLock;
    }

    public List<String> getScope() {
        return scope;
    }

    public void setScope(List<String> scope) {
        this.scope = scope;
    }

    public Apikey(String apikeyid, String name, String keyprefix, String apiKey, String apiKeyLock, String url, String connection, String port, List<String> scope, boolean valid, long created_on, String created_by) {
        this.apikeyid = apikeyid;
        this.name = name;
        this.keyprefix = keyprefix;
        this.apiKey = apiKey;
        this.apiKeyLock = apiKeyLock;
        this.url = url;
        this.connection = connection;
        this.port = port;
        this.scope = scope;
        this.valid = valid;
        this.created_on = created_on;
        this.created_by = created_by;
    }

 
}
