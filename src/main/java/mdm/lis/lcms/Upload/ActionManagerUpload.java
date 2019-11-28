/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm.lis.lcms.Upload;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.util.HashMap;
import java.util.Map;
import mdm.Core;
import mdm.Mongo.DatabaseActions;
import java.io.IOException;
import com.mongodb.client.gridfs.GridFSBucket;
import com.mongodb.client.gridfs.GridFSBuckets;
import com.mongodb.client.gridfs.model.GridFSUploadOptions;
import java.io.InputStream;
import java.lang.reflect.Field;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import javax.servlet.http.Part;
import mdm.Config.MongoConf;
import static mdm.Core.checkUserRoleValue;
import mdm.GsonObjects.Core.FileObject;
import mdm.GsonObjects.Core.User;
import static mdm.Mongo.DatabaseActions.getDocumentPriveleges;
import mdm.pojo.annotations.MdmAnnotations;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;

/**
 *
 * @author matmey
 */
public class ActionManagerUpload {

    String cookie;
    mdm.Config.Actions action;
    Collection<Part> parts;
    String contextPath;
    Boolean publicPage = false;
    HashMap<String, String[]> requestParameters = new HashMap<String, String[]>();

    public ActionManagerUpload(Map<String, String[]> requestParameters, Collection<Part> parts) {
        this.requestParameters = new HashMap<String, String[]>(requestParameters);
        if (requestParameters.get("action") != null) {
            action = mdm.Config.Actions.valueOf(requestParameters.get("action")[0]);
        }
        if (requestParameters.get("LCMS_session") != null) {
            cookie = requestParameters.get("LCMS_session")[0];
        }
        if (requestParameters.get("contextPath") != null) {
            contextPath = requestParameters.get("contextPath")[0];
        }
        if (requestParameters.get("public") != null) {
            publicPage = Boolean.valueOf(requestParameters.get("public")[0]);
        }
        this.parts = parts;
    }

    public ActionManagerUpload(Map<String, String[]> requestParameters) {
        this.requestParameters = new HashMap<String, String[]>(requestParameters);
        if (requestParameters.get("action") != null) {
            action = mdm.Config.Actions.valueOf(requestParameters.get("action")[0]);
        }
        if (requestParameters.get("LCMS_session") != null) {
            cookie = requestParameters.get("LCMS_session")[0];
        }
        if (requestParameters.get("contextPath") != null) {
            contextPath = requestParameters.get("contextPath")[0];
        }
        if (requestParameters.get("public") != null) {
            publicPage = Boolean.valueOf(requestParameters.get("public")[0]);
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

        if (action == mdm.Config.Actions.FILE_UPLOAD) {
            sb.append(actionFILE_UPLOAD());
        }
        if (action == mdm.Config.Actions.FILE_BROWSE) {
            sb.append(actionFILE_BROWSE());
        }
        if (action == mdm.Config.Actions.FILE_DOWNLOADTEMP) {
            sb.append(actionFILE_DOWNLOADTEMP());
        }

        return sb;
    }

    public StringBuilder actionFILE_UPLOAD() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        StringBuilder sb = new StringBuilder();
        for (Part part : parts) {
            if (part.getName().equals("file")) {
                UUID id = UUID.randomUUID();
                String fileName = id + part.getSubmittedFileName();
                part.write(mdm.Core.getTempDir(cookie, contextPath) + fileName);
                FileObject fileobject = createFileObject(id.toString(), fileName, "image", "image/jpg", "private");
                sb.append(mapper.writeValueAsString(fileobject));
                DatabaseActions.insertFile(part.getInputStream(), fileName, fileobject);
                DatabaseActions.insertFileObject(fileobject);
            }
        }
        return sb;
    }

    public StringBuilder actionFILE_BROWSE() throws IOException, ClassNotFoundException, NoSuchFieldException {
        StringBuilder sb = new StringBuilder();
        if (Core.checkSession(cookie) && checkUserRoleValue(cookie, 2)) {
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode jsonData = mapper.createObjectNode();
            ArrayList<FileObject> results = DatabaseActions.getFileObjectList(cookie);//MongoMain.getFilesList(0, 100, new HashMap<String, String>());
            List<String> columns = getDocumentPriveleges("view", cookie, "mdm.GsonObjects.Other.FileObject");
            ArrayList<HashMap> header = new ArrayList<>();
            ArrayList<HashMap> table = new ArrayList<>();
            HashMap tableEntry = new HashMap();
            for (String column : columns) {
                Class cls = Class.forName("mdm.GsonObjects.Other.FileObject");
                Field field = cls.getField(column);
                MdmAnnotations mdmAnnotations = field.getAnnotation(MdmAnnotations.class);
                HashMap headerEntry = new HashMap();
                headerEntry.put("name", field.getName());
                if (mdmAnnotations != null) {
                    headerEntry.put("type", mdmAnnotations.type());
                    headerEntry.put("visibleOnTable", mdmAnnotations.visibleOnTable());
                    headerEntry.put("editable", mdmAnnotations.editable());
                    headerEntry.put("multiple", mdmAnnotations.multiple());
                    headerEntry.put("visibleOnForm", mdmAnnotations.visibleOnForm());
                    headerEntry.put("tablename", "file_table");
                    if (!"".equals(mdmAnnotations.reference()[0])) {
                        ArrayList<Document> users = DatabaseActions.getObjectsSpecificFields(cookie, MongoConf.USERS, null, null, 100, Arrays.asList(new String[]{"userid", "username"}));
//                        ArrayList<User> users = mapper.readValue(DatabaseActions.getListAsString("User", cookie), new TypeReference<List<User>>() {
//                        });
//                        Map<String, String> map = users
//                                .stream()
//                                .collect(
//                                        Collectors.toMap(p -> p.getUserid(), p -> p.getUsername())
//                                );

                        headerEntry.put("choices", mapper.writeValueAsString(users));

                    } else {
                        headerEntry.put("choices", mdmAnnotations.choices());

                    }

                }
                header.add(headerEntry);
                tableEntry.put(field.getName(), "");
            }
            if (results != null) {
                if (!results.isEmpty()) {
                    jsonData.put("table", mapper.writeValueAsString(results));
                } else {
                    jsonData.put("table", mapper.writeValueAsString(table));
                }
            }

            jsonData.put("header", mapper.writeValueAsString(header));

            sb.append(jsonData);
        }
        return sb;
    }

    public StringBuilder actionFILE_DOWNLOADTEMP() {
        StringBuilder sb = new StringBuilder();
        if (Core.checkSession(cookie)) {
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode jsonData = mapper.createObjectNode();
            jsonData.put("filePath", DatabaseActions.downloadFileToTemp(requestParameters.get("filename")[0], cookie, contextPath, publicPage));

            sb.append(jsonData);
        }
        return sb;
    }

    private FileObject createFileObject(String _id, String _filename, String _type, String _contenttype, String _accesstype) {
        long now = Instant.now().toEpochMilli() / 1000;
        FileObject fileObject = new FileObject();
        fileObject.setFileid(_id);
        fileObject.setType(_type);
        fileObject.setName(_filename);
        fileObject.setUpload_date(_type);
        fileObject.setContent_type(_contenttype);
        fileObject.setAccesstype(_accesstype);

        return fileObject;
    }

//    private void saveFileObject(InputStream _inputStream, String _name, FileObject _fileobject) {
//        ObjectId fileId = null;
//        try {
//            GridFSBucket gridBucket = GridFSBuckets.create(MongoMain.getDatabase("files"));
//            GridFSUploadOptions uploadOptions = new GridFSUploadOptions().chunkSizeBytes(1024).metadata(new Document("$set",_fileobject));
//            fileId = gridBucket.uploadFromStream(_name, _inputStream, uploadOptions);
//        } catch (Exception e) {
//            e.printStackTrace();
//
//        }
//
//    }
}
