/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function kpi_loadSettings(_parent, page, getAction, editAction, kpiAction) {
    console.log("kpi_loadSettings()");
    var _cookie = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: "./lab",
        data: {action: getAction, page: page, LCMS_session: _cookie},
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
                    var grid = $("#" + page + "-table");
                    var rowData = grid.getRowData(id);

                    kpi_doLoad(kpiAction, rowData['settings'])
                    lastSelection = id;
                }
            }
            var extraOptions = {
                viewrecords: true
                        //ondblClickRow: editRow
            };

            var parameters = {
                navGridParameters: {
                    edit: true,
                    add: true,
                    save: true,
                    del: true,
                    cancel: true,
                    addParams: {
                        addRowParams: {//DEZE WORDT GEBRUIKT BIJ HET TOEVOEGEN VAN DATA!!!!!!!!!!!!!
                            extraparam: {action: editAction, settings: getConfig, page: page, LCMS_session: $.cookie('LCMS_session')}
                        }
                    },
                    editParams: {
                        keys: true,
                        extraparam: {action: editAction, settings: getConfig, page: page, LCMS_session: $.cookie('LCMS_session')}
                    }

                },
                editParameters: {
                    extraparam: {action: editAction, settings: getConfig, page: page, LCMS_session: $.cookie('LCMS_session')}
                }
            };
            populateTable(jsonData, editAction, './lab', $("#" + page + "-table"), "#" + page + "-pager", $("#div-grid-wrapper"), "Configuraties", extraOptions, parameters);

            $("#" + page + "-table").navButtonAdd("#" + page + "-pager", {
                caption: "",
                title: "View record",
                buttonicon: "fa-eye",
                onClickButton: function () {
                    var rowid = $("#" + page + "-table").jqGrid('getGridParam', 'selrow');
                    editRow(rowid);
                },
                position: "last"
            });


            

            if (JSON.parse(jsonData.table).length < 1) {
                kpi_doLoad(kpiAction);
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

function kpi_doLoad(kpiAction, _settings) {
    console.log("kpi_doLoad()")
    var _cookie = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: "./lab",
        data: {action: kpiAction, LCMS_session: _cookie},
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

        })
        loadPivotTable(data, _settings);



    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });
}
