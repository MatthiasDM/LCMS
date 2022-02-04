/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package sdm.gcms;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.util.Map;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import static sdm.gcms.Config.checkSession;
import sdm.gcms.database.DatabaseWrapper;
import org.apache.commons.lang.StringEscapeUtils;

/**
* This is the main servlet used for loading pages.
* 
* Please see the {@link sdm.gcms.GsonObjects.Core.EditablePage} class for true identity
* @author De Mey Matthias
* 
*/
@WebServlet(name = "pageServlet", urlPatterns = {"/page"})
public class Servlet extends HttpServlet {

    String cookie;
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
        String action = request.getParameter("page");
        Map<String, String[]> requestParameters = request.getParameterMap();
        if (requestParameters.get("LCMS_session") != null) {
            cookie = requestParameters.get("LCMS_session")[0];
        }
        //add json parameter for software name and version and enviroment
        if (checkSession(cookie) || action.equals("pages") || action.equals("")) {
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode jsonData = mapper.createObjectNode();
            if (action.equals("")) {
                 sb.append(DatabaseWrapper.getWebPage("", new String[]{}));
            } else {
                if (action.contains(".") || action.contains(";")) {
                    action = "";
                }
                 action = StringEscapeUtils.escapeHtml(action);
                sb.append(DatabaseWrapper.getWebPage(action, new String[]{}));
            }
        } else {
            sb.append(DatabaseWrapper.getWebPage("credentials/index.html", new String[]{}));
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
