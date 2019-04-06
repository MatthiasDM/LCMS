/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//copy $("table[class='pvtTable']") to document

var lastSelection;
var originalDocument = "";
let documentPage = {};
$(function () {
    console.log("loading citrate");

    var lastSelection;
    function editRow(id, table, kpiAction) {
        if (id && id !== lastSelection) {
            var grid = table;
            var rowData = grid.getRowData(id);
            var previousRowData = table.jqGrid('getRowData', lastSelection);

            if (typeof CKEDITOR.instances["editor-" + previousRowData.validationid] !== "undefined") {
                CKEDITOR.instances["editor-" + previousRowData.validationid].destroy();
            }
            editPage(kpiAction, rowData['settings']);
            lastSelection = id;
            
            // validations_getValidation($("#div-validations"), rowData.validationid);


        }
    }


    var pageData = {
        sidebarLeft: "sidebar",
        sidebarLeftList: "sidebar-list",
        sidebarRight: "citrate-list",
        sidebarRightTable: "citrate-table",
        sidebarRightTablePager: "citrate-pager",
        containerID: "citrate-container",
        mainPageContentDivId: "div-citrate",
        ckConfig: function () {
            return config2();
        }
    };

    var gridData = {
        data: {},
        editAction: "PIVOTTABLE_EDIT",
        loadAction: {action: "PIVOTTABLE_GETTABLE", page: "citrate"},
        page: "citrate",
        editUrl: "./lab",
        tableObject: "citrate-table",
        pagerID: "citrate-pager",
        wrapperObject: $("#div-grid-wrapper"),
        extraButtons: {viewButton: new LCMSTemplateGridButton("fa-eye", "Statistiek bekijken", "", function () {
                var rowid = $("#citrate-table").jqGrid('getGridParam', 'selrow');
                editRow(rowid, $("#citrate-table"), "LAB_KPI_CITRATE");
            })},
        jqGridOptions: {
            grouping: false,
            caption: "Statistieken"
        },
        jqGridParameters: {
            navGridParameters: {
                add: false,
                addParams: {
                    addRowParams: {//DEZE WORDT GEBRUIKT BIJ HET TOEVOEGEN VAN DATA!!!!!!!!!!!!!
                        extraparam: {action: "PIVOTTABLE_EDIT", settings: getConfig, page: "citrate", LCMS_session: $.cookie('LCMS_session')}
                    }
                },
                editParams: {
                    keys: true,
                    extraparam: {action: "PIVOTTABLE_EDIT", settings: getConfig, page: "citrate", LCMS_session: $.cookie('LCMS_session')}
                }

            },
            editParameters: {
                extraparam: {action: "PIVOTTABLE_EDIT", settings: getConfig, page: "citrate", LCMS_session: $.cookie('LCMS_session')}
            }
        }
    };

    //  kpi_loadSettings($("#div-grid-wrapper"), "citrate", "PIVOTTABLE_GETTABLE", "PIVOTTABLE_EDIT", "LAB_KPI_CITRATE");

    let documentPage = new LCMSSidebarPage(pageData, gridData);
    $("body").append(documentPage.createPage());

})



function editPage(kpiAction, _settings) {

    console.log("kpi_doLoad()");

    let loading = new LCMSloading(false);
    loading.loading();
    LCMSRequest("./lab", {action: kpiAction}, onDone);
    function onDone(data) {
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
        loading.setLoaded(true);
    }
}

function buildDocumentPage(data, _parent) {
    console.log("buildDocumentPage()");
    documentPage = new LCMSEditablePage({loadAction: "EDITABLEPAGE_GETEDITABLEPAGE", editAction: "EDITABLEPAGE_EDITEDITABLEPAGE",editUrl: "./editablepages", pageId: "", idName: "editablepageid"});
    documentPage.buildPageData(data, _parent);    
    documentPage.setPageId($($("div[id^='wrapper']")[0]).attr("id").substring(8));
}

function getConfig() {
    var config = $("#output").data("pivotUIOptions");
    var config_copy = JSON.parse(JSON.stringify(config));
    //delete some values which will not serialize to JSON
    delete config_copy["aggregators"];
    delete config_copy["renderers"];
    return JSON.stringify(config_copy);
}

function loadPivotTable(_data, _settings) {
    console.log("loadPivotTable()");
    var dateFormat = $.pivotUtilities.derivers.dateFormat;
    var extraOptions = {
        derivedAttributes: {
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
        },
//        aggregators: {
//            TAT: function () {
//                return function () {
//                    return {
//                        TAT: [],
//                        push: function (record) {
//                            this.TAT.push(record.TAT);
//                        },
//                        value: function () {
//                            return TAT;
//                        },
//                        format: function (x) {
//                            return x;
//                        },
//                        numInputs: 0
//                    };
//                };
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
    bootstrap_alert.warning('Loading data in data', 'info', 3000);
    $("body").append("<div id='output'></div>");
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
    return true;
}