/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.gte;
import java.io.IOException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.function.Function;
import java.util.stream.Collectors;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import mdm.Core.StringPair;
import static mdm.Core.buildRegex;
import static mdm.Core.getLatestFile;
import static mdm.Core.getProp;
import static mdm.Core.readAllLines;
import static mdm.Core.search;
import mdm.GsonObjects.Core.MongoConfigurations;
import mdm.Mongo.DatabaseActions;
import mdm.Mongo.DatabaseWrapper;
import org.bson.Document;

/**
 *
 * @author Matthias
 */
public class commandFunctions {

    public static StringBuilder doCommand(String name, Map<String, String[]> parameters) throws ClassNotFoundException, JsonProcessingException, NoSuchFieldException, IOException {
        StringBuilder sb = new StringBuilder();
        if (name.equals("dobacklog")) {
            sb.append(command_doBacklog(parameters));
        }
        if (name.equals("doCheckCyberlabLogsForNewOrders")) {
            sb.append(command_checkCyberlabLogsForIncompleteOrders(parameters));
        }
        if (name.equals("doSendEmail")) {
            sb.append(command_sendEmail(parameters));
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

    public static StringBuilder command_sendEmail(Map<String, String[]> parameters) throws IOException {
        StringBuilder sb = new StringBuilder();
        String subject = parameters.get("subject")[0];
        String text = parameters.get("text")[0];

        String from = parameters.get("from")[0];
        List<String> receivers = Arrays.asList(parameters.get("receivers"));

        final String username = getProp("mail.username");//"labo.bl@vzwgo.be"; //load username from profile
        final String password = getProp("mail.password"); //load password from profile
        Properties props = new Properties();
        props.put("mail.smtp.host", getProp("mail.smtp.host"));
        props.put("mail.smtp.port", getProp("smtp"));

        //Bypass the SSL authentication
        props.put("mail.smtp.ssl.enable", Boolean.valueOf(getProp("mail.smtp.ssl.enable")));
        props.put("mail.smtp.starttls.enable", Boolean.valueOf(getProp("mail.smtp.starttls.enable")));

        Session session = Session.getInstance(props,
                new javax.mail.Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        try {

            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(from));
            message.setRecipients(Message.RecipientType.TO,
                    InternetAddress.parse(String.join(",", receivers.toArray(new String[receivers.size()]))));
            message.setSubject(subject);
            //message.setText(text);
            message.setContent(text, "text/html; charset=utf-8");
            Transport.send(message);

            System.out.println("Done");

        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
        return sb;
    }

    public static StringBuilder command_checkCyberlabLogsForIncompleteOrders(Map<String, String[]> parameters) throws IOException {
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

    public static StringBuilder command_doBacklog(Map<String, String[]> parameters) throws ClassNotFoundException, JsonProcessingException, NoSuchFieldException, IOException {
        StringBuilder sb = new StringBuilder();
        ObjectMapper mapper = new ObjectMapper();
        mdm.GsonObjects.Core.Actions action = DatabaseWrapper.getAction(parameters.get("action")[0]);
        MongoConfigurations backlogConfiguration = DatabaseActions.getMongoConfiguration(action.mongoconfiguration);
        ArrayList<Document> backlogs = DatabaseWrapper.getObjectSpecificRawDatav2(parameters.get("LCMS_session")[0],
                backlogConfiguration,
                and(eq("object_id", parameters.get("parameters[object_id]")[0]), gte("created_on", new Long(parameters.get("parameters[created_on]")[0]))));
        MongoConfigurations mongoConfiguration = DatabaseActions.getMongoConfiguration("88d14fb4-6694-4aa9-aa67-de6857e328ec");
        ArrayList<Document> results = DatabaseActions.getObjectsSpecificListv2(parameters.get("LCMS_session")[0], mongoConfiguration, and(eq("className", parameters.get("parameters[object_type]")[0])), null, 1000, new String[]{});
        MongoConfigurations objectConfiguration = mapper.convertValue(results.get(0), mdm.GsonObjects.Core.MongoConfigurations.class);
        Map<String, Object> objectHashMap = DatabaseWrapper.getObjectHashMapv2(parameters.get("LCMS_session")[0], objectConfiguration, and(eq(objectConfiguration.getIdName(), parameters.get("parameters[object_id]")[0])));
        DatabaseWrapper.revertChanges(backlogs, objectHashMap, objectConfiguration);

        Class cls = Class.forName(objectConfiguration.getClassName());
        Object databaseItem = mapper.readValue(mapper.writeValueAsString(objectHashMap), cls);//createNoteObject(requestParameters.get("docid")[0], "create");
        sb.append(mapper.writeValueAsString(databaseItem));

        return sb;

    }

}
