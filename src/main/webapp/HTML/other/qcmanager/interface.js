/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(function () {
    qcmanager_doLoad($("#qc-container"));
    qctestmanager_doLoad($("#qc-container"));
});
/*function populateTable(_data) {
    //console.log("starting table population");
    var _colModel = generateView(_data);
    //console.log(_colModel);
    //console.log($("#qc-table"));
    $("#qc-table").jqGrid({
        data: _data,
        datatype: "local",
        colModel: _colModel,
        colNames: Object.keys(_data[0]),
        viewrecords: true, // show the current page, data rang and total records on the toolbar
        //width: 700,
        autowidth: true,
        autoheight: true,
        //iconSet: "fontAwesome",
        rownumbers: true,
        responsive: true,
        headertitles: true,
        guiStyle: "bootstrap",
        searching: {
            defaultSearch: "cn"
        },
        //height: 500,
        rowNum: 20,
        mtype: 'POST',
        editurl: './qcmanager',
        loadonce: true, // this is just for the demo
        ondblClickRow: editRow,
        pager: "#qc-pager"
    });
    var lastSelection;
    function editRow(id) {
        if (id && id !== lastSelection) {
            var grid = $("#qc-table");
            grid.jqGrid('restoreRow', lastSelection);
            var editParameters = {
                keys: true,
                extraparam: {action: "QC_CHANGELOTINFO", LCMS_session: $.cookie('LCMS_session')}
            };
            grid.jqGrid('editRow', id, editParameters);
            lastSelection = id;
        }
    }

    var addDataOptions = {editData: {action: "QC_CHANGELOTINFO", LCMS_session: $.cookie('LCMS_session')}};
    var navGridParameters = {add: true, edit: false, del: false, save: false, cancel: false, addParams: {position: "last", addRowParams: {
                keys: true,
                extraparam: {action: "QC_CHANGELOTINFO", LCMS_session: $.cookie('LCMS_session')}
            }}};

    $("#qc-table").inlineNav('#qc-pager', navGridParameters, {}, addDataOptions);
    $("#qc-table").jqGrid("filterToolbar");
    $(window).bind('resize', function () {
        $("#qc-table").setGridWidth($("#div-grid-wrapper").width()-10);
    }).trigger('resize');
    console.log("grid loaded");


}*/



