/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm.GsonObjects.Lab;

import mdm.pojo.annotations.MdmAnnotations;

/**
 *
 * @author matmey
 */
public class Instrument {

    @MdmAnnotations(
            viewRole = "ICTMANAGER",
            createRole = "GOD",
            editRole = "GOD",
            type = "string",
            visibleOnTable = false,
            visibleOnForm = false)
    public String instid;
    @MdmAnnotations(
            viewRole = "ICTMANAGER",
            createRole = "GOD",
            editRole = "GOD",
            type = "string",
            visibleOnTable = false,
            visibleOnForm = false)
    public String tag;
    @MdmAnnotations(
            minimumEditRoleVal = 4,
            type = "string",
            visibleOnTable = false,
            visibleOnForm = false)
    public String name;

    public String serialNumber;
    @MdmAnnotations(type = "date")
    public long received, firstUse, lastUse;
    @MdmAnnotations(type = "ref")
    public String serviceContract, department, workpost, location; //reference   
    @MdmAnnotations(type = "text")
    public String notes;

    public Instrument(String instid, String name, String tag, String serialNumber, long received, long firstUse, long lastUse, String serviceContract, String department, String workpost, String notes, String location) {
        this.instid = instid;
        this.name = name;
        this.tag = tag;
        this.serialNumber = serialNumber;
        this.received = received;
        this.firstUse = firstUse;
        this.lastUse = lastUse;
        this.serviceContract = serviceContract;
        this.department = department;
        this.workpost = workpost;
        this.notes = notes;
        this.location = location;
    }

    public Instrument() {
    }

    public long getLastUse() {
        return lastUse;
    }

    public void setLastUse(long lastUse) {
        this.lastUse = lastUse;
    }

    public String getInstid() {
        return instid;
    }

    public void setInstid(String instid) {
        this.instid = instid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public long getReceived() {
        return received;
    }

    public void setReceived(long received) {
        this.received = received;
    }

    public long getFirstUse() {
        return firstUse;
    }

    public void setFirstUse(long firstUse) {
        this.firstUse = firstUse;
    }

    public String getServiceContract() {
        return serviceContract;
    }

    public void setServiceContract(String serviceContract) {
        this.serviceContract = serviceContract;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getWorkpost() {
        return workpost;
    }

    public void setWorkpost(String workpost) {
        this.workpost = workpost;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public long getInUse() {
        return lastUse;
    }

    public void setInUse(long lastUse) {
        this.lastUse = lastUse;
    }

}
