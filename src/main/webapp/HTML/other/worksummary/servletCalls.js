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

        setDringend(type, dataDringend);
        setCommentaar(type, dataCommentaar);
        
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

function setDringend(type, data) {
    if (type === 'new') {
        createJumboButton(false, data, "btn-urgent", "exclamation", "", "danger");

    }
    if (type === 'refresh') {
        createJumboButton(true, data, "btn-urgent", "exclamation", "", "danger");
    }

}

function setCommentaar(type, data) {
    if (type === 'new') {
        createJumboButton(false, data, "btn-comment", "comment", "", "warning");

    }
    if (type === 'refresh') {
        createJumboButton(true, data, "btn-comment", "comment", "", "warning");
    }

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