/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function lab_doLoad(_parent) {
    var _cookie = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: "./lab",
        data: {action: "LAB_LOADLAB", LCMS_session: _cookie},
        beforeSend: function (xhr) {
            xhr.overrideMimeType("application/html");
        }
    }).done(function (data) { 
        var jsonData = JSON.parse(data,_parent);
        jsonData.parent = _parent;
        loadParameters(jsonData);
             // parent.append(data);          
    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });
}