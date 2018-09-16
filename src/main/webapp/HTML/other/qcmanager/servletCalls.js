/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function qcmanager_doLoad(_parent) {
    var _cookie = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: "./qcmanager",
        data: {action: "QC_GETLOTINFO", LCMS_session: _cookie},
        beforeSend: function (xhr) {
            xhr.overrideMimeType("application/html");
        }
    }).done(function (data) {
        console.log("loading lots");
        var jsonData = JSON.parse(data);

        if (typeof jsonData.webPage !== 'undefined') {
            jsonData.parent = _parent;
            loadParameters(jsonData);
        } else {
            jsonData.table = JSON.parse(jsonData.table);
            var extraOptions = {};
            extraOptions.hiddengrid = true;
            populateTable(jsonData, "QC_CHANGELOTINFO", './qcmanager', $("#qc-table"), "#qc-pager", $("#div-grid-wrapper"), "Lotinformatie van de QC's", extraOptions);


        }



    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });
}

function qctestmanager_doLoad(_parent) {
    var _cookie = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: "./qcmanager",
        data: {action: "QC_GETTESTINFO", LCMS_session: _cookie},
        beforeSend: function (xhr) {
            xhr.overrideMimeType("application/html");
        }
    }).done(function (data) {
        console.log("loading tests");

        var jsonData = JSON.parse(data);

        if (typeof jsonData.webPage !== 'undefined') {
            jsonData.parent = _parent;
            loadParameters(jsonData);
        } else {
            jsonData.table = JSON.parse(jsonData.table);
            var extraOptions = {};
            extraOptions.hiddengrid = true;
            populateTable(jsonData, "QC_CHANGETESTINFO", './qcmanager', $("#qctest-table"), "#qctest-pager", $("#div-grid-test-wrapper"), "Testinformatie van de QC's", extraOptions);


        }



    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });
}