/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Object.filter = (obj, predicate) =>
    Object.keys(obj)
            .filter(key => predicate(obj[key]))
            .reduce((res, key) => (res[key] = obj[key], res), {});


var lastSelection;
var originalDocument = "";
let documentPage = {};

$(function () {

    loadPage();
    $(document).mouseup(function (e)
    {
        var container = $("#div-grid-wrapper");
        if (!container.is(e.target) && container.has(e.target).length === 0){
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
        loadAction: {action: "VALIDATION_LOADVALIDATIONS"},
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
    console.log("buildDocumentPage()");
    documentPage = new LCMSEditablePage({loadAction: "VALIDATION_LOADVALIDATIONS", editAction: "VALIDATION_EDITVALIDATIONS",editUrl: "./validations", pageId: "", idName: "validationid"});
    documentPage.buildPageData(data, _parent);    
    documentPage.setPageId($($("div[id^='wrapper']")[0]).attr("id").substring(8));
}
