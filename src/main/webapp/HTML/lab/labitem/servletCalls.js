/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function labitem_doLoad(_parent) {
    console.log("labitem load");
    var _cookie = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: "./lab",
        data: {action: "LAB_LOADLABITEM", LCMS_session: _cookie},
        beforeSend: function (xhr) {
            xhr.overrideMimeType("application/html");
        }
    }).done(function (data) {
        var jsonData = JSON.parse(data);
        console.log(jsonData.webPage);
        if (typeof jsonData.webPage !== 'undefined') {
            jsonData.parent = _parent;
            loadParameters(jsonData);
        } else {
            populateTable(jsonData, "LAB_EDITLABITEM", './lab', $("#labitem-table"), "#labitem-pager", $("#div-grid-wrapper"), "De verschillende producten in het labo.", {});
        }
    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });
}