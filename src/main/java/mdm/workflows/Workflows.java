/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm.workflows;

import com.fasterxml.jackson.core.JsonProcessingException;
import java.io.IOException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import mdm.Config.MongoConf;
import mdm.Core;
import mdm.Mongo.DatabaseActions;
import mdm.Mongo.DatabaseWrapper;
import mdm.workflows.Tasks.SendMail;
import org.bson.Document;

/**
 *
 * @author matmey
 */
public class Workflows {

    //Workflow ICTTickets
    public static void workflowICTTicket(HashMap<String, String[]> requestParameters, String operation, String cookie) throws ClassNotFoundException, JsonProcessingException, IOException, NoSuchFieldException {

        String[] choices = {"Gemeld", "Analyse", "Validatie", "Voltooid"};
        String[] choiceValues = {"0", "1", "2", "3"};
        if (operation.equals("add")) {
            String description;
            description = "ICT-ticket: " + requestParameters.get("subject")[0] + "\n Dit ticket werd aan u toegewezen.";
            String userid = DatabaseActions.getSession(cookie).getUserid();
            HashMap<String, String[]> taskParameters = new HashMap<String, String[]>();
            taskParameters.put("description", new String[]{description});
            taskParameters.put("category", new String[]{MongoConf.TASKS.name()});
            taskParameters.put("assigned_to", new String[]{userid});
            taskParameters.put("starttime", new String[]{String.valueOf(Instant.now().toEpochMilli() / 1000)});
            taskParameters.put("endtime", new String[]{String.valueOf((Instant.now().toEpochMilli() / 1000) + (30 * 24 * 3600))});
            taskParameters.put("created_on", new String[]{String.valueOf(Instant.now().toEpochMilli() / 1000)});
            taskParameters.put("edited_on", new String[]{String.valueOf(Instant.now().toEpochMilli() / 1000)});
            taskParameters.put("action", new String[]{mdm.Config.Actions.TASKS_EDITTASKS.name()});
            taskParameters.put("LCMS_session", new String[]{cookie});
            taskParameters.put("oper", new String[]{"add"});
            DatabaseWrapper.actionEDITOBJECT(taskParameters, cookie, MongoConf.TASKS);

            List<String> receivers = new ArrayList<>();
            receivers.addAll(Arrays.asList(requestParameters.get("involved_persons")));
            String created_by = DatabaseActions.getSession(cookie).getUserid();
            receivers.add(created_by);
            receivers.add(requestParameters.get("approver")[0]);
            String content = "Beste,<br><br>Er is een nieuw ICT-ticket aangemaakt.<br><br><b>Titel:</b> " + requestParameters.get("subject")[0] + "<br><br><b>Inhoud:</b><br><br>" + requestParameters.get("overview")[0];
            HashMap<String, Object> parameters = Core.createMailParameters(receivers, "Update ICT-melding: " + requestParameters.get("subject")[0], content);
            SendMail.send(parameters);

            //ActionManagerTasks aM = new ActionManagerTasks(taskParameters);
            //aM.startAction();
            //ObjectMapper mapper = new ObjectMapper();
            //Document document = Document.parse(mapper.writeValueAsString(ActionManagerTasks.createTaskObject(id.toString(), "create", taskParameters, cookie)));
            //DatabaseWrapper.addObject(document, mdm.Config.MongoConf.TASKS, cookie);
        }
        if (operation.equals("edit")) {
            if (Arrays.asList(choiceValues).contains(requestParameters.get("status")[0])) {
                Document doc;
                doc = DatabaseActions.getObject(mdm.Config.MongoConf.ICTTICKETS, requestParameters.get("ticketid")[0]);
                if (doc.get("status").equals(requestParameters.get("status")[0])) {
                    List<String> receivers = new ArrayList<>();
                    receivers.addAll(Arrays.asList(requestParameters.get("involved_persons")));
                    String content = "";
                    String template = Core.loadWebFile(Core.getProp("NC"));
                    String tableRow = Core.loadWebFile(Core.getProp("table-row"));
                    template = template.replace("LCMS-module", "Non-conformiteit (ICT)");
                    template = template.replace("LCMS-titel", "Titel: " + requestParameters.get("subject")[0]);
                    content = tableRow.replace("LCMS-content", "Beste,<br><br>Bovenstaand ICT-ticket is van status gewijzigd. <br><br>");
                    content += tableRow.replace("LCMS-content", "<b>Onderwerp</b><br>" + requestParameters.get("overview")[0]);
                    content += tableRow.replace("LCMS-content", "<b>Opvolging</b><br>" + requestParameters.get("followup")[0]);
                    template = template.replace("LCMS-content", content);
                    if (!requestParameters.get("status")[0].equals("3")) {
                        //content = "Beste,<br><br>Bovenstaand ICT-ticket is van status gewijzigd. <br><br> <b>Onderwerp</b><br>" + requestParameters.get("overview")[0] + "<br><br> <b>Opvolging</b><br>" + requestParameters.get("followup")[0];
                        content = template;
                    } else {
                        receivers.add(requestParameters.get("approver")[0]);
                        content = "Beste,<br><br>Bovenstaand ICT-ticket moet door u gekeurd worden. Gelieve dit document te controleren en te keuren.";
                    }
                    HashMap<String, Object> parameters = Core.createMailParameters(receivers, "Update ICT-melding: " + requestParameters.get("subject")[0], content);
                    SendMail.send(parameters);

                }
            }

        }

    }
    

    
}
