/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.GsonObjects.annotations;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.lang.annotation.Annotation;
public class gcmsObjectImplementation implements gcmsObject {

    public gcmsObjectImplementation() {
    }

    @JsonProperty
    String type;

    @JsonProperty
    String relationParameters;

    @JsonProperty
    String fk;

    @JsonProperty
    String pk;

    @JsonProperty
    String formatterName;

    @JsonProperty
    boolean key;

    @JsonProperty
    boolean visibleOnTable;

    @JsonProperty
    boolean editable;

    @JsonProperty
    boolean multiple;

    @JsonProperty
    boolean visibleOnForm;

    @JsonProperty
    String[] choices;

    @JsonProperty
    String[] reference;

    //ROLE MANAGEMENT
    @JsonProperty
    String viewRole;

    @JsonProperty
    String editRole;

    @JsonProperty
    String createRole;

    @JsonProperty
    int minimumViewRoleVal;

    @JsonProperty
    int minimumEditRoleVal;

    @JsonProperty
    int minimumCreateRoleVal;

    //HITORY MANAGENT
    @JsonProperty
    boolean DMP;

    public gcmsObjectImplementation(String type, String relationParameters, String fk, String pk, String formatterName, boolean key, boolean visibleOnTable, boolean editable, boolean multiple, boolean visibleOnForm, String[] choices, String[] reference, String viewRole, String editRole, String createRole, int minimumViewRoleVal, int minimumEditRoleVal, int minimumCreateRoleVal, boolean DMP) {
        this.type = type;
        this.relationParameters = relationParameters;
        this.fk = fk;
        this.pk = pk;
        this.formatterName = formatterName;
        this.key = key;
        this.visibleOnTable = visibleOnTable;
        this.editable = editable;
        this.multiple = multiple;
        this.visibleOnForm = visibleOnForm;
        this.choices = choices;
        this.reference = reference;
        this.viewRole = viewRole;
        this.editRole = editRole;
        this.createRole = createRole;
        this.minimumViewRoleVal = minimumViewRoleVal;
        this.minimumEditRoleVal = minimumEditRoleVal;
        this.minimumCreateRoleVal = minimumCreateRoleVal;
        this.DMP = DMP;
    }

    public String getPk() {
        return pk;
    }

    public void setPk(String pk) {
        this.pk = pk;
    }

    public String getRelationParameters() {
        return relationParameters;
    }

    public void setRelationParameters(String relationParameters) {
        this.relationParameters = relationParameters;
    }

    public String getFk() {
        return fk;
    }

    public void setFk(String fk) {
        this.fk = fk;
    }

    public String getFormatterName() {
        return formatterName;
    }

    public void setFormatterName(String formatterName) {
        this.formatterName = formatterName;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public boolean isKey() {
        return key;
    }

    public void setKey(boolean key) {
        this.key = key;
    }

    public boolean isVisibleOnTable() {
        return visibleOnTable;
    }

    public void setVisibleOnTable(boolean visibleOnTable) {
        this.visibleOnTable = visibleOnTable;
    }

    public boolean isEditable() {
        return editable;
    }

    public void setEditable(boolean editable) {
        this.editable = editable;
    }

    public boolean isMultiple() {
        return multiple;
    }

    public void setMultiple(boolean multiple) {
        this.multiple = multiple;
    }

    public boolean isVisibleOnForm() {
        return visibleOnForm;
    }

    public void setVisibleOnForm(boolean visibleOnForm) {
        this.visibleOnForm = visibleOnForm;
    }

    public String[] getChoices() {
        return choices;
    }

    public void setChoices(String[] choices) {
        this.choices = choices;
    }

    public String[] getReference() {
        return reference;
    }

    public void setReference(String[] reference) {
        this.reference = reference;
    }

    public String getViewRole() {
        return viewRole;
    }

    public void setViewRole(String viewRole) {
        this.viewRole = viewRole;
    }

    public String getEditRole() {
        return editRole;
    }

    public void setEditRole(String editRole) {
        this.editRole = editRole;
    }

    public String getCreateRole() {
        return createRole;
    }

    public void setCreateRole(String createRole) {
        this.createRole = createRole;
    }

    public int getMinimumViewRoleVal() {
        return minimumViewRoleVal;
    }

    public void setMinimumViewRoleVal(int minimumViewRoleVal) {
        this.minimumViewRoleVal = minimumViewRoleVal;
    }

    public int getMinimumEditRoleVal() {
        return minimumEditRoleVal;
    }

    public void setMinimumEditRoleVal(int minimumEditRoleVal) {
        this.minimumEditRoleVal = minimumEditRoleVal;
    }

    public int getMinimumCreateRoleVal() {
        return minimumCreateRoleVal;
    }

    public void setMinimumCreateRoleVal(int minimumCreateRoleVal) {
        this.minimumCreateRoleVal = minimumCreateRoleVal;
    }

    public boolean isDMP() {
        return DMP;
    }

    public void setDMP(boolean DMP) {
        this.DMP = DMP;
    }

    @Override
    public String type() {
        return type;
    }

    @Override
    public boolean key() {
        return key;
    }

    @Override
    public boolean visibleOnTable() {
        return visibleOnTable;
    }

    @Override
    public boolean editable() {
        return editable;
    }

    @Override
    public boolean multiple() {
        return multiple;
    }

    @Override
    public boolean visibleOnForm() {
        return visibleOnForm;
    }

    @Override
    public String[] choices() {
        return choices;
    }

    @Override
    public String[] reference() {
        return reference;
    }

    @Override
    public String viewRole() {
        return viewRole;
    }

    @Override
    public String editRole() {
        return editRole;
    }

    @Override
    public String createRole() {
        return createRole;
    }

    @Override
    public int minimumViewRoleVal() {
        return minimumViewRoleVal;
    }

    @Override
    public int minimumEditRoleVal() {
        return minimumEditRoleVal;
    }

    @Override
    public int minimumCreateRoleVal() {
        return minimumCreateRoleVal;
    }

    @Override
    public boolean DMP() {
        return DMP;
    }

    @Override
    public Class<? extends Annotation> annotationType() {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public String formatterName() {
        return formatterName;
    }

    @Override
    public String relationParameters() {
        return relationParameters;
    }

    @Override
    public String fk() {
        return fk;
    }

    @Override
    public String pk() {
        return pk;
    }

}