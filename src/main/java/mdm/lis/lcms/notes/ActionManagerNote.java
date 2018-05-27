/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm.lis.lcms.notes;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.lang.reflect.Field;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import mdm.Core;
import mdm.Mongo.DatabaseActions;
import java.util.UUID;
import mdm.GsonObjects.Note;
import mdm.GsonObjects.Session;
import mdm.Mongo.DatabaseWrapper;
import org.bson.Document;

/**
 *
 * @author matmey
 */
public class ActionManagerNote {

    String cookie;
    Core.Actions action;
    HashMap<String, String[]> requestParameters = new HashMap<String, String[]>();

    public ActionManagerNote(Map<String, String[]> requestParameters) {
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

    public StringBuilder startAction() throws ClassNotFoundException, IOException, JsonProcessingException, NoSuchFieldException {
        StringBuilder sb = new StringBuilder();
        if (cookie != null) {
            if (action == Core.Actions.NOTE_LOADNOTES) {
                sb.append(actionNOTE_LOADNOTES());
            }
            if (action == Core.Actions.NOTE_EDITNOTES) {
                sb.append(actionNOTE_EDITNOTES());
            }
            if (action == Core.Actions.NOTE_GETNOTE) {
                sb.append(actionNOTE_GETNOTE());
            }
            if (action == Core.Actions.NOTE_SAVENOTE) {
                sb.append(actionNOTE_SAVENOTE());
            }
        } else {
            sb.append(DatabaseWrapper.getCredentialPage());
        }

        return sb;
    }

    private StringBuilder actionNOTE_GETNOTE() throws IOException, ClassNotFoundException {
        StringBuilder sb = new StringBuilder();
        if (Core.checkSession(cookie)) {
            String id = requestParameters.get("id")[0];
            if (!id.equals("")) {
                Note note = DatabaseActions.getNote(DatabaseActions.getSession(cookie).getUsername(), id);
                sb.append(DatabaseWrapper.getNote(note));
            }

        }
        return sb;
    }

    private StringBuilder actionNOTE_EDITNOTES() throws IOException, ClassNotFoundException {
        StringBuilder sb = new StringBuilder();
        if (cookie != null) {
            if (Core.checkUserRoleValue(cookie, 2)) {
                requestParameters.remove("action");
                requestParameters.remove("LCMS_session");
                String operation = requestParameters.get("oper")[0];
                if (requestParameters.get("oper") != null) {
                    if (operation.equals("edit")) {
                        requestParameters.remove("oper");
                        Note note = createNoteObject(requestParameters.get("docid")[0], "create");
                        DatabaseWrapper.editObjectData(note, Core.MongoConf.NOTES, cookie);
                    }
                    if (operation.equals("add")) {
                        requestParameters.remove("oper");
                        UUID id = UUID.randomUUID();
                        Note note = createNoteObject(id.toString(), "create");
                        Session session = DatabaseActions.getSession(cookie);
                        note.setAuthor(session.getUsername());
                        note.setCreated(Instant.now().toEpochMilli() / 1000);
                        ObjectMapper mapper = new ObjectMapper();
                        Document document = Document.parse(mapper.writeValueAsString(note));
                        DatabaseWrapper.addObject(document, Core.MongoConf.NOTES, cookie);
                        //DatabaseActions.insertNote(note);
                    }

                }
            }
        } else {
            sb.append(DatabaseWrapper.getCredentialPage());
        }
        return sb;
    }

    private StringBuilder actionNOTE_LOADNOTES() throws JsonProcessingException, ClassNotFoundException, NoSuchFieldException, IOException {
        StringBuilder sb = new StringBuilder();
        if (cookie == null) {
            sb.append(DatabaseWrapper.getCredentialPage());
        } else {
            if (action == Core.Actions.NOTE_LOADNOTES) {
                if (Core.checkSession(cookie)) {
//                    ObjectMapper mapper = new ObjectMapper();
//                    ObjectNode jsonData = mapper.createObjectNode();
//                    ArrayList<Note> results = DatabaseActions.getNoteList(DatabaseActions.getSession(cookie).getUsername());
//
//                    ArrayList<HashMap> header = new ArrayList<>();
//                    ArrayList<HashMap> table = new ArrayList<>();
//                    HashMap tableEntry = new HashMap();
//                    for (Field field : Note.class.getFields()) {
//                        MdmAnnotations mdmAnnotations = field.getAnnotation(MdmAnnotations.class);
//                        HashMap headerEntry = new HashMap();
//                        headerEntry.put("name", field.getName());
//                        if (mdmAnnotations != null) {
//                            headerEntry.put("type", mdmAnnotations.type());
//                            headerEntry.put("visibleOnTable", mdmAnnotations.visibleOnTable());
//                            headerEntry.put("editable", mdmAnnotations.editable());
//                            headerEntry.put("tablename", "note_table");
//                            
//                        }
//                        header.add(headerEntry);
//                        tableEntry.put(field.getName(), "");
//                    }
//
//                    if (!results.isEmpty()) {
//                        jsonData.put("table", mapper.writeValueAsString(results));
//                    } else {
//                        jsonData.put("table", mapper.writeValueAsString(table));
//                    }
//
//                    jsonData.put("header", mapper.writeValueAsString(header));
//
//                    sb.append(jsonData);

                    sb.append(DatabaseWrapper.getObjectData(cookie, Core.MongoConf.NOTES, "note_table"));

                } else {
                    sb.append(DatabaseWrapper.getCredentialPage());
                };
            }

        }
        return sb;
    }

    private StringBuilder actionNOTE_SAVENOTE() throws IOException, ClassNotFoundException {
        StringBuilder sb = new StringBuilder();
        if (Core.checkSession(cookie)) {
            //String id = requestParameters.get("id")[0];
            //  Note note = MongoMain.getNote(MongoMain.getSession(cookie).getUsername(), id);
            // sb.append(PageLoader.getNote(note));

            String user = DatabaseActions.getSession(cookie).getUsername();
            String data = requestParameters.get("data")[0];
            String docid = requestParameters.get("docid")[0];

            DatabaseActions.updateNote(user, docid, data);
            // sb.append(createNoteList(notes));

        }
        return sb;
    }

    private Note createNoteObject(String _id, String type) throws ClassNotFoundException {
        Note note = new Note();
        note.setDocid(_id);

        List<Field> systemFields = Core.getSystemFields(Core.MongoConf.USERS.getClassName(), type);
        for (Field systemField : systemFields) {
            requestParameters.remove(systemField.getName());
        }

        if (requestParameters.get("title") != null) {
            note.setTitle(requestParameters.get("title")[0]);
        }
        if (requestParameters.get("content") != null) {
            note.setContent(requestParameters.get("content")[0].toString());
        }
        if (requestParameters.get("owner") != null) {
            note.setOwner((requestParameters.get("owner")[0]));
        }
        if (requestParameters.get("author") != null) {
            note.setAuthor((requestParameters.get("author")[0]));
        }
        if (requestParameters.get("qualitymanager") != null) {
            note.setQualitymanager((requestParameters.get("qualitymanager")[0]));
        }
        if (requestParameters.get("inspector") != null) {
            note.setInspector(requestParameters.get("inspector")[0]);
        }
        if (requestParameters.get("exciter") != null) {
            note.setExciter(requestParameters.get("exciter")[0]);
        }
        Session session = DatabaseActions.getSession(cookie);
        note.setLastEditedBy(session.getUsername());
        note.setEdited(Instant.now().toEpochMilli() / 1000);

        return note;
    }
}
