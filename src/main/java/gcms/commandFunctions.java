/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.github.opendevl.JFlat;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoClientOptions.Builder;
import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.gt;
import static com.mongodb.client.model.Filters.regex;
import static com.mongodb.client.model.Filters.gte;
import java.io.File;
import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
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
import static gcms.Core.buildRegex;
import static gcms.Core.getLatestFile;
import static gcms.Core.getProp;
import static gcms.Core.readAllLines;
import static gcms.Core.search;
import gcms.GsonObjects.Core.Apikey;
import gcms.GsonObjects.Core.Command;
import gcms.GsonObjects.Core.MongoConfigurations;
import gcms.credentials.Cryptography;
import gcms.database.DatabaseActions;
import gcms.database.DatabaseWrapper;
import java.util.Collection;
import java.util.UUID;
import java.util.regex.Pattern;
import javax.servlet.http.Part;
import net.minidev.json.JSONArray;
import net.minidev.json.JSONObject;

import org.apache.commons.lang.StringUtils;
import org.bson.Document;

/**
 *
 * @author Matthias
 */
public class commandFunctions {

    public static StringBuilder doCommand(String name, Map<String, String[]> parameters, Command command, Collection<Part> parts) throws ClassNotFoundException, JsonProcessingException, NoSuchFieldException, IOException, Exception {
        name = command.getCommand();
        StringBuilder sb = new StringBuilder();

        Integer executionCount = Integer.parseInt(command.getExecutionCount());
        Integer executionLimit = Integer.parseInt(command.getExecutionLimit());
        Integer executionInterval = Integer.parseInt(command.getExecutionLimitInterval());

        if (name.equals("dobacklog")) {
            sb.append(command_doBacklog(parameters, command));
        }
        if (name.equals("doCheckCyberlabLogsForNewOrders")) {
            sb.append(command_checkCyberlabLogsForIncompleteOrders(parameters, command));
        }
        if (name.equals("doSendEmail")) {
            sb.append(command_sendEmail(parameters, command));
        }
        if (name.equals("doGetTableFromDocument")) {
            sb.append(command_doGetTableFromDocument(parameters, command));
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
            sb.append(command_doAPICall(parameters, command));
        }
        if (name.equals("doUploadFile")) {
            sb.append(command_doUploadFile(parameters, command, parts));
        }
        if (name.equals("doUploadFileToTemp")) {
            sb.append(command_doUploadFileToTemp(parameters, command, parts));
        }
        if (name.equals("doSendChat")) {
            sb.append(command_doSendChat(parameters, command, parts));
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

    public static StringBuilder command_checkCyberlabLogsForIncompleteOrders(Map<String, String[]> parameters, Command command) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String glimsLogFilterPath = getProp("glimsLogFilter.Path");
        StringBuilder sb = new StringBuilder();
        StringBuffer log = readAllLines(getLatestFile(glimsLogFilterPath, 2));
        String reg = buildRegex("\\*\\*\\*(.*)\\*\\*\\s\\d.*(cyberlabcode.*)(\\n|\\r|\\r\\n|\\n\\r)", null);//logFilter.getRegexExpression(), logFilter.getRegexFilters());
        List<String> regexResults = search(log, reg, new int[]{1, 2}, false);
        HashMap<String, String> processedResults = new HashMap<>();

        for (int i = 0; i < regexResults.size() - 2; i += 2) {
            String[] info = regexResults.get(i + 1).split("tests=");
            String info2 = "";
            if (info.length > 1) {
                info[0] = info[0].replace("=%22", "");
                info[0] = info[0].replace(",%20", " ");
                info[0] = URLDecoder.decode(info[0]);
                info[0] = info[0].replaceAll("\\<[^>]*>", "");
                info[0] = info[0].replaceAll("/[!@#$%^&*:,]/g", "");

                info[1] = info[1].replaceAll("/[!@#$%^&*:]/g", "");
                info[1] = info[1].replace("=on", "");
                info[1] = info[1].replace("&", ";");
                info2 = info[0] + "tests=" + info[1];
            } else {
                info[0] = URLDecoder.decode(info[0]);
                info[0] = info[0].replaceAll("/[!@#$%^&*:]/g", "");
                info2 = info[0] + "tests=0";
            }
            if (info[0].length() > 30) {
                processedResults.put(info[0].substring(0, 30), "\"issuer=" + regexResults.get(i).replace(" ", "") + "&" + info2);
            }
        }

        ArrayList<String> output = new ArrayList<>();
        Iterator it = processedResults.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry pair = (Map.Entry) it.next();
            output.add(Core.paramJson(pair.getValue().toString()));
            it.remove(); // avoids a ConcurrentModificationException
        }

        sb.append(mapper.writeValueAsString(output));
        return sb;
    }

    public static StringBuilder command_eHealthConnect() {
        StringBuilder sb = new StringBuilder();
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
        ArrayList<Document> results = DatabaseActions.getObjectsSpecificListv2(parameters.get("LCMS_session")[0], mongoConfiguration, and(regex("className", Pattern.compile(".*" + classNameSuffix))), null, 1000, new String[]{});
        //if no result found, try with other classname by searching for matching one in mongoconfigurations based on last word of object_type

        MongoConfigurations objectConfiguration = mapper.convertValue(results.get(0), gcms.GsonObjects.Core.MongoConfigurations.class);
        Map<String, Object> objectHashMap = DatabaseWrapper.getObjectHashMapv2(parameters.get("LCMS_session")[0], objectConfiguration, and(eq(objectConfiguration.getIdName(), parameters.get("parameters[object_id]")[0])));
        DatabaseWrapper.revertChanges(backlogs, objectHashMap, objectConfiguration);

        //Class cls = Class.forName(objectConfiguration.getClassName());
        //Object databaseItem = mapper.readValue(mapper.writeValueAsString(objectHashMap), cls);//createNoteObject(requestParameters.get("docid")[0], "create");
        //sb.append(mapper.writeValueAsString(databaseItem));
        sb = DatabaseWrapper.actionGETOBJECT_prepareObject(parameters.get("LCMS_session")[0], DatabaseActions.getMongoConfiguration(objectConfiguration.getMongoconfigurationsid()), false, objectHashMap);

        return sb;

    }

    public static StringBuilder command_doGetTableFromDocument(Map<String, String[]> parameters, Command command) throws ClassNotFoundException, JsonProcessingException, NoSuchFieldException, IOException {
        StringBuilder sb = new StringBuilder();
        BasicDBObject searchObject = new BasicDBObject();
        ObjectMapper mapper = new ObjectMapper();
        Map<String, String> commandParameters = mapper.readValue(command.getParameters(), new TypeReference<Map<String, String>>() {
        });

        MongoConfigurations mongoConfiguration = DatabaseActions.getMongoConfiguration("pages");
        String value = commandParameters.get("document");//parameters.get("title")[0];
        String table = commandParameters.get("table");//parameters.get("table")[0];
        searchObject.put("title", new BasicDBObject("$eq", value));
        Map<String, Object> searchResult = DatabaseWrapper.getObjectHashMapv2(parameters.get("LCMS_session")[0], mongoConfiguration, searchObject);
        String result = searchResult.get("contents").toString();
        //BasicDBObject obj = BasicDBObject.parse(mapper.(result));
        Map<String, Map> contentMap = mapper.readValue(result, Map.class);
        Map<String, Map> grids = contentMap.get("grids");
        Map grid = grids.values().stream().filter(m -> m.get("caption").equals(table)).findFirst().get();
        sb.append(mapper.writeValueAsString(grid));
        return sb;
    }

    private static StringBuilder command_doGetKPI(Map<String, String[]> parameters, Command command) throws ClassNotFoundException, NoSuchFieldException, IOException, Exception {
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

    private static StringBuilder command_doAPICall(Map<String, String[]> parameters, Command command) throws IOException, ClassNotFoundException {
        StringBuilder sb = new StringBuilder();
        BasicDBObject searchObject = new BasicDBObject();
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode jsonData = mapper.createObjectNode();
        Map<String, String> commandParameters = mapper.readValue(command.getParameters(), new TypeReference<Map<String, String>>() {
        });
        String apikey = commandParameters.get("apikey");
        String entrypoint = commandParameters.get("entrypoint");
        String call = commandParameters.get("call");
        MongoConfigurations mongoConfiguration = DatabaseActions.getMongoConfiguration("apikeys");
        searchObject.put("name", new BasicDBObject("$eq", apikey));
        Map<String, Object> searchResult = DatabaseWrapper.getObjectHashMapv2(parameters.get("LCMS_session")[0], mongoConfiguration, searchObject);
        Apikey key = mapper.convertValue(searchResult, gcms.GsonObjects.Core.Apikey.class);

        String receiver;
        receiver = key.getUrl();
        receiver += "/" + entrypoint + "/" + call;
        receiver += "?key=" + key.getApiKey();
        sb.append(Core.httpRequest(receiver));

        return sb;
    }

    private static StringBuilder command_doUploadFile(Map<String, String[]> parameters, Command command, Collection<Part> parts) throws IOException {
        StringBuilder sb = new StringBuilder();
        ObjectMapper mapper = new ObjectMapper();
        String tempDir = parameters.get("contextPath")[0] + "/" + Core.getProp("temp.folder") + "/";
        Core.checkDir(tempDir);
        for (Part part : parts) {
            String filename = part.getSubmittedFileName();
            if (filename != null) {
                UUID id = UUID.randomUUID();
                String fileName = id + filename;
                part.write(tempDir + fileName);
            }
        }
        return sb;
    }

    private static StringBuilder command_doUploadFileToTemp(Map<String, String[]> parameters, Command command, Collection<Part> parts) throws IOException {
        StringBuilder sb = new StringBuilder();
        ObjectMapper mapper = new ObjectMapper();
        String tempDir = parameters.get("contextPath")[0] + "/" + Core.getProp("temp.folder") + "/";
        Core.checkDir(tempDir);
        for (Part part : parts) {
            String filename = part.getSubmittedFileName();
            if (filename != null) {
                String fileName = filename;
                if (!Core.checkFile(tempDir + fileName)) {
                    part.write(tempDir + fileName);
                }
            }
        }
        return sb;
    }

    private static StringBuilder command_doSendChat(Map<String, String[]> parameters, Command command, Collection<Part> parts) throws IOException {
        StringBuilder sb = new StringBuilder();
        ObjectMapper mapper = new ObjectMapper();
        Map<String, String> commandParameters = mapper.readValue(command.getParameters(), new TypeReference<Map<String, String>>() {
        });
        return sb;
    }
}
