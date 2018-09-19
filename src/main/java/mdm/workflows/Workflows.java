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
import mdm.Tasks.Actions.SendMail;
import org.bson.Document;

/**
 *
 * @author matmey
 */
public class Workflows {

    //Workflow ICTTickets
    public void workflowICTTicket(HashMap<String, String[]> requestParameters, String action, String cookie) throws ClassNotFoundException, JsonProcessingException, IOException, NoSuchFieldException {

        String[] choices = {"Gemeld", "Analyse", "Validatie", "Voltooid"};
        String[] choiceValues = {"0", "1", "2", "3"};
        if (action.equals("add")) {
            String description;
            description = "ICT-ticket: " + requestParameters.get("subject") + "\n Dit ticket werd aan u toegewezen.";
            String userid = DatabaseActions.getSession(cookie).getUserid();
            HashMap<String, String[]> taskParameters = new HashMap<String, String[]>();
            taskParameters.put("description", new String[]{description});
            taskParameters.put("category", new String[]{MongoConf.TASKS.name()});
            taskParameters.put("assigned_to", new String[]{userid});
            taskParameters.put("start_time", new String[]{String.valueOf(Instant.now().toEpochMilli() / 1000)});
            taskParameters.put("end_time", new String[]{String.valueOf((Instant.now().toEpochMilli() / 1000) + (30 * 24 * 3600))});
            taskParameters.put("created_on", new String[]{String.valueOf(Instant.now().toEpochMilli() / 1000)});
            taskParameters.put("edited_on", new String[]{String.valueOf(Instant.now().toEpochMilli() / 1000)});            
            taskParameters.put("action", new String[]{mdm.Config.Actions.TASKS_EDITTASKS.name()});
            taskParameters.put("LCMS_session", new String[]{cookie});
            taskParameters.put("oper", new String[]{"add"});
            DatabaseWrapper.actionEDITOBJECT(taskParameters, cookie, MongoConf.TASKS);
            //ActionManagerTasks aM = new ActionManagerTasks(taskParameters);
            //aM.startAction();
            
            
            //ObjectMapper mapper = new ObjectMapper();
            //Document document = Document.parse(mapper.writeValueAsString(ActionManagerTasks.createTaskObject(id.toString(), "create", taskParameters, cookie)));
            //DatabaseWrapper.addObject(document, mdm.Config.MongoConf.TASKS, cookie);
        }
        if (action.equals("edit")) {
            if (Arrays.asList(choiceValues).contains(requestParameters.get("status")[0])) {
                Document doc;
                doc = DatabaseActions.getObject(mdm.Config.MongoConf.ICTTICKETS, requestParameters.get("ticketid")[0]);
                if (doc.get("status").equals(requestParameters.get("status")[0])) {
                    List<String> involved_persons = Arrays.asList(requestParameters.get("involved_persons"));
                    List<String> receivers = new ArrayList<>();
                    List<String> emails = new ArrayList<>();
                    receivers.addAll(involved_persons);
                    receivers.add(requestParameters.get("created_by")[0]);
                    for (String receiver : receivers) {
                        try {
                            emails.add(DatabaseActions.getUser(receiver, "userid").getEmail());
                        } catch (Exception e) {
                            System.out.print(e.getMessage());
                        }
                    }
                    HashMap<String, Object> parameters = new HashMap<>();
                    parameters.put("subject", "Update ICT-melding: " + requestParameters.get("subject")[0]);
                    parameters.put("from", "labo.bl@azzeno.be");
                    parameters.put("receivers", emails);
                    if (!requestParameters.get("status")[0].equals("3")) {
                        parameters.put("text", "Beste,\nBovenstaand ICT-ticket is van status gewijzigd.");
                    } else {
                        parameters.put("text", "Beste,\nBovenstaand ICT-ticket moet door u gekeurd worden. Gelieve dit document te controleren en te keuren.");
                    }
                    //SendMail.send(parameters);

                }
            }

        }

    }
}
