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
public class Workflow {

    @MdmAnnotations(type = "string", visibleOnTable = false, visibleOnForm = false)
    public String workflowid;
    @MdmAnnotations(
            type = "string",
            editRole = "ADMIN"
    )
    public String name;
    @MdmAnnotations(
            type = "select",
            reference = {"Mongo", "mongoconfigurations", "mongoconfigurationsid", "collection"},
            editRole = "ICTMANAGER"
    )
    public String mongoconfiguration;
        @MdmAnnotations(
            editRole = "ICTMANAGER",
            //viewRole = "ICTMANAGER",
            type = "select",
            choices = {"onedit", "oncreate"}
    )
    public String trigger;
    
}
