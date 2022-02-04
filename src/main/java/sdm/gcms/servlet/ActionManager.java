/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package sdm.gcms.servlet;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mongodb.BasicDBObject;
import sdm.gcms.Config;
import static sdm.gcms.Config.loadWebFile;

import sdm.gcms.database.DatabaseWrapper;
import sdm.gcms.database.GetResponse;
import static sdm.gcms.database.objects.edit.EditObject.editObject;
import static sdm.gcms.database.objects.get.GetObject.getObject;
import sdm.gcms.database.objects.load.LoadObjects;
import static sdm.gcms.database.objects.load.LoadObjects.dataload;
import sdm.gcms.modules.commandFunctions;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.io.IOUtils;
import sdm.gcms.shared.database.collections.MongoConfigurations;
import static sdm.gcms.shared.database.Core.universalObjectMapper;
import sdm.gcms.shared.database.collections.ActionPrivelege;
import sdm.gcms.shared.database.collections.Actions;
import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.or;
import java.util.stream.Collectors;
import sdm.gcms.shared.database.Command;
import sdm.gcms.shared.database.Database;
import static sdm.gcms.shared.database.Database.getUserRoles;
import sdm.gcms.shared.database.users.Role;

/**
 *
 * @author Matthias
 */
public class ActionManager {

    String cookie, hostName;
    Boolean apiAuthorized;
    Actions action;
    List<ActionPrivelege> actionPriveleges;
    HashMap<String, String> requestParameters = new HashMap<String, String>();
    Collection<Part> parts;
    int responseStatus = HttpServletResponse.SC_OK;

    public ActionManager(Map<String, String> requestParameters, Boolean apiAuthorized) throws ClassNotFoundException, IOException {
        this.requestParameters = new HashMap<String, String>(requestParameters);
        this.apiAuthorized = apiAuthorized;
        this.hostName = hostName;
        if (requestParameters.get("action") != null) {
            action = Database.getDatabaseAction(requestParameters.get("action"));
            actionPriveleges = Database.getDatabaseActionPrivelege(action);
        }
        if (requestParameters.get("LCMS_session") != null) {
            cookie = requestParameters.get("LCMS_session");
        }
    }

    public ActionManager(Map<String, String> requestParameters, Collection<Part> parts, Boolean apiAuthorized) throws ClassNotFoundException, IOException {
        this.apiAuthorized = apiAuthorized;
        this.requestParameters = new HashMap<>(requestParameters);
        if (requestParameters.get("action") != null) {
            action = DatabaseWrapper.getAction(requestParameters.get("action"));
            actionPriveleges = Database.getDatabaseActionPrivelege(action);
        }
        if (requestParameters.get("LCMS_session") != null) {
            cookie = requestParameters.get("LCMS_session");
        }
        this.parts = parts;
    }

    public String getCookie() {
        return cookie;
    }

    public Actions getAction() {
        return action;
    }

    public Response startAction() throws ClassNotFoundException, IOException, JsonProcessingException, NoSuchFieldException {
        StringBuilder sb = new StringBuilder();
        ObjectMapper mapper = new ObjectMapper();
        if (action == null) {
            responseStatus = HttpServletResponse.SC_NOT_FOUND;
            sb.append("Specific action (").append(requestParameters.get("action")).append(") was not found.");
        }
        MongoConfigurations mongoConfiguration = Database.getMongoConfiguration(action.mongoconfiguration);
        MongoConfigurations collection = Database.getMongoConfiguration(action.mongoconfiguration);

        Boolean publicPage = false;

        if (mongoConfiguration.getCollection().equals("pages") && requestParameters.get("k") != null && requestParameters.get("v") != null) {
            String key = requestParameters.get("k");
            String value = requestParameters.get("v");
            BasicDBObject searchObject = new BasicDBObject();
            searchObject.put(key, new BasicDBObject("$eq", value));
            Map<String, Object> searchResult = DatabaseWrapper.getObjectHashMapv2(cookie, mongoConfiguration, searchObject);
            String accesstype = searchResult.get("accessType").toString();
            if (accesstype.equals("0")) {
                publicPage = true;
                if (publicPage) {
                    sb.append(getObject(cookie, mongoConfiguration, key, value, publicPage, null));
                }
            } else {
                if (DatabaseWrapper.checkActionAccess(cookie, actionPriveleges)) {
                    sb.append(getObject(cookie, mongoConfiguration, key, value, publicPage, null));
                } else {
                    sb.append(DatabaseWrapper.getWebPage("credentials/index.html", new String[]{}));
                }

            }

        } else {

            if (action.name.toUpperCase().startsWith("DO")) {
                if (mongoConfiguration.getCollection().equals("commands")) {
                    requestParameters.put("apiAuthorized", apiAuthorized.toString());
                    String key = requestParameters.get("k");
                    //BasicDBObject searchObject = new BasicDBObject();
                    //searchObject.put("name", new BasicDBObject("$eq", key));
                    Map<String, Object> searchResult = DatabaseWrapper.getObjectHashMapv2(cookie, mongoConfiguration, or(eq("name", key), eq(mongoConfiguration.getIdName(), key)));
                    Command command = mapper.convertValue(searchResult, Command.class);
                    List<String> accesstype = command.getAccessType();
                    if (accesstype.contains("0")) {
                        sb.append(commandFunctions.doCommand(key, requestParameters, command, parts));
                    } else {
                        if (accesstype.contains("1") && !accesstype.contains("2") && (Config.checkSession(cookie) && !publicPage)) {
                            List<Role> userRoles = getUserRoles(getCookie());
                            List<String> userRoleNames = userRoles.stream().map(p -> p.getRole()).collect(Collectors.toList());
                            List<String> executionRoles = command.getExecutionRoles();
                            if (Config.notNullNorEmpty(executionRoles)) {
                                if (CollectionUtils.containsAny(userRoleNames, executionRoles)) {
                                    sb.append(commandFunctions.doCommand(key, requestParameters, command, parts));
                                }
                            } else {
                                sb.append(commandFunctions.doCommand(key, requestParameters, command, parts));
                            }
                        } else {
                            if (accesstype.contains("2") && apiAuthorized) {
                                sb.append(commandFunctions.doCommand(key, requestParameters, command, parts));
                            }
                        }
                    }
                }
            } else {
                if (DatabaseWrapper.checkActionAccess(cookie, actionPriveleges)) {
                    if (parts != null) {
                        for (Part part : parts) {
                            if (part.getName().equals("contents")) {
                                requestParameters.put("contents", IOUtils.toString(part.getInputStream(), Charset.defaultCharset()));
                            }
                        }
                    }
                    if (action.name.toUpperCase().startsWith("EDIT")) {
                        sb.append(editObject(requestParameters, cookie, mongoConfiguration, action));
                    } else {
                        if (action.name.toUpperCase().startsWith("GET")) {
                            String key = requestParameters.get("k");
                            String value = requestParameters.get("v");
                            sb.append(getObject(cookie, mongoConfiguration, key, value, publicPage, action));
                        }
                        if (action.name.toUpperCase().startsWith("DATA")) {
                            BasicDBObject filterObject = new BasicDBObject();
                            if (mongoConfiguration.getCollection().equals("backlog")) {
                                filterObject.put("object_id", new BasicDBObject("$eq", requestParameters.get("object_id")));
                            }
                            GetResponse restResponse = dataload(cookie, mongoConfiguration, requestParameters, filterObject);
                            if (restResponse.getRecords() == 1) {
                                Boolean parseAsPage = false;
                                parseAsPage = Boolean.parseBoolean(requestParameters.get("parse_as_page"));
                                restResponse = LoadObjects.parseAsPage(cookie, mongoConfiguration, publicPage, restResponse);
                            }
                            
                            sb.append(universalObjectMapper.writeValueAsString(restResponse));
                        }
                    }
                } else {
                    if (!publicPage) {
                        sb.append(DatabaseWrapper.getWebPage("credentials/index.html", new String[]{}));
                    }
                }
            }

        }

        return new Response(responseStatus, sb);
    }

    private ObjectNode getEditablePage(Map<String, Object> editablePage) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode jsonData = mapper.createObjectNode();
        ObjectNode jsonReplaces = mapper.createObjectNode();
        jsonReplaces.put("LCMSEditablePage-id", editablePage.get("validationid").toString());
        jsonReplaces.put("LCMSEditablePage-content", editablePage.get("contents").toString());
        editablePage.put("contents", "");
        jsonData.put("webPage", loadWebFile("validation/template/index.html"));
        jsonData.set("replaces", jsonReplaces);
        return jsonData;
    }
}
