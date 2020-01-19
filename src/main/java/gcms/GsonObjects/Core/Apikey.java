/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.GsonObjects.Core;

import gcms.GsonObjects.annotations.MdmAnnotations;

/**
 *
 * @author Matthias
 */
public class Apikey {

    @MdmAnnotations(type = "string", visibleOnTable = false, visibleOnForm = false)
    public String apikeyid;
    @MdmAnnotations(
            type = "string",
            editRole = "ADMIN"
    )
    public String name;
    @MdmAnnotations(
            type = "string",
            editRole = "ICTMANAGER",
            viewRole = "ICTMANAGER"
    )
    public String keyprefix;
    @MdmAnnotations(
            type = "encrypted",
            editRole = "ICTMANAGER",
            viewRole = "ICTMANAGER"
    )
    public String apiKey;
    @MdmAnnotations(
            type = "boolean",
            editRole = "ICTMANAGER",
            viewRole = "ICTMANAGER"
    )
    public String apiKeyLock;
    @MdmAnnotations(
            type = "string",
            editRole = "ICTMANAGER"
    )
    public String url;
    @MdmAnnotations(
            type = "select",
            editRole = "ICTMANAGER",
            choices = {"Incoming", "Outgoing"}
    )
    public String connection;

    @MdmAnnotations(
            type = "string",
            editRole = "ICTMANAGER"
    )

    public String port;
    @MdmAnnotations(
            type = "select",
            multiple = true,
            reference = {"Mongo", "commands", "commandid", "name"},
            visibleOnTable = true,
            editRole = "ICTMANAGER")
    public String scope;

    @MdmAnnotations(
            type = "datetime",
            visibleOnTable = true,
            visibleOnForm = false,
            editRole = "ICTMANAGER",
            createRole = "SYSTEM")
    public long created_on;
    @MdmAnnotations(
            type = "ref",
            visibleOnTable = false,
            visibleOnForm = false,
            viewRole = "ICTMANAGER",
            createRole = "SYSTEM",
            editRole = "ICTMANAGER")
    public String created_by;

    public Apikey() {
    }

    public Apikey(String apikeyid, String name, String keyprefix, String apiKey, String apiKeyLock, String url, String port, String scope, long created_on, String created_by) {
        this.apikeyid = apikeyid;
        this.name = name;
        this.keyprefix = keyprefix;
        this.apiKey = apiKey;
        this.apiKeyLock = apiKeyLock;
        this.url = url;
        this.port = port;
        this.scope = scope;
        this.created_on = created_on;
        this.created_by = created_by;
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

    public String getScope() {
        return scope;
    }

    public void setScope(String scope) {
        this.scope = scope;
    }

}
