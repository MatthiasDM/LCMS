/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm.pojo.annotations;

/**
 *
 * @author matmey
 */
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import mdm.Core;

@Documented
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Inherited
//@Retention(RetentionPolicy.RUNTIME)
public @interface MdmAnnotations {

    String type() default "string";

    boolean visibleOnTable() default true;

    boolean editable() default true;

    boolean multiple() default false;

    boolean visibleOnForm() default true;

    String[] choices() default "";

    String[] reference() default "";

    //ROLE MANAGEMENT
    String viewRole() default "";

    String editRole() default "";

    String createRole() default "";

    int minimumViewRoleVal() default 2;

    int minimumEditRoleVal() default 2;

    int minimumCreateRoleVal() default 2;

    //HITORY MANAGENT
    boolean DMP() default false;
}
