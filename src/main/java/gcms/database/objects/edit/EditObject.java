/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.database.objects.edit;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mongodb.BasicDBObject;
import gcms.Config.Methods;
import gcms.Core;
import static gcms.Core.createDatabaseObject;
import gcms.GsonObjects.Core.Session;
import gcms.GsonObjects.Other.SerializableClass;
import gcms.GsonObjects.Other.SerializableField;
import gcms.database.DatabaseActions;
import static gcms.database.DatabaseActions.getDocumentPriveleges;
import static gcms.database.DatabaseActions.getObject;
import gcms.database.DatabaseWrapper;
import gcms.modules.commandFunctions;
import java.io.IOException;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import org.bson.Document;
import static gcms.database.DatabaseActions.getObjectsFromDatabase;
import gcms.GsonObjects.annotations.gcmsObject;
import gcms.objects.collections.MongoConfigurations;
import java.util.Arrays;
import java.util.Map;

/**
 *
 * @author Matthias
 */
public class EditObject {

    public static StringBuilder editObject(HashMap<String, String> requestParameters, String cookie, MongoConfigurations _mongoConf) throws IOException, ClassNotFoundException, NoSuchFieldException {
        StringBuilder sb = new StringBuilder();

        SerializableClass serializableClass = new SerializableClass();
        if (_mongoConf.getPluginName() != null && _mongoConf.getPluginName().isBlank() != true) {
            serializableClass = Core.getFields(_mongoConf, cookie);
        } else {
            serializableClass.setClassName(_mongoConf.getClassName());
            serializableClass.convertFields(Arrays.asList(Class.forName(_mongoConf.getClassName()).getDeclaredFields()));
        }

        //  if (Core.checkUserRoleValue(cookie, 2)) {
        requestParameters.remove("action");
        requestParameters.remove("LCMS_session");
        String operation = requestParameters.get("oper");

        //Class cls = Class.forName(_mongoConf.getClassName());
        if (requestParameters.get("oper") != null) {

            requestParameters = Core.checkHashFields(requestParameters, serializableClass);

            if (operation.equals("edit")) {
                HashMap<String, Object> obj = createDatabaseObject(requestParameters, serializableClass);
                editObject(obj, _mongoConf, cookie, serializableClass);
                Map<String, String> workflowParameters = Map.of("method", "post", "mongoconfiguration", _mongoConf.getCollectionId());
                commandFunctions.doWorkflow(workflowParameters, null, null);
            }
            if (operation.equals("add")) {
                requestParameters.remove("oper");
                requestParameters.remove("id");
                HashMap<String, Object> parameters = new HashMap<>();
                requestParameters.forEach((key, value) -> {
                    key = key.replaceAll("\\[|\\]", "");
                    parameters.put(key, value);
                });
                Document document = Document.parse(Core.universalObjectMapper.writeValueAsString(parameters));
                document.append(_mongoConf.getIdName(), UUID.randomUUID().toString());
                addObject(document, _mongoConf, cookie, serializableClass);
                Map<String, String> workflowParameters = Map.of("method", "put", "mongoconfiguration", _mongoConf.getCollectionId());
                commandFunctions.doWorkflow(workflowParameters, null, null);
            }
        }
        // }

        return sb;
    }

    public static void editObject(HashMap<String, Object> mongoObject, MongoConfigurations _mongoConf, String cookie, SerializableClass serializableClass) throws JsonProcessingException, ClassNotFoundException, NoSuchFieldException, IOException {
        List<String> columns = getDocumentPriveleges(Methods.put, cookie, _mongoConf, true, serializableClass);
        List<SerializableField> systemFields = gcms.Core.getSystemFields(serializableClass, "edit");
        BasicDBObject obj = BasicDBObject.parse(Core.universalObjectMapper.writeValueAsString(mongoObject));
        BasicDBObject filteredObj = new BasicDBObject();
        BasicDBObject backlogObj = new BasicDBObject();
        Object oldObject = getObject(_mongoConf, mongoObject.get(_mongoConf.getIdName()).toString());
        //Document oldDocument = Document.parse((Core.universalObjectMapper.writeValueAsString(oldObject)));

        for (String key : obj.keySet()) {
            if (columns.indexOf(key) != -1) {
                if (obj.get(key) != null) {
                    gcmsObject mdmAnnotations = (gcmsObject) serializableClass.getField(key).getAnnotation();
                    if (!mdmAnnotations.DMP()) {
                        filteredObj.put(key, obj.get(key));
                    } else {
                        //String patchedObj = DatabaseActions.patchText(oldDocument.get(key), obj.get(key));
                        //filteredObj.put(key, patchedObj);
                    }
                    backlogObj.put(key, obj.get(key));
                }
            }
        }
        for (SerializableField systemField : systemFields) {
            filteredObj.remove(systemField.getName());
            if (systemField.getName().equals("edited_on")) {
                filteredObj.put(systemField.getName(), Instant.now().toEpochMilli() / 1);
                backlogObj.put(systemField.getName(), Instant.now().toEpochMilli() / 1);
            }
            if (systemField.getName().equals("edited_by")) {
                Session session = DatabaseActions.getSession(cookie);
                if (session != null) {
                    String user = session.getUserid();
                    filteredObj.put(systemField.getName(), user);
                    backlogObj.put(systemField.getName(), user);
                }
            }
        }
        filteredObj.put(_mongoConf.getIdName(), obj.get(_mongoConf.getIdName()));
        backlogObj.put(_mongoConf.getIdName(), obj.get(_mongoConf.getIdName()));
        DatabaseActions.updateObjectItemv2(_mongoConf, filteredObj);
        Document backlog = DatabaseActions.addBackLogv2(_mongoConf, backlogObj);
        if (backlog != null) {
            MongoConfigurations backlogConfiguration = DatabaseActions.getMongoConfiguration("backlog");
            getObjectsFromDatabase(backlogConfiguration).insertOne(backlog);
        }
    }

    public static void addObject(Document doc, MongoConfigurations _mongoConf, String cookie, SerializableClass serializableClass) throws ClassNotFoundException, IOException {
        List<String> columns = getDocumentPriveleges(Methods.post, cookie, _mongoConf, true, serializableClass);
        List<SerializableField> systemFields = gcms.Core.getSystemFields(serializableClass, "create");
        Document filteredDoc = new Document();
        for (String key : doc.keySet()) {
            if (columns.indexOf(key) != -1) {
                filteredDoc.put(key, doc.get(key));
            }
        }
        for (SerializableField systemField : systemFields) {
            filteredDoc.put(systemField.getName(), doc.get(systemField.getName()));
            if (systemField.getName().equals("created_by")) {
                Session session = DatabaseActions.getSession(cookie);
                if (session != null) {
                    String user = session.getUserid();
                    filteredDoc.put(systemField.getName(), user);
                }
            }
            if (systemField.getName().equals("created_on")) {
                filteredDoc.put(systemField.getName(), Instant.now().toEpochMilli() / 1);
            }
            if (systemField.getName().equals("edited_on")) {
                filteredDoc.put(systemField.getName(), Instant.now().toEpochMilli() / 1);
            }
        }
        filteredDoc.put(_mongoConf.getIdName(), doc.get(_mongoConf.getIdName()));

        DatabaseActions.insertObjectItemv2(_mongoConf, filteredDoc);

    }

}
