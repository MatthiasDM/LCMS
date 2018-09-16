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
import java.io.IOException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import mdm.Config.Actions;
import mdm.Config.MongoConf;
import mdm.Core;
import static mdm.Core.StringToLong;
import static mdm.Core.checkUserRole;
import mdm.GsonObjects.Lab.Instrument;
import mdm.GsonObjects.Lab.InventoryItem;
import mdm.GsonObjects.Lab.LabItem;
import mdm.Mongo.DatabaseActions;
import mdm.Mongo.DatabaseWrapper;
import static mdm.Mongo.DatabaseWrapper.getInstrumentData;
import org.bson.Document;

/**
 *
 * @author matmey
 */
public class ActionManagerLab_old {

    String cookie;
    mdm.Config.Actions action; 
    HashMap<String, String[]> requestParameters = new HashMap<String, String[]>();

    public ActionManagerLab_old(Map<String, String[]> requestParameters) {
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
                }
            }

        } else {
            sb.append(DatabaseWrapper.getCredentialPage());
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

}
