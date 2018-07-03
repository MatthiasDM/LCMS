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
import mdm.Core;
import static mdm.Core.checkSession;
import mdm.GsonObjects.Session;
import mdm.GsonObjects.User;
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
    Core.Actions action;
    String contextPath;
    HashMap<String, String[]> requestParameters = new HashMap<String, String[]>();

    public ActionManagerCredentials(Map<String, String[]> requestParameters) {
        this.requestParameters = new HashMap<String, String[]>(requestParameters);
        if (requestParameters.get("action") != null) {
            action = Core.Actions.valueOf(requestParameters.get("action")[0]);
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

    public Core.Actions getAction() {
        return action;
    }

    public StringBuilder startAction() throws ClassNotFoundException, IOException {
        StringBuilder sb = new StringBuilder();

        if (action == Core.Actions.CREDENTIALS_USERINFO) {
            sb.append(actionCREDENTIALS_USERINFO());
        }
        if (action == Core.Actions.CREDENTIALS_LOGOUT) {
            sb.append(actionCREDENTIALS_LOGOUT());

        }

        return sb;
    }

    public Cookie actionCREDENTIALS_LOGIN() throws JsonProcessingException {

        String _user = requestParameters.get("username")[0];
        String _pwd = requestParameters.get("password")[0];
        StrongPasswordEncryptor passwordEncryptor = new StrongPasswordEncryptor();

        if (_user.equals("admin") && passwordEncryptor.checkPassword(_pwd, "LcTFMqFglZI4VmJyyPAR/Js4ekJ3jr1xJZenBdn2Nd6o89FZoNY8F9xhQdpp+xB6")) {
            try {
                createDefaultUser();
            } catch (ClassNotFoundException ex) {
                Logger.getLogger(ActionManagerCredentials.class.getName()).log(Level.SEVERE, null, ex);
            }
        }

        User user = DatabaseActions.getUser(_user);
        if (user != null) {
            if (passwordEncryptor.checkPassword(_pwd, user.getPassword())) {
                UUID sessionId = UUID.randomUUID();
                Cookie loginCookie = new Cookie("LCMS_session", sessionId.toString());
                loginCookie.setMaxAge(60 * 60 * 6);
                Session session = createSession(_user, loginCookie.getValue());
                DatabaseActions.insertSession(session);
                createTempDir(session.getSessionID());
                return loginCookie;
            } else {
                return null;
            }

        } else {
            return null;
        }
    }

    public StringBuilder actionCREDENTIALS_LOGOUT() {
        try {
            devalidateSession(cookie);
        } catch (IOException ex) {
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

    private Session createSession(String _user, String _sessionId) throws JsonProcessingException {
        long now = Instant.now().toEpochMilli() / 1000;
        ObjectMapper mapper = new ObjectMapper();
        ArrayList<Document> results;
        Session session = null;
        try {
            results = DatabaseActions.getObjectSpecific(Core.MongoConf.USERS, and(eq("username", _user)));
            Document d = Document.parse(mapper.writeValueAsString(results.get(0)));
            session = new Session(_user, _sessionId, now + (60 * 60 * 6), true, d.getString("userid"));
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

    private void devalidateSession(String _sessionId) throws IOException {
        //MongoMain.insertSession(createSession(_user, loginCookie.getValue()));

        DatabaseActions.editSessionValidity(_sessionId, (60 * 60 * 6 * -1));
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
        user.setRoles(Arrays.asList(new String[]{"ADMIN"}));
        user.setLdap(false);
        Document document = Document.parse(mapper.writeValueAsString(user));
        DatabaseWrapper.addObject(document, Core.MongoConf.USERS, cookie);
    }

}
