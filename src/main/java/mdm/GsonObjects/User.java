/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm.GsonObjects;

import java.util.List;
import mdm.pojo.annotations.MdmAnnotations;

/**
 *
 * @author matmey
 */
public class User {

    @MdmAnnotations(
            viewRole = "ICTMANAGER",
            createRole = "SYSTEM",
            editRole = "LABASSISTANT",
            type = "string",
            visibleOnTable = false,
            visibleOnForm = false)
    public String userid;
    @MdmAnnotations(
            type = "string",
            visibleOnTable = true,
            editRole = "ICTMANAGER")
    public String username;
    @MdmAnnotations(
            type = "password",
            visibleOnTable = false,
            visibleOnForm = true,
            editRole = "ICTMANAGER")
    public String password;
    @MdmAnnotations(
            type = "String",
            visibleOnTable = false,
            visibleOnForm = true,
            editRole = "ICTMANAGER")
    public String INSS;
    @MdmAnnotations(
            type = "email",
            visibleOnTable = true)
    public String email;
    @MdmAnnotations(
            type = "select",
            multiple = true,
            reference = {"Enum", "Roles"},
            visibleOnTable = true,
            editRole = "ICTMANAGER")
    public List<String> roles;
    @MdmAnnotations(type = "boolean", visibleOnTable = true)
    public boolean ldap;

    public User() {
    }

    public User(String userid, String username, String password, String email, List<String> roles, boolean ldap) {
        this.userid = userid;
        this.username = username;
        this.password = password;
        this.email = email;
        this.roles = roles;
        this.ldap = ldap;
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
