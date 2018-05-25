/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.MapType;
import com.fasterxml.jackson.databind.type.TypeFactory;
import difflib.Delta;
import difflib.DiffUtils;
import difflib.Patch;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.lang.reflect.Field;
import java.net.URL;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.Scanner;
import java.util.stream.Collectors;
import mdm.GsonObjects.Session;
import mdm.GsonObjects.User;
import mdm.Mongo.DatabaseActions;
import mdm.pojo.annotations.MdmAnnotations;

/**
 *
 * @author matmey
 */
public class Core {

    public enum Roles {
        ADMIN(100), QCMANAGER(50), ICTMANAGER(49), LABASSISTANT(4), SECRETARY(3), DRIVER(2), GUEST(1), ROLE3(48);
        private final int levelCode;

        Roles(int levelCode) {
            this.levelCode = levelCode;
        }

        public int getLevelCode() {
            return this.levelCode;
        }
    }   
    

    public enum Actions {
        //CREDENTIAL RELATED
        CREDENTIALS_LOGIN, LOAD, CREDENTIALS_CHECKCREDENTIALS, CREDENTIALS_USERINFO, CREDENTIALS_LOGOUT,
        //ADMIN RELATED
        ADMIN_LOADPAGE, ADMIN_LOADOBJECTS, ADMIN_EDITOBJECTS, ADMIN_LOADUSERS, ADMIN_EDITUSERS,
        //OBJECT RELATED
        NEWOBJECT, LOADOBJECTS,
        //USER RELATED
        USER_CREATEUSER,
        //NOTES RELATED
        AUTOSAVE, LISTNOTES, CREATENOTE, GETNOTE, SAVENOTE, NOTE_LOADNOTES, NOTE_EDITNOTES, NOTE_GETNOTE, NOTE_SAVENOTE,
        //LAB RELATED
        LAB_LOADLAB, LAB_LOADINSTRUMENTS, LAB_EDITINSTRUMENTS,
        //QCMANAGER RELATED
        QC_GETLOTINFO, QC_CHANGELOTINFO, QC_ADDLOTINFO, QC_CHANGETESTINFO, QC_GETTESTINFO,
        //ICT RELATED
        ICT_LOADTICKETS, ICT_EDITTICKETS,
        //FILE RELATED
        FILE_UPLOAD, FILE_BROWSE, FILE_DOWNLOADTEMP,
        //TAKS RELATED
        TASKS_LOADTASKS, TASKS_EDITTASKS
    }

    public enum MongoConf {
        USERS("users", "users", "mdm.GsonObjects.User", "userid"),
        ICTTICKETS("lcms", "ICTTickets", "mdm.GsonObjects.Other.ICTTicket", "ticketid"),
        INSTRUMENTS("lcms", "instrument", "mdm.GsonObjects.Lab.Instrument", "instid"),
        NOTES("lcms", "notes", "mdm.GsonObjects.Note", "docid"),
        TASKS("lcms", "tasks", "mdm.GsonObjects.Other.Task", "taskid");
        
        private final String database;
        private final String collection;
        private final String className;
        private final String idName;

        private MongoConf(String database, String collection, String className, String idName) {
            this.database = database;
            this.collection = collection;
            this.className = className;
            this.idName = idName;
        }

        public String getIdName() {
            return idName;
        }

        public String getDatabase() {
            return database;
        }

        public String getCollection() {
            return collection;
        }

        public String getClassName() {
            return className;
        }

    }

    public enum taskCategories {
        //ICT-TICKET RELATED
        ICT_TICKET;

    }

    public static String readFile(String urlName) {
        try {
            String out = new Scanner(new URL(urlName).openStream(), "UTF-8").useDelimiter("\\A").next();
            return out;
        } catch (IOException ex) {
            ex.printStackTrace();
            return null;
        }
    }

    public static String loadWebFile(String url) {
        String file = "";
        if (url.equals("")) {
            file = readFile("http://localhost:8084/LCMS/HTML/home/index.html");
        } else {
            file = readFile("http://localhost:8084/LCMS/HTML/" + url);
        }
        return file;
    }

    public static String loadScriptFile(String url) {
        String file = "";

        file = readFile("http://localhost:8084/LCMS/HTML/" + url);

        return file;
    }

    public static boolean checkUserRole(String _cookie, Roles _role) {
        Session session = DatabaseActions.getSession(_cookie);
        if (session == null) {
            return false;
        }
        if (session.getUsername().equals("admin")) {
            return checkSession(_cookie);
        } else {
            User user = DatabaseActions.getUser(session.getUsername());
            if (user.getRoles().get(0).contains(_role.toString())) {
                return checkSession(_cookie);
            }
        }
        return false;
    }

    public static boolean checkUserRoleValue(String _cookie, int _value) {

        List<String> roles = getUserRoles(_cookie);
        for (String role : roles) {
            if (Roles.valueOf(role).getLevelCode() >= _value) {
                return true;
            }
        }
        return false;
    }

    public static boolean checkUserAgainstRoles(String _cookie, List<String> _roles) {

        List<String> roles = getUserRoles(_cookie);
        for (String role : _roles) {
            if (roles.indexOf(role) != -1) {
                return true;
            }
        }
        return false;
    }

    public static List<String> getUserRoles(String _cookie) {
        Session session = DatabaseActions.getSession(_cookie);
        List<String> roles = new ArrayList<>();
        if (session == null) {
            return roles;
        }
        if (session.getUsername().equals("admin")) {
            roles.add(Roles.ADMIN.toString());
            roles.add(Roles.ICTMANAGER.toString());
            return roles;
        } else {
            User user = DatabaseActions.getUser(session.getUsername());
            return Arrays.asList(user.getRoles().get(0).split(","));
        }
    }

    public static boolean checkSession(String _cookie) {
        Session session = DatabaseActions.getSession(_cookie);
        if (session == null) {
            return false;
        }
        long now = Instant.now().toEpochMilli() / 1000;
        if (now < session.getValidity()) {
            return true;
        } else {
            return false;
        }

    }

    public static String getWebFileLocation(String page) {
        return "http://localhost:8084/LCMS/index.html?p=" + page;
    }

    public static HashMap JsonToHashMap(String json) throws IOException {
        HashMap<String, String> result;
        ObjectMapper mapper;
        TypeFactory factory;
        MapType type;
        factory = TypeFactory.defaultInstance();
        type = factory.constructMapType(HashMap.class, String.class, String.class);
        mapper = new ObjectMapper();
        result = mapper.readValue(json, type);
        return result;
    }

    public static long StringToTimeStamp(String date, String format) {
        long returnValue = 0;
        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat(format);
            Date parsedDate = dateFormat.parse(date);
            Timestamp timestamp = new java.sql.Timestamp(parsedDate.getTime());
            returnValue = timestamp.getTime();
        } catch (Exception e) { //this generic but you can control another types of exception
            // look the origin of excption
            System.out.print(e.getMessage());
        }
        return returnValue;
    }

    public static long StringToLong(String input) {
        long output = 0;
        if (input != null) {
            try {
                output = Long.parseLong(input);
            } catch (Exception e) {
            }
        }
        return output;
    }

    public static void SendEmail() {

    }

    public static String getTempDir(String _sessionId, String _contextPath) {
        return _contextPath + "\\" + _sessionId + "\\";
    }

    public static String getTempDirWebUrl(String _sessionId) {
        return "/LCMS/HTML/other/files/" + _sessionId + "\\";
    }

    public static List<Field> getSystemFields(String _cls, String type) throws ClassNotFoundException {
        Class cls = Class.forName(_cls);
        List<Field> fields = Arrays.asList(cls.getDeclaredFields());
        List<Field> systemfields = new ArrayList<>();
        if ("view".equals(type)) {
            systemfields = fields.stream().
                    filter(p -> p.getAnnotation(MdmAnnotations.class).viewRole().equals("SYSTEM")).
                    collect(Collectors.toList());
        }
        if ("edit".equals(type)) {
            systemfields = fields.stream().
                    filter(p -> p.getAnnotation(MdmAnnotations.class).editRole().equals("SYSTEM")).
                    collect(Collectors.toList());
        }
        if ("create".equals(type)) {
            systemfields = fields.stream().
                    filter(p -> p.getAnnotation(MdmAnnotations.class).createRole().equals("SYSTEM")).
                    collect(Collectors.toList());
        }

        return systemfields;
    }

    public static boolean isSystemField(List<Field> systemFields, String field) {
        return systemFields.stream().filter(p -> p.getName().equals(field)).findFirst().orElse(null) != null;
    }

    public static void ComputeDifference(String originaljson, String revisedjson) {
        List<String> original = jsonToLines(originaljson);
        List<String> revised = jsonToLines(revisedjson);

        // Compute diff. Get the Patch object. Patch is the container for computed deltas.
        Patch patch = DiffUtils.diff(original, revised);
        List<Delta> changes = patch.getDeltas();

        for (Delta change : changes) {
            //change.
        }
    }

    private static List jsonToLines(String json) {
        List<String> lines = new LinkedList<String>();
        for (int i = 0; i < json.length(); i++) {
            if (i > 0 && i % 50 == 0) {
                lines.add(json.substring(i - 50, i));
            }
        }
        return lines;
    }

}
