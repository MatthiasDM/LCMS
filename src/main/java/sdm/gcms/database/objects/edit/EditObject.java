/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package sdm.gcms.database.objects.edit;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mongodb.BasicDBObject;

import sdm.gcms.Config;

import sdm.gcms.database.DatabaseActions;
import static sdm.gcms.database.DatabaseActions.getDocumentPriveleges;
import sdm.gcms.modules.commandFunctions;
import java.io.IOException;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import org.bson.Document;
import static sdm.gcms.database.DatabaseActions.getObjectsFromDatabase;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import sdm.gcms.shared.database.collections.MongoConfigurations;
import sdm.gcms.shared.database.serializable.SerializableClass;
import sdm.gcms.shared.database.serializable.SerializableField;
import static sdm.gcms.shared.database.Core.universalObjectMapper;
import sdm.gcms.shared.database.Database;
import sdm.gcms.shared.database.Methods;
import sdm.gcms.shared.database.collections.Actions;
import sdm.gcms.shared.database.users.Session;
import static sdm.gcms.Config.parseDatabaseObject;

/**
 *
 * @author Matthias
 */
public class EditObject {

    public static StringBuilder doWorkflow(Actions _action, String _mongoConfId, String _session, String _objectId, Document _initiatingDocument) {
        StringBuilder sb = new StringBuilder();
        try {
            Map<String, String> workflowParameters = new HashMap<>();
            workflowParameters.put("method", _action.getMethod());
            workflowParameters.put("action", _action.getName());
            workflowParameters.put("mongoconfiguration", _mongoConfId);
            workflowParameters.put("LCMS_session", _session);
            workflowParameters.put("object_id", _objectId);
            sb = commandFunctions.doWorkflow(workflowParameters, null, null);
        } catch (IOException | ClassNotFoundException ex) {
            Logger.getLogger(EditObject.class.getName()).log(Level.SEVERE, null, ex);
        }
        return sb;
    }

    public static StringBuilder editObject(HashMap<String, String> requestParameters, String cookie, MongoConfigurations _mongoConf, Actions _action) throws IOException, ClassNotFoundException, NoSuchFieldException {
        StringBuilder sb = new StringBuilder();
        SerializableClass serializableClass = Database.getSerializableClass(cookie, _mongoConf);
        requestParameters.remove("action");
        requestParameters.remove("LCMS_session");
        String operation = requestParameters.get("oper");
        if (requestParameters.get("oper") != null) {

            requestParameters = Config.checkHashFields(requestParameters, serializableClass);

            if (operation.equals("edit")) {
                Document document = new Document(parseDatabaseObject(requestParameters, serializableClass));
                editObject(document, _mongoConf, cookie, serializableClass, null);
                doWorkflow(_action, _mongoConf.getCollectionId(), cookie, document.get(_mongoConf.getIdName()).toString(), document);
            }
            if (operation.equals("add")) {
                HashMap<String, Object> parameters = new HashMap<>();
                for (String key : requestParameters.keySet()) {
                    parameters.put(key.replaceAll("\\[|\\]", ""), requestParameters.get(key));
                }
                parameters = parseDatabaseObject(requestParameters, serializableClass);
                Document document = Document.parse(universalObjectMapper.writeValueAsString(parameters));
                String object_id = UUID.randomUUID().toString();
                document.append(_mongoConf.getIdName(), UUID.randomUUID().toString());
                addObject(document, _mongoConf, cookie, serializableClass, null);
                doWorkflow(_action, _mongoConf.getCollectionId(), cookie, object_id, document);
            }
        }

        return sb;
    }

    public static void editObject(Document obj, MongoConfigurations _mongoConf, String cookie, SerializableClass serializableClass, Actions _actions) throws JsonProcessingException, ClassNotFoundException, NoSuchFieldException, IOException {
        List<String> columns = getDocumentPriveleges(Methods.put, cookie, _mongoConf, true, serializableClass);
        List<SerializableField> systemFields = sdm.gcms.Config.getSystemFields(serializableClass, "edit");
        //BasicDBObject obj = BasicDBObject.parse(universalObjectMapper.writeValueAsString(mongoObject));
        BasicDBObject filteredObj = new BasicDBObject();
        BasicDBObject backlogObj = new BasicDBObject();

        for (String key : obj.keySet()) {
            if (columns.indexOf(key) != -1) {
                if (obj.get(key) != null) {
                    filteredObj.put(key, obj.get(key));
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
            MongoConfigurations backlogConfiguration = Database.getMongoConfiguration("backlog");
            getObjectsFromDatabase(backlogConfiguration).insertOne(backlog);
        }
    }

    public static void addObject(Document doc, MongoConfigurations _mongoConf, String cookie, SerializableClass serializableClass, Actions _action) throws ClassNotFoundException, IOException {
        List<String> columns = getDocumentPriveleges(Methods.post, cookie, _mongoConf, true, serializableClass);
        List<SerializableField> systemFields = sdm.gcms.Config.getSystemFields(serializableClass, "create");
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
