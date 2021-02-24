/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.GsonObjects.Other;


import com.fasterxml.jackson.core.JsonProcessingException;
import gcms.Core;
import gcms.GsonObjects.annotations.gcmsObject;
import java.io.IOException;
import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;


/**
 *
 * @author Matthias
 */
public class SerializableClass {

    String className;
    List<SerializableField> fields = new ArrayList<>();

    public SerializableClass() {
    }

    public SerializableClass(String className) {
        this.className = className;
    }   

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }
 

    public List<SerializableField> getFields() {
        return fields;
    }

    public void setFields(List<SerializableField> fields) {
        this.fields = fields;
    }

    public void convertFields(List<Field> fieldList) {
        try {
            String json = Core.universalObjectMapper.writeValueAsString(fieldList);
            List<HashMap> fieldsJson = Core.universalObjectMapper.readValue(json, List.class);
            int i = 0;
            for (HashMap fieldHash : fieldsJson) {
                SerializableField serializableField = Core.universalObjectMapper.convertValue(fieldHash, SerializableField.class);
                Annotation annotation = fieldList.get(i).getAnnotation(gcmsObject.class);
                serializableField.setAnnotation(annotation);
                fields.add(serializableField);
                i++;
            }
        } catch (JsonProcessingException ex) {
            Logger.getLogger(SerializableClass.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException ex) {
            Logger.getLogger(SerializableClass.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

}
