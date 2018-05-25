/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function admin_doLoad(_parent) {
    console.log("Loading admin page");
    var _cookie = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: "./admin",
        data: {action: "ADMIN_LOADPAGE", LCMS_session: _cookie},
        beforeSend: function (xhr) {
            xhr.overrideMimeType("application/html");
        }
    }).done(function (data) {
        if (typeof data !== 'undefined') {
            var jsonData = JSON.parse(data, _parent);
            jsonData.parent = _parent;
            loadParameters(jsonData);
        }

    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });
}
