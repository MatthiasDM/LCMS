/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm.GsonObjects;

/**
 *
 * @author matmey
 */
public class Session {

    String username;
    String sessionID;
    String userid;
    long validity;
    boolean valid;

    public Session(){}
    
    public Session(String username, String sessionID, long validity, boolean valid, String userid) {
        this.username = username;
        this.sessionID = sessionID;
        this.validity = validity;
        this.valid = valid;
        this.userid = userid;
    }

    public String getUserid() {
        return userid;
    }

    public void setUserid(String userid) {
        this.userid = userid;
    }
    
    
    public String getSessionId() {
        return sessionID;
    }

    public void setSessionId(String sessionId) {
        this.sessionID = sessionId;
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }
    
    

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getSessionID() {
        return sessionID;
    }

    public void setSessionID(String sessionID) {
        this.sessionID = sessionID;
    }

    public long getValidity() {
        return validity;
    }

    public void setValidity(long validity) {
        this.validity = validity;
    }



}
