/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(function () {
    console.log("loading workload");
    //kpi_workload_loadSettings($("#div-grid-wrapper"));
    kpi_loadSettings($("#div-grid-wrapper"), "workload", "PIVOTTABLE_GETTABLE", "PIVOTTABLE_EDIT", "LAB_KPI_WORKPRESSURE");

})

function loadPivotTable(_data, _settings) {
    console.log("loadPivotTable()");
    var dateFormat = $.pivotUtilities.derivers.dateFormat;
    var extraOptions = {
        derivedAttributes: {
            "Dagdeel": function (record) {
                if ((parseInt(record.ONTVANGST) >= 6 && parseInt(record.ONTVANGST) < 12)) {
                    return "Ochtend";
                } else {
                    if ((parseInt(record.ONTVANGST) >= 12 && parseInt(record.ONTVANGST) < 17)) {
                        return "Middag"
                    } else {
                        if ((parseInt(record.ONTVANGST) >= 17 && parseInt(record.ONTVANGST) <= 23)) {
                            return "Avond"
                        } else {
                            return "Nacht";
                        }
                    }
                }
            },
            "Maand": dateFormat("DATUM", "%y%m", true),
            "Dag (alfabetisch)": dateFormat("DATUM", "%y%m%d %w", true),
            "Dag": dateFormat("DATUM", "%w", true),
            "Week": function (record) {
                return moment(record.DATUM).week();
            }
        },
        sorters: {
            "Dag (alfabetisch)": function (a, b) {
                return parseInt(a.substring(0, 9)) - parseInt(b.substring(0, 9));
            }
        }
    };

    var dateFormat = $.pivotUtilities.derivers.dateFormat;
    var sortAs = $.pivotUtilities.sortAs;
    var derivers = $.pivotUtilities.derivers;
    var renderers = $.extend($.pivotUtilities.renderers,
            $.pivotUtilities.plotly_renderers);

    var options = {
        renderers: renderers,
        menuLimit: 1000
    }

    $.each(extraOptions, function (i, val) {
        options[i] = val;
    });
    bootstrap_alert.warning('Loading data in data', 'info', 3000);
    if (typeof _settings !== "undefined") {
        try {
            var settings = JSON.parse(_settings);
            $.each(extraOptions, function (i, val) {
                settings[i] = val;
            });
            $("#output").pivotUI(_data, settings, true);

        } catch (e) {
            $("#output").pivotUI(_data, options);
        }

    } else {
        $("#output").pivotUI(_data, options);

    }
    bootstrap_alert.warning('Done', 'info', 1000);

}