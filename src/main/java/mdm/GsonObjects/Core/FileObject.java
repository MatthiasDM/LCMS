/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm.GsonObjects.Core;

import mdm.pojo.annotations.MdmAnnotations;

/**
 *
 * @author matmey
 */
public class FileObject {

    @MdmAnnotations(
            visibleOnForm = false,      
            visibleOnTable = false,
            createRole = "GOD",
            editRole = "GOD",
            type = "string")
    public String fileid;
    @MdmAnnotations(
            createRole = "GOD",
            editRole = "GOD",
            type = "string")
    public String name;
    @MdmAnnotations(
            viewRole = "GOD",
            createRole = "GOD",
            editRole = "GOD",
            type = "string")
    public String type;
    @MdmAnnotations(
            viewRole = "GOD",
            createRole = "GOD",
            editRole = "GOD",
            type = "date")
    public String upload_date;
    @MdmAnnotations(
            viewRole = "GOD",
            createRole = "GOD",
            editRole = "GOD",
            type = "string")
    public String content_type;
    @MdmAnnotations(
            viewRole = "GOD",
            createRole = "GOD",
            editRole = "GOD",
            type = "string")
    public String accesstype; //public or private?
    @MdmAnnotations(
            viewRole = "GOD",
            createRole = "GOD",
            editRole = "GOD",
            type = "string")
    public String accesslevel; //what level must the user be to access the object?

    public FileObject() {
    }

    public FileObject(String type, String upload_date, String content_type, String accesstype, String accesslevel, String name, String fileid) {
        this.name = name;
        this.fileid = fileid;
        this.type = type;
        this.upload_date = upload_date;
        this.content_type = content_type;
        this.accesstype = accesstype;
        this.accesslevel = accesslevel;
    }

    public String getFileid() {
        return fileid;
    }

    public void setFileid(String fileid) {
        this.fileid = fileid;
    }

    
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUpload_date() {
        return upload_date;
    }

    public void setUpload_date(String upload_date) {
        this.upload_date = upload_date;
    }

    public String getContent_type() {
        return content_type;
    }

    public void setContent_type(String content_type) {
        this.content_type = content_type;
    }

    public String getAccesstype() {
        return accesstype;
    }

    public void setAccesstype(String accesstype) {
        this.accesstype = accesstype;
    }

    public String getAccesslevel() {
        return accesslevel;
    }

    public void setAccesslevel(String accesslevel) {
        this.accesslevel = accesslevel;
    }

}
