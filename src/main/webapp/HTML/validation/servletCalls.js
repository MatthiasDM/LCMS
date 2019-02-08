/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function validations_doLoad(_parent) {
    console.log("Validations load");

    var _cookie = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        async: true,
        url: "./validations",
        data: {action: "VALIDATION_LOADVALIDATIONS", LCMS_session: _cookie},
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
            var extraOptions = {
                grouping: true,
                groupingView: {
                    groupField: ['category'],
                    groupColumnShow: [false],
                    groupText: ['<b>{0} - {1} Item(s)</b>'],
                    groupCollapse: false
                }
            };
            //fa fa-lg fa-fw fa-pencil
            extraOptions.onSelectRow = editValidation;
            populateTable(jsonData, "VALIDATION_EDITVALIDATIONS", './validations', $("#validations-table"), "#validations-pager", $("#div-grid-wrapper"), "Al uw persoonlijke notities", extraOptions);
            $("#validations-table").navButtonAdd("#validations-pager", {
                caption: "",
                title: "Edit properties",
                buttonicon: "fa-pencil",
                onClickButton: function () {
                    var rowid = $("#validations-table").jqGrid('getGridParam', 'selrow');
                    if(rowid !== null){
                       popupEdit(rowid, $("#validations-table"), $(this), "VALIDATION_EDITVALIDATIONS"); 
                    }else{
                        bootstrap_alert.warning('Geen rij geselecteerd', 'info', 1000);                        
                    }
                    
                },
                position: "last"
            });
        }
    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });
}



function editRow() {

    setTimeout(function () {
        var _tableObject = $("#validations-table");
        var grid = _tableObject;
        var rowKey = grid.getGridParam("selrow");
        if (rowKey) {
            grid.editGridRow(rowKey,
                    {
                        closeAfterEdit: true,
                        extraparam: {action: "VALIDATION_EDITVALIDATIONS", LCMS_session: $.cookie('LCMS_session')}

                    });
        } else {
            console.log("No rows are selected");
        }
    }, 500);

}

var lastSelection;

function editValidation(id) {
    var _tableObject = $("#validations-table");

    var grid = _tableObject;
    // var id = grid.getGridParam("selrow");
    console.log(id);
    //$('#validations-list').BootSideMenu.close();

    if (id && id !== lastSelection) {
        var rowData = grid.jqGrid('getRowData', id);
        var previousRowData = grid.jqGrid('getRowData', lastSelection);
        console.log(rowData);
        if (typeof CKEDITOR.instances["editor-" + previousRowData.validationid] !== "undefined") {
            CKEDITOR.instances["editor-" + previousRowData.validationid].destroy();
        }
        validations_getValidation($("#div-validations"), rowData.validationid);
        lastSelection = id;
    }
}

function validations_getValidation(_parent, _id) {

    var _cookie = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: "./validations",
        data: {action: "VALIDATION_GETVALIDATION", LCMS_session: _cookie, id: _id},
        beforeSend: function (xhr) {
            xhr.overrideMimeType("application/html");
        }
    }).done(function (data) {
        //_parent.append(data);
        _parent.empty();
        console.log("Start loading validations");
        var jsonData = JSON.parse(data, _parent);
        var grids = {};
        jsonData.parent = _parent;
        if (typeof (jsonData.parameters) !== "undefined") {
            // jsonData.parameters["validations-metadata"] = validations_createMetaDataHeader(jsonData.parameters["validations-metadata"]);
        }
        if (typeof (jsonData.replaces) !== "undefined") {
            jsonData.webPage = replaceAll(jsonData.webPage, "validations-id", jsonData.replaces["validations-id"]);
            //jsonData.webPage = replaceAll(jsonData.webPage, "validations-short-id", replaceAll(jsonData.replaces["validations-id"].toString(),"-", ""));
            console.log("Regenerating grids...");

            try {
                var validations_content = $.parseJSON(jsonData.replaces["validations-content"]);
                jsonData.webPage = replaceAll(jsonData.webPage, "validations-content", validations_content.html);
                grids = validations_content.grids;

            } catch (e) {
                jsonData.webPage = replaceAll(jsonData.webPage, "validations-content", jsonData.replaces["validations-content"]);
            }

            _parent.click();
        }
        jsonData.parent.empty();
        loadValidationPage(jsonData, grids);



        console.log("Fetched one validations.");
    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });

}

function loadValidationPage(jsonData, grids) {
    console.log("loadValidationPage()");
    var webPage = $($.parseHTML(jsonData.webPage, document, true));
    var scripts = jsonData.scripts;
    var parameters = jsonData.parameters;

    $.each(parameters, function (key, value) {
        webPage.find("[LCMS='" + key + "']").append(value);
    });
    jsonData.parent.append(webPage);
    jsonData.parent.append("<script>" + scripts + "</script>");

    var editor = $($("div[id^='wrapper']")[0]);
    $.each(grids, function (key, value) {
        var grid = $("<table id='" + key + "'></table>");
        var pager = $("<div id='pager_" + key + "'></div>");
        editor.find("div[name*=" + key + "]").after(grid);
        editor.find("div[name*=" + key + "]").after(pager);
        editor.find("div[name*=" + key + "]").remove();

        var extraOptions = {
            pager: '#' + 'pager_' + key,
            autowidth: true,
            autoheight: true,
            rownumbers: Object.keys(Object.filter(value.colModel, item => item.name == "rn")).length === 0
        };

        if (typeof value.summaries !== "undefined") {
            extraOptions.summaries = value.summaries;
            extraOptions.footerrow = true;
            extraOptions.userDataOnFooter = true;
            extraOptions.loadComplete = function () {
                var sumJson = {};
                var grid = $(this);
                value.summaries.forEach(function (a) {
                    sumJson[a] = grid.jqGrid("getCol", a, false, "sum");
                });
                $(this).jqGrid("footerData", "set", sumJson);
            };
        }

        if (typeof value.groups !== "undefined") {

            extraOptions.grouping = true;
            extraOptions.groupingView = {
                groupField: value.groups,
                //groupColumnShow: [false, false],
                groupText: ['<b>{0} - {1} Item(s)</b>', '<b>{0} - {1} Item(s)</b>'],
                groupCollapse: true,
                groupSummaryPos: ["header", "header"],
                groupSummary: [true, true]
            }
        } else {
            extraOptions.grouping = false;
        }


        generate_grid(editor, grid, value, extraOptions);
    });
}

function validations_save(instance) {
// PREPARE FORM DATA
    var data = CKEDITOR.instances[instance].getData();
    data = removeElements("nosave", data);

    var _cookie = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: "./validations",
        data: {action: "VALIDATION_EDITVALIDATIONS", LCMS_session: _cookie, content: data, docid: instance.substring(7), oper: 'edit'},
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

