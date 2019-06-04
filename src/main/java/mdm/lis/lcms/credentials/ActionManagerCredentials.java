/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm.lis.lcms.credentials;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;
import java.io.File;
import java.io.IOException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.http.Cookie;
import mdm.Config.Actions;
import static mdm.Core.checkSession;
import static mdm.Core.getProp;
import mdm.GsonObjects.Core.Session;
import mdm.GsonObjects.Core.User;
import mdm.Mongo.DatabaseActions;
import mdm.Mongo.DatabaseWrapper;
import org.apache.commons.io.FileUtils;
import org.bson.Document;
import org.jasypt.util.password.StrongPasswordEncryptor;

/**
 *
 * @author matmey
 */
public class ActionManagerCredentials {

    String cookie;
    mdm.Config.Actions action;
    String contextPath;
    HashMap<String, String[]> requestParameters = new HashMap<String, String[]>();

    public Actions getAction() {
        return action;
    }

    public void setAction(Actions action) {
        this.action = action;
    }

    public ActionManagerCredentials(Map<String, String[]> requestParameters) {
        this.requestParameters = new HashMap<String, String[]>(requestParameters);
        if (requestParameters.get("action") != null) {
            action = mdm.Config.Actions.valueOf(requestParameters.get("action")[0]);
        }
        if (requestParameters.get("LCMS_session") != null) {
            cookie = requestParameters.get("LCMS_session")[0];
        }
        if (requestParameters.get("contextPath") != null) {
            contextPath = requestParameters.get("contextPath")[0];
        }

    }

    public String getCookie() {
        return cookie;
    }

    public StringBuilder startAction() throws ClassNotFoundException, IOException {
        StringBuilder sb = new StringBuilder();

        if (action == mdm.Config.Actions.CREDENTIALS_USERINFO) {
            sb.append(actionCREDENTIALS_USERINFO());
        }
        if (action == mdm.Config.Actions.CREDENTIALS_LOGOUT) {
            sb.append(actionCREDENTIALS_LOGOUT());

        }

        return sb;
    }

    public Cookie actionCREDENTIALS_LOGIN() throws JsonProcessingException, ClassNotFoundException, IOException {

        String _user = requestParameters.get("username")[0];
        String _pwd = requestParameters.get("password")[0];
        Boolean root = false;
        StrongPasswordEncryptor passwordEncryptor = new StrongPasswordEncryptor();
        if (_user.equals(getProp("username")) && passwordEncryptor.checkPassword(_pwd, getProp("password"))) {

            root = true;
            //createDefaultUser();

        }

        User user = DatabaseActions.getUser(_user);
        if (user != null) {
            if (passwordEncryptor.checkPassword(_pwd, user.getPassword())) {
                UUID sessionId = UUID.randomUUID();
                Cookie loginCookie = new Cookie("LCMS_session", sessionId.toString());
                mdm.GsonObjects.Core.Actions _action = DatabaseWrapper.getAction("loadusers");
                Map<String, Object> usr = DatabaseWrapper.getObjectHashMapv2(null, _action.getMongoConfiguration(_action.mongoconfiguration), and(eq("username", _user)));
                loginCookie.setMaxAge((Integer.parseInt(usr.get("sessionValidity").toString())));
                Session session = createSession(_user, loginCookie.getValue());
                DatabaseActions.insertSession(session);
                createTempDir(session.getSessionID());
                return loginCookie;
            } else {
                return null;
            }

        } else {
            if (root == true) {
                UUID sessionId = UUID.randomUUID();
                Cookie loginCookie = new Cookie("LCMS_session", sessionId.toString());
                loginCookie.setMaxAge(9999);
                Session session = createSession(getProp("username"), loginCookie.getValue());
                DatabaseActions.insertSession(session);
                createTempDir(session.getSessionID());
                return loginCookie;
            } else {
                return null;
            }
        }
    }

    public StringBuilder actionCREDENTIALS_LOGOUT() {
        try {
            devalidateSession(cookie);
        } catch (IOException ex) {
            Logger.getLogger(ActionManagerCredentials.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(ActionManagerCredentials.class.getName()).log(Level.SEVERE, null, ex);
        }
        return null;
    }

    private StringBuilder actionCREDENTIALS_USERINFO() {
        StringBuilder sb = new StringBuilder();
        //String cookie = requestParameters.get("LCMS_session")[0];
        if (cookie != null) {
            if (checkSession(cookie)) {
                Session session = DatabaseActions.getSession(cookie);
                sb.append(DatabaseWrapper.getUserInfo(session));
            }
        }
        return sb;
    }

    private Session createSession(String _user, String _sessionId) throws JsonProcessingException, IOException {
        long now = Instant.now().toEpochMilli() / 1000;
        ObjectMapper mapper = new ObjectMapper();
        ArrayList<Document> results;
        Session session = null;

        try {
            if (!_user.equals(getProp("username"))) {
                mdm.GsonObjects.Core.Actions _action = DatabaseWrapper.getAction("loadusers");
                Map<String, Object> user = DatabaseWrapper.getObjectHashMapv2(null, _action.getMongoConfiguration(_action.mongoconfiguration), and(eq("username", _user)));
                session = new Session(_user, _sessionId, now + ((Integer.parseInt(user.get("sessionValidity").toString()))), true, user.get("userid").toString());
            } else {
                session = new Session(_user, _sessionId, now + (9999), true, "158");
            }
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(ActionManagerCredentials.class.getName()).log(Level.SEVERE, null, ex);
        }

        return session;
    }

    private void createTempDir(String _sessionId) {
        //new File("C:\\mongodb\\temp\\" + _sessionId).mkdir();
        //new File("C:\\mongodb\\temp\\" + _sessionId).mkdir();
        new File(contextPath + "/" + _sessionId).mkdir();

        System.out.print(contextPath + "/" + _sessionId);
    }

    private void deleteTempDir(String _sessionId) throws IOException {
        FileUtils.deleteDirectory(new File(contextPath + "\\" + _sessionId));
    }

    private void devalidateSession(String _sessionId) throws IOException, ClassNotFoundException {
        //MongoMain.insertSession(createSession(_user, loginCookie.getValue()));
        Session session = DatabaseActions.getSession(_sessionId);
        if (!session.getUsername().equals(getProp("username"))) {
            mdm.GsonObjects.Core.Actions _action = DatabaseWrapper.getAction("loadusers");
            Map<String, Object> user = DatabaseWrapper.getObjectHashMapv2(null, _action.getMongoConfiguration(_action.mongoconfiguration), and(eq("username", session.getUsername())));
            DatabaseActions.editSessionValidity(_sessionId, (Integer.parseInt(user.get("sessionValidity").toString()) * -1));
        } else {
            DatabaseActions.editSessionValidity(_sessionId, 9999 * -1);        
        }              
        deleteTempDir(_sessionId);
    }

    private void createDefaultUser() throws JsonProcessingException, ClassNotFoundException {
        StrongPasswordEncryptor passwordEncryptor = new StrongPasswordEncryptor();

        UUID id = UUID.randomUUID();
        ObjectMapper mapper = new ObjectMapper();
        User user = new User();
        user.setUsername("LCMS");
        user.setUserid(id.toString());
        user.setPassword(passwordEncryptor.encryptPassword("LCMS"));
        user.setEmail("LCMS@klinilab.be");
        user.setRoles(Arrays.asList(new String[]{"ADMIN", "ICTMANAGER"}));
        user.setLdap(false);
        Document document = Document.parse(mapper.writeValueAsString(user));
        DatabaseWrapper.addObject(document, mdm.Config.MongoConf.USERS, cookie);
    }

}
