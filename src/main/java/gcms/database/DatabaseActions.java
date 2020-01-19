/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.database;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
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
import java.util.stream.Stream;
import gcms.Config.MongoConf;
import gcms.Core;
import static gcms.Core.getUserRoles;
import gcms.DiffMatchPatch;
import gcms.DiffMatchPatch.Diff;
import gcms.DiffMatchPatch.Operation;
import gcms.GsonObjects.Core.MongoConfigurations;
import gcms.GsonObjects.Core.Backlog;
import gcms.GsonObjects.Core.FileObject;
import gcms.GsonObjects.Core.User;
import gcms.GsonObjects.annotations.MdmAnnotations;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;

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
            sb.append("-");
            sb.append(Core.getProperty("git.properties", "git.commit.id.abbrev"));
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
        LOG.info("One Session updated of total: " + getObjectCount(MongoConf.SESSION, new BasicDBObject()));
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
        //   DateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.ENGLISH);
        long now = Instant.now().toEpochMilli() / 1000;
        ObjectId fileId = null;

        try {
            GridFSBucket gridBucket = GridFSBuckets.create(DatabaseActions.getDatabase("files"));
            ObjectMapper mapper = new ObjectMapper();
            Document document = Document.parse(mapper.writeValueAsString(_fileobject));

            GridFSUploadOptions uploadOptions = new GridFSUploadOptions().chunkSizeBytes(1024).metadata(document);
            fileId = gridBucket.uploadFromStream(name, inputStream, uploadOptions);

        } catch (Exception e) {
            e.printStackTrace();

        }

    }

    public static String downloadFileToTemp(String _fileName, String _cookie, String _contextPath, boolean _publicPage) {
        System.out.println("Calling download..");
        String outputPath = gcms.Core.getTempDir(_cookie, _contextPath) + _fileName;
        if (_publicPage) {
            if (Core.checkDir(_contextPath + "/public/")) {
                outputPath = _contextPath + "/public/" + _fileName;
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
        return gcms.Core.getTempDirWebUrl(_cookie) + _fileName;
    }

    //FILEOBJECT METHODS
    static private MongoCollection<FileObject> getFileObjects() {
        MongoCollection<FileObject> fileObjects = databases.get("lcms")
                .getCollection("fileobjects", FileObject.class);
        return fileObjects;
    }

    public static ArrayList<FileObject> getFileObjectList(String _cookie) throws ClassNotFoundException {
        List<String> columns = getDocumentPriveleges("view", _cookie, "gcms.GsonObjects.Other.FileObject");
        ArrayList<FileObject> results = null;
        try {
            MongoCollection<FileObject> fileObjects = getFileObjects();

            results = fileObjects.find().projection(
                    fields(include(columns))
            ).into(new ArrayList<FileObject>());
        } catch (Exception e) {
            LOG.severe(e.getMessage());
            return results;
        }
        return results;
    }

    public static void insertFileObject(FileObject _fileObject) {
        getFileObjects().insertOne(_fileObject);
        LOG.info("One fileobject inserted of total: " + getFileObjects().count());
    }

    //ALGEMENE METHODS
    public static ArrayList<Document> getPrivelegeFilteredDocuments(String _cookie, String _className, String _docName) throws ClassNotFoundException {
        ArrayList<Document> results = null;
        List<String> columns = getDocumentPriveleges("view", _cookie, _className);

        results = databases.get("lcms").getCollection(_docName).find().projection(
                fields(include(columns))
        ).into(new ArrayList<Document>());
        return results;
    }

    public static List<String> getDocumentPriveleges(String _privelegeType, String _cookie, String _className) throws ClassNotFoundException {
        Class cls = Class.forName(_className);
        List<Field> fields = Arrays.asList(cls.getDeclaredFields());
        List<String> userRoles = new ArrayList<>();
        List<String> columns = new ArrayList<>();

        if (cls.getName().equals("MongoConfigurations") || cls.getName().equals("Actions")) {
            columns = fields.stream()
                    .map(result -> result.getName())
                    .collect(Collectors.toList());
        } else {
            if (_cookie != null) {
                userRoles = getUserRoles(_cookie);

            }
//            else {
//                userRoles.add("ADMIN");
//            }

            for (Field field : fields) {

                MdmAnnotations mdmAnnotations = field.getAnnotation(MdmAnnotations.class
                );

                if (mdmAnnotations != null) {
                    String role = "";
                    int roleVal = 2;
                    if (_privelegeType.equals("view")) {
                        role = mdmAnnotations.viewRole();
                        roleVal = mdmAnnotations.minimumViewRoleVal();
                    } else if (_privelegeType.equals("edit")) {
                        role = mdmAnnotations.editRole();
                        roleVal = mdmAnnotations.minimumEditRoleVal();
                    } else if (_privelegeType.equals("create")) {
                        role = mdmAnnotations.createRole();
                        roleVal = mdmAnnotations.minimumCreateRoleVal();
                    }
                    ;
                    for (String userRole : userRoles) {

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
        }

        return columns;
    }

    //ALGEMENE NIET-SPECIFIEKE OBJECT METHODEN
    public static MongoCollection<Document> getObjects(MongoConf mongoConf) throws ClassNotFoundException {
        MongoCollection<Document> results = null;
        //Class cls = Class.forName(_className);
        Class cls = Class.forName(mongoConf.getClassName());
        results = databases.get(mongoConf.getDatabase()).getCollection(mongoConf.getCollection(), cls);
        return results;
    }

    public static MongoCollection<Document> getObjectsv2(MongoConfigurations mongoConf) throws ClassNotFoundException {
        MongoCollection<Document> results = null;
        Class cls = Class.forName(mongoConf.className);
        results = databases.get(mongoConf.database).getCollection(mongoConf.collection, cls);
        return results;
    }

    public static void insertObjectItem(MongoConf mongoConf, Document _doc) throws ClassNotFoundException {
        getObjects(mongoConf).insertOne(_doc);
        LOG.info("One Object inserted of total: " + getObjectCount(mongoConf, new BasicDBObject()));
    }

    public static void insertObjectItemv2(MongoConfigurations mongoConf, Document _doc) throws ClassNotFoundException {
        getObjectsv2(mongoConf).insertOne(_doc);
        LOG.info("One Object inserted");
    }

    public static void updateObjectItem(MongoConf mongoConf, BasicDBObject _bson) throws ClassNotFoundException {
        Bson newDocument = new Document("$set", _bson);
        getObjects(mongoConf).findOneAndUpdate(and(eq(mongoConf.getIdName(), _bson.get(mongoConf.getIdName()))), newDocument, (new FindOneAndUpdateOptions()).upsert(true));
        LOG.info("One Object updated of total: " + getObjectCount(mongoConf, new BasicDBObject()));
    }

    public static void updateObjectItemv2(MongoConfigurations mongoConf, BasicDBObject _bson) throws ClassNotFoundException {
        Bson newDocument = new Document("$set", _bson);
        getObjectsv2(mongoConf).findOneAndUpdate(and(eq(mongoConf.getIdName(), _bson.get(mongoConf.getIdName()))), newDocument, (new FindOneAndUpdateOptions()).upsert(true));
        LOG.info("One Object updated");
    }

    public static Document getObject(MongoConf mongoConf, String id) throws ClassNotFoundException, JsonProcessingException {
        Document doc = null;
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode jsonData = mapper.createObjectNode();

        MongoCollection<Document> ObjectItems = getObjects(mongoConf);

        //doc.keySet()
        ArrayList<Document> results = null;
        //results = ObjectItems.find().into(new ArrayList<Document>());
        results = ObjectItems.find(and(eq(mongoConf.getIdName(), id))).into(new ArrayList<Document>());

        Document d = Document.parse(mapper.writeValueAsString(results.get(0)));

        return d;
    }

    public static Document getObjectv2(MongoConfigurations mongoConf, String id) throws ClassNotFoundException, JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        MongoCollection<Document> ObjectItems = getObjectsv2(mongoConf);
        ArrayList<Document> results = null;
        results = ObjectItems.find(and(eq(mongoConf.getIdName(), id))).into(new ArrayList<Document>());
        Document d = Document.parse(mapper.writeValueAsString(results.get(0)));
        return d;
    }

    public static ArrayList<Document> getObjectsList(String _cookie, MongoConf mongoConf) throws ClassNotFoundException {

        List<String> columns = getDocumentPriveleges("view", _cookie, mongoConf.getClassName());
        ArrayList<Document> results = null;
        try {
            MongoCollection<Document> ObjectItems = getObjects(mongoConf);
            //    ObjectItems.deleteMany(exists("userid"));

            results = ObjectItems.find().projection(
                    fields(include(columns))
            ).into(new ArrayList<Document>());
        } catch (Exception e) {
            LOG.severe(e.getMessage());
            return results;
        }
        return results;
    }

    public static ArrayList<Document> getObjectsList(String _cookie, MongoConf mongoConf, List<String> columns) throws ClassNotFoundException {

        ArrayList<Document> results = null;
        try {
            MongoCollection<Document> ObjectItems = getObjects(mongoConf);
            //    ObjectItems.deleteMany(exists("userid"));

            results = ObjectItems.find().projection(
                    fields(include(columns))
            ).into(new ArrayList<Document>());
        } catch (Exception e) {
            LOG.severe(e.getMessage());
            return results;
        }
        return results;
    }

    public static ArrayList<Document> getObjectsListv2(String _cookie, MongoConfigurations mongoConf, List<String> columns) throws ClassNotFoundException {

        ArrayList<Document> results = null;
        try {
            MongoCollection<Document> ObjectItems = getObjectsv2(mongoConf);
            //    ObjectItems.deleteMany(exists("userid"));

            results = ObjectItems.find().projection(
                    fields(include(columns))
            ).into(new ArrayList<Document>());
        } catch (Exception e) {
            LOG.severe(e.getMessage());
            return results;
        }
        return results;
    }

    public static ArrayList<Document> getObjectsSpecificList(String _cookie, MongoConf mongoConf, Bson bson, Bson sort, int limit, String[] excludes) throws ClassNotFoundException {

        List<String> columns = getDocumentPriveleges("view", _cookie, mongoConf.getClassName());
        if (excludes != null) {
            for (String exclude : excludes) {
                columns.remove(exclude);
            }
        }
        ArrayList<Document> results = null;
        try {
            MongoCollection<Document> ObjectItems = getObjects(mongoConf);
            results = ObjectItems.find(bson).sort(sort).limit(limit).projection(
                    fields(include(columns))
            ).into(new ArrayList<Document>());

        } catch (Exception e) {
            LOG.severe(e.getMessage());
            return results;
        }

        return results;
    }

    public static ArrayList<Document> getObjectsSpecificListv2(String _cookie, MongoConfigurations mongoConf, Bson bson, Bson sort, int limit, String[] excludes) throws ClassNotFoundException {

        List<String> columns = getDocumentPriveleges("view", _cookie, mongoConf.getClassName());
        if (excludes != null) {
            for (String exclude : excludes) {
                columns.remove(exclude);
            }
        }
        ArrayList<Document> results = null;
        try {
            MongoCollection<Document> ObjectItems = getObjectsv2(mongoConf);
            results = ObjectItems.find(bson).sort(sort).limit(limit).projection(
                    fields(include(columns))
            ).into(new ArrayList<Document>());

        } catch (Exception e) {
            LOG.severe(e.getMessage());
            return results;
        }

        return results;
    }

    public static ArrayList<Document> getObjectsSpecificFields(String _cookie, MongoConf mongoConf, Bson bson, Bson sort, int limit, List<String> columns) throws ClassNotFoundException {

        ArrayList<Document> results = null;
        try {
            MongoCollection<Document> ObjectItems = getObjects(mongoConf);
            results = ObjectItems.find(bson).sort(sort).limit(limit).projection(
                    fields(include(columns))
            ).into(new ArrayList<Document>());

        } catch (Exception e) {
            LOG.severe(e.getMessage());
            return results;
        }

        return results;
    }

    //NIEUWE METHODE
    //OBJECT OTHER METHODS
    public static Long getObjectCount(MongoConf mongoConf, Bson bson) throws ClassNotFoundException {
        MongoCollection<Document> results = null;
        Class cls = Class.forName(mongoConf.getClassName());
        results = databases.get(mongoConf.getDatabase()).getCollection(mongoConf.getCollection(), cls);
        return results.count(bson);
    }

    public static ArrayList<Document> getObjectSpecific(MongoConf mongoConf, Bson bson) throws ClassNotFoundException {
        Document doc = null;
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode jsonData = mapper.createObjectNode();

        MongoCollection<Document> ObjectItems = getObjects(mongoConf);

        //doc.keySet()
        ArrayList<Document> results = null;
        //results = ObjectItems.find().into(new ArrayList<Document>());
        results = ObjectItems.find(bson).into(new ArrayList<Document>());

        //Document d = Document.parse(mapper.writeValueAsString(results.get(0)));
        return results;
    }

    public static Document addBackLog(MongoConf _mongoConf, Object _document) throws JsonProcessingException {
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
        DiffMatchPatch dmp = new DiffMatchPatch();
        LinkedList<DiffMatchPatch.Patch> patches = (LinkedList) dmp.patch_fromText(_patches.toString());
        Object[] newDoc = dmp.patch_apply(patches, _old.toString());
        return newDoc[0].toString();
    }

    public static String revertDMP(String currentText, String patch) {
        Document document = null;
        DiffMatchPatch dmp = new DiffMatchPatch();
        StringBuilder reversePatch = new StringBuilder();
        //List<DiffMatchPatch.Patch> invertedPatches = dmp.patch_deepCopy((LinkedList<DiffMatchPatch.Patch>) patches);
        LinkedList<DiffMatchPatch.Patch> originalPatches = (LinkedList) dmp.patch_fromText(patch.toString());

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

    public static Document getObjectDifference(MongoConf mongoConf, Object original, Object revised) {
        ObjectMapper mapper = new ObjectMapper();
        Document document = null;
        try {

            Document oldDocDocument = Document.parse((mapper.writeValueAsString(original)));
            Document newDocDocument = Document.parse((mapper.writeValueAsString(revised)));
            HashMap<String, Patch<String>> patches = new HashMap<>();

            newDocDocument.forEach((k, v) -> {
                try {
                    MdmAnnotations mdmAnnotations = Class.forName(mongoConf.getClassName()).getField(k).getAnnotation(MdmAnnotations.class);
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
                    Logger.getLogger(DatabaseActions.class.getName()).log(Level.SEVERE, null, ex);
                } catch (NoSuchFieldException ex) {
                    Logger.getLogger(DatabaseActions.class.getName()).log(Level.SEVERE, null, ex);
                } catch (SecurityException ex) {
                    Logger.getLogger(DatabaseActions.class.getName()).log(Level.SEVERE, null, ex);
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
            backlog.setObject_type(mongoConf.getClassName());
            backlog.setObject_id(oldDocDocument.getString(mongoConf.getIdName()));
            backlog.setCreated_on(System.currentTimeMillis());
            backlog.setChanges(mapper.writeValueAsString(patchDocument));
            document = Document.parse(mapper.writeValueAsString(backlog));

        } catch (JsonProcessingException ex) {
            Logger.getLogger(DatabaseActions.class.getName()).log(Level.SEVERE, null, ex);
        } catch (NullPointerException ex) {
            Logger.getLogger(DatabaseActions.class.getName()).log(Level.SEVERE, null, ex);
        }
        return document;
    }

    public static MongoConfigurations getMongoConfiguration(String _mongoConfigurationName) throws ClassNotFoundException {
        ObjectMapper mapper = new ObjectMapper();
        MongoConfigurations mongoConf;
        BasicDBObject searchObject = new BasicDBObject();
        searchObject.put("mongoconfigurationsid", new BasicDBObject("$eq", _mongoConfigurationName));
        ArrayList<Document> results = DatabaseActions.getObjectsSpecificList("", MongoConf.MONGOCONFIGURATIONS, searchObject, null, 1000, new String[]{});
        if (results.size() < 1) {
            searchObject.remove("mongoconfigurationsid");
            searchObject.put("name", new BasicDBObject("$eq", _mongoConfigurationName));
            results = DatabaseActions.getObjectsSpecificList("", MongoConf.MONGOCONFIGURATIONS, searchObject, null, 1000, new String[]{});
        }
        mongoConf = mapper.convertValue(results.get(0), MongoConfigurations.class);
        return mongoConf;
    }
}
