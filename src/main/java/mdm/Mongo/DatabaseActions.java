/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm.Mongo;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mongodb.BasicDBObject;
<<<<<<< HEAD
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
import mdm.GsonObjects.Session;
import static org.bson.codecs.configuration.CodecRegistries.fromProviders;
import static org.bson.codecs.configuration.CodecRegistries.fromRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.codecs.pojo.PojoCodecProvider;
import static com.mongodb.client.model.Filters.*;
import com.mongodb.client.model.FindOneAndUpdateOptions;
import static com.mongodb.client.model.Projections.fields;
import static com.mongodb.client.model.Projections.include;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.lang.reflect.Field;
import java.time.Instant;
import java.util.Arrays;
import java.util.logging.Level;
import mdm.Config.MongoConf;
import static mdm.Core.getUserRoles;

import mdm.GsonObjects.Lab.Instrument;
import mdm.GsonObjects.Lab.InventoryItem;
import mdm.GsonObjects.Note;
import mdm.GsonObjects.Other.FileObject;
import mdm.GsonObjects.Other.ICTTicket;

import mdm.GsonObjects.User;
import mdm.GsonObjects.View;
import mdm.pojo.annotations.MdmAnnotations;
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

    //GETLIST METHODS
    static public String getListAsString(String object, String _cookie) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        String result = "";
        if (object.equals("User")) {
            result = mapper.writeValueAsString(getUserList());
        }
        if (object.equals("Instrument")) {
            result = mapper.writeValueAsString(getInstrumentList());
        }
        if (object.equals("ICTTicket")) {
            try {
                result = mapper.writeValueAsString(getICTTicketList(_cookie));
            } catch (ClassNotFoundException ex) {
                Logger.getLogger(DatabaseActions.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return result;
    }

    //VIEW METHODS
    static private MongoCollection<View> getViews() {
        MongoCollection<View> views = databases.get("lcms")
                .getCollection("views", View.class);
        return views;

    }

    static public View getView(String _id) {
        View view = null;
        if (checkConnection("users")) {
            try {
                MongoCollection<View> views = getViews();
                FindIterable it = views.find(and(eq("id", _id)));
                ArrayList<View> results = new ArrayList();
                it.into(results);
                for (View entry : results) {
                    view = (View) entry;
                }
                return view;
            } catch (Exception e) {
                LOG.severe(e.getMessage());
            }
        }
        return view;
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

    public static void updateSession(Session session) {
        Bson newDocument = new Document("$set", session);
        getSessions().findOneAndUpdate(and(eq("sessionID", session.getSessionID())), newDocument);
        LOG.info("One Session updated of total: " + getICTTickets().count());
    }

    static public Session getSession(String _sessionId) {
        Session session = null;
        if (checkConnection("users")) {
            try {
                MongoCollection<Session> sessions = getSessions();

                session = sessions.find(and(eq("sessionID", _sessionId), eq("valid", true))).first();
            } catch (Exception e) {
                LOG.severe(e.getMessage());
            }
        }
        return session;
    }

    static public void editSessionValidity(String _sessionId, long _validity) {

        if (checkConnection("users")) {
            if ((mdm.Core.checkSession(_sessionId))) {
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

    public static ArrayList<User> getUserList() {
        ArrayList<User> results = null;
        try {
            MongoCollection<User> users = getUsers();
            FindIterable it = users.find();
            results = new ArrayList();
            it.into(results);
        } catch (Exception e) {
            LOG.severe(e.getMessage());
            return results;
        }
        return results;
    }

    public static void insertUser(User _user) {
        getUsers().insertOne(_user);
        LOG.info("One instrument inserted of total: " + getUsers().count());
    }

    public static void updateUser(User _user) {

        Bson newDocument = new Document("$set", _user);
        getUsers().findOneAndUpdate(and(eq("userid", _user.getUserid())), newDocument);

        LOG.info("One instrument updated of total: " + getUsers().count());
    }

    //NOTES METHODS
    static private MongoCollection<Note> getNotes() {
        MongoCollection<Note> notes = databases.get("lcms")
                .getCollection("notes", Note.class);
        return notes;

    }

    public static void insertNote(Note note) {
        getNotes().insertOne(note);
        LOG.info("One note inserted of total: " + getNotes().count());
    }

    public static void updateNote(String _user, String _docid, String _content) {
        BasicDBObject obj = new BasicDBObject();
        obj.put("content", _content);
        obj.put("edited", Instant.now().toEpochMilli() / 1000);
        Bson newDocument = new Document("$set", obj);

        _docid = _docid.substring(7);
        getNotes().findOneAndUpdate(and(eq("docid", _docid), eq("author", _user)), newDocument);

        LOG.info("One note updated of total: " + getNotes().count());
    }

    static public Note getNote(String _author, String _id) {
        Note note = null;
        ArrayList<Note> results = null;
        if (checkConnection("users")) {
            try {
                MongoCollection<Note> notes = getNotes();

                //Document query = new Document();
                //query.append("docid", _id);
                FindIterable it = notes.find(eq("docid", _id));

                results = new ArrayList();
                it.into(results);
                for (Note entry : results) {
                    note = (Note) entry;
                }
            } catch (Exception e) {
                LOG.severe(e.getMessage());
            }
        }
        return note;
    }

    public static ArrayList<Note> getNotes(String _author) {
        ArrayList<Note> results = null;
        try {
            MongoCollection<Note> notes = getNotes();

//            notes.deleteMany(eq("author", _author));
//            notes.drop();
//                    notes = databases.get("lcms")
//                .getCollection("notes", Note.class);
            //FindIterable it = notes.find(and(eq("author", _author)));
            FindIterable it = notes.find(and(eq("author", _author)));
            results = new ArrayList();
            it.into(results);
//            for (Note entry : results) {
//                entry.setContent("");
//                results.add((Note) entry);
//            }
        } catch (Exception e) {
            LOG.severe(e.getMessage());
        }
        return results;
    }

    public static ArrayList<Note> getNoteList(String _author) {
        ArrayList<Note> results = null;
        try {
            MongoCollection<Note> notes = getNotes();
            FindIterable it = notes.find(and(eq("author", _author))).sort(new Document("title", 1));
            results = new ArrayList();
            it.into(results);
        } catch (Exception e) {
            LOG.severe(e.getMessage());
        }
        return results;
    }

    public static void updateNote(Note _note, String _user) {
        //BasicDBObject obj = new BasicDBObject();
        //obj.put("content", _content);
        //obj.put("edited", Instant.now().toEpochMilli() / 1000);
        Bson newDocument = new Document("$set", _note);

        //_docid = _docid.substring(7);
        getNotes().findOneAndUpdate(and(eq("docid", _note.getDocid()), eq("author", _user)), newDocument);

        LOG.info("One note updated of total: " + getNotes().count());
    }

    //INSTRUMENT METHODS
    static private MongoCollection<Instrument> getInstruments() {
        MongoCollection<Instrument> instruments = databases.get("lcms")
                .getCollection("instruments", Instrument.class);
        return instruments;

    }

    public static void insertInstrument(Instrument _instrument) {
        getInstruments().insertOne(_instrument);
        LOG.info("One instrument inserted of total: " + getInstruments().count());
    }

    public static void updateInstrument(Instrument _instrument) {
        BasicDBObject obj = new BasicDBObject();
//        Iterator it = _fields.entrySet().iterator();
//        while (it.hasNext()) {
//            Map.Entry pair = (Map.Entry) it.next();
//            
//            obj.put(pair.getKey().toString(), pair.getValue());
//            it.remove(); // avoids a ConcurrentModificationException
//        }
        Bson newDocument = new Document("$set", _instrument);
        getInstruments().findOneAndUpdate(and(eq("instid", _instrument.getInstid())), newDocument);

        LOG.info("One instrument updated of total: " + getInstruments().count());
    }

    public static ArrayList<Instrument> getInstrumentList() {
        ArrayList<Instrument> results = null;
        try {
            MongoCollection<Instrument> instruments = getInstruments();
            FindIterable it = instruments.find();
            results = new ArrayList();
            it.into(results);
        } catch (Exception e) {
            LOG.severe(e.getMessage());
            return results;
        }
        return results;
    }

    //ICTTICKET METHODS
    static private MongoCollection<ICTTicket> getICTTickets() {
        MongoCollection<ICTTicket> ICTTickets = databases.get("lcms")
                .getCollection("ICTTickets", ICTTicket.class);
        return ICTTickets;

    }

    public static void insertICTTicket(ICTTicket _ticket) {
        getICTTickets().insertOne(_ticket);
        LOG.info("One ICTTicket inserted of total: " + getICTTickets().count());
    }

    public static void updateICTTicket(ICTTicket _ticket) {
        Bson newDocument = new Document("$set", _ticket);
        getICTTickets().findOneAndUpdate(and(eq("ticketid", _ticket.getTicketid())), newDocument);

        LOG.info("One ICTTicket updated of total: " + getICTTickets().count());
    }

    public static ArrayList<ICTTicket> getICTTicketList(String _cookie) throws ClassNotFoundException {
        //controle adhv rollen
        List<String> columns = getDocumentPriveleges("view", _cookie, "mdm.GsonObjects.Other.ICTTicket");
        ArrayList<ICTTicket> results = null;
        ArrayList<Document> results2 = null;
        //ArrayList<HashMap> returnValue = new ArrayList<>();
        try {
            MongoCollection<ICTTicket> ICTTickets = getICTTickets();

            results = ICTTickets.find().projection(
                    fields(include(columns))
            ).into(new ArrayList<ICTTicket>());

            results2 = databases.get("lcms").getCollection("ICTTickets").find().projection(
                    fields(include(columns))
            ).into(new ArrayList<Document>());

            //FindIterable it = ICTTickets.find();
            //results = new ArrayList();
            //it.into(results);
        } catch (Exception e) {
            LOG.severe(e.getMessage());
            return results;
        }
        return results;
    }

    //INVENTORY METHODS
    static private MongoCollection<InventoryItem> getIventoryItems() {
        MongoCollection<InventoryItem> IventoryItems = databases.get("lcms")
                .getCollection("IventoryItems", InventoryItem.class);
        return IventoryItems;

    }

    public static void insertInventoryItem(InventoryItem _item) {
        getIventoryItems().insertOne(_item);
        LOG.info("One InventoryItem inserted of total: " + getIventoryItems().count());
    }

    public static void updateInventoryItem(InventoryItem _item) {
        Bson newDocument = new Document("$set", _item);
        getIventoryItems().findOneAndUpdate(and(eq("itemid", _item.getItemid())), newDocument);

        LOG.info("One InventoryItem updated of total: " + getIventoryItems().count());
    }

    public static ArrayList<InventoryItem> getInventoryItemList(String _cookie) throws ClassNotFoundException {
        //controle adhv rollen
        List<String> columns = getDocumentPriveleges("view", _cookie, "mdm.GsonObjects.Other.InventoryItem");
        ArrayList<InventoryItem> results = null;
        ArrayList<Document> results2 = null;
        //ArrayList<HashMap> returnValue = new ArrayList<>();
        try {
            MongoCollection<InventoryItem> IventoryItems = getIventoryItems();

            results = IventoryItems.find().projection(
                    fields(include(columns))
            ).into(new ArrayList<InventoryItem>());

            results2 = databases.get("lcms").getCollection("IventoryItems").find().projection(
                    fields(include(columns))
            ).into(new ArrayList<Document>());

            //FindIterable it = IventoryItems.find();
            //results = new ArrayList();
            //it.into(results);
        } catch (Exception e) {
            LOG.severe(e.getMessage());
            return results;
        }
        return results;
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

    public static String downloadFileToTemp(String _fileName, String _cookie, String _contextPath) {
        System.out.println("Calling download..");
        String outputPath = mdm.Core.getTempDir(_cookie, _contextPath) + _fileName;
        try {
            MongoDatabase database = databases.get("files");
            GridFSBucket gridBucket = GridFSBuckets.create(database);

            FileOutputStream fileOutputStream = new FileOutputStream(outputPath);
            gridBucket.downloadToStream(_fileName, fileOutputStream);

            fileOutputStream.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
        return mdm.Core.getTempDirWebUrl(_cookie) + _fileName;
    }

    //FILEOBJECT METHODS
    static private MongoCollection<FileObject> getFileObjects() {
        MongoCollection<FileObject> fileObjects = databases.get("lcms")
                .getCollection("fileobjects", FileObject.class);
        return fileObjects;
    }

    public static ArrayList<FileObject> getFileObjectList(String _cookie) throws ClassNotFoundException {
        List<String> columns = getDocumentPriveleges("view", _cookie, "mdm.GsonObjects.Other.FileObject");
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

        if (_cookie != null) {
            userRoles = getUserRoles(_cookie);

        } else {
            userRoles.add("ADMIN");
        }

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
                        if (mdm.Config.Roles.valueOf(userRole).getLevelCode() >= roleVal) {
                            columns.add(field.getName());
                            break;
                        }
                    } else {
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

    //EXPERIMENTEEL
    public static MongoCollection<Document> getObjects(MongoConf mongoConf) throws ClassNotFoundException {
        MongoCollection<Document> results = null;
        //Class cls = Class.forName(_className);
        Class cls = Class.forName(mongoConf.getClassName());
        results = databases.get(mongoConf.getDatabase()).getCollection(mongoConf.getCollection(), cls);
        return results;
    }

    public static void insertObjectItem(MongoConf mongoConf, Document _doc) throws ClassNotFoundException {

        getObjects(mongoConf).insertOne(_doc);
        LOG.info("One Object inserted of total: " + getIventoryItems().count());
    }

    public static void updateObjectItem(MongoConf mongoConf, BasicDBObject _bson) throws ClassNotFoundException {
        Bson newDocument = new Document("$set", _bson);
        Object oldDocument = getObjects(mongoConf).find(and(eq(mongoConf.getIdName(), _bson.get(mongoConf.getIdName())))).first();
        getObjectDifference(oldDocument, _bson);
        getObjects(mongoConf).findOneAndUpdate(and(eq(mongoConf.getIdName(), _bson.get(mongoConf.getIdName()))), newDocument, (new FindOneAndUpdateOptions()).upsert(true));

        //   getObjects(mongoConf).findOneAndUpdate(and(eq(mongoConf.getIdName(), _bson.get(mongoConf.getIdName()))), _bson);
        LOG.info("One Object updated of total: " + getIventoryItems().count());
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

    public static ArrayList<Document> getObjectsSpecificList(String _cookie, MongoConf mongoConf, Bson bson) throws ClassNotFoundException {

        List<String> columns = getDocumentPriveleges("view", _cookie, mongoConf.getClassName());
        Document doc = null;
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode jsonData = mapper.createObjectNode();
        MongoCollection<Document> ObjectItems = getObjects(mongoConf);
        ArrayList<Document> results = null;
        results = ObjectItems.find(bson).projection(
                fields(include(columns))
        ).into(new ArrayList<Document>());

        return results;
    }

    public static ArrayList<Document> getObjectsSpecificList(String _cookie, MongoConf mongoConf, Bson bson, Bson sort) throws ClassNotFoundException {

        List<String> columns = getDocumentPriveleges(_cookie, "view", mongoConf.getClassName());
        Document doc = null;
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode jsonData = mapper.createObjectNode();
        MongoCollection<Document> ObjectItems = getObjects(mongoConf);
        ArrayList<Document> results = null;
        results = ObjectItems.find(bson).sort(sort).projection(
                fields(include(columns))
        ).into(new ArrayList<Document>());

        return results;
    }

    public static ArrayList<Document> getObjectsSpecificList(String _cookie, MongoConf mongoConf, Bson bson, Bson sort, int limit) throws ClassNotFoundException {

        List<String> columns = getDocumentPriveleges(_cookie, "view", mongoConf.getClassName());
        Document doc = null;
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode jsonData = mapper.createObjectNode();
        MongoCollection<Document> ObjectItems = getObjects(mongoConf);
        ArrayList<Document> results = null;
        results = ObjectItems.find(bson).sort(sort).limit(limit).projection(
                fields(include(columns))
        ).into(new ArrayList<Document>());

        return results;
    }

    //OBJECT OTHER METHODS
    public static Long getObjectCount(MongoConf mongoConf, Bson bson) throws ClassNotFoundException {
        MongoCollection<Document> results = null;
        //Class cls = Class.forName(_className);
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

    public static void getObjectDifference(Object oldDocObject, Object newDocObject) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            String oldDocString = mapper.writeValueAsString(oldDocObject);
            Document oldDocDocument = Document.parse((oldDocString));
            List<String> oldDocStringList = new ArrayList<>();
            String newDocString = mapper.writeValueAsString(newDocObject);
            Document newDocDocument = Document.parse((newDocString));
            List<String> newDocStringList = new ArrayList<>();

            oldDocDocument.forEach((k, v) -> {
                oldDocStringList.add(k + " -> " + v);
            });
            newDocDocument.forEach((k, v) -> {
                newDocStringList.add(k + " -> " + v);
            });

            
            
        } catch (JsonProcessingException ex) {
            Logger.getLogger(DatabaseActions.class.getName()).log(Level.SEVERE, null, ex);
        }
=======
import com.mongodb.Block;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientOptions;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.MongoIterable;
import com.mongodb.client.gridfs.GridFSBucket;
import com.mongodb.client.gridfs.GridFSBuckets;
import com.mongodb.client.gridfs.model.GridFSFile;
import com.mongodb.client.gridfs.model.GridFSUploadOptions;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import mdm.GsonObjects.Session;
import static org.bson.codecs.configuration.CodecRegistries.fromProviders;
import static org.bson.codecs.configuration.CodecRegistries.fromRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.codecs.pojo.PojoCodecProvider;
import static com.mongodb.client.model.Filters.*;
import com.mongodb.client.model.FindOneAndUpdateOptions;
import static com.mongodb.client.model.Projections.fields;
import static com.mongodb.client.model.Projections.include;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.lang.reflect.Field;
import java.time.Instant;
import java.util.Arrays;
import java.util.Optional;
import java.util.logging.Level;
import jdk.internal.dynalink.MonomorphicCallSite;
import mdm.Core;
import mdm.Core.MongoConf;
import static mdm.Core.getUserRoles;
import mdm.GsonObjects.Lab.Instrument;
import mdm.GsonObjects.Lab.InventoryItem;
import mdm.GsonObjects.Note;
import mdm.GsonObjects.Other.FileObject;
import mdm.GsonObjects.Other.ICTTicket;

import mdm.GsonObjects.User;
import mdm.GsonObjects.View;
import mdm.pojo.annotations.MdmAnnotations;
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

    //GETLIST METHODS
    static public String getListAsString(String object, String _cookie) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        String result = "";
        if (object.equals("User")) {
            result = mapper.writeValueAsString(getUserList());
        }
        if (object.equals("Instrument")) {
            result = mapper.writeValueAsString(getInstrumentList());
        }
        if (object.equals("ICTTicket")) {
            try {
                result = mapper.writeValueAsString(getICTTicketList(_cookie));
            } catch (ClassNotFoundException ex) {
                Logger.getLogger(DatabaseActions.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return result;
    }

    //VIEW METHODS
    static private MongoCollection<View> getViews() {
        MongoCollection<View> views = databases.get("lcms")
                .getCollection("views", View.class);
        return views;

    }

    static public View getView(String _id) {
        View view = null;
        if (checkConnection("users")) {
            try {
                MongoCollection<View> views = getViews();
                FindIterable it = views.find(and(eq("id", _id)));
                ArrayList<View> results = new ArrayList();
                it.into(results);
                for (View entry : results) {
                    view = (View) entry;
                }
                return view;
            } catch (Exception e) {
                LOG.severe(e.getMessage());
            }
        }
        return view;
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

    public static void updateSession(Session session) {
        Bson newDocument = new Document("$set", session);
        getSessions().findOneAndUpdate(and(eq("sessionID", session.getSessionID())), newDocument);
        LOG.info("One Session updated of total: " + getICTTickets().count());
    }

    static public Session getSession(String _sessionId) {
        Session session = null;
        if (checkConnection("users")) {
            try {
                MongoCollection<Session> sessions = getSessions();

                session = sessions.find(and(eq("sessionID", _sessionId), eq("valid", true))).first();
            } catch (Exception e) {
                LOG.severe(e.getMessage());
            }
        }
        return session;
    }

    static public void editSessionValidity(String _sessionId, long _validity) {

        if (checkConnection("users")) {
            if ((Core.checkSession(_sessionId))) {
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

    public static ArrayList<User> getUserList() {
        ArrayList<User> results = null;
        try {
            MongoCollection<User> users = getUsers();
            FindIterable it = users.find();
            results = new ArrayList();
            it.into(results);
        } catch (Exception e) {
            LOG.severe(e.getMessage());
            return results;
        }
        return results;
    }

    public static void insertUser(User _user) {
        getUsers().insertOne(_user);
        LOG.info("One instrument inserted of total: " + getUsers().count());
    }

    public static void updateUser(User _user) {

        Bson newDocument = new Document("$set", _user);
        getUsers().findOneAndUpdate(and(eq("userid", _user.getUserid())), newDocument);

        LOG.info("One instrument updated of total: " + getUsers().count());
    }

    //NOTES METHODS
    static private MongoCollection<Note> getNotes() {
        MongoCollection<Note> notes = databases.get("lcms")
                .getCollection("notes", Note.class);
        return notes;

    }

    public static void insertNote(Note note) {
        getNotes().insertOne(note);
        LOG.info("One note inserted of total: " + getNotes().count());
    }

    public static void updateNote(String _user, String _docid, String _content) {
        BasicDBObject obj = new BasicDBObject();
        obj.put("content", _content);
        obj.put("edited", Instant.now().toEpochMilli() / 1000);
        Bson newDocument = new Document("$set", obj);

        _docid = _docid.substring(7);

        getNotes().findOneAndUpdate(and(eq("docid", _docid), eq("author", _user)), newDocument);

        LOG.info("One note updated of total: " + getNotes().count());
    }

    static public Note getNote(String _author, String _id) {
        Note note = null;
        ArrayList<Note> results = null;
        if (checkConnection("users")) {
            try {
                MongoCollection<Note> notes = getNotes();

                //Document query = new Document();
                //query.append("docid", _id);
                FindIterable it = notes.find(eq("docid", _id));

                results = new ArrayList();
                it.into(results);
                for (Note entry : results) {
                    note = (Note) entry;
                }
            } catch (Exception e) {
                LOG.severe(e.getMessage());
            }
        }
        return note;
    }

    public static ArrayList<Note> getNotes(String _author) {
        ArrayList<Note> results = null;
        try {
            MongoCollection<Note> notes = getNotes();

//            notes.deleteMany(eq("author", _author));
//            notes.drop();
//                    notes = databases.get("lcms")
//                .getCollection("notes", Note.class);
            //FindIterable it = notes.find(and(eq("author", _author)));
            FindIterable it = notes.find(and(eq("author", _author)));
            results = new ArrayList();
            it.into(results);
//            for (Note entry : results) {
//                entry.setContent("");
//                results.add((Note) entry);
//            }
        } catch (Exception e) {
            LOG.severe(e.getMessage());
        }
        return results;
    }

    public static ArrayList<Note> getNoteList(String _author) {
        ArrayList<Note> results = null;
        try {
            MongoCollection<Note> notes = getNotes();
            FindIterable it = notes.find(and(eq("author", _author))).sort(new Document("title", 1));
            results = new ArrayList();
            it.into(results);
        } catch (Exception e) {
            LOG.severe(e.getMessage());
        }
        return results;
    }

    public static void updateNote(Note _note, String _user) {
        //BasicDBObject obj = new BasicDBObject();
        //obj.put("content", _content);
        //obj.put("edited", Instant.now().toEpochMilli() / 1000);
        Bson newDocument = new Document("$set", _note);

        //_docid = _docid.substring(7);
        getNotes().findOneAndUpdate(and(eq("docid", _note.getDocid()), eq("author", _user)), newDocument);

        LOG.info("One note updated of total: " + getNotes().count());
    }

    //INSTRUMENT METHODS
    static private MongoCollection<Instrument> getInstruments() {
        MongoCollection<Instrument> instruments = databases.get("lcms")
                .getCollection("instruments", Instrument.class);
        return instruments;

    }

    public static void insertInstrument(Instrument _instrument) {
        getInstruments().insertOne(_instrument);
        LOG.info("One instrument inserted of total: " + getInstruments().count());
    }

    public static void updateInstrument(Instrument _instrument) {
        BasicDBObject obj = new BasicDBObject();
//        Iterator it = _fields.entrySet().iterator();
//        while (it.hasNext()) {
//            Map.Entry pair = (Map.Entry) it.next();
//            
//            obj.put(pair.getKey().toString(), pair.getValue());
//            it.remove(); // avoids a ConcurrentModificationException
//        }
        Bson newDocument = new Document("$set", _instrument);
        getInstruments().findOneAndUpdate(and(eq("instid", _instrument.getInstid())), newDocument);

        LOG.info("One instrument updated of total: " + getInstruments().count());
    }

    public static ArrayList<Instrument> getInstrumentList() {
        ArrayList<Instrument> results = null;
        try {
            MongoCollection<Instrument> instruments = getInstruments();
            FindIterable it = instruments.find();
            results = new ArrayList();
            it.into(results);
        } catch (Exception e) {
            LOG.severe(e.getMessage());
            return results;
        }
        return results;
    }

    //ICTTICKET METHODS
    static private MongoCollection<ICTTicket> getICTTickets() {
        MongoCollection<ICTTicket> ICTTickets = databases.get("lcms")
                .getCollection("ICTTickets", ICTTicket.class);
        return ICTTickets;

    }

    public static void insertICTTicket(ICTTicket _ticket) {
        getICTTickets().insertOne(_ticket);
        LOG.info("One ICTTicket inserted of total: " + getICTTickets().count());
    }

    public static void updateICTTicket(ICTTicket _ticket) {
        Bson newDocument = new Document("$set", _ticket);
        getICTTickets().findOneAndUpdate(and(eq("ticketid", _ticket.getTicketid())), newDocument);

        LOG.info("One ICTTicket updated of total: " + getICTTickets().count());
    }

    public static ArrayList<ICTTicket> getICTTicketList(String _cookie) throws ClassNotFoundException {
        //controle adhv rollen
        List<String> columns = getDocumentPriveleges("view", _cookie, "mdm.GsonObjects.Other.ICTTicket");
        ArrayList<ICTTicket> results = null;
        ArrayList<Document> results2 = null;
        //ArrayList<HashMap> returnValue = new ArrayList<>();
        try {
            MongoCollection<ICTTicket> ICTTickets = getICTTickets();

            results = ICTTickets.find().projection(
                    fields(include(columns))
            ).into(new ArrayList<ICTTicket>());

            results2 = databases.get("lcms").getCollection("ICTTickets").find().projection(
                    fields(include(columns))
            ).into(new ArrayList<Document>());

            //FindIterable it = ICTTickets.find();
            //results = new ArrayList();
            //it.into(results);
        } catch (Exception e) {
            LOG.severe(e.getMessage());
            return results;
        }
        return results;
    }

    //INVENTORY METHODS
    static private MongoCollection<InventoryItem> getIventoryItems() {
        MongoCollection<InventoryItem> IventoryItems = databases.get("lcms")
                .getCollection("IventoryItems", InventoryItem.class);
        return IventoryItems;

    }

    public static void insertInventoryItem(InventoryItem _item) {
        getIventoryItems().insertOne(_item);
        LOG.info("One InventoryItem inserted of total: " + getIventoryItems().count());
    }

    public static void updateInventoryItem(InventoryItem _item) {
        Bson newDocument = new Document("$set", _item);
        getIventoryItems().findOneAndUpdate(and(eq("itemid", _item.getItemid())), newDocument);

        LOG.info("One InventoryItem updated of total: " + getIventoryItems().count());
    }

    public static ArrayList<InventoryItem> getInventoryItemList(String _cookie) throws ClassNotFoundException {
        //controle adhv rollen
        List<String> columns = getDocumentPriveleges("view", _cookie, "mdm.GsonObjects.Other.InventoryItem");
        ArrayList<InventoryItem> results = null;
        ArrayList<Document> results2 = null;
        //ArrayList<HashMap> returnValue = new ArrayList<>();
        try {
            MongoCollection<InventoryItem> IventoryItems = getIventoryItems();

            results = IventoryItems.find().projection(
                    fields(include(columns))
            ).into(new ArrayList<InventoryItem>());

            results2 = databases.get("lcms").getCollection("IventoryItems").find().projection(
                    fields(include(columns))
            ).into(new ArrayList<Document>());

            //FindIterable it = IventoryItems.find();
            //results = new ArrayList();
            //it.into(results);
        } catch (Exception e) {
            LOG.severe(e.getMessage());
            return results;
        }
        return results;
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

    public static String downloadFileToTemp(String _fileName, String _cookie, String _contextPath) {
        System.out.println("Calling download...");
        String outputPath = mdm.Core.getTempDir(_cookie, _contextPath) + _fileName;
        try {
            MongoDatabase database = databases.get("files");
            GridFSBucket gridBucket = GridFSBuckets.create(database);

            FileOutputStream fileOutputStream = new FileOutputStream(outputPath);
            gridBucket.downloadToStream(_fileName, fileOutputStream);

            fileOutputStream.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
        return Core.getTempDirWebUrl(_cookie) + _fileName;
    }

    //FILEOBJECT METHODS
    static private MongoCollection<FileObject> getFileObjects() {
        MongoCollection<FileObject> fileObjects = databases.get("lcms")
                .getCollection("fileobjects", FileObject.class);
        return fileObjects;
    }

    public static ArrayList<FileObject> getFileObjectList(String _cookie) throws ClassNotFoundException {
        List<String> columns = getDocumentPriveleges("view", _cookie, "mdm.GsonObjects.Other.FileObject");
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

        if (_cookie != null) {
            userRoles = getUserRoles(_cookie);

        } else {
            userRoles.add("ADMIN");
        }

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
                        if (Core.Roles.valueOf(userRole).getLevelCode() >= roleVal) {
                            columns.add(field.getName());
                            break;
                        }
                    } else {
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

    //EXPERIMENTEEL
    public static MongoCollection<Document> getObjects(MongoConf mongoConf) throws ClassNotFoundException {
        MongoCollection<Document> results = null;
        //Class cls = Class.forName(_className);
        Class cls = Class.forName(mongoConf.getClassName());
        results = databases.get(mongoConf.getDatabase()).getCollection(mongoConf.getCollection(), cls);
        return results;
    }

    public static void insertObjectItem(MongoConf mongoConf, Document _doc) throws ClassNotFoundException {

        getObjects(mongoConf).insertOne(_doc);
        LOG.info("One Object inserted of total: " + getIventoryItems().count());
    }

    public static void updateObjectItem(MongoConf mongoConf, BasicDBObject _bson) throws ClassNotFoundException {
        Bson newDocument = new Document("$set", _bson);

        getObjects(mongoConf).findOneAndUpdate(and(eq(mongoConf.getIdName(), _bson.get(mongoConf.getIdName()))), newDocument, (new FindOneAndUpdateOptions()).upsert(true));

        //   getObjects(mongoConf).findOneAndUpdate(and(eq(mongoConf.getIdName(), _bson.get(mongoConf.getIdName()))), _bson);
        LOG.info("One Object updated of total: " + getIventoryItems().count());
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

    //OBJECT OTHER METHODS
    public static Long getObjectCount(MongoConf mongoConf, Bson bson) throws ClassNotFoundException {
        MongoCollection<Document> results = null;
        //Class cls = Class.forName(_className);
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
>>>>>>> origin/master
    }

}
