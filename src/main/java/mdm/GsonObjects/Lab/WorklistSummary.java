/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mdm.GsonObjects.Lab;

import mdm.pojo.annotations.MdmAnnotations;

/**
 *
 * @author Matthias
 */
public class WorklistSummary {

    @MdmAnnotations(
            visibleOnForm = false,
            visibleOnTable = false,
            createRole = "GOD",
            editRole = "GOD",
            type = "string")
    public String ordernr;
    @MdmAnnotations(
            visibleOnForm = false,
            visibleOnTable = false,
            createRole = "GOD",
            editRole = "GOD",
            type = "string")
    public String testName;
    @MdmAnnotations(
            visibleOnForm = false,
            visibleOnTable = false,
            createRole = "GOD",
            editRole = "GOD",
            type = "string")
    public String rawValue;
    @MdmAnnotations(
            visibleOnForm = false,
            visibleOnTable = false,
            createRole = "GOD",
            editRole = "GOD",
            type = "string")
    public String station;
    @MdmAnnotations(
            visibleOnForm = false,
            visibleOnTable = false,
            createRole = "GOD",
            editRole = "GOD",
            type = "string")
    public String date;

    public WorklistSummary(String ordernr, String testName, String rawValue, String station, String date) {
        this.ordernr = ordernr;
        this.testName = testName;
        this.rawValue = rawValue;
        this.station = station;
        this.date = date;
    }

    public WorklistSummary() {
    }

    public String getOrdernr() {
        return ordernr;
    }

    public void setOrdernr(String ordernr) {
        this.ordernr = ordernr;
    }

    public String getTestName() {
        return testName;
    }

    public void setTestName(String testName) {
        this.testName = testName;
    }

    public String getRawValue() {
        return rawValue;
    }

    public void setRawValue(String rawValue) {
        this.rawValue = rawValue;
    }

    public String getStation() {
        return station;
    }

    public void setStation(String station) {
        this.station = station;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

}
