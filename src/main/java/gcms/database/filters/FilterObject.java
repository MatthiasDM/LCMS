/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.database.filters;

import java.util.List;

/**
 *
 * @author Matthias
 */
public class FilterObject {
    String groupOp;
    List<FilterRule> rules;

    public FilterObject() {
    }

    public FilterObject(String groupOp, List<FilterRule> rules) {
        this.groupOp = groupOp;
        this.rules = rules;
    }

    public String getGroupOp() {
        return groupOp;
    }

    public void setGroupOp(String groupOp) {
        this.groupOp = groupOp;
    }

    public List<FilterRule> getRules() {
        return rules;
    }

    public void setRules(List<FilterRule> rules) {
        this.rules = rules;
    }
    
    
}
