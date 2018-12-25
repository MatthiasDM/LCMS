var gridIds = [];

Object.filter = (obj, predicate) =>
    Object.keys(obj)
            .filter(key => predicate(obj[key]))
            .reduce((res, key) => (res[key] = obj[key], res), {});

$(function () {
    worksummary_doLoad('new');
});

function refreshData(data, maxAgeInDays) {

    data = Object.filter(data, item => (moment.duration(moment() - moment(item["DATE"].trim(), "DDMMYYHHmmss"))._data.days < maxAgeInDays));
    console.log(data);
    console.log("refreshData()");
    //-----------------KNOKKE----------------------------------------------------------
    //---------------------------------------------------------------------------
    perGroep(null, data, gridIds[3].gridid, true, "Knokke");
    //-----------------BRUGGE----------------------------------------------------------
    //---------------------------------------------------------------------------
    perGroep(null, data, gridIds[4].gridid, true, "Brugge");
    //----------------ORDERS MET KLINISCHE INFO-----------------------------------------------------------
    //---------------------------------------------------------------------------
    perKlinischeInfo(data, gridIds[2].gridid, true);
    //----------------ORDERS PER TOESTEL-----------------------------------------------------------
    //---------------------------------------------------------------------------    
    perToestel(null, data, gridIds[0].gridid, true);
    //-----------------ORDERS PER ARTS----------------------------------------------------------
    //---------------------------------------------------------------------------
    perArts(null, data, gridIds[1].gridid, true);

}

function parseData(data, maxAgeInDays) {
    console.log("parseData()");
    var gridId;
    var row1 = $("<div class='row'></div>");
    var row2 = $("<div class='row'></div>");
    var row3 = $("<div class='row'></div>");
    $("#worksummary-container").append(row1);
    $("#worksummary-container").append(row2);
    $("#worksummary-container").append(row3);

    gridIds = [
        {
            gridid: "grid_" + uuidv4(),
            gridexpandedgroups: []
        },
        {
            gridid: "grid_" + uuidv4(),
            gridexpandedgroups: []
        },
        {
            gridid: "grid_" + uuidv4(),
            gridexpandedgroups: []
        },
        {
            gridid: "grid_" + uuidv4(),
            gridexpandedgroups: []
        },
        {
            gridid: "grid_" + uuidv4(),
            gridexpandedgroups: []
        }
    ];
    data = Object.filter(data, item => (moment.duration(moment() - moment(item["DATE"].trim(), "DDMMYYHHmmss"))._data.days < maxAgeInDays));

    //PROGRESS BAR----------------------------------------------//
    //<div class="progress">
    //<div class="progress-bar" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">25%</div>
    //</div>
    //KNOKKE----------------------------------------------------------
    //---------------------------------------------------------------------------
    perGroep(row1, data, gridIds[3].gridid, false, "Knokke");
    //BRUGGE----------------------------------------------------------
    //---------------------------------------------------------------------------
    perGroep(row1, data, gridIds[4].gridid, false, "Brugge");

    //ORDERS MET KLINISCHE INFO-----------------------------------------------------------
    //---------------------------------------------------------------------------
    perKlinischeInfo(row2, data, gridIds[2].gridid, false);
    //ORDERS PER TOESTEL-----------------------------------------------------------
    //---------------------------------------------------------------------------    
    perToestel(row3, data, gridIds[0].gridid, false);
    //ORDERS PER ARTS----------------------------------------------------------
    //---------------------------------------------------------------------------
    perArts(row3, data, gridIds[1].gridid, false);
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

function filterUniqueJson(data, filterBy) {
    var lookup = {};
    var items = data;
    var result = [];

   
        Object.keys(data).forEach(function (val) {
            var key = data[val][filterBy];
            if (!(key in lookup)) {
                lookup[key] = 1;
                result.push(key);
            }
        })
  
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
    _grid.closest("div.ui-jqgrid-view").children("div.ui-jqgrid-titlebar").addClass("card-header card-primary text-white text-center");
    _grid.closest("div.ui-jqgrid-view").children("div.ui-jqgrid-titlebar").css("background-color", "white");
    //.ui-jqgrid.ui-jqgrid-bootstrap border: none
    var barinfo = getGroupInformation(_tableOptions.data);
    var bar1 = barinfo.sumKnownTests / (barinfo.sumKnownTests + barinfo.sumUnknownTests) * 100;
    var bar2 = barinfo.sumUnknownTests / (barinfo.sumKnownTests + barinfo.sumUnknownTests) * 100;
    var progess = dom_progressbar([{value: bar1, color: 'rgba(43, 121, 83, 1)'}, {value: bar2, color: 'rgba(66,139,202, 1)'}], 'progress_' + _grid.attr('id'));

    //  rgba(170, 146, 57, 1)
    _grid.closest("div.ui-jqgrid-view").children("div.ui-jqgrid-titlebar").append(progess);

    _grid.closest("div.ui-jqgrid-view").children("div.ui-jqgrid-titlebar").click(function () {

        $(".ui-jqgrid-titlebar-close", this).click();
    });
    _grid.click(function (e) {
        gridClickFunctions(e, $(this))
    });

    $(window).bind('resize', function () {
        _grid.setGridWidth(_parent.width() - 5);
    }).trigger('resize');




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