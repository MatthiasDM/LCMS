/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function worksummary_doLoad(type) {
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
        data = Object.filter(data, item => (
                    moment.duration(moment() - moment(item["DATE"].trim(), "DDMMYYHHmmss"))._data.days < 1 &
                    String(item["ORDER"]).startsWith("L") === false & String(item["ORDER"]).startsWith("M") === false &
                    String(item["STATION"]).includes("POCT") === false && String(item["STATION"]).includes("VZ") === false
                    ));

        preProcess(data, type);

        console.log(data);
    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });
}

function preProcess(data, type) {
    if (type === 'new') {
        parseData(data, 1);

    }
    if (type === 'refresh') {
        refreshData(data, 2);
    }

    setTimeout(function () {
        worksummary_doLoad("refresh");
    }, 100000);
    setTimeout(function () {
        bootstrap_alert.warning('Update in 5 sec.', 'info', 5000);
    }, 95000);
}