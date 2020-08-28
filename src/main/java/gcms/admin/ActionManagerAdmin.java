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
import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.Map;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mongodb.BasicDBObject;
import java.io.IOException;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import gcms.Core;
import gcms.database.DatabaseActions;
import java.util.UUID;
import gcms.Config.MongoConf;
import gcms.Config.Roles;
import static gcms.Core.StringToLong;
import static gcms.Core.checkUserRole;
import static gcms.Core.createDatabaseObject;
import gcms.GsonObjects.Role;
import gcms.GsonObjects.Core.User;
import static gcms.database.DatabaseActions.getDocumentPriveleges;
import gcms.database.DatabaseWrapper;
import gcms.GsonObjects.annotations.MdmAnnotations;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.jasypt.util.password.StrongPasswordEncryptor;

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

//        if (action == gcms.Config.Actions.ADMIN_LOADUSERS) {
//            sb.append(actionADMIN_LOADUSERS());
//
//        }
//        if (action == gcms.Config.Actions.ADMIN_EDITUSERS) {
//            sb.append(actionADMIN_EDITUSERS());
//
//        }
        return sb;
    }

    private StringBuilder actionADMIN_EDITUSERS() throws IOException, ClassNotFoundException, NoSuchFieldException {
        StringBuilder sb = new StringBuilder();
        if (cookie != null) {
            if (checkUserRole(cookie, gcms.Config.Roles.ADMIN)) {
                requestParameters.remove("action");
                requestParameters.remove("LCMS_session");
                String operation = requestParameters.get("oper")[0];
                if (requestParameters.get("oper") != null) {
                    if (operation.equals("edit")) {
                        requestParameters.remove("oper");
                        requestParameters.remove("password");
                        requestParameters.remove("id");
                        // User user = createUserObject(requestParameters.get("userid")[0], "edit");
                        Class cls = Class.forName(MongoConf.USERS.getClassName());
                        HashMap<String, Object> obj = createDatabaseObject(requestParameters, cls);
                        DatabaseWrapper.editObjectData(obj, gcms.Config.MongoConf.USERS, cookie);
                    }
                    if (operation.equals("add")) {
                        StrongPasswordEncryptor passwordEncryptor = new StrongPasswordEncryptor();
                        requestParameters.remove("oper");
                        requestParameters.get("password")[0] = passwordEncryptor.encryptPassword(requestParameters.get("password")[0]);
                        UUID id = UUID.randomUUID();
                        User user = createUserObject(id.toString(), "add");
                        ObjectMapper mapper = new ObjectMapper();
                        Document document = Document.parse(mapper.writeValueAsString(user));
                        // DatabaseActions.insertObjectItem(MongoConf.USERS, document);
                        DatabaseWrapper.addObject(document, gcms.Config.MongoConf.USERS, cookie);

                    }
                }
            }
        } else {
            sb.append(DatabaseWrapper.getWebPage("credentials/index.html", new String[]{}));
        }
        return sb;
    }

    private StringBuilder actionADMIN_LOADUSERS() throws JsonProcessingException, ClassNotFoundException, NoSuchFieldException, IOException {
        StringBuilder sb = new StringBuilder();
        if (cookie == null) {
            sb.append(DatabaseWrapper.getWebPage("credentials/index.html", new String[]{}));
        } else {
            if (action == gcms.Config.Actions.ADMIN_LOADUSERS) {
                if (Core.checkSession(cookie)) {
                    sb.append(DatabaseWrapper.getObjectData(cookie, gcms.Config.MongoConf.USERS, "user_table", new BasicDBObject(), new String[]{}));
                } else {
                    sb.append(DatabaseWrapper.getWebPage("credentials/index.html", new String[]{}));
                }
            }

        }
        return sb;
    }

    private User createUserObject(String _id, String type) throws ClassNotFoundException {
        User user = new User();
        user.setUserid(_id);

        List<Field> systemFields = Core.getSystemFields(gcms.Config.MongoConf.USERS.getClassName(), type);
        for (Field systemField : systemFields) {
            requestParameters.remove(systemField.getName());
        }
        if (requestParameters.get("roles") != null) {
            user.setRoles(Arrays.asList(requestParameters.get("roles")));
        }
        if (requestParameters.get("username") != null) {
            user.setUsername(requestParameters.get("username")[0]);
        }
        if (requestParameters.get("password") != null) {
            user.setPassword(requestParameters.get("password")[0]);
        }

        if (requestParameters.get("ldap") != null) {
            user.setLdap(Boolean.valueOf(requestParameters.get("ldap")[0]));
        }
        if (requestParameters.get("email") != null) {
            user.setEmail((requestParameters.get("email")[0]));
        }

        return user;
    }

}
