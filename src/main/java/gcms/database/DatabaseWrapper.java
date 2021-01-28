/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.database;

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
import gcms.Config.MongoConf;
import gcms.Config.Roles;
import gcms.Core;
import static gcms.Core.createDatabaseObject;
import static gcms.Core.loadScriptFile;
import static gcms.Core.loadWebFile;
import gcms.GsonObjects.Core.MongoConfigurations;
import gcms.GsonObjects.Core.Session;
import static gcms.database.DatabaseActions.getDocumentPriveleges;
import static gcms.database.DatabaseActions.getEnviromentInfo;
import static gcms.database.DatabaseActions.getObjects;
import static gcms.database.DatabaseActions.getObject;
import static gcms.database.DatabaseActions.getObjectCount;
import static gcms.database.DatabaseActions.getObjectv2;
import gcms.commandFunctions;
import gcms.GsonObjects.annotations.MdmAnnotations;
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

    //OBJECT SPECIFIC   
    public static ObjectNode getObjectData(String cookie, gcms.Config.MongoConf _mongoConf, String tableName, Bson filter, String[] excludes) throws ClassNotFoundException, NoSuchFieldException, IOException {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode jsonData = mapper.createObjectNode();
        ArrayList<Document> results = DatabaseActions.getObjectsSpecificList(cookie, _mongoConf, filter, null, 1000, excludes, true);
        List<String> columns = getDocumentPriveleges("view", cookie, _mongoConf, true);
        List<String> editableColumns = getDocumentPriveleges("edit", cookie, _mongoConf, true);
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
                        ArrayList<Document> objectList = DatabaseActions.getObjectsList(cookie, gcms.Config.MongoConf.valueOf(mdmAnnotations.reference()[1]), fields);
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
        ArrayList<Document> results = DatabaseActions.getObjectsSpecificListv2(cookie, _mongoConf, filter, null, 1000, excludes, true);
        List<String> columns = getDocumentPriveleges("view", cookie, _mongoConf, true);
        List<String> editableColumns = getDocumentPriveleges("edit", cookie, _mongoConf, true);
        List<String> createableColumns = getDocumentPriveleges("create", cookie, _mongoConf, true);
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
                headerEntry.put("creatable", createableColumns.contains(column));
                //headerEntry.put("editable", mdmAnnotations.editable()); //editableColumns.contains(column));
                headerEntry.put("key", mdmAnnotations.key());
                headerEntry.put("multiple", mdmAnnotations.multiple());
                headerEntry.put("visibleOnForm", mdmAnnotations.visibleOnForm());
                headerEntry.put("key", mdmAnnotations.key());
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
        ArrayList<Document> results = DatabaseActions.getObjectsSpecificListv2(cookie, _mongoConf, filter, null, 1000, excludes, true);
        List<String> columns = getDocumentPriveleges("view", cookie, _mongoConf, true);
        List<String> editableColumns = getDocumentPriveleges("edit", cookie, _mongoConf, true);
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
                        ArrayList<Document> objectList = DatabaseActions.getObjectsListv2(cookie,DatabaseActions.getMongoConfiguration(mdmAnnotations.reference()[1]), fields);
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

    public static ArrayList<Document> getObjectSpecificRawData(String cookie, gcms.Config.MongoConf _mongoConf, Bson bson) throws ClassNotFoundException, NoSuchFieldException, IOException {
        ArrayList<Document> results = DatabaseActions.getObjectsSpecificList(cookie, _mongoConf, bson, null, 0, null, false);
        return results;
    }

    public static ArrayList<Document> getObjectSpecificRawDatav2(String cookie, MongoConfigurations _mongoConf, Bson bson) throws ClassNotFoundException, NoSuchFieldException, IOException {
        ArrayList<Document> results = DatabaseActions.getObjectsSpecificListv2(cookie, _mongoConf, bson, null, 0, null, false);
        return results;
    }

    public static Map<String, Object> getObjectHashMap(String cookie, gcms.Config.MongoConf _mongoConf, Bson bson) throws ClassNotFoundException, JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        ArrayList<Document> results = DatabaseActions.getObjectsSpecificList(cookie, _mongoConf, bson, null, 0, null, false);
        BasicDBObject obj = BasicDBObject.parse(mapper.writeValueAsString(results.get(0)));
        Map<String, Object> objHashMap = obj.entrySet().stream().collect(Collectors.toMap(entry -> entry.getKey(), entry -> entry.getValue()));
        return objHashMap;
    }

    public static Map<String, Object> getObjectHashMapv2(String cookie, MongoConfigurations _mongoConf, Bson bson) throws ClassNotFoundException, JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        ArrayList<Document> results = DatabaseActions.getObjectsSpecificListv2(cookie, _mongoConf, bson, null, 0, null, false);

        BasicDBObject obj = BasicDBObject.parse(mapper.writeValueAsString(results.get(0)));
        Map<String, Object> objHashMap = obj.entrySet().stream().collect(Collectors.toMap(entry -> entry.getKey(), entry -> entry.getValue()));
        return objHashMap;
    }

    public static void editObjectData(HashMap<String, Object> mongoObject, MongoConf _mongoConf, String cookie) throws JsonProcessingException, ClassNotFoundException, NoSuchFieldException {
        ObjectMapper mapper = new ObjectMapper();
        List<String> columns = getDocumentPriveleges("edit", cookie, _mongoConf, true);
        List<Field> systemFields = gcms.Core.getSystemFields(_mongoConf.getClassName(), "edit");
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
        List<String> columns = getDocumentPriveleges("edit", cookie, _mongoConf, true);
        List<Field> systemFields = gcms.Core.getSystemFields(_mongoConf.getClassName(), "edit");
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

                    MdmAnnotations mdmAnnotations = Class.forName(objectConfiguration.getClassName()).getField(key).getAnnotation(MdmAnnotations.class);
                    if (!mdmAnnotations.DMP()) {
                        documentHashMap.put(key, changesHashMap.get(key));
                    } else {
                        documentHashMap.put(key, DatabaseActions.revertDMP(documentHashMap.get(key).toString(), changesHashMap.get(key).toString()));
                    }
                }
            }

        }

        return documentHashMap;
    }

    public static void addObjectv2(Document doc, MongoConfigurations _mongoConf, String cookie) throws ClassNotFoundException {
        ObjectMapper mapper = new ObjectMapper();
        List<String> columns = getDocumentPriveleges("create", cookie, _mongoConf, true);
        List<Field> systemFields = gcms.Core.getSystemFields(_mongoConf.getClassName(), "create");
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
        List<String> columns = getDocumentPriveleges("create", cookie, _mongoConf, true);
        List<Field> systemFields = gcms.Core.getSystemFields(_mongoConf.getClassName(), "create");
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

    public static gcms.GsonObjects.Core.Actions getAction(String _action) throws ClassNotFoundException {
        ObjectMapper mapper = new ObjectMapper();
        gcms.GsonObjects.Core.Actions action = null;
        BasicDBObject searchObject = new BasicDBObject();
        searchObject.put("name", new BasicDBObject("$eq", _action));
        ArrayList<Document> results = DatabaseActions.getObjectsSpecificList("", MongoConf.ACTIONS, searchObject, null, 1000, new String[]{}, false);
        //String jsonObject = mapper.writeValueAsString(results.get(0));
        if (results.size() > 0) {
            action = mapper.convertValue(results.get(0), gcms.GsonObjects.Core.Actions.class);
        }
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
            sb.append(DatabaseWrapper.getWebPage("credentials/index.html", new String[]{}));
        }
        return sb;
    }

    public static StringBuilder actionLOADOBJECT(String cookie, MongoConf _mongoConf, Bson filter, String[] excludes) throws JsonProcessingException, ClassNotFoundException, NoSuchFieldException, IOException {
        StringBuilder sb = new StringBuilder();
        if (cookie == null) {
            sb.append(DatabaseWrapper.getWebPage("credentials/index.html", new String[]{}));
        } else {
            if (Core.checkSession(cookie)) {
                //sb.append(getInstrumentData(cookie));
                sb.append(DatabaseWrapper.getObjectData(cookie, _mongoConf, _mongoConf.getCollection(), filter, excludes));
            } else {
                sb.append(DatabaseWrapper.getWebPage("credentials/index.html", new String[]{}));
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

                Class cls = Class.forName(_mongoConf.getClassName());

                if (requestParameters.get("oper") != null) {

                    requestParameters = Core.checkHashFields(requestParameters, cls);

                    if (operation.equals("edit")) {
                        HashMap<String, Object> obj = createDatabaseObject(requestParameters, cls);
                        DatabaseWrapper.editObjectDatav2(obj, _mongoConf, cookie);
                        commandFunctions.doWorkflow("edit", _mongoConf);
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
                        mapper.enable(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT);
                        Object labitem = mapper.readValue(mapper.writeValueAsString(parameters), cls);//createNoteObject(requestParameters.get("docid")[0], "create");
                        Document document = Document.parse(mapper.writeValueAsString(labitem));
                        document.append(_mongoConf.getIdName(), UUID.randomUUID().toString());
                        DatabaseWrapper.addObjectv2(document, _mongoConf, cookie);
                        commandFunctions.doWorkflow("add", _mongoConf);
                    }
                }
            }
        } else {
            sb.append(DatabaseWrapper.getWebPage("credentials/index.html", new String[]{}));
        }
        return sb;
    }

    public static StringBuilder actionGETOBJECTv2(String cookie, MongoConfigurations _mongoConf, String key, String value, Boolean publicPage) throws JsonProcessingException, JsonProcessingException, ClassNotFoundException, JsonProcessingException, JsonProcessingException, NoSuchFieldException, IOException {
        StringBuilder sb = new StringBuilder();
        if (cookie == null && !publicPage) {
            sb.append(DatabaseWrapper.getWebPage("credentials/index.html", new String[]{}));
        } else {
            if (!key.equals("")) {
                BasicDBObject searchObject = new BasicDBObject();
                ObjectMapper mapper = new ObjectMapper();
                ObjectNode jsonData = mapper.createObjectNode();
                ObjectNode jsonParameters = mapper.createObjectNode();
                searchObject.put(key, new BasicDBObject("$eq", value));
                Map<String, Object> searchResult = DatabaseWrapper.getObjectHashMapv2(cookie, _mongoConf, searchObject);
                sb.append(actionGETOBJECT_prepareObject(cookie, _mongoConf, publicPage, searchResult).toString());
//                List<String> editRights = getDocumentPriveleges("edit", cookie, _mongoConf);
//                if (_mongoConf.collection.equals("pages") || _mongoConf.collection.equals("document")) {
//                    String menu = "";
//                    if (editRights.contains("contents")) {
//                        menu = loadWebFile("pages/template/menu.html");
//                    }
//                    ObjectNode jsonReplaces = mapper.createObjectNode();
//                    jsonReplaces.put("LCMSEditablePage-id", searchResult.get(_mongoConf.getIdName()).toString());
//                    jsonReplaces.put("LCMSEditablePage-content", searchResult.get("contents").toString());
//                    if (_mongoConf.collection.equals("document")) {
//                        menu = menu.replaceAll("documentPage", _mongoConf.collection + "PageObject");
//                    }
//                    jsonReplaces.put("LCMSEditablePage-menu", menu);
//                    searchResult.put("contents", "");
//
//                    jsonParameters.put("public", publicPage);
//                    jsonData.set("parameters", jsonParameters);
//                    jsonData.put("webPage", loadWebFile("pages/template/index.html"));
//                    jsonData.set("replaces", jsonReplaces);
//                    sb.append(jsonData);
//                } else {
//                    ArrayList<Document> results = DatabaseActions.getObjectsSpecificListv2(cookie, _mongoConf, searchObject, null, 1000, new String[]{""});
//                    sb.append(mapper.writeValueAsString(results.get(0)));
//                }

            }
        }
        return sb;
    }

    public static StringBuilder actionGETOBJECT_prepareObject(String cookie, MongoConfigurations _mongoConf, Boolean publicPage, Map<String, Object> searchResult) throws ClassNotFoundException, JsonProcessingException {
        StringBuilder sb = new StringBuilder();
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode jsonData = mapper.createObjectNode();
        ObjectNode jsonParameters = mapper.createObjectNode();

        if (_mongoConf.collection.equals("pages") || _mongoConf.collection.equals("document")) {
            List<String> editRights = getDocumentPriveleges("edit", cookie, _mongoConf, true);
//            String menu = "";
//            if (editRights.contains("contents")) {
//                menu = loadWebFile("pages/template/menu.html");
//            }
            ObjectNode jsonReplaces = mapper.createObjectNode();
            jsonReplaces.put("LCMSEditablePage-id", searchResult.get(_mongoConf.getIdName()).toString());
            jsonReplaces.put("LCMSEditablePage-content", searchResult.get("contents").toString());
//            if (_mongoConf.collection.equals("document")) {
//                menu = menu.replaceAll("documentPage", _mongoConf.collection + "PageObject");
//            }
           // jsonReplaces.put("LCMSEditablePage-menu", menu);
            searchResult.put("contents", "");

            jsonParameters.put("public", publicPage);
            jsonData.set("parameters", jsonParameters);
            jsonData.put("webPage", loadWebFile("pages/template/index.html"));
            jsonData.set("replaces", jsonReplaces);
            sb.append(jsonData);
        } else {
            sb.append(mapper.writeValueAsString(searchResult));
        }

        return sb;
    }

    public static StringBuilder actionLOADOBJECTv2(String cookie, MongoConfigurations _mongoConf, Bson filter, String[] excludes) throws JsonProcessingException, ClassNotFoundException, NoSuchFieldException, IOException {
        StringBuilder sb = new StringBuilder();
        if (cookie == null) {
            sb.append(DatabaseWrapper.getWebPage("credentials/index.html", new String[]{}));
        } else {
            if (Core.checkSession(cookie)) {
                //sb.append(getInstrumentData(cookie));
                sb.append(DatabaseWrapper.getObjectDatav2(cookie, _mongoConf, _mongoConf.getCollection(), filter, excludes));
            } else {
                sb.append(DatabaseWrapper.getWebPage("credentials/index.html", new String[]{}));
            };
        }
        return sb;
    }

}
