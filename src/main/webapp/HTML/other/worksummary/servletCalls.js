/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function worksummary_doLoad(type, soort) {
    console.log("worksummary load");
    var _cookie = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: "./lab",
        data: {action: "LAB_WORKSUMMARY", LCMS_session: _cookie},
        beforeSend: function (xhr) {
            xhr.overrideMimeType("application/html");
        }
    }).done(function (data) {
        var jsonData = JSON.parse(data);
        var data = parseJSONInput(JSON.parse(jsonData.data));
        issuers = parseJSONInput(JSON.parse(jsonData.issuers));
        stations = parseJSONInput(JSON.parse(jsonData.stations));

        var dataDagelijks = Object.filter(data, item => (
                    moment.duration(moment() - moment(item["DATE"].trim(), "DDMMYYHHmmss"))._data.days < 1 &
                    String(item["ORDER"]).startsWith("L") === false & String(item["ORDER"]).startsWith("M") === false &
                    String(item["STATION"]).includes("POCT") === false && String(item["STATION"]).includes("VZ") === false
                    ));

        var dataWekelijks = Object.filter(data, item => (
                    moment.duration(moment() - moment(item["DATE"].trim(), "DDMMYYHHmmss"))._data.days >= 1 &
                    moment.duration(moment() - moment(item["DATE"].trim(), "DDMMYYHHmmss"))._data.days < 7 &
                    String(item["ORDER"]).startsWith("L") === false & String(item["ORDER"]).startsWith("M") === false &
                    String(item["STATION"]).includes("POCT") === false && String(item["STATION"]).includes("VZ") === false
                    ));

        var dataVerzendingen = Object.filter(data, item => (
                    moment.duration(moment() - moment(item["DATE"].trim(), "DDMMYYHHmmss"))._data.days >= 1 &
                    moment.duration(moment() - moment(item["DATE"].trim(), "DDMMYYHHmmss"))._data.days < 7 &
                    String(item["STATION"]).includes("VZ") === true && String(item["STATION"]).includes("POCT") === false
                    ));


        var dataDagelijksBrugge = Object.filter(data, item => (
                    //moment.duration(moment() - moment(item["DATE"].trim(), "DDMMYYHHmmss"))._data.days < 1 &
                    //String(item["ORDER"]).startsWith("L") === false & String(item["ORDER"]).startsWith("M") === false &
                    //String(item["STATION"]).includes("POCT") === false && String(item["STATION"]).includes("VZ") === false
                    Object.keys(Object.filter(issuers, issuer => (issuer["ID"] === String(item["ISSUER"]) && issuer["GROEP"] === "BRUGGE"))) > 0
                    ));

        var dataDagelijksKnokke = Object.filter(data, item => (
                    //moment.duration(moment() - moment(item["DATE"].trim(), "DDMMYYHHmmss"))._data.days < 1 &
                    //String(item["ORDER"]).startsWith("L") === false & String(item["ORDER"]).startsWith("M") === false &
                    //String(item["STATION"]).includes("POCT") === false && String(item["STATION"]).includes("VZ") === false
                    Object.keys(Object.filter(issuers, issuer => (issuer["ID"] === String(item["ISSUER"]) && issuer["GROEP"] === "KNOKKE"))) > 0
                    ));


        var dataDringend = Object.filter(data, item => (
                    String(item["ORDER"]).startsWith("L") === false & String(item["ORDER"]).startsWith("M") === false &
                    String(item["STATION"]).includes("POCT") === false && String(item["STATION"]).includes("VZ") === false &
                    String(item["URGENT"]) === "TRUE"
                    ));

        var dataCommentaar = Object.filter(data, item => (
                    String(item["ORDER"]).startsWith("L") === false & String(item["ORDER"]).startsWith("M") === false &
                    String(item["STATION"]).includes("POCT") === false && String(item["STATION"]).includes("VZ") === false &
                    String(item["INFO"]).length > 0
                    ));

        var dataCyberlab = Object.filter(data, item => (
                    String(item["ORDER"]).startsWith("L") === false & String(item["ORDER"]).startsWith("M") === false &
                    String(item["STATION"]).includes("POCT") === false && String(item["STATION"]).includes("VZ") === false &
                    String(item["CYBERLAB"]) === "TRUE"
                    ));

        var dataDoorbelwaarde = Object.filter(data, item => (
                    String(item["ORDER"]).startsWith("L") === false & String(item["ORDER"]).startsWith("M") === false &
                    String(item["STATION"]).includes("POCT") === false && String(item["STATION"]).includes("VZ") === false &
                    String(item["ERNST"]) === "50"
                    ));

        createQuickview(type, dataDringend, "btn-urgent", "exclamation", "danger", "grid_quickview", "div-quickview", "");
        createQuickview(type, dataCommentaar, "btn-comment", "comment", "warning", "grid_quickview", "div-quickview","");
        createQuickview(type, dataCyberlab, "btn-cyberlab", "barcode", "info", "grid_quickview", "div-quickview","");
        createQuickview(type, dataDoorbelwaarde, "btn-doorbelwaarde", "phone", "danger", "grid_quickview", "div-quickview","");
        createQuickview(type, dataDagelijksBrugge, "btn-brugge", "fa-stack-1x", "info", "grid_quickview", "div-quickview","<b>B</b>");
        createQuickview(type, dataDagelijksKnokke, "btn-knokke", "fa-stack-1x", "info", "grid_quickview", "div-quickview", "<b>K</b>");



        setTimeout(function () {
            worksummary_doLoad("refresh", "dagelijks");
        }, 100000);
        setTimeout(function () {
            bootstrap_alert.warning('Update in 5 sec.', 'info', 5000);
        }, 95000);



//        if (typeof soort !== "undefined") {
//            if (soort === "dagelijks") {
//                preProcessDagelijks(dataDagelijks, type);
//            }
//            if (soort === "wekelijks") {
//                preProcessWekelijks(dataWekelijks, type);
//            }
//
//        } else {
//            preProcessDagelijks(dataDagelijks, type);
//            preProcessWekelijks(dataWekelijks, type);
//
//        }



        console.log(data);
    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });
}





function preProcessDagelijks(data, type) {
    if (type === 'new') {
        parseDataDagelijks(data, false);

    }
    if (type === 'refresh') {
        parseDataDagelijks(data, true);
    }

    setTimeout(function () {
        worksummary_doLoad("refresh", "dagelijks");
    }, 100000);
    setTimeout(function () {
        bootstrap_alert.warning('Update in 5 sec.', 'info', 5000);
    }, 95000);
}

function preProcessWekelijks(data, type) {
    if (type === 'new') {
        parseDataWekelijks(data, false);

    }
    if (type === 'refresh') {
        parseDataWekelijks(data, true);
    }

    setTimeout(function () {
        worksummary_doLoad("refresh", "wekelijks");
    }, 100000);
    setTimeout(function () {
        bootstrap_alert.warning('Update in 5 sec.', 'info', 5000);
    }, 95000);
}