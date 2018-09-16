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
    TASKS_EDITTASKS(MongoConf.TASKS);

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
