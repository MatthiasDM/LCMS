/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.GsonObjects.Core;

import java.util.List;
import gcms.GsonObjects.annotations.gcmsObject;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
/**
 *
 * @author Matthias
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class ChronJob {

    @gcmsObject(type = "string", visibleOnTable = false, visibleOnForm = false)
    public String chronjobid;
    @gcmsObject(
            type = "select",
            multiple = true,
            reference = {"Mongo", "commands", "commandid", "name"},
            visibleOnTable = true,
            editRole = "ICTMANAGER")
    public List<String> commmands;
    @gcmsObject(
            type = "string",
            editRole = "ADMIN",
            visibleOnTable = false
    )
    public String parameters;
    @gcmsObject(
            type = "number",
            editRole = "ICTMANAGER"
    )
    public String interval;

    @gcmsObject(
            type = "datetime",
            editRole = "ICTMANAGER")
    public long start;
    @gcmsObject(
            type = "datetime",
            editRole = "ICTMANAGER")
    public long last;
    @gcmsObject(
            type = "datetime",
            editRole = "ICTMANAGER")
    public long stop;

    public ChronJob() {
    }

    public String getParameters() {
        return parameters;
    }

    public void setParameters(String parameters) {
        this.parameters = parameters;
    }

    public ChronJob(String chronjobid, List<String> commmands, String parameters, String interval, long start, long last, long stop) {
        this.chronjobid = chronjobid;
        this.commmands = commmands;
        this.parameters = parameters;
        this.interval = interval;
        this.start = start;
        this.last = last;
        this.stop = stop;
    }

 

    public long getLast() {
        return last;
    }

    public void setLast(long last) {
        this.last = last;
    }

    public List<String> getCommmands() {
        return commmands;
    }

    public void setCommmands(List<String> commmands) {
        this.commmands = commmands;
    }

    public String getChronjobid() {
        return chronjobid;
    }

    public void setChronjobid(String chronjobid) {
        this.chronjobid = chronjobid;
    }

    public String getInterval() {
        return interval;
    }

    public void setInterval(String interval) {
        this.interval = interval;
    }

    public long getStart() {
        return start;
    }

    public void setStart(long start) {
        this.start = start;
    }

    public long getStop() {
        return stop;
    }

    public void setStop(long stop) {
        this.stop = stop;
    }

}
