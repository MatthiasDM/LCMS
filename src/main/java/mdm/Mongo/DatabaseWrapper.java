/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm.Mongo;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mongodb.BasicDBObject;
import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;
import java.io.IOException;
import java.lang.reflect.Field;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import mdm.Config.MongoConf;
import mdm.Config.Roles;
import mdm.Core;
import static mdm.Core.createDatabaseObject;
import static mdm.Core.loadScriptFile;
import static mdm.Core.loadWebFile;

import mdm.GsonObjects.Lab.Instrument;
import mdm.GsonObjects.Note;
import mdm.GsonObjects.Session;
import mdm.GsonObjects.User;
import static mdm.Mongo.DatabaseActions.getDocumentPriveleges;
import static mdm.Mongo.DatabaseActions.getObjectDifference;
import static mdm.Mongo.DatabaseActions.getObjects;
import static mdm.Mongo.DatabaseActions.getObjectsList;
import static mdm.Mongo.DatabaseActions.getObject;
import mdm.pojo.annotations.MdmAnnotations;
import org.bson.Document;
import org.bson.conversions.Bson;

/**
 *
 * @author matmey
 */
public class DatabaseWrapper {

    //CREDENTIAL SPECIFIC
    public static ObjectNode getCredentialPage() {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode jsonData = mapper.createObjectNode();
        jsonData.put("webPage", loadWebFile("credentials/index.html"));
        jsonData.put("scripts",
                loadScriptFile("credentials/servletCalls.js")
                + loadScriptFile("credentials/interface.js")
        );

        return jsonData;
    }

    public static ObjectNode getUserInfo(Session session) {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode jsonParameters = mapper.createObjectNode();
        ObjectNode jsonData = mapper.createObjectNode();
        long now = Instant.now().toEpochMilli() / 1000;

        jsonParameters.put("userName", session.getUsername());
        jsonParameters.put("timeout", session.getValidity() - now);
        //jsonParameters.put("numNotes", DatabaseActions.getObjectCount(MongoConf.NOTES, and(eq(MongoConf.NOTES.getIdName(), "1"))));
        jsonParameters.put("numTasks", session.getValidity() - now);
        jsonData.put("webPage", loadWebFile("credentials/userinfo/index.html"));
        //  jsonData.put("scripts", loadScriptFile("credentials/userinfo/servletCalls.js"));
        jsonData.set("parameters", jsonParameters);

        return jsonData;
    }

    //ADMIN SPECIFIC
    public static ObjectNode getAdminToolsPage() throws JsonProcessingException {

        ObjectMapper mapper = new ObjectMapper();
        ObjectNode jsonData = mapper.createObjectNode();

        jsonData.put("webPage", loadWebFile("admin/tools/index.html"));
        jsonData.put("scripts",
                loadScriptFile("admin/tools/servletCalls.js")
                + loadScriptFile("admin/tools/interface.js")
        );

        return jsonData;
    }

    //NOTE SPECIFIC
    public static ObjectNode getNotesPage(ArrayList<Note> notes) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode jsonData = mapper.createObjectNode();
        ObjectNode jsonParameters = mapper.createObjectNode();
        jsonParameters.put("notesList", mapper.writeValueAsString(notes));
        jsonData.put("webPage", loadWebFile("notes/dashboard/index.html"));
        jsonData.put("scripts",
                loadScriptFile("notes/dashboard/servletCalls.js")
                + loadScriptFile("notes/dashboard/interface.js")
        );
        jsonData.set("parameters", jsonParameters);

        return jsonData;
    }

    //LAB SPECIFIC
    public static ObjectNode getInstrumentsPage() {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode jsonData = mapper.createObjectNode();
        jsonData.put("webPage", loadWebFile("lab/instruments/index.html"));
        jsonData.put("scripts",
                loadScriptFile("lab/instruments/servletCalls.js")
                + loadScriptFile("lab/instruments/interface.js")
        );

        return jsonData;
    }

    //USER SPECIFIC
    public static ObjectNode getICTTicketData(String cookie) throws ClassNotFoundException, NoSuchFieldException, IOException {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode jsonData = mapper.createObjectNode();
        ArrayList<Document> results = DatabaseActions.getObjectsList(cookie, mdm.Config.MongoConf.ICTTICKETS);

        //getObjectsList
        List<String> columns = getDocumentPriveleges("view", cookie, "mdm.GsonObjects.Other.ICTTicket");

        ArrayList<HashMap> header = new ArrayList<>();
        ArrayList<HashMap> table = new ArrayList<>();
        HashMap tableEntry = new HashMap();
        for (String column : columns) {
            Class cls = Class.forName("mdm.GsonObjects.Other.ICTTicket");
            Field field = cls.getField(column);
            MdmAnnotations mdmAnnotations = field.getAnnotation(MdmAnnotations.class);
            HashMap headerEntry = new HashMap();
            headerEntry.put("name", field.getName());
            if (mdmAnnotations != null) {
                headerEntry.put("type", mdmAnnotations.type());
                headerEntry.put("visibleOnTable", mdmAnnotations.visibleOnTable());
                headerEntry.put("editable", mdmAnnotations.editable());
                headerEntry.put("multiple", mdmAnnotations.multiple());
                headerEntry.put("visibleOnForm", mdmAnnotations.visibleOnForm());
                headerEntry.put("tablename", "ICT_ticket");
                if (!"".equals(mdmAnnotations.reference()[0])) {
                    ArrayList<User> users = mapper.readValue(DatabaseActions.getListAsString("User", cookie), new TypeReference<List<User>>() {
                    });
                    Map<String, String> map = users
                            .stream()
                            .collect(
                                    Collectors.toMap(p -> p.getUserid(), p -> p.getUsername())
                            );
                    // Map<String,Map<String, String>> wrapper = new HashMap<>();
                    // wrapper.put("value", map);
                    headerEntry.put("choices", (map));

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

    //INSTRUMENT SPECIFIC
    public static ObjectNode getInstrumentData(String cookie) throws ClassNotFoundException, NoSuchFieldException, IOException {

        ObjectMapper mapper = new ObjectMapper();
        ObjectNode jsonData = mapper.createObjectNode();
        ArrayList<Instrument> results = DatabaseActions.getInstrumentList();

        ArrayList<HashMap> header = new ArrayList<>();
        ArrayList<HashMap> table = new ArrayList<>();
        HashMap tableEntry = new HashMap();
        for (Field field : Instrument.class.getFields()) {
            MdmAnnotations mdmAnnotations = field.getAnnotation(MdmAnnotations.class);
            HashMap headerEntry = new HashMap();
            headerEntry.put("name", field.getName());
            if (mdmAnnotations != null) {
                headerEntry.put("type", mdmAnnotations.type());
                headerEntry.put("visibleOnTable", mdmAnnotations.visibleOnTable());
                headerEntry.put("editable", mdmAnnotations.editable());
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
    public static ObjectNode getObjectData(String cookie, mdm.Config.MongoConf _mongoConf, String tableName) throws ClassNotFoundException, NoSuchFieldException, IOException {

        ObjectMapper mapper = new ObjectMapper();

        ObjectNode jsonData = mapper.createObjectNode();

        ArrayList<Document> results = DatabaseActions.getObjectsList(cookie, _mongoConf);

        //getObjectsList
        List<String> columns = getDocumentPriveleges("view", cookie, _mongoConf.getClassName());

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

                headerEntry.put("editable", mdmAnnotations.editable());

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

                            HashMap<String, String> tempMap = new HashMap<>();

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
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode jsonData = mapper.createObjectNode();
        ArrayList<Document> results = DatabaseActions.getObjectsSpecificList(cookie, _mongoConf, bson);

        return results;
    }

    public static Map<String, Object> getObjectHashMap(String cookie, mdm.Config.MongoConf _mongoConf, Bson bson) throws ClassNotFoundException, JsonProcessingException {

        ObjectMapper mapper = new ObjectMapper();
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        ObjectNode jsonData = mapper.createObjectNode();
        ArrayList<Document> results = DatabaseActions.getObjectsSpecificList(cookie, _mongoConf, bson);
        BasicDBObject obj = BasicDBObject.parse(mapper.writeValueAsString(results.get(0)));
        Map<String, Object> objHashMap = obj.entrySet().stream().collect(Collectors.toMap(entry -> entry.getKey(), entry -> entry.getValue()));
        return objHashMap;
    }

    public static void editObjectData(HashMap<String, Object> mongoObject, MongoConf _mongoConf, String cookie) throws JsonProcessingException, ClassNotFoundException {

        ObjectMapper mapper = new ObjectMapper();

        List<String> columns = getDocumentPriveleges("edit", cookie, _mongoConf.getClassName());

        List<Field> systemFields = mdm.Core.getSystemFields(_mongoConf.getClassName(), "edit");

        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);

        BasicDBObject obj = BasicDBObject.parse(mapper.writeValueAsString(mongoObject));

        BasicDBObject filteredObj = new BasicDBObject();

        for (String key : obj.keySet()) {

            if (columns.indexOf(key) != -1) {

                if (obj.get(key) != null) {
                    filteredObj.put(key, obj.get(key));
                }

            }

        }

        for (Field systemField : systemFields) {

            filteredObj.remove(systemField);
            //filteredObj.put(systemField.getName(), obj.get(systemField.getName()));

        }

        filteredObj.put(_mongoConf.getIdName(), obj.get(_mongoConf.getIdName())); //put id

        Object originalDocument = getObject(_mongoConf, filteredObj.get(_mongoConf.getIdName()).toString());
        DatabaseActions.updateObjectItem(_mongoConf, filteredObj);
        Map<String, Object> filteredObjHashMap = filteredObj.entrySet().stream().collect(Collectors.toMap(entry -> entry.getKey(), entry -> entry.getValue()));
        Document backlog = getObjectDifference(_mongoConf, originalDocument, filteredObjHashMap);
        if (backlog != null) {
            getObjects(MongoConf.BACKLOG).insertOne(backlog);
        }
    }

    public static void addObject(Document doc, MongoConf _mongoConf, String cookie) throws ClassNotFoundException {

        ObjectMapper mapper = new ObjectMapper();

        List<String> columns = getDocumentPriveleges("create", cookie, _mongoConf.getClassName());

        List<Field> systemFields = mdm.Core.getSystemFields(_mongoConf.getClassName(), "edit");

        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);

        Document filteredDoc = new Document();

        for (String key : doc.keySet()) {

            if (columns.indexOf(key) != -1) {

                filteredDoc.put(key, doc.get(key));

            }

        }

        for (Field systemField : systemFields) {

            //if (columns.indexOf(systemField.getName()) != -1) {
            filteredDoc.put(systemField.getName(), doc.get(systemField.getName()));

            //}
        }

        filteredDoc.put(_mongoConf.getIdName(), doc.get(_mongoConf.getIdName())); //put id

        DatabaseActions.insertObjectItem(_mongoConf, filteredDoc);

    }

    private static Enum<?> findEnumValue(Class<? extends Enum<?>> enumType, String name) {

        return Arrays.stream(enumType.getEnumConstants())
                .filter(p -> p.name().equals(name))
                .findFirst()
                .orElse(null);

    }

    public static StringBuilder actionEDITOBJECT(HashMap<String, String[]> requestParameters, String cookie, MongoConf _mongoConf) throws IOException, ClassNotFoundException {
        StringBuilder sb = new StringBuilder();
        if (cookie != null) {
            if (Core.checkUserRoleValue(cookie, 2)) {
                requestParameters.remove("action");
                requestParameters.remove("LCMS_session");
                String operation = requestParameters.get("oper")[0];
                Class cls = Class.forName(_mongoConf.getClassName());
                if (requestParameters.get("oper") != null) {
                    if (operation.equals("edit")) {

//                        ObjectMapper mapper = new ObjectMapper();
//                        mapper.enable(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY);
//                        requestParameters.remove("oper");
//                        requestParameters.remove("id");
//                        HashMap<String, Object> parameters = new HashMap<>();
//                        requestParameters.forEach((key, value) -> {
//                            parameters.put(key, value[0]);
//                        });
//                        Object labitem = mapper.readValue(mapper.writeValueAsString(parameters), cls);//createNoteObject(requestParameters.get("docid")[0], "create");
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
                        Object labitem = mapper.readValue(mapper.writeValueAsString(parameters), cls);//createNoteObject(requestParameters.get("docid")[0], "create");
                        Document document = Document.parse(mapper.writeValueAsString(labitem));
                        document.append(_mongoConf.getIdName(), UUID.randomUUID().toString());
                        DatabaseWrapper.addObject(document, _mongoConf, cookie);
                    }
                }
            }
        } else {
            sb.append(DatabaseWrapper.getCredentialPage());
        }
        return sb;
    }

    public static StringBuilder actionLOADOBJECT(String cookie, MongoConf _mongoConf) throws JsonProcessingException, ClassNotFoundException, NoSuchFieldException, IOException {
        StringBuilder sb = new StringBuilder();
        if (cookie == null) {
            sb.append(DatabaseWrapper.getCredentialPage());
        } else {
            if (Core.checkSession(cookie)) {
                //sb.append(getInstrumentData(cookie));
                sb.append(DatabaseWrapper.getObjectData(cookie, _mongoConf, _mongoConf.getCollection()));
            } else {
                sb.append(DatabaseWrapper.getCredentialPage());
            };
        }
        return sb;
    }

}
