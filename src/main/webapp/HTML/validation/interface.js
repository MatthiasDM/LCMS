/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var lastSelection;
var originalDocument = "";
let gridController = new LCMSgridController();
$(function () {

    gridController.checkGrids();
    loadPage();
    $(document).mouseup(function (e)
    {
        var container = $("#div-grid-wrapper");

        // if the target of the click isn't the container nor a descendant of the container
        if (!container.is(e.target) && container.has(e.target).length === 0)
        {
            container.hide();
        }
    });

});


function editValidation(id, _tableObject) {
    console.log("editValidation(): " + id);
    if (id && id !== lastSelection) {
        var rowData = _tableObject.jqGrid('getRowData', id);
        var previousRowData = _tableObject.jqGrid('getRowData', lastSelection);
        console.log(rowData);
        if (typeof CKEDITOR.instances["editor-" + previousRowData.validationid] !== "undefined") {
            CKEDITOR.instances["editor-" + previousRowData.validationid].destroy();
        }
        validations_getValidation($("#div-validations"), rowData.validationid);
        lastSelection = id;
    }
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
        makeGrid2(editor, key, value);
    });
    gridController = new LCMSgridController();
    gridController.checkGrids();
    $.each(gridController.grids, function (key, value) {
        if (typeof value.subgridref !== "undefined") {
            value = option_subgrid(value, value.subgridref);
            $("#" + key).jqGrid("setGridParam", value);
            $("#" + key).trigger("reloadGrid");
        }
    });

    
}

function makeGrid2(editor, gridId, gridParam) {
    var grid = $("<table id='" + gridId + "'></table>");
    var pager = $("<div id='pager_" + gridId + "'></div>");
    editor.find("div[name*=" + gridId + "]").after(grid);
    editor.find("div[name*=" + gridId + "]").after(pager);
    editor.find("div[name*=" + gridId + "]").remove();
    var gridData = {
        data: {table: gridParam.data, header: gridParam.colModel},
        editAction: " ",
        editUrl: " ",
        tableObject: gridId,
        pagerID: gridParam.pager.replace("#", ""),
        wrapperObject: editor,
        jqGridOptions: {
            pager: '#' + 'pager_' + gridId,
            autowidth: true,
            autoheight: true,
            rownumbers: true,
            colModel: gridParam.colModel,
            caption: gridParam.caption,
            subGrid: typeof gridParam.subgridref !== "undefined",
            subgridref: gridParam.subgridref,
            subGridHasSubGridValidation: checkHasSubGrid
        },
        jqGridParameters: {
            navGridParameters: {
                add: true,
                save: true,
                del: true,
                cancel: true,
                addParams: {
                    rowID: function (options) {
                        return "row_" + uuidv4();
                    },
                    position: "last",
                    addRowParams: {
                        rowID: function (options) {
                            return "row_" + uuidv4();
                        },
                        position: "last",
                        keys: true
                    }
                },
                editParams: {
                    aftersavefunc: function (id) {
                        validation_save();
                    }
                }
            }
        }
    };
    let documentGrid = new LCMSGrid(gridData);
    var gridObject = documentGrid.createGrid();
    addGridButtons(documentGrid, gridObject, gridData, editor);    
    toggle_multiselect(grid.attr('id'));
    
    


}

function checkHasSubGrid(_rowid, _subgridref) {
    console.log("checking hasSubgrid");
    var hasSubgrid = false;
    if (typeof gridController !== "undefined" && typeof _subgridref !== "undefined") {
        if (gridController.references.length > 0) {
            var filteredObj = Object.filter(gridController.references, ref => ref.list === _subgridref.gridId);
            var keys = Object.keys(filteredObj);
            keys.forEach(function(key){
                var attr = filteredObj[key].attr;
                var filteredData = Object.filter(gridController.grids[_subgridref.gridId].data, function (row) {
                if (typeof row[attr] !== "undefined") {
                    return row[attr].includes(_rowid);
                } else {
                    return false;
                }
            });
            if(!isEmptyObj(filteredData)){
                hasSubgrid = true;
            }
            });
//            var key = Object.keys(filteredObj)[0];
//            var attr = filteredObj[key].attr;
//            var filteredData = Object.filter(gridController.grids[_subgridref.gridId].data, function (row) {
//                if (typeof row[attr] !== "undefined") {
//                    return row[attr].includes(_rowid);
//                } else {
//                    return false;
//                }
//            });
//
//            return !isEmptyObj(filteredData);
        } else {
            hasSubgrid = false;
        }

    } else {
        hasSubgrid = false;
    }
    return hasSubgrid;
}

function option_subgrid(options, subgridref) {
    console.log("option_subgrid()");
    var gridId = options.id;
    var gridCaption = options.caption;
    options.subGrid = true;
//    options.subGridOptions = {hasSubgrid: function (options) {
//            checkHasSubGrid(options, subgridref);
//        }};
    options.subGridRowExpanded = function (subgridDivId, rowId) {
        var subgridTableId = subgridDivId + "_t";
        $("[id='" + subgridDivId + "']").html("<table id='" + subgridTableId + "'></table>");
        var filteredObj = Object.filter(gridController.references, ref => ref.list === subgridref.gridId && ref.refList === gridCaption);
        var key = Object.keys(filteredObj)[0];
        var attr = filteredObj[key].attr;
        var filteredData = Object.filter(gridController.grids[subgridref.gridId].data, function (row) {
            if (typeof row[attr] !== "undefined") {
                return row[attr].includes(rowId);
            } else {
                return false;
            }
        });
        var key = Object.keys(filteredData)[0];
        console.log(Object.values(filteredData));
        $("[id='" + subgridTableId + "']").jqGrid({
            datatype: 'local',
            data: Object.values(filteredData),
            colNames: subgridref.colNames,
            colModel: subgridref.colModel,
            gridview: true,
            rownumbers: false,
            autoencode: true,
            responsive: true,
            headertitles: true,
            iconSet: "fontAwesome",
            guiStyle: "bootstrap4"

        });
    };
    return options;
}


function addGridButtons(documentGrid, gridObject, gridData, editor) {
    documentGrid.addGridButton("fa-pencil", "Eigenschappen wijzigen", "", function () {
        var rowid = gridObject.jqGrid('getGridParam', 'selrow');
        if (rowid !== null) {
            return popupEdit(rowid, gridObject, $(this), gridData.editAction, validation_save);
        } else {
            return bootstrap_alert.warning('Geen rij geselecteerd', 'info', 1000);
        }
    });

    documentGrid.addGridButton("fa-cogs", "Click here to change columns", "", function () {
        new_grid_popup(editor, gridObject.jqGrid('getGridParam'));
    });

    documentGrid.addGridButton("fa-download", "Download selection as csv", "", function () {
        var selRows = gridObject.jqGrid("getGridParam", "selarrrow");
        var data = gridObject.jqGrid("getGridParam", "data");
        var selRowsData = Object.filter(data, item => selRows.includes(String(item.id)) === true);
        var arr = [];
        $.each(selRowsData, function (key, value) {
            arr.push(value);
        });
        var csv = Papa.unparse(JSON.stringify(arr));
        let csvContent = "data:text/csv;charset=utf-8," + csv;
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", gridObject.jqGrid("getGridParam", "caption") + ".csv");
        document.body.appendChild(link); // Required for FF
        link.click();
        document.body.removeChild(link);
    });

    documentGrid.addGridButton("fa-trash", "Click here to change columns", "", function () {
        var rowid = gridObject.jqGrid('getGridParam', 'selrow');
        gridObject.jqGrid('delRowData', rowid);
    });

    documentGrid.addGridButton("fa-list-ul", "Click here to change columns", "", function () {
        toggle_multiselect(gridObject.jqGrid('getGridParam', 'id'));
    });
}

function loadPage() {
    var pageData = {
        sidebarLeft: "sidebar",
        sidebarLeftList: "sidebar-list",
        sidebarRight: "validations-list",
        sidebarRightTable: "validations-table",
        sidebarRightTablePager: "validations-pager",
        containerID: "validations-container",
        mainPageContentDivId: "div-validations",
        ckConfig: function () {
            return config2();
        }
    };

    var gridData = {
        data: {},
        editAction: "VALIDATION_EDITVALIDATIONS",
        loadAction: "VALIDATION_LOADVALIDATIONS",
        editUrl: "./validations",
        tableObject: pageData.sidebarRightTable,
        pagerID: pageData.sidebarRightTablePager,
        wrapperObject: $("#div-grid-wrapper"),
        jqGridOptions: {
            grouping: true,
            groupingView: {
                groupField: ['category'],
                groupColumnShow: [false],
                groupText: ['<b>{0} - {1} Item(s)</b>'],
                groupCollapse: true
            },
            caption: "Documenten"
        },
        jqGridParameters: {
            navGridParameters: {add: false}
        }
    };
    gridData.jqGridOptions.onSelectRow = function (rowid) {
        return editValidation(rowid, $("#" + gridData.tableObject));
    };

    let documentPage = new LCMSSidebarPage(pageData, gridData);
    $("body").append(documentPage.createPage());

}

function buildDocumentPage(data, _parent) {
    _parent.empty();
    console.log("Start loading validations");
    var jsonData = JSON.parse(data, _parent);
    var grids = {};
    jsonData.parent = _parent;
    if (typeof (jsonData.replaces) !== "undefined") {
        jsonData.webPage = replaceAll(jsonData.webPage, "validations-id", jsonData.replaces["validations-id"]);
        console.log("Regenerating grids...");
        try {
            var validations_content = {};
            if (jsonData.replaces["validations-content"] !== "") {
                validations_content = $.parseJSON(jsonData.replaces["validations-content"]);
                originalDocument = JSON.stringify(validations_content);
            } else {
                validations_content.html = "";
                validations_content.grids = {};
                originalDocument = '';
            }
            jsonData.webPage = replaceAll(jsonData.webPage, "validations-content", validations_content.html);

            grids = validations_content.grids;

        } catch (e) {
            bootstrap_alert.warning("Something went wrong", "error", "1000");
        }
        _parent.click();
    }
    jsonData.parent.empty();
    loadValidationPage(jsonData, grids);
}

function set_multiselect(gridId, set) {
    if (set) {
        $('#' + gridId).jqGrid('showCol', 'cb');
        jQuery('.jqgrow').unbind('click');
    } else {
        $('#' + gridId).jqGrid('hideCol', 'cb');
        jQuery('.jqgrow').click(function () {
            jQuery('#' + gridId).jqGrid('resetSelection');
            this.checked = true;
        });
    }
}

function getDataFromPage() {
    var htmlData = $('<output>').append($($.parseHTML($($("div[id^='wrapper']")[0]).prop("innerHTML"))));
    gridController.checkGrids();
    htmlData.find(("div[id^=gbox_grid]")).each(function (a, b) {
        $(b).after("<div name='" + $(b).attr('id') + "'></div>");
        $(b).remove();
    });
    var data = {};
    data['html'] = htmlData.prop("innerHTML");
    data['grids'] = getTrimmedGridControllerGrids();
    data['html'] = removeElements("nosave", data['html']);
    return data;
}

function validation_save() {
    console.log("validation_save()");
// PREPARE FORM DATA
    var validationid = $($("div[id^='wrapper']")[0]).attr("id").substring(8);
    var data = JSON.stringify(getDataFromPage());
    var patches = getPatches(originalDocument, data);
    var _cookie = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: "./validations",
        data: {action: "VALIDATION_EDITVALIDATIONS", LCMS_session: _cookie, contents: patches, validationid: validationid, oper: 'edit'},
        beforeSend: function (xhr) {
            xhr.overrideMimeType("application/html");
        }
    }).done(function (_data) {
        originalDocument = data;
        bootstrap_alert.warning('Validatie opgeslaan', 'success', 2000);
        console.log("Changes saved.");
    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });
}

function getTrimmedGridControllerGrids() {
    var gridControllerCopy = jQuery.extend(true, {}, gridController);
    $.each(gridControllerCopy.grids, function (index, item) {
        var colModel = item.colModel;
        var colNames = item.colNames;
        var colModelArray = [];
        var colNameArray = [];
        var c = 0;
        var colModelCopy = jQuery.extend(true, {}, colModel);
        colModelCopy = Object.filter(colModelCopy, model => model.name !== "rn" & model.name !== "cb" & model.name !== "subgrid");
        $.each(colModelCopy, function (i, j) {
            colModelArray[c] = colModel[i];
            colNameArray.push(j.name);
            c++;
        });
        item.colNames = colNameArray;
        item.colModel = colModelArray;
    });
    return gridControllerCopy.grids;
}