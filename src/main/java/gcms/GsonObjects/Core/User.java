/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.GsonObjects.Core;

import java.util.List;
import gcms.GsonObjects.annotations.gcmsObject;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
/**
 *
 * @author Matthias
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class User {

    @gcmsObject(
            createRole = "SYSTEM",
            editRole = "ADMIN",
            type = "string",
            visibleOnTable = false,
            visibleOnForm = false)
    public String userid;
    @gcmsObject(
            type = "string",
            visibleOnTable = true,
            editRole = "ADMIN")
    public String username;
    @gcmsObject(
            type = "encrypted",
            visibleOnTable = false,
            visibleOnForm = true,
            editRole = "ADMIN")
    public String password;
    @gcmsObject(
            type = "boolean",
            visibleOnTable = true,
            visibleOnForm = true,
            editRole = "ADMIN")
    public String passwordLock;
    @gcmsObject(
            type = "String",
            visibleOnTable = false,
            visibleOnForm = true,
            editRole = "ADMIN")
    public String INSS;
    @gcmsObject(
            type = "email",
            visibleOnTable = true)
    public String email;
    @gcmsObject(
            type = "select",
            multiple = true,
            reference = {"Mongo", "roles", "role", "role"},
            visibleOnTable = true,
            editRole = "ADMIN")
    public List<String> roles;
    @gcmsObject(type = "boolean", visibleOnTable = true)
    public boolean ldap;
    @gcmsObject(
            type = "string",
            visibleOnTable = true,
            editRole = "ADMIN")
    public String sessionValidity;

    public User() {
    }

    public String getSessionValidity() {
        return sessionValidity;
    }

    public void setSessionValidity(String sessionValidity) {
        this.sessionValidity = sessionValidity;
    }

    public User(String userid, String username, String password, String INSS, String email, List<String> roles, boolean ldap, String sessionValidity) {
        this.userid = userid;
        this.username = username;
        this.password = password;
        this.INSS = INSS;
        this.email = email;
        this.roles = roles;
        this.ldap = ldap;
        this.sessionValidity = sessionValidity;
    }

    public String getINSS() {
        return INSS;
    }

    public void setINSS(String INSS) {
        this.INSS = INSS;
    }

    public String getUserid() {
        return userid;
    }

    public void setUserid(String userid) {
        this.userid = userid;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public Boolean getLdap() {
        return ldap;
    }

    public void setLdap(boolean ldap) {
        this.ldap = ldap;
    }

}
