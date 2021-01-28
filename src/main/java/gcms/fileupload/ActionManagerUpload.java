/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.fileupload;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.util.HashMap;
import java.util.Map;
import gcms.Core;
import gcms.database.DatabaseActions;
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
import gcms.Config.MongoConf;
import static gcms.Core.checkUserRoleValue;
import gcms.GsonObjects.Core.FileObject;
import gcms.GsonObjects.Core.User;
import static gcms.database.DatabaseActions.getDocumentPriveleges;
import gcms.GsonObjects.annotations.MdmAnnotations;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;

/**
 *
 * @author matmey
 */
public class ActionManagerUpload {

    String cookie;
    gcms.Config.Actions action;
    Collection<Part> parts;
    String contextPath;
    Boolean publicPage = false;
    HashMap<String, String[]> requestParameters = new HashMap<String, String[]>();

    public ActionManagerUpload(Map<String, String[]> requestParameters, Collection<Part> parts) {
        this.requestParameters = new HashMap<String, String[]>(requestParameters);
        if (requestParameters.get("action") != null) {
            action = gcms.Config.Actions.valueOf(requestParameters.get("action")[0]);
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
            action = gcms.Config.Actions.valueOf(requestParameters.get("action")[0]);
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

    public gcms.Config.Actions getAction() {
        return action;
    }

    public StringBuilder startAction() throws ClassNotFoundException, IOException, NoSuchFieldException {
        StringBuilder sb = new StringBuilder();

        if (action == gcms.Config.Actions.FILE_UPLOAD) {
            sb.append(actionFILE_UPLOAD());
        }
        if (action == gcms.Config.Actions.FILE_DOWNLOADTEMP) {
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
                part.write(gcms.Core.getTempDir(cookie, contextPath) + fileName);
                FileObject fileobject = createFileObject(id.toString(), fileName, "image", "image/jpg", "private");
                sb.append(mapper.writeValueAsString(fileobject));
                DatabaseActions.insertFile(part.getInputStream(), fileName, fileobject);
                DatabaseActions.insertFileObject(fileobject);
            }
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
