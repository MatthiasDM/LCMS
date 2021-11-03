/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package sdm.gcms.servlet;

/**
 *
 * @author Matthias
 */
public class Response {

    int responseStatus;
    StringBuilder sb;

    public Response() {
    }

    public Response(int responseStatus, StringBuilder sb) {
        this.responseStatus = responseStatus;
        this.sb = sb;
    }

    public StringBuilder getSb() {
        return sb;
    }

    public void setSb(StringBuilder sb) {
        this.sb = sb;
    }
}
