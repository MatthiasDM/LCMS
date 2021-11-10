/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package sdm.gcms.database.objects.edit;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mongodb.BasicDBObject;

import sdm.gcms.Core;
import static sdm.gcms.Core.createDatabaseObject;

import sdm.gcms.database.DatabaseActions;
import static sdm.gcms.database.DatabaseActions.getDocumentPriveleges;
import static sdm.gcms.database.DatabaseActions.getObject;
import sdm.gcms.modules.commandFunctions;
import java.io.IOException;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import org.bson.Document;
import static sdm.gcms.database.DatabaseActions.getObjectsFromDatabase;
import sdm.gcms.shared.database.filters.annotation.gcmsObject;

import java.util.Map;
import sdm.gcms.shared.database.collections.MongoConfigurations;
import sdm.gcms.shared.database.serializable.SerializableClass;
import sdm.gcms.shared.database.serializable.SerializableField;
import static sdm.gcms.shared.database.Core.universalObjectMapper;
import sdm.gcms.shared.database.Methods;
import sdm.gcms.shared.database.collections.Actions;
import sdm.gcms.shared.database.users.Session;
/**
 *
 * @author Matthias
 */
public class EditObject {

    public static StringBuilder editObject(HashMap<String, String> requestParameters, String cookie, MongoConfigurations _mongoConf, Actions _action) throws IOException, ClassNotFoundException, NoSuchFieldException {
        StringBuilder sb = new StringBuilder();

       
        SerializableClass serializableClass =  Core.getSerializableClass(cookie, _mongoConf);     
        //  if (Core.checkUserRoleValue(cookie, 2)) {
        requestParameters.remove("action");
        requestParameters.remove("LCMS_session");
        String operation = requestParameters.get("oper");

        //Class cls = Class.forName(_mongoConf.getClassName());
        if (requestParameters.get("oper") != null) {

            requestParameters = Core.checkHashFields(requestParameters, serializableClass);

            if (operation.equals("edit")) {
                HashMap<String, Object> obj = createDatabaseObject(requestParameters, serializableClass);
                editObject(obj, _mongoConf, cookie, serializableClass, null);
                Map<String, String> workflowParameters = Map.of(
                        "method", _action.getMethod(), "mongoconfiguration",
                        _mongoConf.getCollectionId(),
                        "LCMS_session", cookie,
                        "object_id", obj.get(_mongoConf.getIdName()).toString()
                );
                commandFunctions.doWorkflow(workflowParameters, null, null); //Start workflow on current mongoconfiguration
            }
            if (operation.equals("add")) {
                requestParameters.remove("oper");
                requestParameters.remove("id");
                HashMap<String, Object> parameters = new HashMap<>();
                requestParameters.forEach((key, value) -> {
                    key = key.replaceAll("\\[|\\]", "");
                    parameters.put(key, value);
                });
                Document document = Document.parse(universalObjectMapper.writeValueAsString(parameters));
                String object_id = UUID.randomUUID().toString();
                document.append(_mongoConf.getIdName(), UUID.randomUUID().toString());
                addObject(document, _mongoConf, cookie, serializableClass, null);
                Map<String, String> workflowParameters = Map.of(
                        "method", _action.getMethod(),
                        "mongoconfiguration", _mongoConf.getCollectionId(),
                        "object_id", object_id
                );
                commandFunctions.doWorkflow(workflowParameters, null, null);
            }
        }
        // }

        return sb;
    }

    public static void editObject(HashMap<String, Object> mongoObject, MongoConfigurations _mongoConf, String cookie, SerializableClass serializableClass, Actions _actions) throws JsonProcessingException, ClassNotFoundException, NoSuchFieldException, IOException {
        List<String> columns = getDocumentPriveleges(Methods.put, cookie, _mongoConf, true, serializableClass);
        List<SerializableField> systemFields = sdm.gcms.Core.getSystemFields(serializableClass, "edit");
        BasicDBObject obj = BasicDBObject.parse(universalObjectMapper.writeValueAsString(mongoObject));
        BasicDBObject filteredObj = new BasicDBObject();
        BasicDBObject backlogObj = new BasicDBObject();
        Object oldObject = getObject(_mongoConf, mongoObject.get(_mongoConf.getIdName()).toString());
        //Document oldDocument = Document.parse((universalObjectMapper.writeValueAsString(oldObject)));

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

    public static void addObject(Document doc, MongoConfigurations _mongoConf, String cookie, SerializableClass serializableClass, Actions _action) throws ClassNotFoundException, IOException {
        List<String> columns = getDocumentPriveleges(Methods.post, cookie, _mongoConf, true, serializableClass);
        List<SerializableField> systemFields = sdm.gcms.Core.getSystemFields(serializableClass, "create");
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
