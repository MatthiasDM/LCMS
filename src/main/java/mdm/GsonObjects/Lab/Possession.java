/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm.GsonObjects.Lab;

import mdm.pojo.annotations.MdmAnnotations;

/**
 *
 * @author Matthias
 */
public class Possession {

    @MdmAnnotations(type = "string", visibleOnTable = false, visibleOnForm = false)
    public String possessionid;
    @MdmAnnotations(
            type = "string")
    public String name;
    @MdmAnnotations(
            type = "string")
    public String identifier;
    @MdmAnnotations(
            type = "select",
            choices = {"Toestel", "Pipet", "Koelkast", "Diepvries", "Broedstoof", "Microscoop", "Chronometer", "Thermometer", "Centrifuges", "Opslagruimten", "Software", "Computer", "Printer", "LAF kast", "Barcodeprinter"}
    )
    public String category;
    @MdmAnnotations(
            type = "select",
            multiple = true,
            reference = {"Mongo", "DEPARTMENT", "departmentid", "name"}
    )
    public String department;  //
    @MdmAnnotations(
            type = "cktext")
    public String info;
    @MdmAnnotations(
            type = "date",
            visibleOnTable = false,
            visibleOnForm = false,
            viewRole = "SYSTEM",
            editRole = "SYSTEM",
            createRole = "SYSTEM")
    public long created_on;
    @MdmAnnotations(
            type = "ref",
            visibleOnTable = false,
            visibleOnForm = false,
            viewRole = "SYSTEM",
            createRole = "SYSTEM",
            editRole = "SYSTEM")
    public String created_by;
    @MdmAnnotations(
            type = "date",
            visibleOnTable = false,
            visibleOnForm = false,
            createRole = "SYSTEM",
            editRole = "SYSTEM")
    public long edited_on;

    public Possession() {
    }

    public Possession(String possessionid, String name, String identifier, String category, String department, String info, long created_on, String created_by, long edited_on) {
        this.possessionid = possessionid;
        this.name = name;
        this.identifier = identifier;
        this.category = category;
        this.department = department;
        this.info = info;
        this.created_on = created_on;
        this.created_by = created_by;
        this.edited_on = edited_on;
    }

    public String getPossessionid() {
        return possessionid;
    }

    public void setPossessionid(String possessionid) {
        this.possessionid = possessionid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getInfo() {
        return info;
    }

    public void setInfo(String info) {
        this.info = info;
    }

    public long getCreated_on() {
        return created_on;
    }

    public void setCreated_on(long created_on) {
        this.created_on = created_on;
    }

    public String getCreated_by() {
        return created_by;
    }

    public void setCreated_by(String created_by) {
        this.created_by = created_by;
    }

    public long getEdited_on() {
        return edited_on;
    }

    public void setEdited_on(long edited_on) {
        this.edited_on = edited_on;
    }
    
    
    
}
