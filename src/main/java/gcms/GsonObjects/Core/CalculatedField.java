/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.GsonObjects.Core;

import gcms.GsonObjects.annotations.gcmsObject;

/**
 *
 * @author Matthias
 */
public class CalculatedField {
     @gcmsObject(
            type = "pk",
            pk = "{\"relations\": [{\"collection\": \"mobCalculatedFields\", \"type\": \"OneToMany\", \"fk\": \"calculatedField\"}]}",
            createRole = "SYSTEM",
            visibleOnTable = false,
            visibleOnForm = false
    )
    public String calculatedFieldId;      
    
    @gcmsObject(
            type = "string",
            editRole = "ADMIN",
            createRole = "ADMIN",
            visibleOnTable = true
    )
    public String calculatedFieldFieldName;
     
    @gcmsObject(
            type = "cktext_code",
            editRole = "ADMIN",
            createRole = "ADMIN",
            visibleOnTable = false
    )
    public String calculatedFieldCode;
}
