/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function admin_newObject(_metadata) {
    var _cookie = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: "./admin",
        data: {action: "NEWOBJECT", LCMS_session: _cookie, metadata: _metadata},
        beforeSend: function (xhr) {
            xhr.overrideMimeType("application/html");
        }
    }).done(function (data) {
        location.reload();
        // parent.append(data);          
    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });
}


function objects_doLoad(_parent) {
    console.log("Objects load");
    var _cookie = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: "./admin",
        data: {action: "ADMIN_LOADOBJECTS", LCMS_session: _cookie},
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
            populateTable(jsonData, "ADMIN_EDITOBJECTS", './admin', $("#object-table"), "#object-pager", $("#div-grid-object-wrapper"), "Databaseobjecten", {});
        }
    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });
}

function users_doLoad(_parent) {
    console.log("Users load");
    var _cookie = $.cookie('LCMS_session');
    $.ajax({
        method: "POST",
        url: "./admin",
        data: {action: "ADMIN_LOADUSERS", LCMS_session: _cookie},
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
            populateTable(jsonData, "ADMIN_EDITUSERS", './admin', $("#user-table"), "#user-pager", $("#div-grid-user-wrapper"), "Gebruikers in het labo", {});
        }
    }).fail(function (data) {
        alert("Sorry. Server unavailable. ");
    });
}

