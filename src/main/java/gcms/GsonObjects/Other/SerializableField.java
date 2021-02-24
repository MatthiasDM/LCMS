/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.GsonObjects.Other;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import java.lang.annotation.Annotation;
import gcms.GsonObjects.annotations.gcmsObjectImplementation;
/**
 *
 * @author Matthias
 */
public class SerializableField {
    String name;
    String type;
    @JsonDeserialize(as = gcmsObjectImplementation.class) 
    Annotation annotation;
    
    public SerializableField() {
    }

    public SerializableField(String name, String type, Annotation annotation) {
        this.name = name;
        this.type = type;
        this.annotation = annotation;
    }

    public Annotation getAnnotation() {
        return annotation;
    }

    public void setAnnotation(Annotation annotation) {
        this.annotation = annotation;
    }

   
    
    
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

  
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    
    
}
