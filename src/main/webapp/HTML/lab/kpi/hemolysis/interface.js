/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(function () {
    console.log("loading hemolysis");
    kpi_loadSettings($("#div-grid-wrapper"), "hemolysis", "PIVOTTABLE_GETTABLE", "PIVOTTABLE_EDIT", "LAB_KPI_HEMOLYSIS");
})

function loadPivotTable(_data, _settings) {
    console.log("loadPivotTable()");
    var dateFormat = $.pivotUtilities.derivers.dateFormat;
    var bin = $.pivotUtilities.derivers.bin;
    var tpl = $.pivotUtilities.aggregatorTemplates;


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
            "Hemolyse": function (record) {
                if (record.HEMOLYSE > 50) {
                    return "Ja";
                } else {
                    return "Nee";
                }
            },
            "Week": function (record) {
                return moment(record.DATUM).week();
            }

        },
        sorters: {
            "Dag (alfabetisch)": function (a, b) {
                return parseInt(a.substring(0, 9)) - parseInt(b.substring(0, 9));
            }
        },
        filter: function (record) {
            return record["LEEFTIJD"] > 0.02;
        },
        hiddenAttributes: ["Dagdeel", "Week"]
//        aggregators: {
//            "Average Hemolyse": function () {
//                return tpl.count()()
//            }
//        }
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
   // bootstrap_alert.warning('Loading data in data', 'info', 3000);
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
   // bootstrap_alert.warning('Done', 'info', 1000);

}


















//
//
//
//
//$(function () {
//    console.log("loading hemolysis");
//    var dateFormat = $.pivotUtilities.derivers.dateFormat;
//    var derivedAttributes = {
//        derivedAttributes: {
//            "Maand": dateFormat("DATUM", "%y%m", true),
//            "Dag (alfabetisch)": dateFormat("DATUM", "%y%m%d %w", true),
//            "Dag": dateFormat("DATUM", "%w", true),
//            "Week": function (record) {
//                return moment(record.DATUM).week();
//            }
//        },
//        sorters: {
//            "Dag (alfabetisch)": function (a, b) {
//                return parseInt(a.substring(0, 9)) - parseInt(b.substring(0, 9));
//            }
//        }
//    };
//    kpi_hemolysis_doLoad($("#hemolysis-container"), derivedAttributes);
//
//})
//
//function kpi_hemolysis_doLoad(_parent, _extraOptions) {
//    console.log("kpi_hemolysis_doLoad()")
//    var _cookie = $.cookie('LCMS_session');
//    $.ajax({
//        method: "POST",
//        url: "./lab",
//        data: {action: "LAB_KPI_HEMOLYSIS", LCMS_session: _cookie},
//        beforeSend: function (xhr) {
//            xhr.overrideMimeType("application/html");
//        }
//    }).done(function (data) {
//
//        var jsonData = JSON.parse(data);
//        var data = JSON.parse(jsonData.data);
//        data.forEach(function lines(line, index) {
//            line = line.replace(/[']/g, "\"");
//            line = line.replace(/[<]/g, "");
//            line = line.replace(/[>]/g, "");
//            line = JSON.parse(line);
//            data[index] = line;
//
//        })
//        loadPivotTable(data, _extraOptions);
//    }).fail(function (data) {
//        alert("Sorry. Server unavailable. ");
//    });
//}
//
//function loadPivotTable(_data, _extraOptions) {
//    console.log("loadPivotTable()");
//    var dateFormat = $.pivotUtilities.derivers.dateFormat;
//    var sortAs = $.pivotUtilities.sortAs;
//    var derivers = $.pivotUtilities.derivers;
//    var renderers = $.extend($.pivotUtilities.renderers,
//            $.pivotUtilities.plotly_renderers);
//
//    var options = {
//        renderers: renderers,
//        sorters: {
//            "month name": sortAs(["Jan", "Feb", "Mar", "Apr", "May",
//                "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]),
//            // "day name": sortAs(["Mon", "Tue", "Wed", "Thu", "Fri",
//            //    "Sat", "Sun"])
//        }
//    }
//
//    $.each(_extraOptions, function (i, val) {
//        options[i] = val;
//    });
//
//    $("#output").pivotUI(_data, options);
//
//}