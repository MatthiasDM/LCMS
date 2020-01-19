/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.GsonObjects.Other;

import gcms.GsonObjects.annotations.MdmAnnotations;

/**
 *
 * @author Matthias
 */
public class PivotTable {

    @MdmAnnotations(type = "string", visibleOnTable = false, visibleOnForm = false)
    public String pivottableid;
    @MdmAnnotations(
            type = "string",
            visibleOnTable = false,
            visibleOnForm = false
    )
    public String page;
    @MdmAnnotations(
            type = "string")
    public String name;
    @MdmAnnotations(
            type = "string",
            visibleOnTable = false,
            visibleOnForm = false
    )
    public String settings;

    public PivotTable(String pivottableid, String page, String name, String settings) {
        this.pivottableid = pivottableid;
        this.page = page;
        this.name = name;
        this.settings = settings;
    }

    public PivotTable() {
    }

    public String getPivottableid() {
        return pivottableid;
    }

    public void setPivottableid(String pivottableid) {
        this.pivottableid = pivottableid;
    }

    public String getPage() {
        return page;
    }

    public void setPage(String page) {
        this.page = page;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSettings() {
        return settings;
    }

    public void setSettings(String settings) {
        this.settings = settings;
    }

}
