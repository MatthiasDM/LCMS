/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.MapType;
import com.fasterxml.jackson.databind.type.TypeFactory;
import difflib.Delta;
import difflib.DiffUtils;
import difflib.Patch;
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
import java.util.Scanner;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import mdm.Config.Roles;
import mdm.GsonObjects.Session;
import mdm.GsonObjects.User;
import mdm.Mongo.DatabaseActions;
import mdm.pojo.annotations.MdmAnnotations;

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
            file = readFile("http://localhost:8080/LCMS/HTML/home/index.html");
        } else {
            file = readFile("http://localhost:8080/LCMS/HTML/" + url);
        }
        return file;
    }

    public static String loadScriptFile(String url) {
        String file = "";

        file = readFile("http://localhost:8080/LCMS/HTML/" + url);

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
        if (systemfields.size() > 0) {
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

    public static Object createDatabaseObject(HashMap<String, String[]> requestParameters, Class cls) {
        Object databaseObject = null;
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.enable(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY);
            requestParameters.remove("oper");
            requestParameters.remove("id");
            HashMap<String, Object> parameters = new HashMap<>();
            requestParameters.forEach((key, value) -> {
                parameters.put(key, value[0]);
            });
            databaseObject = mapper.readValue(mapper.writeValueAsString(parameters), cls);//createNoteObject(requestParameters.get("docid")[0], "create");
        } catch (JsonProcessingException ex) {
            Logger.getLogger(Core.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException ex) {
            Logger.getLogger(Core.class.getName()).log(Level.SEVERE, null, ex);
        }
        return databaseObject;
    }

}
