/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.database.objects.load;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mongodb.BasicDBObject;
import com.mongodb.client.MongoCollection;
import static com.mongodb.client.model.Projections.exclude;
import static com.mongodb.client.model.Projections.fields;
import static com.mongodb.client.model.Projections.include;
import gcms.Config.PrivilegeType;
import gcms.Config.Roles;
import gcms.Core;
import static gcms.Core.universalObjectMapper;
import gcms.GsonObjects.Core.MongoConfigurations;
import gcms.GsonObjects.Core.Rights;
import gcms.GsonObjects.Other.SerializableClass;
import gcms.GsonObjects.Other.SerializableField;
import gcms.database.DatabaseActions;
import static gcms.database.DatabaseActions.getDocumentPriveleges;
import gcms.database.DatabaseWrapper;
import java.io.IOException;
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
import static gcms.database.DatabaseActions.getRightsFromDatabaseInCollection;
import gcms.database.GetResponse;
import gcms.database.filters.FilterObject;
import gcms.database.filters.FilterRule;
import java.lang.annotation.Annotation;
import java.util.Arrays;

/**
 *
 * @author Matthias
 */
public class LoadObjects {

    //structure and data
    public static StringBuilder loadObjects(String cookie, MongoConfigurations _mongoConf, Bson filter, String[] excludes) throws JsonProcessingException, ClassNotFoundException, NoSuchFieldException, IOException {
        StringBuilder sb = new StringBuilder();
        if (cookie == null) {
            sb.append(DatabaseWrapper.getWebPage("credentials/index.html", new String[]{}));
        } else {
            if (Core.checkSession(cookie)) {
                SerializableClass serializableClass = new SerializableClass();
                if (_mongoConf.getPluginName() != null) {
                    serializableClass = Core.getFields(_mongoConf, cookie);
                } else {
                    serializableClass.setClassName(_mongoConf.getClassName());
                    serializableClass.convertFields(Arrays.asList(Class.forName(_mongoConf.getClassName()).getDeclaredFields()));
                }
                List<String> columns = getDocumentPriveleges(PrivilegeType.viewRole, cookie, _mongoConf, true, serializableClass);
                ObjectNode jsonData = getObjects(cookie, _mongoConf, _mongoConf.getCollection(), filter, excludes, serializableClass, columns);
                ArrayList<Document> results = DatabaseActions.getObjectsSpecificListv2(_mongoConf, filter, null, 1000, excludes, columns);
                if (!results.isEmpty()) {
                    JsonNode actualObj = Core.universalObjectMapper.readTree(Core.universalObjectMapper.writeValueAsString(results));
                    String jsonValue = actualObj.toString();
                    jsonData.put("table", jsonValue);
                }
                sb.append(jsonData);
            } else {
                sb.append(DatabaseWrapper.getWebPage("credentials/index.html", new String[]{}));
            }
        }
        return sb;
    }

    //structure
    public static StringBuilder structureload(String cookie, MongoConfigurations _mongoConf, Bson filter, String[] excludes) throws JsonProcessingException, ClassNotFoundException, NoSuchFieldException, IOException {
        StringBuilder sb = new StringBuilder();
        if (cookie == null) {
            sb.append(DatabaseWrapper.getWebPage("credentials/index.html", new String[]{}));
        } else {
            if (Core.checkSession(cookie)) {
                SerializableClass serializableClass = new SerializableClass();
                if (_mongoConf.getPluginName() != null) {
                    serializableClass = Core.getFields(_mongoConf, cookie);
                } else {
                    serializableClass.setClassName(_mongoConf.getClassName());
                    serializableClass.convertFields(Arrays.asList(Class.forName(_mongoConf.getClassName()).getDeclaredFields()));
                }
                List<String> columns = getDocumentPriveleges(PrivilegeType.viewRole, cookie, _mongoConf, true, serializableClass);
                ObjectNode jsonData = getObjects(cookie, _mongoConf, _mongoConf.getCollection(), filter, excludes, serializableClass, columns);
                sb.append(jsonData);
            } else {
                sb.append(DatabaseWrapper.getWebPage("credentials/index.html", new String[]{}));
            }
        }
        return sb;
    }

    //data
    public static GetResponse dataload(String cookie, MongoConfigurations _mongoConf, Map<String, String[]> requestParameters, BasicDBObject prefilter) throws JsonProcessingException, ClassNotFoundException, NoSuchFieldException, IOException {
        GetResponse response = new GetResponse();
        if (Core.checkSession(cookie)) {
            SerializableClass serializableClass = new SerializableClass();
            if (_mongoConf.getPluginName() != null) {
                serializableClass = Core.getFields(_mongoConf, cookie);
            } else {
                serializableClass.setClassName(_mongoConf.getClassName());
                serializableClass.convertFields(Arrays.asList(Class.forName(_mongoConf.getClassName()).getDeclaredFields()));
            }
            List<String> columns = getDocumentPriveleges(PrivilegeType.viewRole, cookie, _mongoConf, true, serializableClass);

            ArrayList<String> excludes = new ArrayList<>();
            if (requestParameters.get("excludes") != null) {
                excludes.addAll(Arrays.asList(requestParameters.get("excludes")));
            }
            if (requestParameters.get("excludes[]") != null) {
                String[] _excludes = requestParameters.get("excludes[]");
                excludes.addAll(Arrays.asList(_excludes));
            }
            BasicDBObject filter = createFilterObject(requestParameters.get("filters"));
            filter.forEach((k, v) -> prefilter.put(k, v));
            Integer page = Integer.parseInt(requestParameters.get("page")[0]);
            Integer rows = Integer.parseInt(requestParameters.get("rows")[0]);
            ArrayList<Document> results = DatabaseActions.getObjectsSpecificListv2(_mongoConf, filter, null, 1000, excludes.toArray(new String[0]), columns);
            response.setRecords(Integer.parseInt(String.valueOf(DatabaseActions.getObjectCount(_mongoConf, filter))));
            response.setTotal((int) (Math.ceil((float) response.getRecords() / rows)));
            response.setPage(page);
            if (!results.isEmpty()) {
                response.setRows(results);
            }
        }
        return response;
    }

    public static BasicDBObject createFilterObject(String[] json) throws IOException {

        BasicDBObject filter = new BasicDBObject();
        if (json != null) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                mapper.enable(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT);
                FilterObject filterObject = mapper.readValue(json[0], FilterObject.class);
                for (FilterRule rule : filterObject.getRules()) {
                    if (rule.getOp().equals("cn")) {
                        Logger.getLogger(LoadObjects.class.getName()).log(Level.INFO, "Filtering: " + rule.getField() + " with value: " + rule.getData());
                        filter.put(rule.getField(), new BasicDBObject("$regex", rule.getData()));
                    }
                }
            } catch (JsonProcessingException ex) {
                Logger.getLogger(DatabaseActions.class.getName()).log(Level.INFO, ex.getMessage());

            }
        }

        return filter;
    }

    //OBJECT SPECIFIC   
    public static ObjectNode getObjects(String cookie, MongoConfigurations _mongoConf, String tableName, Bson filter, String[] excludes, SerializableClass serializableClass, List<String> columns) throws ClassNotFoundException, NoSuchFieldException, IOException {

        ObjectMapper mapper = new ObjectMapper();
        ObjectNode jsonData = mapper.createObjectNode();
        List<String> editableColumns = getDocumentPriveleges(PrivilegeType.editRole, cookie, _mongoConf, true, serializableClass);
        List<String> createableColumns = getDocumentPriveleges(PrivilegeType.createRole, cookie, _mongoConf, true, serializableClass);
        ArrayList<HashMap> header = new ArrayList<>();
        ArrayList<HashMap> table = new ArrayList<>();
        HashMap tableEntry = new HashMap();
        ArrayList<Document> results = null;
        ArrayList<Rights> rights = getRightsFromDatabaseInCollection(_mongoConf.name);

        for (String column : columns) {
            Rights databaseRight = rights.stream().filter(r -> r.getField().equals(column)).findFirst().orElse(new Rights());

            SerializableField serializableField = serializableClass.getFields().stream().filter(f -> f.getName().equals(column)).findFirst().get();
            String fieldName = serializableField.getName();
            Annotation fieldAnnotation = serializableField.getAnnotation();
            gcmsObject mdmAnnotations = (gcmsObject) fieldAnnotation;

            HashMap headerEntry = new HashMap();
            headerEntry.put("name", fieldName);
            if (mdmAnnotations != null) {
                headerEntry.put("type", mdmAnnotations.type());
                headerEntry.put("formatterName", mdmAnnotations.formatterName());
                headerEntry.put("externalListParameters", mdmAnnotations.externalListParameters());
                if (databaseRight.table != null) {
                    headerEntry.put("visibleOnForm", databaseRight.isVisibleOnForm());
                    headerEntry.put("visibleOnTable", databaseRight.isVisibleOnTable());
                    headerEntry.put("editable", databaseRight.isEditable());
                } else {
                    headerEntry.put("visibleOnForm", mdmAnnotations.visibleOnForm());
                    headerEntry.put("visibleOnTable", mdmAnnotations.visibleOnTable());
                    headerEntry.put("editable", editableColumns.contains(column));
                }
                headerEntry.put("creatable", createableColumns.contains(column));
                headerEntry.put("multiple", mdmAnnotations.multiple());
                headerEntry.put("key", mdmAnnotations.key());
                headerEntry.put("tablename", tableName);
                if (!"".equals(mdmAnnotations.reference()[0])) {
                    String refType = mdmAnnotations.reference()[0];
                    if (refType.equals("Mongo")) {
                        ArrayList<String> fields = new ArrayList<>();
                        fields.add(mdmAnnotations.reference()[2]);
                        fields.add(mdmAnnotations.reference()[3]);
                        ArrayList<Document> objectList = getObjectsList(cookie, DatabaseActions.getMongoConfiguration(mdmAnnotations.reference()[1]), fields);

                        //ArrayList<Document> objectList2 = DatabaseActions.getObjectsSpecificListv2(DatabaseActions.getMongoConfiguration(mdmAnnotations.reference()[1]), filter, filter, 100, excludes, fields);
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
