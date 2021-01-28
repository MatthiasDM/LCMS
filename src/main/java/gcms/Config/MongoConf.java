/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.Config;

/**
 *
 * @author Matthias
 */
public enum MongoConf {
    SESSION("users", "sessions", "gcms.GsonObjects.Core.Session", "sessionID"),
    USERS("users", "users", "gcms.GsonObjects.Core.User", "userid"),
    //TABLES("lcms", "tables", "gcms.GsonObjects.Tables", "tablesid"),
    RIGHTS("lcms", "rights", "gcms.GsonObjects.Core.Rights", "rightsid"),
    TASKS("lcms", "tasks", "gcms.GsonObjects.Core.Task", "taskid"),
    BACKLOG("backlog", "backlog", "gcms.GsonObjects.Core.Backlog", "backlogid"),
    MONGOCONFIGURATIONS("lcms", "mongoconfigurations", "gcms.GsonObjects.Core.MongoConfigurations", "mongoconfigurationsid"),
    ACTIONS("lcms", "actions", "gcms.GsonObjects.Core.Actions", "actionsid"),
    EDITABLEPAGE("lcms", "editablepages", "gcms.GsonObjects.Core.EditablePage", "editablepageid"),

    //--------------------------------------------------------------------------------
    ICTTICKETS("lcms", "ICTTickets", "gcms.GsonObjects.Other.ICTTicket", "ticketid"),
    INSTRUMENTS("lcms", "instruments", "gcms.GsonObjects.Lab.Instrument", "instid"),
    NOTES("lcms", "notes", "gcms.GsonObjects.Note", "docid"),
    
    WORKLIST("lcms", "worklistsummary", "gcms.GsonObjects.Lab.WorklistSummary", "summaryid"),
    INVENTORY("lcms", "inventoryitem", "gcms.GsonObjects.Lab.InventoryItem", "itemid"),
    LABITEM("lcms", "labitem", "gcms.GsonObjects.Lab.LabItem", "labitemid"),
    //LOCATION("lcms", "location", "gcms.GsonObjects.Lab.Location", "locationid"),
    STORAGE("lcms", "storage", "gcms.GsonObjects.Lab.Storage", "storageid"),
    POSSESSION("lcms", "possession", "gcms.GsonObjects.Lab.Possession", "possessionid"),
    DEPARTMENT("lcms", "department", "gcms.GsonObjects.Lab.Department", "departmentid"),
    
    SUGGESTIONS("lcms", "suggestions", "gcms.GsonObjects.Other.Suggestion", "suggestionid"),
    VALIDATIONS("lcms", "validations", "gcms.GsonObjects.Other.Validation", "validationid"),
    PIVOTTABLES("lcms", "pivottables", "gcms.GsonObjects.Other.PivotTable", "pivottableid"),
    CHATS("lcms", "chats", "gcms.GsonObjects.Other.Chat", "chatid");
    //
    //
    //
    
    
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
