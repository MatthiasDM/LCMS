/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function storage_doLoad(_parent) {
    console.log("storage load");
    var _cookie = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: "./lab",
        data: {action: "LAB_LOADSTORAGE", LCMS_session: _cookie},
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
            populateTable(jsonData, "LAB_EDITSTORAGE", './lab', $("#storage-table"), "#storage-pager", $("#div-grid-wrapper"), lang.storage["title"], {});
            generateSVGGrid("storage-grid");
            populateGrid(jsonData, "storage-grid");
        }
    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });
}