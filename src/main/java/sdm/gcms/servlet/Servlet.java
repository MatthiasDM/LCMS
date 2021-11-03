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
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import sdm.gcms.Core;
import java.util.Enumeration;
import javax.xml.bind.DatatypeConverter;
import java.util.stream.Collectors;

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
          Map<String, String> requestParameters = request.getParameterMap().entrySet().stream()
                .collect(Collectors.toMap(e -> (e.getKey()),
                        e -> (e.getValue()[0])));
      //  requestParameters.putAll(request.getParameterMap());
        requestParameters.put("contextPath", context.getRealPath("./HTML/other/files"));
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
                    requestParameters.put("contextPath", context.getRealPath("/HTML/other/files"));
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
