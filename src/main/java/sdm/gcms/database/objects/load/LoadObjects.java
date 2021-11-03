/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package sdm.gcms.database.objects.load;

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
import sdm.gcms.Core;
import static sdm.gcms.Core.loadWebFile;
import sdm.gcms.database.DatabaseActions;
import static sdm.gcms.database.DatabaseActions.getDocumentPriveleges;
import sdm.gcms.database.DatabaseWrapper;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.bson.Document;
import org.bson.conversions.Bson;
import static sdm.gcms.database.DatabaseActions.getObjectsFromDatabase;
import sdm.gcms.shared.database.filters.annotation.gcmsObject;

import static sdm.gcms.database.DatabaseActions.getRightsFromDatabaseInCollection;
import sdm.gcms.database.GetResponse;
import java.lang.annotation.Annotation;
import java.util.Arrays;
import java.util.Optional;
import org.apache.commons.lang.StringUtils;
import sdm.gcms.shared.database.collections.MongoConfigurations;
import sdm.gcms.shared.database.serializable.SerializableClass;
import sdm.gcms.shared.database.serializable.SerializableField;
import static sdm.gcms.shared.database.Core.universalObjectMapper;
import sdm.gcms.shared.database.Methods;
import sdm.gcms.shared.database.collections.ActionPrivelege;
import sdm.gcms.shared.database.collections.Actions;
import sdm.gcms.shared.database.collections.Attribute;
import sdm.gcms.shared.database.filters.FilterObject;
import sdm.gcms.shared.database.filters.FilterRule;
import sdm.gcms.shared.database.users.Roles;
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
                if (_mongoConf.getPluginName() != null && !_mongoConf.getPluginName().isBlank()) {
                    serializableClass = Core.getFields(_mongoConf, cookie);
                } else {
                    serializableClass.setClassName(_mongoConf.getClassName());
                    serializableClass.convertFields(Arrays.asList(Class.forName(_mongoConf.getClassName()).getDeclaredFields()));
                }
                List<String> columns = getDocumentPriveleges(Methods.get, cookie, _mongoConf, true, serializableClass);
                ObjectNode jsonData = getObjects(cookie, _mongoConf, _mongoConf.getCollection(), filter, excludes, serializableClass, columns);
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
        boolean access = false;
        List<Actions> actions = DatabaseWrapper.getActions(_mongoConf.getCollectionId());
        Optional<Actions> optionalAction = actions.stream().filter(action -> action.getName().startsWith("data")).findFirst();
        if (optionalAction.isPresent()) {
            List<ActionPrivelege> actionPriveleges = DatabaseWrapper.getActionPriveleges(optionalAction.get());
            access = DatabaseWrapper.checkActionAccess(cookie, actionPriveleges);
        } else {
            access = Core.checkSession(cookie);
        }

        if (access) {
            SerializableClass serializableClass = new SerializableClass();
            if (_mongoConf.getPluginName() != null && !_mongoConf.getPluginName().isBlank()) {
                serializableClass = Core.getFields(_mongoConf, cookie);
            } else {
                serializableClass.setClassName(_mongoConf.getClassName());
                serializableClass.convertFields(Arrays.asList(Class.forName(_mongoConf.getClassName()).getDeclaredFields()));
            }
            List<String> columns = getDocumentPriveleges(Methods.get, cookie, _mongoConf, true, serializableClass);
            ObjectNode jsonData = getObjects(cookie, _mongoConf, _mongoConf.getCollection(), filter, excludes, serializableClass, columns);
            sb.append(jsonData);
        } else {
            sb.append(DatabaseWrapper.getWebPage("credentials/index.html", new String[]{}));
        }

        return sb;
    }

    //data
    public static GetResponse dataload(String cookie, MongoConfigurations _mongoConf, Map<String, String> requestParameters, BasicDBObject prefilter) throws JsonProcessingException, ClassNotFoundException, NoSuchFieldException, IOException {
        GetResponse response = new GetResponse();

            SerializableClass serializableClass = Core.getSerializableClass(cookie, _mongoConf);
            List<String> columns = getDocumentPriveleges(Methods.get, cookie, _mongoConf, true, serializableClass);

            ArrayList<String> excludes = new ArrayList<>();
            String sidx = _mongoConf.getIdName();
            Integer sort = 1;
            if (requestParameters.get("sidx") != null) {
                sidx = String.valueOf(requestParameters.get("sidx")).equals("") ? _mongoConf.getIdName() : String.valueOf(requestParameters.get("sidx"));
            }
            if (requestParameters.get("sord") != null) {
                sort = String.valueOf(requestParameters.get("sord")).equals("asc") ? 1 : -1;
            }
            if (requestParameters.get("excludes") != null) {
                excludes.addAll(Arrays.asList(requestParameters.get("excludes")));
            }
            if (requestParameters.get("excludes[]") != null) {
                String _excludes = requestParameters.get("excludes[]");
                excludes.addAll(Arrays.asList(_excludes));
            }
            BasicDBObject filter = createFilterObject(requestParameters.get("filters"));
            filter.forEach((k, v) -> prefilter.put(k, v));
            Integer page = Integer.parseInt(requestParameters.get("page"));
            Integer rows = Integer.parseInt(requestParameters.get("rows"));
            Boolean includeLargeFields = false;
            if (requestParameters.get("include_large_files") != null) {
                includeLargeFields = Boolean.parseBoolean(requestParameters.get("include_large_files"));
            }
            for (SerializableField f : serializableClass.getFields()) {
                gcmsObject annotation = (gcmsObject) f.getAnnotation();
                if ((annotation.type().equals("cktext") || annotation.type().equals("ckcode")) && !includeLargeFields) {
                    excludes.add(f.getName());
                }
            }

            BasicDBObject sorting = new BasicDBObject(sidx, sort);
            ArrayList<Document> results = DatabaseActions.getObjectsRest(_mongoConf, filter, sorting, rows, excludes.toArray(new String[0]), columns, rows, page);

            columns.removeAll(excludes);

            for (String column : columns) {
                HashMap relationships = new HashMap();
                SerializableField serializableField = serializableClass.getFields().stream().filter(f -> f.getName().equals(column)).findFirst().get();
                String fieldName = serializableField.getName();
                Annotation fieldAnnotation = serializableField.getAnnotation();
                gcmsObject mdmAnnotations = (gcmsObject) fieldAnnotation;

                if (!StringUtils.isEmpty(mdmAnnotations.fk())) {

                    HashMap fk = universalObjectMapper.readValue(mdmAnnotations.fk(), HashMap.class);
                    String collection = (String) fk.get("collection");
                    String pk = (String) fk.get("pk");
                    String display = (String) fk.get("display");
                    ArrayList<String> fields = new ArrayList<>();
                    fields.add(pk);
                    fields.add(display);
                    MongoConfigurations _fkMongoConf = DatabaseActions.getMongoConfiguration(collection);
                    SerializableClass fkClass = Core.getSerializableClass(cookie, _fkMongoConf);
                    fields.addAll(getDocumentPriveleges(Methods.get, cookie, _fkMongoConf, true, Core.getSerializableClass(cookie, _fkMongoConf)));

                    for (SerializableField f : fkClass.getFields()) {
                        gcmsObject annotation = (gcmsObject) f.getAnnotation();
                        if (annotation.type().equals("cktext") || annotation.type().equals("ckcode")) {
                            fields.remove(f.getName());
                        }
                    }
                    for (int i = 0; i < results.size(); i++) {
                        String pkFilter = (String) results.get(i).get(column);
                        ArrayList<Document> fkResults = DatabaseActions.getObjectsSpecificListv2(_fkMongoConf, new BasicDBObject(pk, new BasicDBObject("$eq", pkFilter)), new BasicDBObject(), 1, new String[0], fields);
                        for (int j = 0; j < fkResults.size(); j++) {
                            fkResults.get(j).append("id", fkResults.get(j).get(pk));
                            fkResults.get(j).append("value", fkResults.get(j).get(display));
                            fkResults.get(j).remove(pk);
                            fkResults.get(j).remove(display);
                        }
                        String jsonValue = universalObjectMapper.writeValueAsString(fkResults);
                        results.get(i).put(column, jsonValue);
                    }
                }
            }
            response.setRecords(Integer.parseInt(String.valueOf(DatabaseActions.getObjectCount(_mongoConf, filter))));
            double totalPage = (response.getRecords().doubleValue() / rows.doubleValue());
            response.setTotal((int) (Math.ceil((totalPage))));
            response.setPage(page);
            if (!results.isEmpty()) {
                response.setRows(results);
            }
        
        return response;
    }

    public static BasicDBObject createFilterObject(String json) throws IOException {
        BasicDBObject filter = new BasicDBObject();
        if (json != null) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                mapper.enable(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT);
                FilterObject filterObject = mapper.readValue(json, FilterObject.class);
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
        List<String> editableColumns = getDocumentPriveleges(Methods.put, cookie, _mongoConf, true, serializableClass);
        List<String> createableColumns = getDocumentPriveleges(Methods.post, cookie, _mongoConf, true, serializableClass);
        ArrayList<HashMap> header = new ArrayList<>();
        ArrayList<HashMap> table = new ArrayList<>();
        HashMap tableEntry = new HashMap();
        ArrayList<Document> results = null;
        ArrayList<Attribute> rights = getRightsFromDatabaseInCollection(_mongoConf.getCollectionId());

        for (String column : columns) {
            Attribute databaseRight = rights.stream().filter(r -> r.getAttribute().equals(column)).findFirst().orElse(new Attribute());

            SerializableField serializableField = serializableClass.getFields().stream().filter(f -> f.getName().equals(column)).findFirst().get();
            String fieldName = serializableField.getName();
            Annotation fieldAnnotation = serializableField.getAnnotation();
            gcmsObject mdmAnnotations = (gcmsObject) fieldAnnotation;

            HashMap headerEntry = new HashMap();
            headerEntry.put("name", fieldName);
            if (mdmAnnotations != null) {
                headerEntry.put("type", mdmAnnotations.type());
                headerEntry.put("formatterName", mdmAnnotations.formatterName());
                headerEntry.put("relationParameters", mdmAnnotations.relationParameters());
                headerEntry.put("fk", mdmAnnotations.fk());
                headerEntry.put("pk", mdmAnnotations.pk());
                if (databaseRight.getCollection() != null) {
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
                headerEntry.put("tablename", tableName);

//                if (!"".equals(mdmAnnotations.relationParameters())) {
//                    RelationParameter relationParameter = mapper.readValue(mdmAnnotations.relationParameters(), RelationParameter.class);
//                    //reference = {"Mongo", "mongoconfigurations", "name", "name"},
//                    ArrayList<String> fields = new ArrayList<>();
//                    fields.add(relationParameter.getKey());
//                    fields.add(relationParameter.getValue());
//                    ArrayList<Document> objectList = getObjectsList(cookie, DatabaseActions.getMongoConfiguration(relationParameter.getCollection()), fields);
//                    JsonNode actualObj = universalObjectMapper.readTree(mapper.writeValueAsString(objectList));
//                    String jsonValue = actualObj.toString();
//                    headerEntry.put("choices", map);
//                }
                if (!"".equals(mdmAnnotations.reference()[0])) {
                    String refType = mdmAnnotations.reference()[0];
                    if (refType.equals("Mongo")) {
                        ArrayList<String> fields = new ArrayList<>();
                        fields.add(mdmAnnotations.reference()[2]);
                        fields.add(mdmAnnotations.reference()[3]);
                        ArrayList<Document> objectList = getObjectsList(cookie, DatabaseActions.getMongoConfiguration(mdmAnnotations.reference()[1]), fields);
                        HashMap<String, Object> map = new HashMap<>();
                        for (Object doc : objectList) {
                            JsonNode actualObj = universalObjectMapper.readTree(mapper.writeValueAsString(doc));
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
                        if (Enum.equals("Methods")) {
                            Map<String, Methods> methods = new HashMap<>();
                            for (Methods method : Methods.class.getEnumConstants()) {
                                methods.put(method.name(), method);
                            }
                            headerEntry.put("choices", methods);
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
                JsonNode actualObj = universalObjectMapper.readTree(mapper.writeValueAsString(results));
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

    public static GetResponse parseAsPage(String cookie, MongoConfigurations _mongoConf, Boolean publicPage, GetResponse restResponse) throws ClassNotFoundException, JsonProcessingException {
        StringBuilder sb = new StringBuilder();
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode jsonData = mapper.createObjectNode();
        ObjectNode jsonParameters = mapper.createObjectNode();
        String contents = "";
        String id = "";
        Document document = restResponse.getRows().get(0);
        if (document.get("contents") != null) {
            contents = document.get("contents").toString();
        }
        if (document.get(_mongoConf.getIdName()) != null) {
            id = document.get(_mongoConf.getIdName()).toString();
        }

        if (_mongoConf.collection.equals("pages") || _mongoConf.collection.equals("document")) {
            document.clear();
            ObjectNode jsonReplaces = mapper.createObjectNode();
            jsonReplaces.put("$pageId$", id);
            jsonReplaces.put("$pageContent$", contents);
            document.put("contents", "");
            jsonParameters.put("public", publicPage);
            document.put("parameters", jsonParameters);
            document.put("webPage", loadWebFile("pages/template/index.html"));
            document.put("replaces", jsonReplaces);
            sb.append(document);
        } else {
            sb.append(mapper.writeValueAsString(document));
        }
        restResponse.getRows().set(0, document);
        return restResponse;
    }

}
