/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.database;

import com.fasterxml.jackson.core.JsonParser;
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
import gcms.GsonObjects.Core.Session;
import static org.bson.codecs.configuration.CodecRegistries.fromProviders;
import static org.bson.codecs.configuration.CodecRegistries.fromRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.codecs.pojo.PojoCodecProvider;
import static com.mongodb.client.model.Filters.*;
import com.mongodb.client.model.FindOneAndUpdateOptions;
import static com.mongodb.client.model.Projections.exclude;
import static com.mongodb.client.model.Projections.fields;
import static com.mongodb.client.model.Projections.include;
import difflib.DiffUtils;
import difflib.Patch;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Field;
import java.time.Instant;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.UUID;
import java.util.logging.Level;
import java.util.stream.Collectors;
import gcms.Core;
import static gcms.Core.getUserRoles;
import static gcms.Core.universalObjectMapper;
import gcms.modules.DiffMatchPatch;
import gcms.modules.DiffMatchPatch.Diff;
import gcms.modules.DiffMatchPatch.Operation;
import gcms.GsonObjects.Core.MongoConfigurations;
import gcms.GsonObjects.Core.Backlog;
import gcms.GsonObjects.Core.FileObject;
import gcms.GsonObjects.Core.Rights;
import gcms.GsonObjects.Core.User;
import gcms.GsonObjects.Other.SerializableClass;
import gcms.GsonObjects.Other.SerializableField;
import gcms.modules.commandFunctions;
import static gcms.database.DatabaseActions.updateObjectItemv2;
import java.util.Timer;
import java.util.TimerTask;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import gcms.GsonObjects.annotations.gcmsObject;

/**
 *
 * @author matmey
 */
public class DatabaseActions {

    static MongoClient mongo;
    static Map<String, MongoDatabase> databases = new HashMap<>();

    private static final Logger LOG = Logger.getLogger(DatabaseActions.class.getName());
    static CodecRegistry pojoCodecRegistry = fromRegistries(MongoClient.getDefaultCodecRegistry(),
            fromProviders(PojoCodecProvider.builder().automatic(true).build()));

    public static void connect() {

        mongo = new MongoClient("localhost",
                MongoClientOptions.builder().codecRegistry(pojoCodecRegistry).build());

    }

    public static void createDatabaseMap() {

        if (databases.get("users") == null) {
            //mongo.dropDatabase("users");
            databases.put("users", openOrCreateDB("users"));
        }
        if (databases.get("lcms") == null) {
            databases.put("lcms", openOrCreateDB("lcms"));
        }
        if (databases.get("files") == null) {
            databases.put("files", openOrCreateDB("files"));
        }
        if (databases.get("history") == null) {
            databases.put("history", openOrCreateDB("history"));
        }
        if (databases.get("backlog") == null) {
            databases.put("backlog", openOrCreateDB("backlog"));
        }

    }

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
            if ((gcms.Core.checkSession(_sessionId))) {
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
        String outputPath = gcms.Core.getTempDir(_cookie, _contextPath) + _fileName;
        String trimmedOutputPath = "./HTML/other/files/" + _cookie + "/" + _fileName;
        if (_publicPage) {
            if (Core.checkDir(_contextPath + "/public/")) {
                outputPath = _contextPath + "/public/" + _fileName;
                trimmedOutputPath = "./HTML/other/files" + "/public/" + _fileName;
            }
        }

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

    public static ArrayList<Document> getRightsFromDatabase(String table, String field) throws ClassNotFoundException {
        MongoConfigurations mongoConfiguration = DatabaseActions.getMongoConfiguration("rights");
        BasicDBObject searchObject = new BasicDBObject();
        searchObject.put("table", new BasicDBObject("$eq", table));
        searchObject.put("field", new BasicDBObject("$eq", field));
        Class cls = Class.forName(mongoConfiguration.getClassName());
        List<Field> fields = Arrays.asList(cls.getDeclaredFields());
        List<String> fieldnames = new ArrayList<>();
        for (Field f : fields) {
            fieldnames.add(f.getName());
        }
        ArrayList<Document> rightsDoc = DatabaseActions.getObjectsSpecificListv2(mongoConfiguration, searchObject, new BasicDBObject(), 1, null, fieldnames);
        if (rightsDoc.size() > 0) {
            try {
                LOG.log(Level.INFO, "Found custom rights{0}", Core.universalObjectMapper.writeValueAsString(rightsDoc));
            } catch (JsonProcessingException ex) {
                Logger.getLogger(DatabaseActions.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return rightsDoc;
    }

    public static List<String> getDocumentPriveleges(String _privelegeType, String _cookie, MongoConfigurations _mongoConf, boolean checkRights) throws ClassNotFoundException {
        List<String> columns = new ArrayList<>();
        try {

            Class cls = Class.forName(_mongoConf.getClassName());
            String collection = _mongoConf.name;
            columns = getPriveleges(_privelegeType, _cookie, checkRights, cls, collection);

        } catch (JsonProcessingException ex) {
            Logger.getLogger(DatabaseActions.class.getName()).log(Level.SEVERE, null, ex);
        }
        return columns;
    }

    public static List<String> getDocumentPriveleges(String _privelegeType, String _cookie, MongoConfigurations _mongoConf, boolean checkRights, SerializableClass serializableClass) throws ClassNotFoundException {
        List<String> columns = new ArrayList<>();
        try {
            if (_mongoConf.getPluginName() != null) {
                columns = getPriveleges(_privelegeType, _cookie, false, _mongoConf, serializableClass);
            } else {
                Class cls = Class.forName(_mongoConf.getClassName());
                String collection = _mongoConf.name;
                columns = getPriveleges(_privelegeType, _cookie, checkRights, cls, collection);
            }

        } catch (JsonProcessingException ex) {
            Logger.getLogger(DatabaseActions.class.getName()).log(Level.SEVERE, null, ex);
        }
        return columns;
    }

    public static List<String> getPriveleges(String _privelegeType, String _cookie, boolean checkRights, MongoConfigurations _mongoConf, SerializableClass serializableClass) throws ClassNotFoundException, JsonProcessingException {
        List<String> columns = new ArrayList<>();
        if (_mongoConf.getClassName().equals("MongoConfigurations") || _mongoConf.getClassName().equals("Actions")) {
            columns = serializableClass.getFields().stream()
                    .map(result -> result.getName())
                    .collect(Collectors.toList());
        } else {
            for (SerializableField field : serializableClass.getFields()) {
                gcmsObject mdmAnnotations = null;//field.getAnnotation();                
                if (checkRights) {
                    ArrayList<Document> rights = getRightsFromDatabase(_mongoConf.getName(), field.getName());
                    columns.addAll(getColumnsFromAnnotations(_cookie, mdmAnnotations, _privelegeType, field, serializableClass.getFields()));
                } else {
                    columns.add(field.getName());
                }
            }
        }
        return columns;
    }

    public static List<String> getPriveleges(String _privelegeType, String _cookie, boolean checkRights, Class cls, String collection) throws ClassNotFoundException, JsonProcessingException {
        List<String> columns = new ArrayList<>();
        List<Field> fields = Arrays.asList(cls.getDeclaredFields());
        if (cls.getName().equals("MongoConfigurations") || cls.getName().equals("Actions")) {
            columns = fields.stream()
                    .map(result -> result.getName())
                    .collect(Collectors.toList());
        } else {
            for (Field field : fields) {
                gcmsObject mdmAnnotations = field.getAnnotation(gcmsObject.class
                );
                if (checkRights) {
                    ArrayList<Document> rights = getRightsFromDatabase(collection, field.getName());
                    columns.addAll(getColumnsFromAnnotations(_cookie, mdmAnnotations, _privelegeType, field, fields));

                } else {
                    columns.add(field.getName());
                }
            }
        }
        return columns;
    }

    public static List<String> getPrivelegedColumns(ArrayList<Document> rights, List<Field> fields, String _cookie) {
        List<String> columns = new ArrayList<>();
        List<String> userRoles = getUserRoles(_cookie);
        for (int i = 0; i < rights.size(); i++) {
            Rights rightsObject = universalObjectMapper.convertValue(rights.get(0), gcms.GsonObjects.Core.Rights.class);

        }

        return columns;
    }

    public static List<String> getColumnsFromAnnotations(String _cookie, gcmsObject mdmAnnotations, String _privelegeType, Field field, List<Field> fields) {
        List<String> columns = new ArrayList<>();
        List<String> userRoles;

        if (mdmAnnotations != null) {
            String role = "";
            int roleVal = 2;
            if (_privelegeType.equals("view")) {
                role = mdmAnnotations.viewRole();
                roleVal = mdmAnnotations.minimumViewRoleVal(); //2
            } else if (_privelegeType.equals("edit")) {
                role = mdmAnnotations.editRole();
                roleVal = mdmAnnotations.minimumEditRoleVal(); //2
            } else if (_privelegeType.equals("create")) {
                role = mdmAnnotations.createRole();
                roleVal = mdmAnnotations.minimumCreateRoleVal(); //2
            }
            if (_cookie != null) {
                userRoles = getUserRoles(_cookie);
                for (String userRole : userRoles) { //Loop over user roles
                    if (role.equals("")) {
                        if (gcms.Config.Roles.valueOf(userRole).getLevelCode() >= roleVal) {
                            columns.add(field.getName());
                            break;
                        }
                    } else {
                        if (role.startsWith("@")) {
                            String roleName = role.substring(1);
                            String referencedField = fields.stream()
                                    .filter(r -> r.getName().equals(roleName.substring(1)))
                                    .findFirst()
                                    .toString();
                            if (getSession(_cookie).getUsername().equals(referencedField)) {
                                columns.add(field.getName());
                            }
                        }

                        if (userRole.equals(role)) {
                            columns.add(field.getName());
                            break;
                        }
                    }
                }
            }
        }
        return columns;
    }

    public static List<String> getColumnsFromAnnotations(String _cookie, gcmsObject mdmAnnotations, String _privelegeType, SerializableField field, List<SerializableField> fields) {
        List<String> columns = new ArrayList<>();
        List<String> userRoles;

        if (mdmAnnotations != null) {
            String role = "";
            int roleVal = 2;
            if (_privelegeType.equals("view")) {
                role = mdmAnnotations.viewRole();
                roleVal = mdmAnnotations.minimumViewRoleVal(); //2
            } else if (_privelegeType.equals("edit")) {
                role = mdmAnnotations.editRole();
                roleVal = mdmAnnotations.minimumEditRoleVal(); //2
            } else if (_privelegeType.equals("create")) {
                role = mdmAnnotations.createRole();
                roleVal = mdmAnnotations.minimumCreateRoleVal(); //2
            }
            if (_cookie != null) {
                userRoles = getUserRoles(_cookie);
                for (String userRole : userRoles) { //Loop over user roles
                    if (role.equals("")) {
                        if (gcms.Config.Roles.valueOf(userRole).getLevelCode() >= roleVal) {
                            columns.add(field.getName());
                            break;
                        }
                    } else {
                        if (role.startsWith("@")) {
                            String roleName = role.substring(1);
                            String referencedField = fields.stream()
                                    .filter(r -> r.getName().equals(roleName.substring(1)))
                                    .findFirst()
                                    .toString();
                            if (getSession(_cookie).getUsername().equals(referencedField)) {
                                columns.add(field.getName());
                            }
                        }

                        if (userRole.equals(role)) {
                            columns.add(field.getName());
                            break;
                        }
                    }
                }
            }
        }
        return columns;
    }

    public static MongoCollection<Document> getObjectsFromDatabase(MongoConfigurations mongoConf) throws ClassNotFoundException {
        MongoCollection<Document> results = null;
        //Class cls = Class.forName(mongoConf.className);
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
        ArrayList<Document> results = null;

        results = ObjectItems.find(bson).into(new ArrayList<>());
        JsonNode actualObj = Core.universalObjectMapper.readTree(mapper.writeValueAsString(results.get(0)));
        String jsonValue = actualObj.toString();
        Document d = Document.parse(jsonValue);
        return d;
    }

    public static ArrayList<Document> getObjectsSpecificListv2(String _cookie, MongoConfigurations mongoConf, Bson bson, Bson sort, int limit, String[] excludes, boolean checkRights) throws ClassNotFoundException {

        List<String> columns = getDocumentPriveleges("view", _cookie, mongoConf, checkRights);
        if (excludes != null) {
            for (String exclude : excludes) {
                columns.remove(exclude);
            }
        }
        ArrayList<Document> results = null;
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
        ArrayList<Document> results = null;
        try {
            MongoCollection<Document> ObjectItems = DatabaseActions.getObjectsFromDatabase(mongoConf);
            results = ObjectItems.find(bson).sort(sort).limit(limit).projection(
                    fields(include(columns))
            ).projection(fields(exclude("_id"))).into(new ArrayList<>());
        } catch (Exception e) {
            LOG.severe(e.getMessage());
            return results;
        }

        return results;
    }
  
//    public static ArrayList<Document> getObjectsSpecificFieldsv2(MongoConfigurations mongoConf, Bson bson, Bson sort, int limit, List<String> columns) throws ClassNotFoundException {
//
//        ArrayList<Document> results = null;
//        try {
//            MongoCollection<Document> ObjectItems = DatabaseActions.getObjectsFromDatabase(mongoConf);
//            results = ObjectItems.find(bson).sort(sort).limit(limit).projection(
//                    fields(include(columns))
//            ).projection(fields(exclude("_id"))).into(new ArrayList<>());
//
//        } catch (Exception e) {
//            LOG.severe(e.getMessage());
//            return results;
//        }
//
//        return results;
//    }

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

    public static String patchText(Object _old, Object _patches) {
        if (!_old.toString().matches("^[0-9A-Fa-f]+$")) {
            // _old = Hex.encodeHexString(_old.toString().getBytes());
        }

        DiffMatchPatch dmp = new DiffMatchPatch();
        LinkedList<DiffMatchPatch.Patch> patches = (LinkedList) dmp.patch_fromText(_patches.toString());
        Object[] newDoc = dmp.patch_apply(patches, _old.toString());
        return newDoc[0].toString();
    }

    public static String revertDMP(String currentText, String patch) {
        DiffMatchPatch dmp = new DiffMatchPatch();
        //List<DiffMatchPatch.Patch> invertedPatches = dmp.patch_deepCopy((LinkedList<DiffMatchPatch.Patch>) patches);
        LinkedList<DiffMatchPatch.Patch> originalPatches = (LinkedList) dmp.patch_fromText(patch);
        for (DiffMatchPatch.Patch p : originalPatches) {
            for (Diff d : p.diffs) {
                if (d.operation == Operation.DELETE) {
                    d.operation = Operation.INSERT;
                } else {
                    if (d.operation == Operation.INSERT) {
                        d.operation = Operation.DELETE;
                    }
                }
            }
        }
        Object[] newDoc = dmp.patch_apply(originalPatches, currentText);
        return newDoc[0].toString();
    }

    public static Document getObjectDifference(MongoConfigurations _mongoConf, Object original, Object revised) {
        ObjectMapper mapper = new ObjectMapper();
        Document document = null;
        try {

            Document oldDocDocument = Document.parse((mapper.writeValueAsString(original)));
            Document newDocDocument = Document.parse((mapper.writeValueAsString(revised)));
            HashMap<String, Patch<String>> patches = new HashMap<>();

            newDocDocument.forEach((k, v) -> {
                try {
                    gcmsObject mdmAnnotations = Class.forName(_mongoConf.getClassName()).getField(k).getAnnotation(gcmsObject.class);
                    if (!mdmAnnotations.DMP()) {
                        String originalEntry = "";
                        if (newDocDocument.containsKey(k)) {
                            originalEntry = oldDocDocument.get(k).toString();
                        }
                        if (v == null) {
                            v = "";
                        }
                        //Eigenschap van het object ophalen adhv de key (attribuutnaam) en mongoconf.
                        //indien het veld een veld is die eigenschap "x" heeft, dan passen we de diff match patch toe.
                        //aan het origineel document worden de patches toegepast.
                        //dan wordt het document opgeslaan.

                        List<String> originalList = Arrays.asList(originalEntry.split("(\\n|\\:|\\;)"));
                        List<String> revisedList = Arrays.asList(v.toString().split("(\\n|\\:|\\;)"));
                        List<String> originalList2 = Arrays.asList(originalEntry.split("(?<=\n|:|;)"));
                        patches.put(k, DiffUtils.diff(originalList, revisedList));
                    }

                } catch (ClassNotFoundException ex) {
                    Logger.getLogger(DatabaseActions.class.getName()).log(Level.SEVERE, ex.getMessage());
                } catch (NoSuchFieldException ex) {
                    Logger.getLogger(DatabaseActions.class.getName()).log(Level.SEVERE, ex.getMessage());
                } catch (SecurityException ex) {
                    Logger.getLogger(DatabaseActions.class.getName()).log(Level.SEVERE, ex.getMessage());
                }

            });

            HashMap<String, Patch<String>> registeredPatches = new HashMap<>();
            patches.forEach((k, p) -> {
                if (p.getDeltas().size() != 0) {
                    registeredPatches.put(k, p);
                }
            });

            String patchString = mapper.writeValueAsString(registeredPatches);
            Document patchDocument = Document.parse((patchString));

            Backlog backlog = new Backlog();
            backlog.setBacklogid(UUID.randomUUID().toString());
            backlog.setObject_type(_mongoConf.getClassName());
            backlog.setObject_id(oldDocDocument.getString(_mongoConf.getIdName()));
            backlog.setCreated_on(System.currentTimeMillis());
            backlog.setChanges(mapper.writeValueAsString(patchDocument));
            document = Document.parse(mapper.writeValueAsString(backlog));

        } catch (JsonProcessingException ex) {
            Logger.getLogger(DatabaseActions.class.getName()).log(Level.SEVERE, ex.getMessage());
        } catch (NullPointerException ex) {
            Logger.getLogger(DatabaseActions.class.getName()).log(Level.SEVERE, ex.getMessage());
        }
        return document;
    }

    public static MongoConfigurations getBaseConfiguration() throws ClassNotFoundException, JsonProcessingException, IOException {
        ObjectMapper mapper = new ObjectMapper();
        MongoConfigurations mongoConf = null;
        BasicDBObject searchObject = new BasicDBObject();
        searchObject.put("name", new BasicDBObject("$eq", "mongoconfigurations"));
        Document d = DatabaseActions.getObject(Core.getProp("base.classname"), Core.getProp("base.database"), Core.getProp("base.collection"), searchObject);
        mongoConf = mapper.convertValue(d, MongoConfigurations.class);
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
                    mongoConf = Core.universalObjectMapper.convertValue(results.get(0), MongoConfigurations.class
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
}

class CronTask extends TimerTask {

    public CronTask() {
        //Some stuffs
    }

    @Override
    public void run() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            gcms.GsonObjects.Core.Actions action = DatabaseWrapper.getAction("loadchronjobs");
            if (action != null) {
                MongoConfigurations mongoConfiguration = DatabaseActions.getMongoConfiguration(action.mongoconfiguration);
                MongoConfigurations commandConfiguration = DatabaseActions.getMongoConfiguration("commands");
                if (mongoConfiguration != null) {
                    ArrayList<Document> jobs = DatabaseActions.getObjectsSpecificListv2(null, mongoConfiguration, new BasicDBObject(), null, 1000, new String[0], false);
                    if (jobs.size() > 0) {
                        for (int i = 0; i < jobs.size(); i++) {
                            boolean execute = false;
                            gcms.GsonObjects.Core.ChronJob chronJob = mapper.convertValue(jobs.get(i), gcms.GsonObjects.Core.ChronJob.class);
                            long currentTime = System.currentTimeMillis();
                            long lastExecution = chronJob.getLast();
                            if (currentTime - lastExecution > (Integer.parseInt(chronJob.getInterval()) * 60 * 1000)) {
                                for (String command : chronJob.getCommmands()) {
                                    BasicDBObject searchObject = new BasicDBObject();
                                    searchObject.put("commandid", new BasicDBObject("$eq", command));
                                    ArrayList<Document> commandDoc = DatabaseActions.getObjectsSpecificListv2(null, commandConfiguration, searchObject, null, 1, new String[0], false);
                                    gcms.GsonObjects.Core.Command commandObject = mapper.convertValue(commandDoc.get(0), gcms.GsonObjects.Core.Command.class);
                                    Map<String, String> commandParameters = mapper.readValue(commandObject.getParameters(), new TypeReference<Map<String, String>>() {
                                    });
                                    Map<String, String[]> convertedCommandParameters = commandParameters.entrySet().stream()
                                            .collect(Collectors.toMap(e -> (e.getKey()),
                                                    e -> (new String[]{e.getValue()})));
                                    Map<String, String> chronjobParameters = mapper.readValue(chronJob.getParameters(), new TypeReference<Map<String, String>>() {
                                    });
                                    Map<String, String[]> convertedChronjobParameters = chronjobParameters.entrySet().stream()
                                            .collect(Collectors.toMap(e -> (e.getKey()),
                                                    e -> (new String[]{e.getValue()})));
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
