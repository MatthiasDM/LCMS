/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm.lis.lcms.lab;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mongodb.BasicDBObject;
import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import mdm.Config.Actions;
import mdm.Config.MongoConf;
import static mdm.Core.checkSession;
import static mdm.Core.getProp;
import static mdm.Core.loadWebFile;
import mdm.GsonObjects.Lab.InventoryItem;
import mdm.GsonObjects.Lab.LabItem;
import mdm.Mongo.DatabaseWrapper;
import org.apache.commons.lang.StringUtils;
import org.bson.Document;

/**
 *
 * @author matmey
 */
@WebServlet(name = "labServlet", urlPatterns = {"/lab"})
public class ServletLab extends HttpServlet {

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

        Map<String, String[]> requestParameters = request.getParameterMap();

        ActionManagerLab aM = new ActionManagerLab(requestParameters);

        if (aM.getAction() != null) {
            try {
                sb.append(aM.startAction());
            } catch (ClassNotFoundException ex) {
                Logger.getLogger(ServletLab.class.getName()).log(Level.SEVERE, null, ex);
            } catch (NoSuchFieldException ex) {
                Logger.getLogger(ServletLab.class.getName()).log(Level.SEVERE, null, ex);
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

    class ActionManagerLab {

        String cookie;
        mdm.Config.Actions action;
        HashMap<String, String[]> requestParameters = new HashMap<String, String[]>();

        public ActionManagerLab(Map<String, String[]> requestParameters) {
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

            if (checkSession(cookie)) {

                if (action.toString().toUpperCase().contains("EDIT")) {
                    sb.append(DatabaseWrapper.actionEDITOBJECT(requestParameters, cookie, action.getMongoConf()));
                } else {
                    if (action.toString().toUpperCase().contains("LOAD")) {
                        sb.append(DatabaseWrapper.actionLOADOBJECT(cookie, action.getMongoConf(), new BasicDBObject(), new String[]{}));
                    } else {

                        if (action == Actions.PIVOTTABLE_GETTABLE) {
                            BasicDBObject searchObject = new BasicDBObject();
                            searchObject.put("page", new BasicDBObject("$eq", requestParameters.get("page")[0]));
                            sb.append(DatabaseWrapper.actionLOADOBJECT(cookie, action.getMongoConf(), searchObject, new String[]{}));
                        }
                        if (action == Actions.LAB_CHECKINVENTORY) {
                            sb.append(actionLAB_CHECKINVENTORY());
                        }

                        if (action == Actions.LAB_KPI_HEMOLYSIS) {
                            sb.append(actionLAB_KPI("hemolysis", "json"));
                        }
                        if (action == Actions.LAB_KPI_WORKPRESSURE) {
                            sb.append(actionLAB_KPI("workload", "json"));
                        }
                        if (action == Actions.LAB_KPI_TAT) {
                            sb.append(actionLAB_KPI("tat", "json"));
                        }
                        if (action == Actions.LAB_KPI_CITRATE) {
                            sb.append(actionLAB_KPI("citrate", "json"));
                        }
                        if (action == Actions.LAB_KPI_HEMOFP) {
                            sb.append(actionLAB_KPI("hemoFP", "json"));
                        }
                        if (action == Actions.LAB_KPI_NC) {
                            sb.append(actionLAB_KPI("NC", "json"));
                        }
                        if (action == Actions.LAB_GETCHAT) {
                            sb.append(actionLAB_GETCHAT());
                        }
                        if (action == Actions.LAB_SENDCHAT) {
                            sb.append(actionLAB_SENDCHAT());
                        }
                        if (action == Actions.LAB_WORKSUMMARY) {
                            sb.append(actionLAB_WORKSUMMARY());
                        }

                    }
                }

            } else {
                //UIT DE BEVEILIGDE ZONE!!!!!!!!!!!!!!!
                if (action == Actions.LAB_WORKSUMMARY) {
                    sb.append(actionLAB_WORKSUMMARY());
                } else {
                    sb.append(DatabaseWrapper.getWebPage("credentials/index.html", new String[]{"credentials/servletCalls.js", "credentials/interface.js"}));
                }
            }

            return sb;
        }

        private StringBuilder actionLAB_CHECKINVENTORY() throws ClassNotFoundException, NoSuchFieldException, IOException {
            BasicDBObject searchObject = new BasicDBObject();
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode jsonData = mapper.createObjectNode();
            searchObject.put("barcode", new BasicDBObject("$eq", requestParameters.get("barcode")[0]));
            //inventoryitem
            StringBuilder sb = new StringBuilder();

            ArrayList<Document> searchResult = DatabaseWrapper.getObjectSpecificRawData(cookie, MongoConf.INVENTORY, searchObject);
            if (searchResult.size() > 0) { // Dit is het geval wanneer een product uit de voorraad wordt gehaald.
                InventoryItem inventoryItem = mapper.readValue(mapper.writeValueAsString(searchResult.get(0)), InventoryItem.class);
                Instant instant = Instant.now();
                inventoryItem.setDate_out(instant.toEpochMilli());
                jsonData.put("action", "checkout");
                jsonData.put("result", mapper.writeValueAsString(inventoryItem));
            } else {
                searchObject = new BasicDBObject();
                searchObject.put("identifier", new BasicDBObject("$eq", requestParameters.get("barcode")[0]));
                searchResult = DatabaseWrapper.getObjectSpecificRawData(cookie, MongoConf.LABITEM, searchObject);

                if (searchResult.size() > 0) {
                    jsonData.put("action", "newinventoryitem");
                    LabItem labItem = mapper.readValue(mapper.writeValueAsString(searchResult.get(0)), LabItem.class);
                    jsonData.put("result", mapper.writeValueAsString(labItem));
                } else {
                    jsonData.put("action", "newlabitem");
                }

            }

            sb.append(jsonData);

            return sb;
        }

        private StringBuilder actionLAB_WORKSUMMARY() throws ClassNotFoundException, NoSuchFieldException, IOException {
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode jsonData = mapper.createObjectNode();
            String dataURL =  getProp("worksummary.data");
            String issuersURL = getProp("worksummary.issuers");
            String stationsURL = getProp("worksummary.stations");
            String tatsURL = getProp("worksummary.tats");
            
            List<String> lines = new ArrayList<>();
            String pth = context.getRealPath(dataURL);
            try (Stream<String> stream = Files.lines(Paths.get(dataURL), Charset.forName("ISO-8859-1"))) {
                lines = stream
                        .map(String::toUpperCase)
                        .filter(line -> line.contains("'"))
                        .collect(Collectors.toList());
            } catch (IOException e) {
                e.printStackTrace();
            }

            List<String> issuers = new ArrayList<>();
            try (Stream<String> stream = Files.lines(Paths.get(issuersURL), Charset.forName("ISO-8859-1"))) {
                issuers = stream
                        .map(String::toUpperCase)
                        .filter(line -> line.contains("'"))
                        .collect(Collectors.toList());
            } catch (IOException e) {
                e.printStackTrace();
            }

            List<String> stations = new ArrayList<>();
            try (Stream<String> stream = Files.lines(Paths.get(stationsURL), Charset.forName("ISO-8859-1"))) {
                stations = stream
                        .map(String::toUpperCase)
                        .filter(line -> line.contains("'"))
                        .collect(Collectors.toList());
            } catch (IOException e) {
                e.printStackTrace();
            }

            List<String> tats = new ArrayList<>();
            try (Stream<String> stream = Files.lines(Paths.get(tatsURL), Charset.forName("ISO-8859-1"))) {
                tats = stream
                        .map(String::toUpperCase)
                        .filter(line -> line.contains("'"))
                        .collect(Collectors.toList());
            } catch (IOException e) {
                e.printStackTrace();
            }


            jsonData.put("data", mapper.writeValueAsString(lines));
            jsonData.put("issuers", mapper.writeValueAsString(issuers));
            jsonData.put("stations", mapper.writeValueAsString(stations));
            jsonData.put("tats", mapper.writeValueAsString(tats));
          
            StringBuilder sb = new StringBuilder();
            sb.append(jsonData);
            return sb;
        }

        private StringBuilder actionLAB_KPI(String type, String filetype) throws ClassNotFoundException, NoSuchFieldException, IOException {
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode jsonData = mapper.createObjectNode();
            List<String> lines = new ArrayList<>();
            List<String> allLines = new ArrayList<>();

            if (filetype.equals("csv")) {
                try (Stream<String> stream = Files.lines(Paths.get("\\\\knolab\\Kwalsys\\mdmTools\\LCMSdata\\KPI\\" + type + "\\data.csv"), Charset.forName("ISO-8859-1"))) {
                    lines = stream
                            .map(String::toUpperCase)
                            //.filter(line -> line.contains("{"))
                            .collect(Collectors.toList());
                } catch (IOException e) {
                    e.printStackTrace();
                }
                jsonData.put("data", StringUtils.join(lines, "\n"));
            } else {
                if (filetype.equals("json")) {

                    File folder = new File("\\\\knolab\\Kwalsys\\mdmTools\\LCMSdata\\KPI\\" + type);
                    File[] listOfFiles = folder.listFiles();
                    for (File file : listOfFiles) {
                        if (file.isFile()) {
                            System.out.println(file.getName());

                            try (Stream<String> stream = Files.lines(file.toPath(), Charset.forName("ISO-8859-1"))) {
                                lines = stream
                                        .map(String::toUpperCase)
                                        .filter(line -> line.contains("{"))
                                        .collect(Collectors.toList());
                                allLines.addAll(lines);
                            } catch (IOException e) {
                                e.printStackTrace();
                            }

                        }
                    }

                    jsonData.put("data", mapper.writeValueAsString(allLines));
                }
            }

            StringBuilder sb = new StringBuilder();
            sb.append(jsonData);
            return sb;
        }

        private StringBuilder actionLAB_GETCHAT() throws ClassNotFoundException, NoSuchFieldException, IOException {
            StringBuilder sb = new StringBuilder();
            BasicDBObject searchObject = new BasicDBObject();
            searchObject.put("correspondent", new BasicDBObject("$eq", requestParameters.get("correspondent")));
            sb.append(DatabaseWrapper.getObjectData(cookie, action.getMongoConf(), action.getMongoConf().getCollection(), searchObject, new String[]{}));
            return sb;
        }

        private StringBuilder actionLAB_SENDCHAT() throws ClassNotFoundException, NoSuchFieldException, IOException {
            StringBuilder sb = new StringBuilder();
            Class cls = Class.forName(action.getMongoConf().getClassName());
            requestParameters.remove("oper");
            requestParameters.remove("id");
            requestParameters.remove("action");
            HashMap<String, Object> parameters = new HashMap<>();
            requestParameters.forEach((key, value) -> {
                parameters.put(key, value[0]);
            });
            parameters.put("sessionid", parameters.get("LCMS_session"));
            parameters.remove("LCMS_session");
            ObjectMapper mapper = new ObjectMapper();
            mapper.enable(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY);
            Object labitem = mapper.readValue(mapper.writeValueAsString(parameters), cls);//createNoteObject(requestParameters.get("docid")[0], "create");
            Document document = Document.parse(mapper.writeValueAsString(labitem));
            document.append(action.getMongoConf().getIdName(), UUID.randomUUID().toString());
            DatabaseWrapper.addObject(document, action.getMongoConf(), cookie);
            sb.append(mapper.writeValueAsString(document));
            return sb;
        }

        private ObjectNode getLCMSEditablePage(Map<String, Object> LCMSEditablePage) throws JsonProcessingException {
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode jsonData = mapper.createObjectNode();
            ObjectNode jsonReplaces = mapper.createObjectNode();
            jsonReplaces.put("LCMSEditablePage-id", LCMSEditablePage.get("validationid").toString());
            jsonReplaces.put("LCMSEditablePage-content", LCMSEditablePage.get("contents").toString());
            LCMSEditablePage.put("contents", "");
            jsonData.put("webPage", loadWebFile("validation/template/index.html"));
            jsonData.set("replaces", jsonReplaces);
            return jsonData;
        }

    }

}
