/*
 * To change this license header,
 choose License Headers in Project Properties.
 * To change this template file,
 choose Tools | Templates
 * and open the template in the editor.
 */
package mdm.Config;

/**
 *
 * @author Matthias
 */
public enum Actions {
    //CREDENTIAL RELATED
    CREDENTIALS_LOGIN,
    LOAD,
    CREDENTIALS_CHECKCREDENTIALS,
    CREDENTIALS_USERINFO,
    CREDENTIALS_LOGOUT,
    //ADMIN RELATED
    ADMIN_LOADPAGE,
    ADMIN_LOADOBJECTS,
    ADMIN_EDITOBJECTS,
    ADMIN_LOADUSERS,
    ADMIN_EDITUSERS,
    ADMIN_LOADTABLES(MongoConf.TABLES),
    ADMIN_EDITTABLES(MongoConf.TABLES),
    ADMIN_LOADRIGHTS(MongoConf.RIGHTS),
    ADMIN_EDITRIGHTS(MongoConf.RIGHTS),
    //OBJECT RELATED
    NEWOBJECT,
    LOADOBJECTS,
    //USER RELATED
    USER_CREATEUSER,
    //NOTES RELATED
    AUTOSAVE,
    LISTNOTES,
    CREATENOTE,
    GETNOTE,
    SAVENOTE,
    NOTE_LOADNOTES(MongoConf.NOTES),
    NOTE_EDITNOTES(MongoConf.NOTES),
    NOTE_GETNOTE(MongoConf.NOTES),
    NOTE_SAVENOTE(MongoConf.NOTES),
    //LAB RELATED
    LAB_LOADLAB,
    LAB_LOADINSTRUMENTS(MongoConf.INSTRUMENTS),
    LAB_EDITINSTRUMENTS(MongoConf.INSTRUMENTS),
    LAB_LOADWORKLIST(MongoConf.WORKLIST),
    LAB_EDITWORKLIST(MongoConf.WORKLIST),
    LAB_LOADINVENTORY(MongoConf.INVENTORY),
    LAB_EDITINVENTORY(MongoConf.INVENTORY),
    LAB_EDITLABITEM(MongoConf.LABITEM),
    LAB_LOADLABITEM(MongoConf.LABITEM),
    LAB_EDITPOSSESSION(MongoConf.POSSESSION),
    LAB_LOADPOSSESSION(MongoConf.POSSESSION),
    LAB_EDITSTORAGE(MongoConf.STORAGE),
    LAB_LOADSTORAGE(MongoConf.STORAGE),
    LAB_EDITDEPARTMENT(MongoConf.DEPARTMENT),
    LAB_LOADDEPARTMENT(MongoConf.DEPARTMENT),
    LAB_CHECKINVENTORY,
    LAB_WORKSUMMARY,
    LAB_KPI_HEMOLYSIS,
    LAB_KPI_WORKPRESSURE,
    LAB_KPI_TAT,
    LAB_KPI_CITRATE,
    LAB_KPI_HEMOFP,
    LAB_KPI_NC,
    LAB_GETCHAT(MongoConf.CHATS),
    LAB_SENDCHAT(MongoConf.CHATS),
    //QCMANAGER RELATED
    QC_GETLOTINFO,
    QC_CHANGELOTINFO,
    QC_ADDLOTINFO,
    QC_CHANGETESTINFO,
    QC_GETTESTINFO,
    //ICT RELATED
    ICT_LOADTICKETS(MongoConf.ICTTICKETS),
    ICT_EDITTICKETS(MongoConf.ICTTICKETS),
    //FILE RELATED
    FILE_UPLOAD,
    FILE_BROWSE,
    FILE_DOWNLOADTEMP,
    //TAKS RELATED
    TASKS_LOADTASKS(MongoConf.TASKS),
    TASKS_EDITTASKS(MongoConf.TASKS),
    //BACKLOG RELATED
    BACKLOG_EDITLOG(MongoConf.BACKLOG),
    BACKLOG_LOADLOG(MongoConf.BACKLOG),
    //GENERAL
    GENERAL_EDITSUGGESTION(MongoConf.SUGGESTIONS),
    GENERAL_LOADSUGGESTION(MongoConf.SUGGESTIONS),
    //VALIDATION FILES
    VALIDATION_EDITVALIDATIONS(MongoConf.VALIDATIONS),
    VALIDATION_LOADVALIDATIONS(MongoConf.VALIDATIONS),
    VALIDATION_GETVALIDATION(MongoConf.VALIDATIONS),
    //EDITABLEPAGE RELATED
    EDITABLEPAGE_EDITEDITABLEPAGE(MongoConf.EDITABLEPAGE),
    EDITABLEPAGE_LOADEDITABLEPAGES(MongoConf.EDITABLEPAGE),
    EDITABLEPAGE_GETEDITABLEPAGE(MongoConf.EDITABLEPAGE),
    //PIVOTTABLE RELATED
    PIVOTTABLE_GETTABLE(MongoConf.PIVOTTABLES),
    PIVOTTABLE_EDIT(MongoConf.PIVOTTABLES),
    PIVOTTABLE_GET(MongoConf.PIVOTTABLES);
    private final MongoConf mongoConf;

    private Actions(MongoConf mongoConf) {
        this.mongoConf = mongoConf;
    }

    private Actions() {
        mongoConf = null;
    }

    public MongoConf getMongoConf() {
        return mongoConf;
    }

}
