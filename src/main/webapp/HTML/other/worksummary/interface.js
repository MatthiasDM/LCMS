var gridIds = [];
var jumboColumn;
Object.filter = (obj, predicate) =>
    Object.keys(obj)
            .filter(key => predicate(obj[key]))
            .reduce((res, key) => (res[key] = obj[key], res), {});

$(function () {
    replaceJumbo();
    createJumboCard();
    worksummary_doLoad('new');
});

function replaceJumbo() {
    var jumbotron = $("#jumbotron");
    var container = dom_div("container");
    jumbotron.append(container);
    var row = dom_row(uuidv4());
    container.append(row);
    var col1 = dom_col(uuidv4(), 6);
    row.append(col1);
    $("#text-jumbo-heading").appendTo(col1);
    $("#text-jumbo-info").appendTo(col1);
    jumboColumn = dom_col(uuidv4(), 6);
    row.append(jumboColumn);

}

function createJumboCard() {


   

    var container = dom_div("container", "infoButtons");
//    var row1 = dom_row(uuidv4());
//    container.append(row1);
//    var col1 = dom_col(uuidv4(), 12);
//    row1.append(col1);
//    container.append(row1);
    
     var card = dom_card(container, "");
     card.find(".card-body").addClass("collapse");
    
    jumboColumn.append(card);


}

function parseDataDagelijks(data, refresh) {

    if (!refresh) {
        console.log("parseData()");
        var gridId;
        var row1 = $("<div class='row'></div>");
        var row2 = $("<div class='row'></div>");
        var row3 = $("<div class='row'></div>");
        $("#worksummary-container-dagelijks").append(row1);
        $("#worksummary-container-dagelijks").append(row2);
        $("#worksummary-container-dagelijks").append(row3);

        for (var i = 0; i < 5; i++)
            gridIds.push({gridid: "grid_" + uuidv4(), gridexpandedgroups: []});


    }

    //ORDERS MET KLINISCHE INFO-----------------------------------------------------------
    //---------------------------------------------------------------------------
    perKlinischeInfo(row2, data, gridIds[2].gridid, refresh, $("#div-quickview"));

    //KNOKKE----------------------------------------------------------
    //---------------------------------------------------------------------------
    perGroep(row1, data, gridIds[3].gridid, refresh, "KNOKKE", 3);
    //BRUGGE----------------------------------------------------------
    //---------------------------------------------------------------------------
    perGroep(row1, data, gridIds[4].gridid, refresh, "BRUGGE", 4);


    //ORDERS PER TOESTEL-----------------------------------------------------------
    //---------------------------------------------------------------------------    
    perToestel(row3, data, gridIds[0].gridid, refresh, 0);
    //ORDERS PER ARTS----------------------------------------------------------
    //---------------------------------------------------------------------------
    perArts(row3, data, gridIds[1].gridid, refresh, 1);
    //---------------------------------------------------------------------------
    //---------------------------------------------------------------------------
}

function parseDataWekelijks(data, refresh) {

    if (!refresh) {
        console.log("parseData()");
        var gridId;
        var row1 = $("<div class='row'></div>");
        var row2 = $("<div class='row'></div>");
        var row3 = $("<div class='row'></div>");
        $("#worksummary-container-wekelijks").append(row1);
        $("#worksummary-container-wekelijks").append(row2);
        $("#worksummary-container-wekelijks").append(row3);
        for (var i = 0; i < 5; i++)
            gridIds.push({gridid: "grid_" + uuidv4(), gridexpandedgroups: []});

    }

    //KNOKKE----------------------------------------------------------
    //---------------------------------------------------------------------------
    perGroep(row1, data, gridIds[7].gridid, refresh, "KNOKKE", 7);
    //BRUGGE----------------------------------------------------------
    //---------------------------------------------------------------------------
    perGroep(row1, data, gridIds[8].gridid, refresh, "BRUGGE", 8);

    //ORDERS MET KLINISCHE INFO-----------------------------------------------------------
    //---------------------------------------------------------------------------
    //perKlinischeInfo(row2, data, gridIds[6].gridid, refresh);
    //ORDERS PER TOESTEL-----------------------------------------------------------
    //---------------------------------------------------------------------------    
    perToestel(row3, data, gridIds[4].gridid, refresh, 4);
    //ORDERS PER ARTS----------------------------------------------------------
    //---------------------------------------------------------------------------
    perArts(row3, data, gridIds[5].gridid, refresh, 5);
    //---------------------------------------------------------------------------
    //---------------------------------------------------------------------------
}



function createJumboButton(refresh, data, btnId, btnIcon, btnText, btnStyle) {
    console.log("createJumboButton()");
    if (!refresh) {
        var btn = dom_button(btnId, btnIcon, btnText, btnStyle);

        $("#infoButtons").append(btn);
    }
    var info = getInformation(data);
    $("#" + btnId).css("margin-right", "5px");
    $("#" + btnId + " span").text(info["Orders"]);

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
    //container.append(pager);
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
        rowNum: 1000,
        mtype: 'POST',
        //editurl: "_editUrl",
        loadonce: true,
        //onSelectRow: popupEdittRow,
        // ondblClickRow: inlineEditRow,
        // pager: "#" + pager.attr('id'),
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
    _grid.jqGrid(_tableOptions);
    var lastSelection;
    var addDataOptions = {editData: {action: "_editAction", LCMS_session: $.cookie('LCMS_session')}};
    var navGridParameters2 = {edit: false, add: false, save: false, cancel: false};

    //_grid.inlineNav(_tableOptions.pager, navGridParameters2, {}, addDataOptions);
    _grid.jqGrid('filterToolbar');
    //_grid.jqGrid('sortableRows', {});
    _grid.closest("div.ui-jqgrid-view").children("div.ui-jqgrid-titlebar").addClass("card-header card-primary text-white text-center");
    _grid.closest("div.ui-jqgrid-view").children("div.ui-jqgrid-titlebar").css("background-color", "white");
    //.ui-jqgrid.ui-jqgrid-bootstrap border: none
    var barinfo = getGroupInformation(_tableOptions.data);
    var bar1 = barinfo.sumKnownTests / (barinfo.sumKnownTests + barinfo.sumUnknownTests) * 100;
    var bar2 = barinfo.sumUnknownTests / (barinfo.sumKnownTests + barinfo.sumUnknownTests) * 100;
    if (bar1.toString() === "NaN") {
        bar1 = 100;
    }
    ;
    var progess = dom_progressbar([{value: bar1, color: 'rgba(43, 121, 83, 1)'}, {value: bar2, color: 'rgba(66,139,202, 1)'}], 'progress_' + _grid.attr('id'));

    //  rgba(170, 146, 57, 1)
    _grid.closest("div.ui-jqgrid-view").children("div.ui-jqgrid-titlebar").append(progess);

    _grid.closest("div.ui-jqgrid-view").children("div.ui-jqgrid-titlebar").click(function () {

        $(".ui-jqgrid-titlebar-close", this).click();
    });
    _grid.click(function (e) {
        gridClickFunctions(e, $(this));
    });

//    $(window).bind('resize', function () {
//        _grid.setGridWidth(_parent.width() - 5);
//    }).trigger('resize');




}

function gridClickFunctions(e, target) {
    console.log("gridClickFunctions()");
    var $groupHeader = $(e.target).closest("tr.jqgroup");
    if ($groupHeader.length > 0) {
        target.jqGrid("groupingToggle", $groupHeader.attr("id"), $groupHeader);
        target.css('cursor', 'pointer');
        var index = gridIds.map(function (e) {
            return e.gridid;
        }).indexOf(target.attr('id'));
        var indexofClickItem = gridIds[index].gridexpandedgroups.find(function (a) {
            return a === $groupHeader.attr("id")
        });

        if (typeof indexofClickItem !== "undefined") {
            gridIds[index].gridexpandedgroups.splice(indexofClickItem, 1);
        } else {
            gridIds[index].gridexpandedgroups.push($groupHeader.attr("id"));
        }


    }

    $groupHeader = $(e.target).closest("span.tree-wrap");
    if ($groupHeader.length > 0) {
        target.jqGrid("groupingToggle", $groupHeader.attr("id"), $groupHeader);
    }

    // $subGridExpanded = $(e.target).closest("td.sgexpanded");

}

function parseJSONInput(data) {
    data.forEach(function lines(line, index) {
        line = line.replace(/[']/g, "\"");
        line = JSON.parse(line);
        Object.keys(line).forEach(function (key) {
            line[key] = line[key].replace(/[^\w\s]/gi, '')
        })
        data[index] = line;
    });
    return data;
}