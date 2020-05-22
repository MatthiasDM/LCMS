/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gcms.GsonObjects.Core;

import gcms.GsonObjects.annotations.MdmAnnotations;

/**
 *
 * @author Matthias
 */
public class ChronJob {

    @MdmAnnotations(type = "string", visibleOnTable = false, visibleOnForm = false)
    public String chronjobid;
    @MdmAnnotations(
            type = "string",
            editRole = "ADMIN"
    )
    public String commandid;
    @MdmAnnotations(
            type = "number",
            editRole = "ADMIN"
    )
    public String interval;

    @MdmAnnotations(
            type = "datetime",
            editRole = "ADMIN")
    public long start;
    @MdmAnnotations(
            type = "datetime",
            editRole = "ADMIN")
    public long stop;

    public ChronJob() {
    }

    public ChronJob(String chronjobid, String commandid, String interval, long start, long stop) {
        this.chronjobid = chronjobid;
        this.commandid = commandid;
        this.interval = interval;
        this.start = start;
        this.stop = stop;
    }

    public String getChronjobid() {
        return chronjobid;
    }

    public void setChronjobid(String chronjobid) {
        this.chronjobid = chronjobid;
    }

    public String getCommandid() {
        return commandid;
    }

    public void setCommandid(String commandid) {
        this.commandid = commandid;
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
