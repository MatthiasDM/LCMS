/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.database.filters;

/**
 *
 * @author Matthias
 */
public class FilterRule {
    String field;
    String op;
    String data;

    public FilterRule() {
    }

    public FilterRule(String field, String op, String data) {
        this.field = field;
        this.op = op;
        this.data = data;
    }

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }

    public String getOp() {
        return op;
    }

    public void setOp(String op) {
        this.op = op;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }
    
    
}
