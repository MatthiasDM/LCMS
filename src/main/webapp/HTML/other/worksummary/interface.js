var gridIds = {};
var jumboColumn;
var issuers = {};
var stations = {};
var dataOnverwerkt;
var dataVerwerkt = new Object();
var chkVerzendingen = new Object();
var selTijd = new Object();
var selectedBtn;

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
    var row1 = dom_row("infoButtonsRow1");
    var row2 = dom_row("infoButtonsRow2");
    row2.css("padding-bottom", '5px');
    var row3 = dom_row("tapPage1");

    container.append(row1);
    container.append(row2);
    container.append(row3);
    var card = dom_card(container, "");
    card.find(".card-body").addClass("collapse");
    card.find(".card-body").attr('id', "infoButtons-body");
    card.find(".card-body").css('padding', "0");
    card.find(".card-body").css('width', "100%");
    jumboColumn.append(card);

}

function createJumboElements(type) {

    createQuickview(type, "dringend", "btn-urgent", "exclamation", "danger", "dringend", "div-quickview", "", $("#infoButtonsRow1"));
    createQuickview(type, "commentaar", "btn-comment", "comment", "warning", "commentaar", "div-quickview", "", $("#infoButtonsRow1"));
    createQuickview(type, "cyberlab", "btn-cyberlab", "barcode", "info", "cyberlab", "div-quickview", "", $("#infoButtonsRow1"));
    createQuickview(type, "doorbelwaarde", "btn-doorbelwaarde", "phone", "danger", "doorbelwaarde", "div-quickview", "", $("#infoButtonsRow1"));
    createQuickview(type, "brugge", "btn-brugge", "fa-stack-1x", "info", "brugge", "div-quickview", "<b>B</b>", $("#infoButtonsRow1"));
    createQuickview(type, "knokke", "btn-knokke", "fa-stack-1x", "info", "knokke", "div-quickview", "<b>K</b>", $("#infoButtonsRow1"));


    if (type === 'new') {
        createJumboNav(false, $("#tapPage1"));
        chkVerzendingen = createJumboCheck(false, "Incl. verzendingen", "verzendingen", "verzendingen", false, $("#infoButtonsRow2"));
        selTijd = createJumboSelect(false, "", "minTimeOpen", "minTimeOpen", [{id: 'alles', name: 'Alles'}, {id: 'onbekend', name: "Moet nog toekomen"}, {id: 1, name: "<1 uur"}, {id: 2, name: "<2 uur"}, {id: 4, name: "<4 uur"}, {id: 24, name: "[4-24] uur"}, {id: 48, name: "[1-2] dagen"}, {id: 96, name: "[2-4] dagen"}, {id: 192, name: "[4-8] dagen"}, {id: 'oud', name: ">8 dagen"}], 2, $("#infoButtonsRow2"));
    }

}

function createJumboButton(refresh, data, btnId, btnIcon, btnText, btnStyle, appendTo) {
    console.log("createJumboButton()");
    if (!refresh) {
        var btn = dom_button(btnId, btnIcon, btnText, btnStyle);

        appendTo.append(btn);
    } else {
        $("#" + btnId + " span").text("");
    }
    var info = getInformation(data);
    $("#" + btnId).css("margin-right", "5px");
    $("#" + btnId).css("margin-bottom", "5px");

    $("#" + btnId + " span").text($("#" + btnId + " span").text() + info["Orders"]);

}

function createJumboCheck(refresh, chkTitle, chkId, chkName, chkVal, appendTo) {
    console.log("createJumboCheck()");
    if (!refresh) {
        var chk = forms_checkbox(chkTitle, chkId, chkName, chkVal);
        appendTo.append(chk);
        chk.change(function () {
            loadPage(dataOnverwerkt, "refresh");
            if (typeof selectedBtn !== "undefined") {
                //dataVerwerkt[_data]
                var gridId = selectedBtn.attr('linked-grid');
                var gridData = perOrderDataVerwerking(dataVerwerkt[gridId]).gridData;
                $("#" + gridId)
                        .jqGrid("clearGridData")
                        .jqGrid('setGridParam', {data: gridData})
                        .trigger("reloadGrid");
            }

        });
        chk.css("display", "inline-flex");
    }

    $("#" + chkId).css("margin-right", "5px");
    $("#" + chkId).css("margin-bottom", "5px");

    return chk.find("input")[0];
}

function createJumboSelect(refresh, selTitle, selId, selName, selObj, selVal, appendTo) {

    var obj = new Array();
    if (!refresh) {
        var sel = forms_select_single(selTitle, selId, selName, selObj, selVal);
        appendTo.append(sel);

        sel.on('change', function () {
            loadPage(dataOnverwerkt, "refresh");
            if (typeof selectedBtn !== "undefined") {
                //dataVerwerkt[_data]
                var gridId = selectedBtn.attr('linked-grid');
                var gridData = perOrderDataVerwerking(dataVerwerkt[gridId]).gridData;
                $("#" + gridId)
                        .jqGrid("clearGridData")
                        .jqGrid('setGridParam', {data: gridData})
                        .trigger("reloadGrid");
            }
        });




        sel.css("display", "inline-flex");
    }
    return sel.find("select");

}

function createJumboNav(refresh, appendTo) {
    if (!refresh) {
        var nav = dom_nav({'Werkposten': 'Werkposten', 'Verblijvend': 'Verblijvend', 'Ambulant': 'Ambulant'});
        appendTo.append(nav);
    }
}

function parseData(data) {


    if (!chkVerzendingen.checked) {
        data = Object.filter(data, item => (
                    String(item["ORDER"]).startsWith("L") === false & String(item["ORDER"]).startsWith("M") === false &
                    String(item["STATION"]).startsWith("VZ") === false &
                    String(item["STATION"]).includes("POCT") === false
                    ));
    }

    if (typeof selTijd.val !== "undefined") {
        var openTijd = selTijd.val();
        var tijdInterval = true;
        if (openTijd === "oud") {
            data = Object.filter(data, item => (
                        moment.duration(moment() - moment(item["DATE"].trim(), "DDMMYYHHmmss"))._milliseconds / 3600000 > 192 && moment(item["DATE"].trim(), "DDMMYYHHmmss")._isValid === true));
        }
        if (openTijd === "alles") {
            data = Object.filter(data, item => (
                        moment(item["DATE"].trim(), "DDMMYYHHmmss")._isValid === false | moment(item["DATE"].trim(), "DDMMYYHHmmss")._isValid === true));
        }
        if (openTijd === "onbekend") {
            data = Object.filter(data, item => (
                        moment(item["DATE"].trim(), "DDMMYYHHmmss")._isValid === false));
        }
        if (openTijd === "1") {
            data = Object.filter(data, item => (
                        moment.duration(moment() - moment(item["DATE"].trim(), "DDMMYYHHmmss"))._milliseconds / 3600000 < 1 && moment(item["DATE"].trim(), "DDMMYYHHmmss")._isValid === true
                        ));
        }
        if (openTijd === "2") {
            data = Object.filter(data, item => (
                        moment.duration(moment() - moment(item["DATE"].trim(), "DDMMYYHHmmss"))._milliseconds / 3600000 < 2 && moment(item["DATE"].trim(), "DDMMYYHHmmss")._isValid === true
                        ));
        }
        if (openTijd === "4") {
            data = Object.filter(data, item => (
                        moment.duration(moment() - moment(item["DATE"].trim(), "DDMMYYHHmmss"))._milliseconds / 3600000 < 4 && moment(item["DATE"].trim(), "DDMMYYHHmmss")._isValid === true
                        ));
        }
        if (openTijd === "24") {
            data = Object.filter(data, item => (
                        moment.duration(moment() - moment(item["DATE"].trim(), "DDMMYYHHmmss"))._milliseconds / 3600000 >= 4 &&
                        moment.duration(moment() - moment(item["DATE"].trim(), "DDMMYYHHmmss"))._milliseconds / 3600000 < 24 &&
                        moment(item["DATE"].trim(), "DDMMYYHHmmss")._isValid === true
                        ));
        }
        if (openTijd === "48") {
            data = Object.filter(data, item => (
                        moment.duration(moment() - moment(item["DATE"].trim(), "DDMMYYHHmmss"))._milliseconds / 3600000 >= 24 &&
                        moment.duration(moment() - moment(item["DATE"].trim(), "DDMMYYHHmmss"))._milliseconds / 3600000 < 48 &&
                        moment(item["DATE"].trim(), "DDMMYYHHmmss")._isValid === true
                        ));
        }
        if (openTijd === "96") {
            data = Object.filter(data, item => (
                        moment.duration(moment() - moment(item["DATE"].trim(), "DDMMYYHHmmss"))._milliseconds / 3600000 >= 48 &&
                        moment.duration(moment() - moment(item["DATE"].trim(), "DDMMYYHHmmss"))._milliseconds / 3600000 < 96 &&
                        moment(item["DATE"].trim(), "DDMMYYHHmmss")._isValid === true));
        }
        if (openTijd === "192") {
            data = Object.filter(data, item => (
                        moment.duration(moment() - moment(item["DATE"].trim(), "DDMMYYHHmmss"))._milliseconds / 3600000 >= 96 &&
                        moment.duration(moment() - moment(item["DATE"].trim(), "DDMMYYHHmmss"))._milliseconds / 3600000 < 192 &&
                        moment(item["DATE"].trim(), "DDMMYYHHmmss")._isValid === true));
        }
    } else {
        data = Object.filter(data, item => (
                    moment.duration(moment() - moment(item["DATE"].trim(), "DDMMYYHHmmss"))._milliseconds / 3600000 < 2 && moment(item["DATE"].trim(), "DDMMYYHHmmss")._isValid === true
                    ));
    }



    dataVerwerkt.brugge = Object.filter(data, item => (
                Object.keys(Object.filter(issuers, issuer => (issuer["ID"] === String(item["ISSUER"]) && issuer["GROEP"] === "BRUGGE"))) > 0
                ));

    dataVerwerkt.knokke = Object.filter(data, item => (
                Object.keys(Object.filter(issuers, issuer => (issuer["ID"] === String(item["ISSUER"]) && issuer["GROEP"] === "KNOKKE"))) > 0
                ));


    dataVerwerkt.dringend = Object.filter(data, item => (
                String(item["STATION"]).includes("POCT") === false & String(item["URGENT"]) === "TRUE"
                ));

    dataVerwerkt.commentaar = Object.filter(data, item => (
                String(item["STATION"]).includes("POCT") === false & String(item["INFO"]).length > 0
                ));

    dataVerwerkt.cyberlab = Object.filter(data, item => (
                String(item["STATION"]).includes("POCT") === false & String(item["CYBERLAB"]) === "TRUE"
                ));

    dataVerwerkt.doorbelwaarde = Object.filter(data, item => (
                String(item["STATION"]).includes("POCT") === false & String(item["ERNST"]) === "50"
                ));

//    dataVerwerkt.spoed = Object.filter(data, item => (
//                String(item["STATION"]).includes("POCT") === false & String(item["ERNST"]) === "50"
//                ));
//
//    dataVerwerkt.ambulant = Object.filter(data, item => (
//                String(item["STATION"]).includes("POCT") === false & String(item["ERNST"]) === "50"
//                ));
//
//    dataVerwerkt.verblijvend = Object.filter(data, item => (
//                String(item["STATION"]).includes("POCT") === false & String(item["ERNST"]) === "50"
//                ));
}

function loadPage(data, type) {
    parseData(data);
    createJumboElements(type);

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
        //width: '100%',
        shrinkToFit: true,
        responsive: true,
        headertitles: true,
        iconSet: "fontAwesome",
        guiStyle: "bootstrap4",
        searching: listGridFilterToolbarOptions,
        rowNum: 1000,
        mtype: 'POST',
        loadComplete: function (data) {
            grid.trigger('resize');
        },
        //editurl: "_editUrl",
        loadonce: true,
        //onSelectRow: popupEdittRow,
        // ondblClickRow: inlineEditRow,
        // pager: "#" + pager.attr('id'),
        //caption: ""

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


    _grid.jqGrid('filterToolbar');
    //$(".ui-jqgrid-titlebar").hide();
    //_grid.setCaption(""); 
//    $("#gview_" + _grid.attr('id')).children("div.ui-jqgrid-hdiv").hide();
//    $("#gview_" + _grid.attr('id')).children("div.ui-jqgrid-titlebar").hide();
//    $("#gview_" + _grid.attr('id')).children("td").hide();
//    $("#gview_" + _grid.attr('id')).find("td").css("border", "0px");
//    $("#gbox_" + _grid.attr('id')).css("border", "0px");
    //.ui-jqgrid { border-width: 0px; }
    _grid.closest("div.ui-jqgrid-view").children("div.ui-jqgrid-titlebar").addClass("card-header card-primary text-white text-center");
    _grid.closest("div.ui-jqgrid-view").children("div.ui-jqgrid-titlebar").css("background-color", "white");

    var barinfo = getGroupInformation(_tableOptions.data);
    var bar1 = barinfo.sumKnownTests / (barinfo.sumKnownTests + barinfo.sumUnknownTests) * 100;
    var bar2 = barinfo.sumUnknownTests / (barinfo.sumKnownTests + barinfo.sumUnknownTests) * 100;
    if (bar1.toString() === "NaN") {
        bar1 = 100;
    }
    ;
    var progess = dom_progressbar([{value: bar1, color: 'rgba(43, 121, 83, 1)'}, {value: bar2, color: 'rgba(66,139,202, 1)'}], 'progress_' + _grid.attr('id'));
    _grid.closest("div.ui-jqgrid-view").children("div.ui-jqgrid-titlebar").append(progess);

    _grid.closest("div.ui-jqgrid-view").children("div.ui-jqgrid-titlebar").click(function () {

        $(".ui-jqgrid-titlebar-close", this).click();
    });

    _grid.click(function (e) {
        gridClickFunctions(e, $(this));
    });

    $(window).bind('resize', function () {
        _grid.setGridWidth(_parent.width() - 5);
    }).trigger('resize');

    _grid.trigger('resize');


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


var previousBtnId = "";
function createQuickview(_type, _data, btnId, btnIcon, btnColor, gridId, collapseTarget, btnTxt, appendTo) {
    if (_type === 'new') {
        createJumboButton(false, dataVerwerkt[_data], btnId, btnIcon, btnTxt, btnColor, appendTo);
        $("#" + btnId).attr('data-toggle', 'collapse');
        $("#" + btnId).attr('aria-controls', collapseTarget);
        $("#" + btnId).attr('data-target', '#' + collapseTarget);
        $("#" + btnId).attr('linked-grid', gridId);
        $("#" + btnId).on('click', function (e) {
            console.log("btn clicked");
            selectedBtn = $("#" + btnId);
            if (!$("#" + collapseTarget).hasClass('show')) {
                if ($("#" + gridId).length < 1) {
                    gridIds[gridId] = {gridId, gridexpandedgroups: []};
                    perOrder($('#' + collapseTarget), dataVerwerkt[_data], gridId, false);
                }
            } else {
                Object.keys(gridIds).forEach(function (id) {

                    $("#" + id).jqGrid("GridDestroy");
                    console.log("GridDestroy");
                })

                if (previousBtnId !== btnId) {
                    e.stopPropagation();
                    $('#' + collapseTarget).collapse('show');
                    gridIds[gridId] = {gridId, gridexpandedgroups: []};
                    perOrder($('#' + collapseTarget), dataVerwerkt[_data], gridId, false);

                }
            }
            previousBtnId = btnId;
        });

    }
    if (_type === 'refresh') {
        createJumboButton(true, dataVerwerkt[_data], btnId, btnIcon, btnTxt, btnColor, appendTo);
    }
}

