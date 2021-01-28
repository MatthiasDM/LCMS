/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.GsonObjects.Core;

import gcms.GsonObjects.Core.MongoConfigurations;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.BasicDBObject;
import java.util.ArrayList;
import gcms.Config.MongoConf;
import gcms.database.DatabaseActions;
import gcms.GsonObjects.annotations.MdmAnnotations;
import org.bson.Document;

/**
 *
 * @author Matthias
 */
public class Actions {

    @MdmAnnotations(
            type = "string",
            createRole = "SYSTEM",
            //editRole = "SYSTEM",
            visibleOnTable = false,
            visibleOnForm = false
    )
    public String actionsid;
    @MdmAnnotations(
            type = "string",
            editRole = "ICTMANAGER",
            createRole = "ICTMANAGER",
            visibleOnTable = true
    )
    public String name;

    @MdmAnnotations(
            type = "select",
            reference = {"Mongo", "MONGOCONFIGURATIONS", "mongoconfigurationsid", "name"},
            editRole = "ICTMANAGER"
    )
    public String mongoconfiguration;

//    public MongoConfigurations getMongoConfiguration(String _mongoConfigurationName) throws ClassNotFoundException {
//        ObjectMapper mapper = new ObjectMapper();
//        MongoConfigurations mongoConf;
//        BasicDBObject searchObject = new BasicDBObject();
//        searchObject.put("mongoconfigurationsid", new BasicDBObject("$eq", _mongoConfigurationName));
//        ArrayList<Document> results = DatabaseActions.getObjectsSpecificList("", MongoConf.MONGOCONFIGURATIONS, searchObject, null, 1000, new String[]{});
//        //String jsonObject = mapper.writeValueAsString(results.get(0));
//        mongoConf = mapper.convertValue(results.get(0), MongoConfigurations.class);
//        return mongoConf;
//    }
    
    


}
