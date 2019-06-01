/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm.lis.lcms.credentials;

import com.fasterxml.jackson.core.JsonProcessingException;
import java.io.IOException;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import mdm.Config.Actions;
import static mdm.Core.checkSession;

import mdm.GsonObjects.Core.Session;
import mdm.GsonObjects.Core.User;
import mdm.Mongo.DatabaseActions;
import mdm.Mongo.DatabaseWrapper;
import org.jasypt.util.password.StrongPasswordEncryptor;

/**
 *
 * @author matmey
 */
@WebServlet(name = "credentialsServlet", urlPatterns = {"/credentials"})
public class ServletCredentials extends HttpServlet {

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

       // Map<String, String[]> requestParameters = request.getParameterMap();
        Map<String, String[]> requestParameters = new HashMap<>();
        requestParameters.putAll(request.getParameterMap());
        requestParameters.put("contextPath", new String[]{context.getRealPath("/HTML/other/files")});
        ActionManagerCredentials aM = new ActionManagerCredentials(requestParameters);

        if (aM.getAction() == Actions.CREDENTIALS_LOGIN) {
            try {
                Cookie cookie = aM.actionCREDENTIALS_LOGIN();
                if (cookie != null) {
                    response.addCookie(cookie);
                }
            } catch (ClassNotFoundException ex) {
                Logger.getLogger(ServletCredentials.class.getName()).log(Level.SEVERE, null, ex);
            }
        } else {
            if (aM.getAction() != null) {
                try {
                    sb.append(aM.startAction());
                } catch (ClassNotFoundException ex) {
                    Logger.getLogger(ServletCredentials.class.getName()).log(Level.SEVERE, null, ex);
                }

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

}
