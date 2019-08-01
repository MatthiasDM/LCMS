/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm.Mongo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mongodb.BasicDBObject;
import java.io.IOException;
import java.lang.reflect.Field;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import mdm.Config.MongoConf;
import mdm.Config.Roles;
import mdm.Core;
import static mdm.Core.createDatabaseObject;
import static mdm.Core.encryptString;
import static mdm.Core.loadScriptFile;
import static mdm.Core.loadWebFile;
import mdm.GsonObjects.Core.MongoConfigurations;
import mdm.GsonObjects.Core.Session;
import static mdm.Mongo.DatabaseActions.getDocumentPriveleges;
import static mdm.Mongo.DatabaseActions.getObjects;
import static mdm.Mongo.DatabaseActions.getObject;
import static mdm.Mongo.DatabaseActions.getObjectCount;
import static mdm.Mongo.DatabaseActions.getObjectv2;
import mdm.pojo.annotations.MdmAnnotations;
import org.bson.Document;
import org.bson.conversions.Bson;

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
        try {
            jsonParameters.put("numTasks", getObjectCount(MongoConf.TASKS, new BasicDBObject()));
            BasicDBObject countNotes = new BasicDBObject();
            countNotes.put("author", new BasicDBObject("$eq", session.getUserid()));
            countNotes.put("archived", new BasicDBObject("$eq", false));
            jsonParameters.put("numNotes", getObjectCount(MongoConf.NOTES, countNotes));
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(DatabaseWrapper.class.getName()).log(Level.SEVERE, null, ex);
        }
        jsonData.put("webPage", loadWebFile("credentials/userinfo/index.html"));
        jsonData.set("parameters", jsonParameters);

        return jsonData;
    }

    public static ObjectNode getWebPage(String page, String[] scripts) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode jsonData = mapper.createObjectNode();
        StringBuilder scriptBuilder = new StringBuilder();
        for (String script : scripts) {
            scriptBuilder.append(loadScriptFile(script));
        }
        jsonData.put("webPage", loadWebFile(page));
        jsonData.put("scripts", scriptBuilder.toString());

        return jsonData;
    }

    //OBJECT SPECIFIC   
    public static ObjectNode getObjectData(String cookie, mdm.Config.MongoConf _mongoConf, String tableName, Bson filter, String[] excludes) throws ClassNotFoundException, NoSuchFieldException, IOException {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode jsonData = mapper.createObjectNode();
        ArrayList<Document> results = DatabaseActions.getObjectsSpecificList(cookie, _mongoConf, filter, null, 1000, excludes);
        List<String> columns = getDocumentPriveleges("view", cookie, _mongoConf.getClassName());
        List<String> editableColumns = getDocumentPriveleges("edit", cookie, _mongoConf.getClassName());
        ArrayList<HashMap> header = new ArrayList<>();
        ArrayList<HashMap> table = new ArrayList<>();
        HashMap tableEntry = new HashMap();
        for (String column : columns) {
            Class cls = Class.forName(_mongoConf.getClassName());
            Field field = cls.getField(column);
            MdmAnnotations mdmAnnotations = field.getAnnotation(MdmAnnotations.class);
            HashMap headerEntry = new HashMap();
            headerEntry.put("name", field.getName());
            if (mdmAnnotations != null) {
                headerEntry.put("type", mdmAnnotations.type());
                headerEntry.put("visibleOnTable", mdmAnnotations.visibleOnTable());
                headerEntry.put("editable", mdmAnnotations.editable()); //editableColumns.contains(column));
                headerEntry.put("multiple", mdmAnnotations.multiple());
                headerEntry.put("visibleOnForm", mdmAnnotations.visibleOnForm());
                headerEntry.put("tablename", tableName);
                if (!"".equals(mdmAnnotations.reference()[0])) {
                    String refType = mdmAnnotations.reference()[0];
                    if (refType.equals("Mongo")) {
                        ArrayList<String> fields = new ArrayList<>();
                        fields.add(mdmAnnotations.reference()[2]);
                        fields.add(mdmAnnotations.reference()[3]);
                        ArrayList<Document> objectList = DatabaseActions.getObjectsList(cookie, mdm.Config.MongoConf.valueOf(mdmAnnotations.reference()[1]), fields);
                        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
                        HashMap<String, String> map = new HashMap<>();
                        for (Object doc : objectList) {
                            String json = mapper.writeValueAsString(doc);
                            HashMap<String, String> tempMap2 = mapper.readValue(json, new TypeReference<Map<String, String>>() {
                            });
                            map.put(tempMap2.get(fields.get(0)), tempMap2.get(fields.get(1)));
                        }
                        headerEntry.put("choices", map);
                    }
                    if (refType.equals("Enum")) {
                        String Enum = mdmAnnotations.reference()[1];
                        if (Enum.equals("Roles")) {
                            Map<String, Roles> roles = new HashMap<>();
                            for (Roles role : Roles.class.getEnumConstants()) {
                                roles.put(role.name(), role);
                            }
                            headerEntry.put("choices", roles);
                        }
                        if (Enum.equals("MongoConf")) {
                            Map<String, MongoConf> mongoConfs = new HashMap<>();
                            for (MongoConf mongoConf : MongoConf.class.getEnumConstants()) {
                                mongoConfs.put(mongoConf.name(), mongoConf);
                            }
                            headerEntry.put("choices", mongoConfs);
                        }
                    }
                } else {
                    headerEntry.put("choices", mdmAnnotations.choices());
                }
            }
            header.add(headerEntry);
            tableEntry.put(field.getName(), "");
        }
        if (!results.isEmpty()) {
            jsonData.put("table", mapper.writeValueAsString(results));
        } else {
            jsonData.put("table", mapper.writeValueAsString(table));
        }
        jsonData.put("header", mapper.writeValueAsString(header));
        return jsonData;

    }

    //OBJECT SPECIFIC   
    public static ObjectNode getObjectDatav2(String cookie, MongoConfigurations _mongoConf, String tableName, Bson filter, String[] excludes) throws ClassNotFoundException, NoSuchFieldException, IOException {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode jsonData = mapper.createObjectNode();
        ArrayList<Document> results = DatabaseActions.getObjectsSpecificListv2(cookie, _mongoConf, filter, null, 1000, excludes);
        List<String> columns = getDocumentPriveleges("view", cookie, _mongoConf.getClassName());
        List<String> editableColumns = getDocumentPriveleges("edit", cookie, _mongoConf.getClassName());
        for (String column : columns) {

        }
        ArrayList<HashMap> header = new ArrayList<>();
        ArrayList<HashMap> table = new ArrayList<>();
        HashMap tableEntry = new HashMap();
        for (String column : columns) {
            Class cls = Class.forName(_mongoConf.getClassName());
            Field field = cls.getField(column);
            MdmAnnotations mdmAnnotations = field.getAnnotation(MdmAnnotations.class);

            HashMap headerEntry = new HashMap();
            headerEntry.put("name", field.getName());
            if (mdmAnnotations != null) {
                headerEntry.put("type", mdmAnnotations.type());
                headerEntry.put("visibleOnTable", mdmAnnotations.visibleOnTable());
                headerEntry.put("editable", editableColumns.contains(column));
                //headerEntry.put("editable", mdmAnnotations.editable()); //editableColumns.contains(column));
                headerEntry.put("multiple", mdmAnnotations.multiple());
                headerEntry.put("visibleOnForm", mdmAnnotations.visibleOnForm());
                headerEntry.put("tablename", tableName);
                if (!"".equals(mdmAnnotations.reference()[0])) {
                    String refType = mdmAnnotations.reference()[0];
                    if (refType.equals("Mongo")) {
                        ArrayList<String> fields = new ArrayList<>();
                        fields.add(mdmAnnotations.reference()[2]);
                        fields.add(mdmAnnotations.reference()[3]);
                        ArrayList<Document> objectList = DatabaseActions.getObjectsListv2(cookie, DatabaseActions.getMongoConfiguration(mdmAnnotations.reference()[1]), fields);
                        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
                        HashMap<String, String> map = new HashMap<>();
                        for (Object doc : objectList) {
                            String json = mapper.writeValueAsString(doc);
                            HashMap<String, String> tempMap2 = mapper.readValue(json, new TypeReference<Map<String, String>>() {
                            });
                            map.put(tempMap2.get(fields.get(0)), tempMap2.get(fields.get(1)));
                        }
                        headerEntry.put("choices", map);
                    }
                    if (refType.equals("Enum")) {
                        String Enum = mdmAnnotations.reference()[1];
                        if (Enum.equals("Roles")) {
                            Map<String, Roles> roles = new HashMap<>();
                            for (Roles role : Roles.class.getEnumConstants()) {
                                roles.put(role.name(), role);
                            }
                            headerEntry.put("choices", roles);
                        }
                        if (Enum.equals("MongoConf")) {
                            Map<String, MongoConf> mongoConfs = new HashMap<>();
                            for (MongoConf mongoConf : MongoConf.class.getEnumConstants()) {
                                mongoConfs.put(mongoConf.name(), mongoConf);
                            }
                            headerEntry.put("choices", mongoConfs);
                        }
                    }
                } else {
                    headerEntry.put("choices", mdmAnnotations.choices());
                }
            }
            header.add(headerEntry);
            tableEntry.put(field.getName(), "");
        }
        if (!results.isEmpty()) {
            jsonData.put("table", mapper.writeValueAsString(results));
        } else {
            jsonData.put("table", mapper.writeValueAsString(table));
        }
        jsonData.put("header", mapper.writeValueAsString(header));
        return jsonData;

    }

    //OBJECT SPECIFIC with known object   
    public static ObjectNode getObjectDatav3(String cookie, MongoConfigurations _mongoConf, String tableName, Bson filter, String[] excludes) throws ClassNotFoundException, NoSuchFieldException, IOException {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode jsonData = mapper.createObjectNode();
        ArrayList<Document> results = DatabaseActions.getObjectsSpecificListv2(cookie, _mongoConf, filter, null, 1000, excludes);
        List<String> columns = getDocumentPriveleges("view", cookie, _mongoConf.getClassName());
        List<String> editableColumns = getDocumentPriveleges("edit", cookie, _mongoConf.getClassName());
        ArrayList<HashMap> header = new ArrayList<>();
        ArrayList<HashMap> table = new ArrayList<>();
        HashMap tableEntry = new HashMap();
        for (String column : columns) {
            Class cls = Class.forName(_mongoConf.getClassName());
            Field field = cls.getField(column);
            MdmAnnotations mdmAnnotations = field.getAnnotation(MdmAnnotations.class);
            HashMap headerEntry = new HashMap();
            headerEntry.put("name", field.getName());
            if (mdmAnnotations != null) {
                headerEntry.put("type", mdmAnnotations.type());
                headerEntry.put("visibleOnTable", mdmAnnotations.visibleOnTable());
                headerEntry.put("editable", mdmAnnotations.editable()); //editableColumns.contains(column));
                headerEntry.put("multiple", mdmAnnotations.multiple());
                headerEntry.put("visibleOnForm", mdmAnnotations.visibleOnForm());
                headerEntry.put("tablename", tableName);
                if (!"".equals(mdmAnnotations.reference()[0])) {
                    String refType = mdmAnnotations.reference()[0];
                    if (refType.equals("Mongo")) {
                        ArrayList<String> fields = new ArrayList<>();
                        fields.add(mdmAnnotations.reference()[2]);
                        fields.add(mdmAnnotations.reference()[3]);
                        ArrayList<Document> objectList = DatabaseActions.getObjectsList(cookie, mdm.Config.MongoConf.valueOf(mdmAnnotations.reference()[1]), fields);
                        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
                        HashMap<String, String> map = new HashMap<>();
                        for (Object doc : objectList) {
                            String json = mapper.writeValueAsString(doc);
                            HashMap<String, String> tempMap2 = mapper.readValue(json, new TypeReference<Map<String, String>>() {
                            });
                            map.put(tempMap2.get(fields.get(0)), tempMap2.get(fields.get(1)));
                        }
                        headerEntry.put("choices", map);
                    }
                    if (refType.equals("Enum")) {
                        String Enum = mdmAnnotations.reference()[1];
                        if (Enum.equals("Roles")) {
                            Map<String, Roles> roles = new HashMap<>();
                            for (Roles role : Roles.class.getEnumConstants()) {
                                roles.put(role.name(), role);
                            }
                            headerEntry.put("choices", roles);
                        }
                        if (Enum.equals("MongoConf")) {
                            Map<String, MongoConf> mongoConfs = new HashMap<>();
                            for (MongoConf mongoConf : MongoConf.class.getEnumConstants()) {
                                mongoConfs.put(mongoConf.name(), mongoConf);
                            }
                            headerEntry.put("choices", mongoConfs);
                        }
                    }
                } else {
                    headerEntry.put("choices", mdmAnnotations.choices());
                }
            }
            header.add(headerEntry);
            tableEntry.put(field.getName(), "");
        }
        if (!results.isEmpty()) {
            jsonData.put("table", mapper.writeValueAsString(results));
        } else {
            jsonData.put("table", mapper.writeValueAsString(table));
        }
        jsonData.put("header", mapper.writeValueAsString(header));
        return jsonData;

    }

    public static ArrayList<Document> getObjectSpecificRawData(String cookie, mdm.Config.MongoConf _mongoConf, Bson bson) throws ClassNotFoundException, NoSuchFieldException, IOException {
        ArrayList<Document> results = DatabaseActions.getObjectsSpecificList(cookie, _mongoConf, bson, null, 0, null);
        return results;
    }

    public static ArrayList<Document> getObjectSpecificRawDatav2(String cookie, MongoConfigurations _mongoConf, Bson bson) throws ClassNotFoundException, NoSuchFieldException, IOException {
        ArrayList<Document> results = DatabaseActions.getObjectsSpecificListv2(cookie, _mongoConf, bson, null, 0, null);
        return results;
    }

    public static Map<String, Object> getObjectHashMap(String cookie, mdm.Config.MongoConf _mongoConf, Bson bson) throws ClassNotFoundException, JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        ArrayList<Document> results = DatabaseActions.getObjectsSpecificList(cookie, _mongoConf, bson, null, 0, null);
        BasicDBObject obj = BasicDBObject.parse(mapper.writeValueAsString(results.get(0)));
        Map<String, Object> objHashMap = obj.entrySet().stream().collect(Collectors.toMap(entry -> entry.getKey(), entry -> entry.getValue()));
        return objHashMap;
    }

    public static Map<String, Object> getObjectHashMapv2(String cookie, MongoConfigurations _mongoConf, Bson bson) throws ClassNotFoundException, JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        ArrayList<Document> results = DatabaseActions.getObjectsSpecificListv2(cookie, _mongoConf, bson, null, 0, null);
        BasicDBObject obj = BasicDBObject.parse(mapper.writeValueAsString(results.get(0)));
        Map<String, Object> objHashMap = obj.entrySet().stream().collect(Collectors.toMap(entry -> entry.getKey(), entry -> entry.getValue()));
        return objHashMap;
    }

    public static void editObjectData(HashMap<String, Object> mongoObject, MongoConf _mongoConf, String cookie) throws JsonProcessingException, ClassNotFoundException, NoSuchFieldException {
        ObjectMapper mapper = new ObjectMapper();
        List<String> columns = getDocumentPriveleges("edit", cookie, _mongoConf.getClassName());
        List<Field> systemFields = mdm.Core.getSystemFields(_mongoConf.getClassName(), "edit");
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        BasicDBObject obj = BasicDBObject.parse(mapper.writeValueAsString(mongoObject));
        BasicDBObject filteredObj = new BasicDBObject();
        BasicDBObject backlogObj = new BasicDBObject();
        Object oldObject = getObject(_mongoConf, mongoObject.get(_mongoConf.getIdName()).toString());
        Document oldDocument = Document.parse((mapper.writeValueAsString(oldObject)));

        for (String key : obj.keySet()) {
            if (columns.indexOf(key) != -1) {
                if (obj.get(key) != null) {
                    MdmAnnotations mdmAnnotations = Class.forName(_mongoConf.getClassName()).getField(key).getAnnotation(MdmAnnotations.class);
                    if (!mdmAnnotations.DMP()) {
                        filteredObj.put(key, obj.get(key));
                    } else {
                        String patchedObj = DatabaseActions.patchText(oldDocument.get(key), obj.get(key));
                        filteredObj.put(key, patchedObj);
                    }

                    backlogObj.put(key, obj.get(key));
                }
            }
        }

        for (Field systemField : systemFields) {
            filteredObj.remove(systemField.getName());
            if (systemField.getName().equals("edited_on")) {
                filteredObj.put(systemField.getName(), Instant.now().toEpochMilli() / 1);
                backlogObj.put(systemField.getName(), Instant.now().toEpochMilli() / 1);

            }
            if (systemField.getName().equals("edited_by")) {
                filteredObj.put(systemField.getName(), DatabaseActions.getSession(cookie).getUserid());
                backlogObj.put(systemField.getName(), DatabaseActions.getSession(cookie).getUserid());

            }
        }

        filteredObj.put(_mongoConf.getIdName(), obj.get(_mongoConf.getIdName()));
        backlogObj.put(_mongoConf.getIdName(), obj.get(_mongoConf.getIdName()));

        DatabaseActions.updateObjectItem(_mongoConf, filteredObj);
        Document backlog = DatabaseActions.addBackLog(_mongoConf, backlogObj);
//        Map<String, Object> filteredObjHashMap = filteredObj.entrySet().stream().collect(Collectors.toMap(entry -> entry.getKey(), entry -> entry.getValue()));
//        Document backlog = getObjectDifference(_mongoConf, originalDocument, filteredObjHashMap);
        if (backlog != null) {
            getObjects(MongoConf.BACKLOG).insertOne(backlog);
        }
    }

    public static void editObjectDatav2(HashMap<String, Object> mongoObject, MongoConfigurations _mongoConf, String cookie) throws JsonProcessingException, ClassNotFoundException, NoSuchFieldException {
        ObjectMapper mapper = new ObjectMapper();
        List<String> columns = getDocumentPriveleges("edit", cookie, _mongoConf.getClassName());
        List<Field> systemFields = mdm.Core.getSystemFields(_mongoConf.getClassName(), "edit");
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        BasicDBObject obj = BasicDBObject.parse(mapper.writeValueAsString(mongoObject));
        BasicDBObject filteredObj = new BasicDBObject();
        BasicDBObject backlogObj = new BasicDBObject();
        Object oldObject = getObjectv2(_mongoConf, mongoObject.get(_mongoConf.getIdName()).toString());
        Document oldDocument = Document.parse((mapper.writeValueAsString(oldObject)));

        for (String key : obj.keySet()) {
            if (columns.indexOf(key) != -1) {
                if (obj.get(key) != null) {
                    MdmAnnotations mdmAnnotations = Class.forName(_mongoConf.getClassName()).getField(key).getAnnotation(MdmAnnotations.class);
                    if (!mdmAnnotations.DMP()) {
                        filteredObj.put(key, obj.get(key));
                    } else {
                        String patchedObj = DatabaseActions.patchText(oldDocument.get(key), obj.get(key));
                        filteredObj.put(key, patchedObj);
                    }

                    backlogObj.put(key, obj.get(key));
                }
            }
        }

        for (Field systemField : systemFields) {
            filteredObj.remove(systemField.getName());
            if (systemField.getName().equals("edited_on")) {
                filteredObj.put(systemField.getName(), Instant.now().toEpochMilli() / 1);
                backlogObj.put(systemField.getName(), Instant.now().toEpochMilli() / 1);

            }
            if (systemField.getName().equals("edited_by")) {
                filteredObj.put(systemField.getName(), DatabaseActions.getSession(cookie).getUserid());
                backlogObj.put(systemField.getName(), DatabaseActions.getSession(cookie).getUserid());

            }
        }

        filteredObj.put(_mongoConf.getIdName(), obj.get(_mongoConf.getIdName()));
        backlogObj.put(_mongoConf.getIdName(), obj.get(_mongoConf.getIdName()));

        DatabaseActions.updateObjectItemv2(_mongoConf, filteredObj);
        Document backlog = DatabaseActions.addBackLogv2(_mongoConf, backlogObj);
//        Map<String, Object> filteredObjHashMap = filteredObj.entrySet().stream().collect(Collectors.toMap(entry -> entry.getKey(), entry -> entry.getValue()));
//        Document backlog = getObjectDifference(_mongoConf, originalDocument, filteredObjHashMap);
        if (backlog != null) {
            getObjects(MongoConf.BACKLOG).insertOne(backlog);
        }
    }

    public static Map<String, Object> revertChanges(ArrayList<Document> docs, Map<String, Object> currentDocument, MongoConfigurations objectConfiguration) throws JsonProcessingException, ClassNotFoundException, NoSuchFieldException {
        ObjectMapper mapper = new ObjectMapper();
        Collections.reverse(docs);
        Map<String, Object> documentHashMap = null;
        Map<String, Object> newHashMap;
        Integer i = 0;
        for (i = 1; i <= docs.size(); i++) {//Optional.ofNullable(entry.getValue()).orElse(""))

            BasicDBObject obj = BasicDBObject.parse(mapper.writeValueAsString(docs.get(docs.size() - i)));
            Map<String, Object> backlogHashMap = obj.entrySet().stream()
                    .collect(Collectors.toMap(entry -> entry.getKey(), entry -> Optional.ofNullable(entry.getValue()).orElse("")));

            BasicDBObject changes = BasicDBObject.parse(backlogHashMap.get("changes").toString());
            Map<String, Object> changesHashMap = changes.entrySet().stream().collect(Collectors.toMap(entry -> entry.getKey(), entry -> Optional.ofNullable(entry.getValue()).orElse("")));

            if (documentHashMap == null) {
                documentHashMap = currentDocument;
            } else {
                ArrayList<String> currentHashMapKeys = new ArrayList<>(documentHashMap.keySet());
                for (String key : changesHashMap.keySet()) {
                    if (documentHashMap.containsKey(key)) {

                        MdmAnnotations mdmAnnotations = Class.forName(objectConfiguration.getClassName()).getField(key).getAnnotation(MdmAnnotations.class);
                        if (!mdmAnnotations.DMP()) {
                            documentHashMap.put(key, changesHashMap.get(key));
                            currentHashMapKeys.remove(key);
                        } else {
                            documentHashMap.put(key, DatabaseActions.revertDMP(currentDocument.get(key).toString(), changesHashMap.get(key).toString()));
                        }
                    }
//                    for (String leftOverKey : currentHashMapKeys) {
//                        currentHashMap.remove(leftOverKey);
//                    }
                }
            }

        }

        return documentHashMap;
    }

    public static void addObjectv2(Document doc, MongoConfigurations _mongoConf, String cookie) throws ClassNotFoundException {
        ObjectMapper mapper = new ObjectMapper();
        List<String> columns = getDocumentPriveleges("create", cookie, _mongoConf.getClassName());
        List<Field> systemFields = mdm.Core.getSystemFields(_mongoConf.getClassName(), "create");
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        Document filteredDoc = new Document();
        for (String key : doc.keySet()) {
            if (columns.indexOf(key) != -1) {
                filteredDoc.put(key, doc.get(key));
            }
        }
        for (Field systemField : systemFields) {
            filteredDoc.put(systemField.getName(), doc.get(systemField.getName()));
            if (systemField.getName().equals("created_by")) {
                filteredDoc.put(systemField.getName(), DatabaseActions.getSession(cookie).getUserid());
            }
            if (systemField.getName().equals("created_on")) {
                filteredDoc.put(systemField.getName(), Instant.now().toEpochMilli() / 1);
            }
        }
        filteredDoc.put(_mongoConf.getIdName(), doc.get(_mongoConf.getIdName()));

        DatabaseActions.insertObjectItemv2(_mongoConf, filteredDoc);

    }

    public static void addObject(Document doc, MongoConf _mongoConf, String cookie) throws ClassNotFoundException {
        ObjectMapper mapper = new ObjectMapper();
        List<String> columns = getDocumentPriveleges("create", cookie, _mongoConf.getClassName());
        List<Field> systemFields = mdm.Core.getSystemFields(_mongoConf.getClassName(), "create");
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        Document filteredDoc = new Document();
        for (String key : doc.keySet()) {
            if (columns.indexOf(key) != -1) {
                filteredDoc.put(key, doc.get(key));
            }
        }
        for (Field systemField : systemFields) {
            filteredDoc.put(systemField.getName(), doc.get(systemField.getName()));
            if (systemField.getName().equals("created_by")) {
                filteredDoc.put(systemField.getName(), DatabaseActions.getSession(cookie).getUserid());
            }
            if (systemField.getName().equals("created_on")) {
                filteredDoc.put(systemField.getName(), Instant.now().toEpochMilli() / 1);
            }
        }
        filteredDoc.put(_mongoConf.getIdName(), doc.get(_mongoConf.getIdName()));

        DatabaseActions.insertObjectItem(_mongoConf, filteredDoc);

    }

    public static mdm.GsonObjects.Core.Actions getAction(String _action) throws ClassNotFoundException {
        ObjectMapper mapper = new ObjectMapper();
        mdm.GsonObjects.Core.Actions action;
        BasicDBObject searchObject = new BasicDBObject();
        searchObject.put("name", new BasicDBObject("$eq", _action));
        ArrayList<Document> results = DatabaseActions.getObjectsSpecificList("", MongoConf.ACTIONS, searchObject, null, 1000, new String[]{});
        //String jsonObject = mapper.writeValueAsString(results.get(0));
        action = mapper.convertValue(results.get(0), mdm.GsonObjects.Core.Actions.class);
        return action;
    }

    public static StringBuilder actionEDITOBJECT(HashMap<String, String[]> requestParameters, String cookie, MongoConf _mongoConf) throws IOException, ClassNotFoundException, NoSuchFieldException {
        StringBuilder sb = new StringBuilder();
        if (cookie != null) {
            if (Core.checkUserRoleValue(cookie, 2)) {
                requestParameters.remove("action");
                requestParameters.remove("LCMS_session");
                String operation = requestParameters.get("oper")[0];
                Class cls = Class.forName(_mongoConf.getClassName());
                if (requestParameters.get("oper") != null) {
                    if (operation.equals("edit")) {
                        HashMap<String, Object> obj = createDatabaseObject(requestParameters, cls);
                        DatabaseWrapper.editObjectData(obj, _mongoConf, cookie);
                    }
                    if (operation.equals("add")) {
                        requestParameters.remove("oper");
                        requestParameters.remove("id");
                        HashMap<String, Object> parameters = new HashMap<>();
                        requestParameters.forEach((key, value) -> {
                            parameters.put(key, value[0]);
                        });
                        ObjectMapper mapper = new ObjectMapper();
                        mapper.enable(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY);
                        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
                        Object labitem = mapper.readValue(mapper.writeValueAsString(parameters), cls);//createNoteObject(requestParameters.get("docid")[0], "create");
                        Document document = Document.parse(mapper.writeValueAsString(labitem));
                        document.append(_mongoConf.getIdName(), UUID.randomUUID().toString());
                        DatabaseWrapper.addObject(document, _mongoConf, cookie);
                    }
                }
            }
        } else {
            sb.append(DatabaseWrapper.getWebPage("credentials/index.html", new String[]{"credentials/servletCalls.js", "credentials/interface.js"}));
        }
        return sb;
    }

    public static StringBuilder actionLOADOBJECT(String cookie, MongoConf _mongoConf, Bson filter, String[] excludes) throws JsonProcessingException, ClassNotFoundException, NoSuchFieldException, IOException {
        StringBuilder sb = new StringBuilder();
        if (cookie == null) {
            sb.append(DatabaseWrapper.getWebPage("credentials/index.html", new String[]{"credentials/servletCalls.js", "credentials/interface.js"}));
        } else {
            if (Core.checkSession(cookie)) {
                //sb.append(getInstrumentData(cookie));
                sb.append(DatabaseWrapper.getObjectData(cookie, _mongoConf, _mongoConf.getCollection(), filter, excludes));
            } else {
                sb.append(DatabaseWrapper.getWebPage("credentials/index.html", new String[]{"credentials/servletCalls.js", "credentials/interface.js"}));
            };
        }
        return sb;
    }

    public static StringBuilder actionEDITOBJECTv2(HashMap<String, String[]> requestParameters, String cookie, MongoConfigurations _mongoConf) throws IOException, ClassNotFoundException, NoSuchFieldException {
        StringBuilder sb = new StringBuilder();
        if (cookie != null) {
            if (Core.checkUserRoleValue(cookie, 2)) {
                requestParameters.remove("action");
                requestParameters.remove("LCMS_session");
                String operation = requestParameters.get("oper")[0];
                if (requestParameters.get("password") != null) {
                    requestParameters.get("password")[0] = encryptString(requestParameters.get("password")[0]);
                }
                Class cls = Class.forName(_mongoConf.getClassName());

                if (requestParameters.get("oper") != null) {
                    if (operation.equals("edit")) {
                        HashMap<String, Object> obj = createDatabaseObject(requestParameters, cls);
                        DatabaseWrapper.editObjectDatav2(obj, _mongoConf, cookie);
                    }
                    if (operation.equals("add")) {
                        requestParameters.remove("oper");
                        requestParameters.remove("id");
                        HashMap<String, Object> parameters = new HashMap<>();
                        requestParameters.forEach((key, value) -> {
                            parameters.put(key, value[0]);
                        });
                        ObjectMapper mapper = new ObjectMapper();
                        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
                        mapper.enable(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY);
                        Object labitem = mapper.readValue(mapper.writeValueAsString(parameters), cls);//createNoteObject(requestParameters.get("docid")[0], "create");
                        Document document = Document.parse(mapper.writeValueAsString(labitem));
                        document.append(_mongoConf.getIdName(), UUID.randomUUID().toString());
                        DatabaseWrapper.addObjectv2(document, _mongoConf, cookie);
                    }
                }
            }
        } else {
            sb.append(DatabaseWrapper.getWebPage("credentials/index.html", new String[]{"credentials/servletCalls.js", "credentials/interface.js"}));
        }
        return sb;
    }

    public static StringBuilder actionGETOBJECTv2(String cookie, MongoConfigurations _mongoConf, String key, String value, Boolean publicPage) throws JsonProcessingException, JsonProcessingException, ClassNotFoundException, JsonProcessingException, JsonProcessingException {
        StringBuilder sb = new StringBuilder();
        if (cookie == null && !publicPage) {
            sb.append(DatabaseWrapper.getWebPage("credentials/index.html", new String[]{"credentials/servletCalls.js", "credentials/interface.js"}));
        } else {
            if (!key.equals("")) {
                BasicDBObject searchObject = new BasicDBObject();
                ObjectMapper mapper = new ObjectMapper();
                ObjectNode jsonData = mapper.createObjectNode();
                searchObject.put(key, new BasicDBObject("$eq", value));
                Map<String, Object> searchResult = DatabaseWrapper.getObjectHashMapv2(cookie, _mongoConf, searchObject);
                List<String> editRights = getDocumentPriveleges("edit", cookie, _mongoConf.getClassName());
                if (_mongoConf.collection.equals("pages") || _mongoConf.collection.equals("document")) {
                    String menu = "";
                    if (editRights.contains("contents")) {
                        menu = loadWebFile("pages/template/menu.html");
                    }
                    ObjectNode jsonReplaces = mapper.createObjectNode();
                    jsonReplaces.put("LCMSEditablePage-id", searchResult.get(_mongoConf.getIdName()).toString());
                    jsonReplaces.put("LCMSEditablePage-content", searchResult.get("contents").toString());
                    if (_mongoConf.collection.equals("document")) {
                        menu = menu.replaceAll("documentPage", _mongoConf.collection + "PageObject");
                    }
                    jsonReplaces.put("LCMSEditablePage-menu", menu);
                    searchResult.put("contents", "");
                    //jsonData.put("webPage", loadWebFile(_mongoConf.getCollection() + "/template/index.html"));
                    jsonData.put("webPage", loadWebFile("pages/template/index.html"));
                    jsonData.set("replaces", jsonReplaces);
                    sb.append(jsonData);
                } else {

                }

            }
        }
        return sb;
    }

    public static StringBuilder actionLOADOBJECTv2(String cookie, MongoConfigurations _mongoConf, Bson filter, String[] excludes) throws JsonProcessingException, ClassNotFoundException, NoSuchFieldException, IOException {
        StringBuilder sb = new StringBuilder();
        if (cookie == null) {
            sb.append(DatabaseWrapper.getWebPage("credentials/index.html", new String[]{"credentials/servletCalls.js", "credentials/interface.js"}));
        } else {
            if (Core.checkSession(cookie)) {
                //sb.append(getInstrumentData(cookie));
                sb.append(DatabaseWrapper.getObjectDatav2(cookie, _mongoConf, _mongoConf.getCollection(), filter, excludes));
            } else {
                sb.append(DatabaseWrapper.getWebPage("credentials/index.html", new String[]{"credentials/servletCalls.js", "credentials/interface.js"}));
            };
        }
        return sb;
    }

}
