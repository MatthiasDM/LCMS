/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.servlet;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mongodb.BasicDBObject;
import gcms.Core;
import static gcms.Core.loadWebFile;
import gcms.GsonObjects.Core.Command;
import gcms.GsonObjects.Core.MongoConfigurations;
import gcms.database.DatabaseActions;
import gcms.database.DatabaseWrapper;
import static gcms.database.objects.edit.EditObject.editObject;
import static gcms.database.objects.get.GetObject.getObject;
import static gcms.database.objects.load.LoadObjects.dataload;
import static gcms.database.objects.load.LoadObjects.loadObjects;
import gcms.modules.commandFunctions;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.io.IOUtils;

/**
 *
 * @author Matthias
 */
public class ActionManager {

    String cookie, hostName;
    Boolean apiAuthorized;
    gcms.GsonObjects.Core.Action.Actions action;
    HashMap<String, String> requestParameters = new HashMap<String, String>();
    Collection<Part> parts;
    int responseStatus = HttpServletResponse.SC_ACCEPTED;

    public ActionManager(Map<String, String> requestParameters, String hostName, Boolean apiAuthorized) throws ClassNotFoundException, IOException {
        this.requestParameters = new HashMap<String, String>(requestParameters);
       
        this.apiAuthorized = apiAuthorized;
        this.hostName = hostName;
        if (requestParameters.get("action") != null) {
            action = DatabaseWrapper.getAction(requestParameters.get("action"));
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
        }
        if (requestParameters.get("LCMS_session") != null) {
            cookie = requestParameters.get("LCMS_session");
        }
        this.parts = parts;
    }

    public String getCookie() {
        return cookie;
    }

    public gcms.GsonObjects.Core.Action.Actions getAction() {
        return action;
    }

    public Response startAction() throws ClassNotFoundException, IOException, JsonProcessingException, NoSuchFieldException {
        StringBuilder sb = new StringBuilder();
        ObjectMapper mapper = new ObjectMapper();
        if (action == null) {
            responseStatus = HttpServletResponse.SC_NOT_FOUND;
            sb.append("Specific action (").append(requestParameters.get("action")).append(") was not found.");
        }
        MongoConfigurations mongoConfiguration = DatabaseActions.getMongoConfiguration(action.mongoconfiguration);
        gcms.objects.collections.Collection collection = DatabaseActions.getCollection(action.collection);
        
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
                    sb.append(getObject(cookie, mongoConfiguration, key, value, publicPage, collection));
                }
            }

        }

        if (action.name.toUpperCase().startsWith("DO")) {
            if (mongoConfiguration.getCollection().equals("commands")) {
                requestParameters.put("apiAuthorized", apiAuthorized.toString());
                String key = requestParameters.get("k");
                BasicDBObject searchObject = new BasicDBObject();
                searchObject.put("name", new BasicDBObject("$eq", key));
                Map<String, Object> searchResult = DatabaseWrapper.getObjectHashMapv2(cookie, mongoConfiguration, searchObject);
                Command command = mapper.convertValue(searchResult, gcms.GsonObjects.Core.Command.class);
                List<String> accesstype = command.getAccessType();
                if (accesstype.contains("0")) {
                    sb.append(commandFunctions.doCommand(key, requestParameters, command, parts));
                } else {
                    if (accesstype.contains("1") && !accesstype.contains("2") && (Core.checkSession(cookie) && !publicPage)) {
                        List<String> userRoles = Core.getUserRoles(getCookie());
                        List<String> executionRoles = command.getExecutionRoles();
                        if (Core.notNullNorEmpty(executionRoles)) {
                            if (CollectionUtils.containsAny(userRoles, executionRoles)) {
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
            if ((Core.checkSession(cookie) && !publicPage)) {
                if (parts != null) {
                    for (Part part : parts) {
                        if (part.getName().equals("contents")) {
                            requestParameters.put("contents", IOUtils.toString(part.getInputStream(), Charset.defaultCharset()));
                        }
                    }
                }

                if (action.name.toUpperCase().startsWith("EDIT")) {
                    sb.append(editObject(requestParameters, cookie, mongoConfiguration,collection));

                } else {
                    if (action.name.toUpperCase().startsWith("LOAD")) {
                        ArrayList<String> excludes = new ArrayList<>();
                        BasicDBObject filterObject = new BasicDBObject();
                        if (requestParameters.get("excludes") != null) {
                            excludes.addAll(Arrays.asList(requestParameters.get("excludes")));
                        }
                        if (requestParameters.get("excludes[]") != null) {
                            String _excludes = requestParameters.get("excludes[]");
                            excludes.addAll(Arrays.asList(_excludes));
                        }
                        //excludes.add("contents");
                        if (mongoConfiguration.getCollection().equals("backlog")) {
                            filterObject.put("object_id", new BasicDBObject("$eq", requestParameters.get("object_id")));
                        }
                        if (mongoConfiguration.getCollection().equals("document")) {
                            if (requestParameters.get("prefix") != null) {
                                filterObject.put("prefix", new BasicDBObject("$eq", requestParameters.get("prefix")));
                            }
                        }
                        sb.append(loadObjects(cookie, mongoConfiguration, filterObject, excludes.toArray(new String[0]), collection));
                    } else {
                        if (action.name.toUpperCase().startsWith("GET")) {
                            String key = requestParameters.get("k");
                            String value = requestParameters.get("v");
                            sb.append(getObject(cookie, mongoConfiguration, key, value, publicPage, collection));
                        }
                        if (action.name.toUpperCase().startsWith("DATA")) {

                            BasicDBObject filterObject = new BasicDBObject();

                            //excludes.add("contents");
                            if (mongoConfiguration.getCollection().equals("backlog")) {
                                filterObject.put("object_id", new BasicDBObject("$eq", requestParameters.get("object_id")));
                            }
                            if (mongoConfiguration.getCollection().equals("document")) {
                                if (requestParameters.get("prefix") != null) {
                                    filterObject.put("prefix", new BasicDBObject("$eq", requestParameters.get("prefix")));
                                }
                            }

                            sb.append(Core.universalObjectMapper.writeValueAsString(dataload(cookie, mongoConfiguration, requestParameters, filterObject, collection)));
                        }
                    }
                }
            } else {
                if (!publicPage) {
                    sb.append(DatabaseWrapper.getWebPage("credentials/index.html", new String[]{}));
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
