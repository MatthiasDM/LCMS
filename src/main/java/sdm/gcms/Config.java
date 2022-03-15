/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package sdm.gcms;

import com.fasterxml.jackson.core.JsonProcessingException;

import static com.mongodb.client.model.Filters.*;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Field;
import java.net.URL;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Properties;
import java.util.Scanner;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import sdm.gcms.database.DatabaseActions;
import sdm.gcms.database.DatabaseWrapper;
import java.io.DataOutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.util.Map;
import org.apache.commons.io.FileUtils;
import sdm.gcms.shared.database.filters.annotation.gcmsObject;

import static sdm.gcms.shared.database.Core.universalObjectMapper;
import static sdm.gcms.shared.database.Core.*;
import sdm.gcms.shared.database.Cryptography;
import sdm.gcms.shared.database.Database;
import sdm.gcms.shared.database.collections.Actions;
import sdm.gcms.shared.database.collections.MongoConfigurations;
import sdm.gcms.shared.database.serializable.SerializableClass;
import sdm.gcms.shared.database.serializable.SerializableField;
import sdm.gcms.shared.database.users.Roles;
import sdm.gcms.shared.database.users.Session;
import sdm.gcms.shared.database.users.User;

/**
 *
 * @author matmey
 */
public class Config {

    static String dirName = getProp("app.root", packageName());
    static String baseURL = getProp("base.url", packageName());

    public static String packageName = packageName();

    public static String packageName() {
        Class<?> clazz = Config.class;
        Package p = clazz.getPackage();
        return p.getName();
    }

    public static void setDirName(String dirName) {
        Config.dirName = dirName;
    }

    public static void setBaseURL(String baseURL) {
        Config.baseURL = baseURL;
    }

    public static SerializableClass getSerializableClass(String cookie, MongoConfigurations _mongoConf) throws ClassNotFoundException {
        SerializableClass serializableClass = new SerializableClass();
        if (_mongoConf.getPluginName() != null && !_mongoConf.getPluginName().isBlank()) {
            serializableClass = sdm.gcms.shared.database.Core.getFields(_mongoConf, cookie);
        } else {
            serializableClass.setClassName(_mongoConf.getClassName());
            serializableClass.convertFields(Arrays.asList(Class.forName(_mongoConf.getClassName()).getDeclaredFields()));
        }
        return serializableClass;
    }

    public static String httpRestfulRequest(String receiver, ArrayList<String> parameters) throws MalformedURLException, IOException {
        URL url = new URL(receiver);
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        con.setRequestMethod("GET");
        con.setRequestProperty("Content-Type", "application/json");
        con.setDoOutput(true);
        DataOutputStream out = new DataOutputStream(con.getOutputStream());
        out.writeBytes(parameters.stream().collect(Collectors.joining("/")));
        out.flush();
        out.close();
        return "";
    }

    public static String readFile(String urlName) {
        try {
            String out = new Scanner(new URL(baseURL + urlName).openStream(), "UTF-8").useDelimiter("\\A").next();
            Logger.getLogger(Config.class.getName()).log(Level.INFO, baseURL + urlName);
            return out;
        } catch (IOException ex) {
            Logger.getLogger(Config.class.getName()).log(Level.SEVERE, ex.getMessage());
            return null;
        }

    }

    public static String loadWebFile(String url) {
        String file = "";
        if (url.equals("")) {
            file = readFile(dirName + "HTML/pages/index.html");
        } else {
            file = readFile(dirName + "HTML/" + url);
        }
        return file;
    }

    public static String loadScriptFile(String url) {
        String file = "";

        file = readFile(dirName + "HTML/" + url);

        return file;
    }

    public static Session createSession(String _user, String _sessionId) throws JsonProcessingException, IOException {
        long now = Instant.now().toEpochMilli() / 1000;
        Session session = null;
        try {
            if (!_user.equals(getProp("username", packageName()))) {
                Actions _action = Database.getDatabaseAction("loadusers");
                Map<String, Object> user = DatabaseWrapper.getObjectHashMapv2(null, Database.getMongoConfiguration(_action.mongoconfiguration), and(eq("username", _user)));
                session = new sdm.gcms.shared.database.users.Session(_user, _sessionId, now + ((Integer.parseInt(user.get("sessionValidity").toString()))), true, user.get("userid").toString());
            } else {
                session = new sdm.gcms.shared.database.users.Session(_user, _sessionId, now + (9999), true, "158");
            }
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(Config.class.getName()).log(Level.SEVERE, ex.getMessage());
        }

        return session;
    }

    public static void createTempDir(String _sessionId, String path) {
        new File(path + "/" + _sessionId).mkdir();
        System.out.print(path + "/" + _sessionId);
    }

    public static void deleteTempDir(String _sessionId, String _contextPath) throws IOException {
        try {
            FileUtils.deleteDirectory(new File(sdm.gcms.Config.getTempDir(_sessionId, _contextPath)));
        } catch (Exception e) {
            System.out.println((e.getMessage()));
        }
    }

    public static void devalidateSession(String _sessionId, String _contextPath) throws IOException, ClassNotFoundException {
        Session session = DatabaseActions.getSession(_sessionId);
        if (!session.getUsername().equals(getProp("username", packageName))) {
            Actions _action = Database.getDatabaseAction("loadusers");
            Map<String, Object> user = DatabaseWrapper.getObjectHashMapv2(null, Database.getMongoConfiguration(_action.mongoconfiguration), and(eq("username", session.getUsername())));
            DatabaseActions.editSessionValidity(_sessionId, (Integer.parseInt(user.get("sessionValidity").toString()) * -1));
        } else {
            DatabaseActions.editSessionValidity(_sessionId, 9999 * -1);
        }
        deleteTempDir(_sessionId, _contextPath);
    }

    public static boolean checkUserRole(String _cookie, Roles _role) {
        Session session = DatabaseActions.getSession(_cookie);
        if (session == null) {
            return false;
        }
        if (session.getUsername().equals("root")) {
            return checkSession(_cookie);
        } else {
            User user = DatabaseActions.getUser(session.getUsername());
            if (user != null) {
                if (user.getRoles().contains(_role.toString())) {
                    return checkSession(_cookie);
                }
            }
        }
        return false;
    }

    public static User getUserData(String _cookie) {
        Session session = DatabaseActions.getSession(_cookie);
        User user = new User();
        if (!Config.checkSession(_cookie)) {
            List<String> roles = new ArrayList<>();
            roles.add(Roles.GUEST.toString());
            user.setRoles(roles);
            user.setUsername("root");
            return user;
        }
        if (session.getUsername().equals("root")) {
            List<String> roles = new ArrayList<>();
            roles.add(Roles.ADMIN.toString());
            user.setRoles(roles);
            user.setUsername("root");
            return user;
        } else {
            user = DatabaseActions.getUser(session.getUsername());
            return user;
        }
    }

    public static boolean notNullNorEmpty(List<String> obj) {
        if (obj != null) {
            return obj.size() > 0;
        } else {
            return false;
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

    public static String getTempDir(String _sessionId, String _contextPath) {
        return _contextPath + "/" + _sessionId + "/";
    }

    public static List<Field> getSystemFields(String _cls, String type) throws ClassNotFoundException {
        Class cls = Class.forName(_cls);
        List<Field> fields = Arrays.asList(cls.getDeclaredFields());
        List<Field> systemfields = new ArrayList<>();
        if (fields.size() > 0) {
            if ("view".equals(type)) {
                systemfields = fields.stream().
                        filter(p -> p.getAnnotation(gcmsObject.class).viewRole().equals("SYSTEM")).
                        collect(Collectors.toList());
            }
            if ("edit".equals(type)) {
                systemfields = fields.stream().
                        filter(p -> p.getAnnotation(gcmsObject.class).editRole().equals("SYSTEM")).
                        collect(Collectors.toList());
            }
            if ("create".equals(type)) {
                systemfields = fields.stream().
                        filter(p -> p.getAnnotation(gcmsObject.class).createRole().equals("SYSTEM")).
                        collect(Collectors.toList());
            }
        } else {

        }

        return systemfields;
    }

    public static List<String> getFields(SerializableClass cls) {
        return cls.getFields().stream()
                .map(f -> f.getName())
                .collect(Collectors.toList());
    }

    public static List<SerializableField> getSystemFields(SerializableClass cls, String type) throws ClassNotFoundException {
        List<SerializableField> fields = cls.getFields();
        List<SerializableField> systemfields = new ArrayList<>();
        if (fields.size() > 0) {
            if ("view".equals(type)) {
                systemfields = fields.stream().
                        filter(p -> ((gcmsObject) p.getAnnotation()).viewRole().equals("SYSTEM")).
                        collect(Collectors.toList());
            }
            if ("edit".equals(type)) {
                systemfields = fields.stream().
                        filter(p -> ((gcmsObject) p.getAnnotation()).editRole().equals("SYSTEM")).
                        collect(Collectors.toList());
            }
            if ("create".equals(type)) {
                systemfields = fields.stream().
                        filter(p -> ((gcmsObject) p.getAnnotation()).createRole().equals("SYSTEM")).
                        collect(Collectors.toList());
            }
        } else {

        }

        return systemfields;
    }

    public static boolean isSystemField(List<Field> systemFields, String field) {
        return systemFields.stream().filter(p -> p.getName().equals(field)).findFirst().orElse(null) != null;
    }

    public static HashMap<String, Object> parseDatabaseObject(HashMap<String, String> requestParameters, SerializableClass cls) {
        HashMap<String, Object> databaseObject = null;
        try {
            requestParameters.remove("oper");
            requestParameters.remove("id");
            HashMap<String, Object> parameters = new HashMap<>();
            requestParameters.forEach((key, value) -> {
                key = key.replaceAll("\\[|\\]", "");
                try {

                    String val = value;
                    SerializableField f = cls.getField(key);
                    if (f != null) {
                        System.out.println(f.getType());

                        if (f.getType().equals("long") && !val.equals("")) {
                            parameters.put(key, Long.parseLong(val));
                        }
                        if (f.getType().equals("double") && !val.equals("")) {
                            parameters.put(key, Double.parseDouble(val));
                        }
                        if (f.getType().equals("java.util.List") && !val.equals("")) {
                            ArrayList vals = new ArrayList<>();
                            try {
                                vals = universalObjectMapper.readValue(val, ArrayList.class);
                                parameters.put(key, vals);
                            } catch (Exception e) {
                                if (val.split(",").length < 2) {
                                    parameters.put(key, new ArrayList<>(Arrays.asList(value)));
                                } else {
                                    parameters.put(key, new ArrayList<>(Arrays.asList(val.split(","))));
                                }
                            }
                        }
                        if (f.getType().equals("java.lang.String") && !val.equals("")) {
                            parameters.put(key, (val));
                        }
                        if (f.getType().equals("java.lang.Integer") && !val.equals("")) {
                            parameters.put(key, Integer.parseInt(val));
                        }
                        if (f.getType().equals("boolean")) {
                            parameters.put(key, Boolean.parseBoolean(val));
                        }
                    }

                } catch (SecurityException ex) {
                    Logger.getLogger(Config.class.getName()).log(Level.SEVERE, ex.getMessage());
                }

            });
            databaseObject = parameters;
        } catch (SecurityException ex) {
            Logger.getLogger(Config.class.getName()).log(Level.SEVERE, ex.getMessage());
        }
        return databaseObject;
    }

    public static boolean checkDir(String _directoryName) {
        File directory = new File(_directoryName);
        if (!directory.exists()) {
            directory.mkdir();
            return true;
        } else {
            return true;
        }
    }

    public static boolean checkFile(String _fileName) {
        File file = new File(_fileName);
        return file.exists();
    }

    public static String getProperty(String resource, String name) {

        ClassLoader loader = Thread.currentThread().getContextClassLoader();

        try ( InputStream input = loader.getResourceAsStream(resource)) {

            Properties prop = new Properties();
            prop.load(input);
            return prop.getProperty(name);

        } catch (IOException ex) {
            ex.printStackTrace();
        }

        return "";

    }

    public static HashMap<String, String> updateHash(String hashField, HashMap<String, String> requestParameters) {
        if (requestParameters.get(hashField + "Lock").equals("false")) {
            requestParameters.put(hashField, Cryptography.hash(requestParameters.get(hashField)));
        } else {
            requestParameters.remove(hashField);
        }
        requestParameters.put(hashField + "Lock", "true");
        return requestParameters;
    }

    public static List<String> getHashFields(HashMap<String, String> requestParameters, SerializableClass cls) {
        List<String> hashFields = requestParameters.keySet().stream().filter((String k) -> {
            SerializableField f = cls.getField(k);
            if (f != null) {
                gcmsObject anno = (gcmsObject) f.getAnnotation();
                return anno.type().equals("encrypted");
            } else {
                return false;
            }
        }).collect(Collectors.toList());
        return hashFields;
    }

    public static HashMap<String, String> checkHashFields(HashMap<String, String> requestParameters, SerializableClass cls) {
        List<String> hashFields = getHashFields(requestParameters, cls);
        for (String hashField : hashFields) {
            if (requestParameters.get(hashField + "Lock") == null) {
                Logger.getLogger(DatabaseWrapper.class.getName()).log(Level.SEVERE, "Hash locking field not found: " + hashField + "Lock", "Hash locking field not found: " + hashField + "Lock");
            } else {
                requestParameters = updateHash(hashField, requestParameters);
            }
        }
        return requestParameters;
    }

    public static List<String> search(StringBuffer source, String reg, int[] groups, boolean newLines) { //groups mag null zijn als je geen groepen terug wilt krijgen
        Regex.compile(reg, newLines);
        return Regex.search(source.toString(), groups);
    }

}

class Regex {

    public static Pattern r;
    public static Matcher m;

    public static void compile(String regex, boolean newLines) {
        if (newLines) {
            r = Pattern.compile(regex, Pattern.DOTALL);
        } else {
            r = Pattern.compile(regex);
        }

    }

    public static List<String> search(String lines, int[] groups) {
        List<String> results = new ArrayList<>();
        m = r.matcher(lines);

        while (m.find()) {

            if (groups != null) {
                for (int group : groups) {
                    results.add(m.group(group));
                }
            } else {
                results.add(m.group());
            }

        }
        return results;
    }

    public static List<String> search(StringBuffer lines, int[] groups) {
        List<String> results = new ArrayList<>();
        m = r.matcher(lines);

        while (m.find()) {

            if (groups != null) {
                for (int group : groups) {
                    results.add(m.group(group));
                }
            } else {
                results.add(m.group());
            }

        }
        return results;
    }

    public static String getField(String delimiter, int fieldNumber) {
        String regex = "";
        for (int i = 1; i <= fieldNumber; i++) {

            if (i == fieldNumber) {
                regex += "(.*?)|";
            } else {
                regex += ".*?|";
            }
        }
        return regex;
    }

}
