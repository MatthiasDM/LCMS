/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm.lis.lcms.servlet;

import mdm.lis.lcms.lab.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mongodb.BasicDBObject;
import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import mdm.Config.Actions;
import mdm.Config.MongoConf;
import static mdm.Core.loadWebFile;
import mdm.GsonObjects.Lab.InventoryItem;
import mdm.GsonObjects.Lab.LabItem;
import mdm.GsonObjects.MongoConfigurations;
import mdm.Mongo.DatabaseActions;
import mdm.Mongo.DatabaseWrapper;
import org.apache.commons.lang.StringUtils;
import org.bson.Document;

/**
 *
 * @author matmey
 */
@WebServlet(name = "Servlet", urlPatterns = {"/servlet"})
public class Servlet extends HttpServlet {

    private ServletContext context;

    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(); //To change body of generated methods, choose Tools | Templates.
        this.context = config.getServletContext();

    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException, JsonProcessingException {
        StringBuilder sb = new StringBuilder();

        Map<String, String[]> requestParameters = request.getParameterMap();

        ActionManager aM;
        try {
            aM = new ActionManager(requestParameters);

            if (aM.getAction() != null) {
                try {
                    sb.append(aM.startAction());
                } catch (ClassNotFoundException ex) {
                    Logger.getLogger(Servlet.class.getName()).log(Level.SEVERE, null, ex);
                } catch (NoSuchFieldException ex) {
                    Logger.getLogger(Servlet.class.getName()).log(Level.SEVERE, null, ex);
                }

            }
            
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(Servlet.class.getName()).log(Level.SEVERE, null, ex);
        }

        if (sb.toString().length() > 0) {
            response.setContentType("text/xml");
            response.setHeader("Cache-Control", "no-cache");
            response.getWriter().write(sb.toString());
        } else {
            response.setStatus(HttpServletResponse.SC_NO_CONTENT);
        }

    }

    class ActionManager {

        String cookie;
        mdm.GsonObjects.Actions action;
        HashMap<String, String[]> requestParameters = new HashMap<String, String[]>();

        public ActionManager(Map<String, String[]> requestParameters) throws ClassNotFoundException {
            this.requestParameters = new HashMap<String, String[]>(requestParameters);
            if (requestParameters.get("action") != null) {
                action = getAction(requestParameters.get("action")[0]);
            }
            if (requestParameters.get("LCMS_session") != null) {
                cookie = requestParameters.get("LCMS_session")[0];
            }
        }

        public mdm.GsonObjects.Actions getAction(String _action) throws ClassNotFoundException {
            ObjectMapper mapper = new ObjectMapper();
            mdm.GsonObjects.Actions action;
            BasicDBObject searchObject = new BasicDBObject();
            searchObject.put("name", new BasicDBObject("$eq", _action));
            ArrayList<Document> results = DatabaseActions.getObjectsSpecificList("", MongoConf.ACTIONS, searchObject, null, 1000, new String[]{});
            //String jsonObject = mapper.writeValueAsString(results.get(0));
            action = mapper.convertValue(results.get(0), mdm.GsonObjects.Actions.class);
            return action;
        }

        public String getCookie() {
            return cookie;
        }

        public mdm.GsonObjects.Actions getAction() {
            return action;
        }

        public StringBuilder startAction() throws ClassNotFoundException, IOException, JsonProcessingException, NoSuchFieldException {
            StringBuilder sb = new StringBuilder();
            if (cookie != null) {
                if (action.name.toUpperCase().contains("EDIT")) {
                    sb.append(DatabaseWrapper.actionEDITOBJECTv2(requestParameters, cookie, action.getMongoConfiguration(action.mongoconfiguration)));
                } else {
                    if (action.name.toUpperCase().contains("LOAD")) {
                        sb.append(DatabaseWrapper.actionLOADOBJECTv2(cookie, action.getMongoConfiguration(action.mongoconfiguration), new BasicDBObject(), new String[]{}));
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