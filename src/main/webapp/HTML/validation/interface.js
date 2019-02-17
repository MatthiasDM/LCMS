/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var lastSelection;
var originalDocument = "";
$(function () {

    let gridController = new LCMSgridController();
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
        makeGrid(editor, key, value);
    });
}

function makeGrid(editor, gridId, gridParam) {
    var grid = $("<table id='" + gridId + "'></table>");
    var pager = $("<div id='pager_" + gridId + "'></div>");
    editor.find("div[name*=" + gridId + "]").after(grid);
    editor.find("div[name*=" + gridId + "]").after(pager);
    editor.find("div[name*=" + gridId + "]").remove();

    var extraOptions = {
        pager: '#' + 'pager_' + gridId,
        autowidth: true,
        autoheight: true,
        rownumbers: Object.keys(Object.filter(gridParam.colModel, item => item.name === "rn")).length === 0,
        multiselect: false
    };

    if (typeof gridParam.summaries !== "undefined") {
        extraOptions.summaries = gridParam.summaries;
        extraOptions.footerrow = true;
        extraOptions.userDataOnFooter = true;
        extraOptions.loadComplete = function () {
            var sumJson = {};
            var grid = $(this);
            gridParam.summaries.forEach(function (a) {
                sumJson[a] = grid.jqGrid("getCol", a, false, "sum");
            });
            $(this).jqGrid("footerData", "set", sumJson);
            
        };
    }

    if (typeof gridParam.groups !== "undefined") {

        extraOptions.grouping = true;
        extraOptions.groupingView = {
            groupField: gridParam.groups,
            //groupColumnShow: [false, false],
            groupText: ['<b>{0} - {1} Item(s)</b>', '<b>{0} - {1} Item(s)</b>'],
            groupCollapse: true,
            groupSummaryPos: ["header", "header"],
            groupSummary: [true, true]
        }
    } else {
        extraOptions.grouping = false;
    }


    generate_grid(editor, grid, gridParam, extraOptions);

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
            return config0();
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
            }else{
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