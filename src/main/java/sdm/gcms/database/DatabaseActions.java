/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package sdm.gcms.database;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientOptions;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.MongoIterable;
import com.mongodb.client.gridfs.GridFSBucket;
import com.mongodb.client.gridfs.GridFSBuckets;
import com.mongodb.client.gridfs.model.GridFSUploadOptions;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import static org.bson.codecs.configuration.CodecRegistries.fromProviders;
import static org.bson.codecs.configuration.CodecRegistries.fromRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.codecs.pojo.PojoCodecProvider;
import static com.mongodb.client.model.Filters.*;
import com.mongodb.client.model.FindOneAndUpdateOptions;
import static com.mongodb.client.model.Projections.exclude;
import static com.mongodb.client.model.Projections.fields;
import static com.mongodb.client.model.Projections.include;
import com.mongodb.util.JSON;
//import difflib.DiffUtils;
//import difflib.Patch;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.time.Instant;
import java.util.Arrays;
import java.util.UUID;
import java.util.logging.Level;
import java.util.stream.Collectors;
import sdm.gcms.Core;
import sdm.gcms.GsonObjects.Core.Command;
import sdm.gcms.modules.commandFunctions;
import static sdm.gcms.database.DatabaseActions.updateObjectItemv2;
import java.util.Timer;
import java.util.TimerTask;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import sdm.gcms.shared.database.filters.annotation.gcmsObject;

import static sdm.gcms.database.DatabaseActions.getCommand;

import sdm.gcms.shared.database.collections.MongoConfigurations;
import sdm.gcms.shared.database.serializable.SerializableClass;
import sdm.gcms.shared.database.serializable.SerializableField;
import static sdm.gcms.shared.database.Core.universalObjectMapper;
import sdm.gcms.shared.database.Database;
import sdm.gcms.shared.database.FileObject;
import sdm.gcms.shared.database.Method;
import sdm.gcms.shared.database.Methods;
import sdm.gcms.shared.database.collections.Actions;
import sdm.gcms.shared.database.collections.Attribute;
import sdm.gcms.shared.database.collections.Backlog;
import sdm.gcms.shared.database.users.Role;
import sdm.gcms.shared.database.users.Session;
import sdm.gcms.shared.database.users.User;
/**
 *
 * @author matmey
 */
public class DatabaseActions {

    static MongoClient mongo = Database.getMongo();
    static Map<String, MongoDatabase> databases = Database.getDatabases();

    private static final Logger LOG = Logger.getLogger(DatabaseActions.class.getName());
    static CodecRegistry pojoCodecRegistry = fromRegistries(MongoClient.getDefaultCodecRegistry(),
            fromProviders(PojoCodecProvider.builder().automatic(true).build()));
    
//    public static void connect() {
//        mongo = new MongoClient("localhost",
//                MongoClientOptions.builder().codecRegistry(pojoCodecRegistry).build());
//    }
//
//    public static void createDatabaseMap() {
//
//        if (databases.get("users") == null) {
//            databases.put("users", openOrCreateDB("users"));
//        }
//        if (databases.get("lcms") == null) {
//            databases.put("lcms", openOrCreateDB("lcms"));
//        }
//        if (databases.get("files") == null) {
//            databases.put("files", openOrCreateDB("files"));
//        }
//        if (databases.get("history") == null) {
//            databases.put("history", openOrCreateDB("history"));
//        }
//        if (databases.get("backlog") == null) {
//            databases.put("backlog", openOrCreateDB("backlog"));
//        }
//
//    }

    static private MongoDatabase openOrCreateDB(String db) {
        try {
            return mongo.getDatabase(db);

        } catch (Exception e) {
            LOG.info(e.getLocalizedMessage());

            return null;
        }
    }

    public static MongoDatabase getDatabase(String db) {
        return databases.get(db);
    }

    //SOFTWARE VERSION METHODS
    static public String getEnviromentInfo() throws IOException {
        StringBuilder sb = new StringBuilder();
        sb.append(Core.getProp("env"));
        try {
            sb.append(" ");
            sb.append(Core.getProperty("git.properties", "git.build.version"));
        } catch (Exception e) {
        }
        return sb.toString();
    }

    static public String getLogo() throws IOException {
        StringBuilder sb = new StringBuilder();
        sb.append(Core.getProp("env"));
        try {
            sb.append(" ");
            sb.append(Core.getProperty("logo", "git.build.version"));
        } catch (Exception e) {
        }
        return sb.toString();
    }

    //COLLECTION METHODS
    static public void createCollection(String _db, String _colName) {
        MongoDatabase db = databases.get(_db);
        db.createCollection(_colName);
    }

    static public List<String> getCollections(MongoDatabase db) {
        MongoIterable<String> strings = db.listCollectionNames();
        List<String> repos = new ArrayList<>();
        MongoCursor<String> iterator = strings.iterator();
        while (iterator.hasNext()) {
            repos.add(iterator.next().toString());
        }
        return repos;
    }

    public static void startChronJobs() {
        Timer t = new Timer();
        CronTask mTask = new CronTask();
        // This task is scheduled to run every 60 seconds
        t.scheduleAtFixedRate(mTask, 0, 60000);
    }

    public static void stopChronJobs() {
    }

    //SESSION METHODS
    static private MongoCollection<Session> getSessions() {
        MongoCollection<Session> sessions = databases.get("users")
                .getCollection("sessions", Session.class);
        return sessions;

    }

    public static void insertSession(Session session) {
        getSessions().insertOne(session);

        LOG.info("One session inserted of total: " + getSessions().count());
    }

    public static void updateSession(Session session) throws ClassNotFoundException {
        Bson newDocument = new Document("$set", session);
        getSessions().findOneAndUpdate(and(eq("sessionID", session.getSessionID())), newDocument);
    }

    static public Session getSession(String _sessionId) {
        Session session = null;
        if (checkConnection("users") && notNullNorEmpty(_sessionId)) {
            try {
                MongoCollection<Session> sessions = getSessions();
                session = sessions.find(and(eq("sessionID", _sessionId), eq("valid", true))).first();
            } catch (Exception e) {
                LOG.severe(e.getMessage());
            }
        }
        return session;
    }

    static public Boolean notNullNorEmpty(String item) {
        Boolean result = false;
        if (item != null) {
            if (!item.equals("")) {
                result = true;
            }
        }
        return result;
    }

    static public void editSessionValidity(String _sessionId, long _validity) throws ClassNotFoundException {

        if (checkConnection("users")) {
            if ((sdm.gcms.Core.checkSession(_sessionId))) {
                long newValidity;
                Session session = getSession(_sessionId);
                newValidity = session.getValidity() + _validity;
                session.setValidity(newValidity);
                updateSession(session);
            }
        }
    }

    //USER METHODS
    static private MongoCollection<User> getUsers() {
        MongoCollection<User> users = databases.get("users")
                .getCollection("users", User.class);
        return users;

    }

    static public User getUser(String _user) {
        User user = null;
        if (checkConnection("users")) {
            try {
                MongoCollection<User> users = getUsers();
                FindIterable it = users.find(and(eq("username", _user)));
                ArrayList<User> results = new ArrayList();
                it.into(results);
                for (User entry : results) {
                    user = (User) entry;
                }
                return user;
            } catch (Exception e) {
                LOG.severe(e.getMessage());
            }
        }
        return user;
    }

    static public User getUser(String _identifier, String _identifyBy) {
        User user = null;
        if (checkConnection("users")) {
            try {
                MongoCollection<User> users = getUsers();
                FindIterable it = users.find(and(eq(_identifyBy, _identifier)));
                ArrayList<User> results = new ArrayList();
                it.into(results);
                for (User entry : results) {
                    user = (User) entry;
                }
                return user;
            } catch (Exception e) {
                LOG.severe(e.getMessage());
            }
        }
        return user;
    }

    static private MongoCollection<Role> getRoles() {
        MongoCollection<Role> roles = databases.get("roles")
                .getCollection("roles", Role.class);
        return roles;

    }

    static public Role getRole(String _role) {
        Role role = null;
        if (checkConnection("roles")) {
            try {
                MongoCollection<Role> users = getRoles();
                FindIterable it = users.find(and(eq("username", _role)));
                ArrayList<Role> results = new ArrayList();
                it.into(results);
                for (Role entry : results) {
                    role = (Role) entry;
                }
                return role;
            } catch (Exception e) {
                LOG.severe(e.getMessage());
            }
        }
        return role;
    }

    private static boolean checkConnection(String db) {

        if (databases.get(db) == null) {
            return false;
        } else {
            return true;
        }

    }

    //FILE METHODS
    public static void insertFile(InputStream inputStream, String name, FileObject _fileobject) {
        ObjectId fileId = null;
        try {
            GridFSBucket gridBucket = GridFSBuckets.create(DatabaseActions.getDatabase("files"));
            ObjectMapper mapper = new ObjectMapper();
            Document document = Document.parse(mapper.writeValueAsString(_fileobject));
            GridFSUploadOptions uploadOptions = new GridFSUploadOptions().chunkSizeBytes(1024).metadata(document);
            fileId = gridBucket.uploadFromStream(name, inputStream, uploadOptions);
        } catch (JsonProcessingException e) {
        }
    }

    public static String downloadFileToTemp(String _fileName, String _cookie, String _contextPath, boolean _publicPage) {
        System.out.println("Calling download..");
        String outputDir = sdm.gcms.Core.getProp("files.path") + "/" + _cookie + "/";
        String outputPath = outputDir + _fileName;
        String trimmedOutputPath = sdm.gcms.Core.getProp("files.folder") + _cookie + "/" + _fileName;
        if (_publicPage) {
            outputDir = sdm.gcms.Core.getProp("files.path") + "/public/";
            outputPath = outputDir + _fileName;
            trimmedOutputPath = sdm.gcms.Core.getProp("files.folder") + "public/" + _fileName;
        }
        Core.checkDir(outputDir);
        try {
            MongoDatabase database = databases.get("files");
            GridFSBucket gridBucket = GridFSBuckets.create(database);

            FileOutputStream fileOutputStream = new FileOutputStream(outputPath);
            gridBucket.downloadToStream(_fileName, fileOutputStream);

            fileOutputStream.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
        return trimmedOutputPath;
    }

    //FILEOBJECT METHODS
    static private MongoCollection<FileObject> getFileObjects() {
        MongoCollection<FileObject> fileObjects = databases.get("lcms")
                .getCollection("fileobjects", FileObject.class);
        return fileObjects;
    }

    public static void insertFileObject(FileObject _fileObject) {
        getFileObjects().insertOne(_fileObject);
        LOG.info("One fileobject inserted of total: " + getFileObjects().count());
    }

   

    public static List<Methods> getFieldRolePriveleges(MongoConfigurations collection, Role role, String field) throws ClassNotFoundException {
        List<Methods> results = new ArrayList<>();
        MongoConfigurations mongoConfiguration = DatabaseActions.getMongoConfiguration("fieldRolePriveleges");
        BasicDBObject searchObject = new BasicDBObject();
        searchObject.put("collection", new BasicDBObject("$eq", collection.getCollectionId()));
        searchObject.put("role", new BasicDBObject("$eq", role.getRoleid()));
        searchObject.put("field", new BasicDBObject("$eq", field));
        ArrayList fieldNames = new ArrayList<>();
        fieldNames.add("method");
        ArrayList<Document> priveleges = DatabaseActions.getObjectsSpecificListv2(mongoConfiguration, searchObject, new BasicDBObject(), 100, new String[]{}, fieldNames);
        for (int i = 0; i < priveleges.size(); i++) {
            results.add(Methods.valueOf(priveleges.get(i).get("method").toString()));
        }
        return results;
    }

    public static List<Methods> getDocumentRolePriveleges(MongoConfigurations collection, Role role, String document) throws ClassNotFoundException {
        List<Methods> results = new ArrayList<>();
        MongoConfigurations mongoConfiguration = DatabaseActions.getMongoConfiguration("fieldRolePriveleges");
        BasicDBObject searchObject = new BasicDBObject();
        searchObject.put("collection", new BasicDBObject("$eq", collection.getCollectionId()));
        searchObject.put("role", new BasicDBObject("$eq", role.getRoleid()));
        searchObject.put("document", new BasicDBObject("$eq", document));
        ArrayList fieldNames = new ArrayList<>();
        fieldNames.add("method");
        ArrayList<Document> priveleges = DatabaseActions.getObjectsSpecificListv2(mongoConfiguration, searchObject, new BasicDBObject(), 100, new String[]{}, fieldNames);
        for (int i = 0; i < priveleges.size(); i++) {
            results.add(Methods.valueOf(priveleges.get(i).get("method").toString()));
        }
        return results;
    }

    public static List<Methods> getCollectionUserPriveleges(MongoConfigurations collection, User user) throws ClassNotFoundException {
        List<Methods> results = new ArrayList<>();
        MongoConfigurations mongoConfiguration = DatabaseActions.getMongoConfiguration("collectionRolePriveleges");
        BasicDBObject searchObject = new BasicDBObject();
        searchObject.put("collection", new BasicDBObject("$eq", collection.getCollectionId()));
        searchObject.put("user", new BasicDBObject("$eq", user.getUserid()));
        ArrayList fieldNames = new ArrayList<>();
        fieldNames.add("method");
        ArrayList<Document> priveleges = DatabaseActions.getObjectsSpecificListv2(mongoConfiguration, searchObject, new BasicDBObject(), 100, new String[]{}, fieldNames);
        for (int i = 0; i < priveleges.size(); i++) {
            results.add(Methods.valueOf(priveleges.get(i).get("method").toString()));
        }
        return results;
    }

    public static List<Methods> getFieldUserPriveleges(MongoConfigurations collection, User user, String field) throws ClassNotFoundException {
        List<Methods> results = new ArrayList<>();
        MongoConfigurations mongoConfiguration = DatabaseActions.getMongoConfiguration("fieldRolePriveleges");
        BasicDBObject searchObject = new BasicDBObject();
        searchObject.put("collection", new BasicDBObject("$eq", collection.getCollectionId()));
        searchObject.put("user", new BasicDBObject("$eq", user.getUserid()));
        searchObject.put("field", new BasicDBObject("$eq", field));
        ArrayList fieldNames = new ArrayList<>();
        fieldNames.add("method");
        ArrayList<Document> priveleges = DatabaseActions.getObjectsSpecificListv2(mongoConfiguration, searchObject, new BasicDBObject(), 100, new String[]{}, fieldNames);
        for (int i = 0; i < priveleges.size(); i++) {
            results.add(Methods.valueOf(priveleges.get(i).get("method").toString()));
        }
        return results;
    }

    public static List<Methods> getDocumentUserPriveleges(MongoConfigurations collection, User user, String document) throws ClassNotFoundException {
        List<Methods> results = new ArrayList<>();
        MongoConfigurations mongoConfiguration = DatabaseActions.getMongoConfiguration("fieldRolePriveleges");
        BasicDBObject searchObject = new BasicDBObject();
        searchObject.put("collection", new BasicDBObject("$eq", collection.getCollectionId()));
        searchObject.put("user", new BasicDBObject("$eq", user.getUserid()));
        searchObject.put("document", new BasicDBObject("$eq", document));
        ArrayList fieldNames = new ArrayList<>();
        fieldNames.add("method");
        ArrayList<Document> priveleges = DatabaseActions.getObjectsSpecificListv2(mongoConfiguration, searchObject, new BasicDBObject(), 100, new String[]{}, fieldNames);
        for (int i = 0; i < priveleges.size(); i++) {
            results.add(Methods.valueOf(priveleges.get(i).get("method").toString()));
        }
        return results;
    }

    public static ArrayList<Attribute> getRightsFromDatabaseInCollection(String _collection) throws ClassNotFoundException {
        MongoConfigurations mongoConfiguration = DatabaseActions.getMongoConfiguration("attributes");
        BasicDBObject searchObject = new BasicDBObject();
        searchObject.put("collection", new BasicDBObject("$eq", _collection));
        Class cls = Class.forName(mongoConfiguration.getClassName());
        List<Field> fields = Arrays.asList(cls.getDeclaredFields());
        List<String> fieldnames = new ArrayList<>();
        for (Field f : fields) {
            fieldnames.add(f.getName());
        }
        ArrayList<Document> rightsDoc = DatabaseActions.getObjectsSpecificListv2(mongoConfiguration, searchObject, new BasicDBObject(), 100, new String[]{}, fieldnames);
        if (rightsDoc != null) {
            try {
                LOG.log(Level.INFO, "Found custom rights{0}", universalObjectMapper.writeValueAsString(rightsDoc));
            } catch (JsonProcessingException ex) {
                Logger.getLogger(DatabaseActions.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        ArrayList<Attribute> attributeRights = new ArrayList<>();
        for (int i = 0; i < rightsDoc.size(); i++) {
            attributeRights.add(universalObjectMapper.convertValue(rightsDoc.get(i), Attribute.class));
        }

        return attributeRights;
    }

    public static List<String> getDocumentPriveleges(Methods _privelegeType, String _cookie, MongoConfigurations _mongoConf, boolean checkRights, SerializableClass serializableClass) throws ClassNotFoundException, IOException {
        List<String> columns = new ArrayList<>();
        try {
            columns = getPriveleges(_privelegeType, _cookie, checkRights, _mongoConf, serializableClass);
        } catch (JsonProcessingException ex) {
            Logger.getLogger(DatabaseActions.class.getName()).log(Level.SEVERE, null, ex);
        }
        return columns;
    }

    public static List<String> getPriveleges(Methods _method, String _cookie, boolean _checkRights, MongoConfigurations _mongoConf, SerializableClass _serializableClass) throws ClassNotFoundException, JsonProcessingException, IOException {
        List<String> columns = new ArrayList<>();
        List<String> fields = new ArrayList<>();
        if (_mongoConf.getClassName().equals("MongoConfigurations") || _mongoConf.getClassName().equals("Actions") || _mongoConf.getClassName().equals("ActionPrivelege")) {
            columns = _serializableClass.getFields().stream()
                    .map(result -> result.getName())
                    .collect(Collectors.toList());
        } else {
            if (_checkRights) {
                List<String> userRoles = Core.getUserRoles(_cookie);
                Session session = getSession(_cookie);
                columns.addAll(getColumnsFromAnnotations(_method, _serializableClass, _mongoConf.getCollectionId(), session, userRoles));
                fields = _serializableClass.getFields().stream()
                        .map(result -> result.getName())
                        .collect(Collectors.toList());

                HashMap<Methods, List<String>> collectionPriveleges = new HashMap<>();
                for (String role : userRoles) {
                    Role r = new Role();
                    r.setRoleid(role);
                }
            } else {
                columns.addAll(_serializableClass.getFields().stream().map(p -> p.getName()).collect(Collectors.toList()));
            }
        }
        return columns;
    }

    public static List<String> getColumnsFromAnnotations(Methods _privelegeType, SerializableClass _serialiableClass, String _collection, Session _session, List<String> _userRoles) throws ClassNotFoundException {
        List<String> columns = new ArrayList<>();
        List<SerializableField> fields = _serialiableClass.getFields();
        ArrayList<Attribute> rights = getRightsFromDatabaseInCollection(_collection);

        for (SerializableField field : fields) {
            gcmsObject annotation = (gcmsObject) field.getAnnotation();
            Attribute databaseRight = rights.stream().filter(r -> r.getAttribute().equals(field.getName())).findFirst().orElse(new Attribute());
            if (annotation != null) {
                String requiredRole = "";
                int requiredRoleVal = 1;
                switch (_privelegeType) {
                    case get:
                        requiredRole = annotation.viewRole();
                        requiredRoleVal = annotation.minimumViewRoleVal();
                        break;
                    case put:
                        requiredRole = annotation.editRole();
                        requiredRoleVal = annotation.minimumEditRoleVal();
                        break;
                    case post:
                        requiredRole = annotation.createRole();
                        requiredRoleVal = annotation.minimumCreateRoleVal();
                        break;
                    default:
                        break;
                }

                for (String userRole : _userRoles) {
                    if (requiredRole.equals("")) {
                        if (Core.getRoleLevelCode(userRole) >= requiredRoleVal) {
                            columns.add(field.getName());
                            break;
                        }
                    } else {
                        if (requiredRole.startsWith("@")) {
                            String roleName = requiredRole.substring(1);
                            String referencedField = fields.stream()
                                    .filter(r -> r.getName().equals(roleName.substring(1)))
                                    .findFirst()
                                    .toString();
                            if (_session != null) {
                                if (_session.getUsername().equals(referencedField)) {
                                    columns.add(field.getName());
                                }
                            }
                        }

                        if (userRole.equals(requiredRole)) {
                            columns.add(field.getName());
                            break;
                        }
                    }
                }
                for (String userRole : _userRoles) {
                    int size = databaseRight.getRolesFromPrivilege(_privelegeType).size();

                    if (size > 0) {
                        if (databaseRight.getRolesFromPrivilege(_privelegeType).contains(userRole)) {
                            if (!columns.contains(field.getName())) {
                                columns.add(field.getName());
                            }
                            break;
                        } else {
                            if (columns.contains(field.getName())) {
                                columns.remove(field.getName());
                            }
                        }
                    }

                }

            }
        }
        return columns;
    }

    public static MongoCollection<Document> getObjectsFromDatabase(MongoConfigurations mongoConf) throws ClassNotFoundException {
        MongoCollection<Document> results = null;
        results = databases.get(mongoConf.database).getCollection(mongoConf.collection);
        return results;
    }

    public static MongoCollection<Document> getObjectsFromDatabase(String className, String database, String collection) throws ClassNotFoundException {
        MongoCollection<Document> results = null;
        Class cls = Class.forName(className);
        results = databases.get(database).getCollection(collection, cls);

        return results;
    }

    public static void insertObjectItemv2(MongoConfigurations mongoConf, Document _doc) throws ClassNotFoundException {
        DatabaseActions.getObjectsFromDatabase(mongoConf).insertOne(_doc);
        LOG.info("One Object inserted");
    }

    public static void updateObjectItemv2(MongoConfigurations mongoConf, BasicDBObject _bson) throws ClassNotFoundException {
        Bson newDocument = new Document("$set", _bson);
        DatabaseActions.getObjectsFromDatabase(mongoConf).findOneAndUpdate(and(eq(mongoConf.getIdName(), _bson.get(mongoConf.getIdName()))), newDocument, (new FindOneAndUpdateOptions()).upsert(true));
        LOG.info("One Object updated");
    }

    public static Document getObject(MongoConfigurations mongoConf, String id) throws ClassNotFoundException, JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        MongoCollection<Document> ObjectItems = DatabaseActions.getObjectsFromDatabase(mongoConf);
        ArrayList<Document> results = null;
        results = ObjectItems.find(and(eq(mongoConf.getIdName(), id))).into(new ArrayList<Document>());
        Document d = Document.parse(mapper.writeValueAsString(results.get(0)));
        return d;
    }

    public static Document getObject(String className, String database, String collection, Bson bson) throws ClassNotFoundException, JsonProcessingException, IOException {
        ObjectMapper mapper = new ObjectMapper();
        MongoCollection<Document> ObjectItems = getObjectsFromDatabase(className, database, collection);
        ArrayList<Document> results = new ArrayList<>();

        results = ObjectItems.find(bson).into(new ArrayList<>());
        JsonNode actualObj = universalObjectMapper.readTree(mapper.writeValueAsString(results.get(0)));
        String jsonValue = actualObj.toString();
        Document d = Document.parse(jsonValue);
        return d;
    }

    public static ArrayList<Document> getObjectsSpecificListv2(String _cookie, MongoConfigurations mongoConf, Bson bson, Bson sort, int limit, String[] excludes, boolean checkRights) throws ClassNotFoundException, IOException {
        SerializableClass serializableClass = new SerializableClass();
        if (mongoConf.getPluginName() != null) {
            serializableClass = Core.getFields(mongoConf, _cookie);
        } else {
            serializableClass.setClassName(mongoConf.getClassName());
            serializableClass.convertFields(Arrays.asList(Class.forName(mongoConf.getClassName()).getDeclaredFields()));
        }

        List<String> columns = getDocumentPriveleges(Methods.get, _cookie, mongoConf, checkRights, serializableClass);

        if (excludes != null) {
            for (String exclude : excludes) {
                columns.remove(exclude);
            }
        }
        ArrayList<Document> results = new ArrayList<>();
        try {
            MongoCollection<Document> ObjectItems = DatabaseActions.getObjectsFromDatabase(mongoConf);
            results = ObjectItems.find(bson).sort(sort).limit(limit).projection(
                    and(fields(include(columns)), fields(exclude("_id")))
            ).into(new ArrayList<>());
        } catch (Exception e) {
            LOG.severe(e.getMessage());
            return results;
        }

        return results;
    }

    public static ArrayList<Document> getObjectsSpecificListv2(MongoConfigurations mongoConf, Bson bson, Bson sort, int limit, String[] excludes, List<String> columns) throws ClassNotFoundException {

        if (excludes != null) {
            for (String exclude : excludes) {
                columns.remove(exclude);
            }
        }
        ArrayList<Document> results = new ArrayList<>();
        try {
            MongoCollection<Document> ObjectItems = DatabaseActions.getObjectsFromDatabase(mongoConf);
            results = ObjectItems.find(bson).sort(sort).limit(limit).projection(fields(include(columns), exclude("_id"))).into(new ArrayList<>());

        } catch (Exception e) {
            LOG.severe(e.getMessage());
            return results;
        }

        return results;
    }

    public static ArrayList<Document> getObjectsRest(MongoConfigurations mongoConf, Bson bson, Bson sort, int limit, String[] excludes, List<String> columns, int rows, int page) throws ClassNotFoundException {

        if (excludes != null) {
            for (String exclude : excludes) {
                columns.remove(exclude);
            }
        }
        ArrayList<Document> results = new ArrayList<>();
        try {
            MongoCollection<Document> ObjectItems = DatabaseActions.getObjectsFromDatabase(mongoConf);
            results = ObjectItems.find(bson).sort(sort).skip(rows * (page - 1)).limit(limit).projection(
                    fields(include(columns))
            ).projection(fields(and(exclude("_id"), exclude(excludes)))).into(new ArrayList<>());
        } catch (ClassNotFoundException e) {
            LOG.severe(e.getMessage());
            return results;
        }

        return results;
    }

    public static long getObjectCount(MongoConfigurations mongoConf, Bson bson) {
        long count = 0;

        ArrayList<Document> results = new ArrayList<>();
        try {
            MongoCollection<Document> ObjectItems = DatabaseActions.getObjectsFromDatabase(mongoConf);
            count = ObjectItems.count(bson);
        } catch (ClassNotFoundException e) {
            LOG.severe(e.getMessage());
            return count;
        }

        return count;
    }

    public static Document addBackLogv2(MongoConfigurations _mongoConf, Object _document) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        Document document = Document.parse((mapper.writeValueAsString(_document)));
        Backlog backlog = new Backlog();
        backlog.setBacklogid(UUID.randomUUID().toString());
        backlog.setObject_type(_mongoConf.getClassName());
        backlog.setObject_id(document.getString(_mongoConf.getIdName()));
        backlog.setCreated_on(System.currentTimeMillis());
        backlog.setChanges(mapper.writeValueAsString(_document));
        return Document.parse(mapper.writeValueAsString(backlog));
    }

//    public static String patchText(Object _old, Object _patches) {
//        if (_old == null) {
//            _old = "";
//        }
//        if (_old.toString().matches("^[0-9A-Fa-f]+$")) {
//            try {
//                _old = new String(Hex.decodeHex(_old.toString()));
//            } catch (DecoderException ex) {
//                Logger.getLogger(DatabaseActions.class.getName()).log(Level.SEVERE, null, ex);
//            }
//        }
//
//        DiffMatchPatch dmp = new DiffMatchPatch();
//        LinkedList<DiffMatchPatch.Patch> patches = (LinkedList) dmp.patch_fromText(_patches.toString());
//        Object[] newDoc = dmp.patch_apply(patches, _old.toString());
//        return newDoc[0].toString();
//    }
//    public static String revertDMP(String currentText, String patch) {
//        DiffMatchPatch dmp = new DiffMatchPatch();
//        //List<DiffMatchPatch.Patch> invertedPatches = dmp.patch_deepCopy((LinkedList<DiffMatchPatch.Patch>) patches);
//        LinkedList<DiffMatchPatch.Patch> originalPatches = (LinkedList) dmp.patch_fromText(patch);
//        for (DiffMatchPatch.Patch p : originalPatches) {
//            for (Diff d : p.diffs) {
//                if (d.operation == Operation.DELETE) {
//                    d.operation = Operation.INSERT;
//                } else {
//                    if (d.operation == Operation.INSERT) {
//                        d.operation = Operation.DELETE;
//                    }
//                }
//            }
//        }
//        Object[] newDoc = dmp.patch_apply(originalPatches, currentText);
//        return newDoc[0].toString();
//    }
//    public static Document getObjectDifference(MongoConfigurations _mongoConf, Object original, Object revised) {
//        ObjectMapper mapper = new ObjectMapper();
//        Document document = null;
//        try {
//
//            Document oldDocDocument = Document.parse((mapper.writeValueAsString(original)));
//            Document newDocDocument = Document.parse((mapper.writeValueAsString(revised)));
//            //HashMap<String, Patch<String>> patches = new HashMap<>();
//
//            newDocDocument.forEach((k, v) -> {
//                try {
//                    gcmsObject mdmAnnotations = Class.forName(_mongoConf.getClassName()).getField(k).getAnnotation(gcmsObject.class);
//                    if (!mdmAnnotations.DMP()) {
//                        String originalEntry = "";
//                        if (newDocDocument.containsKey(k)) {
//                            originalEntry = oldDocDocument.get(k).toString();
//                        }
//                        if (v == null) {
//                            v = "";
//                        }
//
//                        List<String> originalList = Arrays.asList(originalEntry.split("(\\n|\\:|\\;)"));
//                        List<String> revisedList = Arrays.asList(v.toString().split("(\\n|\\:|\\;)"));
//                        List<String> originalList2 = Arrays.asList(originalEntry.split("(?<=\n|:|;)"));
//                        //patches.put(k, DiffUtils.diff(originalList, revisedList));
//                    }
//
//                } catch (ClassNotFoundException ex) {
//                    Logger.getLogger(DatabaseActions.class.getName()).log(Level.SEVERE, ex.getMessage());
//                } catch (NoSuchFieldException ex) {
//                    Logger.getLogger(DatabaseActions.class.getName()).log(Level.SEVERE, ex.getMessage());
//                } catch (SecurityException ex) {
//                    Logger.getLogger(DatabaseActions.class.getName()).log(Level.SEVERE, ex.getMessage());
//                }
//
//            });

//            HashMap<String, Patch<String>> registeredPatches = new HashMap<>();
//            patches.forEach((k, p) -> {
//                if (p.getDeltas().size() != 0) {
//                    registeredPatches.put(k, p);
//                }
//            });

//            String patchString = mapper.writeValueAsString(registeredPatches);
//            Document patchDocument = Document.parse((patchString));
//
//            Backlog backlog = new Backlog();
//            backlog.setBacklogid(UUID.randomUUID().toString());
//            backlog.setObject_type(_mongoConf.getClassName());
//            backlog.setObject_id(oldDocDocument.getString(_mongoConf.getIdName()));
//            backlog.setCreated_on(System.currentTimeMillis());
//            backlog.setChanges(mapper.writeValueAsString(patchDocument));
//            document = Document.parse(mapper.writeValueAsString(backlog));
//
//        } catch (JsonProcessingException ex) {
//            Logger.getLogger(DatabaseActions.class.getName()).log(Level.SEVERE, ex.getMessage());
//        } catch (NullPointerException ex) {
//            Logger.getLogger(DatabaseActions.class.getName()).log(Level.SEVERE, ex.getMessage());
//        }
//        return document;
//    }

    public static MongoConfigurations getBaseConfiguration() throws ClassNotFoundException, JsonProcessingException, IOException {
        ObjectMapper mapper = new ObjectMapper();
        MongoConfigurations mongoConf = null;
        BasicDBObject searchObject = new BasicDBObject();
        searchObject.put("name", new BasicDBObject("$eq", "mongoconfigurations"));
        Document d = DatabaseActions.getObject(Core.getProp("base.classname"), Core.getProp("base.database"), Core.getProp("base.collection"), searchObject);
        mongoConf = mapper.convertValue(d, MongoConfigurations.class);
        return mongoConf;
    }

    public static MongoConfigurations getCollection() throws ClassNotFoundException, JsonProcessingException, IOException {
        ObjectMapper mapper = new ObjectMapper();
        MongoConfigurations mongoConf = null;
        BasicDBObject searchObject = new BasicDBObject();
        searchObject.put("name", new BasicDBObject("$eq", "collections"));
        Document d = DatabaseActions.getObject(Core.getProp("collection.classname"), Core.getProp("collection.database"), Core.getProp("collection.collection"), searchObject);
        mongoConf = mapper.convertValue(d, MongoConfigurations.class);
        return mongoConf;
    }

    public static MongoConfigurations getMongoConfigurationByClassName(String _className) {
        MongoConfigurations mongoConf = null;
        try {
            BasicDBObject searchObject = new BasicDBObject();
            MongoConfigurations mongoConfigurations = getBaseConfiguration();
            searchObject.put("name", new BasicDBObject("$eq", _className));
            ArrayList<Document> results = DatabaseActions.getObjectsSpecificListv2(null, mongoConfigurations, searchObject, null, 1000, new String[]{}, false);
            if (results != null) {
                if (results.size() > 0) {
                    mongoConf = universalObjectMapper.convertValue(results.get(0), MongoConfigurations.class
                    );
                } else {
                    Logger.getLogger(DatabaseActions.class
                            .getName()).log(Level.SEVERE, "{0}Mongoconf not found!", searchObject.toString());
                }
            } else {
                Logger.getLogger(DatabaseActions.class
                        .getName()).log(Level.SEVERE, "Mongoconf is null!{0}", searchObject.toString());
            }
        } catch (JsonProcessingException | ClassNotFoundException ex) {
            Logger.getLogger(DatabaseActions.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException ex) {
            Logger.getLogger(DatabaseActions.class.getName()).log(Level.SEVERE, null, ex);
        }
        return mongoConf;
    }

    public static MongoConfigurations getMongoConfiguration(String _mongoConfigurationName) {
        MongoConfigurations mongoConf = null;
        try {
            //ObjectMapper mapper = new ObjectMapper();
            BasicDBObject searchObject = new BasicDBObject();
            searchObject.put("mongoconfigurationsid", new BasicDBObject("$eq", _mongoConfigurationName));
            MongoConfigurations mongoConfigurations = getBaseConfiguration();
            ArrayList<Document> results = DatabaseActions.getObjectsSpecificListv2(null, mongoConfigurations, searchObject, null, 1000, new String[]{}, false);
            if (results.size() < 1) {
                searchObject.remove("mongoconfigurationsid");
                searchObject.put("name", new BasicDBObject("$eq", _mongoConfigurationName));
                results = DatabaseActions.getObjectsSpecificListv2(null, mongoConfigurations, searchObject, null, 1000, new String[]{}, false);

            }
            if (results != null) {
                if (results.size() > 0) {
                    mongoConf = universalObjectMapper.convertValue(results.get(0), MongoConfigurations.class
                    );
                } else {
                    Logger.getLogger(DatabaseActions.class
                            .getName()).log(Level.SEVERE, "{0}Mongoconf not found!", searchObject.toString());
                }

            } else {
                Logger.getLogger(DatabaseActions.class
                        .getName()).log(Level.SEVERE, "Mongoconf is null!{0}", searchObject.toString());
            }
        } catch (JsonProcessingException | ClassNotFoundException ex) {
            Logger.getLogger(DatabaseActions.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException ex) {
            Logger.getLogger(DatabaseActions.class.getName()).log(Level.SEVERE, null, ex);
        }
        return mongoConf;
    }

    public static Document doQuery(String database, String query) {

        BasicDBObject q = BasicDBObject.parse(JSON.parse(query).toString());
        return databases.get(database).runCommand(q);
    }

    public static Command getCommand(String _commandId) throws ClassNotFoundException, IOException {
        MongoConfigurations commandConfiguration = DatabaseActions.getMongoConfiguration("commands");
        BasicDBObject searchObject = new BasicDBObject();
        searchObject.put("commandid", new BasicDBObject("$eq", _commandId));
        ArrayList<Document> commandDoc = DatabaseActions.getObjectsSpecificListv2(null, commandConfiguration, searchObject, null, 1, new String[0], false);
        sdm.gcms.GsonObjects.Core.Command commandObject = universalObjectMapper.convertValue(commandDoc.get(0), sdm.gcms.GsonObjects.Core.Command.class);
        return commandObject;
    }

    public static Method getMethod(String _methodName) throws ClassNotFoundException, IOException {
        MongoConfigurations commandConfiguration = DatabaseActions.getMongoConfiguration("methods");
        BasicDBObject searchObject = new BasicDBObject();
        searchObject.put("method", new BasicDBObject("$eq", _methodName));
        ArrayList<Document> commandDoc = DatabaseActions.getObjectsSpecificListv2(null, commandConfiguration, searchObject, null, 1, new String[0], false);
        Method method = universalObjectMapper.convertValue(commandDoc.get(0), Method.class);
        return method;
    }

}

class CronTask extends TimerTask {

    public CronTask() {
        //Some stuffs
    }

    @Override
    public void run() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            Actions action = DatabaseWrapper.getAction("loadchronjobs");
            if (action != null) {
                MongoConfigurations mongoConfiguration = DatabaseActions.getMongoConfiguration(action.mongoconfiguration);
                MongoConfigurations commandConfiguration = DatabaseActions.getMongoConfiguration("commands");
                if (mongoConfiguration != null) {
                    ArrayList<Document> jobs = DatabaseActions.getObjectsSpecificListv2(null, mongoConfiguration, new BasicDBObject(), null, 1000, new String[0], false);
                    if (jobs.size() > 0) {
                        for (int i = 0; i < jobs.size(); i++) {
                            boolean execute = false;
                            sdm.gcms.GsonObjects.Core.ChronJob chronJob = mapper.convertValue(jobs.get(i), sdm.gcms.GsonObjects.Core.ChronJob.class);
                            long currentTime = System.currentTimeMillis();
                            long lastExecution = chronJob.getLast();
                            if (currentTime - lastExecution > (Integer.parseInt(chronJob.getInterval()) * 60 * 1000)) {
                                for (String command : chronJob.getCommmands()) {
                                    sdm.gcms.GsonObjects.Core.Command commandObject = getCommand(command);
//                                    BasicDBObject searchObject = new BasicDBObject();
//                                    searchObject.put("commandid", new BasicDBObject("$eq", command));
//                                    ArrayList<Document> commandDoc = DatabaseActions.getObjectsSpecificListv2(null, commandConfiguration, searchObject, null, 1, new String[0], false);
//                                    gcms.GsonObjects.Core.Command commandObject = mapper.convertValue(commandDoc.get(0), gcms.GsonObjects.Core.Command.class);
                                    Map<String, String> commandParameters = mapper.readValue(commandObject.getParameters(), new TypeReference<Map<String, String>>() {
                                    });
                                    Map<String, String> convertedCommandParameters = commandParameters.entrySet().stream()
                                            .collect(Collectors.toMap(e -> (e.getKey()),
                                                    e -> (e.getValue())));
                                    Map<String, String> chronjobParameters = mapper.readValue(chronJob.getParameters(), new TypeReference<Map<String, String>>() {
                                    });
                                    Map<String, String> convertedChronjobParameters = chronjobParameters.entrySet().stream()
                                            .collect(Collectors.toMap(e -> (e.getKey()),
                                                    e -> (e.getValue())));
                                    convertedCommandParameters.putAll(convertedChronjobParameters);
                                    commandFunctions.doCommand(command, convertedCommandParameters, commandObject, null);
                                    chronJob.setLast(Instant.now().toEpochMilli());
                                    BasicDBObject obj = BasicDBObject.parse(mapper.writeValueAsString(chronJob));
                                    updateObjectItemv2(mongoConfiguration, obj);
                                }
                            }

                        }
                    }
                }
            }

        } catch (ClassNotFoundException ex) {
            Logger.getLogger(CronTask.class.getName()).log(Level.SEVERE, ex.getMessage());
        } catch (IOException ex) {
            Logger.getLogger(CronTask.class.getName()).log(Level.SEVERE, ex.getMessage());
        } catch (Exception ex) {
            Logger.getLogger(CronTask.class.getName()).log(Level.SEVERE, ex.getMessage());
        }
    }

}