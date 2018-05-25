/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm.Tasks;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.lang.reflect.Field;
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
import mdm.GsonObjects.Other.Task;
import mdm.Mongo.DatabaseActions;
import mdm.Mongo.DatabaseWrapper;
import mdm.Workflows;
import org.bson.Document;

/**
 *
 * @author matmey
 */
public class ActionManagerTasks {

    String cookie;
    Core.Actions action;
    HashMap<String, String[]> requestParameters = new HashMap<String, String[]>();

    public ActionManagerTasks(Map<String, String[]> requestParameters) {
        this.requestParameters = new HashMap<String, String[]>(requestParameters);
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
        //HashMap<String, String[]> workflowParameters = new HashMap<>(requestParameters);
        //Workflows.workflowTask(workflowParameters, action);
        if (action == Core.Actions.TASKS_LOADTASKS) {
            sb.append(actionICT_LOADTASKS());
        }
        if (action == Core.Actions.TASKS_EDITTASKS) {
            sb.append(actionICT_EDITTASKS());
        }

        return sb;
    }

    private StringBuilder actionICT_EDITTASKS() throws IOException, ClassNotFoundException {
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
                    Task task = createTaskObject(requestParameters.get("taskid")[0], "edit");
                    DatabaseWrapper.editObjectData(task, Core.MongoConf.TASKS, cookie);
                }
                if (operation.equals("add") && checkUserRoleValue(cookie, 2)) {
                    requestParameters.remove("oper");
                    UUID id = UUID.randomUUID();
                    ObjectMapper mapper = new ObjectMapper();
                    Document document = Document.parse(mapper.writeValueAsString(createTaskObject(id.toString(), "create")));
                    DatabaseWrapper.addObject(document, Core.MongoConf.TASKS, cookie);
                }
            }
        } else {
            sb.append(DatabaseWrapper.getCredentialPage());
        }
        return sb;
    }

    private StringBuilder actionICT_LOADTASKS() throws JsonProcessingException, IOException, ClassNotFoundException, NoSuchFieldException {
        StringBuilder sb = new StringBuilder();
        if (cookie == null) {
            sb.append(DatabaseWrapper.getCredentialPage());
        } else {
            if (action == Core.Actions.TASKS_LOADTASKS) {
                if (Core.checkSession(cookie) && checkUserRoleValue(cookie, 2)) {
                    sb.append(DatabaseWrapper.getObjectData(cookie, Core.MongoConf.TASKS, "task_table"));
                } else {
                    sb.append(DatabaseWrapper.getCredentialPage());
                };
            }

        }
        return sb;
    }

    public Task createTaskObject(String _id, String type) throws ClassNotFoundException {

        Task task = new Task();
        task.setTaskid(_id);

        List<Field> systemFields = Core.getSystemFields(Core.MongoConf.TASKS.getClassName(), type);
        for (Field systemField : systemFields) {
            requestParameters.remove(systemField.getName());
        }

        if (requestParameters.get("description") != null) {
            task.setDescription(requestParameters.get("description")[0]);
        }
        if (requestParameters.get("category") != null) {
            task.setCategory(requestParameters.get("category")[0]);
        }
        if (requestParameters.get("assigned_to") != null) {
            task.setAssigned_to(requestParameters.get("assigned_to")[0]);
        }
        if (requestParameters.get("starttime") != null) {
            task.setStarttime(StringToLong(requestParameters.get("starttime")[0]));
        }
        if (requestParameters.get("endtime") != null) {
            task.setEndtime(StringToLong(requestParameters.get("endtime")[0]));
        }

        if (type.equals("create")) {
            task.setCreated_on(System.currentTimeMillis());
        }
        task.setEdited_on(System.currentTimeMillis());

        return task;
    }

}
