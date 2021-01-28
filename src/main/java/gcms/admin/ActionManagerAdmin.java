/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.admin;

/**
 *
 * @author matmey
 */
import com.mongodb.BasicDBObject;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import static gcms.Core.checkUserRole;
import gcms.database.DatabaseWrapper;

public class ActionManagerAdmin {

    String cookie;
    gcms.Config.Actions action;
    HashMap<String, String[]> requestParameters = new HashMap<String, String[]>();

    public ActionManagerAdmin(Map<String, String[]> requestParameters) {
        this.requestParameters = new HashMap<String, String[]>(requestParameters);
        if (requestParameters.get("action") != null) {
            action = gcms.Config.Actions.valueOf(requestParameters.get("action")[0]);
        }
        if (requestParameters.get("LCMS_session") != null) {
            cookie = requestParameters.get("LCMS_session")[0];
        }
    }

    public String getCookie() {
        return cookie;
    }

    public gcms.Config.Actions getAction() {
        return action;
    }

    public StringBuilder startAction() throws ClassNotFoundException, IOException, NoSuchFieldException {
        StringBuilder sb = new StringBuilder();
        if (action == gcms.Config.Actions.ADMIN_LOADPAGE) {
            if (checkUserRole(cookie, gcms.Config.Roles.ADMIN)) {
                //  Object[] possibleValues = gcms.Config.Roles.ADMIN.getDeclaringClass().getEnumConstants();
                sb.append(DatabaseWrapper.getWebPage("admin/tools/index.html", new String[]{}));
            } else {
                sb.append(DatabaseWrapper.getWebPage("credentials/index.html", new String[]{}));
            }
        } else {

            if (action.toString().contains("EDIT")) {
                sb.append(DatabaseWrapper.actionEDITOBJECT(requestParameters, cookie, action.getMongoConf()));
            } else {
                if (action.toString().contains("LOAD")) {
                    sb.append(DatabaseWrapper.actionLOADOBJECT(cookie, action.getMongoConf(), new BasicDBObject(), new String[]{}));
                }
            }
        }
        return sb;
    }
   
}
