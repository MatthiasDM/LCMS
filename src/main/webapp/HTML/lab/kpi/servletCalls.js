/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function kpi_loadSettings(_parent, page, getAction, editAction, kpiAction) {
    console.log("kpi_loadSettings()");
    var _cookie = $.cookie('LCMS_session');

    LCMSRequest("./lab", {action: getAction, page: page}, onDone);

    function onDone(data) {
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

                    kpi_doLoad(kpiAction, rowData['settings']);
                    lastSelection = id;
                }
            }

            var gridData = {
                data: jsonData,
                editAction: editAction,
                editUrl: "./lab",
                tableObject: page + "-table",
                pagerID: page + "-pager",
                wrapperObject: $("#div-grid-wrapper"),
                jqGridOptions: {
                    grouping: false,
                    caption: "Statistieken"
                },
                jqGridParameters: {
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
                }
            };
            let KPIGrid = new LCMSGrid(gridData);
            KPIGrid.createGrid();
            KPIGrid.addGridButton(new LCMSTemplateGridButton("fa-eye", "Statistiek bekijken", "", function () {
                var rowid = $("#" + page + "-table").jqGrid('getGridParam', 'selrow');
                editRow(rowid);
            }));
        }
        if (JSON.parse(jsonData.table).length < 1) {
            kpi_doLoad(kpiAction);
        }
    }
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

    console.log("kpi_doLoad()");

    let loading = new LCMSloading(false);
    loading.loading();
    LCMSRequest("./lab", {action: kpiAction}, onDone);
    function onDone(data) {
        bootstrap_alert.warning('Getting data', 'info', 3000);
        var jsonData = JSON.parse(data);
        var data = JSON.parse(jsonData.data);
        var j = data.length;
        for (var i = 0; i < j; i++) {
            var line = data[i];
            line = line.replace(/[']/g, "\"");
            line = line.replace(/[<]/g, "");
            line = line.replace(/[>]/g, "");
            line = JSON.parse(line);
            if (kpiAction === "LAB_KPI_NC") {
                var res = line["NC"].split("}");
                $.each(res, function (index, val) {
                    if (val !== "") {
                        val = val.replace("{", "");
                        val = val.replace(" ", "");
                        val = val.toString().toUpperCase();
                        if (line["ORDER"] === "B190326018") {
                            console.log("test1");
                        }
                        if (index > 0) { 
                            var newLine = $.extend( {}, line);
                            // = Object.assign(line, newLine);
                            newLine["NC"] = val;
                            data.push(newLine);
                        } else {
                            line["NC"] = val;
                        }
                    }

                });
            }
            data[i] = line;
        }



        loadPivotTable(data, _settings);
        loading.setLoaded(true);
    }
}
