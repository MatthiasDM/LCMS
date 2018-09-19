/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm.Config;

import java.util.HashMap;

/**
 *
 * @author Matthias
 */
public interface servletInterface {
    
    public mdm.Config.Actions getAction();
    public String getCookie();
    public StringBuilder startAction();
    
}
