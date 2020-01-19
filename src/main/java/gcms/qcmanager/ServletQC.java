package gcms.qcmanager;

///*
// * To change this license header, choose License Headers in Project Properties.
// * To change this template file, choose Tools | Templates
// * and open the template in the editor.
// */
//package gcms.lis.lcms.other.qcmanager;
//
//import java.io.IOException;
//import java.util.HashMap;
//import java.util.Map;
//import java.util.logging.Level;
//import java.util.logging.Logger;
//import javax.servlet.ServletConfig;
//import javax.servlet.ServletContext;
//import javax.servlet.ServletException;
//import javax.servlet.annotation.WebServlet;
//import javax.servlet.http.HttpServlet;
//import javax.servlet.http.HttpServletRequest;
//import javax.servlet.http.HttpServletResponse;
//import gcms.Core;
//import static gcms.Core.checkUserRole;
//import gcms.PageLoader;
//
///**
// *
// * @author matmey
// */
//@WebServlet(name = "qcManager", urlPatterns = {"/qcmanager"})
//public class ServletQC extends HttpServlet {
//
//    private ServletContext context;
//
//    @Override
//    public void init(ServletConfig config) throws ServletException {
//        super.init(); //To change body of generated methods, choose Tools | Templates.
//        this.context = config.getServletContext();
//
//    }
//
//    @Override
//    protected void doPost(HttpServletRequest request, HttpServletResponse response)
//            throws ServletException, IOException {
//        StringBuilder sb = new StringBuilder();
//        Map<String, String[]> requestParameters = request.getParameterMap();
//
//        ActionManagerQC aM = new ActionManagerQC(requestParameters);
//
//        if (aM.getAction() != null) {
//            try {
//                sb.append(aM.startAction());
//            } catch (ClassNotFoundException ex) {
//                Logger.getLogger(ServletQC.class.getName()).log(Level.SEVERE, null, ex);
//            }
//
//        }
//        if (sb.toString().length() > 0) {
//            response.setContentType("text/xml");
//            response.setHeader("Cache-Control", "no-cache");
//            response.getWriter().write(sb.toString());
//        } else {
//            response.setStatus(HttpServletResponse.SC_NO_CONTENT);
//        }
//    }
//}
