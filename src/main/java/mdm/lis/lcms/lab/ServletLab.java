/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm.lis.lcms.lab;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mongodb.BasicDBObject;
import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;
import java.math.BigDecimal;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
import mdm.GsonObjects.Lab.InventoryItem;
import mdm.GsonObjects.Lab.LabItem;
import mdm.Mongo.DatabaseWrapper;
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
            if (cookie != null) {

                if (action.toString().contains("EDIT")) {
                    sb.append(DatabaseWrapper.actionEDITOBJECT(requestParameters, cookie, action.getMongoConf()));
                } else {
                    if (action.toString().contains("LOAD")) {
                        sb.append(DatabaseWrapper.actionLOADOBJECT(cookie, action.getMongoConf()));
                    } else {
                        if (action == Actions.LAB_CHECKINVENTORY) {
                            sb.append(actionLAB_CHECKINVENTORY());
                        }
                        if (action == Actions.LAB_WORKSUMMARY) {
                            sb.append(actionLAB_WORKSUMMARY());
                        }
                        if (action == Actions.LAB_KPI_HEMOLYSIS) {
                            sb.append(actionLAB_KPI_HEMOLYSIS());
                        }
                    }
                }

            } else {
                sb.append(DatabaseWrapper.getWebPage("credentials/index.html", new String[]{"credentials/servletCalls.js", "credentials/interface.js"}));
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

            List<String> lines = new ArrayList<>();
            String pth = context.getRealPath("/HTML/other/worksummary/worksummarydata/data.txt");
            try (Stream<String> stream = Files.lines(Paths.get(pth), Charset.forName("ISO-8859-1"))) {
                lines = stream
                        .map(String::toUpperCase)
                        .filter(line -> line.contains("'"))
                        .collect(Collectors.toList());
            } catch (IOException e) {
                e.printStackTrace();
            }

            List<String> issuers = new ArrayList<>();
            try (Stream<String> stream = Files.lines(Paths.get("\\\\knolab\\Kwalsys\\mdmTools\\LCMSdata\\issuers.json"), Charset.forName("ISO-8859-1"))) {
                issuers = stream
                        .map(String::toUpperCase)
                        .filter(line -> line.contains("'"))
                        .collect(Collectors.toList());
            } catch (IOException e) {
                e.printStackTrace();
            }

            List<String> stations = new ArrayList<>();
            try (Stream<String> stream = Files.lines(Paths.get("\\\\knolab\\Kwalsys\\mdmTools\\LCMSdata\\stations.json"), Charset.forName("ISO-8859-1"))) {
                stations = stream
                        .map(String::toUpperCase)
                        .filter(line -> line.contains("'"))
                        .collect(Collectors.toList());
            } catch (IOException e) {
                e.printStackTrace();
            }

            jsonData.put("data", mapper.writeValueAsString(lines));
            jsonData.put("issuers", mapper.writeValueAsString(issuers));
            jsonData.put("stations", mapper.writeValueAsString(stations));
            StringBuilder sb = new StringBuilder();
            sb.append(jsonData);
            return sb;
        }

        private StringBuilder actionLAB_KPI_HEMOLYSIS() throws ClassNotFoundException, NoSuchFieldException, IOException {
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode jsonData = mapper.createObjectNode();
            List<String> lines = new ArrayList<>();
            //C:\Users\Matthias\Documents\NetBeansProjects\LCMS\target\LCMS-1.0-SNAPSHOT\HTML\lab\kpi\data
            String pth = context.getRealPath("/HTML/lab/kpi/data/hemolysis.txt");
            try (Stream<String> stream = Files.lines(Paths.get(pth), Charset.forName("ISO-8859-1"))) {
                lines = stream
                        .map(String::toUpperCase)
                        .filter(line -> line.contains("'"))
                        .collect(Collectors.toList());
            } catch (IOException e) {
                e.printStackTrace();
            }
            jsonData.put("data", mapper.writeValueAsString(lines));
            StringBuilder sb = new StringBuilder();
            sb.append(jsonData);
            return sb;
        }

    }

}
