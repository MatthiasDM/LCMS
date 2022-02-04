/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package sdm.gcms.database;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mongodb.BasicDBObject;
import sdm.gcms.Config;
import java.io.IOException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import static sdm.gcms.Config.loadScriptFile;
import static sdm.gcms.Config.loadWebFile;

import static sdm.gcms.database.DatabaseActions.getEnviromentInfo;
import org.bson.Document;
import org.bson.conversions.Bson;
import sdm.gcms.shared.database.filters.annotation.gcmsObject;

import java.util.HashMap;
import java.util.List;
import org.apache.commons.collections.CollectionUtils;
import sdm.gcms.shared.database.collections.MongoConfigurations;
import static sdm.gcms.shared.database.Core.universalObjectMapper;
import sdm.gcms.shared.database.collections.ActionPrivelege;
import sdm.gcms.shared.database.collections.Actions;
import sdm.gcms.shared.database.users.Session;
import sdm.gcms.shared.database.users.User;
import sdm.gcms.shared.database.Database;
import static sdm.gcms.shared.database.Database.getUserRoles;
import sdm.gcms.shared.database.users.Role;

/**
 *
 * @author matmey
 */
public class DatabaseWrapper {

    public static ObjectNode getUserInfo(Session session) {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode jsonParameters = mapper.createObjectNode();
        ObjectNode jsonData = mapper.createObjectNode();
        long now = Instant.now().toEpochMilli() / 1000;

        jsonParameters.put("userName", session.getUsername());
        jsonParameters.put("timeout", session.getValidity() - now);
        jsonData.put("webPage", loadWebFile("credentials/userinfo/index.html"));
        jsonData.set("parameters", jsonParameters);

        return jsonData;
    }

    public static ObjectNode getWebPage(String page, String[] scripts) throws JsonProcessingException, IOException {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode jsonData = mapper.createObjectNode();
        ObjectNode jsonParameters = mapper.createObjectNode();

        StringBuilder scriptBuilder = new StringBuilder();
        for (String script : scripts) {
            scriptBuilder.append(loadScriptFile(script));
        }
        jsonParameters.put("software-version", getEnviromentInfo());
        //jsonParameters.put("logo", getEnviromentInfo());
        jsonData.put("webPage", loadWebFile(page));
        jsonData.put("scripts", scriptBuilder.toString());
        jsonData.set("parameters", jsonParameters);
        return jsonData;
    }

    public static ArrayList<Document> getObjectSpecificRawDatav2(String cookie, MongoConfigurations _mongoConf, Bson bson) throws ClassNotFoundException, NoSuchFieldException, IOException {
        ArrayList<Document> results = DatabaseActions.getObjectsSpecificListv2(cookie, _mongoConf, bson, null, 0, null, false);
        return results;
    }

    public static Map<String, Object> getObjectHashMapv2(String cookie, MongoConfigurations _mongoConf, Bson bson) throws ClassNotFoundException, JsonProcessingException, IOException {
        ArrayList<Document> results = DatabaseActions.getObjectsSpecificListv2(cookie, _mongoConf, bson, null, 0, null, false);
        String parseDocumentString = "";
        try {
            JsonNode actualObj = universalObjectMapper.readTree(universalObjectMapper.writeValueAsString(results.get(0)));
            parseDocumentString = actualObj.toString();
        } catch (Exception e) {
            System.out.println("Error Parsing document into String");
        }
        BasicDBObject obj = BasicDBObject.parse(parseDocumentString);
        Map<String, Object> objHashMap = obj.entrySet().stream().collect(HashMap::new, (m, v) -> m.put(v.getKey(), v.getValue()), HashMap::putAll);

        return objHashMap;
    }

    public static Map<String, Object> revertChanges(ArrayList<Document> docs, Map<String, Object> currentDocument, MongoConfigurations objectConfiguration) throws JsonProcessingException, ClassNotFoundException, NoSuchFieldException {
        ObjectMapper mapper = new ObjectMapper();
        Collections.reverse(docs);
        Map<String, Object> documentHashMap = currentDocument;
        Map<String, Object> newHashMap;
        Integer i = 0;
        for (i = 0; i < docs.size() - 1; i++) {//Optional.ofNullable(entry.getValue()).orElse(""))

            BasicDBObject obj = BasicDBObject.parse(mapper.writeValueAsString(docs.get(i)));
            Map<String, Object> backlogHashMap = obj.entrySet().stream()
                    .collect(Collectors.toMap(entry -> entry.getKey(), entry -> Optional.ofNullable(entry.getValue()).orElse("")));

            BasicDBObject changes = BasicDBObject.parse(backlogHashMap.get("changes").toString());
            Map<String, Object> changesHashMap = changes.entrySet().stream().collect(Collectors.toMap(entry -> entry.getKey(), entry -> Optional.ofNullable(entry.getValue()).orElse("")));

            for (String key : changesHashMap.keySet()) {
                if (documentHashMap.containsKey(key)) {

                    gcmsObject mdmAnnotations = Class.forName(objectConfiguration.getClassName()).getField(key).getAnnotation(gcmsObject.class);
                    if (!mdmAnnotations.DMP()) {
                        documentHashMap.put(key, changesHashMap.get(key));
                    } else {
                        //documentHashMap.put(key, DatabaseActions.revertDMP(documentHashMap.get(key).toString(), changesHashMap.get(key).toString()));
                    }
                }
            }

        }

        return documentHashMap;
    }

    public static Actions getAction(String _action) throws ClassNotFoundException, IOException {
        Actions action = null;
        BasicDBObject searchObject = new BasicDBObject();
        searchObject.put("name", new BasicDBObject("$eq", _action));
        MongoConfigurations actionsConfiguration = Database.getMongoConfiguration("actions");
        ArrayList<Document> results = DatabaseActions.getObjectsSpecificListv2("", actionsConfiguration, searchObject, null, 1000, new String[]{}, false);
        if (results.size() > 0) {
            action = universalObjectMapper.convertValue(results.get(0), Actions.class);
            if(action.getMethod() == null){
                String method = action.name.toUpperCase().startsWith("EDIT") ? "post" : "get";
                action.setMethod(Database.getMethod(method).getMethodId());
            }
        }
        return action;
    }

    public static List<ActionPrivelege> getActionPriveleges(Actions _action) throws ClassNotFoundException, IOException {
        List<ActionPrivelege> actionPriveleges = new ArrayList<>();
        BasicDBObject searchObject = new BasicDBObject();
        searchObject.put("actions", new BasicDBObject("$eq", _action.getActionsid()));
        MongoConfigurations actionsConfiguration = Database.getMongoConfiguration("actionPriveleges");
        ArrayList<Document> results = DatabaseActions.getObjectsSpecificListv2("", actionsConfiguration, searchObject, null, 1000, new String[]{}, false);
        for (Document result : results) {
            actionPriveleges.add(universalObjectMapper.convertValue(result, ActionPrivelege.class));
        }
        return actionPriveleges;
    }
    
        public static List<Actions> getActions(String collectionId) throws ClassNotFoundException, IOException {
        List<Actions> actions = new ArrayList<>();
        BasicDBObject searchObject = new BasicDBObject();
        searchObject.put("mongoconfiguration", new BasicDBObject("$eq", collectionId));
        MongoConfigurations actionsConfiguration = Database.getMongoConfiguration("actions");
        ArrayList<Document> results = DatabaseActions.getObjectsSpecificListv2("", actionsConfiguration, searchObject, null, 1000, new String[]{}, false);
        for (Document result : results) {
            actions.add(universalObjectMapper.convertValue(result, Actions.class));
        }
        return actions;
    } 
        
    public static Boolean checkActionAccess(String cookie, List<ActionPrivelege> actionPriveleges) {
        Boolean access = false;
        if (actionPriveleges.size() > 0) {
            if (actionPriveleges.stream().anyMatch((actionPrivelege) -> (actionPrivelege.getSession() == false))) {
                return true;
            }
            List<Role> userRoles = getUserRoles(cookie);
            List<String> userRoleNames = userRoles.stream().map(p -> p.getRole()).collect(Collectors.toList());
            
            User user = Config.getUserData(cookie);
            if (actionPriveleges.stream().anyMatch((actionPrivelege) -> (CollectionUtils.containsAny(actionPrivelege.getExecutionRoles(), userRoleNames)))) {
                return true;
            }
            if (actionPriveleges.stream().anyMatch((actionPrivelege) -> (actionPrivelege.getExecutionUsers().contains(user.getUserid())))) {
                return true;
            }
        } else {
            return Config.checkSession(cookie);
        }
        return false;
    }

}
