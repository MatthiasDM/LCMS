package gcms.qcmanager;

///*
// * To change this license header, choose License Headers in Project Properties.
// * To change this template file, choose Tools | Templates
// * and open the template in the editor.
// */
//package gcms.lis.lcms.other.qcmanager;
//
//import com.fasterxml.jackson.core.type.TypeReference;
//import com.fasterxml.jackson.databind.JsonNode;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.fasterxml.jackson.databind.node.ObjectNode;
//import java.io.IOException;
//import java.lang.reflect.Field;
//import java.util.ArrayList;
//import java.util.Arrays;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//import java.util.logging.Level;
//import java.util.logging.Logger;
//import gcms.Core;
//import static gcms.Core.checkUserRole;
//import gcms.GsonObjects.Lab.Instrument;
//import gcms.Mongo.MongoMain;
//import gcms.PageLoader;
//import gcms.pojo.annotations.MdmAnnotations;
//
///**
// *
// * @author matmey
// */
//public class ActionManagerQC {
//
//    String cookie;
//    Core.Actions action;
//    HashMap<String, String[]> requestParameters = new HashMap<String, String[]>();
//
//    public ActionManagerQC(Map<String, String[]> requestParameters) {
//        this.requestParameters = new HashMap<String, String[]>(requestParameters);
//        if (requestParameters.get("action") != null) {
//            action = Core.Actions.valueOf(requestParameters.get("action")[0]);
//        }
//        if (requestParameters.get("LCMS_session") != null) {
//            cookie = requestParameters.get("LCMS_session")[0];
//        }
//    }
//
//    public String getCookie() {
//        return cookie;
//    }
//
//    public Core.Actions getAction() {
//        return action;
//    }
//
//    public StringBuilder startAction() throws ClassNotFoundException, IOException {
//        StringBuilder sb = new StringBuilder();
//        if (cookie != null) {
//            if (action == Core.Actions.QC_CHANGELOTINFO) {
//                sb.append(actionQC_CHANGELOTINFO());
//            }
//            if (action == Core.Actions.QC_GETLOTINFO) {
//                try {
//                    sb.append(actionQC_GETLOTINFO());
//                } catch (IOException ex) {
//                    Logger.getLogger(ActionManagerQC.class.getName()).log(Level.SEVERE, ex.getMessage());
//                }
//            }
//            if (action == Core.Actions.QC_CHANGETESTINFO) {
//                sb.append(actionQC_CHANGETESTINFO());
//            }
//            if (action == Core.Actions.QC_GETTESTINFO) {
//                try {
//                    sb.append(actionQC_GETTESTINFO());
//                } catch (IOException ex) {
//                    Logger.getLogger(ActionManagerQC.class.getName()).log(Level.SEVERE, ex.getMessage());
//                }
//            }
//        } else {
//            sb.append(PageLoader.getCredentialPage());
//        }
//        if (checkUserRole(cookie, Core.Roles.QCMANAGER)) {
//
//        }
//
//        return sb;
//    }
//
//    private StringBuilder actionQC_CHANGELOTINFO() throws IOException, ClassNotFoundException {
//        StringBuilder sb = new StringBuilder();
//        if (cookie != null) {
//            if (checkUserRole(cookie, Core.Roles.QCMANAGER)) {
//                requestParameters.remove("action");
//                requestParameters.remove("LCMS_session");
//                String operation = requestParameters.get("oper")[0];
//                if (requestParameters.get("oper") != null) {
//                    if (operation.equals("edit")) {
//                        requestParameters.remove("oper");
//                        SqliteManager.changeLotInfo(requestParameters);
//                    }
//                    if (operation.equals("add")) {
//                        requestParameters.remove("oper");
//                        SqliteManager.addLotInfo(requestParameters);
//                    }
//                }
//            }
//        } else {
//            sb.append(PageLoader.getCredentialPage());
//        }
//
//        return sb;
//    }
//
//    private StringBuilder actionQC_GETLOTINFO() throws IOException {
//        StringBuilder sb = new StringBuilder();
//        if (cookie != null) {
//            if (Core.checkSession(cookie)) {
//                try {
//
//                    String lotinfo = SqliteManager.getLotTable();
//                    String fieldsString = SqliteManager.getData("PRAGMA table_info(controls);", new String[]{"Name"});
//
//                    ObjectMapper mapper = new ObjectMapper();
//                    ObjectNode jsonData = mapper.createObjectNode();
//
//                    Map<String, Object>[] fields = mapper.convertValue(mapper.readTree(fieldsString), Map[].class);
//
//                    ArrayList<HashMap> header = new ArrayList<>();
//                    ArrayList<HashMap> table = new ArrayList<>();
//                    HashMap tableEntry = new HashMap();
//                    for (Map<String, Object> field : fields) {
//                        //MdmAnnotations mdmAnnotations = field.getAnnotation(MdmAnnotations.class);
//                        HashMap headerEntry = new HashMap();
//                        headerEntry.put("name", field.get("Name").toString());
////                        if (mdmAnnotations != null) {
////                            headerEntry.put("type", mdmAnnotations.type());
////                            headerEntry.put("visible", mdmAnnotations.visible());
////                            headerEntry.put("editable", mdmAnnotations.editable());
////                        }
//                        header.add(headerEntry);
//                        tableEntry.put(field.get("Name").toString(), "");
//                    }
//
//                    if (!lotinfo.isEmpty()) {
//                        jsonData.put("table", mapper.writeValueAsString(lotinfo));
//                    } else {
//                        jsonData.put("table", mapper.writeValueAsString(table));
//                    }
//
//                    jsonData.put("header", mapper.writeValueAsString(header));
//
//                    sb.append(jsonData);
//
//                    //sb.append(lotinfo);
//                } catch (ClassNotFoundException ex) {
//                    Logger.getLogger(ServletQC.class.getName()).log(Level.SEVERE, ex.getMessage());
//                }
//            } else {
//                sb.append(PageLoader.getCredentialPage());
//            };
//        } else {
//            sb.append(PageLoader.getCredentialPage());
//        }
//
//        return sb;
//    }
//
//    private StringBuilder actionQC_CHANGETESTINFO() throws IOException, ClassNotFoundException {
//        StringBuilder sb = new StringBuilder();
//        if (cookie != null) {
//            if (checkUserRole(cookie, Core.Roles.QCMANAGER)) {
//                requestParameters.remove("action");
//                requestParameters.remove("LCMS_session");
//                String operation = requestParameters.get("oper")[0];
//                if (requestParameters.get("oper") != null) {
//                    if (operation.equals("edit")) {
//                        requestParameters.remove("oper");
//                        SqliteManager.changeTestInfo(requestParameters);
//                    }
//                    if (operation.equals("add")) {
//                        requestParameters.remove("oper");
//                        SqliteManager.addTestInfo(requestParameters);
//                    }
//                }
//            }
//        } else {
//            sb.append(PageLoader.getCredentialPage());
//        }
//
//        return sb;
//    }
//
//    private StringBuilder actionQC_GETTESTINFO() throws IOException {
//        StringBuilder sb = new StringBuilder();
//        if (cookie != null) {
//            if (Core.checkSession(cookie)) {
//                try {
//                    String lotinfo = SqliteManager.getTestTable();
//                    String fieldsString = SqliteManager.getData("PRAGMA table_info(tests);", new String[]{"Name"});
//                    ObjectMapper mapper = new ObjectMapper();
//                    ObjectNode jsonData = mapper.createObjectNode();
//                    Map<String, Object>[] fields = mapper.convertValue(mapper.readTree(fieldsString), Map[].class);
//                    ArrayList<HashMap> header = new ArrayList<>();
//                    ArrayList<HashMap> table = new ArrayList<>();
//                    HashMap tableEntry = new HashMap();
//                    for (Map<String, Object> field : fields) {
//                        HashMap headerEntry = new HashMap();
//                        headerEntry.put("name", field.get("Name").toString());
//                        header.add(headerEntry);
//                        tableEntry.put(field.get("Name").toString(), "");
//                    }
//                    if (!lotinfo.isEmpty()) {
//                        jsonData.put("table", mapper.writeValueAsString(lotinfo));
//                    } else {
//                        jsonData.put("table", mapper.writeValueAsString(table));
//                    }
//                    jsonData.put("header", mapper.writeValueAsString(header));
//                    sb.append(jsonData);
//                } catch (ClassNotFoundException ex) {
//                    Logger.getLogger(ServletQC.class.getName()).log(Level.SEVERE, ex.getMessage());
//                }
//            } else {
//                sb.append(PageLoader.getCredentialPage());
//            };
//        } else {
//            sb.append(PageLoader.getCredentialPage());
//        }
//
//        return sb;
//    }
//
//}
