/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.GsonObjects.Core;

import gcms.GsonObjects.annotations.gcmsObject;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 *
 * @author Matthias
 */
public class Query {

    @gcmsObject(
            type = "pk",
            createRole = "SYSTEM",
            visibleOnTable = false,
            visibleOnForm = false
    )
    public String queryId;

    @gcmsObject(
            type = "String",
            createRole = "ADMIN"
    )
    public String name;

    @gcmsObject(
            type = "cktext_code",
            createRole = "ADMIN"
    )
    public String query;

}
