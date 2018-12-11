Object.filter = (obj, predicate) =>
    Object.keys(obj)
            .filter(key => predicate(obj[key]))
            .reduce((res, key) => (res[key] = obj[key], res), {});

$(function () {
    worksummary_doLoad($("#worksummary-container"));
    // config1();

});

function parseData(data) {
    console.log("parseData()");

    var distinctStations = filterUnique(data, "STATION");
    var distinctIssuers = filterUnique(data, "ISSUER");
    var row = $("<div class='row'></div>");
    $("#worksummary-container").append(row);

    //----------------ORDERS PER TOESTEL-----------------------------------------------------------
    //---------------------------------------------------------------------------
    var col = $("<div class='col-sm-6 mx-auto'></div>");
    var colModel = [
        {name: "Station", type: "text"},
        {name: "Orders", type:"number"},
        {name: "Gekende testen", type: "text"},
        {name: "Openstaande testen", type: "text"},
    ]
    var gridData = [];
    var subgridData = [];
    $.each(distinctStations, function (key1, value) {
        var filteredData = Object.filter(data, item => item["STATION"] === value);
        var info = getInformation(filteredData);
        info["Station"] = value;
        gridData.push(info);

        //Testen filteren van eenzelfde order        
        //1 Filter distinct orders
        var distinctOrders = filterUnique($.map(filteredData, function (el) {
            return el;
        }), "ORDER");
        var orderData = new Array();
        //2 Filter "filteredData" per distinctOrder
        $.each(distinctOrders, function (key2, value) {
            var filteredTestsPerOrder = Object.filter(filteredData, item => item["ORDER"] === value);
            //3 Zet alle testen in een String
            var tests = "";
            $.each(filteredTestsPerOrder, function (key3, value) {
                tests += value["TEST"] + " ";
            })
            //4 Voeg tests toe aan distinctOrders
            orderData.push({ORDER: value, TESTEN: tests});
        });
        subgridData["jqg" + (key1 + 1)] = Object.values(orderData);
    });

    var extraOptions = {
        caption: "Orders per Toestel",
        hiddengrid: true,
        subGridRowExpanded: function (subgridDivId, rowId) {
            var subgridTableId = subgridDivId + "_t";
            $("#" + subgridDivId).html("<table id='" + subgridTableId + "'></table>");
            $("#" + subgridTableId).jqGrid({
                datatype: 'local',
                data: subgridData[rowId],
                colNames: ['ORDER', 'TESTEN'],
                colModel: [
                    {name: 'ORDER', width: 100},
                    {name: 'TESTEN', width: 200}
                ],
                gridview: true,
                rownumbers: true,
                autoencode: true,
                responsive: true,
                headertitles: true,
                iconSet: "fontAwesome",
                guiStyle: "bootstrap4"
            });
        },
        subGrid: true,
        subGridOptions: {
            hasSubgrid: function (options) {
                return true;
            }
        },
        onSelectRow: function(rowid) {
            $(this).find("#" + rowid).children("td.ui-sgcollapsed").click();
        }

    };
    row.append(col);
    new_grid(colModel, extraOptions, gridData, "grid_" + uuidv4(), col);
    
    //-----------------ORDERS PER ARTS----------------------------------------------------------
    //---------------------------------------------------------------------------
    var col = $("<div class='col-sm-6 mx-auto'></div>");
    colModel = [
        {name: "Aanvrager", type: "text"},
        {name: "Orders", type: "text"},
        {name: "Gekende testen", type: "text"},
        {name: "Openstaande testen", type: "text"},
    ]
    gridData = [];
    $.each(distinctIssuers, function (key, value) {
        var filteredData = Object.filter(data, item => item["ISSUER"] === value);
        var info = getInformation(filteredData);
        info["Aanvrager"] = value;
        gridData.push(info);
    });    
    row.append(col);
    new_grid(colModel, {caption: "Orders per arts", hiddengrid: true}, gridData, "grid_" + uuidv4(), col);
    //----------------ORDERS MET KLINISCHE INFO-----------------------------------------------------------
    //---------------------------------------------------------------------------
    var gridid = "grid_" + uuidv4();
    var row = $("<div class='row'></div>");
    $("#worksummary-container").append(row);
    var col = $("<div class='col-sm-12 mx-auto'></div>");
    colModel = [
        {name: "Order", type: "text"},
        {name: "Aanvrager", type: "text"},
        {name: "Gekende testen", type: "text"},
        {name: "Openstaande testen", type: "text"},
        {name: "Info", type: "text"}
    ]
    gridData = [];
    var filteredData = Object.filter(data, item => item["INFO"].length > 0);
    $.each(filteredData, function (key, value) {
        var info = getInformation(value);
        info["Aanvrager"] = value.ISSUER;
        info["Order"] = value.ORDER;
        info["Info"] = value.INFO;
        gridData.push(info);
    });
    row.append(col);
    
    new_grid(colModel, {caption: "Orders met commentaar", cmTemplate: { autoResizable: true },autoResizing: { compact: true, resetWidthOrg: true },autowidth: true,autoresizeOnLoad: true}, gridData, gridid, col);
    $("#" + gridid).setGridWidth(col.width() - 5);
    $("#" + gridid).trigger('resize');
    //---------------------------------------------------------------------------
    //---------------------------------------------------------------------------

}




function filterUnique(data, filterBy) {
    var lookup = {};
    var items = data;
    var result = [];

    for (var item, i = 0; item = items[i++]; ) {

        //$.each((item), function (key, value) {
        var key = item[filterBy];
        if (!(key in lookup)) {
            lookup[key] = 1;
            result.push(key);
        }

    }
    return result;
}

function getInformation(data, idField) {
    var info = new Object();
    var testsknown = Object.filter(data, item => item["RESULTAAT"] !== "");
    var testsunknown = Object.filter(data, item => item["RESULTAAT"] === "");
    var distinctOrders = filterUnique($.map(data, function (el) {
        return el;
    }), "ORDER");
    //info["Orders_detail"] = distinctOrders;
    info["Orders"] = Object.keys(distinctOrders).length;
    info["Gekende testen"] = Object.keys(testsknown).length;
    info["Openstaande testen"] = Object.keys(testsunknown).length;

    return info;
}

function new_grid(colModel, extraOptions, gridData, gridId, parent) {
    console.log("new_grid()");
    var editor = parent;
    var data = [];
    var colData = {};
    colData.header = JSON.stringify(colModel);
    colModel = generateView2(colData);
    var colNames = [];
    for (var key in colModel) {
        if (typeof colModel[key].name !== 'undefined') {
            colNames[key] = colModel[key].name;
        }
    }
    var uuid = gridId;
    var container = $("<div id='container_" + uuid + "'></div>");
    var grid = $("<table id='" + uuid + "'></table>");
    var pager = $("<div id='pager_" + uuid + "'></div>");
    container.append(grid);
    container.append(pager);
    parent.append(container);
    gridData = Object.assign(gridData, data);
    var tableOptions = {
        id: grid.attr('id'),
        data: gridData,
        datatype: "local",
        colModel: colModel,
        colNames: colNames,
        viewrecords: true, // show the current page, data rang and total records on the toolbar        
        autoheight: true,
        autowidth: true,
        responsive: true,
        headertitles: true,
        iconSet: "fontAwesome",
        guiStyle: "bootstrap4",
        searching: listGridFilterToolbarOptions,
        rowNum: 20,
        mtype: 'POST',
        //editurl: "_editUrl",
        loadonce: true,
        //onSelectRow: popupEdittRow,
        // ondblClickRow: inlineEditRow,
        pager: "#" + pager.attr('id'),
        caption: ""
        
    };
    generate_grid(editor, grid, tableOptions, extraOptions);
    return container;
}

function generate_grid(_parent, _grid, _tableOptions, _extraOptions) {
    console.log("generate_grid");
    $.each(_extraOptions, function (i, val) {
        _tableOptions[i] = val;
    });
    //_tableOptions.caption += ("<span class='nosave'><button type='button' id='btn_options' style='padding-right: 20px;' class='close' aria-label='Close'><span aria-hidden='true'>info</span></button></span>");
    // _tableOptions.onSelectRow = popupEdittRow;
    //tableOptions.ondblClickRow = popupEdittRow;
    _grid.jqGrid(_tableOptions);
    var lastSelection;
    var addDataOptions = {editData: {action: "_editAction", LCMS_session: $.cookie('LCMS_session')}};
    var navGridParameters2 = {edit: false, add: false, save: false, cancel: false};

    _grid.inlineNav(_tableOptions.pager, navGridParameters2, {}, addDataOptions);
    _grid.jqGrid('filterToolbar');
    _grid.closest("div.ui-jqgrid-view").children("div.ui-jqgrid-titlebar").addClass("card-header card-primary bg-primary text-white");
    _grid.closest("div.ui-jqgrid-view").children("div.ui-jqgrid-titlebar").click(function () {
        $(".ui-jqgrid-titlebar-close", this).click();
    });
//    _grid.navButtonAdd(_tableOptions.pager, {
//        caption: "Options",
//        title: "Click here to change columns",
//        buttonicon: "ui-icon-plusthick",
//        onClickButton: function () {
//            new_grid_popup(_parent, _tableOptions);
//        },
//        position: "last"
//    });

    //_grid.inlineNav(_tableOptions.pager, navGridParameters, {}, addDataOptions);

    $(window).bind('resize', function () {
        _grid.setGridWidth(_parent.width() - 5);
    }).trigger('resize');




}