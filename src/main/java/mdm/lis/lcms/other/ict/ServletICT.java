/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm.lis.lcms.other.ict;

import com.fasterxml.jackson.core.JsonProcessingException;
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
import mdm.Mongo.DatabaseWrapper;
import mdm.workflows.Workflows;

/**
 *
 * @author matmey
 */
@WebServlet(name = "ICTServlet", urlPatterns = {"/ict"})
public class ServletICT extends HttpServlet {

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

        ActionManagerICT aM = new ActionManagerICT(requestParameters);

        if (aM.getAction() != null) {
            try {
                sb.append(aM.startAction());
            } catch (ClassNotFoundException ex) {
                Logger.getLogger(ServletICT.class.getName()).log(Level.SEVERE, null, ex);
            } catch (NoSuchFieldException ex) {
                Logger.getLogger(ServletICT.class.getName()).log(Level.SEVERE, null, ex);
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

    class ActionManagerICT {

        String cookie;
        mdm.Config.Actions action;
        HashMap<String, String[]> requestParameters = new HashMap<String, String[]>();

        public ActionManagerICT(Map<String, String[]> requestParameters) {
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
                    String operation = requestParameters.get("oper")[0].toString();
                    sb.append(DatabaseWrapper.actionEDITOBJECT(requestParameters, cookie, action.getMongoConf()));
                    Workflows.workflowICTTicket(requestParameters, operation, cookie);
                } else {
                    if (action.toString().contains("LOAD")) {
                        sb.append(DatabaseWrapper.actionLOADOBJECT(cookie, action.getMongoConf()));
                    }
                }

            } else {
                sb.append(DatabaseWrapper.getCredentialPage());
            }

            return sb;
        }

    }

}
