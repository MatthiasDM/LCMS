/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var issuers = {};
var stations = {};


function perToestel(row, data, gridId, refresh) {
    console.log("perToestel()");
    var col = $("<div class='col-sm-6 mx-auto'></div>");
    var colModel = [
        {name: "Station", type: "text", key: true},
        {name: "Orders", type: "number"},
        {name: "Gekende testen", type: "number"},
        {name: "Openstaande testen", type: "number"},
        {name: "Werkpost", type: "text"},
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
            for (var j = 0; j < gridIds[0].gridexpandedgroups.length; j = j + 1) {
                $("#" + gridId).jqGrid('expandSubGridRow', gridIds[0].gridexpandedgroups[j]);
                $("#" + gridId).jqGrid("groupingToggle", gridIds[0].gridexpandedgroups[j], $("#" + gridIds[0].gridexpandedgroups[j]));
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

function perArts(row, data, gridId, refresh) {
    console.log("perArts()");
    var col = $("<div class='col-sm-6 mx-auto'></div>");
    var colModel = [
        {name: "Aanvrager", type: "text", key: true},
        {name: "Orders", type: "number"},
        {name: "Gekende testen", type: "number"},
        {name: "Openstaande testen", type: "number"},
        {name: "Groep", type: "text"},
    ]

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
            for (var j = 0; j < gridIds[1].gridexpandedgroups.length; j = j + 1) {
                $("#" + gridId).jqGrid('expandSubGridRow', gridIds[1].gridexpandedgroups[j]);
                $("#" + gridId).jqGrid("groupingToggle", gridIds[1].gridexpandedgroups[j], $("#" + gridIds[1].gridexpandedgroups[j]));
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

function perArtsDataVerwerking(data) {

    var output = new Object();
    var distinctIssuers = filterUniqueJson(data, "ISSUER");
    var gridData = [];
    var subgridData = [];
    $.each(distinctIssuers, function (key1, value) {
        var filteredData = Object.filter(data, item => (item["ISSUER"] === value & String(item["DATE"]).trim().length > 0));
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

function perKlinischeInfo(row, data, gridId, refresh) {
    var col = $("<div class='col-sm-12 mx-auto'></div>");
    var colModel = [
        {name: "Order", type: "text"},
        {name: "Aanvrager", type: "text"},
        {name: "Info", type: "text"}
    ]
    var processedData = perKlinischoInfoDataVerwerking(data);
    var gridData = processedData.gridData;
    if (refresh === false) {
        row.append(col);
        new_grid(colModel, {caption: "Orders met commentaar", cmTemplate: {autoResizable: true}, autoResizing: {compact: true, resetWidthOrg: true}, autowidth: true, autoresizeOnLoad: true}, gridData, gridId, col);
        $("#" + gridId).setGridWidth(col.width() - 5);
        $("#" + gridId).trigger('resize');
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

function perGroep(row, data, gridId, refresh, groep) {
    console.log("perGroep()");
    var col = $("<div class='col-sm-6 mx-auto'></div>");
    var colModel = [
        {name: "Aanvrager", type: "text", key: true},
        {name: "Orders", type: "number"},
        {name: "Gekende testen", type: "number"},
        {name: "Openstaande testen", type: "number"},
                //{name: "Groep", type: "text"},
    ]

    var processedData = perGroepVerwerking(data, groep);
    var gridData = processedData.gridData;
    var subgridData = processedData.subgridData;
    var extraOptions = extraJQGridOptions(data, processedData, undefined, groep);

    if (refresh === false) {
        row.append(col);
        new_grid(colModel, extraOptions, gridData, gridId, col);
        $("#" + gridId).jqGrid('setGridState', 'hidden');
        setChart("chart" + groep, processedData);

    } else {
        extraOptions.gridComplete = function () {
            for (var j = 0; j < gridIds[1].gridexpandedgroups.length; j = j + 1) {
                $("#" + gridId).jqGrid('expandSubGridRow', gridIds[1].gridexpandedgroups[j]);
                $("#" + gridId).jqGrid("groupingToggle", gridIds[1].gridexpandedgroups[j], $("#" + gridIds[1].gridexpandedgroups[j]));
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
                    })
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
        //hiddengrid: true,
        onSelectRow: function (rowid) {
            $(this).find("[id='" + rowid + "']").children("td.ui-sgcollapsed").click();
        }
    };



    if (typeof groupBy !== "undefined") {
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
    var progress = dom_progressbar([{value: bar1, color: 'rgba(43, 121, 83, 1)'}, {value: bar2, color: 'rgba(66,139,202, 1)'}], 'progress_' + gridId);
    $("#progress_" + gridId).replaceWith(progress);
}