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
public class InventoryItem {

<<<<<<< HEAD
    @MdmAnnotations(type = "string", visibleOnTable = false, visibleOnForm = false)
    public String itemid;
    @MdmAnnotations(
            type = "select",
            reference = {"Mongo", "LABITEM", "labitemid", "name"},
            editRole = "ICTMANAGER",
            visibleOnTable = true
    )
//    public String name;
//    @MdmAnnotations(
//            viewRole = "GOD",            
//            editRole = "GOD",
//            type = "string")
    public String labitem_id;
    @MdmAnnotations(
            editRole = "GOD",
            type = "string")
    public String barcode;
    @MdmAnnotations(
            editRole = "GOD",
            type = "datetime")
    public long date_in;
    @MdmAnnotations(
            editRole = "GOD",
            type = "datetime")
    public long date_out;
    @MdmAnnotations(
            editRole = "GOD",
            type = "date")
    public long expiration_date; //public or private?
    @MdmAnnotations(
            type = "select",
            reference = {"Mongo", "STORAGE", "storageid", "description"},
            editRole = "ICTMANAGER",
            visibleOnTable = true
    )
    public String storage;
    @MdmAnnotations(
            viewRole = "GOD",
            createRole = "GOD",
            editRole = "GOD",
            type = "ref")
    public String created_by; //what level must the user be to access the object?

    public InventoryItem() {
    }

    public InventoryItem(String itemid, String labitem_id, String barcode, long date_in, long date_out, long expiration_date, String created_by) {
        this.itemid = itemid;
        // this.name = name;
        this.labitem_id = labitem_id;
        this.barcode = barcode;
        this.date_in = date_in;
        this.date_out = date_out;
        this.expiration_date = expiration_date;
        this.created_by = created_by;
    }

    public String getBarcode() {
        return barcode;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }

    public String getItemid() {
        return itemid;
    }

    public void setItemid(String itemid) {
        this.itemid = itemid;
    }

//    public String getName() {
//        return name;
//    }
//
//    public void setName(String name) {
//        this.name = name;
//    }
    public String getLabitem_id() {
        return labitem_id;
    }

    public void setLabitem_id(String labitem_id) {
        this.labitem_id = labitem_id;
    }

    public long getDate_in() {
        return date_in;
    }

    public void setDate_in(long date_in) {
        this.date_in = date_in;
    }

    public long getDate_out() {
        return date_out;
    }

    public void setDate_out(long date_out) {
        this.date_out = date_out;
    }

    public long getExpiration_date() {
        return expiration_date;
    }

    public void setExpiration_date(long expiration_date) {
        this.expiration_date = expiration_date;
    }

    public String getCreated_by() {
        return created_by;
    }

    public void setCreated_by(String created_by) {
        this.created_by = created_by;
    }

=======
    @MdmAnnotations(
            visibleOnForm = false,
            visibleOnTable = false,
            createRole = "GOD",
            editRole = "GOD",
            type = "string")
    public String itemid;
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
    public String labitem_id;
    @MdmAnnotations(
            viewRole = "GOD",
            createRole = "GOD",
            editRole = "GOD",
            type = "date")
    public String date_in;
    @MdmAnnotations(
            viewRole = "GOD",
            createRole = "GOD",
            editRole = "GOD",
            type = "date")
    public String date_out;
    @MdmAnnotations(
            viewRole = "GOD",
            createRole = "GOD",
            editRole = "GOD",
            type = "date")
    public String expiration_date; //public or private?
    @MdmAnnotations(
            viewRole = "GOD",
            createRole = "GOD",
            editRole = "GOD",
            type = "ref")
    public String created_by; //what level must the user be to access the object?

    public InventoryItem() {
    }

    public InventoryItem(String itemid, String name, String labitem_id, String date_in, String date_out, String expiration_date, String created_by) {
        this.itemid = itemid;
        this.name = name;
        this.labitem_id = labitem_id;
        this.date_in = date_in;
        this.date_out = date_out;
        this.expiration_date = expiration_date;
        this.created_by = created_by;
    }

    public String getItemid() {
        return itemid;
    }

    public void setItemid(String itemid) {
        this.itemid = itemid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLabitem_id() {
        return labitem_id;
    }

    public void setLabitem_id(String labitem_id) {
        this.labitem_id = labitem_id;
    }

    public String getDate_in() {
        return date_in;
    }

    public void setDate_in(String date_in) {
        this.date_in = date_in;
    }

    public String getDate_out() {
        return date_out;
    }

    public void setDate_out(String date_out) {
        this.date_out = date_out;
    }

    public String getExpiration_date() {
        return expiration_date;
    }

    public void setExpiration_date(String expiration_date) {
        this.expiration_date = expiration_date;
    }

    public String getCreated_by() {
        return created_by;
    }

    public void setCreated_by(String created_by) {
        this.created_by = created_by;
    }

    
    
    
>>>>>>> origin/master
}
