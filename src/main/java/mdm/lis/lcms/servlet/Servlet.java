/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm.lis.lcms.servlet;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mongodb.BasicDBObject;
import java.io.IOException;
import java.net.InetAddress;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import mdm.Core;
import static mdm.Core.loadWebFile;
import mdm.GsonObjects.Core.MongoConfigurations;
import mdm.Mongo.DatabaseActions;
import mdm.Mongo.DatabaseWrapper;
import mdm.commandFunctions;
import org.apache.commons.io.IOUtils;

/**
 *
 * @author matmey
 */
@WebServlet(name = "Servlet", urlPatterns = {"/servlet"})
@MultipartConfig(fileSizeThreshold = 1024 * 1024 * 2, // 2MB
        maxFileSize = 1024 * 1024 * 10, // 10MB
        maxRequestSize = 1024 * 1024 * 50)   // 50MB
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
        String host = Core.getClientPCName(request.getRemoteAddr());
        try {
            if (request.getContentType().contains("multipart")) {
                aM = new ActionManager(requestParameters, request.getParts(), host);
            } else {
                aM = new ActionManager(requestParameters, host);
            }

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

        String cookie, hostName;
        mdm.GsonObjects.Core.Actions action;
        HashMap<String, String[]> requestParameters = new HashMap<String, String[]>();
        Collection<Part> parts;

        public ActionManager(Map<String, String[]> requestParameters, String hostName) throws ClassNotFoundException {
            this.requestParameters = new HashMap<String, String[]>(requestParameters);
            this.hostName = hostName;
            if (requestParameters.get("action") != null) {
                action = DatabaseWrapper.getAction(requestParameters.get("action")[0]);
            }
            if (requestParameters.get("LCMS_session") != null) {
                cookie = requestParameters.get("LCMS_session")[0];
            }
        }

        public ActionManager(Map<String, String[]> requestParameters, Collection<Part> parts, String hostName) throws ClassNotFoundException {
            this.hostName = hostName;
            this.requestParameters = new HashMap<String, String[]>(requestParameters);
            if (requestParameters.get("action") != null) {
                action = DatabaseWrapper.getAction(requestParameters.get("action")[0]);
            }
            if (requestParameters.get("LCMS_session") != null) {
                cookie = requestParameters.get("LCMS_session")[0];
            }
            this.parts = parts;
        }

        public String getCookie() {
            return cookie;
        }

        public mdm.GsonObjects.Core.Actions getAction() {
            return action;
        }

        public StringBuilder startAction() throws ClassNotFoundException, IOException, JsonProcessingException, NoSuchFieldException {
            StringBuilder sb = new StringBuilder();
            MongoConfigurations mongoConfiguration = DatabaseActions.getMongoConfiguration(action.mongoconfiguration);

            Boolean publicPage = false;

            if (mongoConfiguration.getCollection().equals("pages") && requestParameters.get("k") != null && requestParameters.get("v") != null) {
                Properties test = System.getProperties();
                String key = requestParameters.get("k")[0];
                String value = requestParameters.get("v")[0];
                BasicDBObject searchObject = new BasicDBObject();
                ObjectMapper mapper = new ObjectMapper();
                ObjectNode jsonData = mapper.createObjectNode();
                searchObject.put(key, new BasicDBObject("$eq", value));
                Map<String, Object> searchResult = DatabaseWrapper.getObjectHashMapv2(cookie, mongoConfiguration, searchObject);
                String accesstype = searchResult.get("accessType").toString();
                if (accesstype.equals("0")) {
                    publicPage = true;
                    if (publicPage) {
                        sb.append(DatabaseWrapper.actionGETOBJECTv2(cookie, mongoConfiguration, key, value, publicPage));
                    }
                }

            }

            if ((Core.checkSession(cookie) && !publicPage)) {

                if (parts != null) {
                    for (Part part : parts) {
                        if (part.getName().equals("contents")) {
                            requestParameters.put("contents", new String[]{IOUtils.toString(part.getInputStream(), Charset.defaultCharset())});
                        }
                    }
                }

                if (action.name.toUpperCase().contains("EDIT")) {
                    sb.append(DatabaseWrapper.actionEDITOBJECTv2(requestParameters, cookie, mongoConfiguration));

                } else {
                    if (action.name.toUpperCase().contains("LOAD")) {
                        ArrayList<String> excludes = new ArrayList<>();
                        BasicDBObject filterObject = new BasicDBObject();
                        if (requestParameters.get("excludes") != null) {
                            excludes.addAll(Arrays.asList(requestParameters.get("excludes")));
                        }
                        if (requestParameters.get("excludes[]") != null) {       
                            String[] _excludes = requestParameters.get("excludes[]");
                            excludes.addAll(Arrays.asList(_excludes));
                        }
                        excludes.add("contents");
                        if (mongoConfiguration.getCollection().equals("backlog")) {
                            filterObject.put("object_id", new BasicDBObject("$eq", requestParameters.get("object_id")[0]));
                        }
                        sb.append(DatabaseWrapper.actionLOADOBJECTv2(cookie, mongoConfiguration, filterObject, excludes.toArray(new String[0])));
                    } else {
                        if (action.name.toUpperCase().contains("GET")) {
                            String key = requestParameters.get("k")[0];
                            String value = requestParameters.get("v")[0];
                            sb.append(DatabaseWrapper.actionGETOBJECTv2(cookie, mongoConfiguration, key, value, publicPage));
                        }
                        if (action.name.toUpperCase().contains("DO")) {
                            // List<String> parameters = new ArrayList<>();
                            // parameters = Arrays.asList(requestParameters.get("parameters"));
                            String key = requestParameters.get("k")[0];
                            sb.append(commandFunctions.doCommand(key, requestParameters));
                        }
                    }
                }
            } else {
                if (!publicPage) {
                    sb.append(DatabaseWrapper.getWebPage("credentials/index.html", new String[]{"credentials/servletCalls.js", "credentials/interface.js"}));
                }
            }

            return sb;
        }

        private ObjectNode getEditablePage(Map<String, Object> editablePage) throws JsonProcessingException {
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode jsonData = mapper.createObjectNode();
            ObjectNode jsonReplaces = mapper.createObjectNode();
            jsonReplaces.put("LCMSEditablePage-id", editablePage.get("validationid").toString());
            jsonReplaces.put("LCMSEditablePage-content", editablePage.get("contents").toString());
            editablePage.put("contents", "");
            jsonData.put("webPage", loadWebFile("validation/template/index.html"));
            jsonData.set("replaces", jsonReplaces);
            return jsonData;
        }

    }

}
