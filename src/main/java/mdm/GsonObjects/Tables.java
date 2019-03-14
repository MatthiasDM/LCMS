/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm.GsonObjects;

import mdm.pojo.annotations.MdmAnnotations;

/**
 *
 * @author Matthias
 */
public class Tables {

    @MdmAnnotations(
            type = "string",
            editRole = "ICTMANAGER",
            createRole = "ICTMANAGER",
            visibleOnTable = false
    )
    public String tablesid;
    @MdmAnnotations(
            type = "string",
            editRole = "ICTMANAGER",
            createRole = "ICTMANAGER",
            visibleOnTable = true
    )
    public String table;

    @MdmAnnotations(
            type = "string",
            editRole = "ICTMANAGER",
            createRole = "ICTMANAGER",
            visibleOnTable = true
    )
    public String field;

    
    
    public Tables(String tablesid, String table, String field) {
        this.tablesid = tablesid;
        this.table = table;
        this.field = field;
    }

    public Tables() {
    }

    public String getTablesid() {
        return tablesid;
    }

    public void setTablesid(String tablesid) {
        this.tablesid = tablesid;
    }

    public String getTable() {
        return table;
    }

    public void setTable(String table) {
        this.table = table;
    }

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }
    
    
}
