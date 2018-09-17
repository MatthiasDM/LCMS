/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm.lis.lcms.other.ict;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.lang.reflect.Field;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import mdm.Core;
import static mdm.Core.StringToLong;
import static mdm.Core.checkUserAgainstRoles;
import static mdm.Core.checkUserRoleValue;
import mdm.GsonObjects.Other.ICTTicket;
import mdm.Mongo.DatabaseActions;
import mdm.Mongo.DatabaseWrapper;
<<<<<<< HEAD
import mdm.workflows.Workflows;
import org.bson.Document;

/**
 *
 * @author matmey
 */
public class ActionManagerICT {

    String cookie;
    mdm.Config.Actions action;
    HashMap<String, String[]> requestParameters = new HashMap<String, String[]>();
    HashMap<String, String[]> workflowParameters = new HashMap<String, String[]>();

    public ActionManagerICT(Map<String, String[]> requestParameters) {
        this.requestParameters = new HashMap<String, String[]>(requestParameters);
        this.workflowParameters = new HashMap<>(requestParameters);
        if (requestParameters.get("action") != null) {
            action = mdm.Config.Actions.valueOf(requestParameters.get("action")[0]);
        }
        if (requestParameters.get("LCMS_session") != null) {
            cookie = requestParameters.get("LCMS_session")[0];
        }
    }

    public String getCookie() {
        return cookie;
    }

    public mdm.Config.Actions getAction() {
        return action;
    }

    public StringBuilder startAction() throws ClassNotFoundException, IOException, NoSuchFieldException {

        StringBuilder sb = new StringBuilder();
        if (action == mdm.Config.Actions.ICT_LOADTICKETS) {
            sb.append(actionICT_LOADTICKETS());
        }
        if (action == mdm.Config.Actions.ICT_EDITTICKETS) {
            sb.append(actionICT_EDITTICKETS());
        }
        return sb;
    }

    private StringBuilder actionICT_EDITTICKETS() throws IOException, ClassNotFoundException, JsonProcessingException, NoSuchFieldException {
        StringBuilder sb = new StringBuilder();
        List<String> roles = new ArrayList<>();
        roles.add(mdm.Config.Roles.ADMIN.toString());
        roles.add(mdm.Config.Roles.ICTMANAGER.toString());

        if (cookie != null && DatabaseActions.getSession(cookie) != null) {
            requestParameters.remove("action");
            requestParameters.remove("LCMS_session");
            String operation = requestParameters.get("oper")[0];
            if (requestParameters.get("oper") != null) {
                if (operation.equals("edit") && checkUserAgainstRoles(cookie, roles)) {
                    requestParameters.remove("oper");
                    ICTTicket ticket = createTicketObject(requestParameters.get("ticketid")[0], "edit");
                    DatabaseWrapper.editObjectData(ticket, mdm.Config.MongoConf.ICTTICKETS, cookie);

                    Workflows workflow = new Workflows();
                    workflow.workflowICTTicket(workflowParameters, "edit", cookie);

                }
                if (operation.equals("add") && checkUserRoleValue(cookie, 2)) {
                    requestParameters.remove("oper");
                    UUID id = UUID.randomUUID();
                    ObjectMapper mapper = new ObjectMapper();
                    Document document = Document.parse(mapper.writeValueAsString(createTicketObject(id.toString(), "create")));
                    DatabaseWrapper.addObject(document, mdm.Config.MongoConf.ICTTICKETS, cookie);
                }
            }
        } else {
            sb.append(DatabaseWrapper.getCredentialPage());
        }
        return sb;
    }

    private StringBuilder actionICT_LOADTICKETS() throws JsonProcessingException, IOException, ClassNotFoundException, NoSuchFieldException {
        StringBuilder sb = new StringBuilder();
        if (cookie == null) {
            sb.append(DatabaseWrapper.getCredentialPage());
        } else {
            if (action == mdm.Config.Actions.ICT_LOADTICKETS) {
                if (Core.checkSession(cookie) && checkUserRoleValue(cookie, 2)) {
                    sb.append(DatabaseWrapper.getObjectData(cookie, mdm.Config.MongoConf.ICTTICKETS, "ICT_ticket"));
                } else {
                    sb.append(DatabaseWrapper.getCredentialPage());
                };
            }

        }
        return sb;
    }

    private ICTTicket createTicketObject(String _id, String type) throws ClassNotFoundException {

        ICTTicket ticket = new ICTTicket();
        ticket.setTicketid(_id);

        List<Field> systemFields = Core.getSystemFields(mdm.Config.MongoConf.ICTTICKETS.getClassName(), type);
        for (Field systemField : systemFields) {
            requestParameters.remove(systemField.getName());
        }

        if (requestParameters.get("subject") != null) {
            ticket.setSubject(requestParameters.get("subject")[0]);
        }
        if (requestParameters.get("overview") != null) {
            ticket.setOverview(requestParameters.get("overview")[0]);
        }
        if (requestParameters.get("followup") != null) {
            ticket.setFollowup(requestParameters.get("followup")[0]);
        }
        if (requestParameters.get("status") != null) {
            ticket.setStatus(requestParameters.get("status")[0]);
        }
        if (requestParameters.get("involved_persons") != null) {
            ticket.setInvolved_persons(Arrays.asList(requestParameters.get("involved_persons")));
        }
        if (requestParameters.get("approver") != null) {
            ticket.setApprover(requestParameters.get("approver")[0]);
        }
        if (requestParameters.get("approved_on") != null) {
            ticket.setApproved_on(StringToLong(requestParameters.get("approved_on")[0]));
        }
        if (requestParameters.get("created_on") != null) {
            ticket.setCreated_on(StringToLong(requestParameters.get("created_on")[0]));
        }
        if (type.equals("create")) {
            ticket.setCreated_on(Instant.now().toEpochMilli());
            ticket.setCreated_by(DatabaseActions.getSession(cookie).getUsername());
        }
        ticket.setEdited_on(Instant.now().toEpochMilli());
=======
import mdm.Workflows;
import org.bson.Document;

/**
 *
 * @author matmey
 */
public class ActionManagerICT {

    String cookie;
    Core.Actions action;
    HashMap<String, String[]> requestParameters = new HashMap<String, String[]>();
    HashMap<String, String[]> workflowParameters = new HashMap<String, String[]>();

    public ActionManagerICT(Map<String, String[]> requestParameters) {
        this.requestParameters = new HashMap<String, String[]>(requestParameters);
        this.workflowParameters = new HashMap<>(requestParameters);
        if (requestParameters.get("action") != null) {
            action = Core.Actions.valueOf(requestParameters.get("action")[0]);
        }
        if (requestParameters.get("LCMS_session") != null) {
            cookie = requestParameters.get("LCMS_session")[0];
        }
    }

    public String getCookie() {
        return cookie;
    }

    public Core.Actions getAction() {
        return action;
    }

    public StringBuilder startAction() throws ClassNotFoundException, IOException, NoSuchFieldException {

        StringBuilder sb = new StringBuilder();
        if (action == Core.Actions.ICT_LOADTICKETS) {
            sb.append(actionICT_LOADTICKETS());
        }
        if (action == Core.Actions.ICT_EDITTICKETS) {
            sb.append(actionICT_EDITTICKETS());
        }
        return sb;
    }

    private StringBuilder actionICT_EDITTICKETS() throws IOException, ClassNotFoundException, JsonProcessingException, NoSuchFieldException {
        StringBuilder sb = new StringBuilder();
        List<String> roles = new ArrayList<>();
        roles.add(Core.Roles.ADMIN.toString());
        roles.add(Core.Roles.ICTMANAGER.toString());

        if (cookie != null && DatabaseActions.getSession(cookie) != null) {
            requestParameters.remove("action");
            requestParameters.remove("LCMS_session");
            String operation = requestParameters.get("oper")[0];
            if (requestParameters.get("oper") != null) {
                if (operation.equals("edit") && checkUserAgainstRoles(cookie, roles)) {
                    requestParameters.remove("oper");
                    ICTTicket ticket = createTicketObject(requestParameters.get("ticketid")[0], "edit");
                    DatabaseWrapper.editObjectData(ticket, Core.MongoConf.ICTTICKETS, cookie);

                    Workflows workflow = new Workflows();
                    workflow.workflowICTTicket(workflowParameters, "edit", cookie);

                }
                if (operation.equals("add") && checkUserRoleValue(cookie, 2)) {
                    requestParameters.remove("oper");
                    UUID id = UUID.randomUUID();
                    ObjectMapper mapper = new ObjectMapper();
                    Document document = Document.parse(mapper.writeValueAsString(createTicketObject(id.toString(), "create")));
                    DatabaseWrapper.addObject(document, Core.MongoConf.ICTTICKETS, cookie);
                }
            }
        } else {
            sb.append(DatabaseWrapper.getCredentialPage());
        }
        return sb;
    }

    private StringBuilder actionICT_LOADTICKETS() throws JsonProcessingException, IOException, ClassNotFoundException, NoSuchFieldException {
        StringBuilder sb = new StringBuilder();
        if (cookie == null) {
            sb.append(DatabaseWrapper.getCredentialPage());
        } else {
            if (action == Core.Actions.ICT_LOADTICKETS) {
                if (Core.checkSession(cookie) && checkUserRoleValue(cookie, 2)) {
                    sb.append(DatabaseWrapper.getObjectData(cookie, Core.MongoConf.ICTTICKETS, "ICT_ticket"));
                } else {
                    sb.append(DatabaseWrapper.getCredentialPage());
                };
            }

        }
        return sb;
    }

    private ICTTicket createTicketObject(String _id, String type) throws ClassNotFoundException {

        ICTTicket ticket = new ICTTicket();
        ticket.setTicketid(_id);

        List<Field> systemFields = Core.getSystemFields(Core.MongoConf.ICTTICKETS.getClassName(), type);
        for (Field systemField : systemFields) {
            requestParameters.remove(systemField.getName());
        }

        if (requestParameters.get("subject") != null) {
            ticket.setSubject(requestParameters.get("subject")[0]);
        }
        if (requestParameters.get("overview") != null) {
            ticket.setOverview(requestParameters.get("overview")[0]);
        }
        if (requestParameters.get("followup") != null) {
            ticket.setFollowup(requestParameters.get("followup")[0]);
        }
        if (requestParameters.get("status") != null) {
            ticket.setStatus(requestParameters.get("status")[0]);
        }
        if (requestParameters.get("involved_persons") != null) {
            ticket.setInvolved_persons(Arrays.asList(requestParameters.get("involved_persons")));
        }
        if (requestParameters.get("approver") != null) {
            ticket.setApprover(requestParameters.get("approver")[0]);
        }
        if (requestParameters.get("approved_on") != null) {
            ticket.setApproved_on(StringToLong(requestParameters.get("approved_on")[0]));
        }
        if (requestParameters.get("created_on") != null) {
        }
        if (type.equals("create")) {
            ticket.setCreated_on(Instant.now().toEpochMilli() / 1000);
            ticket.setCreated_by(DatabaseActions.getSession(cookie).getUsername());
        }
        ticket.setEdited_on(Instant.now().toEpochMilli() / 1000);
>>>>>>> origin/master

        return ticket;
    }

}
