/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms;

import com.fasterxml.jackson.annotation.JsonInclude;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.type.MapType;
import com.fasterxml.jackson.databind.type.TypeFactory;

import com.mongodb.BasicDBObject;
import static com.mongodb.client.model.Filters.*;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;
import java.lang.reflect.Field;
import java.net.InetAddress;
import java.net.URL;
import java.net.UnknownHostException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Properties;
import java.util.Scanner;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import gcms.Config.Roles;
import gcms.GsonObjects.Core.Apikey;
import gcms.GsonObjects.Core.FileObject;
import gcms.GsonObjects.Core.MongoConfigurations;
import gcms.GsonObjects.Core.Session;
import gcms.GsonObjects.Core.User;
import gcms.GsonObjects.Other.SerializableClass;
import gcms.GsonObjects.Other.SerializableField;
import gcms.database.DatabaseActions;
import gcms.database.DatabaseWrapper;
import gcms.credentials.Cryptography;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URLEncoder;
import java.util.Map;
import org.apache.commons.io.FileUtils;
import org.bson.Document;
import org.jasypt.util.password.StrongPasswordEncryptor;
import gcms.GsonObjects.annotations.gcmsObject;
import java.io.ByteArrayInputStream;
import java.io.ObjectInput;
import java.io.ObjectInputStream;

/**
 *
 * @author matmey
 */
public class Core {

    static String dirName = getProp("app.root");
    static String baseURL = getProp("base.url");
    public static ObjectMapper universalObjectMapper = startObjectMapper();

    public static ObjectMapper startObjectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        mapper.enable(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY);
        mapper.enable(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT);
        //mapper.enableDefaultTyping(ObjectMapper.DefaultTyping.NON_FINAL);

        return mapper;
    }

    public static String httpRequest(String receiver, String method, String postParameters) throws MalformedURLException, IOException {
        ObjectMapper mapper = new ObjectMapper();

        if (method.equals("post") && postParameters != null) {
            StringBuilder postData = new StringBuilder();
            Map<String, String> postParameterMap = mapper.readValue(postParameters, new TypeReference<Map<String, String>>() {
            });
            for (Map.Entry<String, String> param : postParameterMap.entrySet()) {
                if (postData.length() != 0) {
                    postData.append('&');
                }
                postData.append(URLEncoder.encode(param.getKey(), "UTF-8"));
                postData.append('=');
                postData.append(URLEncoder.encode(String.valueOf(param.getValue()), "UTF-8"));
            }
            // byte[] postDataBytes = postData.toString().getBytes("UTF-8");
            // con.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            //con.setRequestProperty("Content-Length", String.valueOf(postDataBytes.length));
            if (receiver.contains("?")) {
                receiver = receiver + "&" + postData.toString();
            } else {
                receiver = receiver + "?" + postData.toString();
            }

        }
        URL url = new URL(receiver);

        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        con.setRequestProperty("Content-Type", "text/plain; charset=utf-8");
        con.setRequestMethod(method.toUpperCase());
        con.setConnectTimeout(300000);
        con.setReadTimeout(300000);

        int status = con.getResponseCode();
        BufferedReader in = new BufferedReader(
                new InputStreamReader(con.getInputStream()));
        String inputLine;
        StringBuffer content = new StringBuffer();
        while ((inputLine = in.readLine()) != null) {
            content.append(inputLine);
        }
        in.close();
        return content.toString();
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

    public static boolean isValidApiKey(String _apiName, String _key) throws IOException, ClassNotFoundException {
        boolean valid = false;
        ObjectMapper mapper = new ObjectMapper();
        BasicDBObject searchObject = new BasicDBObject();
        MongoConfigurations mongoConfiguration = DatabaseActions.getMongoConfiguration("apikeys");
        searchObject.put("name", new BasicDBObject("$eq", _apiName));
        Map<String, Object> searchResult = DatabaseWrapper.getObjectHashMapv2(null, mongoConfiguration, searchObject);
        Apikey apikey = mapper.convertValue(searchResult, gcms.GsonObjects.Core.Apikey.class);
        return Cryptography.verifyHash(_key, apikey.getApiKey());
        //return valid;
    }

    public static String getParamsAsURLString(Map<String, String> params)
            throws UnsupportedEncodingException {
        StringBuilder result = new StringBuilder();

        for (Map.Entry<String, String> entry : params.entrySet()) {
            result.append(URLEncoder.encode(entry.getKey(), "UTF-8"));
            result.append("=");
            result.append(URLEncoder.encode(entry.getValue(), "UTF-8"));
            result.append("&");
        }

        String resultString = result.toString();
        return resultString.length() > 0
                ? resultString.substring(0, resultString.length() - 1)
                : resultString;
    }

    public static String readFile(String urlName) {
        try {
            String out = new Scanner(new URL(baseURL + urlName).openStream(), "UTF-8").useDelimiter("\\A").next();
            Logger.getLogger(Core.class.getName()).log(Level.INFO, baseURL + urlName);
            return out;
        } catch (IOException ex) {
            Logger.getLogger(Core.class.getName()).log(Level.SEVERE, ex.getMessage());
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
        ObjectMapper mapper = new ObjectMapper();
        ArrayList<Document> results;
        Session session = null;

        try {
            if (!_user.equals(getProp("username"))) {
                gcms.GsonObjects.Core.Actions _action = DatabaseWrapper.getAction("loadusers");
                Map<String, Object> user = DatabaseWrapper.getObjectHashMapv2(null, DatabaseActions.getMongoConfiguration(_action.mongoconfiguration), and(eq("username", _user)));
                session = new Session(_user, _sessionId, now + ((Integer.parseInt(user.get("sessionValidity").toString()))), true, user.get("userid").toString());
            } else {
                session = new Session(_user, _sessionId, now + (9999), true, "158");
            }
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(Core.class.getName()).log(Level.SEVERE, ex.getMessage());
        }

        return session;
    }

    public static void createTempDir(String _sessionId, String path) {
        new File(path + "/" + _sessionId).mkdir();
        System.out.print(path + "/" + _sessionId);
    }

    public static void deleteTempDir(String _sessionId, String path) throws IOException {
        try {
            FileUtils.deleteDirectory(new File(path + "\\" + _sessionId));
        } catch (Exception e) {
            System.out.println((e.getMessage()));
        }
    }

    private void devalidateSession(String _sessionId, String path) throws IOException, ClassNotFoundException {
        Session session = DatabaseActions.getSession(_sessionId);
        if (!session.getUsername().equals(getProp("username"))) {
            gcms.GsonObjects.Core.Actions _action = DatabaseWrapper.getAction("loadusers");
            Map<String, Object> user = DatabaseWrapper.getObjectHashMapv2(null, DatabaseActions.getMongoConfiguration(_action.mongoconfiguration), and(eq("username", session.getUsername())));
            DatabaseActions.editSessionValidity(_sessionId, (Integer.parseInt(user.get("sessionValidity").toString()) * -1));
        } else {
            DatabaseActions.editSessionValidity(_sessionId, 9999 * -1);
        }
        deleteTempDir(_sessionId, path);
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
        if (!Core.checkSession(_cookie)) {
            return roles;
        }
        if (session.getUsername().equals("root")) {
            roles.add(Roles.ADMIN.toString());
            roles.add(Roles.ICTMANAGER.toString());
            return roles;
        } else {
            User user = DatabaseActions.getUser(session.getUsername());
            return user.getRoles();
        }
    }

    public static boolean notNullNorEmpty(List<String> obj) {
        if (obj != null) {
            return obj.size() > 0;
        } else {
            return false;
        }
    }

    public static List<String> getUserRolesV2(String _cookie) {
        Session session = DatabaseActions.getSession(_cookie);
        List<String> roles = new ArrayList<>();
        if (!Core.checkSession(_cookie)) {
            return roles;
        }
        if (session.getUsername().equals("root")) {
            roles.add(Roles.ADMIN.toString());
            roles.add(Roles.ICTMANAGER.toString());
            return roles;
        } else {
            User user = DatabaseActions.getUser(session.getUsername());
            return user.getRoles();
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
        return _contextPath + "/" + _sessionId + "/";
    }

    public static String getTempDirWebUrl(String _sessionId) {
        String prefix = "/";
        if (dirName.equals("")) {
            prefix = "";
        }
        return prefix + dirName + "/HTML/other/files/" + _sessionId + "\\";
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

    public static HashMap<String, Object> createDatabaseObject(HashMap<String, String[]> requestParameters, Class cls) {
        HashMap<String, Object> databaseObject = null;
        try {
            requestParameters.remove("oper");
            requestParameters.remove("id");
            HashMap<String, Object> parameters = new HashMap<>();
            requestParameters.forEach((key, value) -> {
                key = key.replaceAll("\\[|\\]", "");
                try {
                    System.out.println(cls.getField(key).getType().toString());
                    String val = value[0];
                    Field f = cls.getField(key);
                    if (f != null) {
                        Class fT = f.getType();
                        if (f.getType().equals(long.class) && !val.equals("") && val != null) {
                            parameters.put(key, Long.parseLong(val));
                        }
                        if (f.getType().equals(List.class) && !val.equals("") && val != null) {
                            if (val.split(",").length < 2) {
                                parameters.put(key, new ArrayList<>(Arrays.asList(value)));
                            } else {
                                parameters.put(key, new ArrayList<>(Arrays.asList(val.split(","))));
                            }
                        }
                        if (f.getType().equals(String.class) && !val.equals("") && val != null) {
                            parameters.put(key, (val));
                        }
                        if (fT.equals(boolean.class)) {
                            parameters.put(key, Boolean.parseBoolean(val));
                        }
                    }

                } catch (NoSuchFieldException ex) {
                    Logger.getLogger(Core.class.getName()).log(Level.INFO, ex.getMessage());
                } catch (SecurityException ex) {
                    Logger.getLogger(Core.class.getName()).log(Level.SEVERE, ex.getMessage());
                }

            });
            databaseObject = parameters;
        } catch (SecurityException ex) {
            Logger.getLogger(Core.class.getName()).log(Level.SEVERE, ex.getMessage());
        }
        return databaseObject;
    }

    public static HashMap<String, Object> createDatabaseObject(HashMap<String, String[]> requestParameters, SerializableClass cls) {
        HashMap<String, Object> databaseObject = null;
        try {
            requestParameters.remove("oper");
            requestParameters.remove("id");
            HashMap<String, Object> parameters = new HashMap<>();
            requestParameters.forEach((key, value) -> {
                key = key.replaceAll("\\[|\\]", "");
                try {

                    String val = value[0];
                    SerializableField f = cls.getField(key);
                    if (f != null) {
                        System.out.println(f.getType());

                        if (f.getType().equals("long") && !val.equals("") && val != null) {
                            parameters.put(key, Long.parseLong(val));
                        }
                        if (f.getType().equals("java.util.List") && !val.equals("") && val != null) {
                            ArrayList vals = new ArrayList<>();
                            try {
                                vals = Core.universalObjectMapper.readValue(val, ArrayList.class);
                                parameters.put(key, vals);
                            } catch (Exception e) {
                                if (val.split(",").length < 2) {
                                    parameters.put(key, new ArrayList<>(Arrays.asList(value)));
                                } else {
                                    parameters.put(key, new ArrayList<>(Arrays.asList(val.split(","))));
                                }
                            }

                        }
                        if (f.getType().equals("java.lang.String") && !val.equals("") && val != null) {
                            parameters.put(key, (val));
                        }
                        if (f.getType().equals("boolean")) {
                            parameters.put(key, Boolean.parseBoolean(val));
                        }
                    }

                } catch (SecurityException ex) {
                    Logger.getLogger(Core.class.getName()).log(Level.SEVERE, ex.getMessage());
                }

            });
            databaseObject = parameters;
        } catch (SecurityException ex) {
            Logger.getLogger(Core.class.getName()).log(Level.SEVERE, ex.getMessage());
        }
        return databaseObject;
    }

    public static HashMap<String, Object> createMailParameters(List<String> receivers, String subject, String content) {

        List<String> emails = new ArrayList<>();
        for (String receiver : receivers) {
            try {
                emails.add(DatabaseActions.getUser(receiver, "userid").getEmail());
            } catch (Exception e) {
                System.out.print(e.getMessage());
            }
        }
        HashMap<String, Object> parameters = new HashMap<>();
        parameters.put("subject", "LCMS " + subject);
        parameters.put("from", "labo.bl@azzeno.be");
        parameters.put("receivers", emails);
        parameters.put("text", content);
        return parameters;
    }

    public static String getProp(String name) {

        try {
            Class<?> clazz = Core.class;
            Package p = clazz.getPackage();
            Properties prop = new Properties();
            String basePath = System.getProperties().getProperty("user.home") + "/" + p.getName();
            checkDir(basePath);
            String propFileName = p.getName() + ".properties";
            //Logger.getLogger(Core.class.getName()).log(Level.INFO, "getProp() basepath: " + basePath + "(" + basePath + "/" + propFileName + ")", "getProp() basepath: " + basePath + "(" + basePath + "/" + propFileName + ")");
            File f = new File(basePath + "/" + propFileName);
            prop.load(new StringReader(readAllLines(Arrays.asList(f)).toString()));
            return prop.getProperty(name);
        } catch (IOException ex) {
            Logger.getLogger(Core.class.getName()).log(Level.SEVERE, ex.getMessage(), ex);
            return null;
        }
    }

    public static String getPropFileName() {

        Class<?> clazz = Core.class;
        Package p = clazz.getPackage();
        Properties prop = new Properties();
        String basePath = System.getProperties().getProperty("user.home");
        String propFileName = p.getName() + ".properties";

        return p.getName();

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

    public static String getExtension(String fileName) {
        char ch;
        int len;
        if (fileName == null
                || (len = fileName.length()) == 0
                || (ch = fileName.charAt(len - 1)) == '/' || ch == '\\'
                || //in the case of a directory
                ch == '.') //in the case of . or ..
        {
            return "";
        }
        int dotInd = fileName.lastIndexOf('.'),
                sepInd = Math.max(fileName.lastIndexOf('/'), fileName.lastIndexOf('\\'));
        if (dotInd <= sepInd) {
            return "";
        } else {
            return "." + fileName.substring(dotInd + 1).toLowerCase();
        }
    }

    public static HashMap<String, String[]> updateHash(String hashField, HashMap<String, String[]> requestParameters) {
        if (requestParameters.get(hashField + "Lock")[0].equals("false")) {
            requestParameters.get(hashField)[0] = Cryptography.hash(requestParameters.get(hashField)[0]);
        } else {
            requestParameters.remove(hashField);
        }
        requestParameters.put(hashField + "Lock", new String[]{"true"});
        return requestParameters;
    }

    public static List<String> getHashFields(HashMap<String, String[]> requestParameters, Class cls) {
        List<String> hashFields = requestParameters.keySet().stream().filter((String k) -> {
            try {
                Field f = cls.getField(k);
                return f.getAnnotation(gcmsObject.class).type().equals("encrypted");
            } catch (NoSuchFieldException | SecurityException ex) {
                Logger.getLogger(Core.class.getName()).log(Level.INFO, ex.getMessage());
                return false;
            }
        })
                .collect(Collectors.toList());
        return hashFields;
    }

    public static List<String> getHashFields(HashMap<String, String[]> requestParameters, SerializableClass cls) {
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

    public static HashMap<String, String[]> checkHashFields(HashMap<String, String[]> requestParameters, Class cls) {
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

    public static HashMap<String, String[]> checkHashFields(HashMap<String, String[]> requestParameters, SerializableClass cls) {
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

    public static String encryptString(String pass) {
        StrongPasswordEncryptor passwordEncryptor = new StrongPasswordEncryptor();
        pass = passwordEncryptor.encryptPassword(pass);
        return pass;
    }

    public static String getClientPCName(String ipAddr) {
        String host = "";
        try {
            InetAddress addr = InetAddress.getByName(ipAddr);
            host = addr.getHostName();

        } catch (UnknownHostException ex) {
            Logger.getLogger(Core.class
                    .getName()).log(Level.SEVERE, ex.getMessage());
        }
        return host;
    }

    public static List<File> getLatestFile(String dir, int number) {
        File folder = new File(dir);
        File[] listOfFiles = folder.listFiles();
        ArrayList listOfFiles2 = Arrays.asList(listOfFiles).stream().filter(f -> f.getName().contains("web")).collect(Collectors.toCollection(ArrayList::new));
        listOfFiles = (File[]) listOfFiles2.toArray(new File[0]);
        if (listOfFiles.length > 1) {
            FilePair[] pairs = new FilePair[listOfFiles.length];
            for (int i = 0; i < listOfFiles.length; i++) {
                pairs[i] = new FilePair(listOfFiles[i]);
            }
            Arrays.sort(pairs);
            for (int i = 0; i < listOfFiles.length; i++) {
                listOfFiles[i] = pairs[i].f;
            }
        }
        if (number > listOfFiles.length) {
            number = listOfFiles.length;
        }
        List<File> output = new ArrayList<>();
        for (int i = 0; i < number; i++) {
            output.add(listOfFiles[i]);
        }

        return output;

    }

    public static class FilePair implements Comparable {

        public long t;
        public File f;

        public FilePair(File file) {
            f = file;
            t = file.lastModified();
        }

        public int compareTo(Object o) {
            long u = ((FilePair) o).t;
            return t > u ? -1 : t == u ? 0 : 1;
        }
    };

    public static class StringPair {

        public String name;
        public String value;

        public StringPair() {
        }

        public StringPair(String name, String value) {
            this.name = name;
            this.value = value;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getValue() {
            return value;
        }

        public void setValue(String value) {
            this.value = value;
        }

    };

    public static StringBuffer readAllLines(List<File> files) {
        StringBuffer allLines = new StringBuffer();
        try {
            for (File f : files) {
                allLines.append(readAllLines(new StringBuffer(), f.toPath(), "UTF-8"));
            }
        } catch (Exception e) {
            Logger.getLogger(Core.class
                    .getName()).log(Level.INFO, "Error while reading file. \n{0}", e.getMessage());
        }
        return allLines;
    }

    public static StringBuffer readAllLines(StringBuffer sb, Path p, String charset) throws IOException {
        String scan;
        FileReader file = new FileReader(p.toFile());
        BufferedReader br = new BufferedReader(file);

        while ((scan = br.readLine()) != null) {
            scan += "\r";
            sb.append(scan);
        }
        br.close();
        return sb;
    }

    public static StringBuilder readAllLines(StringBuilder sb, Path p, String charset) throws IOException {

        try ( Stream<String> stream = Files.lines(p)) {
            stream.forEach(sb::append);
        }

        return sb;
    }

    public static String buildRegex(String reg, List<StringPair> filters) {
        if (filters != null) {
            for (StringPair filter : filters) {
                String name = filter.getName();
                String value = filter.getValue();
                reg = reg.replace(name, value);
            }
        }

        return reg;
    }

    public static List<String> search(StringBuffer source, String reg, int[] groups, boolean newLines) { //groups mag null zijn als je geen groepen terug wilt krijgen
        Regex.compile(reg, newLines);
        return Regex.search(source.toString(), groups);
    }

    public static String paramJson(String paramIn) {
        paramIn = paramIn.replaceAll(":", "");
        paramIn = paramIn.replaceAll("=", "\":\"");
        paramIn = paramIn.replaceAll("&", "\",\"");
        return "{" + paramIn + "\"}";
    }

    private FileObject createFileObject(String _id, String _filename, String _type, String _contenttype, String _accesstype) {
        long now = Instant.now().toEpochMilli() / 1000;
        FileObject fileObject = new FileObject();
        fileObject.setFileid(_id);
        fileObject.setType(_type);
        fileObject.setName(_filename);
        fileObject.setUpload_date(_type);
        fileObject.setContent_type(_contenttype);
        fileObject.setAccesstype(_accesstype);
        return fileObject;
    }

    public static SerializableClass getFields(MongoConfigurations mongoconf, String _cookie) {
        List<Field> fields = new ArrayList<>();
        StringBuilder sb = new StringBuilder();
        HashMap<String, String> parameters = new HashMap<>();
        HashMap<String, String> extra = new HashMap<>();
        SerializableClass serializableClass = new SerializableClass();
        try {
            extra.put("className", mongoconf.getClassName());
            parameters.put("LCMS_session", _cookie);
            parameters.put("action", "docommand");
            parameters.put("k", mongoconf.getPluginName());
            parameters.put("extra", Core.universalObjectMapper.writeValueAsString(extra));
            sb.append(Core.httpRequest(baseURL + dirName + "servlet/", "post", Core.universalObjectMapper.writeValueAsString(parameters)));
            JsonNode parentJson = Core.universalObjectMapper.readTree(sb.toString());
            String requestResult = parentJson.asText();

            serializableClass = Core.universalObjectMapper.readValue(requestResult, SerializableClass.class);
        } catch (IOException ex) {
            Logger.getLogger(Core.class.getName()).log(Level.SEVERE, null, ex);
        }

//        for (String resultEntry : apiResult) {
//            SerializableField serializableField;
//            try {
//                serializableField = Core.universalObjectMapper.readValue(resultEntry, SerializableField.class);
//                serializableFields.add(serializableField);
//            } catch (IOException ex) {
//                Logger.getLogger(Core.class.getName()).log(Level.SEVERE, null, ex);
//            }
//
//        }
        return serializableClass;

    }

    public Object readBytesIntoFields(byte[] yourBytes) throws IOException, ClassNotFoundException {
        Object o;
        ByteArrayInputStream bis = new ByteArrayInputStream(yourBytes);
        ObjectInput in = null;
        try {
            in = new ObjectInputStream(bis);
            o = in.readObject();

        } finally {

            if (in != null) {
                in.close();
            }

        }
        return o;
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
