/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm.lis.lcms.notes;

import com.fasterxml.jackson.core.JsonProcessingException;
import java.io.IOException;
<<<<<<< HEAD
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import mdm.Core;
import mdm.GsonObjects.Note;
import mdm.Mongo.DatabaseActions;
import mdm.Mongo.DatabaseWrapper;
import mdm.lis.lcms.notes.ActionManagerNote;
import mdm.lis.lcms.lab.ServletLab;

/**
 *
 * @author matmey
 */
@WebServlet(name = "noteServlet", urlPatterns = {"/note"})
public class ServletNote extends HttpServlet {

    private ServletContext context;

    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(); //To change body of generated methods, choose Tools | Templates.
        this.context = config.getServletContext();

    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        StringBuilder sb = new StringBuilder();

        Map<String, String[]> requestParameters = request.getParameterMap();

        ActionManagerNote aM = new ActionManagerNote(requestParameters);

        if (aM.getAction() != null) {
            try {
                sb.append(aM.startAction());
            } catch (ClassNotFoundException ex) {
                Logger.getLogger(ServletNote.class.getName()).log(Level.SEVERE, null, ex);
            } catch (JsonProcessingException ex) {
                Logger.getLogger(ServletNote.class.getName()).log(Level.SEVERE, null, ex);
            } catch (NoSuchFieldException ex) {
                Logger.getLogger(ServletNote.class.getName()).log(Level.SEVERE, null, ex);
            }

        }
        if (sb.toString().length() > 0) {
            response.setContentType("text/xml");
            response.setHeader("Cache-Control", "no-cache");
            response.getWriter().write(sb.toString());
        } else {
            response.setStatus(HttpServletResponse.SC_NO_CONTENT);
        }

    }

    class ActionManagerNote {

        String cookie;
        mdm.Config.Actions action;
        HashMap<String, String[]> requestParameters = new HashMap<String, String[]>();

        public ActionManagerNote(Map<String, String[]> requestParameters) {
            this.requestParameters = new HashMap<String, String[]>(requestParameters);
            if (requestParameters.get("action") != null) {
                action = mdm.Config.Actions.valueOf(requestParameters.get("action")[0]);
            }
            if (requestParameters.get("LCMS_session") != null) {
                cookie = requestParameters.get("LCMS_session")[0];
            }
        }

        public String getCookie() {
            return cookie;
        }

        public mdm.Config.Actions getAction() {
            return action;
        }

        public StringBuilder startAction() throws ClassNotFoundException, IOException, JsonProcessingException, NoSuchFieldException {
            StringBuilder sb = new StringBuilder();
            if (cookie != null) {

                if (action.toString().contains("EDIT")) {
                    sb.append(DatabaseWrapper.actionEDITOBJECT(requestParameters, cookie, action.getMongoConf()));
                } else {
                    if (action.toString().contains("LOAD")) {
                        sb.append(DatabaseWrapper.actionLOADOBJECT(cookie, action.getMongoConf()));
                    }
                    if (action == mdm.Config.Actions.NOTE_GETNOTE) {
                        sb.append(actionNOTE_GETNOTE());
                    } 
                    if (action == mdm.Config.Actions.NOTE_SAVENOTE) {
                        sb.append(actionNOTE_SAVENOTE());
                    }
                }

            } else {
                sb.append(DatabaseWrapper.getCredentialPage());
            }

            return sb;
        }

        private StringBuilder actionNOTE_GETNOTE() throws IOException, ClassNotFoundException {
            StringBuilder sb = new StringBuilder();
            if (Core.checkSession(cookie)) {
                String id = requestParameters.get("id")[0];
                if (!id.equals("")) {
                    Note note = DatabaseActions.getNote(DatabaseActions.getSession(cookie).getUsername(), id);
                    sb.append(DatabaseWrapper.getNote(note));
                }

            }
            return sb;
        }

        private StringBuilder actionNOTE_SAVENOTE() throws IOException, ClassNotFoundException {
            StringBuilder sb = new StringBuilder();
            if (Core.checkSession(cookie)) {
                String user = DatabaseActions.getSession(cookie).getUserid();
                String data = requestParameters.get("content")[0];
                String docid = requestParameters.get("docid")[0];
                DatabaseActions.updateNote(user, docid, data);
            }
            return sb;
        }

    }

=======
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import mdm.lis.lcms.notes.ActionManagerNote;
import mdm.lis.lcms.lab.ServletLab;

/**
 *
 * @author matmey
 */
@WebServlet(name = "noteServlet", urlPatterns = {"/note"})
public class ServletNote extends HttpServlet {
    
    private ServletContext context;

    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(); //To change body of generated methods, choose Tools | Templates.
        this.context = config.getServletContext();

    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        StringBuilder sb = new StringBuilder();

        Map<String, String[]> requestParameters = request.getParameterMap();

        ActionManagerNote aM = new ActionManagerNote(requestParameters);

        if (aM.getAction() != null) {
            try {
                sb.append(aM.startAction());
            } catch (ClassNotFoundException ex) {
                Logger.getLogger(ServletNote.class.getName()).log(Level.SEVERE, null, ex);
            } catch (JsonProcessingException ex) {
                Logger.getLogger(ServletNote.class.getName()).log(Level.SEVERE, null, ex);
            } catch (NoSuchFieldException ex) {
                Logger.getLogger(ServletNote.class.getName()).log(Level.SEVERE, null, ex);
            }

        }
        if (sb.toString().length() > 0) {
            response.setContentType("text/xml");
            response.setHeader("Cache-Control", "no-cache");
            response.getWriter().write(sb.toString());
        } else {
            response.setStatus(HttpServletResponse.SC_NO_CONTENT);
        }

    }
>>>>>>> origin/master
}
