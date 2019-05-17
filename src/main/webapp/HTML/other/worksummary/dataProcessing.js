/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */




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
                colNames: ['ORDER', 'TEST', ''],
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
                guiStyle: "bootstrap4",

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

function createBadgesFromTests(cellvalue, options, rowObject) {
    console.log("creating badges()");
    var orderData = cellvalue;
    var badges = $("<div></div>");
    $.each(orderData, function (a, b) {
        console.log(b);
        var color = calcColorBasedOnTAT(b);
        var badge = "<span class='badge badge-light' style='color:white;margin:2px;background-color: rgb(" + color.r + "," + color.g + "," + color.b + ");'>" + b.Test + "</span>";
        badges.append(badge);
    });
    return badges.html();
}

function calcColorBasedOnTAT(orderData) {
    //rgb 255



    var tat = Object.filter(tats, tat => tat["TEST"] === orderData.Test);
    if (typeof Object.values(tat)[0] !== "undefined") {
        var tatVal = Object.values(tat)[0].TAT;
        var a = orderData.Minutes / tatVal;
        if (a > 1) {
            a = 1;
        }
        var b = a * 220;
        return {r: 35+ 0 + b, g: 255 - b, b: 35};
    } else {
        return {r: 150, g: 150, b: 150};
    }


    // 100 / 100 --> 1   200/100 --> 2  1 / 100 --> 0.01
}



function perOrder(parent, data, gridId, refresh) {
    console.log("perOrder()");
    var colModel = [
        {name: "Order", type: "text", key: true, width: 100},
        {name: "Aanvrager", type: "text", width: 150},
        {name: "Testen", width: 150, type: "text", formatter: createBadgesFromTests},
        {name: "Info", type: "text", width: 150},
        {name: "Open", type: "number", width: 50}
    ];
    var processedData = perOrderDataVerwerking(data);
    var gridData = processedData.gridData;
    var extraOptions = new Object();//extraJQGridOptions(data, processedData, null, "Orders");

//    if (typeof processedData.subgridData !== "undefined") {
//        extraOptions.subGrid = true;
//        extraOptions.subGridOptions = {
//            hasSubgrid: function (options) {
//                return true;
//            }
//        };
//        extraOptions.subGridRowExpanded = function (subgridDivId, rowId) {
//            var subgridTableId = subgridDivId + "_t";
//            $("[id='" + subgridDivId + "']").html("<table id='" + subgridTableId + "'></table>");
//            $("[id='" + subgridTableId + "']").jqGrid({
//                datatype: 'local',
//                data: processedData.subgridData[rowId],
//                colNames: ['Order', 'Test', 'Open'],
//                colModel: [
//                    {name: 'Order', width: 100, visible: false},
//                    {name: 'Test', width: 200},
//                    {name: 'Open', width: 100}
//                ],
//                gridview: true,
//                rownumbers: true,
//                autoencode: true,
//                responsive: true,
//                headertitles: true,
//                iconSet: "fontAwesome",
//                guiStyle: "bootstrap4"
//
//            });
//        };
//        extraOptions.caption = "test";
//        if (gridId === "pertoestel") {
//            extraOptions.grouping = true;
//            extraOptions.groupingView = {
//                groupField: ['Toestel'],
//                groupColumnShow: [false],
//                groupText: ['<b>{0} - {1} Item(s)</b>'],
//                groupCollapse: true
//            };
//            colModel.push({name: "Toestel", type: "text"});
//        } else {
//            extraOptions.grouping = true;
//            extraOptions.groupingView = {
//                groupField: ['Aanvrager'],
//                groupColumnShow: [true],
//                groupText: ['<b>{0} - {1} Item(s)</b>'],
//                groupCollapse: false
//            };
//        }
//
//
//
//    }



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
    console.log("perOrderDataVerwerking()");
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
        info["Toestel"] = filteredTestsPerOrder[Object.keys(filteredTestsPerOrder)[0]]["STATION"];

        var oldest = moment("01-01-2100");
        Object.keys(filteredTestsPerOrder).forEach(function (index) {
            var current = moment(filteredTestsPerOrder[index].DATE.trim(), "DDMMYYHHmmss");
            if (current._isValid) {
                if (current < oldest) {
                    oldest = current;
                }
                //console.log(oldest);
            }
        });
        if (oldest !== 99999999999999) {
            var openTime = moment.duration(moment() - oldest)._data;
            var days = openTime.days > 0 ? openTime.days + "d " : "";
            var hours = openTime.hours > 0 ? openTime.hours + "h " : "";
            var minutes = openTime.minutes > 0 ? openTime.minutes + "m" : "";
            info["Open"] = days + hours + minutes;
        } else {
            info["Open"] = -1;
        }

        var orderData = [];
        $.each(filteredTestsPerOrder, function (key3, value) {
            var openTime = moment.duration(moment() - moment(value.DATE.trim(), "DDMMYYHHmmss"))._data;
            if (typeof openTime !== "undefined") {
                var days = openTime.days > 0 ? openTime.days + "d " : "";
                var hours = openTime.hours > 0 ? openTime.hours + "h " : "";
                var minutes = openTime.minutes > 0 ? openTime.minutes + "m" : "";
                orderData.push({Order: value.ORDER, Test: value["TEST"], Open: days + hours + minutes, Minutes: (openTime.days * 24 * 60 + openTime.hours * 60 + openTime.minutes)});
            } else {
                orderData.push({Order: value.ORDER, Test: value["TEST"], Open: "", Minutes: -1});
            }


        });
        info["Testen"] = orderData;

//        var orderData = [];
//        $.each(filteredTestsPerOrder, function (key3, value) {
//            var openTime = moment.duration(moment()-moment(value.DATE.trim(), "DDMMYYHHmmss"))._data;
//            if (typeof openTime !== "undefined") {
//                var days = openTime.days > 0 ? openTime.days + "d " : "";
//                var hours = openTime.hours > 0 ? openTime.hours + "h " : "";
//                var minutes = openTime.minutes > 0 ? openTime.minutes + "m" : "";
//                orderData.push({Order: value.ORDER, Test: value["TEST"], Open: days + hours + minutes});
//            } else {
//                orderData.push({Order: value.ORDER, Test: value["TEST"], Open: ""});
//            }
//
//
//        });

        // subgridData[value] = orderData;


        gridData.push(info);
    });


    //  output.subgridData = subgridData;
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