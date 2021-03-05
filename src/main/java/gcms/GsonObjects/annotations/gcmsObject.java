/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.GsonObjects.annotations;

/**
 *
 * @author matmey
 */
import com.fasterxml.jackson.annotation.JsonProperty;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Documented
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Inherited
//@Retention(RetentionPolicy.RUNTIME)
public @interface gcmsObject {

    @JsonProperty
    String type() default "string";
    //externalListParameters:
    //0: Name of external table
    //1: Value field of external table (usually field with unique ID)
    //2: Display field of external table (what value is to be displayed)
    @JsonProperty
    String[] externalListParameters() default "";

    @JsonProperty
    String formatterName() default "string";

    @JsonProperty
    boolean key() default false;

    @JsonProperty
    boolean visibleOnTable() default true;

    @JsonProperty
    boolean editable() default true;

    @JsonProperty
    boolean multiple() default false;

    @JsonProperty
    boolean visibleOnForm() default true;

    @JsonProperty
    String[] choices() default "";

    @JsonProperty
    String[] reference() default "";

    //ROLE MANAGEMENT
    @JsonProperty
    String viewRole() default "";

    @JsonProperty
    String editRole() default "";

    @JsonProperty
    String createRole() default "";

    @JsonProperty
    int minimumViewRoleVal() default 2;

    @JsonProperty
    int minimumEditRoleVal() default 2;

    @JsonProperty
    int minimumCreateRoleVal() default 2;

    //HITORY MANAGENT
    @JsonProperty
    boolean DMP() default false;
}
