/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.gte;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import mdm.Config.MongoConf;
import mdm.GsonObjects.Core.MongoConfigurations;
import mdm.Mongo.DatabaseActions;
import static mdm.Mongo.DatabaseActions.getDocumentPriveleges;
import mdm.Mongo.DatabaseWrapper;
import org.bson.Document;

/**
 *
 * @author Matthias
 */
public class commandFunctions {

    public static StringBuilder doCommand(String name, Map<String, String[]> parameters) throws ClassNotFoundException, JsonProcessingException, NoSuchFieldException, IOException {
        StringBuilder sb = new StringBuilder();
        if (name.equals("dobacklog")) {
            sb.append(command_doBacklog(parameters));
        }
        return sb;
    }

    public static StringBuilder command1() {
        StringBuilder sb = new StringBuilder();
        return sb;
    }

    public static StringBuilder command_eHealthConnect() {
        StringBuilder sb = new StringBuilder();
        return sb;
    }

    public static StringBuilder command_doBacklog(Map<String, String[]> parameters) throws ClassNotFoundException, JsonProcessingException, NoSuchFieldException, IOException {
        StringBuilder sb = new StringBuilder();
        ObjectMapper mapper = new ObjectMapper();
        mdm.GsonObjects.Core.Actions action = DatabaseWrapper.getAction(parameters.get("action")[0]);
        MongoConfigurations backlogConfiguration = action.getMongoConfiguration(action.mongoconfiguration);
        ArrayList<Document> backlogs = DatabaseWrapper.getObjectSpecificRawDatav2(parameters.get("LCMS_session")[0],
                backlogConfiguration,
                and(eq("object_id", parameters.get("parameters[object_id]")[0]), gte("created_on", new Long(parameters.get("parameters[created_on]")[0]))));
        MongoConfigurations mongoConfiguration = action.getMongoConfiguration("88d14fb4-6694-4aa9-aa67-de6857e328ec");
        ArrayList<Document> results = DatabaseActions.getObjectsSpecificListv2(parameters.get("LCMS_session")[0], mongoConfiguration, and(eq("className", parameters.get("parameters[object_type]")[0])), null, 1000, new String[]{});
        MongoConfigurations objectConfiguration = mapper.convertValue(results.get(0), mdm.GsonObjects.Core.MongoConfigurations.class);
        Map<String, Object> objectHashMap = DatabaseWrapper.getObjectHashMapv2(parameters.get("LCMS_session")[0], objectConfiguration, and(eq(objectConfiguration.getIdName(), parameters.get("parameters[object_id]")[0])));
        DatabaseWrapper.revertChanges(backlogs, objectHashMap, objectConfiguration);

        Class cls = Class.forName(objectConfiguration.getClassName());
        Object databaseItem = mapper.readValue(mapper.writeValueAsString(objectHashMap), cls);//createNoteObject(requestParameters.get("docid")[0], "create");
        sb.append(mapper.writeValueAsString(databaseItem));

        return sb;

    }

}
