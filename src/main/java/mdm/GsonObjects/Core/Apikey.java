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
            editRole = "ADMIN, ICTMANAGER",
            viewRole = "ICTMANAGER"
    )
    public String keyprefix;
    @MdmAnnotations(
            type = "string",
            editRole = "ADMIN, ICTMANAGER"
    )
    public String hashedkey;
    @MdmAnnotations(
            type = "string",
            editRole = "ADMIN, ICTMANAGER"
    )
    public String url;
    @MdmAnnotations(
            type = "string",
            editRole = "ADMIN, ICTMANAGER"
    )
    public String port;
    @MdmAnnotations(
            type = "select",
            multiple = true,
            reference = {"Mongo", "commands", "commandid", "name"},
            visibleOnTable = true,
            editRole = "ADMIN, ICTMANAGER")
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

    public Apikey(String apikeyid, String name, String keyprefix, String hashedkey, String url, String port, long created_on, String created_by) {
        this.apikeyid = apikeyid;
        this.name = name;
        this.keyprefix = keyprefix;
        this.hashedkey = hashedkey;
        this.url = url;
        this.port = port;
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

    public String getHashedkey() {
        return hashedkey;
    }

    public void setHashedkey(String hashedkey) {
        this.hashedkey = hashedkey;
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

}
