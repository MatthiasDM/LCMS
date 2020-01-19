/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.MapType;
import com.fasterxml.jackson.databind.type.TypeFactory;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
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
import java.util.Collections;
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
import gcms.GsonObjects.Core.Session;
import gcms.GsonObjects.Core.User;
import gcms.database.DatabaseActions;
import gcms.database.DatabaseWrapper;
import gcms.credentials.Cryptography;
import gcms.GsonObjects.annotations.MdmAnnotations;
import java.io.FileInputStream;
import java.util.Map;
import org.jasypt.util.password.StrongPasswordEncryptor;

/**
 *
 * @author matmey
 */
public class Core {

//    public enum Roles {
//
//    }       
//    public enum Actions {
//
//    }
//    public enum MongoConf {
//
//    }
    static String dirName = getProp("app.root"); // ""
    static String baseURL = getProp("base.url");//"http://localhost:8081/"; // "http://localhost:80/";
    //8081 is for test-enviroment

    public enum taskCategories {
        //ICT-TICKET RELATED
        ICT_TICKET;

    }

    public static String readFile(String urlName) {
        try {
            String out = new Scanner(new URL(baseURL + urlName).openStream(), "UTF-8").useDelimiter("\\A").next();
            Logger.getLogger(Core.class.getName()).log(Level.INFO, null, baseURL + urlName);
            return out;
        } catch (IOException ex) {
            Logger.getLogger(Core.class.getName()).log(Level.SEVERE, null, ex);
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

    public static boolean checkUserRole(String _cookie, Roles _role) {
        Session session = DatabaseActions.getSession(_cookie);
        if (session == null) {
            return false;
        }
        if (session.getUsername().equals("root")) {
            return checkSession(_cookie);
        } else {
            User user = DatabaseActions.getUser(session.getUsername());
            if (user.getRoles().contains(_role.toString())) {
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
            ObjectMapper mapper = new ObjectMapper();
            mapper.setSerializationInclusion(Include.NON_NULL);
            mapper.enable(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY);
            requestParameters.remove("oper");
            requestParameters.remove("id");
            HashMap<String, Object> parameters = new HashMap<>();
            requestParameters.forEach((key, value) -> {
                key = key.replaceAll("\\[|\\]", "");
                try {
                    System.out.println(cls.getField(key).getType().toString());
                    String val = value[0];
                    Class fT = cls.getField(key).getType();
                    if (cls.getField(key).getType().equals(long.class) && !val.equals("") && val != null) {
                        parameters.put(key, Long.parseLong(val));
                    }
                    if (cls.getField(key).getType().equals(List.class) && !val.equals("") && val != null) {
                        if (val.split(",").length < 2) {
                            parameters.put(key, new ArrayList<>(Arrays.asList(value)));
                        } else {
                            parameters.put(key, new ArrayList<>(Arrays.asList(val.split(","))));
                        }
                    }
                    if (cls.getField(key).getType().equals(String.class) && !val.equals("") && val != null) {
                        parameters.put(key, (val));
                    }
                    if (fT.equals(boolean.class)) {
                        parameters.put(key, Boolean.parseBoolean(val));
                    }
                } catch (NoSuchFieldException ex) {
                    Logger.getLogger(Core.class.getName()).log(Level.INFO, null, ex);
                } catch (SecurityException ex) {
                    Logger.getLogger(Core.class.getName()).log(Level.SEVERE, null, ex);
                }

            });

            databaseObject = parameters;//mapper.readValue(mapper.writeValueAsString(parameters), HashMap.class);
            //databaseObject = mapper.readValue(mapper.writeValueAsString(parameters), cls); //gewoon een HashMap object van maken???

        } catch (SecurityException ex) {
            Logger.getLogger(Core.class.getName()).log(Level.SEVERE, null, ex);
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
            String basePath = System.getProperties().getProperty("user.home");
            String propFileName = p.getName() + ".properties";  
            
            System.out.println("getProp() basepath: " + basePath + "(" + basePath + "/" + propFileName + ")");
            File f = new File(basePath + "/" + propFileName);
            prop.load(new StringReader(readAllLines(Arrays.asList(f)).toString()));
            return prop.getProperty(name);
        } catch (IOException ex) {
            Logger.getLogger(Core.class.getName()).log(Level.SEVERE, null, ex);
            return null;
        }
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
                return cls.getField(k).getAnnotation(MdmAnnotations.class).type().equals("encrypted");
            } catch (NoSuchFieldException | SecurityException ex) {
                Logger.getLogger(Core.class.getName()).log(Level.INFO, null, ex.getMessage());
            }
            return false;
        })
                .collect(Collectors.toList());
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
                    .getName()).log(Level.SEVERE, null, ex);
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
                Logger
                        .getLogger(Core.class
                                .getName()).log(Level.INFO, null, "Succesfull read of file (" + (int) (f.length() / 1000) + "kb" + "): " + f.getName());

            }
        } catch (Exception e) {
            Logger.getLogger(Core.class
                    .getName()).log(Level.INFO, null, "Error while reading file. \n" + e.getMessage());
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
