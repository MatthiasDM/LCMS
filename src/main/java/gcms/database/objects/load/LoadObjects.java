/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.database.objects.load;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mongodb.BasicDBObject;
import com.mongodb.client.MongoCollection;
import static com.mongodb.client.model.Projections.exclude;
import static com.mongodb.client.model.Projections.fields;
import static com.mongodb.client.model.Projections.include;
import gcms.Config.Roles;
import gcms.Core;
import gcms.GsonObjects.Core.MongoConfigurations;
import gcms.GsonObjects.Other.SerializableClass;
import gcms.GsonObjects.Other.SerializableField;
import gcms.database.DatabaseActions;
import static gcms.database.DatabaseActions.getDocumentPriveleges;
import gcms.database.DatabaseWrapper;
import java.io.IOException;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.bson.Document;
import org.bson.conversions.Bson;
import static gcms.database.DatabaseActions.getObjectsFromDatabase;
import gcms.GsonObjects.annotations.gcmsObject;
import static gcms.database.DatabaseActions.getPriveleges;
import java.lang.annotation.Annotation;
import java.util.Arrays;

/**
 *
 * @author Matthias
 */
public class LoadObjects {

    public static StringBuilder loadObjects(String cookie, MongoConfigurations _mongoConf, Bson filter, String[] excludes) throws JsonProcessingException, ClassNotFoundException, NoSuchFieldException, IOException {
        StringBuilder sb = new StringBuilder();
        if (cookie == null) {
            sb.append(DatabaseWrapper.getWebPage("credentials/index.html", new String[]{}));
        } else {
            if (Core.checkSession(cookie)) {
                sb.append(getObjects(cookie, _mongoConf, _mongoConf.getCollection(), filter, excludes));
            } else {
                sb.append(DatabaseWrapper.getWebPage("credentials/index.html", new String[]{}));
            }
        }
        return sb;
    }

    //OBJECT SPECIFIC   
    public static ObjectNode getObjects(String cookie, MongoConfigurations _mongoConf, String tableName, Bson filter, String[] excludes) throws ClassNotFoundException, NoSuchFieldException, IOException {
        SerializableClass serializableClass = new SerializableClass();
        if (_mongoConf.getPluginName() != null) {
            serializableClass = Core.getFields(_mongoConf, cookie);
        } else {
            serializableClass.setClassName(_mongoConf.getClassName());
            serializableClass.convertFields(Arrays.asList(Class.forName(_mongoConf.getClassName()).getDeclaredFields()));
        }

        ObjectMapper mapper = new ObjectMapper();
        ObjectNode jsonData = mapper.createObjectNode();
        List<String> columns = getDocumentPriveleges("view", cookie, _mongoConf, true, serializableClass);
        ArrayList<Document> results = DatabaseActions.getObjectsSpecificListv2(_mongoConf, filter, null, 1000, excludes, columns);
        List<String> editableColumns = getDocumentPriveleges("edit", cookie, _mongoConf, true, serializableClass);
        List<String> createableColumns = getDocumentPriveleges("create", cookie, _mongoConf, true, serializableClass);
        ArrayList<HashMap> header = new ArrayList<>();
        ArrayList<HashMap> table = new ArrayList<>();
        HashMap tableEntry = new HashMap();

        for (String column : columns) {

            SerializableField serializableField = serializableClass.getFields().stream().filter(f -> f.getName().equals(column)).findFirst().get();
            String fieldName = serializableField.getName();
            Annotation fieldAnnotation = serializableField.getAnnotation();
            gcmsObject mdmAnnotations = (gcmsObject) fieldAnnotation;

            HashMap headerEntry = new HashMap();
            headerEntry.put("name", fieldName);
            if (mdmAnnotations != null) {
                headerEntry.put("type", mdmAnnotations.type());
                headerEntry.put("visibleOnTable", mdmAnnotations.visibleOnTable());
                headerEntry.put("editable", editableColumns.contains(column));
                headerEntry.put("creatable", createableColumns.contains(column));
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
                        ArrayList<Document> objectList = getObjectsList(cookie, DatabaseActions.getMongoConfiguration(mdmAnnotations.reference()[1]), fields);
                        HashMap<String, Object> map = new HashMap<>();
                        for (Object doc : objectList) {
                            JsonNode actualObj = Core.universalObjectMapper.readTree(mapper.writeValueAsString(doc));
                            String jsonValue = actualObj.toString();
                            BasicDBObject obj = BasicDBObject.parse(jsonValue);
                            Map<String, Object> tempMap2 = obj.entrySet().stream().collect(HashMap::new, (m, v) -> m.put(v.getKey(), v.getValue()), HashMap::putAll);
                            map.put(tempMap2.get(fields.get(0)).toString(), tempMap2.get(fields.get(1)));
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
            tableEntry.put(fieldName, "");
        }
        if (results == null) {
            jsonData.put("table", mapper.writeValueAsString(table));
        } else {
            if (!results.isEmpty()) {
                JsonNode actualObj = Core.universalObjectMapper.readTree(mapper.writeValueAsString(results));
                String jsonValue = actualObj.toString();
                jsonData.put("table", jsonValue);
            } else {
                jsonData.put("table", mapper.writeValueAsString(table));
            }
        }

        jsonData.put("header", mapper.writeValueAsString(header));
        return jsonData;

    }

    public static ArrayList<Document> getObjectsList(String _cookie, MongoConfigurations mongoConf, List<String> columns) throws ClassNotFoundException {

        ArrayList<Document> results = null;
        try {
            MongoCollection<Document> ObjectItems = getObjectsFromDatabase(mongoConf);
            results = ObjectItems.find().projection(
                    fields(include(columns))
            ).projection(fields(exclude("_id"))).into(new ArrayList<>());
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(LoadObjects.class.getName()).log(Level.SEVERE, ex.getMessage());
            return results;
        }
        return results;
    }

}
