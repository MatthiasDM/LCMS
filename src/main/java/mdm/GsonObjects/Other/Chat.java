/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm.GsonObjects.Other;

import mdm.pojo.annotations.MdmAnnotations;

/**
 *
 * @author Matthias
 */
public class Chat {

    @MdmAnnotations(type = "string", visibleOnTable = false, visibleOnForm = false, createRole = "SYSTEM")
    public String chatid;
    @MdmAnnotations(type = "string", visibleOnTable = false, visibleOnForm = false, createRole = "SYSTEM")
    public String sessionid;
    @MdmAnnotations(type = "string", visibleOnTable = false, visibleOnForm = false)
    public String correspondent;
    @MdmAnnotations(type = "string", visibleOnTable = false, visibleOnForm = true)
    public String timestamp;
    @MdmAnnotations(type = "string", visibleOnTable = false, visibleOnForm = true)
    public String message;

    @MdmAnnotations(
            type = "date",
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

    public Chat(String chatid, String sessionid, String correspondent, String timestamp, String message, long created_on, String created_by) {
        this.chatid = chatid;
        this.sessionid = sessionid;
        this.correspondent = correspondent;
        this.timestamp = timestamp;
        this.message = message;
        this.created_on = created_on;
        this.created_by = created_by;
    }

    public Chat() {
    }

    public String getChatid() {
        return chatid;
    }

    public void setChatid(String chatid) {
        this.chatid = chatid;
    }

    public String getSessionid() {
        return sessionid;
    }

    public void setSessionid(String sessionid) {
        this.sessionid = sessionid;
    }

    public String getCorrespondent() {
        return correspondent;
    }

    public void setCorrespondent(String correspondent) {
        this.correspondent = correspondent;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
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
