/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm.GsonObjects;

import mdm.pojo.annotations.MdmAnnotations;

import java.util.Date;
import java.util.List;

/**
 *
 * @author matmey
 */
public class Note {

    @MdmAnnotations(type = "string", visibleOnTable = true)
    public String title;
    @MdmAnnotations(type = "string", visibleOnTable = false)
    public String content;
    @MdmAnnotations(
            type = "select",
            reference = {"Mongo", "USERS", "userid", "username"},
            editRole = "ICTMANAGER",
            visibleOnTable = false
    )
    public String owner;
    @MdmAnnotations(
            type = "select",
            reference = {"Mongo", "USERS", "userid", "username"},
            editRole = "ICTMANAGER",
            visibleOnTable = false
    )
    public String author;
    @MdmAnnotations(
            type = "select",
            reference = {"Mongo", "USERS", "userid", "username"},
            editRole = "ICTMANAGER",
            visibleOnTable = false
    )
    public String qualitymanager;
    @MdmAnnotations(
            type = "select",
            reference = {"Mongo", "USERS", "userid", "username"},
            editRole = "ICTMANAGER",
            visibleOnTable = false
    )
    public String inspector;
    @MdmAnnotations(
            type = "select",
            reference = {"Mongo", "USERS", "userid", "username"},
            editRole = "ICTMANAGER",
            visibleOnTable = false
    )
    public String exciter;
    @MdmAnnotations(
            type = "select",
            reference = {"Mongo", "USERS", "userid", "username"},
            editRole = "ICTMANAGER",
            visibleOnTable = false
    )
    public String lastEditedBy;
    @MdmAnnotations(type = "string", visibleOnTable = false)
    public String docid;
    @MdmAnnotations(
            type = "date",
            visibleOnTable = false,
            createRole = "SYSTEM",
            editRole = "SYSTEM",
            viewRole = "SYSTEM")
    public long created;
    @MdmAnnotations(type = "date", visibleOnTable = false)
    public long edited;
    @MdmAnnotations(type = "string", visibleOnTable = false)
    public String version;
    @MdmAnnotations(type = "boolean", visibleOnTable = false)
    public int done;
    @MdmAnnotations(type = "list", visibleOnTable = false)
    public List<String> anchors;

    public Note() {
    }

    public Note(String title, String content, String owner, String author, String qualitymanager, String inspector, String exciter, String lastEditedBy, String docid, long created, long edited, String version, int done, List<String> anchors) {
        this.title = title;
        this.content = content;
        this.owner = owner;
        this.author = author;
        this.qualitymanager = qualitymanager;
        this.inspector = inspector;
        this.exciter = exciter;
        this.lastEditedBy = lastEditedBy;
        this.docid = docid;
        this.created = created;
        this.edited = edited;
        this.version = version;
        this.done = done;
        this.anchors = anchors;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getQualitymanager() {
        return qualitymanager;
    }

    public void setQualitymanager(String qualitymanager) {
        this.qualitymanager = qualitymanager;
    }

    public String getInspector() {
        return inspector;
    }

    public void setInspector(String inspector) {
        this.inspector = inspector;
    }

    public String getExciter() {
        return exciter;
    }

    public void setExciter(String exciter) {
        this.exciter = exciter;
    }

    public String getLastEditedBy() {
        return lastEditedBy;
    }

    public void setLastEditedBy(String lastEditedBy) {
        this.lastEditedBy = lastEditedBy;
    }

    public String getDocid() {
        return docid;
    }

    public void setDocid(String docid) {
        this.docid = docid;
    }

    public long getCreated() {
        return created;
    }

    public void setCreated(long created) {
        this.created = created;
    }

    public long getEdited() {
        return edited;
    }

    public void setEdited(long edited) {
        this.edited = edited;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public int getDone() {
        return done;
    }

    public void setDone(int done) {
        this.done = done;
    }

    public List<String> getAnchors() {
        return anchors;
    }

    public void setAnchors(List<String> anchors) {
        this.anchors = anchors;
    }

}
