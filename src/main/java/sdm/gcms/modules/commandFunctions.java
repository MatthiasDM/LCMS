/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package sdm.gcms.modules;

import sdm.gcms.Core;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import com.google.gson.Gson;

import com.mongodb.BasicDBObject;
import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.regex;
import static com.mongodb.client.model.Filters.gte;

import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import static sdm.gcms.Core.getProp;
import sdm.gcms.database.DatabaseActions;
import sdm.gcms.database.DatabaseWrapper;
import java.util.Collection;
import java.util.UUID;
import java.util.regex.Pattern;
import javax.servlet.http.Cookie;
import javax.servlet.http.Part;
import org.apache.commons.lang.StringUtils;
import org.bson.Document;
import org.jasypt.util.password.StrongPasswordEncryptor;
import static sdm.gcms.database.objects.get.GetObject.prepareObject;
import sdm.gcms.database.objects.load.LoadObjects;
import sdm.gcms.servlet.ActionManager;
import sdm.gcms.servlet.Response;
import sdm.gcms.servlet.Servlet;
import java.util.HashMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.commons.codec.DecoderException;
import org.apache.commons.codec.binary.Hex;
import org.apache.commons.io.IOUtils;
import sdm.gcms.shared.database.Command;
import sdm.gcms.shared.database.collections.MongoConfigurations;
import sdm.gcms.shared.database.serializable.SerializableClass;
import static sdm.gcms.shared.database.Core.universalObjectMapper;
import sdm.gcms.shared.database.Cryptography;
import sdm.gcms.shared.database.Database;
import sdm.gcms.shared.database.FileObject;
import sdm.gcms.shared.database.collections.Actions;
import sdm.gcms.shared.database.filters.Apikey;
import sdm.gcms.shared.database.users.User;

/**
 *
 * @author Matthias
 */
public class commandFunctions {

    public static StringBuilder doCommand(String name, Map<String, String> requestParameters, Command command, Collection<Part> parts) throws ClassNotFoundException, JsonProcessingException, NoSuchFieldException, IOException {
        name = command.getCommand();
        StringBuilder sb = new StringBuilder();
        ObjectMapper mapper = new ObjectMapper();
        Integer executionCount = Integer.parseInt(command.getExecutionCount());
        Integer executionLimit = Integer.parseInt(command.getExecutionLimit());
        Integer executionInterval = Integer.parseInt(command.getExecutionLimitInterval());
        Map<String, String> commandParameters = mapper.readValue(command.getParameters(), new TypeReference<Map<String, String>>() {
        });
        commandParameters.putAll(requestParameters);

        if (name.equals("dobacklog")) {
            sb.append(command_doBacklog(commandParameters, command));
        }
        if (name.equals("doLoadTableConfig")) {
            sb.append(command_doGetTableConfig(commandParameters, command));
        }
        if (name.equals("doSendEmail")) {
            sb.append(command_sendEmail(commandParameters, command, parts));
        }
        if (name.equals("doGetTableFromDocument")) {
            try {
                sb.append(command_doGetTableFromDocument(commandParameters, command));
            } catch (DecoderException ex) {
                Logger.getLogger(commandFunctions.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        if (name.equals("doGetKPI")) {
            sb.append(command_doGetKPI(commandParameters, command));
        }
        if (name.equals("doGetFiles")) {
            sb.append(command_doGetFiles(commandParameters, command));
        }
        if (name.equals("doGenerateHash")) {
            sb.append(command_doGenerateHash(commandParameters, command));
        }
        if (name.equals("doAPICall")) {
            sb.append(command_doAPICall(commandParameters, parts, command));
        }
        if (name.equals("doEdit")) {
            sb.append(command_doActionManager(commandParameters, parts));
        }
        if (name.equals("TableStructure")) {
            sb.append(command_TableStructure(commandParameters, command, parts));
        }
        if (name.equals("doUploadFile")) {
            sb.append(command_doUploadFile(commandParameters, command, parts));
        }
        if (name.equals("doGetLocalPage")) {
            sb.append(command_doGetLocalPage(commandParameters, command));
        }
        if (name.equals("doLogin")) {
            sb.append(command_doLogin(commandParameters, command));
        }
        if (name.equals("doLogout")) {
            sb.append(command_doLogout(commandParameters, command));
        }
        if (name.equals("doUserInfo")) {
            sb.append(command_doUserInfo(commandParameters, command));
        }
        if (name.equals("doDownloadToTemp")) {
            sb.append(command_doDownloadToTemp(commandParameters, command, parts));
        }
        if (name.equals("doQuery")) {
            sb.append(command_doQueryByName(commandParameters, parts));
        }
        if (name.equals("doGetClassInfo")) {
            sb.append(command_doGetCollectionInfo(commandParameters));
        }
        if (name.equals("doExportCollection")) {
            //      sb.append(command_doConvertJSON(commandParameters, command, parts));

        }

        return sb;
    }

    public static StringBuilder command1() {
        StringBuilder sb = new StringBuilder();
        return sb;
    }

    public static StringBuilder doWorkflow(Map<String, String> parameters, Command command, Collection<Part> parts) throws IOException, ClassNotFoundException {
        StringBuilder sb = new StringBuilder();
        if (command_doCheckPlugin(Map.of("path", "/api/workflow/alive")).toString().equals("1")) {
            Map<String, String> workflowParameters = new HashMap<>();
            workflowParameters.put("action", "docommand");
            workflowParameters.put("k", "doWorkflow");
            workflowParameters.put("extra", universalObjectMapper.writeValueAsString(parameters));
            command_doActionManager(workflowParameters, null);
        };
        return sb;
    }

    public static StringBuilder command_sendEmail(Map<String, String> parameters, Command command, Collection<Part> parts) throws IOException {
        StringBuilder sb = new StringBuilder();
        ObjectMapper mapper = new ObjectMapper();
        Map<String, String> commandParameters = mapper.readValue(command.getParameters(), new TypeReference<Map<String, String>>() {
        });

        String subject = parameters.get("subject");
        String text = parameters.get("text");
        String from = parameters.get("from");
        List<String> receivers = Arrays.asList(parameters.get("receivers"));

        Properties props = new Properties();

        props.putAll(commandParameters);
        Session session = Session.getInstance(props,
                new javax.mail.Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(Core.getProp("mail.username"), Core.getProp("mail.password"));
            }
        });

        try {
            String receiverList = String.join(",", receivers.toArray(new String[receivers.size()]));
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(from));
            message.setRecipients(Message.RecipientType.TO,
                    InternetAddress.parse(receiverList));
            message.setSubject(subject);
            message.setContent(text, "text/html; charset=utf-8");
            Transport.send(message);
            System.out.println("Done");
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
        return sb;
    }

    public static StringBuilder command_doBacklog(Map<String, String> parameters, Command command) throws ClassNotFoundException, JsonProcessingException, NoSuchFieldException, IOException {
        StringBuilder sb = new StringBuilder();
        ObjectMapper mapper = new ObjectMapper();
        Actions action = DatabaseWrapper.getAction(parameters.get("action"));
        MongoConfigurations backlogConfiguration = DatabaseActions.getMongoConfiguration("backlog");
        ArrayList<Document> backlogs = DatabaseWrapper.getObjectSpecificRawDatav2(parameters.get("LCMS_session"),
                backlogConfiguration,
                and(eq("object_id", parameters.get("parameters[object_id]")), gte("created_on", new Long(parameters.get("parameters[created_on]")))));
        MongoConfigurations mongoConfiguration = DatabaseActions.getMongoConfiguration("mongoconfigurations");
        String classNameSuffix = parameters.get("parameters[object_type]");
        classNameSuffix = classNameSuffix.substring(classNameSuffix.lastIndexOf("."));
        ArrayList<Document> results = DatabaseActions.getObjectsSpecificListv2(parameters.get("LCMS_session"), mongoConfiguration, and(regex("className", Pattern.compile(".*" + classNameSuffix))), null, 1000, new String[]{}, true);
        //if no result found, try with other classname by searching for matching one in mongoconfigurations based on last word of object_type

        MongoConfigurations objectConfiguration = mapper.convertValue(results.get(0), MongoConfigurations.class);
        Map<String, Object> objectHashMap = DatabaseWrapper.getObjectHashMapv2(parameters.get("LCMS_session"), objectConfiguration, and(eq(objectConfiguration.getIdName(), parameters.get("parameters[object_id]"))));
        DatabaseWrapper.revertChanges(backlogs, objectHashMap, objectConfiguration);

        sb = prepareObject(parameters.get("LCMS_session"), DatabaseActions.getMongoConfiguration(objectConfiguration.getCollectionId()), false, objectHashMap);

        return sb;

    }

    public static StringBuilder command_doGetTableFromDocument(Map<String, String> parameters, Command command) throws ClassNotFoundException, JsonProcessingException, NoSuchFieldException, IOException, DecoderException {
        StringBuilder sb = new StringBuilder();
        BasicDBObject searchObject = new BasicDBObject();
        ObjectMapper mapper = new ObjectMapper();
        String mongoConf = "pages";
        String contentKey = "contents";
        String searchKey = "title";
        if (parameters.get("mongoconf") != null) {
            mongoConf = parameters.get("mongoconf");
        }
        if (parameters.get("contentkey") != null) {
            contentKey = parameters.get("contentkey");
        }
        if (parameters.get("searchkey") != null) {
            searchKey = parameters.get("searchkey");
        }
        MongoConfigurations mongoConfiguration = DatabaseActions.getMongoConfiguration(mongoConf);
        String value = parameters.get("document");//parameters.get("title")[0];
        String table = parameters.get("table");//parameters.get("table")[0];
        searchObject.put(searchKey, new BasicDBObject("$eq", value));
        Map<String, Object> searchResult = DatabaseWrapper.getObjectHashMapv2(parameters.get("LCMS_session"), mongoConfiguration, searchObject);
        String result = searchResult.get(contentKey).toString();
        if (result.matches("^[0-9A-Fa-f]+$")) {
            try {
                result = new String(Hex.decodeHex(result));
            } catch (DecoderException ex) {
                Logger.getLogger(DatabaseActions.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        Map<String, Map> contentMap = mapper.readValue(result, Map.class);

        Map<String, Map> grids = contentMap.get("grids");
        Map grid = grids.values().stream().filter(m -> m.get("caption").equals(table)).findFirst().get();
        sb.append(mapper.writeValueAsString(grid));
        return sb;
    }

    private static StringBuilder command_doGetKPI(Map<String, String> parameters, Command command) throws ClassNotFoundException, NoSuchFieldException, IOException {
        ObjectMapper mapper = new ObjectMapper();
        StringBuilder sb = new StringBuilder();
        ObjectNode jsonData = mapper.createObjectNode();
        List<String> lines = new ArrayList<>();
        List<String> allLines = new ArrayList<>();
        Map<String, String> commandParameters = mapper.readValue(command.getParameters(), new TypeReference<Map<String, String>>() {
        });
        String type = parameters.get("parameters[type]") != null ? parameters.get("parameters[type]") : commandParameters.get("type");
        String filetype = parameters.get("parameters[filetype]") != null ? parameters.get("parameters[filetype]") : commandParameters.get("filetype");
        if (filetype.equals("csv")) {
            try ( Stream<String> stream = Files.lines(Paths.get(Core.getProp("doGetKPI.folder") + type + "\\data.csv"), Charset.forName("ISO-8859-1"))) {
                lines = stream
                        .map(String::toUpperCase)
                        //.filter(line -> line.contains("{"))
                        .collect(Collectors.toList());
            } catch (IOException e) {
                e.printStackTrace();
            }
            jsonData.put("data", StringUtils.join(lines, "\n"));
        } else {
            if (filetype.equals("json")) {
                File folder = new File(Core.getProp("doGetKPI.folder") + type);
                File[] listOfFiles = folder.listFiles();
                for (File file : listOfFiles) {
                    if (file.isFile()) {
                        System.out.println(file.getName());
                        try ( Stream<String> stream = Files.lines(file.toPath(), Charset.forName("ISO-8859-1"))) {
                            lines = stream
                                    .map(String::toUpperCase)
                                    .filter(line -> line.contains("{"))
                                    .collect(Collectors.toList());
                            allLines.addAll(lines);
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                }

                jsonData.put("data", mapper.writeValueAsString(allLines));

            }
        }
        if (command.getAccessType().contains("2")) {
            sb.append(mapper.writeValueAsString(allLines));

        } else {
            sb.append(jsonData);
        }
        return sb;
    }

    private static StringBuilder command_doGetFiles(Map<String, String> parameters, Command command) throws IOException {
        StringBuilder sb = new StringBuilder();

        ObjectMapper mapper = new ObjectMapper();
        ObjectNode jsonData = mapper.createObjectNode();
        Map<String, String> commandParameters = mapper.readValue(command.getParameters(), new TypeReference<Map<String, String>>() {
        });

        for (Map.Entry<String, String> entry : commandParameters.entrySet()) {
            List<String> lines = new ArrayList<>();
            try ( Stream<String> stream = Files.lines(Paths.get(entry.getValue()), Charset.forName("ISO-8859-1"))) {
                lines = stream
                        .map(String::toUpperCase)
                        .filter(line -> line.contains("'"))
                        .collect(Collectors.toList());
            } catch (IOException e) {
                e.printStackTrace();
            }
            jsonData.put(entry.getKey(), mapper.writeValueAsString(lines));
        }
        sb.append(jsonData);
        return sb;
    }

    private static StringBuilder command_doGenerateHash(Map<String, String> parameters, Command command) throws IOException {
        StringBuilder sb = new StringBuilder();
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode jsonData = mapper.createObjectNode();
        Map<String, String> commandParameters = mapper.readValue(command.getParameters(), new TypeReference<Map<String, String>>() {
        });
        sb.append(Cryptography.hash(parameters.get("password")));
        return sb;
    }

    private static StringBuilder command_doGetLocalPage(Map<String, String> parameters, Command command) throws IOException {
        StringBuilder sb = new StringBuilder();
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode jsonData = mapper.createObjectNode();
        Map<String, String> commandParameters = mapper.readValue(command.getParameters(), new TypeReference<Map<String, String>>() {
        });
        sb.append(DatabaseWrapper.getWebPage(commandParameters.get("url"), new String[]{})); //e.g. "admin/tools/index.html"
        return sb;
    }

    public static StringBuilder command_doAPICall(Map<String, String> parameters, Collection<Part> parts, Command command) throws IOException, ClassNotFoundException {
        StringBuilder sb = new StringBuilder();
        BasicDBObject searchObject = new BasicDBObject();
        ObjectMapper mapper = new ObjectMapper();

        String apikeyName = parameters.get("apikey");
        String path = parameters.get("path");
        String method = parameters.get("method");
        String extraParameters = null;
        if (parameters.get("extra") != null) {
            extraParameters = parameters.get("extra");
        }
        MongoConfigurations mongoConfiguration = DatabaseActions.getMongoConfiguration("apikeys");
        searchObject.put("name", new BasicDBObject("$eq", apikeyName));
        Map<String, Object> searchResult = DatabaseWrapper.getObjectHashMapv2(parameters.get("LCMS_session"), mongoConfiguration, searchObject);
        Apikey key = mapper.convertValue(searchResult, Apikey.class);
        String receiver;
        receiver = key.getUrl();
        receiver += path;
        receiver += "?key=" + key.getApiKeyRaw();
        receiver += "&command=" + command.getName();
        //sb.append(Core.httpRequest(receiver, method, extraParameters));
        sb.append(Core.multiPartHttpRequest(parts, receiver, method, extraParameters));

        return sb;
    }

    public static StringBuilder command_doCheckPlugin(Map<String, String> parameters) throws IOException, ClassNotFoundException {
        StringBuilder sb = new StringBuilder();
        String path = parameters.get("path");
        String method = "get";
        String extraParameters = null;
        String receiver;
        receiver = Core.getProp("base.url") + Core.getProp("app.cc");
        receiver += path;
        sb.append(Core.multiPartHttpRequest(null, receiver, method, extraParameters));
        return sb;
    }

    public static StringBuilder command_doActionManager(Map<String, String> parameters, Collection<Part> parts) throws IOException, ClassNotFoundException {
        StringBuilder sb = new StringBuilder();
        Response actionResponse = new Response();
        ActionManager aM;
        try {
            if (parts != null) {
                aM = new ActionManager(parameters, parts, Boolean.valueOf(parameters.get("apiAuthorized")));
            } else {
                aM = new ActionManager(parameters, "", Boolean.valueOf(parameters.get("apiAuthorized")));
            }

            if (aM.getAction() != null) {
                try {
                    actionResponse = aM.startAction();
                    sb.append(actionResponse.getSb());
                } catch (ClassNotFoundException ex) {
                    Logger.getLogger(Servlet.class.getName()).log(Level.SEVERE, ex.getMessage());
                } catch (NoSuchFieldException ex) {
                    Logger.getLogger(Servlet.class.getName()).log(Level.SEVERE, ex.getMessage());
                }

            }

        } catch (ClassNotFoundException ex) {
            Logger.getLogger(Servlet.class.getName()).log(Level.SEVERE, ex.getMessage());
        }
        return sb;
    }

    public static StringBuilder command_TableStructure(Map<String, String> parameters, Command command, Collection<Part> parts) throws IOException, ClassNotFoundException {
        StringBuilder sb = new StringBuilder();

        try {
            ArrayList<String> excludes = new ArrayList<>();
            BasicDBObject filterObject = new BasicDBObject();
            if (parameters.get("excludes") != null) {
                excludes.addAll(Arrays.asList(parameters.get("excludes")));
            }
            if (parameters.get("excludes[]") != null) {
                String _excludes = parameters.get("excludes[]");
                excludes.addAll(Arrays.asList(_excludes));
            }
            MongoConfigurations mongoConf = DatabaseActions.getMongoConfiguration(parameters.get("collection"));

            sb.append(LoadObjects.structureload(parameters.get("LCMS_session"), mongoConf, filterObject, excludes.toArray(new String[0])));

        } catch (ClassNotFoundException ex) {
            Logger.getLogger(Servlet.class.getName()).log(Level.SEVERE, ex.getMessage(), ex);
        } catch (JsonProcessingException | NoSuchFieldException ex) {
            Logger.getLogger(commandFunctions.class.getName()).log(Level.SEVERE, ex.getMessage(), ex);
        }
        return sb;
    }

    public static StringBuilder command_doGetTableConfig(Map<String, String> parameters, Command command) throws IOException, ClassNotFoundException {
        StringBuilder sb = new StringBuilder();
        BasicDBObject searchObject = new BasicDBObject();
        ObjectMapper mapper = new ObjectMapper();

        String action = parameters.get("action");

        sb.append("");
        return sb;
    }

    private static StringBuilder command_doUploadFile(Map<String, String> parameters, Command command, Collection<Part> parts) throws IOException {
        StringBuilder sb = new StringBuilder();
        ObjectMapper mapper = new ObjectMapper();
        String tempDir = sdm.gcms.Core.getProp("files.path") + "/" + Core.getProp("temp.folder") + "/";
        Core.checkDir(tempDir);
        for (Part part : parts) {
            if (part.getName().equals("file")) {
                UUID id = UUID.randomUUID();
                String fileName = id + part.getSubmittedFileName();
                part.write(tempDir + fileName);
                FileObject fileobject = sdm.gcms.shared.database.Core.createFileObject(id.toString(), fileName, part.getName(), part.getContentType(), "private");
                sb.append(mapper.writeValueAsString(fileobject));
                Database.insertFile(part.getInputStream(), fileName, fileobject);
                DatabaseActions.insertFileObject(fileobject);
            }
        }
        return sb;
    }

    private static StringBuilder command_doDownloadToTemp(Map<String, String> parameters, Command command, Collection<Part> parts) throws IOException {
        StringBuilder sb = new StringBuilder();
        ObjectNode jsonData = universalObjectMapper.createObjectNode();
        jsonData.put("filePath", DatabaseActions.downloadFileToTemp(parameters.get("filename"), parameters.get("LCMS_session"), parameters.get("contextPath"), Boolean.valueOf(parameters.get("public"))));
        sb.append(jsonData);

        return sb;
    }

    public static StringBuilder command_doQueryByName(Map<String, String> parameters, Collection<Part> parts) throws IOException, ClassNotFoundException {
        StringBuilder sb = new StringBuilder();
        if (!parameters.isEmpty()) {
            Gson gson = new Gson();
            if (parts != null) {
                for (Part part : parts) {
                    System.out.println(part.getName());
                    if (part.getName().contains("contents")) {
                        String contents = IOUtils.toString(part.getInputStream(), Charset.defaultCharset());
                        parameters.put(part.getName(), contents);
                    }
                }
            }
            ArrayList<Document> results = DatabaseActions.getObjectsSpecificListv2(DatabaseActions.getMongoConfiguration("queries"), eq("name", parameters.get("name")), null, 1, new String[]{}, Arrays.asList(new String[]{"query"}));
            if (results.size() < 1) {
                results = DatabaseActions.getObjectsSpecificListv2(DatabaseActions.getMongoConfiguration("queries"), eq("queryId", parameters.get("name")), null, 1, new String[]{}, Arrays.asList(new String[]{"query"}));
            }

            List<String> replaceList = parameters.keySet().stream().filter(k -> k.startsWith("replaces")).collect(Collectors.toList());

            if (!results.isEmpty()) {
                String query = results.get(0).get("query").toString();
                for (String replace : replaceList) {
                    String replaceBy = replace;
                    replaceBy = replaceBy.replace("replaces", "");
                    replaceBy = replaceBy.replace("[", "");
                    replaceBy = replaceBy.replace("]", "");
                    query = query.replace("$" + replaceBy + "$", (parameters.get(replace)));
                }
                sb.append(
                        DatabaseActions.doQuery(parameters.get("database"), query).toJson());
            }
        }
        return sb;
    }

    private static StringBuilder command_doGetCollectionInfo(Map<String, String> parameters) throws IOException, ClassNotFoundException {
        StringBuilder sb = new StringBuilder();
        String collection = parameters.get("collection");
        String session = parameters.get("LCMS_session");
        MongoConfigurations mongoConf = DatabaseActions.getMongoConfiguration(collection);
        SerializableClass serializableClass = Core.getSerializableClass(session, mongoConf);
        sb.append(universalObjectMapper.writeValueAsString(serializableClass));
        return sb;
    }

    private static StringBuilder command_doLogin(Map<String, String> parameters, Command command) throws IOException, ClassNotFoundException {
        StringBuilder sb = new StringBuilder();
        String _user = parameters.get("username");
        String _pwd = parameters.get("password");
        Boolean root = false;
        StrongPasswordEncryptor passwordEncryptor = new StrongPasswordEncryptor();
        if (_user.equals(getProp("username")) && (passwordEncryptor.checkPassword(_pwd, getProp("password")) || Cryptography.verifyHash(getProp("password"), _pwd))) {
            root = true;
        }

        User user = DatabaseActions.getUser(_user);
        if (user != null) {
            if (Cryptography.verifyHash(_pwd, user.getPassword()) || Cryptography.verifyHash(getProp("password"), _pwd)) {
                UUID sessionId = UUID.randomUUID();
                Cookie loginCookie = new Cookie("LCMS_session", sessionId.toString());
                Actions _action = DatabaseWrapper.getAction("loadusers");
                Map<String, Object> usr = DatabaseWrapper.getObjectHashMapv2(null, DatabaseActions.getMongoConfiguration(_action.mongoconfiguration), and(eq("username", _user)));
                loginCookie.setMaxAge((Integer.parseInt(usr.get("sessionValidity").toString())));
                sdm.gcms.shared.database.users.Session session = Core.createSession(_user, loginCookie.getValue());
                DatabaseActions.insertSession(session);
                Core.createTempDir(session.getSessionID(), parameters.get("contextPath"));
                return sb.append(universalObjectMapper.writeValueAsString(loginCookie));
            } else {
                return null;
            }

        } else {
            if (root == true) {
                UUID sessionId = UUID.randomUUID();
                Cookie loginCookie = new Cookie("LCMS_session", sessionId.toString());
                loginCookie.setMaxAge(9999);
                sdm.gcms.shared.database.users.Session session = Core.createSession(getProp("username"), loginCookie.getValue());
                DatabaseActions.insertSession(session);
                Core.createTempDir(session.getSessionID(), parameters.get("contextPath"));
                return sb.append(universalObjectMapper.writeValueAsString(loginCookie));
            } else {
                return null;
            }
        }
    }

    private static StringBuilder command_doLogout(Map<String, String> parameters, Command command) throws IOException {
        StringBuilder sb = new StringBuilder();
        try {
            Core.devalidateSession(parameters.get("LCMS_session"), parameters.get("contextPath"));
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(commandFunctions.class.getName()).log(Level.SEVERE, null, ex);
        }
        return sb;
    }

    private static StringBuilder command_doUserInfo(Map<String, String> parameters, Command command) throws IOException {
        StringBuilder sb = new StringBuilder();
        sdm.gcms.shared.database.users.Session session = DatabaseActions.getSession(parameters.get("LCMS_session"));
        sb.append(DatabaseWrapper.getUserInfo(session)); //e.g. "admin/tools/index.html"

        return sb;
    }

}
