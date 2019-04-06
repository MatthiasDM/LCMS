/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm.lis.lcms.validations;

import mdm.lis.lcms.validations.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mongodb.BasicDBObject;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
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
import mdm.Config.MongoConf;
import mdm.Core;
import static mdm.Core.loadScriptFile;
import static mdm.Core.loadWebFile;
import mdm.GsonObjects.Other.Validation;
import mdm.Mongo.DatabaseActions;
import mdm.Mongo.DatabaseWrapper;

import mdm.lis.lcms.lab.ServletLab;
import org.apache.commons.io.IOUtils;

/**
 *
 * @author matmey
 */
@WebServlet(name = "validationsValidations", urlPatterns = {"/validations"})
@MultipartConfig(fileSizeThreshold = 1024 * 1024 * 2, // 2MB
        maxFileSize = 1024 * 1024 * 10, // 10MB
        maxRequestSize = 1024 * 1024 * 50)   // 50MB
public class ServletValidations extends HttpServlet {

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
        ActionManagerValidations aM;

        if (request.getContentType().contains("multipart")) {
            aM = new ActionManagerValidations(requestParameters, request.getParts());
        } else {
            aM = new ActionManagerValidations(requestParameters);
        }

        if (aM.getAction() != null) {
            try {
                sb.append(aM.startAction());
            } catch (ClassNotFoundException ex) {
                Logger.getLogger(ServletValidations.class.getName()).log(Level.SEVERE, null, ex);
            } catch (JsonProcessingException ex) {
                Logger.getLogger(ServletValidations.class.getName()).log(Level.SEVERE, null, ex);
            } catch (NoSuchFieldException ex) {
                Logger.getLogger(ServletValidations.class.getName()).log(Level.SEVERE, null, ex);
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

    class ActionManagerValidations {

        String cookie;
        mdm.Config.Actions action;
        HashMap<String, String[]> requestParameters = new HashMap<String, String[]>();
        Collection<Part> parts;

        public ActionManagerValidations(Map<String, String[]> requestParameters) {
            this.requestParameters = new HashMap<String, String[]>(requestParameters);
            if (requestParameters.get("action") != null) {
                action = mdm.Config.Actions.valueOf(requestParameters.get("action")[0]);
            }
            if (requestParameters.get("LCMS_session") != null) {
                cookie = requestParameters.get("LCMS_session")[0];
            }
        }

        public ActionManagerValidations(Map<String, String[]> requestParameters, Collection<Part> parts) {
            this.requestParameters = new HashMap<String, String[]>(requestParameters);
            if (requestParameters.get("action") != null) {
                action = mdm.Config.Actions.valueOf(requestParameters.get("action")[0]);
            }
            if (requestParameters.get("LCMS_session") != null) {
                cookie = requestParameters.get("LCMS_session")[0];
            }
            this.parts = parts;
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

//                Boolean[] conditions = new Boolean[]{true, false, true};
//                Boolean[] variables = new Boolean[]{true, true, false};
//                for (Boolean condition : conditions) {
//
//                }
                if (parts != null) {
                    for (Part part : parts) {
                        if (part.getName().equals("contents")) {
                            requestParameters.put("contents", new String[]{IOUtils.toString(part.getInputStream(), Charset.defaultCharset())});
                        }
                    }
                }

                if (action.toString().contains("EDIT")) {
                    sb.append(DatabaseWrapper.actionEDITOBJECT(requestParameters, cookie, action.getMongoConf()));
                } else {
                    if (action.toString().contains("LOAD")) {
                        //sb.append(DatabaseWrapper.actionLOADOBJECT(cookie, action.getMongoConf()));
                        BasicDBObject searchObject = new BasicDBObject();
                        sb.append(DatabaseWrapper.actionLOADOBJECT(cookie, action.getMongoConf(), searchObject, new String[]{"contents"}));
                    }
                    if (action == mdm.Config.Actions.VALIDATION_GETVALIDATION) {
                        sb.append(actionGETVALIDATION());
                    }
//                    if (action == mdm.Config.Actions.NOTE_SAVENOTE) {
//                        sb.append(actionNOTE_SAVENOTE());
//                    }
                }

            } else {
                sb.append(DatabaseWrapper.getWebPage("credentials/index.html", new String[]{"credentials/servletCalls.js", "credentials/interface.js"}));
            }

            return sb;
        }

//        private StringBuilder actionNOTE_GETNOTE() throws IOException, ClassNotFoundException {
//            StringBuilder sb = new StringBuilder();
//            if (Core.checkSession(cookie)) {
//                String id = requestParameters.get("id")[0];
//                if (!id.equals("")) {
//                    Validations validations = DatabaseActions.getValidations(DatabaseActions.getSession(cookie).getUsername(), id);
//                    sb.append(getValidations(validations));
//                }
//
//            }
//            return sb;
//        }
        private StringBuilder actionGETVALIDATION() throws IOException, ClassNotFoundException, NoSuchFieldException {
            StringBuilder sb = new StringBuilder();
            if (Core.checkSession(cookie)) {
                String id = requestParameters.get("id")[0];
                if (!id.equals("")) {
                    BasicDBObject searchObject = new BasicDBObject();
                    ObjectMapper mapper = new ObjectMapper();
                    ObjectNode jsonData = mapper.createObjectNode();
                    searchObject.put("validationid", new BasicDBObject("$eq", id));
                    Map<String, Object> searchResult = DatabaseWrapper.getObjectHashMap(cookie, MongoConf.VALIDATIONS, searchObject);
                    sb.append(getValidation(searchResult));
                }
            }
            return sb;
        }

        private ObjectNode getValidation(Map<String, Object> validation) throws JsonProcessingException {
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode jsonData = mapper.createObjectNode();
            ObjectNode jsonReplaces = mapper.createObjectNode();
            jsonReplaces.put("LCMSEditablePage-id", validation.get("validationid").toString());
            jsonReplaces.put("LCMSEditablePage-content", validation.get("contents").toString());
            validation.put("contents", "");
            jsonData.put("webPage", loadWebFile("validation/template/index.html"));
            jsonData.set("replaces", jsonReplaces);
            return jsonData;
        }

    }

}
