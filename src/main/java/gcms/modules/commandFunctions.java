/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.modules;

import gcms.Core;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.itextpdf.*;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.tool.xml.XMLWorkerHelper;

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
import static gcms.Core.getProp;
import static gcms.Core.readFile;
import gcms.GsonObjects.Core.Apikey;
import gcms.GsonObjects.Core.Command;
import gcms.GsonObjects.Core.FileObject;
import gcms.GsonObjects.Core.MongoConfigurations;
import gcms.GsonObjects.Core.User;
import gcms.GsonObjects.Other.SerializableClass;
import gcms.credentials.Cryptography;
import gcms.database.DatabaseActions;
import gcms.database.DatabaseWrapper;
import java.util.Collection;
import java.util.UUID;
import java.util.regex.Pattern;
import javax.servlet.http.Cookie;
import javax.servlet.http.Part;
import org.apache.commons.lang.StringUtils;
import org.bson.Document;
import org.jasypt.util.password.StrongPasswordEncryptor;
import static gcms.database.objects.get.GetObject.prepareObject;
import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.commons.codec.DecoderException;
import org.apache.commons.codec.binary.Hex;

/**
 *
 * @author Matthias
 */
public class commandFunctions {

    public static StringBuilder doCommand(String name, Map<String, String[]> parameters, Command command, Collection<Part> parts) throws ClassNotFoundException, JsonProcessingException, NoSuchFieldException, IOException {
        name = command.getCommand();
        StringBuilder sb = new StringBuilder();
        ObjectMapper mapper = new ObjectMapper();
        Integer executionCount = Integer.parseInt(command.getExecutionCount());
        Integer executionLimit = Integer.parseInt(command.getExecutionLimit());
        Integer executionInterval = Integer.parseInt(command.getExecutionLimitInterval());
        Map<String, String> commandParameters = mapper.readValue(command.getParameters(), new TypeReference<Map<String, String>>() {
        });
        Map<String, String> convertedParameters = parameters.entrySet().stream()
                .collect(Collectors.toMap(e -> (e.getKey()),
                        e -> (e.getValue()[0])));

        commandParameters.putAll(convertedParameters);

        if (name.equals("dobacklog")) {
            sb.append(command_doBacklog(parameters, command));
        }
        if (name.equals("doLoadTableConfig")) {
            sb.append(command_doGetTableConfig(commandParameters, command));
        }
        if (name.equals("doSendEmail")) {
            sb.append(command_sendEmail(parameters, command));
        }
        if (name.equals("doGetTableFromDocument")) {
            try {
                sb.append(command_doGetTableFromDocument(commandParameters, command));
            } catch (DecoderException ex) {
                Logger.getLogger(commandFunctions.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        if (name.equals("doGetKPI")) {
            sb.append(command_doGetKPI(parameters, command));
        }
        if (name.equals("doGetFiles")) {
            sb.append(command_doGetFiles(parameters, command));
        }
        if (name.equals("doGenerateHash")) {
            sb.append(command_doGenerateHash(parameters, command));
        }
        if (name.equals("doAPICall")) {
            sb.append(command_doAPICall(commandParameters, command, parts));
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
            sb.append(command_doQueryByName(commandParameters));
        }
        if (name.equals("doHtmlToPdf")) {
            sb.append(command_doHtmlToPdf(commandParameters));
        }
        if (name.equals("doGetClassInfo")) {
            sb.append(command_doGetCollectionInfo(commandParameters));
        }

        return sb;
    }

    public static StringBuilder command1() {
        StringBuilder sb = new StringBuilder();
        return sb;
    }

    public static StringBuilder doWorkflow(String type, MongoConfigurations _mongoConf) {
        StringBuilder sb = new StringBuilder();

        if (type.equals("add")) {
            //
        } else {
            if (type.equals("edit")) {
                //
            }
        }

        return sb;
    }

    public static StringBuilder command_sendEmail(Map<String, String[]> parameters, Command command) throws IOException {
        StringBuilder sb = new StringBuilder();
        ObjectMapper mapper = new ObjectMapper();
        Map<String, String> commandParameters = mapper.readValue(command.getParameters(), new TypeReference<Map<String, String>>() {
        });

        String subject = parameters.get("subject")[0];
        String text = parameters.get("text")[0];
        String from = parameters.get("from")[0];
        List<String> receivers = Arrays.asList(parameters.get("receivers"));

        Properties props = new Properties();
//        Map<String, Object> properties = mapper.readValue(commandParameters.get("mail.sessionProperties"), new TypeReference<Map<String, Object>>() {
//        });
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

    public static StringBuilder command_doBacklog(Map<String, String[]> parameters, Command command) throws ClassNotFoundException, JsonProcessingException, NoSuchFieldException, IOException {
        StringBuilder sb = new StringBuilder();
        ObjectMapper mapper = new ObjectMapper();
        gcms.GsonObjects.Core.Actions action = DatabaseWrapper.getAction(parameters.get("action")[0]);
        MongoConfigurations backlogConfiguration = DatabaseActions.getMongoConfiguration("backlog");
        ArrayList<Document> backlogs = DatabaseWrapper.getObjectSpecificRawDatav2(parameters.get("LCMS_session")[0],
                backlogConfiguration,
                and(eq("object_id", parameters.get("parameters[object_id]")[0]), gte("created_on", new Long(parameters.get("parameters[created_on]")[0]))));
        MongoConfigurations mongoConfiguration = DatabaseActions.getMongoConfiguration("mongoconfigurations");
        String classNameSuffix = parameters.get("parameters[object_type]")[0];
        classNameSuffix = classNameSuffix.substring(classNameSuffix.lastIndexOf("."));
        ArrayList<Document> results = DatabaseActions.getObjectsSpecificListv2(parameters.get("LCMS_session")[0], mongoConfiguration, and(regex("className", Pattern.compile(".*" + classNameSuffix))), null, 1000, new String[]{}, true);
        //if no result found, try with other classname by searching for matching one in mongoconfigurations based on last word of object_type

        MongoConfigurations objectConfiguration = mapper.convertValue(results.get(0), gcms.GsonObjects.Core.MongoConfigurations.class);
        Map<String, Object> objectHashMap = DatabaseWrapper.getObjectHashMapv2(parameters.get("LCMS_session")[0], objectConfiguration, and(eq(objectConfiguration.getIdName(), parameters.get("parameters[object_id]")[0])));
        DatabaseWrapper.revertChanges(backlogs, objectHashMap, objectConfiguration);

        sb = prepareObject(parameters.get("LCMS_session")[0], DatabaseActions.getMongoConfiguration(objectConfiguration.getMongoconfigurationsid()), false, objectHashMap);

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
        result = new String(Hex.decodeHex(result));
        Map<String, Map> contentMap = mapper.readValue(result, Map.class);

        Map<String, Map> grids = contentMap.get("grids");
        Map grid = grids.values().stream().filter(m -> m.get("caption").equals(table)).findFirst().get();
        sb.append(mapper.writeValueAsString(grid));
        return sb;
    }

    private static StringBuilder command_doGetKPI(Map<String, String[]> parameters, Command command) throws ClassNotFoundException, NoSuchFieldException, IOException {
        ObjectMapper mapper = new ObjectMapper();
        StringBuilder sb = new StringBuilder();
        ObjectNode jsonData = mapper.createObjectNode();
        List<String> lines = new ArrayList<>();
        List<String> allLines = new ArrayList<>();
        Map<String, String> commandParameters = mapper.readValue(command.getParameters(), new TypeReference<Map<String, String>>() {
        });
        String type = parameters.get("parameters[type]") != null ? parameters.get("parameters[type]")[0] : commandParameters.get("type");
        String filetype = parameters.get("parameters[filetype]") != null ? parameters.get("parameters[filetype]")[0] : commandParameters.get("filetype");
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

    private static StringBuilder command_doGetFiles(Map<String, String[]> parameters, Command command) throws IOException {
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

    private static StringBuilder command_doGenerateHash(Map<String, String[]> parameters, Command command) throws IOException {
        StringBuilder sb = new StringBuilder();
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode jsonData = mapper.createObjectNode();
        Map<String, String> commandParameters = mapper.readValue(command.getParameters(), new TypeReference<Map<String, String>>() {
        });
        sb.append(Cryptography.hash(parameters.get("parameters[passwordInput]")[0]));
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

    public static StringBuilder command_doAPICall(Map<String, String> parameters, Command command, Collection<Part> parts) throws IOException, ClassNotFoundException {
        StringBuilder sb = new StringBuilder();
        BasicDBObject searchObject = new BasicDBObject();
        ObjectMapper mapper = new ObjectMapper();

        String apikey = parameters.get("apikey");
        String path = parameters.get("path");
        String method = parameters.get("method");
        String extraParameters = null;
        if (parameters.get("extra") != null) {
            extraParameters = parameters.get("extra");
        }
        MongoConfigurations mongoConfiguration = DatabaseActions.getMongoConfiguration("apikeys");
        searchObject.put("name", new BasicDBObject("$eq", apikey));
        Map<String, Object> searchResult = DatabaseWrapper.getObjectHashMapv2(parameters.get("LCMS_session"), mongoConfiguration, searchObject);
        Apikey key = mapper.convertValue(searchResult, gcms.GsonObjects.Core.Apikey.class);
        String receiver;
        receiver = key.getUrl();
        receiver += path;
        receiver += "?key=" + key.getApiKey();
        //sb.append(Core.httpRequest(receiver, method, extraParameters));
        sb.append(Core.multiPartHttpRequest(parts, receiver, method, extraParameters));
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
        String tempDir = parameters.get("contextPath") + "/" + Core.getProp("temp.folder") + "/";

        Core.checkDir(tempDir);
//        for (Part part : parts) {
//            String filename = part.getSubmittedFileName();
//            if (filename != null) {
//                UUID id = UUID.randomUUID();
//                String fileName = id + filename;
//                part.write(tempDir + fileName);
//            }
//        }

        for (Part part : parts) {
            if (part.getName().equals("file")) {
                UUID id = UUID.randomUUID();
                String fileName = id + part.getSubmittedFileName();
                part.write(tempDir + fileName);
                FileObject fileobject = Core.createFileObject(id.toString(), fileName, part.getName(), part.getContentType(), "private");
                sb.append(mapper.writeValueAsString(fileobject));
                DatabaseActions.insertFile(part.getInputStream(), fileName, fileobject);
                DatabaseActions.insertFileObject(fileobject);
            }
        }
        return sb;
    }

    private static StringBuilder command_doDownloadToTemp(Map<String, String> parameters, Command command, Collection<Part> parts) throws IOException {
        StringBuilder sb = new StringBuilder();
        ObjectNode jsonData = Core.universalObjectMapper.createObjectNode();
        jsonData.put("filePath", DatabaseActions.downloadFileToTemp(parameters.get("filename"), parameters.get("LCMS_session"), parameters.get("contextPath"), Boolean.valueOf(parameters.get("public"))));
        sb.append(jsonData);

        return sb;
    }

    private static StringBuilder command_doQuery(Map<String, String> parameters) throws IOException {
        StringBuilder sb = new StringBuilder();

        sb.append(
                DatabaseActions.doQuery(parameters.get("database"), parameters.get("query")).toJson());

        return sb;
    }

    private static StringBuilder command_doQueryByName(Map<String, String> parameters) throws IOException, ClassNotFoundException {
        StringBuilder sb = new StringBuilder();
        ArrayList<Document> results = DatabaseActions.getObjectsSpecificListv2(DatabaseActions.getMongoConfiguration("queries"), eq("name", parameters.get("name")), null, 1, new String[]{}, Arrays.asList(new String[]{"query"}));
        List<String> replaceList = parameters.keySet().stream().filter(k -> k.startsWith("replaces")).collect(Collectors.toList());
        String query = results.get(0).get("query").toString();
        for (String replace : replaceList) {
            String replaceBy = replace;
            replaceBy = replaceBy.replace("replaces", "");
            replaceBy = replaceBy.replace("[", "");
            replaceBy = replaceBy.replace("]", "");
            query = query.replace("$" + replaceBy + "$", parameters.get(replace));
        }

        if (!results.isEmpty()) {
            sb.append(
                    DatabaseActions.doQuery(parameters.get("database"), query).toJson());
        }

        return sb;
    }

    private static StringBuilder command_doHtmlToPdf(Map<String, String> parameters) throws IOException {
        StringBuilder sb = new StringBuilder();
        String fileName = UUID.randomUUID() + ".pdf";
        String outputPath = gcms.Core.getTempDir(parameters.get("LCMS_session"), parameters.get("contextPath")) + fileName;
        String trimmedOutputPath = "./HTML/other/files/" + parameters.get("LCMS_session") + "/" + fileName;
//        if (_publicPage) {
//            if (Core.checkDir(parameters.get("contextPath") + "/public/")) {
//                outputPath = parameters.get("contextPath") + "/public/" + fileName;
//                trimmedOutputPath = "./HTML/other/files" + "/public/" + fileName;
//            }
//        }       

        try {
            com.itextpdf.text.Document document = new com.itextpdf.text.Document();
            PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(outputPath));
            document.open();
            XMLWorkerHelper.getInstance().parseXHtml(writer, document, new ByteArrayInputStream(readFile(Core.getProp("pdf.style")).getBytes()));
            XMLWorkerHelper.getInstance().parseXHtml(writer, document, new ByteArrayInputStream(parameters.get("html").getBytes()));
            document.close();
            ObjectNode jsonData = Core.universalObjectMapper.createObjectNode();
            jsonData.put("filePath", trimmedOutputPath);
            sb.append(jsonData);
        } catch (DocumentException ex) {
            Logger.getLogger(commandFunctions.class.getName()).log(Level.SEVERE, null, ex);
        }
        return sb;
    }

    private static StringBuilder command_doGetCollectionInfo(Map<String, String> parameters) throws IOException, ClassNotFoundException {
        StringBuilder sb = new StringBuilder();
        String collection = parameters.get("collection");
        String session = parameters.get("LCMS_session");
        MongoConfigurations mongoConf = DatabaseActions.getMongoConfiguration(collection);
        SerializableClass serializableClass = Core.getSerializableClass(session, mongoConf);
        sb.append(Core.universalObjectMapper.writeValueAsString(serializableClass));
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
                gcms.GsonObjects.Core.Actions _action = DatabaseWrapper.getAction("loadusers");
                Map<String, Object> usr = DatabaseWrapper.getObjectHashMapv2(null, DatabaseActions.getMongoConfiguration(_action.mongoconfiguration), and(eq("username", _user)));
                loginCookie.setMaxAge((Integer.parseInt(usr.get("sessionValidity").toString())));
                gcms.GsonObjects.Core.Session session = Core.createSession(_user, loginCookie.getValue());
                DatabaseActions.insertSession(session);
                Core.createTempDir(session.getSessionID(), parameters.get("contextPath"));
                return sb.append(Core.universalObjectMapper.writeValueAsString(loginCookie));
            } else {
                return null;
            }

        } else {
            if (root == true) {
                UUID sessionId = UUID.randomUUID();
                Cookie loginCookie = new Cookie("LCMS_session", sessionId.toString());
                loginCookie.setMaxAge(9999);
                gcms.GsonObjects.Core.Session session = Core.createSession(getProp("username"), loginCookie.getValue());
                DatabaseActions.insertSession(session);
                Core.createTempDir(session.getSessionID(), parameters.get("contextPath"));
                return sb.append(Core.universalObjectMapper.writeValueAsString(loginCookie));
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
        gcms.GsonObjects.Core.Session session = DatabaseActions.getSession(parameters.get("LCMS_session"));
        sb.append(DatabaseWrapper.getUserInfo(session)); //e.g. "admin/tools/index.html"

        return sb;
    }

}
