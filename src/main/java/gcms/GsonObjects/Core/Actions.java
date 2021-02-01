/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.GsonObjects.Core;

import gcms.GsonObjects.annotations.MdmAnnotations;

/**
 *
 * @author Matthias
 */
public class Actions {

    @MdmAnnotations(
            type = "string",
            createRole = "SYSTEM",
            //editRole = "SYSTEM",
            visibleOnTable = false,
            visibleOnForm = false
    )
    public String actionsid;
    @MdmAnnotations(
            type = "string",
            editRole = "ICTMANAGER",
            createRole = "ICTMANAGER",
            visibleOnTable = true
    )
    public String name;

    @MdmAnnotations(
            type = "select",
            reference = {"Mongo", "mongoconfigurations", "mongoconfigurationsid", "name"},            
            editRole = "ICTMANAGER"
    )
    public String mongoconfiguration;

}
