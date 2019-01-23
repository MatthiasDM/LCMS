/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm.Tasks;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mongodb.BasicDBObject;
import java.io.IOException;
import java.time.Instant;
import java.util.ArrayList;
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
import mdm.Config.Actions;
import mdm.Config.MongoConf;
import mdm.GsonObjects.Lab.InventoryItem;
import mdm.GsonObjects.Lab.LabItem;
import mdm.Mongo.DatabaseWrapper;

import mdm.lis.lcms.other.ict.ServletICT;
import org.bson.Document;

/**
 *
 * @author matmey
 */
@WebServlet(name = "TaskServlet", urlPatterns = {"/tasks"})
public class ServletTasks extends HttpServlet {

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

        ActionManagerTasks aM = new ActionManagerTasks(requestParameters);

        if (aM.getAction() != null) {
            try {
                sb.append(aM.startAction());
            } catch (ClassNotFoundException ex) {
                Logger.getLogger(ServletTasks.class.getName()).log(Level.SEVERE, null, ex);
            } catch (NoSuchFieldException ex) {
                Logger.getLogger(ServletTasks.class.getName()).log(Level.SEVERE, null, ex);
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
        class ActionManagerTasks {

        String cookie;
        mdm.Config.Actions action;
        HashMap<String, String[]> requestParameters = new HashMap<String, String[]>();

        public ActionManagerTasks(Map<String, String[]> requestParameters) {
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
                        sb.append(DatabaseWrapper.actionLOADOBJECT(cookie, action.getMongoConf(), new BasicDBObject(), new String[]{}));
                    } else {

                    }
                }

            } else {
                sb.append(DatabaseWrapper.getWebPage("credentials/index.html", new String[]{"credentials/servletCalls.js", "credentials/interface.js"}));
            }

            return sb;
        }
     
    }
}
