/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package sdm.gcms.database.objects.get;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mongodb.BasicDBObject;
import static sdm.gcms.Config.loadWebFile;

import sdm.gcms.database.DatabaseWrapper;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.bson.Document;
import sdm.gcms.database.DatabaseActions;
import static sdm.gcms.database.DatabaseActions.getDocumentPriveleges;
import sdm.gcms.shared.database.Database;
import sdm.gcms.shared.database.Methods;
import sdm.gcms.shared.database.collections.Actions;

import sdm.gcms.shared.database.collections.MongoConfigurations;
import sdm.gcms.shared.database.serializable.SerializableClass;
/**
 *
 * @author Matthias
 */
public class GetObject {

    public static StringBuilder getObject(String cookie, MongoConfigurations _mongoConf, String key, String value, Boolean publicPage, Actions _action) throws JsonProcessingException, JsonProcessingException, ClassNotFoundException, JsonProcessingException, JsonProcessingException, NoSuchFieldException, IOException {
        StringBuilder sb = new StringBuilder();

        if (!key.equals("")) {
            BasicDBObject searchObject = new BasicDBObject();
            searchObject.put(key, new BasicDBObject("$eq", value));
            Map<String, Object> searchResult = DatabaseWrapper.getObjectHashMapv2(cookie, _mongoConf, searchObject);
            sb.append(prepareObject(cookie, _mongoConf, publicPage, searchResult).toString());
        }

        return sb;
    }

    public static StringBuilder prepareObject(String cookie, MongoConfigurations _mongoConf, Boolean publicPage, Map<String, Object> searchResult) throws ClassNotFoundException, JsonProcessingException, IOException {
        StringBuilder sb = new StringBuilder();
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode jsonData = mapper.createObjectNode();
        ObjectNode jsonParameters = mapper.createObjectNode();
        String contents = "";
        String id = "";
        if (searchResult.get("contents") != null) {
            contents = searchResult.get("contents").toString();
        }
        if (searchResult.get(_mongoConf.getIdName()) != null) {
            id = searchResult.get(_mongoConf.getIdName()).toString();
        }

        if (_mongoConf.collection.equals("pages") || _mongoConf.collection.equals("document")) {
            ObjectNode jsonReplaces = mapper.createObjectNode();
            jsonReplaces.put("$pageId$", id);
            jsonReplaces.put("$pageContent$", contents);
            searchResult.put("contents", "");
            jsonParameters.put("public", publicPage);
            jsonData.set("parameters", jsonParameters);
            jsonData.put("webPage", loadWebFile("pages/template/index.html"));
            jsonData.set("replaces", jsonReplaces);
            sb.append(jsonData);
        } else {
            ArrayList<Document> results = new ArrayList<>();
            results.add(Document.parse(mapper.writeValueAsString(searchResult)));
            SerializableClass serializableClass = Database.getSerializableClass(cookie, _mongoConf);
            List<String> columns = getDocumentPriveleges(Methods.get, cookie, _mongoConf, true, serializableClass);
            results = DatabaseActions.loadRelationalColumns(columns, results, cookie, serializableClass);
            sb.append(mapper.writeValueAsString(results.get(0)));
        }

        return sb;
    }

}
