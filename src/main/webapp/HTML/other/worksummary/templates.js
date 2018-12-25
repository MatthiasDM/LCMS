/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var stations = {
    VZ_STJAN: {naam: 'St. Jan', werkpost: 'Verzendingen'},
    VZ_UZGENT: {naam: 'Eeklo', werkpost: 'Verzendingen'},
    VZ_HHART_EEKLO: {naam: 'UZ Gent', werkpost: 'Verzendingen'},
    VZ_MARIEN: {naam: 'Mariën', werkpost: 'Verzendingen'},
    VZ_AML: {naam: 'UZ Antwerpen', werkpost: 'Verzendingen'},
    VZ_STLUCAS_BRUGGE: {naam: 'St. Lucas', werkpost: 'Verzendingen'},
    VZ_KUL: {naam: 'KU Leuven', werkpost: 'Verzendingen'},
    KN_OSMO: {naam: 'Osmolaliteit', werkpost: 'Scheikunde'},
    BL_VITROS5600: {naam: 'Vitros', werkpost: 'Blankenberge'},
    BL_STARRSED: {naam: 'Sedimentatie', werkpost: 'Blankenberge'},
    "BL_SYSMEX_XN-L550": {naam: 'Hemato', werkpost: 'Blankenberge'},
    KN_ATELLICA1500: {naam: 'Urines', werkpost: 'Bacterio'},
    KN_ATELLICA_IM1300: {naam: 'Attelica', werkpost: 'Scheikunde'},
    VZ_VUB: {naam: 'UZ Brussel', werkpost: 'Verzendingen'},
    IM: {naam: 'Vitrossen', werkpost: 'Scheikunde'},
    BL_SYSMEX_XN1000: {naam: 'XN2000', werkpost: 'Hemato'},
    PHOENIX: {naam: 'Phoenix', werkpost: 'Bacterio'},
    KN_IH_500: {naam: 'IH-500', werkpost: 'Manuele'},
    KN_CS2000: {naam: 'Stolling', werkpost: 'Manuele'},
    KN_PH: {naam: 'Epoc', werkpost: 'POCT'},
    KN_BACT: {naam: 'Sneltesten', werkpost: 'Bacterio'},
    KN_MANVARIA: {naam: 'Varia', werkpost: 'Manuele'},
    KN_POCTGLUCOSE: {naam: 'Glucose', werkpost: 'POCT'},
    BL_POCTGLUCOSE: {naam: 'Glucose', werkpost: 'POCT'},
    KN_STARRSED: {naam: 'Sedimentatie', werkpost: 'Hemato'},
    KN_HEMMAN: {naam: 'Fast', werkpost: 'Hemato'},
    KN_LIAISON_XL: {naam: 'Liaison', werkpost: 'Scheikunde'},
    KN_PARAGON: {naam: 'Electroforese', werkpost: 'Scheikunde'},
    KN_SYSMEX_XN1000: {naam: 'XN2000', werkpost: 'Hemato'},
    KN_SERO: {naam: 'XN2000', werkpost: 'Manuele'},
    BL_CS2000: {naam: 'CS2100i', werkpost: 'Blankenberge'},
    BL_MANVARIA: {naam: 'CS2100i', werkpost: 'Blankenberge'}



};
var artsen = {
    'VERMANDER EVERT': {naam: 'Vermander Evert', groep: 'Intern ambulant'},
    'GEERTS YVETTE': {naam: 'Vermander Evert', groep: 'Intern verblijvend'},
    'CALLENS JORIS': {naam: 'Vermander Evert', groep: 'Intern ambulant'},
    'MAREELS SIGRID': {naam: 'Vermander Evert', groep: 'Intern verblijvend'},
    'DE LOOSE JEFF': {naam: 'Vermander Evert', groep: 'Intern ambulant'},
    'DILLEMANS BRUNO': {naam: 'Vermander Evert', groep: 'Intern ambulant'},
    'VAN RANSBEECK HILDE': {naam: 'Vermander Evert', groep: 'Intern ambulant'},
    'MOUTON CHARLOTTE': {naam: 'Vermander Evert', groep: 'Intern verblijvend'},
    'VAN HAUWAERT GEORGES': {naam: 'Vermander Evert', groep: 'Intern verblijvend'},
    'POCT AANVRAAG': {naam: 'Vermander Evert', groep: 'POCT'},
    'TERRYN STEFANIE': {naam: 'Vermander Evert', groep: 'Intern ambulant'},
    'VANDEWALLE SARA': {naam: 'Vermander Evert', groep: 'Intern ambulant'},
    'GRIJALBA BERNARDO': {naam: 'Vermander Evert', groep: 'Intern verblijvend'},
    'LEBBINK JOHN': {naam: 'Vermander Evert', groep: 'Urgentie'},
    'VAN HOECKE EMANUEL': {naam: 'Vermander Evert', groep: 'Urgentie'},
    'BOUWENS GUY': {naam: 'Vermander Evert', groep: 'Intern ambulant'},
    'VANDER EECKEN SAM': {naam: 'Vermander Evert', groep: 'Intern ambulant'},
    'VANDERDONCKT JACQUES': {naam: 'Vermander Evert', groep: 'Intern ambulant'},
    'HOSTE JO - ANNE': {naam: 'Vermander Evert', groep: 'Intern ambulant'},
    'VANDERSTIGGEL GENEVIEVE': {naam: 'Vermander Evert', groep: 'Intern ambulant'},
    'VANQUATHEM KRISTOF': {naam: 'Vermander Evert', groep: 'Intern ambulant'},
    'DE BRAUWER BARBARA': {naam: 'Vermander Evert', groep: 'Intern ambulant'},
    'JANSSENS HERLINDE': {naam: 'Vermander Evert', groep: 'Knokke'},
    'TROUVE CHARLOTTE': {naam: 'Vermander Evert', groep: 'Testen'},
    'MAENE SABINE': {naam: 'Vermander Evert', groep: 'Knokke'},
    'VAN DE VIJVER A.': {naam: 'Vermander Evert', groep: 'POCT'},
    'MESTDACH FRANK': {naam: 'Vermander Evert', groep: 'Intern ambulant'},
    'VERSTRAETE STEFAN': {naam: 'Vermander Evert', groep: 'Intern ambulant'},
    'MAERE M.': {naam: 'Vermander Evert', groep: 'Intern verblijvend'},
    'VAN DYCKE KOEN': {naam: 'Vermander Evert', groep: 'Urgentie'},
    'VANMAELE LUC': {naam: 'Vermander Evert', groep: 'Urgentie'},
    'VERLEYE FRANK': {naam: 'Vermander Evert', groep: 'Knokke'},
    'VERMANDER FRANK': {naam: 'Vermander Evert', groep: 'Intern ambulant'},
    'ROOIJAKKERS MARIEKE': {naam: 'Vermander Evert', groep: 'Intern ambulant'},
    'RAPPE KOEN': {naam: 'Vermander Evert', groep: 'Knokke'},
    'DUJARDIN GUSTAAF': {naam: 'Vermander Evert', groep: 'Knokke'},
    'POLLET GERY': {naam: 'Vermander Evert', groep: 'Knokke'},
    'D"HOLLANDER STEPHANIE': {naam: 'Vermander Evert', groep: 'Intern ambulant'},
    'DELATERE MARC': {naam: 'Vermander Evert', groep: 'Intern ambulant'},
    'CLAEYS JONAS': {naam: 'Vermander Evert', groep: 'Intern verblijvend'},
    'PIETERS ROLAND': {naam: 'Pieters Evert', groep: 'Intern verblijvend'},
    'PORIAU STEFAAN': {naam: 'Vermander Evert', groep: 'Intern verblijvend'},
    'VAN OOTEGHEM RIK': {naam: 'Vermander Evert', groep: 'Knokke'},
    'VANDEWIELE BERT': {naam: 'Vermander Evert', groep: 'Intern ambulant'},
    'VAN ZANDIJCKE MICHEL': {naam: 'Vermander Evert', groep: 'Intern verblijvend'},
    'BUYSE SOFIE': {naam: 'Vermander Evert', groep: 'Knokke'},
    'DE VLIEGHERE FILIP': {naam: 'Vermander Evert', groep: 'Intern verblijvend'},
    'VANDERBRUGGEN KAREN': {naam: 'Vermander Evert', groep: 'Intern ambulant'},
    'CARDOEN FREDERIK': {naam: 'Vermander Evert', groep: 'Extern ambulant'},
    'VANDERKEELEN LINDA': {naam: 'Vermander Evert', groep: 'Intern ambulant'},
    'MASEMAN MADIEKE': {naam: 'Vermander Evert', groep: 'Brugge'},
    'COOLSAET B.L.R.A.E': {naam: 'Vermander Evert', groep: 'Extern ambulant'},
    'VANDE WOESTYNE PETER': {naam: 'Vermander Evert', groep: 'Knokke'},
    'DELDYCKE JAN': {naam: 'Vermander Evert', groep: 'Urgentie'},
    'DE CRAEMER DIRK': {naam: 'Vermander Evert', groep: 'Kortrijk'},
    'DEVREESE MARIE': {naam: 'Vermander Evert', groep: 'Brugge'},
    'KERKHOF FLOR': {naam: 'Vermander Evert', groep: 'Intern verblijvend'},
    'POLLET DAVID': {naam: 'Vermander Evert', groep: 'Brugge'},
    'COSTERS NADINE': {naam: 'Vermander Evert', groep: 'Knokke'},
    'WIRAWAN EVELYNE': {naam: 'Vermander Evert', groep: 'Knokke'},
    'KUYPERS SABINE': {naam: 'Vermander Evert', groep: 'Intern ambulant'},
    'MESTDAGH FANNY': {naam: 'Vermander Evert', groep: 'Intern ambulant'},
    'VANCAILLIE JULIE': {naam: 'Vermander Evert', groep: 'Knokke'},
    'BOGAERT STEVEN': {naam: 'Vermander Evert', groep: 'Knokke'},
    'DEGROOTE FILIP': {naam: 'Vermander Evert', groep: 'Brugge'},
    'MAELEGHEER MARIO': {naam: 'Vermander Evert', groep: 'Knokke'},
    'SABBE LINDA': {naam: 'Vermander Evert', groep: 'Knokke'},
    'EERENS JAN': {naam: 'Vermander Evert', groep: 'Intern'},
    'BRABANT WIM': {naam: 'Vermander Evert', groep: 'Intern'},
    //----------------------------
    'GENNART FREDERIC': {naam: 'Vermander Evert', groep: 'Intern'},
    'DEVOS BART': {naam: 'Vermander Evert', groep: 'Intern'},
    'DE MAESENEER DAAN': {naam: 'Vermander Evert', groep: 'Intern'},
    'VANDEPITTE PATRICIA': {naam: 'Vermander Evert', groep: 'Knokke'},
    'KERCKHAERT WIM': {naam: 'Vermander Evert', groep: 'Intern'},
    'VANDEPUTTE TOM': {naam: 'Vermander Evert', groep: 'Knokke'},
    'VANDERLINDEN LIESBETH': {naam: 'Vermander Evert', groep: 'Intern'},
    'ROBBRECHT JOHAN': {naam: 'Vermander Evert', groep: 'Assebroek'},
    'VANDENABEELE C': {naam: 'Vermander Evert', groep: 'Eeklo'},

};

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
        info["Station"] = value;
        if (typeof stations[value] != 'undefined') {
            info["Werkpost"] = stations[value].werkpost;
        } else {
            info["Werkpost"] = "Nog klasseren";
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
        if (typeof artsen[value] != 'undefined') {
            info["Groep"] = artsen[value].groep;
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
        var groupOfIssuer = artsen[value];
        if (typeof groupOfIssuer !== 'undefined') {

            var filteredData = Object.filter(data,
                    item => (
                                item["ISSUER"] === value &
                                String(item["DATE"]).trim().length > 0 &
                                groupOfIssuer.groep === groep
                                )
            );

            if (Object.keys(filteredData).length > 0) {
                var info = getInformation(filteredData);
                info["Aanvrager"] = value;
                info["Groep"] = groupOfIssuer.groep;
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