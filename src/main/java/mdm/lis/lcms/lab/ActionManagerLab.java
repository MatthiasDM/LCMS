/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm.lis.lcms.lab;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;
import mdm.Core;
import static mdm.Core.StringToLong;
import static mdm.Core.checkUserRole;
import mdm.GsonObjects.Lab.Instrument;
import mdm.Mongo.DatabaseActions;
import mdm.Mongo.DatabaseWrapper;
import static mdm.Mongo.DatabaseWrapper.getInstrumentData;
import mdm.pojo.annotations.MdmAnnotations;

/**
 *
 * @author matmey
 */
public class ActionManagerLab {

    String cookie;
    Core.Actions action;
    HashMap<String, String[]> requestParameters = new HashMap<String, String[]>();

    public ActionManagerLab(Map<String, String[]> requestParameters) {
        this.requestParameters = new HashMap<String, String[]>(requestParameters);
        if (requestParameters.get("action") != null) {
            action = Core.Actions.valueOf(requestParameters.get("action")[0]);
        }
        if (requestParameters.get("LCMS_session") != null) {
            cookie = requestParameters.get("LCMS_session")[0];
        }
    }

    public String getCookie() {
        return cookie;
    }

    public Core.Actions getAction() {
        return action;
    }

    public StringBuilder startAction() throws ClassNotFoundException, IOException, JsonProcessingException, NoSuchFieldException {
        StringBuilder sb = new StringBuilder();
        if (cookie != null) {
            if (action == Core.Actions.LAB_LOADINSTRUMENTS) {
                sb.append(actionLAB_LOADINSTRUMENTS());
            }
            if (action == Core.Actions.LAB_EDITINSTRUMENTS) {
                sb.append(actionLAB_EDITINSTRUMENTS());
            }
        } else {
            sb.append(DatabaseWrapper.getCredentialPage());
        }

        return sb;
    }

    private StringBuilder actionLAB_EDITINSTRUMENTS() throws IOException, ClassNotFoundException {
        StringBuilder sb = new StringBuilder();
        if (cookie != null) {
            if (checkUserRole(cookie, Core.Roles.ADMIN)) {
                requestParameters.remove("action");
                requestParameters.remove("LCMS_session");
                String operation = requestParameters.get("oper")[0];
                if (requestParameters.get("oper") != null) {
                    if (operation.equals("edit")) {
                        requestParameters.remove("oper");
                        Instrument instrument = createIntstrumentObject(requestParameters.get("instid")[0]);
                        DatabaseWrapper.editObjectData(instrument, Core.MongoConf.INSTRUMENTS, "edit");
                        //DatabaseActions.updateInstrument(createIntstrumentObject(requestParameters.get("instid")[0]));
                    }
                    if (operation.equals("add")) {
                        requestParameters.remove("oper");
                        UUID id = UUID.randomUUID();
                        DatabaseActions.insertInstrument(createIntstrumentObject(id.toString()));
                    }
                }
            }
        } else {
            sb.append(DatabaseWrapper.getCredentialPage());
        }
        return sb;
    }

    private StringBuilder actionLAB_LOADINSTRUMENTS() throws JsonProcessingException, ClassNotFoundException, NoSuchFieldException, IOException {
        StringBuilder sb = new StringBuilder();
        if (cookie == null) {
            sb.append(DatabaseWrapper.getCredentialPage());
        } else {
            if (action == Core.Actions.LAB_LOADINSTRUMENTS) {
                if (Core.checkSession(cookie)) {

                    sb.append(getInstrumentData(cookie));

                } else {
                    sb.append(DatabaseWrapper.getCredentialPage());
                };
            }

        }
        return sb;
    }

    private Instrument createIntstrumentObject(String _id) {
        Instrument instrument = new Instrument();
        instrument.setInstid(_id);
        instrument.setName(requestParameters.get("name")[0]);
        instrument.setTag(_id);
        instrument.setSerialNumber(requestParameters.get("serialNumber")[0].toString());

        instrument.setReceived(StringToLong(requestParameters.get("received")[0]));
        instrument.setFirstUse(StringToLong(requestParameters.get("firstUse")[0]));
        instrument.setLastUse(StringToLong(requestParameters.get("lastUse")[0]));
        instrument.setServiceContract(requestParameters.get("serviceContract")[0]);
        instrument.setDepartment(requestParameters.get("department")[0]);
        instrument.setWorkpost(requestParameters.get("workpost")[0]);
        instrument.setNotes(requestParameters.get("notes")[0]);
        instrument.setLocation(requestParameters.get("location")[0]);

        return instrument;
    }
}
