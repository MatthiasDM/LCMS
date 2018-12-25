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
import mdm.Config.MongoConf;
import mdm.Core;
import static mdm.Core.loadScriptFile;
import static mdm.Core.loadWebFile;
import mdm.GsonObjects.Other.Validation;
import mdm.Mongo.DatabaseActions;
import mdm.Mongo.DatabaseWrapper;

import mdm.lis.lcms.lab.ServletLab;

/**
 *
 * @author matmey
 */
@WebServlet(name = "validationsValidations", urlPatterns = {"/validations"})
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

        ActionManagerValidations aM = new ActionManagerValidations(requestParameters);

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

        public ActionManagerValidations(Map<String, String[]> requestParameters) {
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

//                Boolean[] conditions = new Boolean[]{true, false, true};
//                Boolean[] variables = new Boolean[]{true, true, false};
//                for (Boolean condition : conditions) {
//
//                }

                if (action.toString().contains("EDIT")) {
                    sb.append(DatabaseWrapper.actionEDITOBJECT(requestParameters, cookie, action.getMongoConf()));
                } else {
                    if (action.toString().contains("LOAD")) {
                        sb.append(DatabaseWrapper.actionLOADOBJECT(cookie, action.getMongoConf()));
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

                    //Note note = DatabaseActions.getNote(DatabaseActions.getSession(cookie).getUsername(), id);
                    sb.append(getValidation(searchResult));
                }

            }
            return sb;
        }

//        private StringBuilder actionNOTE_SAVENOTE() throws IOException, ClassNotFoundException {
//            StringBuilder sb = new StringBuilder();
//            if (Core.checkSession(cookie)) {
//                String user = DatabaseActions.getSession(cookie).getUserid();
//                String data = requestParameters.get("content")[0];
//                String docid = requestParameters.get("docid")[0];
//                DatabaseActions.updateValidations(user, docid, data);
//            }
//            return sb;
//        }
        private ObjectNode getValidation(Map<String, Object> validation) throws JsonProcessingException {
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode jsonData = mapper.createObjectNode();
            //ObjectNode jsonParameters = mapper.createObjectNode();
            ObjectNode jsonReplaces = mapper.createObjectNode();

            jsonReplaces.put("validations-id", validation.get("validationid").toString());
            jsonReplaces.put("validations-content", validation.get("contents").toString());
            validation.put("contents", "");
           // jsonData.put("webPage", validation.get("contents").toString());
            
            jsonData.put("webPage", loadWebFile("validation/template/index.html"));
//            jsonData.put("scripts", loadScriptFile("validation/template/servletCalls.js")
//                    + loadScriptFile("validation/template/interface.js") 
//                    + loadScriptFile("../JS/jqGridFree/js/jquery.jqgrid.min.js\"")
//            );
            //jsonData.set("parameters", jsonParameters);
            jsonData.set("replaces", jsonReplaces);
            return jsonData;
        }

    }

}
