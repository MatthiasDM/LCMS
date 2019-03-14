/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm.Config;

/**
 *
 * @author Matthias
 */
public enum MongoConf {
    SESSION("users", "sessions", "mdm.GsonObjects.Session", "sessionID"),
    USERS("users", "users", "mdm.GsonObjects.User", "userid"),
    TABLES("lcms", "tables", "mdm.GsonObjects.Tables", "tablesid"),
    RIGHTS("lcms", "rights", "mdm.GsonObjects.Rights", "rightsid"),    
    //--------------------------------------------------------------------------------
    ICTTICKETS("lcms", "ICTTickets", "mdm.GsonObjects.Other.ICTTicket", "ticketid"),
    INSTRUMENTS("lcms", "instruments", "mdm.GsonObjects.Lab.Instrument", "instid"),
    NOTES("lcms", "notes", "mdm.GsonObjects.Note", "docid"),
    TASKS("lcms", "tasks", "mdm.GsonObjects.Other.Task", "taskid"),
    WORKLIST("lcms", "worklistsummary", "mdm.GsonObjects.Lab.WorklistSummary", "summaryid"),
    INVENTORY("lcms", "inventoryitem", "mdm.GsonObjects.Lab.InventoryItem", "itemid"),
    LABITEM("lcms", "labitem", "mdm.GsonObjects.Lab.LabItem", "labitemid"),
    //LOCATION("lcms", "location", "mdm.GsonObjects.Lab.Location", "locationid"),
    STORAGE("lcms", "storage", "mdm.GsonObjects.Lab.Storage", "storageid"),
    POSSESSION("lcms", "possession", "mdm.GsonObjects.Lab.Possession", "possessionid"),
    DEPARTMENT("lcms", "department", "mdm.GsonObjects.Lab.Department", "departmentid"),
    BACKLOG("backlog", "backlog", "mdm.GsonObjects.Other.Backlog", "backlogid"),
    SUGGESTIONS("lcms", "suggestions", "mdm.GsonObjects.Other.Suggestion", "suggestionid"),
    VALIDATIONS("lcms", "validations", "mdm.GsonObjects.Other.Validation", "validationid"),
    PIVOTTABLES("lcms", "pivottables", "mdm.GsonObjects.Other.PivotTable", "pivottableid"),
    CHATS("lcms", "chats", "mdm.GsonObjects.Other.Chat", "chatid");
    
    private final String database;
    private final String collection;
    private final String className;
    private final String idName;

    private MongoConf(String database, String collection, String className, String idName) {
        this.database = database;
        this.collection = collection;
        this.className = className;
        this.idName = idName;
    }

    public String getIdName() {
        return idName;
    }

    public String getDatabase() {
        return database;
    }

    public String getCollection() {
        return collection;
    }

    public String getClassName() {
        return className;
    }
}
