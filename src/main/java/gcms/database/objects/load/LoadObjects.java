/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.database.objects.load;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mongodb.client.MongoCollection;
import static com.mongodb.client.model.Projections.fields;
import static com.mongodb.client.model.Projections.include;
import gcms.Config.Roles;
import gcms.Core;
import gcms.GsonObjects.Core.MongoConfigurations;
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
            gcmsObject mdmAnnotations = field.getAnnotation(gcmsObject.class);
            HashMap headerEntry = new HashMap();
            headerEntry.put("name", field.getName());
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
    
       public static ArrayList<Document> getObjectsList(String _cookie, MongoConfigurations mongoConf, List<String> columns) throws ClassNotFoundException {

        ArrayList<Document> results = null;
        try {
            MongoCollection<Document> ObjectItems = getObjectsFromDatabase(mongoConf);
            results = ObjectItems.find().projection(
                    fields(include(columns))
            ).into(new ArrayList<>());
        } catch (ClassNotFoundException ex) {            
            Logger.getLogger(LoadObjects.class.getName()).log(Level.SEVERE, ex.getMessage());
            return results;
        }
        return results;
    }
    
}
