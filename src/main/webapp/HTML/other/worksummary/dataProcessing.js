/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var issuers = {};
var stations = {};


function perToestel(row, data, gridId, refresh, gridIdIndex) {
    console.log("perToestel()");
    var col = $("<div class='col-sm-6 mx-auto'></div>");
    var colModel = [
        {name: "Station", type: "text", key: true},
        {name: "Orders", type: "number"},
        {name: "Gekende testen", type: "number"},
        {name: "Openstaande testen", type: "number"},
        {name: "Werkpost", type: "text"}
    ]
    var processedData = perToestelDataVerwerking(data);
    var gridData = processedData.gridData;
    var subgridData = processedData.subgridData;
    var extraOptions = extraJQGridOptions(data, processedData, ['Werkpost'], "Orders per toestel");
    if (refresh === false) {
        row.append(col);
        new_grid(colModel, extraOptions, gridData, gridId, col);
        $("#" + gridId).jqGrid('setGridState', 'hidden');

    } else {
        console.log("refreshing " + gridId);
        extraOptions.gridComplete = function () {
            for (var j = 0; j < gridIds[gridIdIndex].gridexpandedgroups.length; j = j + 1) {
                $("#" + gridId).jqGrid('expandSubGridRow', gridIds[gridIdIndex].gridexpandedgroups[j]);
                $("#" + gridId).jqGrid("groupingToggle", gridIds[gridIdIndex].gridexpandedgroups[j], $("#" + gridIds[gridIdIndex].gridexpandedgroups[j]));
            }
        };
        replaceProgressBar(gridId, gridData);
        $("#" + gridId).setCaption(extraOptions.caption);
        extraOptions.data = gridData;
        extraOptions.subgridData = subgridData;
        $("#" + gridId).clearGridData();
        $("#" + gridId)
                .jqGrid('setGridParam', extraOptions)
                .trigger("reloadGrid");
    }
}

function perToestelDataVerwerking(data) {

    var output = new Object();
    var distinctStations = filterUniqueJson(data, "STATION");
    var gridData = [];
    var subgridData = [];
    $.each(distinctStations, function (key1, value) {
        var filteredData = Object.filter(data, item => (item["STATION"] === value & String(item["DATE"]).trim().length > 0));
        var info = getInformation(filteredData);
        var station = Object.filter(stations, station => station["ID"] === value);
        if (Object.keys(station).length > 0) {
            info["Werkpost"] = stations[Object.keys(station)[0]].WERKPOST;
        } else {
            info["Werkpost"] = "Nog klasseren";
        }
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
        subgridData[value] = Object.values(orderData);
    });
    output.gridData = gridData;
    output.subgridData = subgridData;
    return output;
}

function perArts(row, data, gridId, refresh, gridIdIndex) {
    console.log("perArts()");
    var col = $("<div class='col-sm-6 mx-auto'></div>");
    var colModel = [
        {name: "Aanvrager", type: "text", key: true},
        {name: "Orders", type: "number"},
        {name: "Gekende testen", type: "number"},
        {name: "Openstaande testen", type: "number"},
        {name: "Groep", type: "text"}
    ];

    var processedData = perArtsDataVerwerking(data);
    var gridData = processedData.gridData;
    var subgridData = processedData.subgridData;
    var extraOptions = extraJQGridOptions(data, processedData, ['Groep'], "Orders per arts");

    if (refresh === false) {
        row.append(col);
        new_grid(colModel, extraOptions, gridData, gridId, col);
        $("#" + gridId).jqGrid('setGridState', 'hidden');
    } else {
        extraOptions.gridComplete = function () {
            for (var j = 0; j < gridIds[gridIdIndex].gridexpandedgroups.length; j = j + 1) {
                $("#" + gridId).jqGrid('expandSubGridRow', gridIds[gridIdIndex].gridexpandedgroups[j]);
                $("#" + gridId).jqGrid("groupingToggle", gridIds[gridIdIndex].gridexpandedgroups[j], $("#" + gridIds[gridIdIndex].gridexpandedgroups[j]));
            }
        };
        $("#" + gridId).jqGrid('setGridParam', extraOptions).trigger("reloadGrid");
        replaceProgressBar(gridId, gridData);
        $("#" + gridId).setCaption(extraOptions.caption);
        extraOptions.data = gridData;
        extraOptions.subgridData = subgridData;
        $("#" + gridId).clearGridData();
        $("#" + gridId)
                .jqGrid('setGridParam', extraOptions)
                .trigger("reloadGrid");


    }
}


function perKlinischeInfo(row, data, gridId, refresh, parent) {


    var colModel = [
        {name: "Order", type: "text"},
        {name: "Aanvrager", type: "text"},
        {name: "Info", type: "text"}
    ]
    var processedData = perKlinischoInfoDataVerwerking(data);
    var gridData = processedData.gridData;
    if (refresh === false) {

        new_grid(colModel, {caption: "Orders met commentaar", cmTemplate: {autoResizable: true}, autoResizing: {compact: true, resetWidthOrg: true}, autowidth: true, autoresizeOnLoad: true}, gridData, gridId, parent);
        //$("#" + gridId).setGridWidth(col.width() - 5);
        //$("#" + gridId).trigger('resize');
    } else {
        $("#" + gridId)
                .jqGrid('setGridParam', {data: gridData})
                .trigger("reloadGrid");
    }


}

function perKlinischoInfoDataVerwerking(data) {
    var output = new Object();
    var gridData = [];
    var filteredData = Object.filter(data, item => (String(item["INFO"]).length > 0 | String(item["URGENT"]).trim() === "TRUE" & (String(item["ORDER"]).startsWith("K") | String(item["ORDER"]).startsWith("B"))));
    var distinctFilteredData = filterUnique($.map(filteredData, function (el) {
        return el;
    }), "ORDER");
    Object.keys(distinctFilteredData).forEach(function (key) {
        var value = distinctFilteredData[key];
        var infoData = Object.filter(data, item => item["ORDER"] === value);
        var info = getInformation(infoData);
        info["Aanvrager"] = infoData[Object.keys(infoData)[0]].ISSUER;
        info["Order"] = infoData[Object.keys(infoData)[0]].ORDER;
        info["Info"] = infoData[Object.keys(infoData)[0]].INFO;
        gridData.push(info);
    });
    output.gridData = gridData;
    return output;
}

function perGroep(row, data, gridId, refresh, groep, gridIdIndex) {
    console.log("perGroep()");
    var col = $("<div class='col-sm-6 mx-auto'></div>");
    var colModel = [
        {name: "Aanvrager", type: "text", key: true},
        {name: "Orders", type: "number"},
        {name: "Gekende testen", type: "number"},
        {name: "Openstaande testen", type: "number"}
        //{name: "Groep", type: "text"},
    ];

    var processedData = perGroepVerwerking(data, groep);
    var gridData = processedData.gridData;
    var subgridData = processedData.subgridData;
    var extraOptions = extraJQGridOptions(data, processedData, undefined, groep);

    if (refresh === false) {
        row.append(col);
        new_grid(colModel, extraOptions, gridData, gridId, col);
        $("#" + gridId).jqGrid('setGridState', 'hidden');
        //setChart("chart" + groep, processedData);

    } else {
        extraOptions.gridComplete = function () {
            for (var j = 0; j < gridIds[gridIdIndex].gridexpandedgroups.length; j = j + 1) {
                $("#" + gridId).jqGrid('expandSubGridRow', gridIds[gridIdIndex].gridexpandedgroups[j]);
                $("#" + gridId).jqGrid("groupingToggle", gridIds[gridIdIndex].gridexpandedgroups[j], $("#" + gridIds[gridIdIndex1].gridexpandedgroups[j]));
            }
        };
        $("#" + gridId).jqGrid('setGridParam', extraOptions).trigger("reloadGrid");
        replaceProgressBar(gridId, gridData);
        extraOptions.data = gridData;
        extraOptions.subgridData = subgridData;
        $("#" + gridId).setCaption(extraOptions.caption);
        $("#" + gridId).clearGridData();
        $("#" + gridId)
                .jqGrid('setGridParam', extraOptions)
                .trigger("reloadGrid");
    }
}

function perGroepVerwerking(data, groep) {

    var output = new Object();
    var distinctIssuers = filterUniqueJson(data, "ISSUER");
    var gridData = [];
    var subgridData = [];
    $.each(distinctIssuers, function (key1, value) {
        var issuer = Object.filter(issuers, issuer => issuer["ID"] === value);
        if (Object.keys(issuer).length > 0) {
            var groupOfIssuer = issuers[Object.keys(issuer)[0]];
            var filteredData = Object.filter(data,
                    item => (
                                item["ISSUER"] === value &
                                String(item["DATE"]).trim().length > 0 &
                                groupOfIssuer.GROEP === groep
                                )
            );

            if (Object.keys(filteredData).length > 0) {
                var info = getInformation(filteredData);
                info["Aanvrager"] = value;
                info["Groep"] = groupOfIssuer.GROEP;
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
                    });
                    //4 Voeg tests toe aan distinctOrders
                    orderData.push({ORDER: value, TESTEN: tests});
                });
                subgridData[value] = Object.values(orderData);
            }
        }
    });
    output.gridData = gridData;
    output.subgridData = subgridData;
    return output;
}

function extraJQGridOptions(rawData, processedData, groupBy, caption) {
    var groupInfo = getGroupInformation(processedData.gridData);

    var extraOptions = {
        caption: caption + " (" + groupInfo.sumOrders + ")", //+ "<br style='position: relative;'>" + "<div><canvas width='100' height='50' id='chart"+caption+"'></canvas></div>",
        hiddengrid: true,
        onSelectRow: function (rowid) {
            $(this).find("[id='" + rowid + "']").children("td.ui-sgcollapsed").click();
        }
    };

    if (typeof groupBy !== "undefined" || groupBy !== null) {
        extraOptions.grouping = true;
        extraOptions.groupingView = {
            groupField: groupBy,
            groupColumnShow: [false],
            groupText: ['<b>{0} - {1} Item(s)</b>', '<b>{0} - {1} Item(s)</b>'],
            groupCollapse: true
        };
    }

    if (typeof processedData.subgridData !== "undefined") {
        extraOptions.subGrid = true;
        extraOptions.subGridOptions = {
            hasSubgrid: function (options) {
                return true;
            }
        };
        extraOptions.subGridRowExpanded = function (subgridDivId, rowId) {
            var subgridTableId = subgridDivId + "_t";
            $("[id='" + subgridDivId + "']").html("<table id='" + subgridTableId + "'></table>");
            $("[id='" + subgridTableId + "']").jqGrid({
                datatype: 'local',
                data: processedData.subgridData[rowId],
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
        }
    }

    return extraOptions;
}

function getGroupInformation(processedData) {

    var groupInfo = new Object();

    groupInfo.sumOrders = Object.keys(processedData).reduce(function (previous, key) {
        return previous + processedData[key].Orders;
    }, 0);
    groupInfo.sumKnownTests = Object.keys(processedData).reduce(function (previous, key) {
        return previous + processedData[key]["Gekende testen"];
    }, 0);
    groupInfo.sumUnknownTests = Object.keys(processedData).reduce(function (previous, key) {
        return previous + processedData[key]["Openstaande testen"];
    }, 0);

    return groupInfo;

}

function replaceProgressBar(gridId, gridData) {
    var barinfo = getGroupInformation(gridData);
    var bar1 = barinfo.sumKnownTests / (barinfo.sumKnownTests + barinfo.sumUnknownTests) * 100;
    var bar2 = barinfo.sumUnknownTests / (barinfo.sumKnownTests + barinfo.sumUnknownTests) * 100;
    if (bar1.toString() === "NaN") {
        bar1 = 100;
    }
    ;
    var progress = dom_progressbar([{value: bar1, color: 'rgba(43, 121, 83, 1)'}, {value: bar2, color: 'rgba(66,139,202, 1)'}], 'progress_' + gridId);
    $("#progress_" + gridId).replaceWith(progress);
}

//--------------------------------------------------------------------------------------------------------

function maakTabelPerArts(parent, data, gridId, refresh) {
    console.log("maakTabelPerArts()");


    var colModel = [
        {name: "Aanvrager", type: "text", key: true},
        {name: "Orders", type: "number"},
        {name: "Gekende testen", type: "number"},
        {name: "Openstaande testen", type: "number"},
        {name: "Groep", type: "text"}
    ];

    var processedData = perArtsDataVerwerking(data);
    var gridData = processedData.gridData;
    var subgridData = processedData.subgridData;
    var extraOptions = extraJQGridOptions(data, processedData, ['Groep'], "Orders per arts");

    if (refresh === false) {
        new_grid(colModel, {}, gridData, gridId, parent);

    } else {
//        extraOptions.gridComplete = function () {
//            for (var j = 0; j < gridIds[gridId].gridexpandedgroups.length; j = j + 1) {
//                $("#" + gridId).jqGrid('expandSubGridRow', gridIds[gridId].gridexpandedgroups[j]);
//                $("#" + gridId).jqGrid("groupingToggle", gridIds[gridId].gridexpandedgroups[j], $("#" + gridIds[gridId].gridexpandedgroups[j]));
//            }
//        };
//        $("#" + gridId).jqGrid('setGridParam', extraOptions).trigger("reloadGrid");
//        replaceProgressBar(gridId, gridData);
//        $("#" + gridId).setCaption(extraOptions.caption);
//        extraOptions.data = gridData;
//        extraOptions.subgridData = subgridData;
        $("#" + gridId).clearGridData();
        $("#" + gridId)
                .jqGrid('setGridParam', extraOptions)
                .trigger("reloadGrid");


    }
}

function perArtsDataVerwerking(data) {

    var output = new Object();
    var distinctIssuers = filterUniqueJson(data, "ISSUER");
    var gridData = [];
    var subgridData = [];
    $.each(distinctIssuers, function (key1, value) {
        var filteredData = Object.filter(data, item => (item["ISSUER"] === value));// & String(item["DATE"]).trim().length > 0));
        var info = getInformation(filteredData);
        info["Aanvrager"] = value;
        var issuer = Object.filter(issuers, issuer => issuer["ID"] === value);
        if (Object.keys(issuer).length > 0) {
            info["Groep"] = issuers[Object.keys(issuer)[0]].GROEP;
        } else {
            info["Groep"] = "Nog klasseren";
        }

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
        subgridData[value] = Object.values(orderData);
    });
    output.gridData = gridData;
    output.subgridData = subgridData;
    return output;
}





function perOrder(parent, data, gridId, refresh) {
    console.log("perOrder()");
    var colModel = [
        {name: "Order", type: "text", key: true},
        {name: "Aanvrager", type: "text"},
        {name: "Info", type: "text"},
        {name: "Open", type: "number"}
    ]
    var processedData = perOrderDataVerwerking(data);
    var gridData = processedData.gridData;
    var extraOptions = new Object();//extraJQGridOptions(data, processedData, null, "Orders");

    if (typeof processedData.subgridData !== "undefined") {
        extraOptions.subGrid = true;
        extraOptions.subGridOptions = {
            hasSubgrid: function (options) {
                return true;
            }
        };
        extraOptions.subGridRowExpanded = function (subgridDivId, rowId) {
            var subgridTableId = subgridDivId + "_t";
            $("[id='" + subgridDivId + "']").html("<table id='" + subgridTableId + "'></table>");
            $("[id='" + subgridTableId + "']").jqGrid({
                datatype: 'local',
                data: processedData.subgridData[rowId],
                colNames: ['Order', 'Testen'],
                colModel: [
                    {name: 'Order', width: 100},
                    {name: 'Testen', width: 200}
                ],
                gridview: true,
                rownumbers: true,
                autoencode: true,
                responsive: true,
                headertitles: true,
                iconSet: "fontAwesome",
                guiStyle: "bootstrap4"
            });
        };
        extraOptions.caption = "test";
//        extraOptions.onSelectRow = function (rowid) {
//            $(this).find("[id='" + rowid + "']").children("td.ui-sgcollapsed").click();
//        };
    }

    if (refresh === false) {

        new_grid(colModel, extraOptions, gridData, gridId, parent);
        //$("#" + gridId).setGridWidth(col.width() - 5);
        //$("#" + gridId).trigger('resize');
    } else {
        $("#" + gridId)
                .jqGrid('setGridParam', {data: gridData})
                .trigger("reloadGrid");
    }


}

function perOrderDataVerwerking(data) {
    var output = new Object();
    var gridData = [];
    var subgridData = [];

    var filteredData = data;//Object.filter(data, item => (String(item["INFO"]).length > 0 | String(item["URGENT"]).trim() === "TRUE" & (String(item["ORDER"]).startsWith("K") | String(item["ORDER"]).startsWith("B"))));
    var distinctFilteredData = filterUnique($.map(filteredData, function (el) {
        return el;
    }), "ORDER");
    Object.keys(distinctFilteredData).forEach(function (key) {
        //var orderData = new Array();
        var value = distinctFilteredData[key];
        var filteredTestsPerOrder = Object.filter(filteredData, item => item["ORDER"] === value);
        var info = getInformation(filteredTestsPerOrder);
        info["Order"] = value;
        info["Aanvrager"] = filteredTestsPerOrder[Object.keys(filteredTestsPerOrder)[0]]["ISSUER"];
        info["Info"] = filteredTestsPerOrder[Object.keys(filteredTestsPerOrder)[0]]["INFO"];


        var oldest = moment("01-01-2100");
        Object.keys(filteredTestsPerOrder).forEach(function (index) {
            var current = moment(filteredTestsPerOrder[index].DATE.trim(), "DDMMYYHHmmss");
            if (current._isValid) {
                if (current < oldest) {
                    oldest = current;
                }
                console.log(oldest);
            }
        });
        if (oldest !== 99999999999999) {
            var openTime = moment.duration(moment() - oldest)._data;
            var days = openTime.days > 0 ? openTime.days + "d "  : "";
            var hours = openTime.hours > 0 ? openTime.hours + "h "  : "";
            var minutes = openTime.minutes > 0 ? openTime.minutes + "m"  : "";
            info["Open"] = days + hours + minutes;
        } else {
            info["Open"] = -1;
        }


        //info["Open"] = moment.duration(moment() - moment(item["DATE"].trim(), "DDMMYYHHmmss"))
        var tests = "";
        $.each(filteredTestsPerOrder, function (key3, value) {
            tests += value["TEST"] + " ";
        });

        //orderData.push({ORDER: value, TESTEN: tests});

        subgridData[value] = [{Order: value, Testen: tests}];
        gridData.push(info);
    });


    output.subgridData = subgridData;
    output.gridData = gridData;
    return output;
}


function compare(a, b) {
    // Use toUpperCase() to ignore character casing
    const genreA = a["DATE"].toUpperCase();
    const genreB = b["DATE"].toUpperCase();

    let comparison = 0;
    if (genreA > genreB) {
        comparison = 1;
    } else if (genreA < genreB) {
        comparison = -1;
    }
    return comparison;
}