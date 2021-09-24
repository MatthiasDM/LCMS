/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.objects.methods;

import gcms.GsonObjects.annotations.gcmsObject;

/**
 *
 * @author Matthias
 */
public class Method {

    @gcmsObject(
            type = "pk"
    )
    public String methodId;
    @gcmsObject(
            type = "select",
            reference = {"Enum", "Methods"}
    )
    public String method;

}
