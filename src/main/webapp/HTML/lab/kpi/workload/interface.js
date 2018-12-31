/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(function () {
    console.log("loading workload");
    var derivers = $.pivotUtilities.derivers;
    var dateFormat = $.pivotUtilities.derivers.dateFormat;
    var derivedAttributes = {
        "Maand": dateFormat("DATUM", "%n", true),
        "Week": function (record) {
            return moment(record.DATUM).week();
        }
    };
    kpi_hemolysis_doLoad($("#workload-container"), derivedAttributes);

})

function kpi_workload_doLoad(_parent) {
    console.log("kpi_workload_doLoad()")
    var _cookie = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: "./lab",
        data: {action: "LAB_KPI_WORKLOAD", LCMS_session: _cookie},
        beforeSend: function (xhr) {
            xhr.overrideMimeType("application/html");
        }
    }).done(function (data) {

        var jsonData = JSON.parse(data);
        var data = JSON.parse(jsonData.data);
        data.forEach(function lines(line, index) {
            line = line.replace(/[']/g, "\"");
            line = line.replace(/[<]/g, "");
            line = line.replace(/[>]/g, "");
            line = JSON.parse(line);
            data[index] = line;

        })
        loadPivotTable(data);
    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });
}

function loadPivotTable(_data, _extraOptions) {
    console.log("loadPivotTable()");
    var dateFormat = $.pivotUtilities.derivers.dateFormat;
    var sortAs = $.pivotUtilities.sortAs;
    var derivers = $.pivotUtilities.derivers;
    var renderers = $.extend($.pivotUtilities.renderers,
            $.pivotUtilities.plotly_renderers);

    var options = {
        renderers: renderers,
        sorters: {
            "month name": sortAs(["Jan", "Feb", "Mar", "Apr", "May",
                "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]),
            // "day name": sortAs(["Mon", "Tue", "Wed", "Thu", "Fri",
            //    "Sat", "Sun"])
        }
    }

    $.each(_extraOptions, function (i, val) {
        options[i] = val;
    });

    $("#output").pivotUI(_data, options);

}