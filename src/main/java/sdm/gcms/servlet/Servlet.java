/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package sdm.gcms.servlet;

import com.fasterxml.jackson.core.JsonProcessingException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import jakarta.servlet.ServletConfig;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import sdm.gcms.Config;
import java.util.Enumeration;
import javax.xml.bind.DatatypeConverter;
import java.util.stream.Collectors;
import static sdm.gcms.shared.database.Core.isValidApiKey;

/**
 *
 * @author matmey
 */
@WebServlet(name = "Servlet", urlPatterns = {"/servlet/*"})
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
        //  Map<String, String[]> requestParameters = new HashMap<>();
        // requestParameters.putAll(request.getParameterMap());
        Map<String, String> requestParameters = request.getParameterMap().entrySet().stream()
                .collect(Collectors.toMap(e -> (e.getKey()),
                        e -> (e.getValue()[0])));
        ActionManager aM;
        String apiName, apiKey;
        Boolean apiAuthorized = false;
        apiName = requestParameters.get("api");
        apiKey = requestParameters.get("key");
        String apiCommand = requestParameters.get("command");

        try {
            apiAuthorized = isValidApiKey(apiName, apiKey, apiCommand);
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(Servlet.class.getName()).log(Level.SEVERE, null, ex);
        }

        Response actionResponse = new Response();

        try {
            aM = new ActionManager(requestParameters, apiAuthorized);
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
            response.setContentType("text/xml; charset=utf-8");
            response.setHeader("Cache-Control", "no-cache");
            response.setStatus(actionResponse.responseStatus);
            response.getWriter().write(sb.toString());
        } else {
            response.setStatus(actionResponse.responseStatus);

        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException, JsonProcessingException {
        StringBuilder sb = new StringBuilder();
        Map<String, String> requestParameters = request.getParameterMap().entrySet().stream()
                .collect(Collectors.toMap(e -> (e.getKey()),
                        e -> (e.getValue()[0])));
        //  requestParameters.putAll(request.getParameterMap());
        requestParameters.put("contextPath", context.getRealPath("./HTML/other/files"));
        ActionManager aM;
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
                    apiAuthorized = isValidApiKey(apiName, apiKey, requestParameters.get("command"));
                } catch (ClassNotFoundException ex) {
                    Logger.getLogger(Servlet.class.getName()).log(Level.SEVERE, null, ex);
                }
                requestParameters.put("contextPath", context.getRealPath("/HTML/other/files"));
            }
        }

        Response actionResponse = new Response();
        try {
            if (request.getContentType().contains("multipart")) {
                aM = new ActionManager(requestParameters, request.getParts(), apiAuthorized);
            } else {
                aM = new ActionManager(requestParameters, apiAuthorized);
            }

            if (aM.getAction() != null) {
                try {
                    actionResponse = aM.startAction();
                    sb.append(actionResponse.getSb());
                } catch (ClassNotFoundException | NoSuchFieldException ex) {
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

}
