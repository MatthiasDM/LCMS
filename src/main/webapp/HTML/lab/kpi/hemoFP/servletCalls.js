/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function kpi_hemoFP_loadSettings(_parent) {
    console.log("hemoFP load");
    var _cookie = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: "./lab",
        data: {action: "PIVOTTABLE_GETTABLE", page: "hemoFP", LCMS_session: _cookie},
        beforeSend: function (xhr) {
            xhr.overrideMimeType("application/html");
        }
    }).done(function (data) {
        var jsonData = JSON.parse(data);
        console.log(jsonData.webPage);
        if (typeof jsonData.webPage !== 'undefined') {
            jsonData.parent = _parent;
            loadParameters(jsonData);
        } else {
            var lastSelection;
            function editRow(id) {
                if (id && id !== lastSelection) {
                    var grid = $("#hemoFP-table");
                    var rowData = grid.getRowData(id);
                    kpi_hemoFP_doLoad(rowData['settings'])
                    lastSelection = id;
                }
            }

            var extraOptions = {
                viewrecords: true,
                ondblClickRow: editRow,
                inlineEditing: { keys: true, defaultFocusField: "amount", focusField: "amount" }
            };

            var parameters = {
                navGridParameters: {
                    edit: true,
                    add: true,
                    save: true,
                    del: true,
                    addParams: {
                        addRowParams: {//DEZE WORDT GEBRUIKT BIJ HET TOEVOEGEN VAN DATA!!!!!!!!!!!!!
                            extraparam: {action: "PIVOTTABLE_EDIT", settings: getConfig, page: "hemoFP", LCMS_session: $.cookie('LCMS_session')}
                        }
                    },
                    editParams: {
                        keys: true,
                        extraparam: {action: "PIVOTTABLE_EDIT", settings: getConfig, test: 'test', page: "hemoFP", LCMS_session: $.cookie('LCMS_session')}
                    }

                },
                editParameters: {
                    extraparam: {action: "PIVOTTABLE_EDIT", settings: getConfig, page: "hemoFP", LCMS_session: $.cookie('LCMS_session')}
                }
            };
            populateTable(jsonData, "PIVOTTABLE_EDIT", './lab', $("#hemoFP-table"), "#hemoFP-pager", $("#div-grid-wrapper"), "Configuraties", extraOptions, parameters);

            if (JSON.parse(jsonData.table).length < 1) {
                kpi_hemoFP_doLoad();
            }
        }
    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });
}

function getConfig() {
    var config = $("#output").data("pivotUIOptions");
    var config_copy = JSON.parse(JSON.stringify(config));
    //delete some values which will not serialize to JSON
    delete config_copy["aggregators"];
    delete config_copy["renderers"];
    return JSON.stringify(config_copy);
}

function kpi_hemoFP_addSettings(name, settings) {

    var _cookie = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: "./lab",
        data: {action: "PIVOTTABLE_EDIT", LCMS_session: _cookie, name: name, settings: settings, page: "hemoFP", oper: 'add'},
        beforeSend: function (xhr) {
            xhr.overrideMimeType("application/html");
        }
    }).done(function (data) {
        bootstrap_alert.warning('Notitie opgeslaan', 'success', 2000);
        console.log("Changes saved.")
    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });

}

function kpi_hemoFP_doLoad(_settings) {
    console.log("kpi_hemoFP_doLoad()")
    var _cookie = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: "./lab",
        data: {action: "LAB_KPI_HEMOFP", LCMS_session: _cookie},
        beforeSend: function (xhr) {
            xhr.overrideMimeType("application/html");
        }
    }).done(function (data) {
        bootstrap_alert.warning('Getting data', 'info', 3000);
        var jsonData = JSON.parse(data);
        var data = JSON.parse(jsonData.data);
        data.forEach(function lines(line, index) {
            line = line.replace(/[']/g, "\"");
            line = line.replace(/[<]/g, "");
            line = line.replace(/[>]/g, "");
            line = JSON.parse(line);
            data[index] = line;

        });
                loadPivotTable(data, _settings);

//        var csvData = JSON.parse(data).data.replace(/[\[]/g, "");
//        csvData = JSON.parse(data).data.replace(/[\]]/g, "");
//        var parsed = Papa.parse(csvData);
//        Papa.parse(csvData, {
//            complete: function (parsed) {
//                loadPivotTable(parsed.data, _settings);
//            }
//        });





    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });
}
