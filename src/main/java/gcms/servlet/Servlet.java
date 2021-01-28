/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.servlet;

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
import gcms.Core;
import static gcms.Core.loadWebFile;
import gcms.GsonObjects.Core.Command;
import gcms.GsonObjects.Core.MongoConfigurations;
import gcms.database.DatabaseActions;
import gcms.database.DatabaseWrapper;
import gcms.commandFunctions;
import java.util.Enumeration;
import java.util.List;
import javax.xml.bind.DatatypeConverter;
import org.apache.commons.io.IOUtils;

/**
 *
 * @author matmey
 */
@WebServlet(name = "Servlet", urlPatterns = {"/servlet/*", "/IT/servlet"})
@MultipartConfig(fileSizeThreshold = 1024 * 1024 * 20, // 20MB
        maxFileSize = 1024 * 1024 * 20, // 20MB
        maxRequestSize = 1024 * 1024 * 50)   // 50MB
public class Servlet extends HttpServlet {

    private ServletContext context;

    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(); //To change body of generated methods, choose Tools | Templates.
        this.context = config.getServletContext();

    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException, JsonProcessingException {
        StringBuilder sb = new StringBuilder();
        Map<String, String[]> requestParameters = new HashMap<>();
        requestParameters.putAll(request.getParameterMap());
        ActionManager aM;
        String apiName, apiKey;
        Boolean apiAuthorized = false;
        apiName = requestParameters.get("api")[0];
        apiKey = requestParameters.get("key")[0];
        try {
            apiAuthorized = Core.isValidApiKey(apiName, apiKey);

        } catch (ClassNotFoundException ex) {
            Logger.getLogger(Servlet.class.getName()).log(Level.SEVERE, ex.getMessage());
        }
        Response actionResponse = new Response();
        String host = Core.getClientPCName(request.getRemoteAddr());

        try {
            aM = new ActionManager(requestParameters, host, apiAuthorized);
            if (aM.getAction() != null) {
                try {
                    actionResponse = aM.startAction();
                    sb.append(actionResponse.getSb());
                } catch (ClassNotFoundException ex) {
                    Logger.getLogger(Servlet.class.getName()).log(Level.SEVERE, ex.getMessage());
                } catch (NoSuchFieldException ex) {
                    Logger.getLogger(Servlet.class.getName()).log(Level.SEVERE, ex.getMessage());
                } catch (Exception ex) {
                    Logger.getLogger(Servlet.class.getName()).log(Level.SEVERE, ex.getMessage());
                }

            }
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(Servlet.class.getName()).log(Level.SEVERE, ex.getMessage());
        }
        if (sb.toString().length() > 0) {
            response.setContentType("text/xml");
            response.setHeader("Cache-Control", "no-cache");
            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write(sb.toString());
        } else {
            response.setStatus(actionResponse.responseStatus);

        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException, JsonProcessingException {
        StringBuilder sb = new StringBuilder();
        Map<String, String[]> requestParameters = new HashMap<>();
        requestParameters.putAll(request.getParameterMap());

        ActionManager aM;
        String host = Core.getClientPCName(request.getRemoteAddr());
        String user = request.getRemoteUser();
        Map<String, String> headers = new HashMap<>();
        Enumeration<String> headerNames = request.getHeaderNames();
        String apiName, apiKey;
        Boolean apiAuthorized = false;
        if (headerNames != null) {
            while (headerNames.hasMoreElements()) {
                String headerName = headerNames.nextElement();
                headers.put(headerName, request.getHeader(headerName));
            }
            if (headers.get("authorization") != null) {
                String credentials = headers.get("authorization").substring("Basic".length()).trim();
                byte[] decoded = DatatypeConverter.parseBase64Binary(credentials);
                String decodedString = new String(decoded);
                String[] actualCredentials = decodedString.split(":");
                apiName = actualCredentials[0];
                apiKey = actualCredentials[1];
                try {
                    apiAuthorized = Core.isValidApiKey(apiName, apiKey);
                    requestParameters.put("contextPath", new String[]{context.getRealPath("/HTML/other/files")});
                } catch (ClassNotFoundException ex) {
                    Logger.getLogger(Servlet.class.getName()).log(Level.SEVERE, ex.getMessage());
                }

            }
        }

        Response actionResponse = new Response();
        try {
            if (request.getContentType().contains("multipart")) {
                aM = new ActionManager(requestParameters, request.getParts(), apiAuthorized);
            } else {
                aM = new ActionManager(requestParameters, host, apiAuthorized);
            }

            if (aM.getAction() != null) {
                try {
                    actionResponse = aM.startAction();
                    sb.append(actionResponse.getSb());
                } catch (ClassNotFoundException ex) {
                    Logger.getLogger(Servlet.class.getName()).log(Level.SEVERE, ex.getMessage());
                } catch (NoSuchFieldException ex) {
                    Logger.getLogger(Servlet.class.getName()).log(Level.SEVERE, ex.getMessage());
                } catch (Exception ex) {
                    Logger.getLogger(Servlet.class.getName()).log(Level.SEVERE, ex.getMessage());
                }

            }

        } catch (ClassNotFoundException ex) {
            Logger.getLogger(Servlet.class.getName()).log(Level.SEVERE, ex.getMessage());
        }

        if (sb.toString().length() > 0) {
            response.setContentType("text/xml");
            response.setHeader("Cache-Control", "no-cache");
            response.getWriter().write(sb.toString());
        } else {
            response.setStatus(actionResponse.responseStatus);

        }

    }

    class Response {

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

    class ActionManager {

        String cookie, hostName;
        Boolean apiAuthorized;
        gcms.GsonObjects.Core.Actions action;
        HashMap<String, String[]> requestParameters = new HashMap<String, String[]>();
        Collection<Part> parts;
        int responseStatus = HttpServletResponse.SC_ACCEPTED;

        public ActionManager(Map<String, String[]> requestParameters, String hostName, Boolean apiAuthorized) throws ClassNotFoundException {
            this.requestParameters = new HashMap<String, String[]>(requestParameters);
            this.apiAuthorized = apiAuthorized;
            this.hostName = hostName;
            if (requestParameters.get("action") != null) {
                action = DatabaseWrapper.getAction(requestParameters.get("action")[0]);
            }
            if (requestParameters.get("LCMS_session") != null) {
                cookie = requestParameters.get("LCMS_session")[0];
            }
        }

        public ActionManager(Map<String, String[]> requestParameters, Collection<Part> parts, Boolean apiAuthorized) throws ClassNotFoundException {
            this.apiAuthorized = apiAuthorized;
            this.requestParameters = new HashMap<>(requestParameters);
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

        public gcms.GsonObjects.Core.Actions getAction() {
            return action;
        }

        public Response startAction() throws ClassNotFoundException, IOException, JsonProcessingException, NoSuchFieldException, Exception {
            StringBuilder sb = new StringBuilder();
            ObjectMapper mapper = new ObjectMapper();
            if (action == null) {
                responseStatus = HttpServletResponse.SC_NOT_FOUND;
                sb.append("Specific action (").append(requestParameters.get("action")[0]).append(") was not found.");
            }
            MongoConfigurations mongoConfiguration = DatabaseActions.getMongoConfiguration(action.mongoconfiguration);
            Boolean publicPage = false;

            if (mongoConfiguration.getCollection().equals("pages") && requestParameters.get("k") != null && requestParameters.get("v") != null) {
                String key = requestParameters.get("k")[0];
                String value = requestParameters.get("v")[0];
                BasicDBObject searchObject = new BasicDBObject();
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

            if (action.name.toUpperCase().startsWith("DO")) {
                if (mongoConfiguration.getCollection().equals("commands")) {
                    String key = requestParameters.get("k")[0];
                    BasicDBObject searchObject = new BasicDBObject();
                    searchObject.put("name", new BasicDBObject("$eq", key));
                    Map<String, Object> searchResult = DatabaseWrapper.getObjectHashMapv2(cookie, mongoConfiguration, searchObject);
                    Command command = mapper.convertValue(searchResult, gcms.GsonObjects.Core.Command.class);
                    List<String> accesstype = command.getAccessType();
                    if (accesstype.contains("0")) {
                        sb.append(commandFunctions.doCommand(key, requestParameters, command, parts));
                    } else {
                        if (accesstype.contains("1") && !accesstype.contains("2") && (Core.checkSession(cookie) && !publicPage)) {
                            sb.append(commandFunctions.doCommand(key, requestParameters, command, parts));
                        } else {
                            if (accesstype.contains("2") && apiAuthorized) {
                                sb.append(commandFunctions.doCommand(key, requestParameters, command, parts));
                            }
                        }
                    }
                }
            } else {
                if ((Core.checkSession(cookie) && !publicPage)) {
                    if (parts != null) {
                        for (Part part : parts) {
                            if (part.getName().equals("contents")) {
                                requestParameters.put("contents", new String[]{IOUtils.toString(part.getInputStream(), Charset.defaultCharset())});
                            }
                        }
                    }

                    if (action.name.toUpperCase().startsWith("EDIT")) {
                        sb.append(DatabaseWrapper.actionEDITOBJECTv2(requestParameters, cookie, mongoConfiguration));

                    } else {
                        if (action.name.toUpperCase().startsWith("LOAD")) {
                            ArrayList<String> excludes = new ArrayList<>();
                            BasicDBObject filterObject = new BasicDBObject();
                            if (requestParameters.get("excludes") != null) {
                                excludes.addAll(Arrays.asList(requestParameters.get("excludes")));
                            }
                            if (requestParameters.get("excludes[]") != null) {
                                String[] _excludes = requestParameters.get("excludes[]");
                                excludes.addAll(Arrays.asList(_excludes));
                            }
                            //excludes.add("contents");
                            if (mongoConfiguration.getCollection().equals("backlog")) {
                                filterObject.put("object_id", new BasicDBObject("$eq", requestParameters.get("object_id")[0]));
                            }
                            if (mongoConfiguration.getCollection().equals("document")) {
                                if (requestParameters.get("prefix") != null) {
                                    filterObject.put("prefix", new BasicDBObject("$eq", requestParameters.get("prefix")[0]));
                                }
                            }
                            sb.append(DatabaseWrapper.actionLOADOBJECTv2(cookie, mongoConfiguration, filterObject, excludes.toArray(new String[0])));
                        } else {
                            if (action.name.toUpperCase().startsWith("GET")) {
                                String key = requestParameters.get("k")[0];
                                String value = requestParameters.get("v")[0];
                                sb.append(DatabaseWrapper.actionGETOBJECTv2(cookie, mongoConfiguration, key, value, publicPage));
                            }
                        }
                    }
                } else {
                    if (!publicPage) {
                        sb.append(DatabaseWrapper.getWebPage("credentials/index.html", new String[]{}));
                    }
                }
            }

            return new Response(responseStatus, sb);
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
