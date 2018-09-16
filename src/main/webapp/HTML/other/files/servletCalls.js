/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

alert("loading files servletCalls");
function files_doBrowse() {
    console.log("uploads load");
    var _cookie = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: "./upload",
        data: {action: "FILE_BROWSE", LCMS_session: _cookie},
        beforeSend: function (xhr) {
            xhr.overrideMimeType("application/html");
        }
    }).done(function (data) {
        var jsonData = JSON.parse(data);
        console.log(jsonData.webPage);
        if (typeof jsonData.webPage !== 'undefined') {
           // jsonData.parent = _parent;
            //loadParameters(jsonData);
        } else {
            populateTable(jsonData, "", './upload', $("#filebrowser-table"), "#filebrowser-pager", $("#div-grid-wrapper"), "Bestanden op de server", {});
        }
    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });
}