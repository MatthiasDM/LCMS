/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm.Mongo;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mongodb.BasicDBObject;
import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;
import java.io.IOException;
import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import mdm.Core;
import mdm.Core.MongoConf;
import mdm.Core.Roles;
import static mdm.Core.checkUserAgainstRoles;
import static mdm.Core.checkUserRoleValue;
import static mdm.Core.loadScriptFile;
import static mdm.Core.loadWebFile;
import mdm.GsonObjects.Lab.Instrument;
import mdm.GsonObjects.Note;
import mdm.GsonObjects.Other.ICTTicket;
import mdm.GsonObjects.Role;
import mdm.GsonObjects.Session;
import mdm.GsonObjects.User;
import mdm.Mongo.DatabaseActions;
import static mdm.Mongo.DatabaseActions.getDocumentPriveleges;
import mdm.pojo.annotations.MdmAnnotations;
import org.bson.Document;

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

    public static ObjectNode getNote(Note note) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode jsonData = mapper.createObjectNode();
        ObjectNode jsonParameters = mapper.createObjectNode();
        ObjectNode jsonReplaces = mapper.createObjectNode();

        jsonReplaces.put("note-id", note.getDocid());
        jsonReplaces.put("note-content", note.getContent());

        note.setContent("");
        jsonParameters.put("note-metadata", mapper.writeValueAsString(note));

        jsonData.put("webPage", loadWebFile("notes/note/index.html"));
        jsonData.put("scripts",
                loadScriptFile("notes/note/servletCalls.js")
                + loadScriptFile("notes/note/interface.js")
        );
        jsonData.set("parameters", jsonParameters);
        jsonData.set("replaces", jsonReplaces);
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
        ArrayList<Document> results = DatabaseActions.getObjectsList(cookie, Core.MongoConf.ICTTICKETS);

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
    public static ObjectNode getObjectData(String cookie, Core.MongoConf _mongoConf, String tableName) throws ClassNotFoundException, NoSuchFieldException, IOException {
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
                        ArrayList<Document> objectList = DatabaseActions.getObjectsList(cookie, Core.MongoConf.valueOf(mdmAnnotations.reference()[1]), fields);
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

    public static void editObjectData(Object mongoObject, MongoConf _mongoConf, String cookie) throws JsonProcessingException, ClassNotFoundException {
        ObjectMapper mapper = new ObjectMapper();
        List<String> columns = getDocumentPriveleges("edit", cookie, _mongoConf.getClassName());
        List<Field> systemFields = Core.getSystemFields(_mongoConf.getClassName(), "edit");

        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        BasicDBObject obj = BasicDBObject.parse(mapper.writeValueAsString(mongoObject));
        BasicDBObject filteredObj = new BasicDBObject();
        for (String key : obj.keySet()) {
            if (columns.indexOf(key) != -1) {
                filteredObj.put(key, obj.get(key));
            }
        }
        for (Field systemField : systemFields) {
           // if (columns.indexOf(systemField.getName()) != -1) {
                filteredObj.put(systemField.getName(), obj.get(systemField.getName()));
           // }
        }

        filteredObj.put(_mongoConf.getIdName(), obj.get(_mongoConf.getIdName())); //put id
        DatabaseActions.updateObjectItem(_mongoConf, filteredObj);
    }

    public static void addObject(Document doc, MongoConf _mongoConf, String cookie) throws ClassNotFoundException {

        ObjectMapper mapper = new ObjectMapper();
        List<String> columns = getDocumentPriveleges("create", cookie, _mongoConf.getClassName());
        List<Field> systemFields = Core.getSystemFields(_mongoConf.getClassName(), "edit");

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

}
